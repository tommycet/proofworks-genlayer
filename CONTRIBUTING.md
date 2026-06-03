# Contributing to ProofWorks

Thank you for considering contributing to ProofWorks! This document explains how to set up your environment, run tests, and submit a pull request.

## Setup

### Prerequisites

- **Node.js** v18 or later
- **Python** 3.10 or later
- **npm** (comes with Node.js)

### Installation

1. Fork and clone the repository:
   ```
   git clone https://github.com/YOUR_USERNAME/proofworks-genlayer.git
   cd proofworks-genlayer
   ```
2. Install JavaScript dependencies: `npm install`
3. Install Python dependencies: `pip install -r requirements.txt`
4. Copy the environment file: `cp .env.example .env`

## Running the tests

Run the full test suite with:
```
make test
```

Run individual test files:
```
python -m pytest tests/test_file.py -v
```

For frontend tests:
```
npm test
```

## Submitting a pull request

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes and commit: `git add . && git commit -m "type: description"`
3. Push: `git push origin feat/your-feature`
4. Open a PR against the `main` branch
5. Include a summary of changes, related issue number, and testing performed
6. Respond to review feedback
