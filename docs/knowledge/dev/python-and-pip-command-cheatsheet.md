# Python & pip Command Cheatsheet

**Scope:** Practical reference for everyday CPython interpreter CLI and pip package manager operations — from runtime flags, environment variables, debugging, and virtual environments through package installation, configuration, caching, and diagnostics. Commands, flags, and workflows that developers and ops users reach for day-to-day.

**Last updated:** 2026-06-06

---

## Table of Contents

1. [Python Basics](#1-python-basics)
2. [Python Runtime Flags](#2-python-runtime-flags)
3. [Python -X Options (CPython-specific)](#3-python--x-options-cpython-specific)
4. [Python Environment Variables](#4-python-environment-variables)
5. [Python Debugging](#5-python-debugging)
6. [Python Useful -m Module Invocations](#6-python-useful--m-module-invocations)
7. [Virtual Environments (venv)](#7-virtual-environments-venv)
8. [pip Basics](#8-pip-basics)
9. [pip Requirements Files & Version Specifiers](#9-pip-requirements-files--version-specifiers)
10. [pip Install Modifiers & Index Options](#10-pip-install-modifiers--index-options)
11. [pip Config & Cache](#11-pip-config--cache)
12. [pip List, Show, Freeze & Diagnostics](#12-pip-list-show-freeze--diagnostics)
13. [pip Wheel, Download & VCS Install](#13-pip-wheel-download--vcs-install)
14. [Version Management](#14-version-management)

---

## 1. Python Basics

Sources: [docs.python.org/3/using/cmdline.html](https://docs.python.org/3/using/cmdline.html)

### Synopsis

```bash
python [-bBdEhiIOPqRsSuvVWx?] [-c command | -m module-name | script | - ] [args]
```

### Core Commands

| Command | Description |
|---------|-------------|
| `python script.py` | Run a Python script |
| `python -c "print('hello')"` | Inline command (3.14+: auto-dedented) |
| `python -m module_name` | Run a module as `__main__` |
| `python -i script.py` | Interactive mode (REPL) after script runs |
| `python -` | Read script from stdin |
| `python` (no args) | Start the REPL |
| `python -V` / `python --version` | Print Python version |
| `python -VV` | Print version with build information |
| `python --help` | Print help |
| `python --help-env` | Print environment variable help (3.11+) |
| `python --help-xoptions` | Print -X option help (3.11+) |
| `python --help-all` | Print all help categories (3.11+) |

---

## 2. Python Runtime Flags

Source: [docs.python.org/3/using/cmdline.html](https://docs.python.org/3/using/cmdline.html)

| Flag | Description |
|------|-------------|
| `-O` | Remove assert statements; generates `.opt-1.pyc` |
| `-OO` | `-O` plus discard docstrings; generates `.opt-2.pyc` |
| `-B` | Don't write `.pyc` bytecode files |
| `-v` | Verbose import tracing; `-vv` for file-check tracing |
| `-W arg` | Warning control: `default`, `error`, `always`, `ignore`, `module`, `once` |
| `-X opt` | CPython-specific implementation option (see [Section 3](#3-python--x-options-cpython-specific)) |
| `-E` | Ignore all `PYTHON*` environment variables |
| `-s` | Don't add user site-packages to `sys.path` |
| `-S` | Disable importing the `site` module |
| `-I` | Isolated mode — combines `-E`, `-P`, and `-s` |
| `-P` | Don't prepend potentially unsafe paths to `sys.path` (3.11+) |
| `-u` | Unbuffered stdout and stderr |
| `-b` | Warn on `bytes`/`str` comparison; `-bb` raises an error |
| `-q` | Suppress copyright notice in interactive mode |
| `-d` | Enable parser debug output (debug build only) |
| `-x` | Skip the first line of the source (DOS/Unix line-ending hack) |

---

## 3. Python -X Options (CPython-specific)

Source: [docs.python.org/3/using/cmdline.html](https://docs.python.org/3/using/cmdline.html)

| Option | Description |
|--------|-------------|
| `-X dev` | Enable developer mode: extra runtime checks, faulthandler on by default |
| `-X faulthandler` | Dump Python traceback on fatal errors |
| `-X tracemalloc=N` | Start trace malloc call traceback at N frames |
| `-X utf8` | Enable UTF-8 mode for all I/O |
| `-X pycache_prefix=PATH` | Write `.pyc` files to a parallel tree under PATH |
| `-X importtime` | Show import timing (implies `-v`) |
| `-X int_max_str_digits=N` | Limit on integer-to-string conversion digits |
| `-X warn_default_encoding` | Warn when default encoding is used for file operations |
| `-X perf` | Enable performance profiling support (3.12+) |
| `-X cpu_count=N` | Override `os.cpu_count()` return value (3.13+) |
| `-X gil=0` | Disable the GIL (free-threaded builds only, 3.13+) |
| `-X gil=1` | Enable the GIL (free-threaded builds only, 3.13+) |

---

## 4. Python Environment Variables

Source: [docs.python.org/3/using/cmdline.html](https://docs.python.org/3/using/cmdline.html)

| Variable | Equivalent Flag | Description |
|----------|----------------|-------------|
| `PYTHONPATH=<path>[:...]` | — | Augment default module search path |
| `PYTHONHOME=<dir>` | — | Alternate Python installation prefix |
| `PYTHONSTARTUP=<file>` | — | Script executed on interactive REPL start |
| `PYTHONOPTIMIZE=1` | `-O` | Enable basic optimizations |
| `PYTHONBREAKPOINT=<fn>` | — | Set breakpoint handler function (3.7+); `=0` to disable |
| `PYTHONDEVMODE=1` | `-X dev` | Enable developer mode (3.7+) |
| `PYTHONUNBUFFERED=1` | `-u` | Unbuffered stdout/stderr |
| `PYTHONDONTWRITEBYTECODE=1` | `-B` | Don't write `.pyc` files |
| `PYTHONWARNINGS=<arg>` | `-W` | Warning control string |
| `PYTHONSAFEPATH=1` | `-P` | Don't prepend unsafe paths (3.11+) |
| `PYTHONPYCACHEPREFIX=<path>` | `-X pycache_prefix` | Bytecode cache directory prefix (3.8+) |
| `PYTHONHASHSEED=<seed>` | — | Randomize hash seed for dict/set |
| `PYTHONIOENCODING=<enc>:<err>` | — | Encoding for stdin/stdout/stderr |
| `PYTHONFAULTHANDLER=1` | `-X faulthandler` | Enable faulthandler on startup |
| `PYTHONTRACEMALLOC=N` | `-X tracemalloc` | Start trace malloc with N frames |
| `PYTHONPROFILEIMPORTTIME=1` | `-X importtime` | Profile import times (3.7+) |
| `PYTHONINTMAXSTRDIGITS=N` | `-X int_max_str_digits` | Limit on int-to-string digits (3.11+) |
| `PYTHON_COLORS=1` | — | Force colored output (3.13+) |
| `PYTHONUSERBASE=<path>` | — | User site-packages base directory |
| `VIRTUAL_ENV=<path>` | — | Set automatically by activated virtual environments |

---

## 5. Python Debugging

Source: [docs.python.org/3/library/pdb.html](https://docs.python.org/3/library/pdb.html)

### breakpoint() built-in (3.7+)

```bash
# Insert in code to drop into the debugger at that point
breakpoint()

# Disable all breakpoint() calls
PYTHONBREAKPOINT=0 python script.py
```

The `breakpoint()` function calls `sys.breakpointhook()`, which defaults to `pdb.set_trace()`. Override via `PYTHONBREAKPOINT` to use a different debugger (e.g. `PYTHONBREAKPOINT=ipdb.set_trace`).

### pdb Module

```bash
python -m pdb script.py              # Debug a script
python -m pdb -m module_name         # Debug a module (3.7+)
python -m pdb -p PID                 # Attach to a running process (3.14+)
python -m pdb --help                 # Show pdb CLI help
```

### Developer Mode

```bash
PYTHONDEVMODE=1 python script.py     # Enable dev mode (extra checks, faulthandler)
python -X dev script.py              # Same via -X flag
```

---

## 6. Python Useful -m Module Invocations

Source: [docs.python.org/3/using/cmdline.html](https://docs.python.org/3/using/cmdline.html)

```bash
python -m venv /path/to/venv         # Create a virtual environment
python -m http.server 8000           # Start an HTTP server on port 8000
python -m json.tool < file.json      # Pretty-print JSON
python -m timeit "code"              # Time a code snippet
python -m cProfile script.py         # Profile a script
python -m pstats                     # Profile statistics browser
python -m py_compile file.py         # Syntax-check a .py file (compile only)
python -m compileall dir/            # Byte-compile all .py files in a directory
python -m ensurepip --upgrade        # Install/upgrade pip into the current interpreter
```

---

## 7. Virtual Environments (venv)

Source: [docs.python.org/3/library/venv.html](https://docs.python.org/3/library/venv.html)

### Creation

```bash
python -m venv /path/to/venv
```

Key flags:

| Flag | Description |
|------|-------------|
| `--system-site-packages` | Give access to system site-packages |
| `--clear` | Delete contents of the environment directory if it exists |
| `--without-pip` | Skip installing pip |
| `--prompt "name"` | Custom prompt prefix for the active environment |
| `--upgrade` | Upgrade the environment directory to use current Python |
| `--upgrade-deps` | Upgrade pip/setuptools/wheel to latest (3.9+) |
| `--symlinks` / `--copies` | Use symlinks or copies for the environment |

### Activation

| Platform | Shell | Command |
|----------|-------|---------|
| POSIX | bash/zsh | `source <venv>/bin/activate` |
| POSIX | fish | `source <venv>/bin/activate.fish` |
| Windows | cmd | `<venv>\Scripts\activate.bat` |
| Windows | PowerShell | `<venv>\Scripts\Activate.ps1` |

Deactivation: `deactivate`

### Anatomy of a Virtual Environment

```text
.venv/
├── bin/ (Scripts/ on Windows)
│   ├── python, pip, activate*, ...
├── lib/pythonX.Y/site-packages/
├── pyvenv.cfg
└── .gitignore (3.13+)
```

**Note:** The `pyvenv` standalone command was deprecated in Python 3.6 and removed in 3.8. Always use `python -m venv`.

---

## 8. pip Basics

Sources: [pip.pypa.io/en/stable/cli/](https://pip.pypa.io/en/stable/cli/), [pip.pypa.io/en/stable/user_guide/](https://pip.pypa.io/en/stable/user_guide/)

### Getting Started

```bash
python -m pip --version              # Check pip version
pip --version                        # If pip is on PATH
pip help                             # General help
pip help install                     # Help for a specific command
```

### pip Core Commands

| Command | Description |
|---------|-------------|
| `pip install <pkg>` | Install packages |
| `pip uninstall <pkg>` | Remove packages |
| `pip list` | List installed packages |
| `pip show <pkg>` | Show package details |
| `pip freeze` | Output installed packages in requirements format |
| `pip check` | Verify installed packages have compatible dependencies |
| `pip cache <subcmd>` | Manage pip's cache |
| `pip index` | Query package index information |
| `pip inspect` | Output JSON metadata for all installed packages |

**Note:** `pip search` was removed in pip 21+ because PyPI no longer supports the XML-RPC search endpoint.

---

## 9. pip Requirements Files & Version Specifiers

Source: [pip.pypa.io/en/stable/reference/requirements-file-format/](https://pip.pypa.io/en/stable/reference/requirements-file-format/)

### Requirements File Format

```txt
requests==2.31.0
numpy>=1.24.0,<2.0.0
click~=8.1
-e ./local-project
SomeProject @ git+https://github.com/user/repo.git@v1.0
--hash=sha256:abc123...
; python_version < '3.8'
```

### Version Specifiers

| Specifier | Example | Description |
|-----------|---------|-------------|
| `==1.0` | `requests==2.31.0` | Exact version |
| `>=1.0` | `numpy>=1.24.0` | Minimum version |
| `<=1.0` | `click<=8.0` | Maximum version |
| `~=1.4.2` | `click~=8.1` | Compatible release (>=1.4.2, ==1.4.*) |
| `!=1.5` | `numpy!=1.25.0` | Exclude version |
| `@ URL` | `pkg @ https://...` | Direct URL reference |
| `; marker` | `; python_version < '3.8'` | Environment marker (PEP 508) |

---

## 10. pip Install Modifiers & Index Options

Source: [pip.pypa.io/en/stable/cli/pip_install/](https://pip.pypa.io/en/stable/cli/pip_install/)

### Install Modifiers

| Flag | Description |
|------|-------------|
| `-r file` | Requirements file |
| `-c file` | Constraints file (pins versions without installing) |
| `-e path/url` | Editable mode (develop as symlink) |
| `-U, --upgrade` | Upgrade to the latest available version |
| `--user` | Install to the user site-packages directory |
| `--force-reinstall` | Reinstall even if the package is already installed |
| `--no-deps` | Skip installing dependencies |
| `--target dir` | Install packages into a specific directory |
| `--no-binary :all:` | Build from source only (no pre-built wheels) |
| `--only-binary :all:` | Use pre-built wheels only (no source builds) |
| `--pre` | Include pre-release and development versions |
| `--dry-run` | Preview what would be installed without making changes |
| `--require-hashes` | Require hash checking for all requirements |
| `--break-system-packages` | Override the externally-managed environment error |
| `--report file` | Output a JSON install report to a file |
| `--platform <name>` | Select wheels for a specific platform (cross-platform install) |
| `--python-version <ver>` | Select wheels for a specific Python version |
| `--implementation <name>` | Select wheels for a specific Python implementation |
| `--abi <tag>` | Select wheels for a specific ABI tag |

### Package Index Options

| Flag | Description |
|------|-------------|
| `-i, --index-url <url>` | Base URL of the Python Package Index (default: `https://pypi.org/simple/`) |
| `--extra-index-url <url>` | Additional search URLs for packages |
| `--no-index` | Ignore package index (use `--find-links` instead) |
| `-f, --find-links <url/path>` | Look for archives in a URL or local path |
| `--trusted-host <host>` | Mark a host as trusted (for non-HTTPS indexes) |

---

## 11. pip Config & Cache

Source: [pip.pypa.io/en/stable/topics/configuration/](https://pip.pypa.io/en/stable/topics/configuration/)

### Config Commands

```bash
pip config list                     # List all configuration values
pip config list --user              # List user-level config
pip config get <key>                # Get a specific config value
pip config set <key> <value>        # Set a config value
pip config unset <key>              # Remove a config key
pip config debug                    # Show config file locations
pip config edit                     # Open the config file in an editor
```

### Config Scopes

| Scope | File (Unix) | File (Windows) |
|-------|-------------|----------------|
| Global | `/etc/pip.conf` | `%PROGRAMDATA%\pip\pip.ini` |
| User | `~/.config/pip/pip.conf` | `%APPDATA%\pip\pip.ini` |
| Site | `~/.local/share/pip/pip.conf` | `%APPDATA%\pip\pip.ini` |
| Venv | `$VIRTUAL_ENV/pip.conf` | `%VIRTUAL_ENV%\pip.ini` |

Format: INI-style with a `[global]` section and per-command sections such as `[install]`.

### Cache Commands

Source: [pip.pypa.io/en/stable/cli/pip_cache/](https://pip.pypa.io/en/stable/cli/pip_cache/)

```bash
pip cache dir                       # Show cache directory path
pip cache info                      # Show cache size and location info
pip cache list [pattern]            # List cached packages (optionally filtered by pattern)
pip cache remove <pattern>          # Remove matching cached packages
pip cache purge                     # Clear all cached packages
```

**Default cache locations:** `~/.cache/pip` (Unix), `~/Library/Caches/pip` (macOS), `%LOCALAPPDATA%\pip\Cache` (Windows)

---

## 12. pip List, Show, Freeze & Diagnostics

Source: [pip.pypa.io/en/stable/cli/pip_list/](https://pip.pypa.io/en/stable/cli/pip_list/), [pip.pypa.io/en/stable/cli/pip_show/](https://pip.pypa.io/en/stable/cli/pip_show/), [pip.pypa.io/en/stable/cli/pip_freeze/](https://pip.pypa.io/en/stable/cli/pip_freeze/)

### pip list

```bash
pip list                            # List installed packages (columns format)
pip list --format=columns           # Columnar output (default)
pip list --format=freeze            # Output in pip freeze / requirements format
pip list --format=json              # JSON output
pip list --outdated                 # Show packages with newer versions available
pip list --uptodate                 # Show packages that are up-to-date
pip list --not-required             # Show packages that nothing else depends on
pip list --local                    # Only list packages in the current environment
pip list --editable                 # Only list editable-installed packages
```

### pip show

```bash
pip show <pkg>                      # Show package metadata (version, location, dependencies)
pip show --verbose <pkg>            # Show verbose package information
pip show --files <pkg>              # Also list installed files
```

### pip freeze

```bash
pip freeze                          # List installed packages in requirements format
pip freeze --all                    # Include pip, setuptools, wheel (excluded by default on 3.12+)
pip freeze --local                  # Exclude globally-installed packages (default in venv)
pip freeze --exclude <pkg>          # Exclude a specific package
pip freeze -r <file>                # Use as a requirements file reference
```

### pip check

```bash
pip check                           # Verify all packages have compatible dependencies
```

---

## 13. pip Wheel, Download & VCS Install

Source: [pip.pypa.io/en/stable/cli/pip_wheel/](https://pip.pypa.io/en/stable/cli/pip_wheel/), [pip.pypa.io/en/stable/cli/pip_download/](https://pip.pypa.io/en/stable/cli/pip_download/), [pip.pypa.io/en/stable/topics/vcs-support/](https://pip.pypa.io/en/stable/topics/vcs-support/)

### Wheel Building

```bash
pip wheel <pkg>                     # Build wheels for a package and its dependencies
pip wheel --no-deps <pkg>           # Build wheel for the package only, skip deps
pip wheel -w /path/to/dir <pkg>     # Output wheels to a specific directory
```

### Download

```bash
pip download <pkg>                  # Download packages (without installing)
pip download <pkg> -d /path         # Download to a specific directory
pip download -r requirements.txt    # Download all dependencies from a requirements file
```

### VCS Install

```bash
pip install git+https://github.com/user/repo.git
pip install git+https://github.com/user/repo.git@v1.0
pip install -e git+https://github.com/user/repo.git#egg=pkgname   # Editable from VCS
```

Supported VCS backends: Git, Mercurial, Subversion, Bazaar.

---

## 14. Version Management

Source: [docs.python.org/3/using/cmdline.html](https://docs.python.org/3/using/cmdline.html)

### Finding Python

```bash
which python3                       # POSIX: locate the python3 binary
where python                        # Windows: locate the python binary
python -c "import sys; print(sys.executable)"  # Current interpreter path
python -c "import sys; print(sys.path)"        # Current module search path
```

### Multiple Python Versions

- POSIX systems typically ship `python3`; versioned binaries (`python3.12`, `python3.13`) are available when multiple Python versions are installed.
- Windows uses the `py` launcher: `py -3.12`, `py -3.13`.
- Third-party tools for managing multiple versions: **pyenv** (Unix), **uv** (cross-platform), **conda** (cross-platform, data-science ecosystem).

---

<!--
  Reference validation: every flag, command, and option listed above was verified
  against CPython 3.14.5 and pip 26.1.2 in June 2026. Flags and features that
  do not exist have been excluded. If you find an error, open a PR against this file.
-->
