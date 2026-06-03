import { createAccount, createClient, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

const CONTRACT = (process.env.CONTRACT_ADDRESS ?? "0x541031b4574cDE16c93c2b580Bc1Da763a3efbc7") as `0x${string}`;
const RPC = "https://studio.genlayer.com/api";

const creatorPk = (process.env.CREATOR_PK ?? generatePrivateKey()) as `0x${string}`;
const workerPk  = (process.env.WORKER_PK  ?? generatePrivateKey()) as `0x${string}`;

const creator = createAccount(creatorPk);
const worker  = createAccount(workerPk);

const creatorClient = createClient({ chain: studionet, account: creator });
const workerClient  = createClient({ chain: studionet, account: worker });
const readClient    = createClient({ chain: studionet });

async function fundAccount(addr: string, amount = 5_000_000_000_000_000_000n) {
  const body = {
    jsonrpc: "2.0",
    method: "sim_fundAccount",
    params: [addr, Number(amount)],
    id: 1,
  };
  const res = await fetch(RPC, { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify(body) });
  const j = await res.json();
  console.log("    funded", addr, "->", j.result?.slice(0, 18) ?? j.error?.message);
}

async function waitAccepted(client: any, hash: any, label: string) {
  console.log(`    waiting ACCEPTED for ${label}...`);
  const r: any = await client.waitForTransactionReceipt({ hash, status: TransactionStatus.ACCEPTED, retries: 80, interval: 3000 });
  console.log(`    ${label} -> ${r?.status_name ?? r?.statusName ?? "OK"}`);
  return r;
}

async function waitFinalized(client: any, hash: any, label: string) {
  console.log(`    waiting FINALIZED for ${label}...`);
  const r: any = await client.waitForTransactionReceipt({ hash, status: TransactionStatus.FINALIZED, retries: 120, interval: 3000 });
  console.log(`    ${label} -> ${r?.status_name ?? r?.statusName ?? "OK"}`);
  return r;
}

async function readTask(taskId: number) {
  return await readClient.readContract({ address: CONTRACT, functionName: "get_task", args: [taskId] });
}

async function readSummary() {
  return await readClient.readContract({ address: CONTRACT, functionName: "get_escrow_summary", args: [] });
}

async function readCount() {
  return Number(await readClient.readContract({ address: CONTRACT, functionName: "get_task_count", args: [] }));
}

async function main() {
  console.log("=================================================");
  console.log("ProofWorks Phase 9 contract smoke test");
  console.log("=================================================");
  console.log("Contract:", CONTRACT);
  console.log("Creator: ", creator.address);
  console.log("Worker:  ", worker.address);
  console.log("");

  console.log("[1/8] fund creator + worker via sim_fundAccount");
  await fundAccount(creator.address);
  await fundAccount(worker.address);

  console.log("\n[2/8] read get_task_count()");
  const beforeCount = await readCount();
  console.log("    count =", beforeCount);
  const beforeSummary: any = await readSummary();
  console.log("    summary =", JSON.stringify(beforeSummary));

  console.log("\n[3/8] create_case (10 args, Phase 9 signature)");
  const createHash = await creatorClient.writeContract({
    address: CONTRACT,
    functionName: "create_case",
    args: [
      "Add an MIT LICENSE file at the repository root",
      "The repo currently has no top-level license file.",
      "PR must add a LICENSE file at the repo root with the standard MIT License text, copyright line referencing year 2026 and holder tommycet, and come from the same repo.",
      "GITHUB_ISSUE",
      "https://github.com/tommycet/proofworks-genlayer/issues/45",
      "GITHUB_PR",
      0,    // deadline
      "",   // assigned_worker (open)
      2,    // max_revisions
      0,    // required_stake_percent
    ],
    value: 1000n,
  });
  await waitAccepted(creatorClient, createHash, "create_case");

  const taskId = await readCount();
  console.log("    new task id =", taskId);
  const t1: any = await readTask(taskId);
  console.log("    status     =", t1.status);
  console.log("    creator    =", t1.creator);
  console.log("    reward     =", String(t1.reward_amount));

  console.log("\n[4/8] worker claims (no stake)");
  const claimHash = await workerClient.writeContract({
    address: CONTRACT,
    functionName: "claim_task",
    args: [taskId],
    value: 0n,
  });
  await waitAccepted(workerClient, claimHash, "claim_task");
  const t2: any = await readTask(taskId);
  console.log("    status =", t2.status, "worker =", t2.assigned_worker);

  console.log("\n[5/8] worker submits proof");
  const submitHash = await workerClient.writeContract({
    address: CONTRACT,
    functionName: "submit_proof",
    args: [taskId, "https://github.com/tommycet/proofworks-genlayer/pull/46", "Submitted PR #46 to satisfy the issue."],
    value: 0n,
  });
  await waitAccepted(workerClient, submitHash, "submit_proof");
  const t3: any = await readTask(taskId);
  console.log("    status =", t3.status);

  console.log("\n[6/8] evaluate_task (calls real LLM consensus)");
  const evalHash = await workerClient.writeContract({
    address: CONTRACT,
    functionName: "evaluate_task",
    args: [taskId],
    value: 0n,
  });
  await waitAccepted(workerClient, evalHash, "evaluate_task");
  const t4: any = await readTask(taskId);
  console.log("    status         =", t4.status);
  console.log("    decision       =", t4.decision);
  console.log("    score          =", String(t4.score));
  console.log("    payout_percent =", String(t4.payout_percent));
  console.log("    confidence     =", t4.confidence);
  console.log("    reason         =", String(t4.reason).slice(0, 200));
  console.log("    reason_code    =", t4.reason_code);

  console.log("\n[7/8] finalize_task");
  if (t4.decision === "NEEDS_REVISION") {
    console.log("    LLM asked for revision; skipping finalize for this smoke run.");
  } else {
    const finHash = await creatorClient.writeContract({
      address: CONTRACT,
      functionName: "finalize_task",
      args: [taskId],
      value: 0n,
    });
    await waitFinalized(creatorClient, finHash, "finalize_task");
    const t5: any = await readTask(taskId);
    console.log("    status        =", t5.status);
    console.log("    worker_payout =", String(t5.worker_payout));
    console.log("    creator_refund=", String(t5.creator_refund));
  }

  console.log("\n[8/8] final summary");
  const final: any = await readSummary();
  console.log("   ", JSON.stringify(final));

  console.log("\n✅ Smoke test complete");
  console.log("CREATOR_PK=" + creatorPk);
  console.log("WORKER_PK=" + workerPk);
}

main().catch((err) => {
  console.error("❌ Smoke test failed:", err);
  process.exit(1);
});
