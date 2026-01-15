

# AGENTS.md – AI Agent Onboarding for cardano.org

> **Important:** Use only `yarn` for all dependency and script management. Do not use `npm`.

Welcome! This guide enables AI agents (and their operators) to contribute productively and safely to cardano.org. It covers philosophy, repo map, quickstart, quality gates, guardrails, and content rules. **Read carefully before making changes.**

---

## Scope and intent
- Prefer small, reviewable changes that can be shipped continuously.
- For non-trivial changes, start with a discussion or issue before implementation.
- Optimize for correctness, consistency, and maintainability over novelty.

---

## Project Philosophy
- **Collective Ownership:** cardano.org is managed by a community, not a single entity. All contributions are welcome and valued.
- **Incremental Evolution:** Prefer small, reviewable, continuously shipped changes. Avoid large, disruptive changes unless discussed and agreed.
- **Discussion First:** For any non-trivial change, start with a discussion before implementation.

---

## Essential Resources
- **[README.md](./README.md):** Project overview, setup, and contribution boundaries.
- **[CONTRIBUTING.md](./CONTRIBUTING.md):** Contribution guidelines and workflow.
- **[docs/get-involved/](./docs/get-involved/):** Guides for all types of contributions (content, code, design, data, community).
- **[docs/glossary.md](./docs/glossary.md):** Editorial style guide and glossary. **Mandatory for all content and code comments.**

---

## Repository Map (Key Folders)
- `src/` – Source code (React components, logic)
- `docs/` – Documentation, guides, editorial content
- `blog/` – Blog posts
- `static/` – Static assets (images, downloads)
- `scripts/` – Utility scripts
- `docusaurus.config.js` – Docusaurus site config
- `sidebars.js` – Sidebar/navigation config
- `variables.js` – Design tokens, theme variables
- `package.json` – Scripts, dependencies
- `netlify.toml` – Netlify build/deploy config

---

## Quickstart (Reproducible Setup)

1. **Clone the repo:**
  ```sh
  git clone https://github.com/cardano-foundation/cardano-org.git
  cd cardano-org
  ```
2. **Install dependencies:**
  ```sh
  yarn install
  ```
3. **Start local development:**
  ```sh
  yarn start
  ```
4. **Build for production:**
  ```sh
  yarn build
  ```
5. **Discover more scripts:**
  Check `package.json` > `scripts` for all available commands.

---

## Quality Gates (Before PR)
- All code must pass: **build**
- No new warnings or errors introduced
- PR must not break local dev or production build
- All new/changed reusable components must be documented in `docs/get-involved/components/`
- All content must follow the editorial style guide (`docs/glossary.md`)

---

## Hard Guardrails (Strict Don’ts)
- **No new dependencies** without issue + maintainer approval
- **No secrets or real keys** in code, config, or examples
- **No mass-rewrites** (format all, wide refactor) without explicit OK
- **No changes to build/CI** without clear motivation and approval
- **No changes outside documented scope** (see CONTRIBUTING.md)
- **No promo/marketing language** without prior discussion

---

## Pull Request (PR) Checklist
Every PR should include:

1. **Problem statement** – What is being solved/changed?
2. **Approach** – How was it solved? (summary)
3. **Screenshots** (for UI/UX changes)
4. **How to test** – Steps to verify
5. **Related issue/discussion** – Link if available
6. **Docs updated** – Yes/No (and where)

---

## Content & Editorial Rules
- **Language:** US English, Oxford comma, gender-inclusive
- **Claims:** Link to sources for factual statements, or avoid unverifiable claims
- **Product/brand names:** Only as per `docs/glossary.md`
- **No promo language** without explicit approval
- **No unreviewed translations**

---

## Best Practices for AI Agents
- **Check for existing work:** Search issues/discussions before starting
- **Document everything:** All reusable code/components/layouts/utilities must be documented in `docs/get-involved/`
- **Consistency:** Follow style guide and glossary for all content and code comments
- **Transparency:** PRs must clearly describe changes and link to related issues/discussions
- **Collaboration:** Engage in discussions for feedback and alignment

---

## Recognition
- All contributors are credited in the repository
- Significant/sustained contributions may be highlighted or lead to maintainer status

---

## Need Help?
- See [Get Involved](./docs/get-involved/index.md) for detailed guidance
- Join [Discussions](https://github.com/cardano-foundation/cardano-org/discussions) for questions and idea sharing
- Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for process details

---

Thank you for helping make cardano.org better for everyone!
