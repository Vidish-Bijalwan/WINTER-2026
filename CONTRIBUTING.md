# Contributing to TopoShape Insights

First off, thank you for considering contributing to TopoShape Insights! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs** if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript/JavaScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code based on the Documentation Styleguide
* End all files with a newline

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/Vidish-Bijalwan/WINTER-2026.git
   cd WINTER-2026
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && pip install -r requirements.txt
   ```

3. **Start development servers**
   ```bash
   # Frontend
   npm run dev
   
   # Backend (in another terminal)
   cd backend && python main.py
   ```

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security

### TypeScript Styleguide

* Use TypeScript for all new code
* Prefer `const` over `let`, avoid `var`
* Use meaningful variable names
* Add types for function parameters and return values
* Use interfaces for object shapes
* Follow the existing code style (we use Prettier for formatting)

### Documentation Styleguide

* Use [Markdown](https://guides.github.com/features/mastering-markdown/)
* Reference functions and classes in backticks: \`functionName()\`
* Use code blocks with language specification

## Project Structure

```
WINTER-2026/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utility functions
│   └── hooks/             # Custom React hooks
├── backend/               # Python backend
│   ├── core/              # Core TDA algorithms
│   └── tests/             # Backend tests
├── docs/                  # Documentation
└── public/                # Static assets
```

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Aim for high code coverage

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend && pytest
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
