# Contributing to proofworks-genlayer

## Setup

1. **Prerequisites**: Node.js 18+, Python 3.10+, and a GenLayer RPC endpoint.
2. **Clone the repository**:
   ```sh
   git clone https://github.com/tommycet/proofworks-genlayer.git
   cd proofworks-genlayer
   ```
3. **Install dependencies**:
   ```sh
   npm install
   ```
4. **Configure environment**: Copy `.env.example` to `.env` and fill in your GenLayer RPC URL and other required values:
   ```sh
   cp .env.example .env
   ```

## Running the tests

Run the test suite with:

```sh
make test
```

This executes the project's Python and JavaScript test suites. Individual test files can also be run directly:

```sh
# Run Python tests
pytest tests/

# Run JavaScript tests
node --experimental-vm-modules test_studionet.js
```

## Submitting a pull request

1. **Create a feature branch** from `main`:
   ```sh
   git checkout -b my-feature-branch
   ```
2. **Make your changes** and commit them with clear, descriptive messages.
3. **Ensure tests pass** by running `make test`.
4. **Push your branch** and open a pull request:
   ```sh
   git push origin my-feature-branch
   ```
   Then visit the repository on GitHub and click "New pull request."
5. **In the PR description**, explain what your change does and why it's needed.
6. A maintainer will review your PR. Please address any feedback promptly.
