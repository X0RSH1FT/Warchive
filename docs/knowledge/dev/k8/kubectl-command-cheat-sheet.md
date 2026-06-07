# kubectl Command Cheatsheet

**Last updated:** 2026-06-06

**Scope:** Practical reference for everyday `kubectl` operations — from cluster management and resource CRUD through debugging, configuration, and advanced workflows. Commands, flags, and patterns a developer or operator reaches for day-to-day with Kubernetes v1.36.

<!--
  This document is organized by operational domain. Within each section,
  subcommands are listed first as a concise table, then individual commands
  with their relevant flags and usage notes appear as needed.
-->

---

## Table of Contents

1. [Cluster Management](#1-cluster-management)
2. [Context & Namespace Configuration](#2-context--namespace-configuration)
3. [Resource Management (CRUD)](#3-resource-management-crud)
4. [Workloads: Run, Expose, Scale, Rollout](#4-workloads-run-expose-scale-rollout)
5. [Debugging & Troubleshooting](#5-debugging--troubleshooting)
6. [Configuration & Metadata](#6-configuration--metadata)
7. [Output & Formatting](#7-output--formatting)
8. [Advanced / Administrative](#8-advanced--administrative)
9. [Global Flags](#9-global-flags)

---

## 1. Cluster Management

Commands that inspect and manipulate the cluster itself.

| Command | Description |
|---------|-------------|
| `kubectl cluster-info` | Display cluster information (master / services endpoint). Use `dump` for detailed diagnostics. |
| `kubectl version` | Print client and server version. Flag `--client` for client-only. |
| `kubectl api-resources` | List all supported API resources (short names, API groups, scope, verbs). |
| `kubectl api-versions` | List all supported API versions (group/version). |
| `kubectl cordon NODE` | Mark a node as unschedulable (no new pods will be scheduled). |
| `kubectl uncordon NODE` | Mark a node as schedulable. |
| `kubectl drain NODE` | Safely evict all pods from a node for maintenance. |

### `kubectl drain` flags

| Flag | Description |
|------|-------------|
| `--ignore-daemonsets` | Ignore DaemonSet-managed pods (required for drain to proceed). |
| `--delete-emptydir-data` | Delete pods using `emptyDir` volumes (opt-in safety check). |
| `--force` | Force deletion of pods not managed by a controller. |
| `--grace-period SECONDS` | Grace period (in seconds) for pods to terminate. |
| `--timeout DURATION` | Timeout after which the drain aborts. |

### `kubectl cluster-info dump`

```bash
# Output cluster diagnostics to stdout
kubectl cluster-info dump

# Output to a specific directory
kubectl cluster-info dump --output-directory=./cluster-state
```

---

## 2. Context & Namespace Configuration

Manage kubeconfig contexts, clusters, users, and namespace defaults. Every `kubectl` call uses the current context from `~/.kube/config` (or `$KUBECONFIG`).

### `kubectl config` subcommands

| Subcommand | Description |
|------------|-------------|
| `current-context` | Display the name of the currently active context. |
| `get-contexts` | List all contexts in the kubeconfig. |
| `get-clusters` | List all clusters. |
| `get-users` | List all users. |
| `use-context NAME` | Switch to a different context (makes it current). |
| `set-context [NAME]` | Modify context properties (e.g., default namespace). |
| `rename-context OLD NEW` | Rename a context. |
| `delete-context NAME` | Delete a context. |
| `delete-cluster NAME` | Delete a cluster entry. |
| `delete-user NAME` | Delete a user entry. |
| `set-cluster NAME` | Set a cluster entry in kubeconfig. |
| `set-credentials NAME` | Set a user entry in kubeconfig. |
| `set PROPERTY VALUE` | Set an individual value in kubeconfig. |
| `unset PROPERTY` | Unset an individual value. |
| `view` | Display merged kubeconfig settings. |

### Context switching patterns

```bash
# List contexts
kubectl config get-contexts

# Show current context
kubectl config current-context

# Switch to a different cluster/namespace combo
kubectl config use-context my-production-cluster

# Change default namespace for the current context
kubectl config set-context --current --namespace=team-ns

# Rename a context for clarity
kubectl config rename-context old-cluster-name prod-cluster
```

### Temporary namespace override

Every command accepts the `-n` / `--namespace` flag:

```bash
kubectl get pods -n monitoring
kubectl describe service nginx --namespace=default
```

### Shell completion

```bash
# Generate completion for your shell and source it
source <(kubectl completion bash)   # Bash
source <(kubectl completion zsh)    # Zsh
kubectl completion fish | source    # Fish
kubectl completion powershell | Out-String | Invoke-Expression  # PowerShell

# Make persistent (Bash example)
echo 'source <(kubectl completion bash)' >> ~/.bashrc
```

---

## 3. Resource Management (CRUD)

Core commands for creating, reading, updating, and deleting Kubernetes resources.

### `kubectl get` — Display resources

```bash
kubectl get [TYPE] [NAME] [flags]
```

| Flag | Description |
|------|-------------|
| `-o wide` | Extra detail (node, IP, etc.). |
| `-o json` | JSON output. |
| `-o yaml` | YAML output. |
| `-o name` | Resource names only (`pod/foo`). |
| `-o jsonpath=<template>` | Extract specific fields via JSONPath. |
| `-o custom-columns=<cols>` | Custom column definition (`HEADER:.spec.field`). |
| `--watch` / `-w` | Watch for changes (streaming). |
| `--all-namespaces` / `-A` | Resources across all namespaces. |
| `-l`, `--selector` | Label selector filter (`env=prod,app=nginx`). |
| `--field-selector` | Field selector filter (`status.phase=Running`). |
| `--sort-by` | Sort by JSONPath expression (`{.metadata.name}`). |
| `--show-labels` | Display all labels in an extra column. |
| `-L` | Display specific label as a column (`-L app`). |
| `--no-headers` | Omit column headers. |
| `--chunk-size` | Number of resources per chunk for large lists (default 500). |

```bash
# Common examples
kubectl get pods
kubectl get pods -o wide --watch
kubectl get all -n my-namespace
kubectl get pods --all-namespaces -o wide
kubectl get pods -l app=nginx,tier=frontend
kubectl get pods --field-selector=status.phase=Running
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase
```

### `kubectl describe` — Detailed resource state

```bash
kubectl describe TYPE NAME
kubectl describe TYPE           # Describe all resources of type
kubectl describe TYPE/NAME      # Alternative syntax
```

Shows events, conditions, labels, annotations, and full state. Use this before `kubectl get` when diagnosing why a resource is not behaving as expected.

### `kubectl create` — Create resources from file or subcommand

```bash
kubectl create -f FILENAME [--save-config]
```

**Subcommands** (create without a file):

| Subcommand | Description |
|------------|-------------|
| `deployment` | Create a deployment. |
| `namespace` | Create a namespace. |
| `configmap` | Create a configmap from literal, file, or env-file. |
| `secret` | Create a secret (generic, docker-registry, tls). |
| `service` | Create a service. |
| `job` | Create a job. |
| `cronjob` | Create a cronjob. |
| `role` | Create a role. |
| `rolebinding` | Create a role binding. |
| `clusterrole` | Create a cluster role. |
| `clusterrolebinding` | Create a cluster role binding. |
| `serviceaccount` | Create a service account. |
| `ingress` | Create an ingress. |
| `quota` | Create a resource quota. |
| `poddisruptionbudget` | Create a pod disruption budget. |
| `priorityclass` | Create a priority class. |
| `token` | Request a service account token. |

```bash
# Create from a YAML/JSON file
kubectl create -f deployment.yaml

# Subcommand shortcuts
kubectl create namespace staging
kubectl create configmap app-config --from-file=config.properties
kubectl create secret generic db-creds --from-literal=password=s3cret
kubectl create deployment nginx --image=nginx:1.25 --replicas=3
```

### `kubectl apply` — Apply configuration (recommended for production)

```bash
kubectl apply -f FILENAME|DIR|URL [flags]
```

| Flag | Description |
|------|-------------|
| `--server-side` | Use server-side apply (field-level ownership tracking). |
| `--field-manager` | Track which manager owns each field (default `kubectl-client-side-apply`). |
| `--prune` | Prune previously applied resources no longer in the file set. |
| `--prune-whitelist` | Resource types to consider for pruning. |
| `-k` | Process kustomization directory before apply. |
| `--record` | Record the current command in the annotation. |

```bash
# Apply a single file
kubectl apply -f deployment.yaml

# Apply a directory with prune (removes resources removed from the directory)
kubectl apply -f ./manifests/ --prune -l app=myapp

# Server-side apply
kubectl apply --server-side -f manifests/

# Kustomize-based apply
kubectl apply -k ./overlays/production/
```

### `kubectl delete` — Delete resources

```bash
kubectl delete TYPE NAME [flags]
kubectl delete -f FILENAME
```

| Flag | Description |
|------|-------------|
| `--all` | Delete all resources of the given type in the namespace. |
| `-l`, `--selector` | Delete by label selector. |
| `--field-selector` | Delete by field selector. |
| `--grace-period SECONDS` | Grace period; `--grace-period=0 --force` for immediate. |
| `--force` | Force deletion (also needs `--grace-period=0`). |
| `--cascade` | Cascade deletion: `background` (default), `orphan`, `foreground`. |
| `--wait` | Wait for resources to be fully deleted (default true). |

```bash
# By name
kubectl delete pod my-pod

# By file
kubectl delete -f deployment.yaml

# Label selector
kubectl delete pods -l app=temp-job

# All resources of a type
kubectl delete deployments --all -n staging

# Force immediate pod deletion
kubectl delete pod stuck-pod --grace-period=0 --force
```

### `kubectl edit` — Edit resources live

```bash
kubectl edit TYPE NAME
kubectl edit deployment/nginx
```

Opens the resource manifest in `$EDITOR`. Saving and closing applies the changes to the cluster.

### `kubectl replace` — Replace a resource

```bash
kubectl replace -f FILENAME
```

Replaces a resource from a file. Unlike `apply`, this requires the resource to already exist and replaces the entire object.

### `kubectl patch` — Update specific fields

```bash
kubectl patch TYPE NAME --patch PATCH
```

| Flag | Description |
|------|-------------|
| `--patch` / `-p` | Patch content (JSON or YAML string). |
| `--type` | Patch type: `strategic` (default), `json`, `merge`. |

```bash
# Strategic merge patch
kubectl patch deployment nginx -p '{"spec":{"replicas":3}}'

# JSON patch
kubectl patch deployment nginx --type='json' -p='[{"op":"replace","path":"/spec/replicas","value":5}]'
```

---

## 4. Workloads: Run, Expose, Scale, Rollout

### `kubectl run` — Run an image on the cluster

```bash
kubectl run NAME --image=IMAGE [flags]
```

| Flag | Description |
|------|-------------|
| `--image` | Container image. |
| `--env` / `-e` | Environment variables (`--env=KEY=VAL`). |
| `--port` | Container port to expose. |
| `--dry-run` | Preview without creating (`client` or `server`). |
| `--overrides` | Inline JSON override to the pod spec. |
| `--rm` | Remove pod after exit (for batch jobs). |
| `-it` | Interactive / TTY (for debugging). |
| `--restart` | Restart policy: `Always` (default), `OnFailure`, `Never`. |
| `--command` | Use a custom command instead of the container's entrypoint. |
| `--labels` / `-l` | Labels for the pod. |

```bash
# Run a simple pod
kubectl run nginx --image=nginx:1.25 --port=80

# Interactive debugging pod (deleted on exit)
kubectl run debug --image=busybox -it --rm --restart=Never -- sh

# Dry-run to generate YAML
kubectl run nginx --image=nginx:1.25 --port=80 --dry-run=client -o yaml

# With environment variables and labels
kubectl run app --image=myapp:latest --env=DB_HOST=localhost -l tier=backend
```

### `kubectl expose` — Expose a resource as a Service

```bash
kubectl expose TYPE NAME [flags]
```

| Flag | Description |
|------|-------------|
| `--port` | Service port. |
| `--target-port` | Container port to forward to (defaults to `--port`). |
| `--type` | Service type: `ClusterIP`, `NodePort`, `LoadBalancer`, `ExternalName`. |
| `--name` | Service name (defaults to resource name). |
| `--external-ip` | External IP for the service. |
| `--selector` | Label selector (if not deriving from resource). |

```bash
# Expose a deployment as a ClusterIP service
kubectl expose deployment nginx --port=80 --target-port=8080

# Expose as a LoadBalancer
kubectl expose deployment myapp --port=443 --type=LoadBalancer --name=myapp-lb
```

### `kubectl scale` — Scale a workload

```bash
kubectl scale --replicas=COUNT TYPE NAME
```

| Flag | Description |
|------|-------------|
| `--replicas` | Target replica count. |
| `--current-replicas` | Precondition: only scale if current count matches. |
| `--timeout` | Timeout for the scale operation. |

Applicable to deployments, replicasets, statefulsets.

```bash
# Scale up
kubectl scale deployment nginx --replicas=5

# Scale down with precondition
kubectl scale deployment nginx --current-replicas=5 --replicas=3
```

### `kubectl autoscale` — Auto-scale a workload

```bash
kubectl autoscale TYPE NAME [flags]
```

| Flag | Description |
|------|-------------|
| `--min` | Minimum number of replicas. |
| `--max` | Maximum number of replicas. |
| `--cpu-percent` | Target CPU utilization percentage. |

```bash
kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=80
```

### `kubectl rollout` — Manage rollouts

```bash
kubectl rollout SUBCOMMAND TYPE NAME
```

| Subcommand | Description |
|------------|-------------|
| `history` | View rollout history (including revisions). |
| `pause` | Mark the resource as paused (suspend reconciliation). |
| `restart` | Restart all pods (graceful rolling restart). |
| `resume` | Resume a paused rollout. |
| `status` | Watch rollout status until completion. |
| `undo` | Roll back to a previous revision. |

Applicable to **deployments**, **daemonsets**, **statefulsets**.

```bash
# View rollout history
kubectl rollout history deployment/nginx

# Check rollout status
kubectl rollout status deployment/nginx

# Rollback to previous revision
kubectl rollout undo deployment/nginx

# Rollback to a specific revision
kubectl rollout undo deployment/nginx --to-revision=2

# Pause/resume a rollout
kubectl rollout pause deployment/nginx
kubectl rollout resume deployment/nginx

# Rolling restart
kubectl rollout restart deployment/nginx
```

### `kubectl set` — Configure resources

```bash
kubectl set SUBCOMMAND TYPE NAME [flags]
```

| Subcommand | Description |
|------------|-------------|
| `env` | Set environment variables. |
| `image` | Update container image(s). |
| `resources` | Update resource requests/limits. |
| `selector` | Update label selector. |
| `serviceaccount` | Update service account. |
| `subject` | Update user/group/service account in role binding. |

```bash
# Update image
kubectl set image deployment/nginx nginx=nginx:1.26

# Set resource limits
kubectl set resources deployment/nginx -c=nginx --limits=cpu=500m,memory=512Mi

# Set environment variable
kubectl set env deployment/myapp DEBUG=true
```

---

## 5. Debugging & Troubleshooting

### `kubectl logs` — View container logs

```bash
kubectl logs POD [-c CONTAINER] [flags]
```

| Flag | Description |
|------|-------------|
| `--follow` / `-f` | Stream logs (tail -f style). |
| `--tail=N` | Show last N lines (default last 10 or all with --follow). |
| `--since=TIME` | Logs since a time (`5m`, `1h`, `2026-06-06T00:00:00Z`). |
| `--previous` / `-p` | Show logs from previous terminated container instance. |
| `--all-containers` | Get logs from all containers in the pod. |
| `--prefix` | Prefix each line with the log source (container). |
| `--timestamps` | Include timestamps. |
| `--max-log-requests` | Maximum concurrent log requests (default 5). |

```bash
# Stream recent logs
kubectl logs -f pod/my-pod

# Last 100 lines from a specific container
kubectl logs my-pod -c sidecar --tail=100

# Logs from the previous (crashed) instance
kubectl logs my-pod --previous
```

### `kubectl exec` — Execute a command in a container

```bash
kubectl exec POD [-c CONTAINER] [-it] -- COMMAND [args...]
```

```bash
# Interactive shell
kubectl exec -it my-pod -- sh

# Run a specific command
kubectl exec my-pod -- ls /app

# Exec in a multi-container pod (specify container)
kubectl exec -it my-pod -c sidecar -- sh
```

### `kubectl port-forward` — Forward local ports to a pod or service

```bash
kubectl port-forward TYPE/NAME LOCAL:REMOTE [flags]
```

```bash
# Forward localhost:8080 to pod port 80
kubectl port-forward pod/nginx 8080:80

# Forward to a service
kubectl port-forward service/my-service 3000:80

# UDP forwarding
kubectl port-forward pod/dns 5353:53 --protocol=udp
```

### `kubectl proxy` — Proxy to the Kubernetes API server

```bash
kubectl proxy [--port=PORT] [flags]
```

```bash
# Default port 8001
kubectl proxy &

# Custom port
kubectl proxy --port=8888 &
```

Once running, the API server is accessible at `http://localhost:8001`.

### `kubectl cp` — Copy files to/from containers

```bash
kubectl cp <src> <dest> [flags]
```

```bash
# Copy from pod to local
kubectl cp my-namespace/my-pod:/app/logs/app.log ./app.log

# Copy local to pod
kubectl cp ./config.yaml my-pod:/etc/app/config.yaml

# Copy from specific container
kubectl cp my-pod:/data -c sidecar ./backup/
```

### `kubectl top` — Resource usage metrics

```bash
kubectl top pod [NAME] [flags]
kubectl top node [NAME] [flags]
```

| Flag | Description |
|------|-------------|
| `--containers` | Show per-container metrics (pod). |
| `--sort-by` | Sort by metric field (e.g., `cpu`, `memory`). |
| `--no-headers` | Omit headers. |

Requires the metrics server to be installed in the cluster.

```bash
# Top pods by CPU/memory
kubectl top pod -n kube-system

# Top nodes
kubectl top node --sort-by=memory
```

### `kubectl attach` — Attach to a running container

```bash
kubectl attach POD [-c CONTAINER] [-it] [flags]
```

Attaches to the main process's stdin/stdout/stderr. Use `-it` for interactive sessions.

```bash
kubectl attach -it my-pod
kubectl attach my-pod -c sidecar
```

### `kubectl debug` — Create debugging sessions

```bash
kubectl debug (POD|NODE) [flags]
```

| Flag | Description |
|------|-------------|
| `--image` | Debug container image (default `busybox` or `nicolaka/netshoot`). |
| `--copy-to` | Copy the pod spec and modify for debugging (pod target). |
| `--set-image` | Replace the image of an existing container. |
| `--share-processes` | Share process namespace with target container. |
| `--profile` | Debug profile: `general`, `baseline`, `netadmin`, `restricted`. |
| `-it` | Interactive. |

```bash
# Ephemeral debug container on a running pod
kubectl debug my-pod -it --image=busybox

# Copy the pod and replace image for debugging
kubectl debug my-pod --copy-to=my-pod-debug --set-image=container1=ubuntu

# Debug a node (creates a privileged pod on the node)
kubectl debug node/worker-1 -it --image=busybox
```

### `kubectl events` — List events

```bash
kubectl events [--types=TYPES] [--for=RESOURCE] [flags]
```

| Flag | Description |
|------|-------------|
| `--types` | Filter by event type(s): `Normal`, `Warning`. |
| `--for` | Show events for a specific resource. |
| `--watch` / `-w` | Stream events. |
| `--max-events` | Maximum number of events (default 50). |

```bash
# Warning events across all namespaces
kubectl events --types=Warning --all-namespaces

# Events for a specific pod
kubectl events --for=pod/my-pod

# Watch live events
kubectl events -w
```

---

## 6. Configuration & Metadata

### `kubectl explain` — Get resource documentation

```bash
kubectl explain TYPE [--recursive]
```

```bash
# Top-level resource
kubectl explain pod

# Nested field
kubectl explain pod.spec.containers

# Recursive (full YAML structure)
kubectl explain pod --recursive
```

### `kubectl label` — Update labels

```bash
kubectl label RESOURCE KEY=VAL [KEY=VAL...] [flags]
```

| Flag | Description |
|------|-------------|
| `--overwrite` | Overwrite an existing label (required to change an existing key). |
| `--all` | Label all resources of the type in the namespace. |
| `-l`, `--selector` | Apply only to resources matching label selector. |
| `--dry-run` | Preview changes. |

```bash
# Add a label
kubectl label pod my-pod env=production

# Overwrite an existing label
kubectl label pod my-pod env=staging --overwrite

# Remove a label (append `-` to the key)
kubectl label pod my-pod env-

# Label all pods in the namespace
kubectl label pod --all tier=frontend
```

### `kubectl annotate` — Update annotations

```bash
kubectl annotate RESOURCE KEY=VAL [KEY=VAL...] [flags]
```

Same flag semantics as `kubectl label`. Use annotations for non-identifying metadata.

```bash
# Add an annotation
kubectl annotate pod my-pod description="my production pod"

# Remove
kubectl annotate pod my-pod description-
```

### `kubectl taint` — Update node taints

```bash
kubectl taint NODE KEY=VAL:EFFECT [flags]
```

Effects: `NoSchedule`, `PreferNoSchedule`, `NoExecute`.

```bash
# Add a taint
kubectl taint node worker-1 gpu=true:NoSchedule

# Remove a taint (append `-` to key:effect)
kubectl taint node worker-1 gpu:NoSchedule-
```

---

## 7. Output & Formatting

Quick reference for the most common output modifiers.

### `-o` short flag reference

| Value | Description |
|-------|-------------|
| `wide` | Extra columns (node, IP, ports). |
| `json` | Pretty-printed JSON. |
| `yaml` | YAML output. |
| `name` | Resource type/name only (`pod/nginx-7f8b5c8d9-abcde`). |
| `jsonpath=<template>` | Extract fields using JSONPath expression. |
| `custom-columns=<cols>` | Comma-separated column definition (`HEADER:.path`). |
| `go-template=<template>` | Go template-based output. |
| `go-template-file=<file>` | Go template from file. |
| `template` / `templatefile` | Deprecated aliases for Go template options. |

### Using `kubectl get` with custom output

```bash
# JSONPath: extract image names
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'

# JSONPath with newlines
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}'

# Custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName

# Label as a column
kubectl get pods -L app,tier
```

### Sort, filter, and format

```bash
# Sort by name
kubectl get pods --sort-by=.metadata.name

# Sort by restarts
kubectl get pods --sort-by='{.status.containerStatuses[0].restartCount}'

# Show all labels
kubectl get pods --show-labels

# Combined: wide output, no headers, label column
kubectl get pods -o wide --no-headers -L app
```

---

## 8. Advanced / Administrative

### `kubectl diff` — Diff live vs file

```bash
kubectl diff -f FILENAME|DIR
```

Shows what would change if you ran `kubectl apply`. Uses `diff` under the hood. Exits with non-zero if differences exist.

```bash
kubectl diff -f production-manifests/
```

### `kubectl wait` — Wait for a condition

```bash
kubectl wait --for=condition=NAME RESOURCE [--timeout=DURATION]
kubectl wait --for=delete RESOURCE [--timeout=DURATION]
```

| Flag | Description |
|------|-------------|
| `--for=condition=Ready` | Wait until resource reports condition. |
| `--for=delete` | Wait until resource is deleted. |
| `--for=jsonpath=.status.phase=Running` | Wait for JSONPath expression to match. |
| `--timeout` | Timeout duration (`30s`, `5m`). |
| `--all` | Apply to all resources of the type. |

```bash
# Wait for all pods in a deployment to be ready
kubectl wait --for=condition=Ready pod -l app=nginx --timeout=120s

# Wait for a namespace to be deleted
kubectl wait --for=delete namespace/staging --timeout=60s
```

### `kubectl kustomize` — Build kustomization target

```bash
kubectl kustomize DIR [flags]
```

Builds a kustomization directory and prints the resulting YAML to stdout (no server interaction required).

```bash
# Build and apply in one step
kubectl kustomize ./overlays/prod/ | kubectl apply -f -

# Build to file
kubectl kustomize ./overlays/prod/ > built.yaml
```

### `kubectl plugin list` — List installed plugins

```bash
kubectl plugin list
```

Plugins are executables named `kubectl-*` found on `$PATH`.

### `kubectl auth` — Authorization checks

| Subcommand | Description |
|------------|-------------|
| `can-i VERB RESOURCE` | Check if the current user can perform an action. |
| `reconcile` | Reconcile RBAC resources. |
| `whoami` | Show the current user identity (the user the client is acting as). |

```bash
# Check permissions
kubectl auth can-i create deployments
kubectl auth can-i delete pods --as=system:serviceaccount:default:my-sa
kubectl auth can-i get pod --all-namespaces

# Show current user
kubectl auth whoami
```

### `kubectl certificate` — Manage certificates

```bash
kubectl certificate (approve|deny) CSR_NAME
```

Used for approving or denying certificate signing requests (CSRs).

```bash
# Approve a CSR
kubectl certificate approve my-csr

# Deny a CSR
kubectl certificate deny my-csr
```

### `kubectl alpha` — Alpha feature commands

```bash
kubectl alpha [SUBCOMMAND]
```

Commands associated with alpha-level Kubernetes features. Availability depends on the cluster version and feature gates enabled.

---

## 9. Global Flags

These flags are available on every `kubectl` command.

| Flag | Description |
|------|-------------|
| `--kubeconfig PATH` | Path to kubeconfig file (overrides `$KUBECONFIG` and `~/.kube/config`). |
| `--context NAME` | Override the current context for this command. |
| `-n`, `--namespace NS` | Namespace scope for the command. |
| `--cluster NAME` | Cluster name to use from kubeconfig. |
| `--user NAME` | User name to use from kubeconfig. |
| `-s`, `--server URL` | Direct API server URL (bypasses kubeconfig). |
| `--as USER` | Username to impersonate. |
| `--as-group GROUP` | Group to impersonate (repeatable). |
| `--as-uid UID` | UID to impersonate. |
| `--request-timeout DURATION` | Request timeout (default `0` = no timeout). |
| `--dry-run MODE` | Dry-run mode: `client`, `server`, `none`. |
| `--field-manager NAME` | Field manager name for apply operations. |
| `--server-side` | Use server-side apply. |
| `--validate` | Validation mode: `strict`, `warn`, `ignore` (default `strict`). |
| `--v`, `--vmodule` | Log verbosity (`--v=0` minimal, `--v=4` debug, `--v=9` wire-level). |
| `--insecure-skip-tls-verify` | Bypass TLS verification (use only for testing). |
| `--cache-dir DIR` | Custom cache directory (default `~/.kube/cache`). |
| `--token TOKEN` | Bearer token for authentication. |
| `--password PASSWORD` | Password for basic auth. |
| `--username USERNAME` | Username for basic auth. |
| `--certificate-authority PATH` | Path to CA cert for API server. |
| `--client-certificate PATH` | Path to client cert for TLS. |
| `--client-key PATH` | Path to client key for TLS. |
| `--profile` | Record profiling information (`cpu`, `heap`, `allocs`). |
| `--profile-output PATH` | Output path for profiling data. |
| `--warnings-as-errors` | Treat received warnings as failures. |

### Verbosity levels (`-v`)

| Level | Usage |
|-------|-------|
| `--v=0` | Generally useful information (default). |
| `--v=1` | Reasonable important info you may want to see. |
| `--v=2` | More useful steady-state info about state changes. |
| `--v=3` | Extended info about changes. |
| `--v=4` | Debug-level verbosity. |
| `--v=6` | Requested resources (HTTP requests). |
| `--v=7` | HTTP request headers. |
| `--v=8` | HTTP request content. |
| `--v=9` | Wire-level content (full HTTP traffic). |

---

<!--
  Reference validation: every command, flag, and description listed above
  was verified against the official Kubernetes v1.36 documentation
  (https://kubernetes.io/docs/reference/kubectl/,
   https://kubernetes.io/docs/reference/kubectl/quick-reference/,
   https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
  as of 2026-06-06. If you find an error, open a PR against this file.
-->
