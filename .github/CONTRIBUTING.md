# Contributing to SyntaxForge

Thank you for your interest in contributing to SyntaxForge! 🎉

We're thrilled that you want to help make this project better. Whether you're fixing a typo, improving documentation, reporting a bug, or implementing a new feature — every contribution counts.

This guide explains how to contribute effectively, understand the codebase, and collaborate with others.

## Table of Contents

- [Before You Start](#before-you-start)
- [Ways to Contribute](#ways-to-contribute)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Creating Issues](#creating-issues)
- [Making Code Changes](#making-code-changes)
- [Creating a Pull Request](#creating-a-pull-request)
- [Navigating Reviews and Feedback](#navigating-reviews-and-feedback)
- [Coding Guidelines](#coding-guidelines)
- [Commit and Branch Naming](#commit-and-branch-naming)
- [Hacktoberfest Participation](#hacktoberfest-participation)
- [Communication and Support](#communication-and-support)
- [Code of Conduct](#code-of-conduct)

## Before You Start

1. **Review open issues** to check if your problem or feature request already exists
2. **Read the [Code of Conduct](CODE_OF_CONDUCT.md)** — respectful communication is essential
3. **Check the project's documentation** or README.md to understand its goals and structure
4. **If you're new**, start with issues labeled `good first issue` or `help wanted`

## Ways to Contribute

### 🐛 Bug Reports
- Identify and describe issues you encounter
- Provide clear steps to reproduce
- Include environment details (OS, browser, Node version)

### 💡 Feature Requests
- Suggest improvements or new functionality
- Explain the use case and benefits
- Consider implementation complexity

### 📚 Documentation
- Help clarify instructions, fix typos, or add examples
- Improve code comments and JSDoc documentation
- Create tutorials or guides for new users

### 💻 Code Contributions
- Add new features, fix bugs, or improve performance
- Optimize existing code
- Add tests and improve test coverage

### 🎨 Design & UX
- Improve the user interface and user experience
- Create or improve graphics and icons
- Ensure mobile responsiveness

## Setting Up Your Development Environment

### Prerequisites

- **Node.js** (LTS version recommended, e.g., 18.x or 20.x)
- **npm** (comes with Node.js) or **Yarn** / **pnpm** depending on preference
- **Git** for version control
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Steps

#### 1. Fork and Clone the Repository

```bash
git clone https://github.com/<your-username>/SyntaxForge.git
cd SyntaxForge
```

#### 2. Set Upstream Remote (Recommended)

```bash
git remote add upstream https://github.com/ethanillingsworth/SyntaxForge.git
git fetch upstream
git pull upstream main
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Run in Development Mode

```bash
npm run serve
```

This uses webpack serve to start a development server with live reload, typically at `http://localhost:8080`.

#### 5. Build for Production

```bash
npm run build
```

This runs webpack to bundle the project for deployment.

#### 6. Generate Documentation

```bash
npm run docs
```

This uses jsdoc with the configuration in `jsdoc.json` to generate project documentation.

> **Note**: Ensure Node.js is compatible with the version required by Webpack and other packages.

## Creating Issues

Issues are used to track bugs, feature requests, and general discussions. Before creating one, please ensure it doesn't already exist.

### Step 1: Check Existing Issues

- Search through [open issues](https://github.com/ethanillingsworth/SyntaxForge/issues)
- Check if your issue has already been reported
- Look for similar issues that might be related

### Step 2: Open a New Issue

1. Go to the [Issues tab](https://github.com/ethanillingsworth/SyntaxForge/issues) in the main repository
2. Click **New Issue**
3. Select the appropriate template (Bug Report, Feature Request, or General Discussion)
4. Fill in the details:

#### Issue Template Example:

```markdown
### Description
A concise summary of the problem or feature.

### Steps to Reproduce (for bugs)
1. Step one...
2. Step two...
3. Step three...

### Expected Behavior
Describe what should happen.

### Actual Behavior
Describe what happens instead.

### Environment
- OS: Windows 11 / macOS 13 / Ubuntu 22.04
- Node: 20.5.0
- Browser: Chrome 129 / Firefox 118 / Safari 16
- Screen Resolution: 1920x1080 (if relevant)

### Additional Context
Add any other information, screenshots, or possible solution ideas here.
```

### Step 3: Link Your Fork (Optional)

If you intend to work on fixing or implementing your issue, mention that you've forked the repo and will submit a PR:

```markdown
I've forked the repo and started working on a fix for this issue. Will open a PR soon!
```

This helps avoid duplicate work and encourages collaboration.

##Unassignment Policy for Inactive Contributors

 ###To ensure active contribution and fair opportunities for everyone:

  If a contributor is inactive for 7 days after being assigned to an issue (no PR, no progress updates, or no communication),
  the maintainer may unassign them from that issue.

  This allows new contributors to take over and prevents issues from becoming stale.

  If you need more time, please comment on the issue to request an extension.

  Reassignments are always done respectfully and transparently.

 Reason: This policy helps maintain a healthy workflow, encourages consistent participation, and ensures that issues don’t remain blocked during events like Hacktoberfest.

## Making Code Changes

### 1. Create a New Branch

```bash
git checkout -b feat/new-feature
# or
git checkout -b fix/issue-123
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run the development server
npm run serve

# Test in multiple browsers
# Test on different screen sizes
# Test with different Node versions (if applicable)
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "Add: descriptive commit message"
```

### 5. Push Your Branch

```bash
git push origin feat/new-feature
```

## Creating a Pull Request

A Pull Request (PR) is how your changes are merged into the main project.

### Steps:

1. **Go to your fork** on GitHub
2. **Click "Compare & pull request"** (should appear after pushing)
3. **Fill out the PR template**, explaining:
   - What you changed and why
   - Related issue number (e.g., "Fixes #42")
   - Steps to test or verify your changes
   - Screenshots (if applicable)

### PR Best Practices:

- **Keep PRs focused** — one feature or fix per PR
- **Reference issues** using keywords like `Fixes`, `Closes`, or `Resolves`
- **Include screenshots or logs** if it helps explain your work
- **Write descriptive titles** and descriptions
- **Be patient** — maintainers may request clarifications or changes

### PR Template Example:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## How Has This Been Tested?
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile
- [ ] Unit tests added/updated

## Screenshots (if applicable)
Add screenshots here.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
```

## Navigating Reviews and Feedback

### Be Open-Minded
- Reviews are about improving code quality, not personal criticism
- Constructive feedback helps make the project better
- Different perspectives can reveal issues you might have missed

### Respond Politely
- Explain your reasoning if you disagree
- Ask questions if feedback isn't clear
- Thank reviewers for their time and input

### Make Requested Changes
- Push updates to the same branch; they'll automatically appear in the PR
- Address all feedback before requesting re-review
- If you can't implement a suggestion, explain why

### Celebrate When Merged
🎉 Your contribution just made SyntaxForge better!

## Coding Guidelines

### General Guidelines

- **Follow existing code style** and linting rules
- **Keep code modular** and well-documented
- **Write descriptive comments** where necessary
- **Add or update tests** for new features
- **Avoid introducing unnecessary dependencies**
- **Ensure mobile responsiveness** for UI changes

### JavaScript Guidelines

- Use **ES6+ features** when appropriate
- Follow **consistent naming conventions** (camelCase for variables/functions, PascalCase for classes)
- Write **comprehensive JSDoc comments** for functions and classes
- Use **meaningful variable and function names**
- Keep functions **small and focused**

### CSS Guidelines

- Use **Tailwind CSS classes** for styling
- Follow **mobile-first responsive design**
- Use **semantic color names** from the design system
- Keep **CSS organized** and maintainable

### HTML Guidelines

- Use **semantic HTML elements**
- Include **proper accessibility attributes**
- Ensure **valid HTML structure**
- Use **descriptive alt text** for images

## Commit and Branch Naming

### Branch Names

Use descriptive names with prefixes:

```bash
feat/add-search-functionality
fix/editor-crash-on-mobile
docs/update-installation-guide
refactor/user-authentication
style/improve-button-design
test/add-unit-tests
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
feat: add search functionality to course browser
fix: resolve editor crash on mobile devices
docs: update installation guide with new steps
refactor: improve user authentication flow
style: update button styling for better UX
test: add unit tests for course validation
```

**Format**: `<type>: <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Hacktoberfest Participation

We welcome Hacktoberfest contributions! To make your PRs count:

### Finding Issues

Look for issues labeled:
- `hacktoberfest` - General Hacktoberfest contributions
- `good first issue` - Perfect for newcomers
- `help wanted` - Community help needed
- `documentation` - Documentation improvements
- `bug` - Bug fixes
- `enhancement` - Feature improvements

### Contribution Ideas

- **Add new JavaScript lessons** and challenges
- **Improve the code editor** functionality
- **Enhance the UI/UX** design
- **Write better documentation**
- **Add new course tracks** (Python, HTML/CSS, React, etc.)
- **Fix bugs** and improve performance
- **Add accessibility improvements**
- **Create educational content** and tutorials
- **Improve mobile experience**
- **Add internationalization** support

### Quality Guidelines

- **Follow this guide closely**
- **Avoid spammy or low-quality PRs**
- **Quality, collaboration, and learning are key**
- **Test your changes thoroughly**
- **Write clear commit messages**
- **Include proper documentation**

## Communication and Support

### Getting Help

- **Open a Discussion** on GitHub for general questions
- **Comment under issues** for specific problems
- **Email maintainers** at maintainers@syntaxforge.dev for sensitive issues

### Best Practices

- **Be respectful and inclusive** — we all learn at different paces
- **Search existing discussions** before creating new ones
- **Provide context** when asking questions
- **Help others** when you can

### Community Channels

- **GitHub Discussions**: For general community discussions
- **GitHub Issues**: For bug reports and feature requests
- **Email**: maintainers@syntaxforge.dev for private matters

## Code of Conduct

All participants are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). By contributing, you help foster a welcoming and supportive open-source community.

### Key Principles

- **Be respectful** and inclusive
- **Be patient** with newcomers
- **Be constructive** in feedback
- **Be collaborative** in approach

## Development Workflow

### Daily Workflow

1. **Pull latest changes** from upstream
2. **Create feature branch** from main
3. **Make changes** following guidelines
4. **Test thoroughly** before committing
5. **Push and create PR**
6. **Address feedback** promptly
7. **Celebrate** when merged! 🎉

### Release Process

1. **Feature freeze** before releases
2. **Testing phase** with community feedback
3. **Bug fixes** and final adjustments
4. **Documentation updates**
5. **Release announcement**

## Project Architecture

### Key Components

- **Frontend**: Vanilla JavaScript with modular architecture
- **Styling**: Tailwind CSS with custom design system
- **Build**: Webpack 5 with development and production configs
- **Editor**: CodeMirror 6 with JavaScript support
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Documentation**: JSDoc with Clean Theme

### File Structure

```
SyntaxForge/
├── src/
│   ├── css/              # Tailwind CSS styles
│   ├── data/             # Course content (JSON)
│   ├── imgs/             # Images and icons
│   ├── js/               # JavaScript modules
│   │   ├── main.js       # Core application logic
│   │   ├── editor.js     # Code editor functionality
│   │   ├── course.js     # Course management
│   │   ├── lesson.js     # Lesson handling
│   │   ├── login.js      # Authentication
│   │   └── firebase.js   # Firebase configuration
│   ├── markdown/         # Lesson content
│   └── pages/            # HTML pages
├── webpack.config.js     # Build configuration
├── package.json          # Dependencies and scripts
├── jsdoc.json           # Documentation configuration
├── CODE_OF_CONDUCT.md   # Community guidelines
├── CONTRIBUTING.md      # This file
└── README.md           # Project overview
```

## Troubleshooting

### Common Issues

**Build Errors**:
- Check Node.js version compatibility
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for conflicting global packages

**Development Server Issues**:
- Ensure port 8080 is available
- Try different port: `npm run serve -- --port 3000`
- Check firewall settings

**Firebase Issues**:
- Verify Firebase configuration
- Check authentication setup
- Ensure proper environment variables

**Editor Issues**:
- Clear browser cache
- Check CodeMirror version compatibility
- Verify JavaScript syntax in lessons

### Getting Help

If you encounter issues not covered here:

1. **Search existing issues** on GitHub
2. **Create a new issue** with detailed information
3. **Contact maintainers** at maintainers@syntaxforge.dev

## Thank You! 🙏

Every contribution, no matter how small, helps strengthen the project and community. Thank you for helping make SyntaxForge better!

---

**Happy Coding!** 🚀✨
