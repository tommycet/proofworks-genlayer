# Contributing to ProofWorks GenLayer

Thank you for your interest in contributing to ProofWorks! We welcome community contributions. Please follow this guide to set up your environment, run tests, and submit your pull requests.

## Setup

To set up the development environment, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tommycet/proofworks-genlayer.git
   cd proofworks-genlayer
   ```

2. **Install Python dependencies:**
   Make sure you have Python 3.10+ installed. Create a virtual environment and install the required dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Install Frontend dependencies:**
   Install Node.js dependencies for the React/Vite frontend application:
   ```bash
   make frontend-install
   ```

## Running the tests

Before submitting any changes, you must ensure that all test suites pass.

To run the full backend and contract test suite, execute the following command:
```bash
make test
```

This will automatically initialize the local `GenVM` root files and run `pytest`.

To run all linting checks and contract validations:
```bash
make lint
```

To run a full validation (tests, contract linter, and frontend build):
```bash
make validate-all
```

## Submitting a pull request

Please adhere to the following workflow when submitting your changes:

1. **Create a branch:**
   Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit your changes:**
   Write clean code and clear commit messages. Make sure to run all validation checks locally using `make validate-all` before committing.

3. **Push and open a PR:**
   Push your branch to the repository and create a new pull request targeting the `master` branch. Ensure that your PR description clearly explains the changes made and references any related issues.
