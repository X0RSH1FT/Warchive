# uv Command Cheatsheet

**Scope:** Practical reference for everyday uv operations — from first-time setup through advanced project management. Commands, flags, and workflows a developer reaches for day-to-day.

---

## Table of Contents

1. [Installation & Getting Started](#1-installation--getting-started)
2. [Project Management](#2-project-management)
3. [Python Management](#3-python-management)
4. [Tool Management](#4-tool-management)
5. [Pip-Compatibility Interface](#5-pip-compatibility-interface)
6. [Cache Management](#6-cache-management)
7. [Configuration & Environment](#7-configuration--environment)
8. [Key Flags (Cross-Cutting)](#8-key-flags-cross-cutting)

---

## 1. Installation & Getting Started

### Installation Methods

```bash
# Standalone installer (macOS/Linux)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Standalone installer (macOS/Linux via wget)
wget -qO- https://astral.sh/uv/install.sh | sh

# Standalone installer (Windows PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Specific version
curl -LsSf https://astral.sh/uv/0.11.19/install.sh | sh

# PyPI via pipx (recommended for pip users)
pipx install uv

# Package managers
brew install uv              # Homebrew
sudo port install uv         # MacPorts
winget install --id=astral-sh.uv -e   # WinGet
scoop install main/uv        # Scoop
cargo install --locked uv    # Cargo

# Docker
# Image: ghcr.io/astral-sh/uv
```

The standalone installer places `uv` and `uvx` in `~/.local/bin/` and adds the directory to your PATH. Package manager installs follow each tool's conventions.

### Basic Commands

```bash
# Full help
uv --help

# Version info
uv version

# Self-update (standalone install only)
uv self update

# Shell completion (Bash)
echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc

# Shell completion (Zsh)
echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc

# Shell completion (Fish)
echo 'uv generate-shell-completion fish | source' >> ~/.config/fish/config.fish
```

### Uninstallation

```bash
uv cache clean
rm -r "$(uv python dir)"
rm -r "$(uv tool dir)"
rm ~/.local/bin/uv ~/.local/bin/uvx
```

---

## 2. Project Management

### `uv init` — Create a new project

```bash
uv init [OPTIONS] [PATH]
```

| Flag | Description |
|------|-------------|
| `--app` | Create an application project (default) |
| `--lib` | Create a library project |
| `--package` | Set up a package (adds build-system) |
| `--no-package` | Create a virtual project (no build-system) |
| `--bare` | Only create `pyproject.toml` |
| `--build-backend <BACKEND>` | Build backend (e.g., `hatchling`, `setuptools`) |
| `--python <VERSION>` | Python version to use |
| `--name <NAME>` | Project name |
| `--description <TEXT>` | Project description |
| `--author-from <SOURCE>` | Author info source (`auto`, `git`, `none`) |
| `--vcs <VCS>` | VCS to initialize (`git`, `none`) |
| `--no-readme` | Skip README.md creation |
| `-r`, `--script` | Create a PEP 723 script |
| `--no-workspace` | Don't add as workspace member |
| `--workspace` | Create a workspace root |

### `uv add` — Add dependencies

```bash
uv add [OPTIONS] <PACKAGES>...
```

| Flag | Description |
|------|-------------|
| `--dev` | Add as dev dependency |
| `--group <NAME>` | Add to a specific dependency group |
| `--optional <NAME>` | Add as an optional dependency |
| `--editable` | Add as editable (for local path deps) |
| `--no-sync` | Skip syncing the environment |
| `--frozen` | Add without updating lockfile |
| `--locked` | Assert lockfile remains unchanged |
| `--upgrade` | Allow upgrade of existing dependencies |
| `--upgrade-package <PACKAGE>` | Allow upgrade of specific package |
| `--reinstall` | Reinstall all packages |
| `--pin <STRATEGY>` | Pin strategy: `lower`, `major`, `minor`, `exact` |
| `--raw` | Add without constraint (raw specifier) |
| `--rev <REV>` | Git revision |
| `--tag <TAG>` | Git tag |
| `--branch <BRANCH>` | Git branch |
| `--index <INDEX>` | Index to use for this dependency |

### `uv remove` — Remove dependencies

```bash
uv remove [OPTIONS] <PACKAGES>...
```

| Flag | Description |
|------|-------------|
| `--dev` | Remove from dev dependencies |
| `--group <NAME>` | Remove from a specific group |
| `--optional <NAME>` | Remove from optional dependencies |
| `--no-sync` | Skip syncing |
| `--frozen` | Don't update lockfile |
| `--locked` | Assert lockfile unchanged |

### `uv sync` — Sync project environment

```bash
uv sync [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--dev` | Include dev dependencies (default) |
| `--no-dev` | Exclude dev dependencies |
| `--group <GROUP>` | Include specific dependency group |
| `--no-group <GROUP>` | Exclude specific group |
| `--all-groups` | Include all dependency groups |
| `--no-default-groups` | Don't include default groups |
| `--extra <EXTRA>` | Include optional extra |
| `--all-extras` | Include all optional extras |
| `--frozen` | Use lockfile as-is |
| `--locked` | Assert lockfile unchanged |
| `--upgrade` | Upgrade all packages |
| `--upgrade-package <PACKAGE>` | Upgrade specific package |
| `--reinstall` | Reinstall all packages |
| `--exact` | Remove extraneous packages |
| `--no-build` | Don't build source distributions |
| `--no-binary` | Install only from source |
| `--only-binary` | Use only pre-built wheels |
| `--compile-bytecode` | Compile .py to .pyc |
| `--all-packages` | Sync all workspace members |

`uv sync` is the primary command for keeping your virtual environment in sync with `pyproject.toml` and `uv.lock`. Run it after pulling changes that modify dependencies.

### `uv lock` — Generate/update lockfile

```bash
uv lock [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--frozen` | Don't update existing lockfile |
| `--locked` | Assert lockfile unchanged |
| `--upgrade` | Upgrade all packages |
| `--upgrade-package <PACKAGE>` | Upgrade specific package |
| `--no-build` | Don't build source distributions |
| `--no-binary` | Don't use pre-built wheels |
| `--only-binary` | Use only pre-built wheels |

### `uv run` — Run a command in the project environment

```bash
uv run [OPTIONS] <COMMAND>
```

| Flag | Description |
|------|-------------|
| `--frozen` | Don't update lockfile |
| `--locked` | Assert lockfile unchanged |
| `--no-sync` | Skip environment sync |
| `--no-dev` | Exclude dev dependencies |
| `--group <GROUP>` | Include dependency group |
| `--all-groups` | Include all groups |
| `--extra <EXTRA>` | Include optional extra |
| `--all-extras` | Include all extras |
| `--with <PACKAGE>` | Run with additional package |
| `--with-requirements <FILE>` | Run with additional requirements file |
| `--isolated` | Run in isolated environment |
| `--no-project` | Don't discover project context |
| `--script` | Run as script |
| `--env-file <FILE>` | Load environment variables from .env file |

`uv run` activates the project's virtual environment automatically. Use `--with` for one-off dependencies like profiling tools, or `--isolated` to avoid any project influence.

### `uv build` — Build distribution packages

```bash
uv build [OPTIONS] [PATH]
```

| Flag | Description |
|------|-------------|
| `--wheel` | Build only wheel |
| `--sdist` | Build only source distribution |
| `--all-packages` | Build all workspace members |
| `--out-dir`, `-o <DIR>` | Output directory |
| `--python <VERSION>` | Python version for builds |

### `uv publish` — Publish to PyPI

```bash
uv publish [OPTIONS] [FILES]...
```

| Flag | Description |
|------|-------------|
| `--publish-url <URL>` | Upload endpoint URL |
| `--index <NAME>` | Index name from config |
| `--token <TOKEN>` | PyPI token (username `__token__`) |
| `--username <USER>` | Username |
| `--password <PASS>` | Password |
| `--build` | Build before publishing |
| `--trusted-publishing <ALWAYS\|AUTO\|NEVER>` | Trusted publishing behavior |
| `--check-url <URL>` | Check index for existing files to skip duplicates |

### `uv export` — Export lockfile to requirements.txt

```bash
uv export [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--format <FORMAT>` | Export format (`requirements-txt`, `pylock-toml`) |
| `--output-file`, `-o <FILE>` | Output file |
| `--dev` | Include dev dependencies |
| `--group <GROUP>` | Include dependency group |
| `--all-groups` | Include all groups |
| `--extra <EXTRA>` | Include optional extra |
| `--all-extras` | Include all extras |
| `--frozen` | Use lockfile as-is |
| `--no-editable` | Export non-editable |
| `--no-hashes` | Omit hashes |
| `--prune` | Prune unneeded packages |

### `uv tree` — Display dependency tree

```bash
uv tree [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--package <PACKAGE>` | Show tree for specific package |
| `--depth <DEPTH>` | Maximum depth (default: all) |
| `--frozen` | Use lockfile |
| `--locked` | Assert lockfile unchanged |
| `--no-dev` | Exclude dev dependencies |
| `--invert` | Invert tree (show what depends on a package) |
| `--outdated` | Show outdated packages |

---

## 3. Python Management

### `uv python install` — Install a Python version

```bash
uv python install [OPTIONS] [TARGETS]...
```

| Flag | Description |
|------|-------------|
| `--default` | Install as default `python`/`python3` on PATH |

Omitting `TARGETS` installs the latest stable CPython. Specify a version like `3.12` or `3.11.8` to pin to a specific release.

### `uv python list` — List installed/available Python versions

```bash
uv python list [OPTIONS] [REQUEST]
```

| Flag | Description |
|------|-------------|
| `--all-versions` | Show all versions (including old patches) |
| `--all-platforms` | Show versions for all platforms |
| `--only-installed` | Show only installed versions |
| `--managed-python` | Only managed versions |
| `--no-python-downloads` | Don't show downloadable versions |

### `uv python pin` — Pin Python version for project

```bash
uv python pin [OPTIONS] <VERSION>
```

| Flag | Description |
|------|-------------|
| `--global` | Set global default (user config) |
| `--resolved` | Write resolved version (exact patch) |

Writing `uv python pin 3.12` creates or updates `.python-version` in the project root. Use `--global` to set the system-wide default.

### `uv python find` — Find a Python interpreter

```bash
uv python find [OPTIONS] [REQUEST]
```

| Flag | Description |
|------|-------------|
| `--system` | Ignore virtual environments |
| `--managed-python` | Only managed Python |
| `--no-managed-python` | Ignore managed Python |

Returns a path to a compatible Python interpreter. Useful for scripting or tooling that needs an explicit interpreter path.

### `uv python uninstall` — Uninstall a Python version

```bash
uv python uninstall [OPTIONS] <TARGETS>...
```

| Flag | Description |
|------|-------------|
| `--all` | Uninstall all managed versions |

### `uv python dir` — Show Python installation directory

```bash
uv python dir
```

---

## 4. Tool Management

### `uv tool install` — Install a tool (globally)

```bash
uv tool install [OPTIONS] <PACKAGE>
```

| Flag | Description |
|------|-------------|
| `--with <PACKAGE>` | Include additional package |
| `--with-requirements <FILE>` | Include requirements file |
| `--editable` | Install in editable mode |
| `--force` | Force install (overwrite existing) |
| `--python <VERSION>` | Python version |
| `--reinstall` | Reinstall all packages |
| `--upgrade` | Upgrade all packages |

Tools are installed into an isolated environment and their executables are linked into `~/.local/bin/` (or `$UV_TOOL_BIN_DIR`).

### `uv tool run` / `uvx` — Run a tool without installing

```bash
uv tool run [OPTIONS] <COMMAND>
# Shorthand:
uvx [OPTIONS] <COMMAND>
```

| Flag | Description |
|------|-------------|
| `--with <PACKAGE>` | Include additional package |
| `--with-requirements <FILE>` | Include requirements file |
| `--isolated` | Run in isolated environment |
| `--python <VERSION>` | Python version |
| `--from <PACKAGE>` | Use given package (for when command name != package name) |

`uvx` is the shorthand alias. Use `--from` when the command name doesn't match the package name (e.g., `uvx --from black black` is redundant, but `uvx --from mypy mypy` is fine).

### `uv tool list` — List installed tools

```bash
uv tool list [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--show-paths` | Show paths to tool executables |
| `--version` | Show version of each tool |

### `uv tool update` — Update installed tools

```bash
uv tool update [OPTIONS] <NAME>
```

| Flag | Description |
|------|-------------|
| `--all` | Update all installed tools |
| `--upgrade-package <PACKAGE>` | Upgrade specific package in tool env |
| `--reinstall` | Reinstall all packages |

### `uv tool uninstall` — Uninstall a tool

```bash
uv tool uninstall [OPTIONS] <NAME>
```

---

## 5. Pip-Compatibility Interface

### `uv pip install` — Install packages

```bash
uv pip install [OPTIONS] <PACKAGES>...
```

| Flag | Description |
|------|-------------|
| `-r`, `--requirement <FILE>` | Install from requirements file |
| `-e`, `--editable <PATH>` | Editable install |
| `--group <GROUP>` | Install dependency group |
| `--extra <EXTRA>` | Install optional extras |
| `--constraint <FILE>` | Constraints file |
| `--override <FILE>` | Overrides file |
| `--index-url`, `-i <URL>` | Index URL |
| `--extra-index-url <URL>` | Extra index URL |
| `--find-links`, `-f <URL>` | Additional package locations |
| `--no-index` | Don't use index |
| `--no-deps` | Don't install dependencies |
| `--no-build` | Don't build source distributions |
| `--no-binary <PACKAGE>` | Don't use wheels for package (`:all:`, `:none:`) |
| `--only-binary <PACKAGE>` | Only use wheels |
| `--target <DIR>` | Install to directory |
| `--system` | Use system Python |
| `--break-system-packages` | Allow modifying system packages |
| `--reinstall` | Reinstall all |
| `--upgrade` | Upgrade all |
| `--upgrade-package <PACKAGE>` | Upgrade specific package |
| `--python <VERSION>` | Python version |
| `--python-platform <PLATFORM>` | Target platform (e.g., `x86_64-apple-darwin`) |
| `--exclude-newer <DATE>` | Exclude packages published after date |
| `--require-hashes` | Require hash checks |

### `uv pip compile` — Compile requirements to lockfile format

```bash
uv pip compile [OPTIONS] <SRC_FILES>...
```

| Flag | Description |
|------|-------------|
| `-o`, `--output-file <FILE>` | Output file |
| `--constraint <FILE>` | Constraints file |
| `--override <FILE>` | Overrides file |
| `--extra <EXTRA>` | Include optional extra |
| `--all-extras` | Include all extras |
| `--group <GROUP>` | Include dependency group |
| `--index-url <URL>` | Index URL |
| `--extra-index-url <URL>` | Extra index URL |
| `--find-links <URL>` | Additional locations |
| `--resolution <STRATEGY>` | Strategy: `highest`, `lowest`, `lowest-direct` |
| `--prerelease <STRATEGY>` | Policy: `allow`, `deny`, `if-necessary`, `explicit` |
| `--universal` | Universal resolution (platform-independent) |
| `--generate-hashes` | Generate hashes in output |
| `--upgrade` | Upgrade all |
| `--upgrade-package <PACKAGE>` | Upgrade specific package |
| `--exclude-newer <DATE>` | Exclude newer than date |
| `--python <VERSION>` | Python version |
| `--python-platform <PLATFORM>` | Target platform |

### `uv pip sync` — Sync environment with requirements file

```bash
uv pip sync [OPTIONS] <SRC_FILES>...
```

| Flag | Description |
|------|-------------|
| `--system` | Use system Python |
| `--target <DIR>` | Install to directory |
| `--no-build` | Don't build source distributions |
| `--no-binary` | Don't use pre-built wheels |
| `--only-binary` | Use only pre-built wheels |
| `--reinstall` | Reinstall all |
| `--compile-bytecode` | Compile bytecode |
| `--exclude-newer <DATE>` | Exclude newer than date |
| `--break-system-packages` | Allow modifying system packages |

### `uv pip freeze` — List installed packages (requirements format)

```bash
uv pip freeze [OPTIONS]
```

### `uv pip list` — List installed packages

```bash
uv pip list [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--format <FORMAT>` | Output format: `columns`, `json`, `freeze` |
| `--outdated` | Show outdated packages |
| `--editable` | Show only editable packages |
| `--exclude <PACKAGE>` | Exclude package |
| `--python <VERSION>` | Python version |
| `--system` | Use system Python |

### `uv pip show` — Show package details

```bash
uv pip show [OPTIONS] <PACKAGES>...
```

| Flag | Description |
|------|-------------|
| `--files` | Show installed files |
| `--python <VERSION>` | Python version |
| `--system` | Use system Python |

### `uv pip uninstall` — Uninstall packages

```bash
uv pip uninstall [OPTIONS] <PACKAGES>...
```

| Flag | Description |
|------|-------------|
| `-r`, `--requirement <FILE>` | Uninstall from file |
| `--system` | Use system Python |
| `--break-system-packages` | Allow modifying system packages |

### `uv pip check` — Verify environment has consistent dependencies

```bash
uv pip check [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--system` | Check system Python |
| `--python <VERSION>` | Python version |

---

## 6. Cache Management

### `uv cache clean` — Clear cache

```bash
uv cache clean [OPTIONS] [PACKAGE]
```

| Flag | Description |
|------|-------------|
| `--force` | Ignore file locks |

Pass a package name to clear only that package's cached data.

### `uv cache prune` — Prune stale entries

```bash
uv cache prune [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--ci` | CI-optimized: remove pre-built wheels and unzipped sdists, keep source-built wheels |
| `--force` | Ignore file locks |

### `uv cache dir` — Show cache directory path

```bash
uv cache dir
```

### `uv cache size` — Show cache size

```bash
uv cache size
```

---

## 7. Configuration & Environment

### Configuration Files

uv reads configuration from these locations (later files override earlier ones):

- **Project-level**: `pyproject.toml` (`[tool.uv]` section) or `uv.toml` in project root
- **User-level**: `~/.config/uv/uv.toml` (macOS/Linux) or `%APPDATA%\uv\uv.toml` (Windows)
- **Explicit**: `--config-file <PATH>` flag

### Key `uv.toml` / `pyproject.toml` Settings

| Setting | Description |
|---------|-------------|
| `cache-dir` | Path to cache directory |
| `index-url` | Default index URL |
| `extra-index-url` | Additional index URLs |
| `find-links` | Additional locations to search |
| `python-preference` | Preference: `managed`, `system`, `only-managed`, `only-system` |
| `python-downloads` | Allow automatic Python downloads |
| `offline` | Disable network access |
| `no-build` | Don't build source distributions |
| `no-binary` | Don't use wheels |
| `no-index` | Don't use index |
| `prerelease` | Prerelease policy (`allow`, `deny`, `if-necessary`, `explicit`) |
| `resolution` | Resolution strategy (`highest`, `lowest`, `lowest-direct`) |
| `fork-strategy` | Version selection strategy for forks |
| `index-strategy` | Multi-index resolution strategy |
| `link-mode` | Package install method (`clone`, `hardlink`, `symlink`, `copy`) |
| `compile-bytecode` | Compile .py to .pyc after install |
| `exclude-newer` | Exclude packages newer than a date |
| `add-bounds` | Default version bound: `lower`, `major`, `minor`, `exact` |
| `native-tls` | Use native TLS certificate store |
| `required-version` | Require specific uv version |
| `publish-url` | Default publish URL |
| `keyring-provider` | Keyring for authentication |
| `preview` | Enable preview features |

### Key Environment Variables

| Variable | Equivalent Flag | Description |
|----------|----------------|-------------|
| `UV_PROJECT_ENVIRONMENT` | — | Path to project virtual environment |
| `UV_SYSTEM_PYTHON` | `--system` | Use system Python |
| `UV_PYTHON_PREFERENCE` | — | Python version preference |
| `UV_CACHE_DIR` | `--cache-dir` | Cache directory path |
| `UV_INDEX_URL` | `--index-url` | Default index URL |
| `UV_DEFAULT_INDEX` | `--default-index` | Default index URL |
| `UV_EXTRA_INDEX_URL` | `--extra-index-url` | Extra index URLs |
| `UV_BREAK_SYSTEM_PACKAGES` | `--break-system-packages` | Allow system package modification |
| `UV_OFFLINE` | `--offline` | Disable network access |
| `UV_LOCKED` | `--locked` | Assert lockfile unchanged |
| `UV_FROZEN` | `--frozen` | Don't update lockfile |
| `UV_REINSTALL` | `--reinstall` | Reinstall all packages |
| `UV_UPGRADE` | `--upgrade` | Upgrade all packages |
| `UV_NO_CACHE` | `--no-cache` | Disable cache |
| `UV_NO_SYNC` | `--no-sync` | Skip environment sync |
| `UV_NO_DEV` | `--no-dev` | Exclude dev dependencies |
| `UV_NO_BUILD` | `--no-build` | Don't build source distributions |
| `UV_NO_BINARY` | `--no-binary` | Don't use wheels |
| `UV_PYTHON` | `--python` | Python interpreter path/version |
| `UV_PYTHON_INSTALL_DIR` | — | Managed Python installation directory |
| `UV_PYTHON_INSTALL_MIRROR` | — | Mirror for Python downloads |
| `UV_TOOL_DIR` | — | Tools installation directory |
| `UV_TOOL_BIN_DIR` | — | Tool executable directory |
| `UV_INDEX` | `--index` | Additional index URLs |
| `UV_SYSTEM_CERTS` | `--system-certs` | Use system TLS certificate store |
| `UV_CONFIG_FILE` | `--config-file` | Config file path |
| `UV_RESOLUTION` | `--resolution` | Resolution strategy |
| `UV_PRERELEASE` | `--prerelease` | Prerelease policy |
| `UV_LINK_MODE` | `--link-mode` | Package link mode |
| `UV_CONSTRAINT` | `--constraint` | Constraints file(s) |
| `UV_EXCLUDE_NEWER` | `--exclude-newer` | Cutoff for package publication date |
| `UV_REQUIRE_HASHES` | `--require-hashes` | Require hash verification |
| `UV_WORKING_DIR` | `--directory` | Working directory |
| `UV_PROJECT` | `--project` | Project directory |

Environment variables override both config files and matching CLI flags.

---

## 8. Key Flags (Cross-Cutting)

These flags work across multiple uv commands:

### Dependency Groups

| Flag | Applies To | Description |
|------|------------|-------------|
| `--dev` | `add`, `remove`, `sync`, `run`, `export` | Include/exclude dev dependencies |
| `--group <NAME>` | `sync`, `run`, `export`, `pip compile`, `pip install` | Include specific dependency group |
| `--no-group <NAME>` | `sync`, `run`, `export` | Exclude specific dependency group |
| `--all-groups` | `sync`, `run`, `export` | Include all dependency groups |
| `--optional <NAME>` | `add`, `remove` | Add/remove optional dependency |
| `--extra <EXTRA>` | `sync`, `run`, `export`, `pip install`, `pip compile` | Include optional extra |
| `--all-extras` | `sync`, `run`, `export`, `pip install`, `pip compile` | Include all extras |

### Lockfile Behavior

| Flag | Applies To | Description |
|------|------------|-------------|
| `--frozen` | `sync`, `run`, `lock`, `add`, `remove`, `export`, `tree` | Run without updating lockfile; error if lockfile missing |
| `--locked` | `sync`, `run`, `lock`, `add`, `remove`, `export` | Assert lockfile remains unchanged; error if out of date |
| `--no-sync` | `add`, `remove`, `run` | Skip updating the environment |

### Upgrade / Reinstall

| Flag | Applies To | Description |
|------|------------|-------------|
| `--upgrade` | `sync`, `lock`, `add`, `pip install` | Allow upgrading all packages to latest |
| `--upgrade-package <PKG>` | `sync`, `lock`, `add`, `pip install` | Allow upgrading a specific package |
| `--reinstall` | `sync`, `pip install`, `tool install` | Reinstall all packages |
| `--reinstall-package <PKG>` | `sync`, `pip install`, `tool install` | Reinstall a specific package |

### Build Constraints

| Flag | Applies To | Description |
|------|------------|-------------|
| `--no-build` | Most commands | Don't build source distributions; use only pre-built wheels |
| `--no-binary <PKG>` | `sync`, `pip install` | Don't use wheels for given package (`:all:`, `:none:`) |
| `--only-binary <PKG>` | `sync`, `pip install` | Only use wheels for given package (`:all:`, `:none:`) |
| `--no-build-isolation` | `sync`, `pip install` | Skip build isolation (build in system env) |

### Index / Network

| Flag | Applies To | Description |
|------|------------|-------------|
| `--index-url <URL>` | Most commands | Default package index |
| `--extra-index-url <URL>` | Most commands | Extra indexes (higher priority) |
| `--find-links <URL>` | Most commands | Additional flat package locations |
| `--no-index` | Most commands | Don't use index at all |
| `--offline` | Most commands | Disable network; use only cached data |

### Python Selection

| Flag | Applies To | Description |
|------|------------|-------------|
| `--python <VERSION/INTERPRETER>` | Most commands | Python version or interpreter path |
| `--python-platform <PLATFORM>` | `pip compile`, `pip install` | Target platform (e.g., `x86_64-apple-darwin`) |
| `--python-version <VERSION>` | `pip compile`, `pip install` | Target Python version for resolution |

### Cache

| Flag | Applies To | Description |
|------|------------|-------------|
| `--no-cache` (`-n`) | All commands | Don't read/write cache (use temp directory) |
| `--cache-dir <DIR>` | All commands | Custom cache directory path |
| `--refresh` | Most commands | Refresh cached data for all packages |
| `--refresh-package <PKG>` | Most commands | Refresh cached data for a specific package |

### Miscellaneous

| Flag | Applies To | Description |
|------|------------|-------------|
| `--compile-bytecode` | `sync`, `run`, `pip install` | Compile .py -> .pyc after install |
| `--exclude-newer <DATE>` | Most resolution commands | Exclude packages published after date |
| `--require-hashes` | `pip install`, `pip sync` | Require hash verification for all packages |
| `--system-certs` | Many commands | Use system certificate store |
| `--system` | `pip` commands | Use system Python (ignore virtualenv) |
| `--break-system-packages` | `pip install/uninstall` | Allow breaking system packages (bypass PEP 668) |
| `--verbose`, `-v` | All | Verbose output |
| `--quiet`, `-q` | All | Quiet output |
| `--color <WHEN>` | All | Color output: `auto`, `always`, `never` |
| `--no-progress` | All | Suppress progress indicators |

---

<!--
  Reference validation: every flag and option listed above was verified
  against uv 0.11.x behavior in June 2026. Flags that do not exist have
  been excluded. If you find an error, open a PR against this file.
-->
