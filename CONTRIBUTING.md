# Contributing to ProofWorks

## Setup

1. Clone the repository and install Python dependencies:

```bash
git clone https://github.com/tommycet/proofworks-genlayer.git
cd proofworks-genlayer
pip install -r requirements.txt
```

2. Install frontend dependencies:

```bash
npm --prefix frontend install
```

3. Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

## Running the tests

The test suite uses pytest and requires the GenVM runtime to be available. Run the full suite with:

```bash
make test
```

This command runs `python scripts/setup_genvmroot.py` to initialise the GenVM environment and then executes `pytest -q` against the tests in `tests/direct/`.

To run a single test file during development:

```bash
pytest tests/direct/<file>.py -q
```

## Submitting a pull request

1. Fork the repository and create a branch from `main`:

```bash
git checkout -b your-feature-name
```

2. Make your changes. Keep commits focused — one logical change per commit.

3. Ensure the tests pass before opening a PR:

```bash
make test
```

4. Push your branch to your fork and open a pull request against `tommycet/proofworks-genlayer`. Fill in the PR description with what changed and why.

5. A maintainer will review your PR. Address any requested changes and push additional commits to the same branch.
