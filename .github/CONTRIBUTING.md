# CONTRIBUTING Guideline . . .

Thank you for your interest in contributing to **SyntaxForge**!  
We’re thrilled that you want to help make this project better. Whether you’re fixing a typo, improving documentation, reporting a bug, or implementing a new feature — every contribution counts.

This guide explains how to contribute effectively, understand the codebase, and collaborate with others.  


## Table of Contents

1. [Before You Start](#before-you-start)
2. [Ways to Contribute](#ways-to-contribute)
3. [Setting Up Your Development Environment](#setting-up-your-development-environment)
4. [Creating Issues](#creating-issues)
5. [Making Code Changes](#making-code-changes)
6. [Creating a Pull Request](#creating-a-pull-request)
7. [Navigating Reviews and Feedback](#navigating-reviews-and-feedback)
8. [Coding Guidelines](#coding-guidelines)
9. [Commit and Branch Naming](#commit-and-branch-naming)
10. [Hacktoberfest Participation](#hacktoberfest-participation)
11. [Communication and Support](#communication-and-support)
12. [Code of Conduct](#code-of-conduct)

## Before You Start

1. Review open issues to check if your problem or feature request already exists.
2. Read the [Code of Conduct](CODE_OF_CONDUCT.md) — respectful communication is essential.
3. Check the project’s documentation or `README.md` to understand its goals and structure.
4. If you’re new, start with issues labeled **`good first issue`** or **`help wanted`**.


## Ways to Contribute

* **Bug Reports:** Identify and describe issues you encounter.
* **Feature Requests:** Suggest improvements or new functionality.
* **Documentation:** Help clarify instructions, fix typos, or add examples.
* **Code Contributions:** Add new features, fix bugs, or improve performance.
    


## Setting Up Your Development Environment 

### Prerequisites

* Node.js (LTS version recommended, e.g., 18.x or 20.x)
* npm (comes with Node.js) or Yarn / pnpm depending on preference
* Git for version control

### Steps

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/<your-username>/SyntaxForge.git
   cd SyntaxForge
   ```

2. **Set upstream remote (optional but recommended)**

   ```bash
   git remote add upstream https://github.com/ethanillingsworth/SyntaxForge.git
   git fetch upstream
   git pull upstream main
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run in development mode**

   ```bash
   npm run serve
   ```

   This uses `webpack serve` to start a development server with live reload.

5. **Build for production**

   ```bash
   npm run build
   ```

   This runs `webpack` to bundle the project for deployment.

6. **Generate documentation**

   ```bash
   npm run docs
   ```

   This uses `jsdoc` with the configuration in `jsdoc.json` to generate project documentation.

> Note: Ensure Node.js is compatible with the version required by Webpack and other packages.


## Creating Issues

Issues are used to track bugs, feature requests, and general discussions. Before creating one, please ensure it doesn’t already exist.

### Step 1: Fork and Set Up the Repository

If you want to contribute code or suggest detailed improvements, first **fork** the repository:

```bash
git clone https://github.com/<your-username>/SyntaxForge.git
cd SyntaxForge
```

Then, set the original project as a remote:

```bash
git remote add upstream https://github.com/ethanillingsworth/SyntaxForge.git
```

Pull the latest updates:

```bash
git pull upstream main
```

This ensures you’re always working on the latest version.

### Step 2: Open a New Issue

1. Go to the **Issues** tab in the main repository.
2. Click **New Issue**.
3. Select the appropriate template (Bug Report, Feature Request, or General Discussion).
4. Fill in the details:

   * **Title:** Concise and descriptive.
   * **Description:** Explain the issue clearly.
   * **Steps to Reproduce:** For bugs, list how to trigger the issue.
   * **Expected vs. Actual Behavior:** State what should happen versus what actually happens.
   * **Environment Details:** Include OS, browser, and version numbers.
   * **Proposed Fix/Idea:** If you have one, describe your approach.

Example issue format:

```markdown
### Description
A concise summary of the problem or feature.

### Steps to Reproduce
1. Step one...
2. Step two...

### Expected Behavior
Describe what should happen.

### Actual Behavior
Describe what happens instead.

### Environment
- OS: Windows 11
- Node: 20.5.0
- Browser: Chrome 129

### Additional Context
Add any other information or possible solution ideas here.
```

### Step 3: Link Your Fork (Optional)

If you intend to work on fixing or implementing your issue, mention that you’ve forked the repo and will submit a PR. Example comment:

> I’ve forked the repo and started working on a fix for this issue. Will open a PR soon!

This helps avoid duplicate work and encourages collaboration.

---

## Making Code Changes

When contributing code:

1. Create a new branch from `main`:

   ```bash
   git checkout -b feat/new-feature
   ```
2. Make your changes with clear commit messages.
3. Test your changes thoroughly.
4. Run linting/formatting tools if available.
5. Push your branch to your fork.

## Creating a Pull Request

A **Pull Request (PR)** is how your changes are merged into the main project.

### Steps:

1. Go to your fork on GitHub.
2. Click **Compare & pull request**.
3. Fill out the PR template, explaining:

   * What you changed and why.
   * Related issue number (e.g., “Fixes #42”).
   * Steps to test or verify your changes.
4. Keep PRs focused — one feature or fix per PR.

### PR Best Practices:

* Reference issues using keywords like `Fixes`, `Closes`, or `Resolves`.
* Include screenshots or logs if it helps explain your work.
* Be patient — maintainers may request clarifications or changes.

## Navigating Reviews and Feedback

* **Be open-minded:** Reviews are about improving code quality, not personal criticism.
* **Respond politely:** Explain your reasoning if you disagree.
* **Make requested changes:** Push updates to the same branch; they’ll automatically appear in the PR.
* **Celebrate when merged:** `🎉 Your contribution just made SyntaxForge better!`

## Coding Guidelines

* Follow existing code styles and linting rules.
* Keep code modular and well-documented.
* Write descriptive comments where necessary.
* Add or update tests for new features.
* Avoid introducing unnecessary dependencies.

## Commit and Branch Naming

**Branch names:**

* `fix/issue-123`
* `feat/add-search`
* `docs/update-guide`

**Commit messages:**

* Use present-tense verbs: `Add`, `Fix`, `Refactor`.
* Keep concise but descriptive: `Fix bug in form validation`.

## Hacktoberfest Participation

We welcome Hacktoberfest contributions! To make your PRs count:

* Look for issues labeled `hacktoberfest` or `good first issue`.
* Follow this guide closely.
* Avoid spammy or low-quality PRs.

Quality, collaboration, and learning are key.

## Communication and Support

For help or discussions:

* Open a **Discussion** or comment under an issue.
* Be respectful and inclusive — we all learn at different paces.

## Code of Conduct

All participants are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).  
By contributing, you help foster a welcoming and supportive open-source community.

---  


**Thank you for helping make SyntaxForge better!**  
Every contribution, no matter how small, helps strengthen the project and community.
