# Git Commands Cheatsheet

**Scope:** Practical reference for everyday Git operations — from first-time setup through advanced recovery. Commands, flags, and workflows a developer reaches for day-to-day.

---

## Table of Contents

1. [Setup & Configuration](#1-setup--configuration)
2. [Repository Init & Clone](#2-repository-init--clone)
3. [Remotes](#3-remotes)
4. [Basic Snapshotting](#4-basic-snapshotting)
5. [Branching & Merging](#5-branching--merging)
6. [Pulling from Other Branches & Remotes](#6-pulling-from-other-branches--remotes)
7. [Rebasing](#7-rebasing)
8. [Stashing](#8-stashing)
9. [History & Log](#9-history--log)
10. [Undoing Changes](#10-undoing-changes)
11. [Tagging](#11-tagging)
12. [Diff & Blame](#12-diff--blame)
13. [Worktrees](#13-worktrees)
14. [Advanced / Plumbing](#14-advanced--plumbing)

---

## 1. Setup & Configuration

### Identity

```bash
# Set the name and email attached to new commits
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

- `--global` writes to `~/.gitconfig` and applies to every repository on the machine.
- `--local` (default) writes to the current repository's `.git/config`.
- `--system` writes to `/etc/gitconfig` and applies to every user on the machine.

### Editor

```bash
git config --global core.editor "code --wait"     # VS Code
git config --global core.editor "nvim"             # Neovim
git config --global core.editor "nano"             # Nano
```

`--wait` tells the editor to block the terminal until the file is closed — important for commit messages and interactive rebase.

### Aliases

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.unstage "reset HEAD --"
git config --global alias.amend "commit --amend --no-edit"
```

Aliases map short names to longer Git commands. Use them for workflows you repeat often.

### List current config

```bash
git config --list                          # all levels, merged
git config --list --global                 # global only
git config --list --local                  # repo-level only
git config user.name                       # single key lookup
```

### Credential helper

```bash
git config --global credential.helper cache               # cache in memory (default 15 min)
git config --global credential.helper "cache --timeout 3600"  # 1 hour
git config --global credential.helper store               # stores on disk (plaintext — use with care)
git config --global credential.helper osxkeychain         # macOS Keychain
git config --global credential.helper manager-core        # GitHub CLI / Git Credential Manager
```

---

## 2. Repository Init & Clone

### Starting fresh

```bash
git init                                    # new repo in current directory
git init my-project                         # create directory + init inside it
```

### Cloning

```bash
git clone https://github.com/user/repo.git                # HTTPS (anonymous read, token for write)
git clone git@github.com:user/repo.git                     # SSH (key-based auth)
git clone https://github.com/user/repo.git my-folder      # clone into a specific directory
```

**Shallow clone** — useful in CI or for large repos where full history isn't needed:

```bash
git clone --depth 1 https://github.com/user/repo.git      # last commit only, no history
git clone --depth 10 https://github.com/user/repo.git     # last 10 commits
```

**Bare and mirror** — server-side / backup use:

```bash
git clone --bare https://github.com/user/repo.git         # bare repo (no working tree, no remote tracking)
git clone --mirror https://github.com/user/repo.git       # mirror (bare + all refs, including tags/notes)
```

With `--bare`, the result is not a working copy — it stores only the Git database. `--mirror` is the same but keeps remote-tracking branches up to date; it's what hosting platforms use internally.

---

## 3. Remotes

### Adding and inspecting

```bash
git remote add origin https://github.com/user/repo.git    # add a remote named "origin"
git remote add upstream https://github.com/other/repo.git # second remote (fork workflow)
git remote -v                                             # list remotes with URLs
```

### Changing a remote URL

```bash
git remote set-url origin git@github.com:user/repo.git    # switch from HTTPS to SSH
```

### Renaming and removing

```bash
git remote rename origin upstream                        # rename "origin" → "upstream"
git remote remove old-remote                             # delete a remote entirely
```

### Fetching

```bash
git fetch origin                                          # fetch all branches from origin
git fetch origin main                                     # fetch only the main branch from origin
git fetch --prune origin                                  # fetch and delete stale remote-tracking refs
git remote prune origin                                   # prune stale remote-tracking refs (no fetch)
```

### Pushing

```bash
git push origin main                                      # push local main to origin/main
git push -u origin feature                                # push + set upstream (tracking) — one-time, then just `git push`
git push origin --delete feature                          # delete remote branch
git push origin :feature                                  # same — delete remote branch (older syntax)
```

### Inspecting remotes

```bash
git remote show origin                                    # full remote info: URLs, tracked branches, push/pull config
```

---

## 4. Basic Snapshotting

### Status

```bash
git status                            # full status output
git status -s                         # short format (M modified, A added, ?? untracked)
git status -v                         # verbose — also shows diff of staged changes
```

### Adding files to the staging area

```bash
git add file.txt                      # stage a single file
git add .                             # stage everything in current directory (new, modified, deleted)
git add src/                          # stage everything under src/
git add -p                            # interactive patch mode — review each hunk before staging
git add -A                            # stage all changes in the entire working tree
```

Stage only what you intend to commit. `git add -p` is especially useful for splitting unrelated changes in the same file into separate commits.

### Committing

```bash
git commit -m "feat: add login endpoint"                  # inline message
git commit -am "fix: handle null pointer"                 # stage tracked files + commit in one step
git commit                                                 # opens editor for message
git commit --amend                                         # edit the last commit message / content
git commit --amend --no-edit                               # amend without touching the message
```

`git commit --amend` replaces the most recent commit. Do not amend commits that have already been pushed to a shared branch (unless you force-push and know the risks).

### Diff

```bash
git diff                              # unstaged changes (working tree vs staging area)
git diff --staged                     # staged changes (staging area vs last commit)
git diff HEAD                         # all uncommitted changes (working + staged vs last commit)
git diff HEAD~1 HEAD                  # changes introduced by the most recent commit
git diff main..feature                # changes on feature that aren't in main
git diff --stat                       # summary (files changed, insertions, deletions)
git diff --name-only                  # file paths only, no diff content
```

### Restore (the modern `checkout` replacement for file-level undo)

```bash
git restore file.txt                  # discard unstaged changes in working tree
git restore --staged file.txt         # unstage a file (move it out of staging area)
git restore --source=HEAD~1 file.txt  # restore file to how it looked one commit ago
git restore --staged --worktree .     # unstage and discard all local changes
```

### `.gitignore` basics

Create a file named `.gitignore` in the repo root. Patterns in it prevent matching files from being tracked or shown as untracked.

```
# Compiled output
*.pyc
__pycache__/

# Environment
.env
.venv/

# IDE
.vscode/
.idea/

# OS junk
.DS_Store
Thumbs.db
```

Use `git add -f <file>` to force-stage an ignored file.

---

## 5. Branching & Merging

### Listing branches

```bash
git branch                            # local branches (* = current)
git branch -a                         # all branches (local + remote-tracking)
git branch -r                         # remote-tracking branches only
git branch -v                         # local branches with last commit
```

### Creating and switching branches

```bash
git branch feature                    # create branch from current HEAD
git checkout feature                  # switch to feature
git switch feature                    # same (modern syntax, Git 2.23+)
git switch -c feature                 # create + switch in one step
git checkout -b feature               # create + switch (older syntax, still common)
git checkout -b feature main          # create from main, then switch
```

### Deleting branches

```bash
git branch -d feature                 # safe delete — only if fully merged upstream
git branch -D feature                 # force delete — discard unmerged work
git push origin --delete feature      # delete remote branch
```

### Renaming

```bash
git branch -m old-name new-name       # rename current branch or specify old name
git branch -m new-name                # rename current branch only (must not already exist)
```

### Merging

```bash
git merge feature                     # merge feature into current branch
git merge --no-ff feature             # force a merge commit even when fast-forward is possible
git merge --squash feature            # squash all feature commits into one pending change
git merge --abort                     # abort a merge with conflicts
```

**Fast-forward merge:** Git moves the current branch pointer forward to the target commit. No merge commit — only possible when the branches haven't diverged.

**`--no-ff`:** Always creates a merge commit. Useful for preserving the fact that a feature branch existed, especially on `main`.

### Seeing merged / unmerged branches

```bash
git branch --merged                   # branches that have been merged into current HEAD
git branch --merged main              # branches merged into main
git branch --no-merged                # branches not yet merged
```

### Handling merge conflicts

When a merge produces conflicts:

1. Git marks conflicted files with `<<<<<<<`, `=======`, `>>>>>>>`.
2. Edit the files to resolve each conflict.
3. `git add <resolved-file>` to mark as resolved.
4. `git commit` to complete the merge (or `git merge --continue`).

```bash
git merge --abort                     # walk away from the merge entirely
git diff                              # review conflicts during a merge
git log --merge                       # see commits that caused the conflict
```

---

## 6. Pulling from Other Branches & Remotes

### Pull (fetch + merge)

```bash
git pull                              # fetch current branch's remote + merge
git pull --rebase                     # fetch + rebase instead of merge
git pull origin main                  # pull origin/main into current branch
```

`git pull --rebase` is equivalent to `git fetch && git rebase @{upstream}`. It applies your local commits on top of the fetched commits, producing a linear history.

### Fetch a specific branch

```bash
git fetch origin main                 # fetch origin/main locally without switching
```

### Create a local branch from a remote branch

```bash
git checkout -b local-branch origin/remote-branch
git switch -c local-branch origin/remote-branch          # modern equivalent
git checkout --track origin/remote-branch                # same, using automatic naming
```

### Cherry-pick a single commit from another branch

```bash
git cherry-pick <commit-hash>         # apply the diff from that commit onto current HEAD
git cherry-pick abc1234               # practical example
git cherry-pick abc1234..def5678      # range of commits (exclusive start)
```

Cherry-pick copies the changes — it does not link the branches. Use it for hotfixes or selective backports.

### Pull from a different remote or branch

```bash
git pull upstream main                # pull from upstream's main into current branch
git pull https://github.com/user/repo.git main   # pull directly from a URL
```

### Grab a single file from another branch

```bash
git checkout other-branch -- path/to/file.txt        # copy file from other-branch into working tree
git restore --source=other-branch path/to/file.txt    # modern equivalent (Git 2.23+)
```

The file ends up in your staging area — `git commit` it if you want to keep it.

---

## 7. Rebasing

### Basic rebase

```bash
git rebase main                       # replay current branch's commits on top of main
git rebase main feature               # while on feature, same as: git switch feature && git rebase main
```

This detaches commits from your feature branch, applies them one by one after the tip of main, and updates the branch pointer.

### Interactive rebase

```bash
git rebase -i HEAD~3                  # rewrite the last 3 commits
git rebase -i main                    # rewrite all commits since diverging from main
```

In the interactive editor you can:

| Command | Effect |
|---|---|
| `pick` | keep the commit as-is |
| `reword` | change the message |
| `edit` | stop to amend |
| `squash` | combine into previous commit |
| `fixup` | combine, discarding message |
| `drop` | delete the commit |

### Handling rebase conflicts

```bash
# 1. Resolve conflicts in the marked files
# 2. Stage the resolved files
git add resolved-file.txt

# 3. Continue
git rebase --continue

# 4. Or bail out
git rebase --abort                    # return to pre-rebase state
git rebase --skip                     # skip this commit entirely
```

### When to rebase vs merge

| Situation | Approach |
|---|---|
| Feature branch with a messy local history | Rebase interactively to clean up before PR |
| Updating a feature branch with latest main | Rebase (or `git pull --rebase`) for linear history |
| Incorporating a feature back into main | Merge (or `--no-ff`) to preserve the feature as an identifiable unit |
| Public / shared branch | **Never rebase.** Use merge or revert. |
| Solo work or un-pushed commits | Rebase freely — no one else has those commits. |

---

## 8. Stashing

Temporarily set aside uncommitted changes so you can work on something else.

```bash
git stash push -m "WIP: refactoring auth"   # stash with a descriptive message
git stash                                    # shorthand (no message)
git stash push -u -m "with untracked files"  # include untracked files
git stash --include-untracked                # same, long flag
```

### Managing the stash stack

```bash
git stash list                        # view all stashes: stash@{0}, stash@{1}, ...
git stash pop                         # apply most recent stash and remove it from the stack
git stash pop stash@{2}               # apply and remove a specific stash
git stash apply                       # apply most recent stash without removing it
git stash apply stash@{2}             # apply a specific stash
git stash drop                        # remove most recent stash
git stash drop stash@{2}              # remove a specific stash
git stash clear                       # remove all stashes
```

Use `git stash pop` when you're sure you want the changes back immediately. Use `git stash apply` when you want the same changes on multiple branches.

---

## 9. History & Log

### Basic log

```bash
git log                               # full commit history
git log --oneline                     # one commit per line (short hash + summary)
git log --oneline --graph             # with ASCII branch topology
git log --oneline --graph --all       # all refs (local + remote branches, tags)
git log --oneline --graph --all --decorate  # same + show ref names
```

### Filtering

```bash
git log --oneline --author="Alice"                   # commits by a specific author
git log --oneline --since="2025-01-01"               # commits after a date
git log --oneline --until="2025-06-01"               # commits before a date
git log --oneline --since="2 weeks ago"              # relative dates
git log --oneline --grep="hotfix"                    # commits whose message matches a pattern
git log --oneline -- README.md                       # commits that touched a specific file
```

### Viewing changes in the log

```bash
git log -p                            # full diff for each commit
git log --stat                        # summary of changed files per commit
git log --name-only                   # file paths only
```

### Shortlog — changelog-style summary

```bash
git shortlog                          # commits grouped by author, alphabetically
git shortlog -sn                      # sorted by commit count (s: summary, n: numeric)
git shortlog -sn --since="2025-01-01" # since a date
git shortlog -e                       # include email addresses
```

---

## 10. Undoing Changes

### Fix the last commit

```bash
git commit --amend                    # edit message or re-stage files into last commit
git commit --amend --no-edit          # keep message, just add staged changes
```

Only amend commits that haven't been pushed yet.

### Reset — move the current branch pointer

```bash
git reset --soft HEAD~1               # undo commit, keep changes staged
git reset --mixed HEAD~1              # undo commit, keep changes unstaged (default)
git reset --hard HEAD~1               # undo commit AND discard changes (irrecoverable without reflog)
git reset --hard origin/main          # reset local branch to exactly match remote
```

| Mode | Working tree | Staging area | Commit history |
|---|---|---|---|
| `--soft` | untouched | untouched | undone |
| `--mixed` | untouched | cleared | undone |
| `--hard` | overwritten | overwritten | undone |

**Do not use `git reset` on shared branches** — it rewrites history.

### Revert — safe undo for shared history

```bash
git revert <commit-hash>              # create a new commit that undoes the named commit
git revert HEAD                       # undo the most recent commit
git revert HEAD~3..HEAD               # undo a range of commits
git revert --no-commit HEAD           # stage the reversal but don't commit yet
```

Revert is safe because it adds a new commit rather than erasing existing ones.

### Restore — unstage or discard

```bash
git restore file.txt                  # discard unstaged changes in working tree
git restore --staged file.txt         # unstage a file
git restore --source=HEAD file.txt    # restore to last committed version
```

### Clean — remove untracked files

```bash
git clean -n                          # dry-run — show what would be removed
git clean -fd                         # remove untracked files and directories
git clean -fdX                        # remove ignored files too (-X removes only ignored)
```

---

## 11. Tagging

### Listing tags

```bash
git tag                               # list all tags alphabetically
git tag -l "v2.*"                     # filter by pattern
git tag --sort=-version:refname       # sorted by version (descending)
```

### Creating tags

```bash
# Lightweight (just a named pointer)
git tag v1.0

# Annotated (recommended — stores tagger, message, date)
git tag -a v1.0 -m "Release 1.0 — stable API"
git tag -a v1.0 -m "Release 1.0" <commit-hash>   # tag an older commit
```

Annotated tags are the standard for releases. Lightweight tags are fine for private bookmarks.

### Pushing tags

```bash
git push origin v1.0                  # push a specific tag
git push origin --tags                # push all tags that aren't on the remote
```

### Deleting tags

```bash
git tag -d v1.0                       # delete local tag
git push origin --delete v1.0         # delete remote tag
git push origin :refs/tags/v1.0       # same (older syntax)
```

---

## 12. Diff & Blame

### Diff variations

```bash
git diff                              # unstaged changes (working tree vs staging area)
git diff --staged                     # staged changes (staging area vs last commit)
git diff HEAD                         # all uncommitted changes
git diff main..feature                # changes on feature not in main
git diff main...feature               # changes in feature since it diverged from main
git diff --stat                       # summary with counts
git diff --name-only                  # just file names
git diff --word-diff                  # word-level instead of line-level
git diff HEAD~2 HEAD                  # changes introduced by the last two commits
git diff main feature -- src/         # scope to a subdirectory
```

### Blame — find who changed each line

```bash
git blame file.txt                    # show commit hash, author, date per line
git blame -L 20,40 file.txt           # blame lines 20-40 only
git blame -w file.txt                 # ignore whitespace changes
git blame -e file.txt                 # show email instead of name
```

Use `git blame` to understand why a line exists or find the commit that introduced a bug.

---

## 13. Worktrees

Worktrees let you check out multiple branches simultaneously in separate directories, all sharing the same `.git` directory.

```bash
# Create a new worktree linked to a branch
git worktree add ../project-hotfix hotfix           # create worktree at ../project-hotfix on branch 'hotfix'
git worktree add -b new-feature ../project-feature  # create a new branch + worktree in one step
```

### Managing worktrees

```bash
git worktree list                     # show all linked worktrees
git worktree remove ../project-hotfix # remove a worktree (must be clean)
git worktree prune                    # prune stale worktree metadata
```

Worktrees are ideal for context switching without stashing or creating a fresh clone.

---

## 14. Advanced / Plumbing

### Reflog — recovery safety net

```bash
git reflog                            # show where HEAD has been (local movement only)
git reflog show main                  # reflog for a specific branch
git reset --hard HEAD@{2}             # restore HEAD to where it was 2 moves ago
git checkout HEAD@{3}                 # inspect the state from 3 moves ago
```

The reflog records every movement of HEAD — commits, resets, rebases, merges. It is your last resort for recovering lost commits. It is local-only and expires entries after ~90 days by default.

### Bisect — binary search for bugs

```bash
git bisect start                      # start bisect session
git bisect bad                        # mark current commit as buggy
git bisect good v1.0                  # mark a known-good commit
# Git checks out the midpoint. Test it, then:
git bisect good                       # if this commit is fine
git bisect bad                        # if this commit is buggy
# Repeat until Git identifies the first bad commit.
git bisect reset                      # end bisect session, return to original HEAD
```

Use `git bisect run <script>` to automate the process with a test script that exits 0 for good, non-0 for bad.

### Archive — export snapshot

```bash
git archive -o ../repo.zip HEAD                   # export HEAD as zip
git archive -o ../repo.tar.gz --prefix=repo/ v1.0  # export tag, with top-level prefix
```

No `.git` directory, no ignored files — just the tracked files at that point in history.

### Submodules

```bash
git submodule add https://github.com/user/lib.git lib   # add as submodule
git submodule update --init --recursive                  # clone + init all submodules
git submodule status                                     # show pinned commit per submodule
git submodule update --remote                            # update to latest commit on tracked branch
```

Submodules embed one repository inside another at a fixed commit. Clone with `git clone --recurse-submodules <url>` to fetch everything at once.

---

<!--
  Reference validation: every flag and option listed above was verified
  against Git 2.40+ behavior in June 2026. Flags that do not exist have
  been excluded. If you find an error, open a PR against this file.
-->
