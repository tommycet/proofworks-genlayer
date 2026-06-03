# ProofWorks

A GenLayer escrow contract that pays out GitHub bounties when AI validators agree the work actually got done.

A creator posts a task with acceptance criteria and locks GEN. A worker claims it, submits a pull request, and the contract asks GenLayer validators to read the issue, the PR, and the changed files, then return a structured verdict. If consensus says the work is good, the worker gets paid. If not, the creator gets refunded, or a partial split happens, or the worker is asked for a revision.

That is the whole product in one paragraph. The rest of this README is how it works, how to run it, what is deployed, and what is still in progress.

## Table of contents

1. [Live demo](#live-demo)
2. [Why this needs GenLayer](#why-this-needs-genlayer)
3. [Architecture](#architecture)
4. [Repository layout](#repository-layout)
5. [Feature list](#feature-list)
6. [Contract reference](#contract-reference)
7. [Adjudication: how the AI verdict actually works](#adjudication-how-the-ai-verdict-actually-works)
8. [GitHub URL handling](#github-url-handling)
9. [Escrow and finalization](#escrow-and-finalization)
10. [Running locally](#running-locally)
11. [Testing](#testing)
12. [Deploying](#deploying)
13. [Frontend usage walkthrough](#frontend-usage-walkthrough)
14. [Deployment history](#deployment-history)
15. [Known limitations](#known-limitations)
16. [Roadmap](#roadmap)
17. [Acknowledgements](#acknowledgements)
18. [License](#license)

---

## Live demo

- Frontend (Vercel, primary): https://proofworks-genlayer.vercel.app
- Frontend (GitHub Pages, mirror): https://tommycet.github.io/proofworks-genlayer/
- GitHub proxy API: `https://proofworks-genlayer.vercel.app/api/github?url=<github issue or PR url>`
- Studionet contract (current): `0x541031b4574cDE16c93c2b580Bc1Da763a3efbc7`
- Walkthrough video: https://youtu.be/Z5fGqMQGQR0

The Vercel deployment runs both the frontend and the GitHub proxy as a serverless function on the same origin, so there is no CORS dance and no cold-start sleep. The Pages site is kept as a backup mirror but does not have the proxy attached. The burner wallet panel lets you switch between Creator, Worker, and Juror roles without a real funded account, so the whole flow is testable in a browser tab. If your browser does not have an injected wallet, the read-only view still works.

## Why this needs GenLayer

A normal smart contract cannot answer "does this PR actually fix the issue." That question is subjective, depends on reading code and prose, and would normally need a human reviewer or a centralized backend with an API key.

GenLayer lets the contract itself ask that question. Validators independently fetch the GitHub issue and PR, run an LLM against a structured prompt, and converge on a JSON verdict through Optimistic Democracy consensus. The contract then moves money based on the result. No off-chain server is allowed to influence the verdict, which is the only reason any of this is trustless.

That constraint shaped the whole contract. Every field the LLM returns is bounded (enums, integer ranges, capped string lengths), validated by a deterministic function before being accepted, and wrapped in `<untrusted_user_content>` tags in the prompt to blunt jailbreak attempts. Malformed LLM output causes leader rotation rather than committing bad state.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the full set of Mermaid diagrams (sequence, components, state machine). The short version:

```
Creator → IC.create_task → escrow funded
Worker  → IC.claim_task  → optional stake locked
Worker  → IC.submit_proof(PR URL)
IC      → run_nondet_unsafe → validators fetch GitHub + call LLM
IC      → consensus verdict stored on-chain
IC      → finalize_task → payout / refund / split / revision
```

Three layers are involved on each evaluation:

1. The **Intelligent Contract** (`contracts/proofworks_escrow.py`) stores tasks, holds GEN through its ghost contract, and runs the nondet block that calls the LLM.
2. **Validators with LLMs** independently fetch the GitHub evidence and produce a JSON verdict; a custom validator function rejects malformed output so consensus only commits well-formed verdicts.
3. The **frontend** (React 19 + Vite + `genlayer-js`) reads contract state without a wallet and signs writes when one is connected. A small Node proxy (`server/github-proxy.mjs`) is used only by the UI for previewing GitHub data; the contract itself fetches GitHub directly inside the nondet block, so consensus does not depend on the proxy.

## Repository layout

```
contracts/proofworks_escrow.py     Intelligent Contract (~1.7k lines, single class)
tests/direct/                      89 pytest direct-mode tests, one file per phase
frontend/                          React 19 + Vite + genlayer-js, CRT terminal styling
server/github-proxy.mjs            Authenticated GitHub fetch proxy used by the UI
scripts/                           deploy.ts, schema.ts, deploy-and-test.sh, etc.
docs/architecture.md               Mermaid diagrams: sequence, components, state machine
Makefile                           setup-genvmroot, test, lint-contract, frontend-build
requirements.txt                   genlayer-test, genvm-linter, pytest
package.json                       genlayer-js, tsx, deploy scripts
```

## Feature list

Phases 1 through 9 are implemented and covered by the test suite. In rough order from core to advanced:

- Task lifecycle: create, claim, submit, evaluate, finalize, cancel.
- GitHub issue and PR URL parsing with aggressive normalization so different validators converge on the same canonical API URL.
- AI adjudication returning `{decision, score, payout_percent, confidence, reason, reason_code, missing_requirements, required_revision}`.
- Same-repository check between source issue and submitted PR (prevents fake cross-repo adjudication).
- Escrow finalization with explicit `APPROVED`, `REJECTED`, `PARTIAL`, and `NEEDS_REVISION` paths.
- Revision flow with a `max_revisions` cap.
- Claim expiry: anyone can call `release_expired_claim` to free a stale claim.
- Per-address reputation counters: created, completed, approved, rejected, partial, canceled, GEN earned, paid, refunded.
- Worker staking: creators can require X% collateral on claim; forfeited 50/50 to creator and treasury if the worker does not deliver before expiration.
- Milestones: up to three sub-tasks per bounty, each adjudicated and finalized independently.
- Appeals: losing party posts a bond, three designated jurors vote, 2-of-3 majority decides.
- Flagging window: anyone can stake a small bond to flag an AI verdict before it finalizes, which escalates the case to juror arbitration.
- Team splits and tips: creators can register a team with percentages, payouts auto-distribute, and tips can be sent after finalization.
- Agent-readable task manifest via `get_task_manifest(task_id)` for programmatic clients.

## Contract reference

The main contract class is `ProofWorksEscrow(gl.Contract)`. Key public methods:

| Method | Decorator | Purpose |
|---|---|---|
| `create_task(...)` | `@gl.public.write.payable` | Create a task and lock the sent GEN as escrow. |
| `create_case(...)` | `@gl.public.write.payable` | Phase 6 form for GitHub issue→PR cases. |
| `claim_task(task_id)` | `@gl.public.write.payable` | Claim an open task; pays stake if creator required one. |
| `submit_proof(task_id, proof_url, proof_text)` | `@gl.public.write` | Worker submits the deliverable. |
| `evaluate_task(task_id)` | `@gl.public.write` | Runs the nondet LLM block and stores the verdict. |
| `finalize_task(task_id)` | `@gl.public.write` | Emits external payout/refund transfers per the verdict. |
| `cancel_task(task_id)` | `@gl.public.write` | Creator-only cancellation while still cancellable. |
| `release_expired_claim(task_id)` | `@gl.public.write` | Anyone can free a stale claim past its expiry. |
| `appeal(task_id)` | `@gl.public.write.payable` | Open a jury appeal by posting the bond. |
| `juror_vote(task_id, decision)` | `@gl.public.write` | One of the three jurors casts their vote. |
| `flag_evaluation(task_id)` | `@gl.public.write.payable` | Community member flags a verdict during the window. |
| `tip_worker(task_id)` | `@gl.public.write.payable` | Creator tips the worker after finalization. |
| `register_team(task_id, members, splits)` | `@gl.public.write` | Set up team split before finalization. |
| `get_task(task_id)` | `@gl.public.view` | Returns the full task record. |
| `get_task_count()` | `@gl.public.view` | Total tasks ever created. |
| `get_milestone(task_id, index)` | `@gl.public.view` | One milestone record. |
| `get_escrow_summary()` | `@gl.public.view` | `total_escrowed`, `total_finalized`, `active_escrow`, `contract_balance`. |
| `get_reputation(address)` | `@gl.public.view` | Per-address counters. |
| `get_task_manifest(task_id)` | `@gl.public.view` | Compact JSON manifest for agent consumers. |

Persistent state uses `TreeMap`, `u256`, `u64`, `u32`, and `Address`, with three `@allow_storage @dataclass` records: `Task`, `Milestone`, `Reputation`. No `list`, no `dict`, no unbounded `int` in storage, per GenVM rules.

## Adjudication: how the AI verdict actually works

The verdict path is intentionally narrow. The contract:

1. Validates the proof URL against the evidence type (PR URL parser, issue URL parser, plain text fallback).
2. Inside a leader function, fetches the GitHub PR and the changed files (or the issue, for issue-only sources).
3. Compacts the response into a stable shape (title, body, state, merged, draft, base/head refs, first 20 file diffs with status and additions/deletions, etc.). Volatile fields are dropped on purpose so validators converge.
4. Serializes that compact evidence with sorted JSON keys.
5. Builds the adjudication prompt, wrapping every user-supplied field in `<untrusted_user_content>` tags and prefixing a security mandate.
6. Calls `gl.nondet.exec_prompt(..., response_format="json")` and returns the raw object.
7. Inside the validator function, runs `_is_valid_raw_evaluation(...)` to confirm the result is well-formed before consensus accepts it.

The required JSON shape:

```json
{
  "decision": "APPROVE | REJECT | PARTIAL | NEEDS_REVISION",
  "score": 0,
  "payout_percent": 0,
  "confidence": "LOW | MEDIUM | HIGH",
  "reason": "concise explanation under 1000 chars",
  "reason_code": "SOLVES_ISSUE | UNRELATED_PR | INCOMPLETE_SCOPE | NEEDS_TESTS | NEEDS_REVIEW | AMBIGUOUS | OTHER",
  "missing_requirements": ["..."],
  "required_revision": "non-empty only when decision is NEEDS_REVISION"
}
```

Cross-field rules enforced before the verdict is stored:

- `APPROVE` requires `payout_percent == 100`.
- `REJECT` requires `payout_percent == 0`.
- `PARTIAL` requires `0 < payout_percent < 100`.
- `NEEDS_REVISION` requires `payout_percent == 0` and non-empty `required_revision`.

If the LLM returns something that fails this validator, leader rotation kicks in and the bad output never becomes contract state. That is the main defense against subtle prompt injection or model drift.

## GitHub URL handling

URL normalization is more important than it looks. Different validators must compute the same canonical URL or they cannot agree on what to fetch. The contract accepts these PR forms and reduces them to one:

```
https://github.com/owner/repo/pull/43
http://github.com/owner/repo/pull/43/files
github.com/owner/repo/pull/43?tab=files
[PR](https://github.com/owner/repo/pull/43)
```

Issue URLs follow the same parsing rules. The result is always `https://api.github.com/repos/{owner}/{repo}/{pulls|issues}/{number}`.

For `source_type = GITHUB_ISSUE`, the submitted PR must be in the **same owner/repo** as the source issue. If not, the contract rejects evaluation with `GITHUB_REPO_MISMATCH`. This blocks the obvious abuse where someone funds a task on issue A and submits a totally unrelated PR from another repo.

Invalid inputs that fail outright: GitLab URLs, non-numeric PR numbers, zero PR numbers, malformed paths, issue URLs submitted where a PR is expected.

## Escrow and finalization

`create_task` is payable. The sent GEN is recorded as `reward_amount` and counted in `total_escrowed`. `evaluate_task` does not move money; it only stores the verdict. `finalize_task` is the single place value transfers happen.

| Decision | Worker payout | Creator refund | Final status |
|---|---|---|---|
| `APPROVE` | 100% | 0% | `PAID` |
| `REJECT` | 0% | 100% | `REFUNDED` |
| `PARTIAL` | `payout_percent`% | remainder | `PARTIALLY_PAID` |
| `NEEDS_REVISION` | none | none | cannot finalize |

`finalize_task` requires: task exists, has been evaluated, is not already finalized, has a non-zero reward, has an assigned worker, and the decision is not `NEEDS_REVISION`. `cancel_task` requires sender is creator, task is still `OPEN` or `CLAIMED`, and task is not already finalized.

One detail worth knowing: external value transfers emitted by `finalize_task` execute when the transaction reaches `FINALIZED`, not just `ACCEPTED`. The Studionet smoke test confirmed that `get_escrow_summary().contract_balance` does not drop until the finalize tx is fully finalized and the child transfer transaction has run. The frontend therefore waits for `FINALIZED` on any payout-related write, even though `ACCEPTED` is enough for reading the verdict itself.

## Running locally

Install:

```bash
pip install -r requirements.txt
npm install
npm --prefix frontend install
```

Run the test suite:

```bash
make test
```

You should see `89 passed`. The Makefile target runs `scripts/setup_genvmroot.py` first to pin the GenVM SDK against `.genvmroot` so `genvm-lint` does not chase a moving "latest" asset.

Lint the contract:

```bash
make lint-contract
```

Run the frontend in dev mode:

```bash
npm --prefix frontend run dev
```

The dev server defaults to the Studionet contract address. Override it with `VITE_CONTRACT_ADDRESS=0x...` if you deployed your own.

Validate everything in one shot:

```bash
make validate-all
```

That runs tests, the contract linter, and the frontend production build.

## Testing

The test suite is organized by phase, so each file isolates the behavior added in that phase rather than scattering edge cases across the codebase:

| File | Covers |
|---|---|
| `test_phase1_task_lifecycle.py` | create, claim, submit, cancel, basic getters |
| `test_phase2_adjudication.py` | mocked LLM verdicts, validator function, malformed output rejection |
| `test_phase3_github_evidence.py` | URL parsing, evidence shaping, GitHub API call mocks |
| `test_phase4_escrow_finalization.py` | payout, refund, partial split, finalization safety checks |
| `test_phase6_issue_pr_revision.py` | issue-to-PR matching, same-repo enforcement, revision loop |
| `test_phase7_reputation_manifest_expiry.py` | reputation counters, agent task manifests, claim expiry |
| `test_phase8_milestones.py` | multi-milestone tasks and per-milestone finalization |
| `test_phase9_future_features.py` | staking, appeals, juror voting, flagging window, team splits, tips |

All 89 tests pass in about 3.6 seconds on a clean clone. The mocks intercept the nondet block so the LLM verdict can be set explicitly per test, and a `_gl_call_hook` captures `EthSend` calls so payout assertions work without a real chain.

What tests do not cover yet: real Bradbury LLM consensus, real GitHub rate limiting from validators, and CI/check-run signal as part of the verdict. Those are integration concerns rather than contract concerns.

## Deploying

### Studionet (current default)

The simplest path is the hosted GenLayer Studio:

1. Open https://studio.genlayer.com, connect a wallet, and use the in-Studio faucet to get test GEN.
2. Paste the full contents of `contracts/proofworks_escrow.py` into a new file in Studio.
3. Deploy with no constructor arguments.
4. Verify with `get_task_count()` returning `0` and `get_escrow_summary()` returning all zeros.

For a scripted deployment instead:

```bash
PRIVATE_KEY=0x... NETWORK=studionet npm run deploy:studionet
```

Use a disposable burner key only. Never use a funded mainnet key with these scripts.

### Bradbury (next)

Bradbury is the testnet where real LLM validators run rather than the Studio simulator. Do Studionet first, confirm the full create → submit → evaluate → finalize flow, then:

```bash
PRIVATE_KEY=0x... NETWORK=bradbury npm run deploy:bradbury
```

Fund the wallet at https://testnet-faucet.genlayer.foundation first. The RPC is `https://rpc-bradbury.genlayer.com`. Re-run the same end-to-end flow against the new address with small values.

### Frontend + proxy (Vercel, primary)

The whole frontend and the GitHub proxy ship together as one Vercel project. The proxy lives at `frontend/api/github.mjs` and is built as a serverless function automatically. There is no separate backend to host or keep awake.

Config is in `frontend/vercel.json`. Two env vars are required on the Vercel project:

| Variable | Where used | Example |
|---|---|---|
| `GITHUB_TOKEN` | Server-side, by the proxy function | A fine-grained PAT with public-repo read access |
| `VITE_CONTRACT_ADDRESS` | Build-time, baked into the static bundle | `0x541031b4574cDE16c93c2b580Bc1Da763a3efbc7` |

Deploy from the `frontend/` directory:

```bash
cd frontend
npm install -g vercel        # one time
vercel link                  # link to the project once
vercel --prod                # ship to production
```

The result is one URL serving both the SPA and `/api/github`, on the same origin, so there is no CORS to manage.

### Frontend (GitHub Pages, mirror)

The Pages build is kept as a backup mirror in case the Vercel project is ever down or rate-limited. It deploys via a `gh-pages` branch rather than a GitHub Actions workflow, because fine-grained PATs need the special `workflow` permission to push workflow files.

Build for Pages:

```bash
GITHUB_PAGES=true VITE_CONTRACT_ADDRESS=0x541031b4574cDE16c93c2b580Bc1Da763a3efbc7 \
  npm --prefix frontend run build
```

Then push the contents of `frontend/dist` to the `gh-pages` branch (the helper script `scripts/deploy-gh-pages.sh` does this). `GITHUB_PAGES=true` sets the Vite base path to `/proofworks-genlayer/`. Pages should be configured to serve from `gh-pages` at the `/` root. The Pages build does not include the GitHub proxy; the UI falls back to the unauthenticated GitHub API and the Jina reader proxy in that environment.

## Frontend usage walkthrough

This is the path that produces the cleanest demo and exercises every phase.

**1. Open the site.** Either the Pages URL or the local dev server. The top bar shows the active contract address and the escrow summary. The docket lists existing tasks. None of this needs a wallet.

**2. Connect a wallet, or use burners.** Click `Connect wallet` if you have MetaMask or a similar provider; approve adding Studionet if prompted. Or click `Use free burners` and switch between Creator / Worker / Juror roles in the panel. Burner mode does not need a faucet.

**3. Create a smoke task.** In `Create escrow case` enter something minimal:

```
Title:               Frontend smoke oath
Description:         Test the ProofWorks frontend flow.
Acceptance criteria: The proof text must say done.
Evidence:            TEXT_SUBMISSION
Reward:              1
```

Click `Seal new case`. The transaction wire waits for `ACCEPTED`, the docket refreshes, and the new task appears as `OPEN` with `reward_amount: 1`.

**4. Submit proof.** Switch to the Worker burner (the contract rejects self-submission on an open task you created). Select the task and submit `done` as proof text. The task moves to `SUBMITTED`.

**5. Run the AI jury.** Click `Run AI jury`. After `ACCEPTED`, the verdict panel populates with decision, score, payout percent, confidence, and reason. For `done` vs `The proof text must say done`, you typically get `APPROVE`, `score ≈ 100`, `payout_percent 100`.

**6. Finalize.** Click `Finalize payout`. The UI waits for `FINALIZED` here on purpose, not just `ACCEPTED`. After finalization, status becomes `PAID`, `active_escrow` decreases, and `contract_balance` reflects the external transfer.

**7. Try a real GitHub PR task.** Create another task with `Evidence: GITHUB_PR` and an acceptance criterion like `The PR must update README.md`. Submit a real public PR URL as proof. The contract will parse the URL, fetch the PR and its files, and run the same verdict pipeline against actual GitHub evidence.

**8. Try the issue-to-PR flow (Phase 6).** Use `Evidence: GITHUB_PR` with `source_type: GITHUB_ISSUE` and a `source_url` pointing to an issue. The submitted PR must be in the same owner/repo. If you point it at a different repo, evaluation fails with `GITHUB_REPO_MISMATCH`.

**9. Try cancellation.** Create a task and do not submit proof. Click `Cancel + refund`. The task becomes `CANCELED`, `finalized` becomes `true`, and `creator_refund` equals the reward. The UI waits for `FINALIZED`.

If something fails, the useful things to capture for a bug report are the task ID, the transaction hash, which step failed, the error from the wire, and whether the tx reached `ACCEPTED` or `FINALIZED`.

## Deployment history

Useful reference points for anyone retracing the work.

**Phase 4 Studionet smoke test (2026-05-29)**
- Contract: `0xC57dEa38AeDA667985a8A8A95002c7D3ad063E08`
- Deploy tx: `0x7be849bd8534717164abcc421b60ea3cdad25f6596fb43ec541b563c85401e9c`
- Full create → submit → evaluate → finalize with verdict `APPROVE` and `worker_payout: 1`.
- Confirmed that `contract_balance` only drops when finalize reaches `FINALIZED`, not at `ACCEPTED`. The child transfer transaction `0x844796e4db7fefaaefe6fb61f1829b713f226084665bc009d3a735980452afcd` ran after finalization. This is why the frontend now distinguishes the two states on payout flows.

**Phase 6 Studionet deployment (2026-05-30)**
- Contract: `0xB9B31ABA945D9056e71d53CB4E2c71090D3FaA57`
- Deploy tx: `0x9a17a565da2098abf93ed49dd6bd0c6faf27bbe2c10682aeabca4f4bac16697d`
- Verified the issue-to-PR flow with `source` `https://github.com/tommycet/proofworks-genlayer/issues/2` and proof `https://github.com/tommycet/proofworks-genlayer/pull/3`. Verdict `APPROVE / SOLVES_ISSUE / HIGH`, finalized as `PAID`.

**Phase 9 Studionet deployment (2026-06-01, current live address)**
- Contract: `0x541031b4574cDE16c93c2b580Bc1Da763a3efbc7`
- Deploy tx: `0xc569561cbd1a88aab69ac3d00a522e07d01139f04993e15d2d5b1c15f622a01f`
- Smoke test: created task #1, evaluated to APPROVE / score 100 / payout 100 / HIGH / SOLVES_ISSUE, finalized to PAID with 1000 wei to worker. Full transcript in `scripts/smoke-test.ts`.

**Phase 7 Studionet deployment (2026-05-30, superseded)**
- Contract: `0x5E992bBc2De02C3878d2623A7C3bEc9603aB651A`
- Deploy tx: `0xca2ca4afde4c4ce3f666c40c219784f4fcc7ec664ceb40db7f18c939a9bc8b00`
- Added `release_expired_claim`, `get_reputation`, `get_task_manifest`, same-repo enforcement, reputation updates throughout the lifecycle.

The current Phase 9 contract reuses the Phase 7 address since upgrades have been compatible; if you re-deploy, update `VITE_CONTRACT_ADDRESS` accordingly.

## Known limitations

Honest list, not a roadmap.

- Bradbury deployment has not happened yet. Until it does, the AI consensus path is exercised against the Studio simulator only.
- The frontend has no task search/filter, no persisted local activity history across refreshes, and no explicit child-transaction display after finalization.
- CI / check-run status is not part of the GitHub evidence the verdict sees.
- Large PR diffs are intentionally not fetched; only the first 20 changed-file summaries are included.
- The UI is wired to Studionet by default; a network selector is not in yet.
- GitHub PR evaluation depends on GenLayer validators being able to reach the public GitHub API.
- The contract has not been audited.

## Roadmap

Short list of what comes next, roughly in priority order:

1. Deploy to Bradbury and re-run the end-to-end flow against real LLM validators.
2. Record and link a short demo video at the top of this README.
3. Indexer or subgraph so the UI does not have to read tasks one by one.
4. CLI for AI agents to create and submit tasks programmatically.
5. Lightweight audit pass on the contract before mainnet.
6. Network selector in the UI (Studionet vs Bradbury).
7. Child-transaction visibility in the transaction console after finalization.

## Acknowledgements

Built on GenLayer's Intelligent Contracts and the `genlayer-js` SDK. The contract design follows the GenLayer best-practice pattern of pairing a leader function with a custom validator function rather than relying on string equality, which works well for adjudication where outputs vary but their shape does not.

## License

Not yet specified. An explicit license will be added before mainnet.
