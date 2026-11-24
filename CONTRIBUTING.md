# Contributing

## Commits
We make use of [Conventional Commits](https://www.conventionalcommits.org). It's encouraged that 
commit messaging follow the format
  ```
  <type>[optional scope]: <description>
  ```

### Build Requirements
To set up your work environment you'll need to use
 * [NodeJS](https://nodejs.org/)
 * NPM
   > There appear to be dependency mapping issues with `Yarn` v1.x.x lock files, `Typescript` and `webpack`, and specific dependencies
   > using ES modules. If you do decide to use [Yarn](https://yarnpkg.com) use the latest version.
    
#### Windows and repository symlinks

Some paths in this repo are **symbolic links** so tools can reach shared skills without needing to host multiple versions of the same files. For example, `.agents/skills` and `.claude/skills` point to `guidelines/skills`. On **Windows**, Git may create **regular folders or files** instead of links, so these locations can look empty or broken.

**Before you clone the repository**

- Turn on **Developer Mode** (Settings -> Privacy & security -> For developers). That usually lets Git create symlinks without running as Administrator.
- Prefer cloning with links enabled, for example: `git clone -c core.symlinks=true <repository-url>`, or use **WSL** / **Git for Windows** with symlink support configured.

**If the repo is already on disk and the links are broken**

Turning on Developer Mode or Git symlink settings **does not always fix** paths Git has already created as ordinary files.
- Delete the broken `.agents/skills` and `.claude/skills` entries, or remove the entire folder/directory and **clone again**.
- Then follow the **Before you clone the repository** steps above.

> If you are unsure of any steps, please verify them with your IT or system administrator before proceeding.

### Develop with testing
To start work
  ```shell
  $ npm
  $ npm run test:dev
  ```

#### Testing
Jest is used for the unit test framework. To run unit tests during development open a terminal instance and run
  ```shell
  $ npm run test:dev
  ```

### Code Coverage
The requirements for code coverage are currently maintained around the `60%` to `80%` mark.

Updates that drop coverage below the current threshold should have their coverage expanded before being merged. 

Settings for coverage can be found in [package.json](./package.json)

#### To check test coverage
  ```shell
  $ npm test
  ```

#### Code coverage failing to update?
If you're having trouble getting an accurate code coverage report, or it's failing to provide updated results (i.e. you renamed files) you can try running
  ```
  $ npm run test:clearCache
  ```

## Updating Configurations or Dependencies

When updating webpack configurations, CLI options, or dependencies:

1. Update the relevant configuration module in `src/` (`src/wpConfigs.js`, `src/wp.js`, `src/dotenv.js`, `src/ts.js`)
2. Synchronize standalone output in `src/standalone.js` if webpack config functions, loaders, or required dependencies change
3. Regenerate exposed packages and licenses if `package.json` `dependencies` change:
   ```shell
   $ npm run build:packages-lib
   ```
4. Regenerate JSDoc markdown documentation if JSDoc comments in `src/*.js` change:
   ```shell
   $ npm run build:docs
   ```
5. Update `DOCS.md` and `README.md` if CLI options, presets, or exposed packages change
6. Run unit and integration tests:
   ```shell
   $ npm test
   $ npm run test:integration
   ```

## AI agent

### User Section

Current agent interaction can be triggered with the chat command

- **`review the repo guidelines`** - Your agent should attempt to scan common markdown files and the guidelines directory

For detailed information on agent interaction, see [guidelines/README.md](./guidelines/README.md).

#### Customizing developer experience

As developers, we often have our own flavor of working, and now that includes working with AI agents. To that point we've added agent guidance
to allow customization for your work environment through a gitignored directory `./.agent` in the root of the project.

#### Noting AI Agent contributions

Asking the agent to review the repo and its git history should provide code-style references your agent can leverage based on this codebase's patterns. That
helps alleviate some concerns around where your agent is generating/pulling references from, but not all.

For transparency, we encourage (but don't require) labeling AI-assisted contributions with the `bot-assisted` PR/MR label.

> By contributing AI-assisted or AI-generated work, you accept liability for work that infringes or uses copyrighted material outside the scope of the related license.

### Agent Only
Agents: This repository contains a hierarchical guideline system. Agents should review agent-only comment blocks.

<!--
Agents must analyze these files when asked for guidance:

**Guidelines review order:**
1. **`./README.md`** - Main agent guidance and behavior standards (including agent-only comment block)
2. **`./guidelines/README.md`** - Core agent guidance and behavior standards
3. **`./guidelines/**/*.md`** - Specialized workflow and domain-specific instructions
4. **`./.agent/**/*.md`** - gitignored directory and local guidelines intended for agent-specific state and new agent-generated guidance, and user workflows that enhance the core guidelines

The guideline system should be processed in this order, with specialized guidelines taking precedence for their specific domains, and local guidelines overriding general guidelines when present.

**Next Steps:**
5. **Review guidance under the `./.agent/**/*.md` directory.** If the `./.agent` directory exists, the user may ask the agent about the guidance located here.
6. **If the `./.agent` directory does not exist, ask the user if they want to create it.** The agent should explain how it's going to be used.
-->
