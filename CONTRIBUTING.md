## Setup
Clone the repo and install the dependencies from the project root. A working Python 3.11+ and Node 20+ environment is required.

```bash
pip install -r requirements.txt
npm install
npm --prefix frontend install
```

## Running the tests
To run the automated test suite, use the following command:

```bash
make test
```

It is also highly recommended to run the contract static checker before submitting a PR:

```bash
make lint-contract
```

## Submitting a pull request
1. Fork the repository (if not working in the main repository).
2. Create your feature branch.
3. Make sure `make test` passes locally.
4. Push to your branch and open a pull request.
