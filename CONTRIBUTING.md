# Contributing to ProofWorks

Thank you for your interest in contributing to ProofWorks! This document explains how to set up your environment, run the tests, and submit a pull request.

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tommycet/proofworks-genlayer.git
   cd proofworks-genlayer
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your GenLayer RPC URL and private key
   ```

5. **Verify the setup:**
   ```bash
   make test
   ```

## Running the Tests

The project uses `pytest` for Python tests and `make test` as the single entry point for all tests.

```bash
make test
```

This will run all Python tests under `tests/` and report any failures.

To run only the Python tests directly:

```bash
pytest tests/
```

## Submitting a Pull Request

1. **Create a feature branch:**
   ```bash
   git checkout -b fix/your-fix-description
   ```

2. **Make your changes.** Keep them focused on a single issue.

3. **Run the tests:**
   ```bash
   make test
   ```

4. **Commit with a clear message:**
   ```bash
   git commit -m "fix: description of your fix (fixes #ISSUE)"
   ```

5. **Push and open a PR:**
   ```bash
   git push origin fix/your-fix-description
   ```
   Then open a pull request on GitHub.

6. **Reference the issue** in your PR body using `Fixes #N` or `Closes #N`.

### PR Checklist

- [ ] PR references exactly one issue number
- [ ] Changes are minimal and focused
- [ ] No unrelated changes
- [ ] Tests pass (`make test`)
