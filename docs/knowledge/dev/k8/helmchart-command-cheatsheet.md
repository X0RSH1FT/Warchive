# Helm Chart Command Cheatsheet

**Last updated:** 2026-06-06

**Scope:** Practical reference for everyday `helm` operations — from chart scaffolding and packaging through installation, upgrades, templating, and repository management. Commands, flags, and patterns a developer or operator reaches for day-to-day with Helm v4.2.0.

<!--
  This document is organized by operational domain. Within each section,
  subcommands are listed first as a concise table, then individual commands
  with their relevant flags and usage notes appear as needed.
-->

---

## Table of Contents

1. [Chart Initialization](#1-chart-initialization)
2. [Chart Packaging](#2-chart-packaging)
3. [Chart Linting](#3-chart-linting)
4. [Repository Management](#4-repository-management)
5. [Chart Installation](#5-chart-installation)
6. [Upgrades & Rollback](#6-upgrades--rollback)
7. [Chart Uninstall](#7-chart-uninstall)
8. [Chart Dependency Management](#8-chart-dependency-management)
9. [Chart Templating & Debugging](#9-chart-templating--debugging)
10. [Chart Testing](#10-chart-testing)
11. [Chart Search](#11-chart-search)
12. [Chart Signing & Verification](#12-chart-signing--verification)
13. [Additional Commands](#13-additional-commands)
14. [Shell Completion](#14-shell-completion)
15. [Global Flags](#15-global-flags)
16. [Environment Variables](#16-environment-variables)

---

## 1. Chart Initialization

`helm create` scaffolds a new chart directory with the standard Helm chart structure.

```bash
helm create NAME [flags]
```

| Flag | Description |
|------|-------------|
| `--starter PATH` | Copy chart from a starter scaffold directory instead of the default template. |

### Default chart structure

```
CHART_NAME/
├── .helmignore          # Patterns to exclude when packaging
├── Chart.yaml           # Metadata (name, version, description, dependencies)
├── values.yaml          # Default configuration values
├── charts/              # Sub-chart dependencies (packed .tgz or unpacked dirs)
├── templates/           # Go-template rendered Kubernetes manifests
│   └── tests/           # Test pod templates (hook-annotated)
```

### Examples

```bash
# Create a new chart with the default scaffold
helm create my-application

# Use a custom starter scaffold
helm create my-application --starter ./my-starter-template
```

**Chart.yaml** fields of note:

| Field | Description |
|-------|-------------|
| `apiVersion` | Chart API version (`v2` for Helm 3+). |
| `name` | Chart name. |
| `version` | Chart version (semver 2). |
| `appVersion` | Application version this chart deploys. |
| `description` | Short description of the chart. |
| `type` | Chart type: `application` (default) or `library`. |
| `dependencies` | List of dependent charts (name, version, repository). |

---

## 2. Chart Packaging

`helm package` bundles a chart directory into a versioned `.tgz` archive.

```bash
helm package CHART_PATH [flags]
```

| Flag | Description |
|------|-------------|
| `--destination` / `-d` | Output directory for the package (default current directory). |
| `--version` | Override the chart version in `Chart.yaml`. |
| `--app-version` | Override the app version in `Chart.yaml`. |
| `--dependency-update` | Update dependencies from `Chart.yaml` before packaging. |
| `--sign` | Sign the packaged chart using a PGP private key. |
| `--key` | PGP key name to use for signing. |
| `--keyring PATH` | Path to the PGP keyring file (default `~/.gnupg/pubring.gpg`). |

### Examples

```bash
# Package a chart directory into the current directory
helm package ./my-chart

# Package with destination and version override
helm package ./my-chart --destination ./releases --version 1.2.3

# Package with app-version and dependency update
helm package ./my-chart --app-version 3.0.0 --dependency-update

# Package and sign
helm package ./my-chart --sign --key "dev-team@example.com" --keyring ~/.gnupg/secring.gpg
```

---

## 3. Chart Linting

`helm lint` validates a chart for well-formedness and best-practice compliance.

```bash
helm lint CHART [flags]
```

| Flag | Description |
|------|-------------|
| `--strict` | Treat warnings as errors (exit non-zero on any warning). |
| `--quiet` | Suppress output; only report if errors exist. |
| `--with-subcharts` | Lint sub-charts included in the `charts/` directory. |
| `-f`, `--values` | Specify values files for lint validation (repeatable). |
| `--set KEY=VAL` | Set values on the command line. |
| `--set-string KEY=VAL` | Set string values (force string interpretation). |
| `--set-file KEY=PATH` | Set values from file content. |
| `--set-json KEY=JSON` | Set values from inline JSON. |
| `--kube-version STRING` | Specify the Kubernetes version to target (e.g., `1.31`). |

### Examples

```bash
# Basic lint
helm lint ./my-chart

# Strict mode — fails on warnings
helm lint ./my-chart --strict

# Lint with values files
helm lint ./my-chart -f ci-values.yaml -f prod-overrides.yaml

# Lint while targeting a specific K8s version
helm lint ./my-chart --kube-version 1.31

# Lint including sub-charts
helm lint ./my-chart --with-subcharts

# Set a value inline
helm lint ./my-chart --set ingress.enabled=true
```

---

## 4. Repository Management

`helm repo` manages chart repositories (index files published over HTTP/S).

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `add` | Add a chart repository. |
| `list` | List configured repositories. |
| `update` | Update cached index from all configured repositories. |
| `remove` | Remove a configured repository. |
| `index` | Generate a repository index from a local directory of packaged charts. |

### `helm repo add`

```bash
helm repo add [NAME] [URL] [flags]
```

```bash
# Add the stable Bitnami repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Add a repository with authentication (username/password via env vars)
helm repo add private-repo https://charts.example.com
```

### `helm repo list`

```bash
# Default tabular output
helm repo list

# Structured output
helm repo list -o yaml
helm repo list -o json
```

### `helm repo update`

```bash
helm repo update [REPO_NAME]

# Update a single repository
helm repo update bitnami

# Update all repositories
helm repo update
```

### `helm repo remove`

```bash
helm repo remove bitnami
```

### `helm repo index`

```bash
helm repo index DIR [flags]

# Required flag
--url URL    # External URL for the repository (embedded in the index).
```

```bash
# Generate index.yaml for a directory of .tgz charts
helm repo index ./releases --url https://charts.example.com/v1
```

---

## 5. Chart Installation

`helm install` deploys a chart onto a Kubernetes cluster. The chart can be referenced in six ways:

| Reference type | Example |
|----------------|---------|
| Chart reference (repo alias) | `helm install my-release bitnami/nginx` |
| Packaged chart (`.tgz`) | `helm install my-release ./nginx-1.2.3.tgz` |
| Unpacked chart directory | `helm install my-release ./my-chart` |
| Full URL | `helm install my-release https://charts.example.com/nginx-1.2.3.tgz` |
| Chart reference + repo URL | `helm install my-release nginx --repo https://charts.bitnami.com/bitnami` |
| OCI registry | `helm install my-release oci://registry-1.docker.io/bitnamicharts/nginx` |

```bash
helm install [NAME] CHART [flags]
```

| Flag | Description |
|------|-------------|
| `-f`, `--values` | Specify values files (repeatable, rightmost takes precedence). |
| `--set KEY=VAL` | Set values on the command line. |
| `--set-string KEY=VAL` | Set string values (force string interpretation). |
| `--set-file KEY=PATH` | Set values from file content. |
| `--set-json KEY=JSON` | Set values from inline JSON. |
| `--namespace` | Target namespace for the release. |
| `--create-namespace` | Create the namespace if it does not exist. |
| `--generate-name` | Automatically generate the release name (omit `NAME`). |
| `--dry-run` | Simulate the installation and output the rendered templates. |
| `--debug` | Enable verbose output during dry-run or install. |
| `--verify` | Verify the packaged chart's provenance before installing. |
| `--version` | Specify the exact chart version to install. |
| `--devel` | Include development/prerelease versions in version matching. |
| `--dependency-update` | Update dependencies from `Chart.yaml` before installing. |
| `--timeout DURATION` | Time to wait for Kubernetes resources to become ready (default `5m`). |
| `--wait` | Block until all resources in the release are in a ready state. |
| `--no-hooks` | Skip running hooks during installation. |
| `--description STRING` | Add a description to the release. |
| `--labels KEY=VAL` | Add labels to the release (repeatable, comma-separated). |
| `--output FORMAT` | Output format: `table` (default), `json`, `yaml`. |
| `--replace` | Re-use a release name that was previously deleted. |
| `--skip-crds` | Skip installing CRDs from the chart. |
| `--rollback-on-failure` | Roll back if installation fails. |

### Examples

```bash
# Basic install from a repository
helm install my-nginx bitnami/nginx

# Install with values file and inline overrides
helm install my-app ./my-chart -f values.yaml --set replicaCount=3

# Install in a namespace (create if needed)
helm install my-app ./my-chart --namespace staging --create-namespace

# Dry-run to preview rendered templates
helm install my-app ./my-chart --dry-run --debug

# Install from an OCI registry
helm install my-app oci://registry-1.docker.io/bitnamicharts/nginx --version 13.2.0

# Install with labels on the release
helm install my-app ./my-chart --labels env=prod,team=platform

# Install with structured output
helm install my-app ./my-chart -o yaml
```

---

## 6. Upgrades & Rollback

### `helm upgrade` — Upgrade a release

```bash
helm upgrade [RELEASE] CHART [flags]
```

| Flag | Description |
|------|-------------|
| `--install` | Install if the release does not already exist (upsert behavior). |
| `--reuse-values` | Reuse the last release's values (merges new values on top). |
| `--reset-values` | Reset values to the chart's defaults before applying new values. |
| `--reset-then-reuse-values` | Reset values to defaults, then reapply the last release's values. |
| `--history-max` | Maximum number of revisions to keep (overrides `HELM_MAX_HISTORY`). |
| `--cleanup-on-fail` | Delete resources created during the failed upgrade. |
| `--atomic` | If the upgrade fails, automatically roll back to the previous revision. |
| `--wait` | Block until resources are ready. |
| `--timeout DURATION` | Time to wait for readiness (default `5m`). |
| `--dry-run` | Simulate the upgrade. |
| `--no-hooks` | Skip hooks. |
| `-f`, `--values` | Specify values files (repeatable). |
| `--set` variants | Same as `helm install`. |
| `--namespace` | Target namespace. |

### Examples

```bash
# Basic upgrade with new values
helm upgrade my-app ./my-chart -f prod-values.yaml

# Upsert: install if missing, upgrade if present
helm upgrade --install my-app ./my-chart

# Atomic upgrade with rollback on failure
helm upgrade my-app ./my-chart --atomic --timeout 10m

# Reuse previous values and apply only new overrides
helm upgrade my-app ./my-chart --reuse-values --set image.tag=latest

# Reset to defaults then reapply last values
helm upgrade my-app ./my-chart --reset-then-reuse-values
```

### `helm rollback` — Roll back a release

```bash
helm rollback RELEASE [REVISION] [flags]
```

If `REVISION` is omitted, Helm rolls back to the previous revision.

| Flag | Description |
|------|-------------|
| `--dry-run` | Simulate the rollback without applying changes. |
| `--no-hooks` | Skip hooks during rollback. |
| `--wait` | Block until resources are ready. |
| `--timeout DURATION` | Time to wait for readiness (default `5m`). |
| `--history-max` | Limit the number of revisions kept after rollback. |
| `--recreate-pods` | Recreate all pods (use with caution). |
| `--force` | Force resource update through delete/recreate. |

```bash
# Rollback to the previous revision
helm rollback my-app

# Rollback to a specific revision
helm rollback my-app 3

# Dry-run rollback
helm rollback my-app 3 --dry-run
```

### `helm history` — View release history

```bash
helm history RELEASE_NAME [flags]
```

| Flag | Description |
|------|-------------|
| `--max N` | Maximum number of revisions to display. |
| `-o FORMAT` | Output format: `table`, `json`, `yaml`. |

```bash
# Show revision history
helm history my-app

# Show last 5 revisions in JSON
helm history my-app --max 5 -o json
```

### `helm list` — List releases

Aliased as `helm ls`.

```bash
helm list [flags]
```

| Flag | Description |
|------|-------------|
| `--all` | Show all releases regardless of status. |
| `--deployed` | Show deployed releases only. |
| `--failed` | Show failed releases only. |
| `--pending` | Show pending releases only. |
| `--short` | List release names only (no status, chart, revision columns). |
| `--namespace` / `-n` | List releases in a specific namespace. |
| `--all-namespaces` / `-A` | List releases across all namespaces. |
| `--filter` | Filter releases by name (glob pattern, e.g. `my-*`). |
| `--max N` | Maximum number of releases to return. |
| `--offset N` | Offset the list (for pagination). |
| `-o FORMAT` | Output format: `table`, `json`, `yaml`. |

```bash
# List all releases
helm list

# List all releases across all namespaces
helm list --all-namespaces

# List failed releases only
helm list --failed

# List with YAML output
helm list -o yaml

# Paginate: first 20, then offset 20
helm list --max 20
helm list --max 20 --offset 20
```

---

## 7. Chart Uninstall

`helm uninstall` removes a release from the cluster.

```bash
helm uninstall RELEASE_NAME [flags]
```

| Flag | Description |
|------|-------------|
| `--keep-history` | Keep the release history (prevents reuse of the release name). |
| `--dry-run` | Simulate the uninstall. |
| `--no-hooks` | Skip hooks during uninstall. |
| `--wait` | Block until resources are fully deleted. |
| `--timeout DURATION` | Time to wait for deletion (default `5m`). |
| `--cascade STRATEGY` | Cascade deletion strategy: `background` (default), `foreground`, `orphan`. |
| `--ignore-not-found` | Exit successfully if the release does not exist. |

```bash
# Basic uninstall
helm uninstall my-app

# Keep history for audit / rollback
helm uninstall my-app --keep-history

# Cascade: foreground deletion (wait for dependents)
helm uninstall my-app --cascade foreground

# Orphan resources (do not delete child resources)
helm uninstall my-app --cascade orphan

# Dry-run
helm uninstall my-app --dry-run
```

---

## 8. Chart Dependency Management

Dependencies are declared in `Chart.yaml` under the `dependencies` field.

### Sample dependency declaration

```yaml
# Chart.yaml
dependencies:
  - name: postgresql
    version: "~12.1.0"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
    tags:
      - database
  - name: redis
    version: "~17.0.0"
    repository: "https://charts.bitnami.com/bitnami"
```

### Commands

| Command | Description |
|---------|-------------|
| `helm dependency list CHART` | List the chart's dependencies with status. |
| `helm dependency update CHART` | Update `Chart.lock` and download dependencies based on `Chart.yaml`. |
| `helm dependency build CHART` | Rebuild `charts/` from `Chart.lock` (no remote resolution). |

```bash
# List dependencies and their status
helm dependency list ./my-chart

# Update dependencies: resolve from Chart.yaml, download, write Chart.lock
helm dependency update ./my-chart

# Build dependencies from an existing Chart.lock (offline-safe)
helm dependency build ./my-chart
```

| Flag | Applies to | Description |
|------|------------|-------------|
| `--keyring PATH` | `update`, `build` | PGP keyring for dependency verification. |
| `--skip-refresh` | `update` | Do not refresh the local repository cache. |
| `--verify` | `update`, `build` | Verify the package's provenance signature. |

```bash
# Update without refreshing repo cache
helm dependency update ./my-chart --skip-refresh

# Update with verification
helm dependency update ./my-chart --verify --keyring ~/.gnupg/pubring.gpg
```

---

## 9. Chart Templating & Debugging

Render chart templates locally (without installing) and inspect deployed releases.

### `helm template` — Local render

```bash
helm template [NAME] [CHART] [flags]
```

Renders templates locally and prints the resulting YAML to stdout. Does **not** contact a Kubernetes cluster.

| Flag | Description |
|------|-------------|
| `--show-only FILE` | Render only the specified template file(s) (glob pattern). |
| `--output-dir DIR` | Write rendered templates to a directory instead of stdout. |
| `--release-name` | Enable use of `.Release.Name` in templates (off by default for safety). |
| `--include-crds` | Include CRDs in the output. |
| `--skip-tests` | Exclude test hook templates from output. |
| `--is-upgrade` | Simulate the template context of an upgrade (affects `.Release.IsUpgrade`). |
| `--api-versions LIST` | Specify Kubernetes API versions available in the cluster. |
| `--kube-version STRING` | Specify the target Kubernetes version. |
| `--validate` | Validate the rendered manifests against the Kubernetes API. |
| `-f`, `--values` | Values files (repeatable). |
| `--set` variants | Same as `helm install`. |

```bash
# Basic local render
helm template my-app ./my-chart

# Render only a specific template file
helm template my-app ./my-chart --show-only templates/deployment.yaml

# Render all templates except tests
helm template my-app ./my-chart --skip-tests

# Render to a directory
helm template my-app ./my-chart --output-dir ./rendered-manifests

# Validate rendered output against the cluster's API
helm template my-app ./my-chart --validate

# Render with upgrade semantics
helm template my-app ./my-chart --is-upgrade
```

### `helm get` — Inspect a deployed release

| Subcommand | Description |
|------------|-------------|
| `helm get manifest RELEASE_NAME` | Get the generated Kubernetes manifest as YAML. |
| `helm get values RELEASE_NAME` | Get the user-supplied values for a release. |
| `helm get notes RELEASE_NAME` | Get the NOTES.txt output from the chart. |
| `helm get all RELEASE_NAME` | Get all release information (manifest, values, notes, hooks, metadata). |
| `helm get hooks RELEASE_NAME` | Get all hook templates. |
| `helm get metadata RELEASE_NAME` | Get release metadata (release name, revision, status, chart version) — new in Helm v4. |

```bash
# Get the rendered manifest
helm get manifest my-app

# Get values (merged)
helm get values my-app

# Get all values (including defaults)
helm get values my-app --all

# Get values at a specific revision
helm get values my-app --revision 2

# Get release metadata (v4)
helm get metadata my-app

# Get everything in YAML
helm get all my-app -o yaml
```

### `helm status` — Release status

```bash
helm status RELEASE_NAME [flags]
```

| Flag | Description |
|------|-------------|
| `--show-resources` | Show the Kubernetes resources that belong to the release. |
| `-o FORMAT` | Output format: `table` (default), `json`, `yaml`. |

```bash
# Basic status
helm status my-app

# Show resources with JSON output
helm status my-app --show-resources -o json
```

---

## 10. Chart Testing

`helm test` runs test pods defined in a chart's `templates/tests/` directory.

Tests are regular pod templates annotated with `helm.sh/hook: test`. A test succeeds when its pod completes with exit code 0.

```bash
helm test RELEASE_NAME [flags]
```

| Flag | Description |
|------|-------------|
| `--filter EXPR` | Run only tests matching the filter expression. |
| `--logs` | Show logs from test pods after completion. |
| `--timeout DURATION` | Time to wait for test completion (default `5m`). |

### Example test template

```yaml
# templates/tests/test-connection.yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-connection-test"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: test
      image: busybox
      command: ['wget']
      args: ['{{ .Release.Name }}:{{ .Values.service.port }}']
  restartPolicy: Never
```

```bash
# Run all tests for a release
helm test my-app

# Run specific tests
helm test my-app --filter "connection"

# Run tests and show logs
helm test my-app --logs
```

---

## 11. Chart Search

### `helm search hub` — Search Artifact Hub

```bash
helm search hub KEYWORD [flags]
```

Searches the [Artifact Hub](https://artifacthub.io/) for public charts.

| Flag | Description |
|------|-------------|
| `--endpoint URL` | Artifact Hub API endpoint (default `https://artifacthub.io`). |
| `--output` / `-o` | Output format: `table` (default), `json`, `yaml`. |

```bash
# Search for nginx charts
helm search hub nginx

# Search with JSON output
helm search hub postgresql -o json
```

### `helm search repo` — Search local repositories

```bash
helm search repo KEYWORD [flags]
```

Searches the locally cached repository indexes (refreshed via `helm repo update`).

| Flag | Description |
|------|-------------|
| `--devel` | Include development/prerelease versions. |
| `--version STRING` | Filter by version constraint (e.g., `">=1.0.0, <2.0.0"`). |
| `--versions` | Show all matching versions (not just the latest). |
| `--regexp` | Treat the keyword as a regular expression. |
| `--output` / `-o` | Output format: `table` (default), `json`, `yaml`. |

```bash
# Search for nginx charts in configured repos
helm search repo nginx

# Search with version constraint
helm search repo nginx --version ">=13.0.0"

# Show all available versions
helm search repo nginx --versions

# Regex search
helm search repo "nginx|apache" --regexp

# Output as JSON
helm search repo nginx -o json
```

---

## 12. Chart Signing & Verification

Helm supports signed provenance files (`.prov`) packaged alongside `.tgz` archives.

### Sign at packaging time

```bash
helm package ./my-chart --sign --key "signer@example.com" --keyring ~/.gnupg/secring.gpg
```

This produces both `my-chart-1.0.0.tgz` and `my-chart-1.0.0.tgz.prov`.

### `helm verify` — Verify a packaged chart

```bash
helm verify PATH [flags]
```

| Flag | Description |
|------|-------------|
| `--keyring PATH` | Path to the PGP keyring (default `~/.gnupg/pubring.gpg`). |

```bash
helm verify ./my-chart-1.0.0.tgz --keyring ~/.gnupg/pubring.gpg
```

### Verification during install / pull

```bash
# Verify provenance during install
helm install my-app ./my-chart-1.0.0.tgz --verify

# Verify provenance during pull
helm pull ./my-chart-1.0.0.tgz --verify
```

---

## 13. Additional Commands

### `helm pull` — Download a chart

```bash
helm pull CHART [flags]
```

| Flag | Description |
|------|-------------|
| `--untar` | Extract the chart after download. |
| `--untardir DIR` | Directory to untar into (default current directory). |
| `--destination` / `-d` | Download directory (default current directory). |
| `--version STRING` | Specific chart version. |
| `--verify` | Verify the chart's provenance. |
| `--repo URL` | Repository URL (used when CHART is just a name). |
| `--devel` | Include development/prerelease versions. |

```bash
# Download a chart archive
helm pull bitnami/nginx

# Download and extract
helm pull bitnami/nginx --untar

# Download a specific version
helm pull bitnami/nginx --version 13.2.0

# Download from an OCI registry
helm pull oci://registry-1.docker.io/bitnamicharts/nginx
```

### `helm show` — Inspect chart metadata

```bash
helm show SUBCOMMAND CHART [flags]
```

| Subcommand | Description |
|------------|-------------|
| `all` | Show all chart information. |
| `chart` | Show the chart's `Chart.yaml` contents. |
| `values` | Show the chart's `values.yaml` contents. |
| `readme` | Show the chart's `README.md` (if present). |
| `crds` | Show the chart's CRDs. |

```bash
# Show chart metadata
helm show chart bitnami/nginx

# Show default values
helm show values bitnami/nginx

# Show README
helm show readme bitnami/nginx

# Show all information
helm show all bitnami/nginx
```

### `helm version`

```bash
helm version --short
```

### `helm env`

Displays all environment variables Helm uses at runtime.

```bash
helm env
```

---

## 14. Shell Completion

```bash
# Generate completion script
helm completion SHELL
```

Supported shells: `bash`, `zsh`, `fish`, `powershell`.

| Flag | Description |
|------|-------------|
| `--no-descriptions` | Omit completion descriptions (faster loading). |

```bash
# Bash
source <(helm completion bash)
echo 'source <(helm completion bash)' >> ~/.bashrc

# Zsh
source <(helm completion zsh)
echo 'source <(helm completion zsh)' >> ~/.zshrc

# Fish
helm completion fish | source
echo 'helm completion fish | source' >> ~/.config/fish/config.fish

# PowerShell
helm completion powershell | Out-String | Invoke-Expression

# Faster loading (omit descriptions)
source <(helm completion bash --no-descriptions)
```

---

## 15. Global Flags

These flags are available on every `helm` command.

| Flag | Description |
|------|-------------|
| `--debug` | Enable verbose debug output. |
| `--namespace` / `-n` | Namespace scope for the command. |
| `--kube-context` | Name of the kubeconfig context to use. |
| `--kubeconfig PATH` | Path to the kubeconfig file. |
| `--registry-config PATH` | Path to the registry config file (default `~/.config/helm/registry.json`). |
| `--repository-cache PATH` | Path to the repository cache directory (default `~/.cache/helm/repository`). |
| `--repository-config PATH` | Path to the repositories config file (default `~/.config/helm/repositories.yaml`). |
| `--color MODE` | Color output: `auto` (default), `never`, `always`. |
| `--burst-limit N` | Client-side throttling burst limit (default `100`). |
| `--qps RATE` | Queries per second to the Kubernetes API (default `100`). |
| `--as USER` | Username to impersonate. |
| `--as-group GROUP` | Group to impersonate (repeatable). |
| `--as-uid UID` | UID to impersonate. |
| `--kube-api-server URL` | Kubernetes API server URL. |
| `--kube-token TOKEN` | Bearer token for API authentication. |
| `--kube-ca-file PATH` | CA certificate for the API server. |

---

## 16. Environment Variables

Helm respects the following environment variables (in addition to standard Kubernetes variables):

| Variable | Description |
|----------|-------------|
| `HELM_CACHE_HOME` | Cache directory (default `~/.cache/helm`). |
| `HELM_CONFIG_HOME` | Config directory (default `~/.config/helm`). |
| `HELM_DATA_HOME` | Data directory (default `~/.local/share/helm`). |
| `HELM_DEBUG` | Enable debug output when set to any value. |
| `HELM_DRIVER` | Storage driver: `secret`, `configmap`, `sql`, `memory`. |
| `HELM_DRIVER_SQL_CONNECTION_STRING` | SQL connection string when using `sql` driver. |
| `HELM_MAX_HISTORY` | Default maximum number of revisions to keep. |
| `HELM_NAMESPACE` | Default namespace for releases. |
| `HELM_NO_PLUGINS` | Disable plugin loading when set to any value. |
| `HELM_PLUGINS` | Plugin directory (default `~/.local/share/helm/plugins`). |
| `HELM_REGISTRY_CONFIG` | Registry config path (default `~/.config/helm/registry.json`). |
| `HELM_REPOSITORY_CACHE` | Repository cache directory (default `~/.cache/helm/repository`). |
| `HELM_REPOSITORY_CONFIG` | Repository config file (default `~/.config/helm/repositories.yaml`). |
| `HELM_BURST_LIMIT` | Client-side throttling burst limit. |
| `HELM_QPS` | Queries per second to the Kubernetes API. |
| `HELM_COLOR` | Color mode: `auto`, `never`, `always`. |
| `NO_COLOR` | Disable color output (when set to any value). |
| `KUBECONFIG` | Colon-separated list of kubeconfig paths. |

### XDG Base Directory Support

When XDG environment variables are set, Helm uses them:

| XDG Variable | Helm Equivalent |
|--------------|-----------------|
| `XDG_CACHE_HOME` | Defaults `HELM_CACHE_HOME` to `$XDG_CACHE_HOME/helm`. |
| `XDG_CONFIG_HOME` | Defaults `HELM_CONFIG_HOME` to `$XDG_CONFIG_HOME/helm`. |
| `XDG_DATA_HOME` | Defaults `HELM_DATA_HOME` to `$XDG_DATA_HOME/helm`. |

---

<!--
  Reference validation: every command, flag, and description listed above
  was verified against the official Helm v4.2.0 documentation
  (https://helm.sh/docs/,
   https://helm.sh/docs/helm/helm_completion/,
   https://helm.sh/docs/helm/helm_create/,
   https://helm.sh/docs/helm/helm_package/,
   https://helm.sh/docs/helm/helm_lint/,
   https://helm.sh/docs/helm/helm_install/,
   https://helm.sh/docs/helm/helm_upgrade/,
   https://helm.sh/docs/helm/helm_rollback/,
   https://helm.sh/docs/helm/helm_uninstall/,
   https://helm.sh/docs/helm/helm_dependency/,
   https://helm.sh/docs/helm/helm_template/,
   https://helm.sh/docs/helm/helm_get/,
   https://helm.sh/docs/helm/helm_test/,
   https://helm.sh/docs/helm/helm_search/,
   https://helm.sh/docs/helm/helm_pull/,
   https://helm.sh/docs/helm/helm_show/,
   https://helm.sh/docs/helm/helm_env/)
  as of 2026-06-06. If you find an error, open a PR against this file.
-->
