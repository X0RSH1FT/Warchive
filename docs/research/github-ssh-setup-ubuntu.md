# GitHub SSH Setup for Ubuntu

Scope: Step-by-step guide for setting up GitHub access from an Ubuntu environment, targeting users who are familiar with Windows Git Credential Manager but are new to Linux SSH authentication.

Date: 2026-06-06

## Table of Contents

- [Quick Start: GitHub CLI (Recommended)](#quick-start-github-cli-recommended)
- [Manual SSH Setup (Step by Step)](#manual-ssh-setup-step-by-step)
  - [1. Check for Existing SSH Keys](#1-check-for-existing-ssh-keys)
  - [2. Generate a New SSH Key](#2-generate-a-new-ssh-key)
  - [3. Add the Key to the ssh-agent](#3-add-the-key-to-the-ssh-agent)
  - [4. Add the SSH Key to Your GitHub Account](#4-add-the-ssh-key-to-your-github-account)
  - [5. Test the SSH Connection](#5-test-the-ssh-connection)
  - [6. Set Your Git Identity](#6-set-your-git-identity)
  - [7. Fix Directory Permissions (Ubuntu Gotcha)](#7-fix-directory-permissions-ubuntu-gotcha)
- [Credential-Helper Options on Linux](#credential-helper-options-on-linux)
- [Switching Existing Repos from HTTPS to SSH](#switching-existing-repos-from-https-to-ssh)
- [Comparison Table: All Approaches](#comparison-table-all-approaches)
- [References](#references)

---

## Quick Start: GitHub CLI (Recommended)

If you want the fastest path to a working setup with minimal manual steps, use the GitHub CLI (`gh`). It handles key generation, key upload, ssh-agent configuration, and Git integration in a single interactive session.

### Install GitHub CLI

```bash
(type -p wget >/dev/null || sudo apt install wget curl) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update && sudo apt install gh -y
```

> **Note:** The `gh` package in the default Ubuntu repos is often outdated. The commands above add GitHub's official repository so you get the latest version.

### Authenticate

```bash
gh auth login
```

Follow the interactive prompts:

1. **What account do you want to log into?** &mdash; `GitHub.com`
2. **What is your preferred protocol for Git operations?** &mdash; Select `SSH` (recommended) or `HTTPS` if you prefer token-based auth.
3. **How would you like to authenticate GitHub CLI?** &mdash; Select `Login with a web browser` and follow the one-time code flow.
4. **Choose a default Git host** &mdash; `GitHub.com`

If you selected **SSH**, `gh` will detect existing keys, offer to generate a new one if none are found, automatically upload the public key to GitHub, configure Git to use SSH, and set up the ssh-agent. That's it&mdash;you're done.

If you selected **HTTPS**, `gh` stores a token in your system secret service (GNOME Keyring / KDE Wallet) and configures itself as Git's credential helper. Run `gh auth setup-git` afterward to finalize the credential-helper config.

---

## Manual SSH Setup (Step by Step)

Follow this path if you want full control, already understand SSH concepts, or need to manage multiple keys.

### 1. Check for Existing SSH Keys

Run this to see if you already have keys:

```bash
ls -al ~/.ssh
```

Look for files named `id_ed25519.pub`, `id_ecdsa.pub`, or `id_rsa.pub`. If `~/.ssh` doesn't exist or no keys are listed, proceed to the next step.

### 2. Generate a New SSH Key

The Ed25519 algorithm is **recommended** for all modern Ubuntu systems (18.04+). It's faster and more secure than RSA.

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- Press **Enter** to accept the default file location (`~/.ssh/id_ed25519`).
- Enter a **passphrase** when prompted (recommended for security) or press Enter for none.

> **Legacy fallback:** If your system doesn't support Ed25519 (very old systems only), use RSA:
> ```bash
> ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
> ```

### 3. Add the Key to the ssh-agent

> **Ubuntu gotcha:** The ssh-agent does **not** start automatically on most Ubuntu desktops. Unlike macOS or Windows, you must start it explicitly.

Start the agent and add your key:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

If you chose a passphrase during key generation, you'll be prompted for it now.

#### Auto-Start ssh-agent on Login

To avoid running the commands above in every terminal session, add this block to your `~/.bashrc` (or `~/.profile` for login shells):

```bash
if [ -z "$SSH_AUTH_SOCK" ] || [ ! -S "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -s)" > /dev/null
fi
ssh-add ~/.ssh/id_ed25519 2>/dev/null
```

This starts the agent only if it isn't already running, then silently loads your key. After editing, apply the change:

```bash
source ~/.bashrc
```

> **Note:** The `--apple-use-keychain` flag shown in macOS documentation does **not** exist on Linux. There is no built-in passphrase caching equivalent on Ubuntu. If you want to avoid passphrase prompts on every SSH operation, generate the key without a passphrase (`ssh-keygen -N ""`) or use a keyring-integrated solution (see [Credential Helpers](#credential-helper-options-on-linux)).

### 4. Add the SSH Key to Your GitHub Account

#### Option A: Web UI (Manual)

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the output (it starts with `ssh-ed25519` and ends with your email). Then:

1. Open [GitHub SSH settings](https://github.com/settings/keys) in your browser.
2. Click **New SSH key**.
3. Set a descriptive title (e.g., "Ubuntu Laptop").
4. Paste the public key into the **Key** field.
5. Select **Authentication key** as the key type.
6. Click **Add SSH key**.

#### Option B: GitHub CLI (Faster)

```bash
gh ssh-key add ~/.ssh/id_ed25519.pub --title "Ubuntu Laptop"
```

> `gh` must already be authenticated (run `gh auth login` first) for this to work.

### 5. Test the SSH Connection

```bash
ssh -T git@github.com
```

On the first connection, you'll see a fingerprint prompt:

```
The authenticity of host 'github.com (140.82.121.3)' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Verify the fingerprint against [GitHub's published SSH fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints), then type `yes`.

Expected success output:

```
Hi YOUR_USERNAME! You've successfully authenticated, but GitHub does not provide shell access.
```

> **Troubleshooting:** If you see `Agent admitted failure to sign using the key`, run `ssh-add -l` to confirm the key is loaded, then try again. If the key isn't listed, go back to [step 3](#3-add-the-key-to-the-ssh-agent).

### 6. Set Your Git Identity

Your Git commits need a name and email. Set them globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

The email should match the one associated with your GitHub account.

Verify:

```bash
git config --global user.name
git config --global user.email
```

### 7. Fix Directory Permissions (Ubuntu Gotcha)

SSH is strict about file permissions. Incorrect permissions cause SSH to silently refuse your key.

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

If you have a `~/.ssh/config` file (for multi-key setups):

```bash
chmod 600 ~/.ssh/config
```

---

## Credential-Helper Options on Linux

Unlike Windows (where Git Credential Manager is bundled with Git for Windows), Ubuntu has no default credential helper. If you prefer **HTTPS** over SSH, here are your options.

### Option A: GitHub CLI as Credential Helper (Recommended for HTTPS)

```bash
sudo apt install gh
gh auth login           # select HTTPS, answer Y to authenticate with Git
gh auth setup-git       # configures gh as Git's credential helper
```

This stores tokens via your system secret service (GNOME Keyring / KDE Wallet).

### Option B: Git Credential Manager (GCM) for Linux

```bash
# Install .NET SDK (v10.0+), then:
dotnet tool install -g git-credential-manager
git-credential-manager configure
```

Configure the credential store to use your system secret service:

```bash
git config --global credential.credentialStore secretservice
```

### Option C: Built-in `git-credential-libsecret`

Ubuntu provides a credential helper backed by libsecret:

```bash
sudo apt install libsecret-1-0 libsecret-1-dev
git config --global credential.helper \
  /usr/libexec/git-core/git-credential-libsecret
```

---

## Switching Existing Repos from HTTPS to SSH

If you've been cloning repos with HTTPS URLs and want to switch to SSH:

```bash
git remote set-url origin git@github.com:OWNER/REPOSITORY.git
```

Verify the change:

```bash
git remote -v
```

Expected output:

```
origin  git@github.com:OWNER/REPOSITORY.git (fetch)
origin  git@github.com:OWNER/REPOSITORY.git (push)
```

---

## Comparison Table: All Approaches

| Criteria | Manual SSH | `gh auth login` (SSH) | `gh auth login` (HTTPS) |
|---|---|---|---|
| **Steps** | 4&ndash;5 manual commands + web copy/paste | One interactive command | One interactive command |
| **Key generation** | Manual `ssh-keygen` | Automatic if no key exists | N/A (uses token) |
| **Key upload** | Manual copy/paste to GitHub.com | Automatic | N/A |
| **ssh-agent setup** | Manual `eval` + `ssh-add` | Handled automatically | N/A |
| **Git config** | Manual `git config` | Auto-configured | Auto-configured via `gh auth setup-git` |
| **Best for** | Full control, multi-key setups, existing SSH knowledge | Simplicity with SSH | Windows GCM migrants who prefer HTTPS tokens |
| **Scriptable** | Yes, fully | Partially (interactive) | Yes, with `--with-token` |
| **Ubuntu-specific gotchas** | ssh-agent not auto-started | Must install `gh` from GitHub repo | Token stored via system secret service |

---

## References

- [GitHub Authentication Hub](https://docs.github.com/en/authentication)
- [Checking for Existing SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)
- [Generating a New SSH Key and Adding It to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Adding a New SSH Key to Your GitHub Account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
- [GitHub CLI: `gh ssh-key add`](https://cli.github.com/manual/gh_ssh-key_add)
- [Testing Your SSH Connection](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)
- [Working with SSH Key Passphrases](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/working-with-ssh-key-passphrases)
- [Setting Your Username in Git](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git)
- [Setting Your Commit Email Address](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address)
- [Caching Your GitHub Credentials in Git](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git)
- [Switching Remote URLs from HTTPS to SSH](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)
- [`gh auth login` Manual](https://cli.github.com/manual/gh_auth_login)
- [Git Credential Manager for Linux Installation](https://github.com/git-ecosystem/git-credential-manager/blob/release/docs/install.md)
- [GitHub's SSH Key Fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints)
- [Troubleshooting SSH](https://docs.github.com/en/authentication/troubleshooting-ssh)
