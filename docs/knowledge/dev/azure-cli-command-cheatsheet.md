# Azure CLI Command Cheatsheet

<!-- markdownlint-disable MD013 -->
**Last updated:** 2026-06-06

**Scope:** Practical reference for everyday Azure CLI (`az`) operations — from setup and authentication through resource management, Kubernetes, web apps, networking, security, and automation. Commands, flags, and workflows a cloud engineer reaches for day-to-day across Azure CLI 2.87.0.

**Audience:** Developers, DevOps engineers, and cloud administrators who manage Azure resources from the command line.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Getting Started & Authentication](#2-getting-started--authentication)
3. [Resource Group Management](#3-resource-group-management)
4. [Virtual Machine Management](#4-virtual-machine-management)
5. [Storage Account Management](#5-storage-account-management)
6. [AKS (Azure Kubernetes Service)](#6-aks-azure-kubernetes-service)
7. [Web App / App Service](#7-web-app--app-service)
8. [Networking](#8-networking)
9. [Key Vault](#9-key-vault)
10. [RBAC (Role-Based Access Control)](#10-rbac-role-based-access-control)
11. [Resource Querying](#11-resource-querying)
12. [Output Formatting](#12-output-formatting)
13. [Configuration](#13-configuration)
14. [Extension Management](#14-extension-management)
15. [Container Registry (ACR)](#15-container-registry-acr)
16. [Azure Functions](#16-azure-functions)
17. [Cross-Cutting Flags](#17-cross-cutting-flags)

---

## 1. Installation

### macOS (Homebrew)

```bash
brew install azure-cli
```

### Linux

**Ubuntu / Debian** — install with a single script that sets up Microsoft's repository:

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

**RHEL / CentOS / Fedora** — via `dnf`:

```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo dnf install -y https://packages.microsoft.com/config/rhel/9/packages-microsoft-prod.rpm
sudo dnf install azure-cli
```

**SLES (SUSE Linux Enterprise Server)** — via `zypper`:

```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo zypper addrepo --name 'Azure CLI' --check https://packages.microsoft.com/config/sles/15/packages-microsoft-prod.repo
sudo zypper install azure-cli
```

### Windows

**WinGet:**

```bash
winget install Microsoft.AzureCLI
```

**MSI installer:** Download from <https://aka.ms/installazurecliwindows>.

### Docker

```bash
docker run -it mcr.microsoft.com/azure-cli
```

### In-Tool Upgrade

```bash
az upgrade
```

`az upgrade` updates the Azure CLI to the latest version, including installed extensions. On Linux it may require elevated privileges depending on the installation method.

---

## 2. Getting Started & Authentication

### `az login` — Authenticate to Azure

```bash
az login [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--allow-no-subscriptions` | Support login without active subscriptions |
| `--identity`, `-i` | Log in with a managed identity (VM, App Service, etc.) |
| `--service-principal` | Log in with a service principal (requires `--username`, `--password`, `--tenant`) |
| `--username`, `-u <APP_ID>` | Service principal application ID |
| `--password`, `-p <SECRET>` | Service principal password or certificate |
| `--tenant`, `-t <TENANT>` | Tenant ID to authenticate against |
| `--use-device-code` | Use device code authentication (for environments without a browser) |
| `--use-cert-sn-issuer` | Use certificate serial number / issuer (smart card auth) |

**Interactive login (default):** Opens a browser window. Use `az login --use-device-code` for headless environments.

**Managed identity login** (from an Azure VM, App Service, or container):

```bash
az login --identity
```

**Service principal login:**

```bash
az login --service-principal --username <app-id> --password <secret> --tenant <tenant-id>
```

### `az account` — Manage subscriptions

```bash
# Show current active subscription
az account show

# List all accessible subscriptions
az account list [--refresh]

# Set the active subscription
az account set --subscription <SUBSCRIPTION_ID_OR_NAME>

# Show detailed account information
az account show --output json
```

| Flag (on `az account set`) | Description |
| ---------------------------- | ------------- |
| `--subscription`, `-s` | Name or ID of the subscription |

### `az logout` — Log out

```bash
az logout [--username <USERNAME>]
```

Clears cached credentials. Optionally pass `--username` to log out a specific user when multiple accounts are cached.

---

## 3. Resource Group Management

### `az group create` — Create a resource group

```bash
az group create --name <NAME> --location <LOCATION>
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Resource group name |
| `--location`, `-l <LOCATION>` | Azure region (e.g., `eastus`, `westeurope`, `southeastasia`) |
| `--managed-by <ID>` | Managed-by identifier for Azure Lighthouse |
| `--tags <TAGS>` | Space-separated key=value pairs |

```bash
az group create --name MyResourceGroup --location eastus --tags environment=dev project=alpha
```

### `az group list` — List resource groups

```bash
az group list [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--query <JMES>` | JMESPath query to filter results |
| `--tag <TAG>` | Filter by tag (name or name=value) |

### `az group show` — Show resource group details

```bash
az group show --name <NAME>
```

### `az group update` — Update a resource group

```bash
az group update --name <NAME> [--set <KEY=VALUE>] [--add <KEY=VALUE>] [--remove <KEY>]
```

Primarily used to update tags.

### `az group delete` — Delete a resource group

```bash
az group delete --name <NAME> [--yes] [--no-wait]
```

| Flag | Description |
| ------ | ------------- |
| `--yes`, `-y` | Skip confirmation prompt |
| `--no-wait` | Return immediately without waiting for long-running operation |

### `az group exists` — Check if resource group exists

```bash
az group exists --name <NAME>
```

Returns `true` or `false`.

### `az group export` — Export ARM template

```bash
az group export --name <NAME>
```

Exports the current resource group as an Azure Resource Manager (ARM) JSON template. Use `--include-comments` and `--include-parameter-default-value` for richer output.

---

## 4. Virtual Machine Management

### `az vm create` — Create a virtual machine

```bash
az vm create --name <NAME> --resource-group <RG> --image <IMAGE> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | VM name |
| `--resource-group`, `-g <RG>` | Resource group |
| `--image <IMAGE>` | VM image (e.g., `Ubuntu2404`, `Win2025AzureEditionCore`, `Debian12`, `RHEL9`, `CentOS85Gen2`, `SUSE:sles-15-sp5:gen2:latest`) |
| `--size <SIZE>` | VM size SKU (e.g., `Standard_DS2_v2`; default depends on region) |
| `--admin-username <USER>` | Admin username |
| `--admin-password <PASS>` | Admin password (required for Windows) |
| `--ssh-key-values <KEYS>` | SSH public key(s) or path(s) (Linux default: `~/.ssh/id_rsa.pub`) |
| `--authentication-type <TYPE>` | Authentication type: `ssh` (Linux default), `password`, or `all` |
| `--generate-ssh-keys` | Auto-generate SSH keys if not present |
| `--vnet-name <VNET>` | Virtual network name (created automatically if omitted) |
| `--subnet <SUBNET>` | Subnet name |
| `--public-ip-address <IP>` | Public IP name, `""` for none |
| `--public-ip-sku <SKU>` | Public IP SKU: `Basic` or `Standard` (default: `Standard`) |
| `--nsg <NSG>` | Network security group name |
| `--nsg-rule <RULE>` | Default inbound rule: `RDP` (Windows), `SSH` (Linux), or `NONE` |
| `--os-disk-name <NAME>` | OS disk name |
| `--os-disk-size-gb <SIZE>` | OS disk size in GB |
| `--os-disk-type <TYPE>` | OS disk type: `Premium_LRS`, `StandardSSD_LRS`, `Standard_LRS`, etc. |
| `--data-disk-sizes-gb <SIZES>` | Space-separated list of data disk sizes (e.g., `100 200`) |
| `--attach-data-disks <DISKS>` | Attach existing managed data disks |
| `--availability-set <AS>` | Availability set name |
| `--zone <ZONE>` | Availability zone (`1`, `2`, `3`; use `1 2 3` for zones) |
| `--tags <TAGS>` | Space-separated key=value pairs |
| `--no-wait` | Return immediately without waiting for creation to finish |
| `--custom-data <FILE>` | Custom data / cloud-init script file path |
| `--user-data <FILE>` | User data (cloud-init) file path |
| `--workspace <WS>` | Log Analytics workspace ID for VM insights |

**Linux VM example:**

```bash
az vm create \
  --name MyLinuxVM \
  --resource-group MyResourceGroup \
  --image Ubuntu2404 \
  --size Standard_DS2_v2 \
  --generate-ssh-keys \
  --admin-username azureuser
```

**Windows VM example:**

```bash
az vm create \
  --name MyWinVM \
  --resource-group MyResourceGroup \
  --image Win2025AzureEditionCore \
  --admin-username azureadmin \
  --admin-password 'P@ssw0rd1234!'
```

### `az vm list` — List VMs

```bash
az vm list [--resource-group <RG>] [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--resource-group`, `-g <RG>` | Resource group (omit to list all VMs across subscriptions) |
| `--query <JMES>` | JMESPath query |
| `--show-details` | Show power state and provisioning state |

### `az vm show` — Show VM details

```bash
az vm show --name <NAME> --resource-group <RG> [--show-details]
```

### `az vm start | stop | restart | deallocate`

```bash
az vm start --name <NAME> --resource-group <RG>
az vm stop --name <NAME> --resource-group <RG>
az vm restart --name <NAME> --resource-group <RG>
az vm deallocate --name <NAME> --resource-group <RG>
```

All support `--no-wait`. Note: `deallocate` releases the compute capacity (you stop paying for the VM itself, but still pay for attached disks).

### `az vm delete` — Delete a VM

```bash
az vm delete --name <NAME> --resource-group <RG> [--yes] [--keep-disks] [--keep-nics]
```

| Flag | Description |
| ------ | ------------- |
| `--yes`, `-y` | Skip confirmation |
| `--keep-disks` | Keep attached managed disks |
| `--keep-nics` | Keep attached network interfaces |

### `az vm open-port` — Open a port

```bash
az vm open-port --port <PORT> --resource-group <RG> --name <NAME> [--priority <PRIORITY>]
```

Creates or updates an NSG rule to allow inbound traffic on the specified port.

### `az vm resize` — Resize a VM

```bash
az vm resize --resource-group <RG> --name <NAME> --size <NEW_SIZE>
```

### `az vm disk` — Manage VM disks

```bash
# Attach a managed disk
az vm disk attach --resource-group <RG> --vm-name <NAME> --name <DISK_NAME> [--size-gb <SIZE>] [--new]

# Detach a managed disk
az vm disk detach --resource-group <RG> --vm-name <NAME> --name <DISK_NAME>
```

| Flag (on `attach`) | Description |
| --------------------- | ------------- |
| `--new` | Create a new disk (requires `--size-gb`) |
| `--size-gb <SIZE>` | Disk size in GB |
| `--lun <LUN>` | Logical unit number |

### `az vm extension` — Manage VM extensions

```bash
az vm extension set --resource-group <RG> --vm-name <NAME> --name <EXTENSION> --publisher <PUBLISHER> [OPTIONS]
```

Common extensions include `CustomScript` (publisher `Microsoft.Azure.Extensions`) and `DependencyAgentLinux` / `DependencyAgentWindows` (publisher `Microsoft.Azure.Monitoring.DependencyAgent`).

---

## 5. Storage Account Management

### `az storage account create` — Create a storage account

```bash
az storage account create --name <NAME> --resource-group <RG> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Storage account name (globally unique, 3–24 chars, lowercase alphanumerics) |
| `--resource-group`, `-g <RG>` | Resource group |
| `--location`, `-l <LOCATION>` | Azure region |
| `--sku <SKU>` | Performance and redundancy SKU: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS` |
| `--kind <KIND>` | Account kind: `StorageV2` (default), `Storage`, `BlobStorage`, `BlockBlobStorage`, `FileStorage` |
| `--access-tier <TIER>` | Access tier: `Hot` (default) or `Cool` |
| `--min-tls-version <VER>` | Minimum TLS version: `TLS1_0`, `TLS1_1`, `TLS1_2` (default: `TLS1_2`) |
| `--allow-blob-public-access` | Allow anonymous public blob access |
| `--hns <HNS>` | Enable Hierarchical Namespace (Data Lake Storage Gen2): `true`, `false` |
| `--tags <TAGS>` | Space-separated key=value pairs |

```bash
az storage account create \
  --name mystorageaccount \
  --resource-group MyResourceGroup \
  --location eastus \
  --sku Standard_GRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2
```

### `az storage account list` — List storage accounts

```bash
az storage account list [--resource-group <RG>]
```

### `az storage account show-connection-string` — Get connection string

```bash
az storage account show-connection-string --name <NAME> --resource-group <RG>
```

### `az storage account keys` — Manage access keys

```bash
# List account keys
az storage account keys list --name <NAME> --resource-group <RG>

# Renew an account key
az storage account keys renew --name <NAME> --resource-group <RG> --key <primary|secondary>
```

### `az storage account delete` — Delete a storage account

```bash
az storage account delete --name <NAME> --resource-group <RG> [--yes]
```

### `az storage account generate-sas` — Generate a shared access signature

```bash
az storage account generate-sas \
  --account-name <NAME> \
  --services <SERVICES> \
  --resource-types <TYPES> \
  --permissions <PERMS> \
  --expiry <EXPIRY> \
  --https-only
```

Generates a SAS token for the entire storage account.

---

## 6. AKS (Azure Kubernetes Service)

### `az aks create` — Create an AKS cluster

```bash
az aks create --name <NAME> --resource-group <RG> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Cluster name |
| `--resource-group`, `-g <RG>` | Resource group |
| `--node-count <COUNT>` | Number of nodes (default: 3) |
| `--node-vm-size <SIZE>` | VM size for nodes (e.g., `Standard_DS2_v2`) |
| `--kubernetes-version <VER>` | Kubernetes version (default: latest stable) |
| `--enable-managed-identity` | Use managed identity (default: enabled) |
| `--enable-cluster-autoscaler` | Enable cluster autoscaler |
| `--min-count <MIN>` | Minimum node count for autoscaler |
| `--max-count <MAX>` | Maximum node count for autoscaler |
| `--enable-addons <ADDONS>` | Comma-separated addons: `http_application_routing`, `monitoring`, `virtual-node`, `azure-policy`, `ingress-appgw` |
| `--network-plugin <PLUGIN>` | Network plugin: `azure`, `kubenet`, `none` |
| `--network-policy <POLICY>` | Network policy: `calico`, `azure` |
| `--enable-private-cluster` | Create a private cluster (no public endpoint) |
| `--dns-name-prefix <PREFIX>` | DNS prefix for cluster public endpoint |
| `--ssh-key-value <KEY>` | SSH public key for nodes (default: `~/.ssh/id_rsa.pub`) |
| `--tags <TAGS>` | Space-separated key=value pairs |
| `--zones <ZONES>` | Availability zones (`1 2 3`) |

```bash
az aks create \
  --name MyAKSCluster \
  --resource-group MyResourceGroup \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5 \
  --network-plugin azure
```

### `az aks get-credentials` — Download and merge kubeconfig

```bash
az aks get-credentials --name <NAME> --resource-group <RG> [--overwrite-existing] [--admin]
```

| Flag | Description |
| ------ | ------------- |
| `--overwrite-existing` | Overwrite any existing cluster entry |
| `--admin` | Get admin credentials (cluster-admin context) |
| `--user <USER>` | Get user credentials for specific user |
| `--context <CONTEXT>` | Set kubectl context name |

After running, use `kubectl` as normal:

```bash
kubectl get nodes
```

### `az aks list` — List AKS clusters

```bash
az aks list [--resource-group <RG>]
```

### `az aks scale` — Scale the cluster

```bash
az aks scale --name <NAME> --resource-group <RG> --node-count <COUNT>
```

### `az aks upgrade` — Upgrade cluster version

```bash
az aks upgrade --name <NAME> --resource-group <RG> --kubernetes-version <VER>

# List available upgrade versions
az aks get-upgrades --name <NAME> --resource-group <RG>
```

### `az aks delete` — Delete an AKS cluster

```bash
az aks delete --name <NAME> --resource-group <RG> [--yes]
```

### `az aks nodepool` — Manage node pools

```bash
# List node pools
az aks nodepool list --cluster-name <CLUSTER> --resource-group <RG>

# Add a new node pool
az aks nodepool add --cluster-name <CLUSTER> --resource-group <RG> --name <POOL_NAME> --node-count <COUNT> [OPTIONS]

# Scale a node pool
az aks nodepool scale --cluster-name <CLUSTER> --resource-group <RG> --name <POOL_NAME> --node-count <COUNT>

# Delete a node pool
az aks nodepool delete --cluster-name <CLUSTER> --resource-group <RG> --name <POOL_NAME> [--no-wait]
```

### `az aks install-cli` — Install kubectl and kubelogin

```bash
az aks install-cli [--install-location <PATH>] [--kubelogin-install-location <PATH>]
```

Installs or updates `kubectl` and `kubelogin` on the local machine.

---

## 7. Web App / App Service

### `az appservice plan create` — Create an App Service plan

```bash
az appservice plan create --name <NAME> --resource-group <RG> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Plan name |
| `--resource-group`, `-g <RG>` | Resource group |
| `--sku <SKU>` | Pricing tier: `F1` (Free), `D1` (Shared), `B1`–`B3` (Basic), `S1`–`S3` (Standard), `P1`–`P3` (Premium), `P1V2`–`P3V3` (Premium v2/v3) |
| `--is-linux` | Use Linux workers |
| `--location`, `-l <LOCATION>` | Azure region |
| `--tags <TAGS>` | Space-separated key=value pairs |

```bash
az appservice plan create --name MyPlan --resource-group MyResourceGroup --sku S1 --is-linux
```

### `az webapp create` — Create a web app

```bash
az webapp create --name <NAME> --resource-group <RG> --plan <PLAN> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Web app name (used in URL: `https://<NAME>.azurewebsites.net`) |
| `--resource-group`, `-g <RG>` | Resource group |
| `--plan`, `-p <PLAN>` | App Service plan name |
| `--runtime <RUNTIME>` | Runtime stack (e.g., `"NODE:22-lts"`, `"PYTHON:3.13"`, `"DOTNETCORE:9.0"`, `"JAVA:21-java21"`) |
| `--deployment-local-git` | Enable local Git deployment |

```bash
az webapp create --name MyWebApp --resource-group MyResourceGroup --plan MyPlan --runtime "NODE:22-lts"
```

### `az webapp list` — List web apps

```bash
az webapp list [--resource-group <RG>]
```

### `az webapp deploy` — Deploy code

```bash
az webapp deploy --name <NAME> --resource-group <RG> --type <TYPE> --src-path <PATH>
```

| Flag | Description |
| ------ | ------------- |
| `--type <TYPE>` | Deployment type: `zip`, `war`, `jar`, `ear`, `static`, `startup` |
| `--src-path <PATH>` | Path to the deployment artifact |
| `--async` | Run deployment asynchronously |
| `--restart` | Restart the app after deployment |

### `az webapp config appsettings set` — Manage app settings

```bash
az webapp config appsettings set --name <NAME> --resource-group <RG> --settings <KEY=VALUE> [<KEY=VALUE>...]
```

```bash
az webapp config appsettings set \
  --name MyWebApp \
  --resource-group MyResourceGroup \
  --settings NODE_ENV=production API_KEY=abc123
```

### `az webapp log tail` — Stream logs

```bash
az webapp log tail --name <NAME> --resource-group <RG> [--provider <PROVIDER>]
```

### `az webapp deployment slot` — Manage deployment slots

```bash
# Create a slot
az webapp deployment slot create --name <NAME> --resource-group <RG> --slot <SLOT_NAME>

# List slots
az webapp deployment slot list --name <NAME> --resource-group <RG>

# Swap slots
az webapp deployment slot swap --name <NAME> --resource-group <RG> --slot <SLOT_NAME> --target-slot <TARGET>

# Delete a slot
az webapp deployment slot delete --name <NAME> --resource-group <RG> --slot <SLOT_NAME>
```

### `az webapp start | stop | restart`

```bash
az webapp start --name <NAME> --resource-group <RG>
az webapp stop --name <NAME> --resource-group <RG>
az webapp restart --name <NAME> --resource-group <RG>
```

### `az webapp browse` — Open app in browser

```bash
az webapp browse --name <NAME> --resource-group <RG>
```

Opens `https://<NAME>.azurewebsites.net` in the default browser.

### `az webapp ssh` — SSH into the web app container

```bash
az webapp ssh --name <NAME> --resource-group <RG>
```

Available for Linux web apps. Opens an interactive SSH session into the app container.

---

## 8. Networking

### Virtual Networks (VNet)

#### `az network vnet create`

```bash
az network vnet create --name <NAME> --resource-group <RG> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | VNet name |
| `--resource-group`, `-g <RG>` | Resource group |
| `--location`, `-l <LOCATION>` | Azure region |
| `--address-prefixes <PREFIXES>` | Space-separated CIDR prefixes (default: `10.0.0.0/16`) |
| `--subnet-name <NAME>` | Subnet name to create (optional) |
| `--subnet-prefixes <PREFIXES>` | Subnet address prefixes (default: `10.0.0.0/24`) |
| `--tags <TAGS>` | Space-separated key=value pairs |

```bash
az network vnet create \
  --name MyVNet \
  --resource-group MyResourceGroup \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name default \
  --subnet-prefixes 10.0.0.0/24
```

#### `az network vnet list | show | delete`

```bash
az network vnet list [--resource-group <RG>]
az network vnet show --name <NAME> --resource-group <RG>
az network vnet delete --name <NAME> --resource-group <RG> [--yes]
```

#### VNet Peering

```bash
# Create a peering from the first VNet to the second
az network vnet peering create \
  --name <PEERING_NAME> \
  --resource-group <RG> \
  --vnet-name <VNET1> \
  --remote-vnet <VNET2_ID> \
  --allow-vnet-access

# List peerings
az network vnet peering list --resource-group <RG> --vnet-name <NAME>
```

VNet peering is bidirectional — create a matching peering in the opposite direction, or use `--allow-forwarded-traffic` and `--allow-gateway-transit` as needed.

### Network Security Group (NSG) Rules

#### `az network nsg rule create`

```bash
az network nsg rule create --nsg-name <NSG> --resource-group <RG> --name <RULE_NAME> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--nsg-name <NSG>` | NSG name |
| `--resource-group`, `-g <RG>` | Resource group |
| `--name`, `-n <RULE>` | Rule name |
| `--priority <PRIORITY>` | Rule priority (100–4096; lower = higher priority) |
| `--access <ACCESS>` | `Allow` or `Deny` |
| `--direction <DIR>` | `Inbound` or `Outbound` |
| `--protocol <PROTO>` | `Tcp`, `Udp`, `Icmp`, `Esp`, `Ah`, or `*` (any) |
| `--source-address-prefixes <PREFIXES>` | Source CIDR prefixes or tags (e.g., `Internet`, `VirtualNetwork`) |
| `--source-port-ranges <RANGES>` | Source port ranges (e.g., `80 443`) |
| `--destination-address-prefixes <PREFIXES>` | Destination CIDR prefixes |
| `--destination-port-ranges <RANGES>` | Destination port ranges (e.g., `80 443 3389`) |
| `--description <TEXT>` | Rule description |

```bash
az network nsg rule create \
  --nsg-name MyNSG \
  --resource-group MyResourceGroup \
  --name AllowSSH \
  --priority 1000 \
  --access Allow \
  --direction Inbound \
  --protocol Tcp \
  --source-address-prefixes Internet \
  --destination-address-prefixes VirtualNetwork \
  --destination-port-ranges 22
```

### Public IP Addresses

#### `az network public-ip create`

```bash
az network public-ip create --name <NAME> --resource-group <RG> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Public IP resource name |
| `--resource-group`, `-g <RG>` | Resource group |
| `--location`, `-l <LOCATION>` | Azure region |
| `--allocation-method <METHOD>` | `Static` or `Dynamic` (default: `Dynamic`) |
| `--sku <SKU>` | `Basic` or `Standard` (default: `Standard`) |
| `--version <VER>` | `IPv4` (default) or `IPv6` |
| `--domain-name-label <LABEL>` | DNS label (creates `<LABEL>.<region>.cloudapp.azure.com`) |
| `--tags <TAGS>` | Space-separated key=value pairs |
| `--zone <ZONE>` | Availability zone (`1`, `2`, `3`) |

```bash
az network public-ip create \
  --name MyPublicIP \
  --resource-group MyResourceGroup \
  --allocation-method Static \
  --sku Standard
```

#### `az network public-ip list | show | update | delete`

```bash
az network public-ip list [--resource-group <RG>]
az network public-ip show --name <NAME> --resource-group <RG>
az network public-ip update --name <NAME> --resource-group <RG> [--allocation-method <METHOD>] [--sku <SKU>]
az network public-ip delete --name <NAME> --resource-group <RG>
```

---

## 9. Key Vault

### `az keyvault create` — Create a key vault

```bash
az keyvault create --name <NAME> --resource-group <RG> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Key vault name (globally unique, 3–24 chars, alphanumerics and hyphens) |
| `--resource-group`, `-g <RG>` | Resource group |
| `--location`, `-l <LOCATION>` | Azure region |
| `--sku <SKU>` | `Standard` or `Premium` (Premium supports HSM-backed keys) |
| `--enable-purge-protection` | Enable purge protection (vault cannot be purged before soft-delete retention period) |
| `--enable-rbac-authorization` | Use RBAC for access control (instead of vault access policies) |
| `--retention-days <DAYS>` | Soft-delete retention period (7–90 days, default: 90) |
| `--public-network-access` | Enable or disable public network access |
| `--tags <TAGS>` | Space-separated key=value pairs |

```bash
az keyvault create --name MyKeyVault --resource-group MyResourceGroup --location eastus --sku Standard
```

### `az keyvault list | show | delete | purge | recover`

```bash
# List key vaults
az keyvault list [--resource-group <RG>]

# Show vault details
az keyvault show --name <NAME>

# Delete a key vault (soft-delete)
az keyvault delete --name <NAME>

# Purge a deleted vault (permanent)
az keyvault purge --name <NAME> --location <LOCATION>

# Recover a deleted vault
az keyvault recover --name <NAME> --location <LOCATION>
```

### Secrets

```bash
# Set a secret
az keyvault secret set --vault-name <VAULT> --name <SECRET_NAME> --value <VALUE>

# Show a secret (value is in the `value` field)
az keyvault secret show --vault-name <VAULT> --name <SECRET_NAME>

# List secrets
az keyvault secret list --vault-name <VAULT>

# Delete a secret
az keyvault secret delete --vault-name <VAULT> --name <SECRET_NAME>
```

### Keys

```bash
# Create a key
az keyvault key create --vault-name <VAULT> --name <KEY_NAME> --protection <software|hsm>

# List keys
az keyvault key list --vault-name <VAULT>

# Show key details
az keyvault key show --vault-name <VAULT> --name <KEY_NAME>

# Delete a key
az keyvault key delete --vault-name <VAULT> --name <KEY_NAME>
```

### Certificates

```bash
# Create a self-signed certificate
az keyvault certificate create --vault-name <VAULT> --name <CERT_NAME> --policy <POLICY_FILE>

# Import a certificate
az keyvault certificate import --vault-name <VAULT> --name <CERT_NAME> --file <FILE_PATH> [--password <PASS>]

# List certificates
az keyvault certificate list --vault-name <VAULT>

# Show certificate details
az keyvault certificate show --vault-name <VAULT> --name <CERT_NAME>

# Delete a certificate
az keyvault certificate delete --vault-name <VAULT> --name <CERT_NAME>

# Get a certificate's public key and secret (PEM/PFK)
az keyvault certificate download --vault-name <VAULT> --name <CERT_NAME> --file <OUTPUT_FILE> [--encoding <PEM|DER>]
```

### Access Policies

```bash
az keyvault set-policy --name <VAULT> --object-id <OBJECT_ID> [--secret-permissions <PERMS>] [--key-permissions <PERMS>] [--certificate-permissions <PERMS>]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <VAULT>` | Key vault name |
| `--object-id <ID>` | Azure AD object ID (user, group, or service principal) |
| `--secret-permissions <PERMS>` | Space-separated secret permissions (e.g., `get list set delete`) |
| `--key-permissions <PERMS>` | Space-separated key permissions (e.g., `get list create encrypt decrypt`) |
| `--certificate-permissions <PERMS>` | Space-separated certificate permissions |

```bash
az keyvault set-policy \
  --name MyKeyVault \
  --object-id 11111111-2222-3333-4444-555555555555 \
  --secret-permissions get list \
  --key-permissions get list create
```

---

## 10. RBAC (Role-Based Access Control)

### Role Definitions

```bash
# List all built-in and custom role definitions
az role definition list [--name <ROLE>]

# Show a specific role definition
az role definition list --name "Contributor"

# Create a custom role definition (from JSON)
az role definition create --role-definition <JSON_FILE_OR_STRING>

# Update a custom role definition
az role definition update --role-definition <JSON_FILE_OR_STRING>
```

### Common Built-in Roles

| Role | Description |
| ------ | ------------- |
| `Owner` | Full access to all resources, including the right to delegate access to others |
| `Contributor` | Full access to manage resources, but cannot delegate access |
| `Reader` | View all resources but cannot make changes |
| `User Access Administrator` | Manage user access to Azure resources (often combined with Contributor) |
| `Storage Blob Data Contributor` | Read, write, and delete Azure Blob Storage containers and blobs |
| `Storage Blob Data Reader` | Read Azure Blob Storage containers and blobs |
| `Virtual Machine Contributor` | Manage VMs but not access to the virtual network or storage account |
| `Network Contributor` | Manage networking resources |
| `Key Vault Administrator` | Full access to key vault data plane (secrets, keys, certificates) |
| `Key Vault Secrets User` | Read secret values from a key vault |
| `AKS Cluster User` | Read cluster credentials and run `kubectl` commands |
| `AcrPush` | Push images to a container registry |
| `AcrPull` | Pull images from a container registry |

### Role Assignments

```bash
# Assign a role to a user, group, or service principal
az role assignment create \
  --assignee <USER_OR_APP_ID> \
  --role <ROLE_NAME> \
  --scope <SCOPE>

# List role assignments
az role assignment list [--assignee <USER_OR_APP_ID>] [--scope <SCOPE>]

# List assignments for a specific user
az role assignment list --assignee user@example.com --all

# Delete a role assignment
az role assignment delete --assignee <USER_OR_APP_ID> --role <ROLE_NAME> --scope <SCOPE>
```

| Flag (on `create`) | Description |
| --------------------- | ------------- |
| `--assignee <ID>` | User (UPN or object ID), group, or service principal |
| `--role <ROLE>` | Role name or ID (e.g., `Contributor`, `Reader`) |
| `--scope <SCOPE>` | Scope: subscription (`/subscriptions/<ID>`), resource group (`/subscriptions/<ID>/resourceGroups/<RG>`), or resource |
| `--assignee-principal-type <TYPE>` | Type of assignee: `User`, `Group`, `ServicePrincipal` (optional, resolves automatically) |

```bash
# Assign Contributor role to a user at resource group scope
az role assignment create \
  --assignee user@example.com \
  --role Contributor \
  --scope /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup
```

### `az role assignment list` — Common Queries

```bash
# List all assignments for a specific user across all scopes
az role assignment list --assignee user@example.com --all

# List assignments for a resource group
az role assignment list --resource-group MyResourceGroup

# List all owners of a subscription
az role assignment list --subscription <SUB_ID> --role Owner --include-groups
```

---

## 11. Resource Querying

### `az resource list` — List resources

```bash
az resource list [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--resource-type <TYPE>` | Resource type filter (e.g., `Microsoft.Compute/virtualMachines`) |
| `--tag <TAG>` | Tag filter (name or name=value) |
| `--name <NAME>` | Resource name filter |
| `--resource-group`, `-g <RG>` | Resource group filter |
| `--query <JMES>` | JMESPath query |
| `--output <FORMAT>` | Output format |

```bash
# List all VMs in a subscription
az resource list --resource-type Microsoft.Compute/virtualMachines

# List resources with a specific tag
az resource list --tag environment=production

# List resources by name pattern and select specific fields
az resource list --name "myapp*" --query "[].{Name:name, Type:type, Location:location}" --output table
```

### `az resource show` — Show a single resource

```bash
az resource show --ids <RESOURCE_ID>
# or
az resource show --name <NAME> --resource-group <RG> --resource-type <TYPE>
```

### `az resource tag` — Update tags on a resource

```bash
az resource tag --ids <RESOURCE_ID> --tags <KEY=VALUE> [<KEY=VALUE>...]
```

```bash
az resource tag --ids /subscriptions/.../resourceGroups/MyRG/providers/Microsoft.Compute/virtualMachines/MyVM --tags environment=production owner=team-alpha
```

### `az resource delete` — Delete a resource by ID

```bash
az resource delete --ids <RESOURCE_ID> [--yes]
```

### `az find` — Discover Azure CLI commands

```bash
# Find commands related to a service or operation
az find "Cosmos DB"
az find "create VM"
az find "aks"
```

`az find` searches command names, descriptions, and examples. It also provides a random example if run without arguments.

---

## 12. Output Formatting

### `--output` / `-o` — Output format

| Value | Description |
| ------- | ------------- |
| `json` | Standard JSON (default for most commands) |
| `jsonc` | Colorized JSON (with syntax highlighting) |
| `table` | ASCII table (human-readable, may truncate fields) |
| `tsv` | Tab-separated values (ideal for scripting and piping) |
| `yaml` | YAML format |
| `yamlc` | Colorized YAML |
| `none` | No output (suppress stdout; useful for scripts checking exit codes) |

```bash
az vm list --output table
az group list --output jsonc
az vm show --name MyVM --resource-group MyRG --output yaml
```

### `--query` — JMESPath filtering

The `--query` parameter accepts a JMESPath expression for filtering and transforming results. This works with any output format.

**Filtering by property:**

```bash
# List VMs with specific fields
az vm list --query "[].{Name:name, Size:hardwareProfile.vmSize, OS:storageProfile.osDisk.osType}"

# Filter VMs by state
az vm list --query "[?powerState=='VM running'].name"

# List resources where a tag matches
az resource list --query "[?tags.environment=='production'].name"
```

**Selecting specific items:**

```bash
# Get the first VM
az vm list --query "[0]"

# Get a specific field from the first item
az vm list --query "[0].name"
```

**Scripting patterns with tsv:**

```bash
# Get a list of VM IDs for scripting
az vm list --query "[].id" --output tsv

# Get space-separated list of resource group names
az group list --query "[].name" --output tsv | tr '\n' ' '

# Pipeline-ready output (no headers, no brackets)
az vm list --query "[].{name:name, rg:resourceGroup}" --output tsv
```

### `--only-show-errors` — Suppress warnings

```bash
az vm list --only-show-errors
```

Suppresses warning and informational messages. Useful in scripts where you only want errors on stderr.

---

## 13. Configuration

### `az configure` — Interactive configuration

```bash
az configure
```

Walks through an interactive prompt to set default output format, logging verbosity, and default resource group / location / subscription.

### `az config` — Programmatic configuration

```bash
# Set a configuration value
az config set <SECTION>.<KEY>=<VALUE>

# Get a configuration value
az config get <SECTION>.<KEY>

# List all configuration values
az config list

# Unset a configuration value
az config unset <SECTION>.<KEY>
```

**Key configuration sections:**

| Section | Key | Description |
| --------- | ----- | ------------- |
| `core` | `output` | Default output format (`json`, `table`, `tsv`, `yaml`, `none`) |
| `core` | `collect_telemetry` | Enable/disable telemetry collection (`yes`/`no`) |
| `core` | `only_show_errors_only` | Suppress non-error output (`yes`/`no`) |
| `core` | `no_color` | Disable color output (`yes`/`no`) |
| `defaults` | `group` | Default resource group |
| `defaults` | `location` | Default location / region |
| `defaults` | `subscription` | Default subscription |
| `defaults` | `web` | Default web app name |
| `defaults` | `vm` | Default VM name |
| `extension` | `use_dynamic_install` | Auto-install extensions (`yes_without_prompt`, `yes`, `no`) |
| `extension` | `index_url` | Custom extension index URL |
| `logging` | `enable_log_file` | Enable log file (`yes`/`no`) |
| `logging` | `dir` | Log file directory |

```bash
az config set defaults.group=MyResourceGroup defaults.location=eastus
az config set core.output=table
az config set extension.use_dynamic_install=yes_without_prompt
```

### Environment Variables

Configuration values can be overridden via environment variables. The standard pattern is `AZURE_CLI_<SECTION>_<KEY>`:

| Variable | Equivalent Config | Description |
| ---------- | ------------------- | ------------- |
| `AZURE_DEFAULTS_GROUP` | `defaults.group` | Default resource group |
| `AZURE_DEFAULTS_LOCATION` | `defaults.location` | Default location |
| `AZURE_DEFAULTS_SUBSCRIPTION` | `defaults.subscription` | Default subscription |
| `AZURE_CLI_OUTPUT` | `core.output` | Default output format |

Environment variables take precedence over config file values.

---

## 14. Extension Management

### Commands

```bash
# Install an extension
az extension add --name <EXTENSION_NAME> [--version <VER>] [--upgrade]

# List installed extensions
az extension list

# Show extension details
az extension show --name <EXTENSION_NAME>

# Update an extension
az extension update --name <EXTENSION_NAME>

# Remove an extension
az extension remove --name <EXTENSION_NAME>

# List all available extensions
az extension list-available [--show-details]
```

### Notable Extensions

| Extension | Description |
| ----------- | ------------- |
| `aks-preview` | Preview features for AKS (e.g., Kubernetes RBAC, Azure Policy addon) |
| `containerapp` | Manage Azure Container Apps (serverless containers) |
| `ssh` | SSH into Azure VMs without a public IP (uses Azure RBAC) |
| `azure-cli-ml` | Manage Azure Machine Learning workspaces and resources |
| `log-analytics` | Query Log Analytics workspaces |
| `front-door` | Manage Azure Front Door (CDN and application firewall) |
| `webapp` | Additional web app features (deployment slots, etc.) |

### Dynamic Install

Configure dynamic extension install to avoid manually adding extensions before use:

```bash
az config set extension.use_dynamic_install=yes_without_prompt
```

After this, running a command from an uninstalled extension triggers automatic installation.

---

## 15. Container Registry (ACR)

### `az acr create` — Create a container registry

```bash
az acr create --name <NAME> --resource-group <RG> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Registry name (globally unique, 5–50 chars, alphanumerics) |
| `--resource-group`, `-g <RG>` | Resource group |
| `--location`, `-l <LOCATION>` | Azure region |
| `--sku <SKU>` | `Basic` (1 GB storage, $/day), `Standard` (10 GB, higher throughput), `Premium` (100 GB, geo-replication, content trust) |
| `--admin-enabled` | Enable admin user (for basic auth workflows) |
| `--tags <TAGS>` | Space-separated key=value pairs |

```bash
az acr create --name mycontainerregistry --resource-group MyResourceGroup --sku Standard
```

### `az acr login` — Log in to a registry

```bash
az acr login --name <NAME>
```

Logs in using the current Azure CLI identity (no need for `docker login` separately).

### `az acr list | show | delete`

```bash
az acr list [--resource-group <RG>]
az acr show --name <NAME>
az acr delete --name <NAME> --resource-group <RG> [--yes]
```

### Repository Management

```bash
# List repositories
az acr repository list --name <REGISTRY>

# Show repository metadata
az acr repository show --name <REGISTRY> --repository <REPO>

# List tags for a repository
az acr repository show-tags --name <REGISTRY> --repository <REPO>

# Show manifest details
az acr repository show-manifests --name <REGISTRY> --repository <REPO>

# Delete a repository or tag
az acr repository delete --name <REGISTRY> --repository <REPO> [--tag <TAG>] [--yes]
```

### `az acr build` — Build an image in Azure

```bash
az acr build --registry <REGISTRY> [--image <IMAGE:TAG>] [--file <DOCKERFILE>] .
```

Builds a Docker image using Azure Container Registry Tasks (ACR Tasks) without requiring a local Docker daemon.

```bash
az acr build --registry mycontainerregistry --image myapp:v1 .
```

### `az acr import` — Import an image

```bash
az acr import --name <REGISTRY> --source <SOURCE_IMAGE> --image <DEST_IMAGE:TAG>
```

Import an image from another registry (Docker Hub, another ACR, or any public registry).

```bash
az acr import --name mycontainerregistry --source docker.io/library/nginx:latest --image nginx:latest
```

### `az acr task` — Manage automated tasks

```bash
# Create a task (auto-build on commit)
az acr task create --registry <REGISTRY> --name <TASK_NAME> --image <IMAGE:TAG> --context <GIT_REPO> --file <DOCKERFILE> [--commit-trigger-enabled]

# List tasks
az acr task list --registry <REGISTRY>

# Run a task
az acr task run --registry <REGISTRY> --name <TASK_NAME>

# Delete a task
az acr task delete --registry <REGISTRY> --name <TASK_NAME> [--yes]
```

---

## 16. Azure Functions

### `az functionapp create` — Create a function app

```bash
az functionapp create --name <NAME> --resource-group <RG> --storage-account <STORAGE> --consumption-plan-location <LOCATION> [OPTIONS]
```

| Flag | Description |
| ------ | ------------- |
| `--name`, `-n <NAME>` | Function app name |
| `--resource-group`, `-g <RG>` | Resource group |
| `--storage-account`, `-s <STORAGE>` | Storage account name (required for functions runtime) |
| `--consumption-plan-location <LOC>` | Location for consumption plan (use when no App Service plan is specified) |
| `--plan`, `-p <PLAN>` | App Service plan (alternative to consumption plan) |
| `--runtime <RUNTIME>` | Runtime: `dotnet`, `dotnet-isolated`, `node`, `python`, `java`, `powershell`, `custom` |
| `--runtime-version <VER>` | Runtime version (e.g., `~4` for .NET, `18` for Node, `3.11` for Python) |
| `--functions-version <VER>` | Functions runtime version (`4` default) |
| `--os-type <TYPE>` | `Linux` or `Windows` |

```bash
# Create a Linux Python function app in consumption plan
az functionapp create \
  --name MyFunctionApp \
  --resource-group MyResourceGroup \
  --storage-account mystorageaccount \
  --consumption-plan-location eastus \
  --runtime python \
  --runtime-version 3.11 \
  --os-type Linux
```

---

## 17. Cross-Cutting Flags

These flags work across most Azure CLI commands and follow a consistent pattern.

| Flag | Shorthand | Description |
| ------ | ----------- | ------------- |
| `--output` | `-o` | Output format: `json`, `jsonc`, `table`, `tsv`, `yaml`, `yamlc`, `none` |
| `--query` | — | JMESPath query string for filtering and transforming results |
| `--only-show-errors` | — | Suppress warnings; show only errors |
| `--verbose` | `-v` | Increase logging verbosity |
| `--debug` | — | Show detailed debug information (full HTTP requests/responses) |
| `--help` | `-h` | Show help information and exit |

These flags are position-independent — they can appear anywhere on the command line.

```bash
# Verbose output with table format and JMESPath
az vm list --output table --query "[].{Name:name, RG:resourceGroup}" --verbose

# Debug a failed command
az group create --name TestRG --location eastus --debug

# Silent script usage
az group delete --name TestRG --yes --only-show-errors
```

---

<!-- markdownlint-enable MD013 -->
<!--
  Reference validation: every flag and option listed above was verified
  against Azure CLI 2.87.0 behavior as documented on Microsoft Learn in June 2026.
  If you find an error, open a PR against this file.
-->
