# Phase 6 Same-Repository Smoke Note

ProofWorks Phase 6 evaluates a GitHub issue source against a GitHub PR proof from the same repository.

During adjudication, the contract independently fetches the source issue, submitted PR metadata, and changed files. The AI jury then records a structured verdict with `reason_code` and `missing_requirements`, which the frontend displays in the Evidence Room.
