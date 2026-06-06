# Node.js & npm Command Cheatsheet

**Scope:** Practical reference for everyday Node.js and npm operations — from runtime flags and module system fundamentals through package management, scripts, publishing, and diagnostics. Commands, flags, and workflows a developer reaches for day-to-day.

**Last updated:** 2026-06-06

---

## Table of Contents

1. [Node.js Basics](#1-nodejs-basics)
2. [Node.js Runtime Flags](#2-nodejs-runtime-flags)
3. [Node.js Module System (CJS/ESM)](#3-nodejs-module-system-cjsesm)
4. [Node.js Built-in CLI Tools & Corepack](#4-nodejs-built-in-cli-tools--corepack)
5. [npm Basics](#5-npm-basics)
6. [npm Dependency Management](#6-npm-dependency-management)
7. [npm Scripts & Lifecycle](#7-npm-scripts--lifecycle)
8. [npm Publish & Versioning](#8-npm-publish--versioning)
9. [npm Config & Environment](#9-npm-config--environment)
10. [npm Cache & Diagnostics](#10-npm-cache--diagnostics)
11. [package.json Key Fields](#11-packagejson-key-fields)
12. [npx Usage](#12-npx-usage)

---

## 1. Node.js Basics

Sources: [nodejs.org/api/cli.html](https://nodejs.org/api/cli.html)

### Synopsis

```bash
node [options] [V8 options] [<program-entry-point> | -e "script" | -] [--] [arguments]
node inspect [<program-entry-point> | -e "script" | <host>:<port>] …
node --v8-options
```

### Core Commands

| Command | Description |
|---------|-------------|
| `node script.js` | Run a JavaScript file |
| `node` (no args) | Start the REPL (Read-Eval-Print Loop) |
| `node --version` or `node -v` | Print Node.js version |
| `node -e "console.log('hi')"` | Evaluate inline JavaScript (CommonJS by default — see `--input-type=module` for ESM) |
| `node -p "1+1"` | Evaluate and print result |
| `node --check script.js` or `node -c` | Syntax-check a script without executing it |
| `node -i` or `--interactive` | Always enter the REPL even if stdin is provided |
| `node -` | Read script from stdin |
| `node --input-type=module` | Treat stdin input as ES module (vs `"commonjs"`) |
| `node --eval --input-type=module` | Evaluate a string as an ES module |

---

## 2. Node.js Runtime Flags

Source: [nodejs.org/api/cli.html](https://nodejs.org/api/cli.html)

### Watch Mode (Node 18+)

```bash
node --watch script.js              # Watch entry point + dependencies, restart on change
node --watch-path=./src script.js   # Watch a specific path
node --watch-preserve-output        # Keep output from previous runs
node --watch-kill-signal=SIGUSR2    # Signal to use when killing (default: SIGTERM)
```

### Environment File Loading

```bash
node --env-file=.env script.js           # Load .env file (Node 20+)
node --env-file-if-exists=.env script.js # Load .env if it exists, silently skip otherwise (Node 26+)
```

### Debugging & Inspector

```bash
node --inspect script.js                 # Enable V8 inspector (default 127.0.0.1:9229)
node --inspect-brk script.js             # Pause at first line of user code
node --inspect-wait script.js            # Wait for debugger to attach before executing
node --inspect-port=9230 script.js       # Set a custom inspector port
node inspect script.js                   # Built-in CLI debugger
```

### Module & TypeScript

```bash
node --import='./preload.mjs' script.js   # Load an ES module before the entry point (Node 18+)
node -r './preload.js' script.js          # Pre-load a CommonJS module
node -C 'development' script.js           # Custom conditions for module resolution
node --experimental-strip-types app.ts    # Strip TypeScript types at runtime (Node 22+, experimental)
node --no-strip-types app.ts              # Disable experimental TypeScript stripping
```

### Permission Model (stable since Node 23.5 / 22.13)

```bash
node --permission script.js                           # Enable permission model
node --allow-fs-read=/etc/config,/data script.js      # Allow read access to specific paths
node --allow-fs-write=./output script.js              # Allow write access to specific paths
node --allow-child-process script.js                  # Allow child process spawning
node --allow-addons script.js                         # Allow native addons
node --allow-worker script.js                         # Allow worker threads
node --allow-net=api.example.com script.js            # Allow network access to specific hosts
node --allow-ffi script.js                            # Allow FFI (experimental)
```

### Other Important Flags

```bash
node --enable-source-maps script.js        # Enable source map support in stack traces
node --experimental-test-coverage          # Enable test runner coverage
node --experimental-vm-modules             # Enable ES module support in VM module
node --experimental-config-file=./config.json # Node 26, specify config file path
node --v8-options                          # List all V8 engine options
node --help                                # Print Node.js help
```

### Key Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_OPTIONS=<options...>` | Pass CLI options via environment variable |
| `NODE_ENV=<value>` | Convention used by frameworks (not a Node.js core concept) |
| `NODE_PATH=<path>[:…]` | Additional module search paths |
| `NODE_DEBUG=<module>[,…]` | Enable debug logging for specific modules |
| `UV_THREADPOOL_SIZE=<size>` | libuv thread pool size (default: 4) |

---

## 3. Node.js Module System (CJS/ESM)

Sources: [nodejs.org/api/esm.html](https://nodejs.org/api/esm.html), [nodejs.org/api/packages.html](https://nodejs.org/api/packages.html)

### Module Type Comparison

| Feature | CommonJS (CJS) | ES Modules (ESM) |
|---------|---------------|-------------------|
| File extensions | `.js`, `.cjs` | `.js` (with `"type": "module"`), `.mjs` |
| Load / export syntax | `require()`, `module.exports` / `exports` | `import` / `export` |
| Loading | Synchronous | Async (static analysis) |
| `__dirname` | Available | Use `import.meta.dirname` (stable Node 24+ / 22.16+) |
| `__filename` | Available | Use `import.meta.filename` |
| Top-level await | Not supported | Supported |
| JSON imports | `require('./file.json')` | `import data from './file.json' with { type: 'json' }` |

### How Node Determines the Module System

| File | `type` in package.json | Result |
|------|------------------------|--------|
| `.mjs` | Any | ESM |
| `.cjs` | Any | CommonJS |
| `.js` | `"type": "module"` | ESM |
| `.js` | `"type": "commonjs"` or missing | CommonJS |
| `.mts` / `.cts` | Any | TypeScript (strip-types) analog of `.mjs` / `.cjs` |

### ESM Equivalents for CommonJS Patterns

```js
// CommonJS                           // ES Modules
const fs = require('fs')              import fs from 'node:fs'
module.exports = foo                  export default foo
exports.foo = foo                     export const foo = foo
__dirname                             import.meta.dirname
__filename                            import.meta.filename
require.resolve('./foo')              import.meta.resolve('./foo')
require('./file.json')                import data from './file.json' with { type: 'json' }
```

### Exports Field (Conditional Exports)

Use the `"exports"` field in `package.json` to define entry points per environment:

```json
{
  "exports": {
    ".": {
      "import": "./index-esm.js",
      "require": "./index-cjs.js",
      "default": "./index.js"
    },
    "./utils": {
      "import": "./utils-esm.js",
      "require": "./utils-cjs.js"
    }
  }
}
```

### Important ESM Rules

1. Relative imports **must include file extensions**: `'./foo.js'` not `'./foo'`.
2. Bare specifiers (`lodash`) resolve through `node_modules`.
3. Use the `node:` prefix for built-in modules: `import fs from 'node:fs'`.
4. Top-level `await` is supported in ESM.
5. JSON imports require `with { type: 'json' }`.
6. Node 22+ auto-detects ESM syntax when `--experimental-detect-module` is active (default).

---

## 4. Node.js Built-in CLI Tools & Corepack

### Built-in Commands

```bash
node -e "console.log('hi')"                 # Evaluate JS string (CommonJS by default)
node -p "1+1"                               # Evaluate and print result
node --input-type=module --eval "import('fs')"  # Evaluate as ES module
node -c script.js                           # Syntax-check without running
node --test [files]                         # Run built-in test runner (Node 18+, stable Node 22+)
node --experimental-strip-types app.ts      # Strip TypeScript types (Node 22+, experimental)
node --v8-options                           # List V8 options
node --help                                 # Print help
node --watch script.js                      # Watch mode (Node 18+)
node --env-file=.env script.js              # Load env file (Node 20+)
```

### Test Runner (Node 18+)

```bash
node --test                          # Run all test files matching patterns
node --test test/unit/user.test.js   # Run a specific test file
node --experimental-test-coverage    # Enable test coverage
node --test-name-pattern="regex"     # Run tests matching a name pattern
node --test --watch                  # Run tests in watch mode
```

### Corepack (bundled with Node >=14.19.0)

Corepack manages package manager versions (yarn, pnpm) declaratively through the `packageManager` field in `package.json`.

```bash
corepack enable                      # Install package manager shims on PATH
corepack disable                     # Remove shims
corepack prepare yarn@3.2.3 --activate # Prepare and activate a specific version
corepack install -g                  # Install package managers globally
corepack use yarn                    # Pin current package manager in package.json
corepack use pnpm@8                  # Pin a specific version
corepack up                          # Update to latest on same major
corepack pack -o ./offline.tgz       # Download for offline use
corepack cache clean                 # Clear Corepack cache
```

Example `package.json` field:

```json
{
  "packageManager": "yarn@3.2.3+sha224.xxx"
}
```

When Corepack is enabled and this field is present, Corepack auto-switches to the declared version.

---

## 5. npm Basics

Sources: [docs.npmjs.com/cli/v10/commands](https://docs.npmjs.com/cli/v10/commands)

### Getting Started

```bash
npm init                              # Create package.json interactively
npm init -y                           # Create package.json with defaults
npm init <initializer>                # Run create-<initializer> via npx
npm --version                         # Check npm version
npx --version                         # Check npx version
```

### Install & Remove

```bash
npm install                           # Install all dependencies from package-lock.json
npm i <package>                       # Install and save to dependencies
npm i <pkg>@<version>                 # Install a specific version
npm i <pkg>@<tag>                     # Install by dist-tag (e.g. @next, @latest)
npm ci                                # Clean install using lockfile exactly
npm uninstall <pkg>                   # Remove a package (alias: rm, r)
npm update                            # Update all packages within semver range
npm outdated                          # Check registry for outdated packages
```

**`npm install` aliases:** `add`, `i`, `in`, `ins`, `inst`, `insta`, `instal`, `isnt`, `isnta`, `isntal`, `isntall`

**`npm ci` requirements:**
- Project must have `package-lock.json` or `npm-shrinkwrap.json`.
- If lockfile doesn't match `package.json`, exits with error.
- Deletes `node_modules` before installing (guarantees a clean state).

---

## 6. npm Dependency Management

### Save-target Flags

| Flag | Saves to | Shorthand |
|------|----------|-----------|
| `--save-prod` | `dependencies` (default) | `-P` |
| `--save-dev` | `devDependencies` | `-D` |
| `--save-optional` | `optionalDependencies` | `-O` |
| `--save-peer` | `peerDependencies` | — |
| `--save-exact` | (pinned, no `^` or `~`) | `-E` |
| `--save-bundle` | `bundleDependencies` | `-B` |
| `--no-save` | (don't save to `package.json`) | — |

### Install Mode Flags

```bash
npm install -g <pkg>                  # Install globally
npm install --production              # Skip devDependencies
npm install --omit=dev                # Omit dev dependencies
npm install --dry-run                 # Report what would be done
npm install --package-lock-only       # Only update lockfile
npm install --force                   # Force remote fetch
npm install --legacy-peer-deps        # Ignore peer dependency conflicts
npm install --strict-peer-deps        # Treat conflicting peer deps as failure
npm install --install-strategy=hoisted|nested|shallow|linked  # node_modules layout
npm install --ignore-scripts          # Don't run lifecycle scripts
npm install --audit                   # Submit audit (boolean, default: true)
npm install --fund                    # Display funding message (boolean, default: true)
```

### npm audit

```bash
npm audit                             # Scan for known vulnerabilities
npm audit fix                         # Auto-install compatible updates to fix vulnerabilities
npm audit fix --force                 # Install SemVer-major updates if needed
npm audit fix --package-lock-only     # Fix but only update lockfile
npm audit signatures                  # Verify registry signatures
npm audit --audit-level=moderate      # Minimum level to fail (moderate, high, critical)
```

### npm fund

```bash
npm fund                              # List funding URLs for all dependencies
npm fund <pkg>                        # Open funding URL for a specific package
```

---

## 7. npm Scripts & Lifecycle

Source: [docs.npmjs.com/cli/v10/using-npm/scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts)

### Running Scripts

```bash
npm run <script>                      # Run an arbitrary script from package.json
npm start                             # Run the start script (defaults to node server.js)
npm stop                              # Run the stop script
npm restart                           # Run restart script; if absent runs stop then start
npm test                              # Run the test script (also npm t)
npm run <script> -- <args>            # Pass additional args to script
```

### Pre- and Post-Scripts

npm automatically runs `pre<script>` → `<script>` → `post<script>`:

```json
{
  "scripts": {
    "prebuild": "rm -rf dist",
    "build": "tsc",
    "postbuild": "cp assets dist/"
  }
}
```

Running `npm run build` triggers: `prebuild` → `build` → `postbuild`.

### Lifecycle Event Order

| Command | Order |
|---------|-------|
| `npm install` | `preinstall` → `install` → `postinstall` → `prepublish` → `preprepare` → `prepare` → `postprepare` |
| `npm publish` | `prepublishOnly` → `prepack` → `prepare` → `postpack` → `publish` → `postpublish` |
| `npm pack` | `prepack` → `prepare` → `postpack` |
| `npm version` | `preversion` → `version` → `postversion` |

### Environment Variables Available in Scripts

| Variable | Description |
|----------|-------------|
| `npm_package_name` | Package name |
| `npm_package_version` | Package version |
| `npm_package_<field>` | Any field from package.json (dots become underscores) |
| `npm_lifecycle_event` | Current lifecycle event name |
| `npm_config_*` | npm config values |
| `INIT_CWD` | Directory from which `npm run` was invoked |
| `PATH` | Includes `node_modules/.bin` automatically |

---

## 8. npm Publish & Versioning

Source: [docs.npmjs.com/cli/v10/commands/npm-version](https://docs.npmjs.com/cli/v10/commands/npm-version), [docs.npmjs.com/cli/v10/commands/npm-publish](https://docs.npmjs.com/cli/v10/commands/npm-publish)

### Version Bumping

```bash
npm version major                    # Bump major: 1.0.0 → 2.0.0
npm version minor                    # Bump minor: 1.0.0 → 1.1.0
npm version patch                    # Bump patch: 1.0.0 → 1.0.1
npm version premajor                 # 1.0.0 → 2.0.0-0
npm version prerelease               # 1.0.0 → 1.0.1-0
npm version from-git                 # Infer version from git tags
npm version 3.5.0                    # Set to exact semver string
```

### Version Flags

```bash
npm version minor -m "Upgrade to %s"     # Custom commit message (%s = new version)
npm version prerelease --preid=rc         # Prerelease identifier: 1.0.1-rc.0
npm version patch --no-git-tag-version    # Bump without git tag/commit
npm version patch --sign-git-tag          # Sign the git tag with GPG
```

### Publishing

```bash
npm publish                              # Publish package to registry
npm publish --tag=beta                   # Publish with a specific dist-tag
npm publish --access=public               # Set access for scoped packages
npm publish --access=restricted           # Restrict access
npm publish --dry-run                     # Preview what would be published
```

### Other Publishing Commands

```bash
npm deprecate <pkg>@<version> "<message>"    # Deprecate a package version
npm pack                                     # Create a .tgz tarball (does not publish)
npm unpublish <pkg>@<version>                # Remove from registry (24-hour window)
npm dist-tag add <pkg>@<version> <tag>       # Add a distribution tag
npm dist-tag ls <pkg>                        # List all dist-tags
npm dist-tag rm <pkg> <tag>                  # Remove a distribution tag
npm view <pkg>                               # Show registry info
npm view <pkg> versions                      # List all published versions
```

---

## 9. npm Config & Environment

Source: [docs.npmjs.com/cli/v10/commands/npm-config](https://docs.npmjs.com/cli/v10/commands/npm-config), [docs.npmjs.com/cli/v10/configuring-npm/npmrc](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)

### Config Commands

```bash
npm config set <key>=<value>                 # Set a config value in user .npmrc
npm config get <key>                         # Read a config value
npm config list                              # List all config (use -l for defaults)
npm config list --json                       # List config as JSON
npm config delete <key>                      # Remove a config key
npm config edit                              # Open .npmrc in editor
npm config fix                               # Attempt to repair invalid config
npm config set <key>=<value> --location=project  # Set in project-level .npmrc
```

### .npmrc File Hierarchy

| Priority | Location | Scope |
|----------|----------|-------|
| 1 (highest) | `/path/to/project/.npmrc` | Per-project |
| 2 | `~/.npmrc` | Per-user |
| 3 | `$PREFIX/etc/npmrc` | Global |
| 4 (lowest) | Built-in defaults | npm's own |

Format: INI-style. Supports environment variable interpolation with `${VARIABLE_NAME}`.

### Key Config Keys

| Key | Default | Description |
|-----|---------|-------------|
| `registry` | `https://registry.npmjs.org/` | Package registry URL |
| `@scope:registry` | — | Scope-specific registry |
| `_authToken` | — | Scoped authentication token |
| `cache` | `~/.npm` | Cache directory |
| `prefix` | `/usr/local` | Global install prefix |
| `engine-strict` | `false` | Fail on engine mismatch |
| `save-exact` | `false` | Always save exact versions |
| `workspaces` | — | Workspace patterns (e.g. `["packages/*"]`) |
| `package-lock` | `true` | Enable/disable `package-lock.json` generation |
| `audit` | `true` | Enable/disable audit |
| `fund` | `true` | Enable/disable funding messages |

### NODE_ENV

Setting `NODE_ENV=production` automatically omits `devDependencies` during `npm install`. This is a framework convention, not a Node.js core concept — but it is widely supported across frameworks (Express, Next.js, NestJS, etc.).

```bash
NODE_ENV=production npm install
```

---

## 10. npm Cache & Diagnostics

Source: [docs.npmjs.com/cli/v10/commands/npm-cache](https://docs.npmjs.com/cli/v10/commands/npm-cache), [docs.npmjs.com/cli/v10/commands/npm-doctor](https://docs.npmjs.com/cli/v10/commands/npm-doctor), [docs.npmjs.com/cli/v10/commands/npm-ls](https://docs.npmjs.com/cli/v10/commands/npm-ls)

### Cache Commands

```bash
npm cache ls                           # List cache entries
npm cache clean --force                # Delete all data from cache (--force required)
npm cache verify                       # Verify cache, garbage collect, check integrity
npm cache add <package-spec>           # Add a package to cache explicitly
```

**Cache details:** npm stores cache in `_cacache` inside the configured cache directory (`~/.npm` on POSIX, `%LocalAppData%\npm-cache` on Windows). The cache is content-addressable and self-healing.

### Diagnostic Commands

```bash
npm doctor                             # Run all health checks
npm doctor connection                  # Check registry connectivity
npm doctor registry                    # Verify registry ping
npm doctor versions                    # Check Node/npm version compatibility
npm doctor environment                 # Check system environment
npm doctor permissions                 # Check directory permissions
npm doctor cache                       # Check cache integrity
```

### Tree and Dependency Diagnostics

```bash
npm ls                                 # List installed packages as a dependency tree
npm ls <pkg>                           # Check why a package is in the tree
npm ls --all                           # Show all dependencies
npm ls --depth=0                       # Limit to top-level only
npm ls --json                          # Output as JSON
npm explain <pkg>                      # Explain why a specific package is installed
```

### Outdated & Maintenance Commands

```bash
npm outdated                           # Check registry for outdated packages (Current / Wanted / Latest)
npm outdated <pkg>                      # Check a specific package
npm dedupe                             # Reduce duplication in node_modules
npm prune                              # Remove extraneous packages (not in package.json)
npm prune --production                 # Remove devDependencies only
npm find-dupes                         # Find duplicated packages in the tree
npm ping                               # Ping the registry
```

---

## 11. package.json Key Fields

Source: [docs.npmjs.com/cli/v10/configuring-npm/package-json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

### Identity & Metadata

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "A short description",
  "license": "MIT",
  "author": "Your Name <you@example.com>",
  "repository": "github:user/repo",
  "homepage": "https://github.com/user/repo#readme",
  "bugs": "https://github.com/user/repo/issues",
  "funding": "https://github.com/sponsors/user",
  "keywords": ["node", "cli"]
}
```

### Entry Points

| Field | Purpose |
|-------|---------|
| `main` | Default entry point (CommonJS by convention, default: `index.js`) |
| `exports` | Modern alternative with conditional exports (preferred for dual CJS/ESM packages) |
| `browser` | Community convention for browser-targeted builds |
| `module` | Community convention for ES module bundler entry |
| `types` | TypeScript declaration entry (e.g. `index.d.ts`) |

### Module System

```json
{
  "type": "module"
}
```

| `type` value | `.js` files treated as |
|--------------|------------------------|
| `"module"` | ES modules |
| `"commonjs"` (or omitted) | CommonJS |

Overrides: `.mjs` / `.mts` files are always ESM; `.cjs` / `.cts` files are always CommonJS.

### Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "typescript": "~5.4.0"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  },
  "optionalDependencies": {
    "bufferutil": "^4.0.0"
  },
  "bundleDependencies": ["my-dep"],
  "overrides": {
    "lodash": "4.17.21"
  }
}
```

### Other Key Fields

```json
{
  "scripts": { "build": "tsc" },
  "private": true,
  "publishConfig": { "access": "public" },
  "files": ["dist", "README.md"],
  "engines": { "node": ">=18.0.0" },
  "os": ["darwin", "linux"],
  "cpu": ["x64", "arm64"],
  "workspaces": ["packages/*", "apps/*"],
  "bin": {
    "my-cli": "./bin/cli.js"
  },
  "packageManager": "pnpm@8.15.0"
}
```

| Field | Description |
|-------|-------------|
| `private` | Prevents accidental publishing when `true` |
| `publishConfig` | Overrides config values during `npm publish` |
| `files` | Glob patterns for files included in publish |
| `engines` | Advisable Node/npm version range (use `engine-strict=true` in `.npmrc` to enforce) |
| `os` / `cpu` | Restrict to specific platforms |
| `workspaces` | Monorepo workspace globs |
| `bin` | Maps command names to executable files — npm links them on global install |
| `packageManager` | Corepack-managed package manager declaration |

---

## 12. npx Usage

Source: [docs.npmjs.com/cli/v10/commands/npx](https://docs.npmjs.com/cli/v10/commands/npx)

### Basic Usage

```bash
npx <pkg>                              # Run a command from a local or remote npm package
npx <pkg>@<version>                    # Run a specific version
npx --yes <pkg>                        # Skip prompt before installing (also -y)
npx --no <pkg>                         # Don't install, fail if not local
npx --package <pkg> <cmd>              # Run <cmd> from a specific package
npx -c '<cmd> [args]'                  # Run arbitrary shell command in project context
```

### Key Behaviors

- **npx prompts before installing** — suppress with `--yes` or `-y`.
- **Auto-uses locally installed binaries** from `node_modules/.bin` if available.
- **Installs to npm cache** when not locally available — does not pollute global space.
- **`npx` and `npm exec` are functionally the same** since npm v7:

```bash
npm exec -- <cmd>                      # Equivalent to npx via npm exec
```

### Common Examples

```bash
npx create-react-app my-app            # Run create-react-app without global install
npx -y cowsay "hello"                  # Run cowsay without prompting
npx --package typescript tsc --version # Run tsc from the typescript package
npx http-server                        # Start a local HTTP server
npx github:user/repo                   # Run a package from a GitHub repo
```

---

<!--
  Reference validation: every flag, command, and option listed above was verified
  against Node.js 26.3.0 and npm v10.9.8 in June 2026. Flags that do not exist
  have been excluded. If you find an error, open a PR against this file.
-->
