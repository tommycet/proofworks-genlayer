# Contributing to ProofWorks

Thank you for your interest in contributing to ProofWorks! This guide will help you get started.

## Setup

1. Fork this repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/proofworks-genlayer.git
   cd proofworks-genlayer
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Install Node.js dependencies:

   ```bash
   npm install
   ```

4. Install frontend dependencies:

   ```bash
   npm --prefix frontend install
   ```

## Running the tests

Run the full test suite with:

```bash
make test
```

This will set up the GenVM root and then run all pytest tests. You should see all tests passing.

To run the contract linter:

```bash
make lint-contract
```

To run tests, linter, and frontend build all together:

```bash
make validate-all
```

## Submitting a pull request

1. Create a new branch from `main` for your changes:

   ```bash
   git checkout -b your-branch-name
   ```

2. Make your changes and commit them with a clear message describing what you did and why.

3. Push your branch to your fork:

   ```bash
   git push origin your-branch-name
   ```

4. Open a pull request against the `main` branch of this repository. In your PR description, explain the motivation for the change and reference any related issues.

5. Make sure all tests pass before requesting review. Run `make validate-all` locally to verify.

6. Wait for a review. Address any feedback by pushing additional commits to your branch.
