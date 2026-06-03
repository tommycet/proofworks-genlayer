# Contributing to ProofWorks

Thank you for your interest in contributing to **ProofWorks**! This document outlines the process for setting up your environment, running tests, and submitting your contributions.

## Setup

To set up the development environment locally:

1. **Clone the Repository**:
   Clone the repository and navigate into the project root:
   ```bash
   git clone https://github.com/tommycet/proofworks-genlayer.git
   cd proofworks-genlayer
   ```

2. **Install Python Dependencies**:
   ProofWorks requires Python dependencies for contract testing and linting. Install them using `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js Dependencies**:
   Install root dependencies and frontend dependencies:
   ```bash
   npm install
   npm --prefix frontend install
   ```

## Running the tests

To verify your changes locally, you can run the test suite using the configured Makefile targets:

- **Run all direct contract tests**:
  ```bash
  make test
  ```
  *(Note: This command runs the Python pytest suite against GenVM direct-mode tests.)*

- **Lint the escrow contract**:
  ```bash
  make lint-contract
  ```

- **Build the frontend production package**:
  ```bash
  npm --prefix frontend run build
  ```

- **Validate all components in one shot** (Tests, Contract Linter, and Frontend build):
  ```bash
  make validate-all
  ```

## Submitting a pull request

When you are ready to submit your changes:

1. **Create a Local Branch**:
   Branch off from the `main` branch with a descriptive name:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Commit Your Changes**:
   Make small, atomic commits with clear commit messages describing your changes.

3. **Validate Your Changes**:
   Ensure all tests and build checks pass successfully by running:
   ```bash
   make validate-all
   ```

4. **Submit the Pull Request**:
   Push your branch to GitHub and open a Pull Request targeting the `main` branch.
