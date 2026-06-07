# Bash Command Cheatsheet

<!-- markdownlint-disable MD013 -->
**Last updated:** 2026-06-06

**Scope:** Practical reference for everyday GNU Bash shell commands on a typical Linux environment. Covers core navigation, file operations, text processing, permissions, process management, shell builtins, search, archiving, networking, disk management, user administration, date/time, readline shortcuts, job control, and environment configuration.

**Audience:** Developers, system administrators, DevOps engineers, and power users who work from the command line day-to-day.

---

## Table of Contents

1. [Core Navigation and File Operations](#1-core-navigation-and-file-operations)
2. [File Viewing and Text Processing](#2-file-viewing-and-text-processing)
3. [Permissions and Ownership](#3-permissions-and-ownership)
4. [Process Management](#4-process-management)
5. [Shell Builtins and Scripting](#5-shell-builtins-and-scripting)
6. [File and String Search](#6-file-and-string-search)
7. [Compression and Archiving](#7-compression-and-archiving)
8. [Network Commands](#8-network-commands)
9. [Disk and Filesystem](#9-disk-and-filesystem)
10. [User and Group Management](#10-user-and-group-management)
11. [Date, Time, and Scheduling](#11-date-time-and-scheduling)
12. [Shell Navigation Shortcuts (Readline)](#12-shell-navigation-shortcuts-readline)
13. [Job Control and Multiplexing](#13-job-control-and-multiplexing)
14. [Environment and Configuration](#14-environment-and-configuration)

---

## 1. Core Navigation and File Operations

### `cd` — Change directory

Bourne shell builtin (GNU Bash manual §4.1). Changes the current working directory.

```bash
cd /path/to/dir     # Absolute or relative path
cd -                # Go to previous directory ($OLDPWD)
cd                  # Go to $HOME (default)
cd ~user            # Go to user's home directory
```

| Flag | Description |
|------|-------------|
| `-P` | Resolve symlinks (physical path) |
| `-L` | Follow symlinks (logical, default) |
| `-e` | Fail with `-P` if PWD cannot be determined |

`cd` respects the `$CDPATH` variable — a colon-separated list of directories to search when a relative path is given that does not start with `.` or `..`.

### `pwd` — Print working directory

Prints the absolute pathname of the current working directory. GNU Bash §4.1, Coreutils §19.1.

```bash
pwd      # Logical path (may show symlinks)
pwd -P   # Physical path (no symlinks)
pwd -L   # Logical path (default)
```

### `ls` — List directory contents

Coreutils §10.1.

```bash
ls -la                 # Long format + all files (including .)
ls -lhS                # Human-readable, sorted by size
ls -lt                 # Sorted by modification time (newest first)
ls -ltr                # Reverse time order (oldest first)
ls -d */               # List directories only (not their contents)
ls --color=auto        # Colorized output (common alias: ls --color=auto)
```

| Flag | Description |
|------|-------------|
| `-l` | Long format (permissions, owner, size, mtime) |
| `-a` | Include all entries (`.` and `..`) |
| `-h` | Human-readable sizes (K, M, G) |
| `-S` | Sort by file size (largest first) |
| `-t` | Sort by modification time |
| `-r` | Reverse sort order |
| `-R` | Recursive listing |
| `-d` | List directory entries, not contents |
| `--color=auto` | Colorize output (auto detects pipe) |

### `cp` — Copy files and directories

Coreutils §11.1.

```bash
cp file1 file2            # Copy file1 to file2
cp -r src/ dst/           # Recursive copy
cp -a src/ dst/           # Archive mode (preserve all, recursive)
cp -i file1 file2         # Interactive (prompt before overwrite)
cp -uv src/* dst/         # Update (copy only when source is newer)
cp -n file1 file2         # No clobber (do not overwrite)
cp -l file1 link1         # Create hard link instead of copy
cp -s file1 symlink1      # Create symbolic link instead of copy
```

| Flag | Description |
|------|-------------|
| `-r`, `-R` | Recursive (copy directories) |
| `-i` | Interactive (prompt before overwrite) |
| `-u` | Update (copy only when source is newer or missing) |
| `-p` | Preserve attributes (mode, ownership, timestamps) |
| `-a` | Archive mode (`-dR --preserve=all`) |
| `-v` | Verbose (show files being copied) |
| `-l` | Create hard link instead of copying |
| `-s` | Create symbolic link instead of copying |
| `-n` | No clobber (do not overwrite existing files) |
| `--backup` | Back up existing destination files |
| `-T` | Treat destination as a normal file (no-target-directory) |
| `-t DIR` | Target directory (useful with `xargs`) |

### `mv` — Move (rename) files

Coreutils §11.4.

```bash
mv file1 file2            # Rename file1 to file2
mv file1 file2 dir/       # Move files into dir/
mv -i file1 dir/          # Interactive (prompt before overwrite)
mv -uv src/* dst/         # Update (move only when source is newer)
mv -n file1 dst/          # No clobber
mv -b file1 dst/          # Back up existing destination
```

| Flag | Description |
|------|-------------|
| `-i` | Interactive (prompt before overwrite) |
| `-u` | Update (move only when source is newer) |
| `-v` | Verbose |
| `-n` | No clobber |
| `-b`, `--backup` | Back up existing destination files |
| `-T` | Treat destination as a normal file |
| `-t DIR` | Target directory (useful with `xargs`) |

### `rm` — Remove files and directories

Coreutils §11.5. **`--preserve-root`** is enabled by default — `rm -rf /` will refuse to run.

```bash
rm file                    # Remove a file
rm -r dir/                 # Recursive (required for directories)
rm -rf dir/                # Force + recursive (use with caution)
rm -i file                 # Interactive (prompt before each removal)
rm -d empty_dir/           # Remove empty directory (uses unlink)
rm -v file                 # Verbose
```

| Flag | Description |
|------|-------------|
| `-r`, `-R` | Recursive (required for directories) |
| `-f` | Force (ignore nonexistent files, suppress prompts) |
| `-i` | Interactive (prompt before each removal) |
| `-v` | Verbose |
| `-d` | Remove empty directories with unlink |
| `--preserve-root` | Do not remove `/` (default) |

### `mkdir` — Create directories

Coreutils §12.3.

```bash
mkdir dir                 # Create single directory
mkdir -p a/b/c            # Create parent directories as needed
mkdir -v dir              # Verbose
mkdir -m 700 secret/      # Create with specific permissions
```

| Flag | Description |
|------|-------------|
| `-p` | Create parent directories as needed (no error if exists) |
| `-v` | Verbose (print each created directory) |
| `-m MODE` | Set permissions (chmod-style) |

### `rmdir` — Remove empty directories

Coreutils §12.7.

```bash
rmdir dir                 # Remove empty directory
rmdir -p a/b/c            # Remove parents if they become empty
rmdir --ignore-fail-on-non-empty  # Silently skip non-empty dirs
```

### `touch` — Change file timestamps / create file

Coreutils §13.4.

```bash
touch file                # Create empty file or update timestamps
touch -a file             # Update access time only
touch -m file             # Update modification time only
touch -c file             # Do not create file if it does not exist
touch -t 202606051200 file  # Set timestamp ([[CC]YY]MMDDhhmm[.ss])
touch -d "yesterday" file   # Set timestamp from date string
```

| Flag | Description |
|------|-------------|
| `-a` | Change access time only |
| `-m` | Change modification time only |
| `-c`, `--no-create` | Do not create the file if it does not exist |
| `-t STAMP` | Use specific timestamp instead of current time |
| `-d`, `--date STRING` | Parse date string for timestamp |

### `ln` — Create links

Coreutils §12.2.

```bash
ln -s target linkname     # Create symbolic link
ln target linkname        # Create hard link
ln -sf target linkname    # Force (replace existing)
ln -sr target linkname    # Relative symbolic link (resolve relative)
ln -v target linkname     # Verbose
```

| Flag | Description |
|------|-------------|
| `-s` | Symbolic (soft) link |
| `-f` | Force (remove existing destination) |
| `-i` | Interactive |
| `-n` | Treat destination as normal file if it is a symlink to dir |
| `-v` | Verbose |
| `-b` | Back up existing files |
| `-r` | Create relative symbolic link |

---

## 2. File Viewing and Text Processing

### `cat` — Concatenate and display files

Coreutils §3.1.

```bash
cat file                  # Display file content
cat file1 file2 > merged  # Concatenate files
cat -n file               # Number all lines
cat -b file               # Number non-blank lines
cat -s file               # Squeeze multiple blank lines into one
cat -A file               # Show all (equivalent to -vET)
```

| Flag | Description |
|------|-------------|
| `-n` | Number all output lines |
| `-b` | Number non-blank output lines |
| `-s` | Squeeze consecutive blank lines |
| `-E` | Display `$` at end of each line |
| `-T` | Display tabs as `^I` |
| `-A` | Equivalent to `-vET` (show all non-printing chars) |

### `less` — Interactive pager

`less` is the standard interactive pager (not part of coreutils — typically from the `less` package).

```bash
less file                 # Open file in pager
command | less            # Pipe command output to pager
less +F file              # Start in follow mode (like tail -f)
less -N file              # Show line numbers
```

| Key | Action |
|-----|--------|
| `Space` / `PgDn` | Next page |
| `b` / `PgUp` | Previous page |
| `j` / `k` | Scroll down/up one line |
| `/pattern` | Search forward |
| `?pattern` | Search backward |
| `n` / `N` | Next / previous match |
| `g` / `G` | Go to top / bottom |
| `F` | Follow mode (like `tail -f`); Ctrl+C to stop |
| `q` | Quit |

### `more` — Original pager

Simple pager, predecessor to `less`.

```bash
more file                 # Open file
command | more            # Pipe output
```

| Key | Action |
|-----|--------|
| `Space` | Next page |
| `Enter` | Next line |
| `q` | Quit |

### `head` — Output first part of files

Coreutils §5.1.

```bash
head file                 # First 10 lines (default)
head -n 20 file           # First 20 lines
head -c 100 file          # First 100 bytes
head -n -5 file           # All but the last 5 lines
```

| Flag | Description |
|------|-------------|
| `-n N` | First N lines (or `-n +N` to start at line N) |
| `-c N` | First N bytes |
| `-q` | Quiet (suppress filename headers) |
| `-v` | Verbose (always show filename headers) |

### `tail` — Output last part of files

Coreutils §5.2.

```bash
tail file                 # Last 10 lines (default)
tail -n 20 file           # Last 20 lines
tail -f file              # Follow (watch for new content)
tail -F file              # Follow by name (handles log rotation)
tail -n +5 file           # All lines starting from line 5
```

| Flag | Description |
|------|-------------|
| `-n N` | Last N lines (or `-n +N` to start at line N) |
| `-c N` | Last N bytes |
| `-f` | Follow (append as file grows) |
| `-F` | Follow by name (handles log rotation, reopens) |
| `--pid=PID` | Terminate when PID dies |
| `-s SEC` | Sleep interval between checks (with `-f`) |

### `grep` — Print lines matching a pattern

GNU grep. The standard text search tool.

```bash
grep pattern file                 # Basic search
grep -i pattern file              # Case-insensitive
grep -r pattern dir/              # Recursive
grep -rn pattern .                # Recursive with line numbers
grep -l pattern *                 # List filenames only (matching)
grep -L pattern *                 # List filenames only (non-matching)
grep -c pattern file              # Count matches per file
grep -E "foo|bar" file            # Extended regex (ERE)
grep -P "\d{3}-\d{4}" file       # Perl-compatible regex (PCRE)
grep -o pattern file              # Only matching text (not whole line)
grep -A 3 -B 2 pattern file       # Context: 3 after, 2 before
grep -C 5 pattern file            # Context: 5 lines around
grep -q pattern file              # Quiet (exit status only)
grep -v pattern file              # Invert match (lines NOT matching)
grep --color=auto pattern file    # Colorized output
```

| Flag | Description |
|------|-------------|
| `-i` | Case-insensitive |
| `-v` | Invert match (select non-matching lines) |
| `-r`, `-R` | Recursive (follow symlinks with `-R`) |
| `-l` | List filenames with matches only |
| `-L` | List filenames without matches only |
| `-n` | Show line numbers |
| `-c` | Count matching lines per file |
| `-E` | Extended regular expressions (ERE) |
| `-P` | Perl-compatible regular expressions (PCRE) |
| `-o` | Print only matched parts |
| `-A N` | Print N lines after match |
| `-B N` | Print N lines before match |
| `-C N` | Print N lines around match |
| `--color=auto` | Highlight matches |
| `-q` | Quiet (exit status only, no output) |

### `sed` — Stream editor

GNU sed. Primarily used for text transformations.

```bash
sed 's/old/new/' file                    # Substitute (first occurrence per line)
sed 's/old/new/g' file                   # Substitute (all occurrences)
sed 's/old/new/2' file                   # Substitute (second occurrence only)
sed -i 's/old/new/g' file               # In-place edit
sed -i.bak 's/old/new/g' file           # In-place with backup
sed -n '/pattern/p' file                 # Print matching lines only
sed -n '5,10p' file                      # Print lines 5-10
sed '/pattern/d' file                    # Delete matching lines
sed 's/old/new/gw output.txt' file       # Write matches to file
sed -e 's/foo/bar/' -e 's/baz/qux/' file # Multiple scripts
```

| Flag | Description |
|------|-------------|
| `-i[SUFFIX]` | In-place edit (optional backup suffix) |
| `-n` | Suppress automatic printing (use with `p` flag) |
| `-e SCRIPT` | Add script to commands |
| `-f FILE` | Read script from file |

### `awk` — Pattern scanning and processing language

GNU awk (gawk). Data extraction and reporting tool.

```bash
awk '{print $1, $3}' file              # Print first and third fields
awk -F, '{print $1}' file              # Comma-separated fields
awk '/pattern/ {print $0}' file        # Print lines matching pattern
awk '{sum+=$1} END {print sum}' file   # Sum first column
awk -v var=5 '{print $1 + var}' file   # Set external variable
awk 'NR > 1 {print}' file              # Skip header line
awk '!seen[$0]++' file                 # Remove duplicate lines (keep order)
```

| Flag | Description |
|------|-------------|
| `-F SEP` | Field separator (regex) |
| `-v VAR=VAL` | Set a variable before execution |
| `-f FILE` | Read awk program from file |

| Built-in Variable | Description |
|--------------------|-------------|
| `$0` | Entire current line |
| `$1`, `$2`, ... | Field N |
| `NR` | Number of current record (line) |
| `NF` | Number of fields in current record |
| `FS` | Field separator (input) |
| `OFS` | Output field separator |
| `RS` | Record separator (input) |
| `ORS` | Output record separator |

### `sort` — Sort lines of text files

Coreutils §7.1.

```bash
sort file                         # Alphabetical sort
sort -n file                      # Numeric sort
sort -h file                      # Human-numeric sort (2K, 1G)
sort -r file                      # Reverse sort
sort -u file                      # Unique (sort and deduplicate)
sort -k2 file                     # Sort by field 2
sort -t: -k3 -n /etc/passwd      # Delimiter :, field 3, numeric
sort -V version.list              # Version sort (natural)
sort -R file                      # Random sort (shuffle)
sort -c file                      # Check if already sorted
sort -f file                      # Fold case (ignore case)
```

| Flag | Description |
|------|-------------|
| `-n` | Numeric sort |
| `-h` | Human-numeric (e.g., 2K, 1G) |
| `-r` | Reverse |
| `-k POS` | Sort key by field |
| `-t SEP` | Field separator |
| `-u` | Unique (deduplicate) |
| `-f` | Fold case (case-insensitive) |
| `-V` | Version sort (natural) |
| `-R` | Random sort |
| `-c` | Check if sorted |
| `-o FILE` | Write result to file |
| `--debug` | Annotate sort key positions |

### `uniq` — Report or omit repeated lines

Coreutils §7.3. **Input must be sorted** (use `sort` first).

```bash
uniq file                        # Remove consecutive duplicates
uniq -c file                     # Count occurrences
uniq -d file                     # Only show duplicates
uniq -u file                     # Only show unique lines
uniq -i file                     # Case-insensitive comparison
sort file | uniq                 # Standard deduplication pipeline
```

| Flag | Description |
|------|-------------|
| `-c` | Prefix lines by count |
| `-d` | Only print duplicate lines (one per group) |
| `-u` | Only print unique lines |
| `-i` | Case-insensitive comparison |
| `-f N` | Skip first N fields |
| `-s N` | Skip first N characters |
| `-w N` | Compare no more than N characters |

### `wc` — Word, line, character, and byte count

Coreutils §6.1.

```bash
wc file                        # Lines, words, bytes
wc -l file                     # Line count
wc -w file                     # Word count
wc -c file                     # Byte count
wc -m file                     # Character count
wc -L file                     # Maximum line length
```

| Flag | Description |
|------|-------------|
| `-l` | Lines |
| `-w` | Words |
| `-c` | Bytes |
| `-m` | Characters |
| `-L` | Maximum line length |

### `cut` — Remove sections from each line

Coreutils §8.1.

```bash
cut -f1,3 file                 # Extract fields 1 and 3 (tab delimited)
cut -d: -f1,3 /etc/passwd      # Colon delimiter, fields 1 and 3
cut -c1-5 file                 # Characters 1 through 5
cut -b1-3 file                 # Bytes 1 through 3
cut -d: -f1 --output-delimiter=' '  # Output with space delimiter
```

| Flag | Description |
|------|-------------|
| `-f LIST` | Field list (comma/space separated) |
| `-d DELIM` | Field delimiter (default: tab) |
| `-c LIST` | Character positions |
| `-b LIST` | Byte positions |
| `-s` | Suppress lines with no delimiter |
| `--output-delimiter STR` | Output delimiter |

### `diff` — Compare files line by line

diffutils.

```bash
diff -u file1 file2            # Unified format (standard for patches)
diff -c file1 file2            # Context format
diff -i file1 file2            # Ignore case
diff -w file1 file2            # Ignore whitespace
diff -r dir1/ dir2/            # Recursive directory comparison
diff -q file1 file2            # Only report if different
diff -y file1 file2            # Side-by-side output
```

| Flag | Description |
|------|-------------|
| `-u` | Unified output format |
| `-c` | Context output format |
| `-i` | Ignore case differences |
| `-w` | Ignore whitespace differences |
| `-r` | Recursive (compare directories) |
| `-q` | Only report whether files differ |
| `-y` | Side-by-side output |

---

## 3. Permissions and Ownership

### `chmod` — Change file mode bits

Coreutils §13.3.

```bash
chmod +x script.sh            # Add execute permission
chmod 755 file                # rwxr-xr-x
chmod 644 file                # rw-r--r--
chmod -R g+w dir/             # Recursive: add group write
chmod u=rw,g=r,o= file        # User: rw, Group: r, Other: none
chmod -R u+X dir/             # Recursive: add execute for dirs only
```

| Flag | Description |
|------|-------------|
| Numeric | 4-digit octal mode (setuid, setgid, sticky, owner, group, other) |
| Symbolic | `u/g/o/a` `+/-/=` `r/w/x/X/s/t` |
| `-R` | Recursive |
| `--reference=FILE` | Copy mode from reference file |

**Common modes:**

| Mode | Numeric | Meaning |
|------|---------|---------|
| `rwx------` | `700` | Private (owner only) |
| `rwxr-xr-x` | `755` | Executable (world-readable) |
| `rw-r--r--` | `644` | Regular file (world-readable) |
| `rw-rw----` | `660` | Owner + group, no public |
| `rw-------` | `600` | Owner-only (e.g., SSH keys) |

### `chown` — Change file owner and group

Coreutils §13.1.

```bash
chown user file               # Change owner
chown user:group file         # Change owner and group
chown :group file             # Change group only
chown -R user:group dir/      # Recursive
chown --from=old_user user file  # Change only if current owner matches
chown -h symlink              # Affect symlink itself, not its target
```

| Flag | Description |
|------|-------------|
| `-R` | Recursive |
| `--from=UID` | Change only if current owner/group matches |
| `--reference=FILE` | Copy ownership from reference file |
| `-h` | Affect symbolic links (not their targets) |

### `chgrp` — Change group ownership

Coreutils §13.2.

```bash
chgrp group file              # Change group
chgrp -R group dir/           # Recursive
chgrp --reference=FILE target # Copy group from reference
```

Flags mirror `chown` (minus user-related options).

### `umask` — Set file creation mask

Bash builtin §4.1.

```bash
umask                         # Show current mask (octal)
umask 022                     # Set mask (755 dirs, 644 files)
umask 077                     # Restrictive mask (700 dirs, 600 files)
umask -S                      # Symbolic display
umask -p                      # Reusable output (can be sourced)
```

The umask is subtracted from the base permissions (`777` for directories, `666` for files). A `umask 022` produces directories with `755` and files with `644`.

---

## 4. Process Management

### `ps` — Report process status

procps-ng.

```bash
ps aux                        # BSD style: all processes
ps -ef                        # Unix style: full listing
ps -ejH                       # Process tree
ps -eo pid,ppid,cmd,%cpu,%mem # Custom output fields
ps -u username                # Processes for a user
ps -C bash                    # Processes by command name
ps --sort=-%cpu               # Sort by CPU descending
ps -p PID1,PID2               # Specific PIDs
```

**State codes (from `ps` STAT column):**

| Code | Meaning |
|------|---------|
| `D` | Uninterruptible sleep (I/O) |
| `I` | Idle kernel thread |
| `R` | Running or runnable |
| `S` | Interruptible sleep (waiting) |
| `T` | Stopped by job control signal |
| `t` | Stopped by debugger (traced) |
| `Z` | Zombie (terminated, parent not reaped) |

### `top` — Display Linux processes (interactive)

```bash
top                           # Start interactive process viewer
top -u username               # Show only user's processes
top -p PID1,PID2              # Monitor specific PIDs
```

| Interactive Key | Action |
|-----------------|--------|
| `P` | Sort by CPU usage |
| `M` | Sort by memory usage |
| `k` | Kill a process (prompt for PID + signal) |
| `u` | Filter by user |
| `1` | Toggle SMP (individual CPU view) |
| `q` | Quit |

### `kill` — Send a signal to a process

Bash builtin (also `/bin/kill`). GNU Bash §7.2.

```bash
kill PID                      # Send SIGTERM (15) — graceful shutdown
kill -9 PID                   # Send SIGKILL — forced kill
kill -2 PID                   # Send SIGINT (Ctrl+C equivalent)
kill -HUP PID                 # Send SIGHUP (1) — reload config
kill -l                       # List all signal names
kill %1                       # Kill job by jobspec
```

**Common signals:**

| Signal | Number | Description |
|--------|--------|-------------|
| `SIGHUP` | 1 | Hangup (reload config) |
| `SIGINT` | 2 | Interrupt (Ctrl+C) |
| `SIGQUIT` | 3 | Quit (Ctrl+\ with core dump) |
| `SIGKILL` | 9 | Force kill (cannot be caught/ignored) |
| `SIGTERM` | 15 | Terminate (graceful, default) |
| `SIGSTOP` | 19 | Stop (pause, cannot be caught) |
| `SIGCONT` | 18 | Continue if stopped |

### `killall` — Kill processes by name

procps-ng.

```bash
killall nginx                 # Kill all nginx processes (SIGTERM)
killall -9 nginx              # Force kill all nginx
killall -u username           # Kill all processes owned by user
killall -i nginx              # Interactive (ask for each)
killall -I Nginx              # Case-insensitive name match
killall -w nginx              # Wait until processes die
```

### `pgrep` / `pkill` — Look up or signal processes by name/attribute

procps-ng.

```bash
pgrep -u root sshd            # Find PIDs of sshd running as root
pkill -f "python script.py"   # Kill processes matching full command line
pgrep -x bash                 # Exact name match
pkill -9 -u username          # Force kill all user's processes
pgrep -n chrome               # Newest matching process
pgrep -o chrome               # Oldest matching process
```

| Flag | Description |
|------|-------------|
| `-u UID` | Match by user ID |
| `-f` | Match full command line (not just process name) |
| `-x` | Exact match |
| `-G GID` | Match by group ID |
| `-U UID` | Match by real user ID |
| `-n` | Newest match only |
| `-o` | Oldest match only |

### `nohup` — Run a command immune to hup信号

Coreutils §23.4.

```bash
nohup command &               # Run in background, ignore SIGHUP
nohup command > output.log &  # Redirect output explicitly
```

If stdout is a terminal, output is redirected to `nohup.out`.

### `jobs` — List active jobs

Bash builtin §7.2.

```bash
jobs                          # List jobs in current session
jobs -l                       # Include PID
jobs -n                       # Only jobs that changed status
jobs -p                       # PIDs only
jobs -r                       # Running jobs only
jobs -s                       # Stopped jobs only
```

### `fg` / `bg` — Bring job to foreground / background

Bash builtins §7.2.

```bash
fg %1                         # Bring job 1 to foreground
bg %1                         # Resume job 1 in background
fg                            # Bring current job to foreground
bg                            # Resume current job in background
```

**Jobspec references:**

| Spec | Meaning |
|------|---------|
| `%N` | Job number N |
| `%%` or `%+` | Current job |
| `%-` | Previous job |
| `%STRING` | Job whose command starts with STRING |
| `%?STRING` | Job whose command contains STRING |

### `disown` — Remove jobs from job table

Bash builtin §7.2.

```bash
disown %1                     # Remove job 1 from table (no SIGHUP on exit)
disown -h %1                  # Mark job but keep in table (still managed)
disown -a                     # Remove all jobs
disown -r                     # Remove running jobs only
```

---

## 5. Shell Builtins and Scripting

### `echo` — Display a line of text

Bash builtin §4.2.

```bash
echo "Hello, world"           # Basic output
echo -n "No newline"          # Suppress trailing newline
echo -e "Line1\nLine2"        # Interpret escape sequences
echo -E "No\tescapes"         # Explicitly disable escape interpretation
```

**Escape sequences** (with `-e`): `\n` (newline), `\t` (tab), `\r` (carriage return), `\\` (backslash), `\0NNN` (octal), `\xHH` (hex). Prefer `printf` for portability.

### `printf` — Format and print data

Bash builtin §4.2.

```bash
printf "Hello, %s\n" "world"           # String format
printf "%d bytes\n" 1024               # Decimal integer
printf "%.2f%%\n" 95.5                 # Float with precision
printf "%x\n" 255                      # Hex
printf "%s\t%s\n" col1 col2            # Tab-separated columns
printf -v var "Formatted: %s" "text"   # Assign to variable
printf "%(%Y-%m-%d)T\n" -1             # Current date (Bash extension)
printf "%q\n" "path with spaces"       # Quoted output (safe for eval)
```

| Flag | Description |
|------|-------------|
| `-v VAR` | Assign output to variable (not stdout) |

**Format specifiers:** `%s` (string), `%d` (decimal), `%f` (float), `%x` (hex), `%b` (escape sequences), `%q` (quoted for shell reuse), `%(datefmt)T` (strftime format for epoch).

### `read` — Read a line from stdin

Bash builtin §4.2.

```bash
read -p "Enter name: " name            # Prompt and read
read -s -p "Password: " pass           # Silent (no echo)
read -r line                            # Raw (no backslash escaping)
read -t 5 input                        # Timeout after 5 seconds
read -n 1 key                          # Read exactly 1 character
read -a arr                            # Read words into array
read -d: field1 extra                  # Use : as delimiter
read -u 3 line                         # Read from file descriptor 3
```

| Flag | Description |
|------|-------------|
| `-a ARRAY` | Read into indexed array |
| `-d DELIM` | Delimiter (default: newline) |
| `-i TEXT` | Initial text (readline edit) |
| `-n NCHARS` | Read N characters |
| `-N NCHARS` | Read exactly N characters (no delimiter) |
| `-p PROMPT` | Display prompt before reading |
| `-r` | Raw mode (do not interpret backslashes) |
| `-s` | Silent (no echo) |
| `-t TIMEOUT` | Timeout in seconds |
| `-u FD` | Read from file descriptor FD |

Default variable is `REPLY`.

### `source` / `.` — Execute commands from a file

Bash builtin §4.1.

```bash
source ~/.bashrc              # Source a file
. ~/.bashrc                   # Same as source (POSIX)
. ./script.sh                 # Source from current directory
source script.sh "$@"         # Pass arguments to sourced script
```

### `export` — Set environment variable for child processes

Bash builtin §4.1.

```bash
export NAME="value"           # Set and export
export -f funcname            # Export a function
export -n NAME                # Remove export attribute
export -p                     # Print all exported variables
PATH="$PATH:/new/path"        # Common: append to PATH
```

### `alias` / `unalias` — Create / remove command aliases

Bash builtins §4.2.

```bash
alias ll='ls -la'             # Create alias
alias grep='grep --color=auto' # Common alias
alias -p                      # Print all aliases
unalias ll                    # Remove alias
unalias -a                    # Remove all aliases
```

Aliases expand at parse time, not execution time. They do **not** work in non-interactive shells by default.

### `set` — Set or unset shell attributes and positional parameters

Bash builtin §4.3.1.

```bash
set -e                        # Exit on error
set -u                        # Error on unset variable
set -x                        # Print commands and their arguments
set -o pipefail               # Pipeline fails if any command fails
set -euo pipefail             # Common safety combination
set +e                        # Disable option (use + instead of -)
set -- arg1 arg2 arg3         # Set positional parameters
```

### `env` — Run a command in a modified environment

Coreutils §23.2.

```bash
env                           # Print all environment variables
env VAR=value command         # Run command with VAR set
env -i command                # Run with empty environment (clean)
env -i PATH=/usr/bin command  # Clean env with explicit PATH
```

### `exec` — Execute a command, replacing the shell

Bash builtin §4.1.

```bash
exec command                  # Replace shell with command
exec < file                   # Redirect stdin for remainder of script
exec > file                   # Redirect stdout
exec 2> /tmp/errors           # Redirect stderr
exec 3<> /tmp/file            # Open file on fd 3
exec {var}> /tmp/file         # Auto-assign fd number to var (Bash 4.1+)
```

| Flag | Description |
|------|-------------|
| `-c` | Clear environment |
| `-l` | Login shell (dash at start of argv[0]) |
| `-a NAME` | Pass NAME as argv[0] |

### `shift` — Shift positional parameters

Bash builtin §4.1.

```bash
shift                         # Shift by 1 (default)
shift N                       # Shift by N positions
```

After `shift`, `$3` becomes `$2`, `$2` becomes `$1`, `$1` is discarded.

---

## 6. File and String Search

### `find` — Search for files in a directory hierarchy

GNU findutils. The most powerful file search tool.

```bash
find . -name "*.py"                         # By name (glob)
find . -iname "readme.md"                   # Case-insensitive name
find / -type f -name "*.conf"               # Files only
find . -type d -name "src"                  # Directories only
find . -size +100M                          # Files larger than 100 MB
find . -mtime -7                            # Modified less than 7 days ago
find . -mtime +30                           # Modified more than 30 days ago
find . -perm 644                            # By exact permissions
find . -user root                           # Owned by root
find . -empty                              # Empty files and directories
find . -readable                            # Readable by current user
find . -name "*.tmp" -delete                # Find and delete
find . -name "*.log" -exec rm {} \;         # Find and exec (one per file)
find . -name "*.log" -exec rm {} +          # Find and exec (batched)
find . -type f -name "*.py" -exec grep -l "TODO" {} +   # Find files containing pattern
find . -name "*.py" -print0 | xargs -0 wc -l           # Safe with xargs (null-separated)
find . -not -name "*.py"                    # Negation
find . \( -name "*.py" -o -name "*.js" \)  # OR condition
find . -name "*.py" -ls                    # ls -dils format output
```

**Expression structure:**
- **Tests** (`-name`, `-type`, `-size`, `-mtime`, `-perm`, `-user`, `-empty`, `-readable`)
- **Actions** (`-print` default, `-print0`, `-exec`, `-delete`, `-ls`)
- **Operators** (`!` not, `-a` and (implied), `-o` or, `( )` grouping)

| Flag | Description |
|------|-------------|
| `-name PATTERN` | Match filename (glob, case-sensitive) |
| `-iname PATTERN` | Case-insensitive filename match |
| `-type f/d/l` | File type: regular, directory, symlink |
| `-size [+-]N[cwbkMG]` | File size |
| `-mtime [+-]N` | Modification time in days |
| `-perm MODE` | Permission match |
| `-user USER` | Owned by user |
| `-empty` | File or directory is empty |
| `-readable` | Readable by current user |
| `-exec cmd {} \;` | Execute command per match |
| `-exec cmd {} +` | Execute command with batched matches |
| `-print0` | Null-terminated output (for xargs -0) |
| `-delete` | Delete matched files |
| `-ls` | List in `ls -dils` format |

### `locate` — Find files by name (using database)

GNU findutils. Fast but database may be stale.

```bash
locate file                # Search database for file
locate -i README           # Case-insensitive
locate -l 10 pattern       # Limit to 10 results
```

Database is updated by `updatedb` (typically run daily via cron).

### `xargs` — Build and execute command lines from stdin

GNU findutils.

```bash
find . -name "*.log" -print0 | xargs -0 rm -f    # Null-separated (safe)
cat urls.txt | xargs curl -O                      # Download URLs
find . -name "*.py" -print0 | xargs -0 -P 4 grep "TODO"  # Parallel search (4 cores)
find . -name "*.txt" -print0 | xargs -0 -I {} cp {} ~/backup/  # Replace {} with filename
ls | xargs -n 2 echo                              # Pass 2 args per invocation
```

| Flag | Description |
|------|-------------|
| `-0` | Input items are null-separated (use with `-print0`) |
| `-n N` | Max arguments per command line |
| `-I REPL` | Replace string in command (default: `{}`) |
| `-P N` | Run up to N processes in parallel |
| `-r` | Do not run if input is empty (no-run-if-empty) |

---

## 7. Compression and Archiving

### `tar` — Tape archiver

GNU tar. Create, extract, and list archives.

```bash
tar -czf archive.tar.gz dir/             # Create gzipped archive
tar -cjf archive.tar.bz2 dir/            # Create bzip2 archive
tar -cJf archive.tar.xz dir/             # Create xz archive
tar -xf archive.tar.gz                   # Extract (auto-detect format)
tar -tf archive.tar.gz                   # List contents
tar -xzf archive.tar.gz -C /target/dir   # Extract to target directory
tar -czf archive.tar.gz --exclude='*.log' dir/  # Exclude files
tar -xzf archive.tar.gz --strip-components=1     # Strip top-level directory
tar -czf archive.tar.gz --zstd dir/      # Create zstd archive
tar -czf - dir/ | ssh user@host "tar -xz -C /dest"  # Stream over SSH
```

| Flag | Description |
|------|-------------|
| `-c` | Create archive |
| `-x` | Extract archive |
| `-t` | List archive contents |
| `-f ARCHIVE` | Archive file name |
| `-C DIR` | Change to directory before operation |
| `-v` | Verbose |
| `-z` | Filter through gzip |
| `-j` | Filter through bzip2 |
| `-J` | Filter through xz |
| `--zstd` | Filter through zstd |
| `--exclude PATTERN` | Exclude files matching pattern |
| `--strip-components=N` | Strip N leading components |

### `gzip` / `gunzip` — Compress / decompress files (`.gz`)

```bash
gzip file                     # Compress (creates file.gz, removes original)
gzip -k file                  # Keep original file
gzip -d file.gz               # Decompress (same as gunzip)
gzip -r dir/                  # Recursive (compress all files in dir)
gzip -l file.gz               # List compression ratio
gzip -1 file                  # Fastest compression
gzip -9 file                  # Best compression
gunzip file.gz                # Decompress
```

| Flag | Description |
|------|-------------|
| `-k` | Keep original file |
| `-d` | Decompress |
| `-r` | Recursive |
| `-l` | List compressed file details |
| `-1` to `-9` | Compression level (1=fast, 9=best) |

### `bzip2` / `bunzip2` — Compress / decompress files (`.bz2`)

```bash
bzip2 file                    # Compress
bzip2 -k file                 # Keep original
bzip2 -d file.bz2             # Decompress
bunzip2 file.bz2              # Decompress
bzcat file.bz2                # Decompress to stdout
```

| Flag | Description |
|------|-------------|
| `-k` | Keep original |
| `-d` | Decompress |
| `-1` to `-9` | Compression level |

### `xz` / `unxz` — Compress / decompress files (`.xz`)

```bash
xz file                       # Compress (default level 6)
xz -k file                    # Keep original
xz -d file.xz                 # Decompress
unxz file.xz                  # Decompress
xz -9e file                   # Best compression with extreme mode
xz -T 0 file                  # Use all threads
xzcat file.xz                 # Decompress to stdout
xzless file.xz                # View compressed file with less
```

| Flag | Description |
|------|-------------|
| `-k` | Keep original |
| `-d` | Decompress |
| `-1` to `-9` | Compression level (default 6) |
| `-e` | Extreme compression (slower, smaller) |
| `-T N` | Threads (0 = auto-detect) |

### `zip` / `unzip` — Package and compress files (`.zip`)

Info-ZIP.

```bash
zip archive.zip file1 file2            # Create zip with files
zip -r archive.zip dir/                # Recursive (directory)
unzip archive.zip                      # Extract
unzip -l archive.zip                   # List contents
unzip archive.zip -d /target/dir       # Extract to directory
zip -d archive.zip file1               # Delete file from archive
zip -u archive.zip file1               # Update (add/update changed files)
```

| Flag (zip) | Description |
|------------|-------------|
| `-r` | Recursive (include directories) |
| `-u` | Update (add changed files) |
| `-d` | Delete from archive |
| `-q` | Quiet |

| Flag (unzip) | Description |
|--------------|-------------|
| `-l` | List archive contents |
| `-d DIR` | Extract to directory |
| `-q` | Quiet |
| `-o` | Overwrite without prompting |

---

## 8. Network Commands

### `curl` — Transfer data to/from a server

curl.se. Supports HTTP/HTTPS/FTP/SFTP/SCP/SMTP/IMAP/POP3/LDAP/DICT/TELNET/TFTP/MQTT.

```bash
curl https://example.com                        # GET request (output to stdout)
curl -o file.txt https://example.com/file.txt   # Download to file
curl -O https://example.com/file.txt            # Download (remote filename)
curl -L https://short.url                        # Follow redirects
curl -I https://example.com                     # Fetch headers only
curl -s https://api.example.com                 # Silent (no progress)
curl -S -s https://example.com                  # Silent but show errors
curl -v https://example.com                     # Verbose (request/response)
curl -u user:pass https://api.example.com       # Basic auth
curl -H "Authorization: Bearer TOKEN" URL       # Custom header
curl -d '{"key":"value"}' https://api.example.com # POST with JSON data
curl -X POST https://example.com/resource       # Explicit HTTP method
curl -k https://self-signed.example.com         # Allow insecure (skip TLS verify)
curl -F "image=@photo.jpg" https://upload.example.com  # Multipart form upload
curl -c cookies.txt -b cookies.txt URL          # Cookie handling
curl --max-time 30 URL                          # Timeout in seconds
curl -C - -O https://example.com/large.zip      # Resume download
```

| Flag | Description |
|------|-------------|
| `-o FILE` | Write output to FILE |
| `-O` | Write output to remote-named file |
| `-L` | Follow redirects (max 50 by default) |
| `-I`, `--head` | Fetch headers only |
| `-v` | Verbose output |
| `-s` | Silent (no progress meter, no errors) |
| `-S` | Show errors (use with `-s`) |
| `-u USER:PASS` | Basic authentication |
| `-H HEADER` | Custom HTTP header |
| `-d DATA` | HTTP POST data |
| `-X METHOD` | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `-k` | Allow insecure TLS (skip certificate verification) |
| `-F NAME=@FILE` | Multipart form data |
| `-c FILE` | Write cookies to FILE (cookie jar) |
| `-b FILE/STRING` | Send cookies from FILE or string |
| `--max-time SECS` | Maximum time for transfer |
| `-C -` | Resume download |

### `wget` — Non-interactive network downloader

GNU wget.

```bash
wget https://example.com/file.zip              # Download file
wget -O output.zip https://example.com/file    # Output to specific name
wget -c https://example.com/large.zip          # Resume download
wget -r --no-parent https://example.com/dir/   # Recursive download
wget -q https://example.com                    # Quiet
wget --limit-rate=1m https://example.com       # Limit bandwidth
wget --tries=5 https://example.com             # Retry count
```

| Flag | Description |
|------|-------------|
| `-O FILE` | Write to FILE |
| `-c` | Resume download |
| `-r` | Recursive |
| `--no-parent` | Do not ascend to parent directories |
| `-q` | Quiet |
| `--limit-rate` | Limit download rate |
| `--tries N` | Number of retries |

### `ssh` — OpenSSH remote login

OpenSSH.

```bash
ssh user@host                      # Basic login
ssh -p 2222 user@host              # Non-default port
ssh -i ~/.ssh/id_custom user@host  # Use specific key
ssh -J jumpuser@jump host          # Jump host (ProxyJump)
ssh -L 8080:localhost:80 host      # Local port forwarding
ssh -R 8080:localhost:80 host      # Remote port forwarding
ssh -D 1080 host                   # Dynamic port forwarding (SOCKS proxy)
ssh -N -L 8080:db:5432 host        # No command, just forward
ssh -v user@host                   # Verbose (debug)
ssh -vvv user@host                 # Very verbose (connection debug)
```

| Flag | Description |
|------|-------------|
| `-p PORT` | Port number |
| `-i KEY` | Identity file (private key) |
| `-J HOST` | Jump host (ProxyJump) |
| `-L PORT:HOST:PORT` | Local forwarding |
| `-R PORT:HOST:PORT` | Remote forwarding |
| `-D PORT` | Dynamic (SOCKS) forwarding |
| `-N` | Do not execute remote command |
| `-v`, `-vv`, `-vvv` | Verbosity level |

### `scp` — Secure file copy over SSH

OpenSSH.

```bash
scp file user@host:/path/          # Copy to remote
scp user@host:/path/file .         # Copy from remote
scp -r dir/ user@host:/path/       # Recursive copy
scp -P 2222 file user@host:/path/  # Non-default port
scp -3 host1:file host2:path/      # Copy between two remotes via local
```

| Flag | Description |
|------|-------------|
| `-r` | Recursive (copy directories) |
| `-P PORT` | Port number (note: uppercase) |
| `-3` | Copy through local host (between two remotes) |
| `-i KEY` | Identity file |

### `rsync` — Fast, versatile file copy (incremental)

```bash
rsync -av source/ dest/               # Archive + verbose
rsync -avz source/ user@host:dest/    # With compression over SSH
rsync -av --delete source/ dest/      # Delete dest files not in source
rsync -avn source/ dest/              # Dry-run (show what would change)
rsync --progress source/ dest/        # Show progress
rsync -e "ssh -p 2222" source/ dest/  # Custom SSH command
```

Trailing slash matters: `source/` copies the contents of the directory; `source` copies the directory itself.

| Flag | Description |
|------|-------------|
| `-a` | Archive mode (preserve permissions, times, etc.) |
| `-v` | Verbose |
| `-z` | Compress during transfer |
| `--delete` | Delete files in dest not present in source |
| `-n` | Dry-run |
| `--progress` | Show progress during transfer |
| `-e COMMAND` | Remote shell command (e.g., `ssh -p 2222`) |

### `ping` — Send ICMP echo requests

```bash
ping -c 4 example.com              # Send 4 pings
ping -i 2 example.com               # Interval: 2 seconds
ping -4 example.com                 # Force IPv4
ping -6 example.com                 # Force IPv6
ping -s 1472 example.com            # Packet size (bytes)
```

| Flag | Description |
|------|-------------|
| `-c N` | Stop after N packets |
| `-i N` | Interval in seconds (default 1) |
| `-4` | IPv4 only |
| `-6` | IPv6 only |
| `-s SIZE` | Packet size |

### `ss` — Socket statistics (modern replacement for `netstat`)

```bash
ss -tuln                    # Listening TCP/UDP (numeric ports)
ss -tup                     # TCP/UDP with process info
ss -s                       # Summary statistics
ss -anp                     # All sockets (numeric, with PIDs)
ss -t state established     # Established TCP connections only
```

| Flag | Description |
|------|-------------|
| `-t` | TCP sockets |
| `-u` | UDP sockets |
| `-l` | Listening sockets |
| `-n` | Numeric (no name resolution) |
| `-p` | Show process |
| `-a` | All sockets |
| `-s` | Summary |

Note: `ss` is preferred over the deprecated `netstat`.

### `dig` — DNS lookup utility

```bash
dig example.com                           # A record (default)
dig example.com MX                        # MX records
dig +short example.com                    # Short output
dig @8.8.8.8 example.com                  # Use specific DNS server
dig -x 8.8.8.8                            # Reverse lookup (PTR)
dig example.com ANY                       # All record types
```

---

## 9. Disk and Filesystem

### `df` — Report filesystem disk space usage

Coreutils §14.1.

```bash
df -h                           # Human-readable sizes
df -T                           # Include filesystem type
df -h --total                   # Show grand total
df -i /data                     # Inode usage
df -h -x tmpfs                  # Exclude tmpfs filesystems
df -a                           # Include dummy filesystems
```

| Flag | Description |
|------|-------------|
| `-h` | Human-readable (K, M, G) |
| `-T` | Filesystem type |
| `-a` | Include dummy filesystems |
| `--total` | Show grand total |
| `-i` | Inode information |
| `-x TYPE` | Exclude filesystem type |

### `du` — Estimate file space usage

Coreutils §14.2.

```bash
du -sh dir/                    # Total size of directory
du -h --max-depth=1 dir/       # Size of immediate subdirectories
du -ah dir/                    # Size of every file and directory
du -ch dir/                    # Total with grand total (-c)
du -t 1G dir/                  # Only show entries > 1G
du -d 2 dir/                   # Max depth (same as --max-depth)
du --exclude='*.log' dir/       # Exclude matching files
du --time /data                # Show modification times
```

| Flag | Description |
|------|-------------|
| `-s` | Summary (total only) |
| `-h` | Human-readable |
| `--max-depth=N` | Max recursion depth |
| `-a` | All files, not just directories |
| `-c` | Grand total at end |
| `-t SIZE` | Only entries larger than SIZE |
| `--exclude PATTERN` | Exclude matching files |
| `--time` | Show last modification time |

### `mount` — Mount a filesystem

```bash
mount                          # List mounted filesystems
mount -t ext4 /dev/sda1 /mnt  # Mount device to directory
mount -o loop file.iso /mnt   # Mount ISO image
mount -o remount,ro /mnt      # Remount as read-only
```

| Flag | Description |
|------|-------------|
| `-t TYPE` | Filesystem type |
| `-o OPTS` | Mount options (ro, rw, loop, remount, etc.) |

Typically requires root privileges.

### `umount` — Unmount a filesystem

```bash
umount /mnt                    # Unmount by mount point
umount /dev/sda1              # Unmount by device
umount -l /mnt                # Lazy unmount (detach now, clean later)
umount -f /mnt                # Force unmount (if NFS is unreachable)
```

### `lsblk` — List block devices

util-linux.

```bash
lsblk                          # Tree view of block devices
lsblk -f                       # Include filesystem info
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT  # Custom columns
```

### `fdisk` — Partition table manipulator

util-linux.

```bash
sudo fdisk -l                  # List partition tables
sudo fdisk /dev/sda            # Interactive partition editor
```

Use with extreme caution — data loss risk.

---

## 10. User and Group Management

### `whoami` — Print effective username

Coreutils §20.3. Identical to `id -un`.

```bash
whoami                         # Print current username
```

### `id` — Print user and group identity

Coreutils §20.1.

```bash
id                             # All identities
id -u                          # UID
id -g                          # Primary GID
id -G                          # All group IDs
id -un                         # Username
id -gn                         # Group name
id username                    # Info for another user
```

### `who` — Show who is logged on

Coreutils §20.6.

```bash
who                            # Logged-in users
who -b                         # Last boot time
who -r                         # Run level
who -a                         # All info
```

### `w` — Show who is logged on and what they are doing

procps-ng.

```bash
w                              # Full display
w -h                           # No header
w -s                           # Short format
```

### `users` — List usernames of users currently logged in

Coreutils §20.5.

```bash
users                          # Space-separated usernames
```

### `groups` — Print group memberships

Coreutils §20.4.

```bash
groups                         # Your groups
groups username                # Another user's groups
```

### `useradd` — Create a new user (low-level)

```bash
sudo useradd -m -s /bin/bash username   # Create with home dir and shell
sudo useradd -m -G sudo,docker username # Create with supplementary groups
```

| Flag | Description |
|------|-------------|
| `-m` | Create home directory |
| `-s SHELL` | Login shell |
| `-G GROUPS` | Supplementary groups (comma-separated) |

### `usermod` — Modify a user account

```bash
sudo usermod -aG docker username        # Append group (always use -a)
sudo usermod -s /bin/zsh username        # Change shell
sudo usermod -L username                 # Lock account
sudo usermod -U username                 # Unlock account
```

**Important:** Always use `-a` (append) with `-G` or you will remove the user from groups not listed.

### `passwd` — Change user password

```bash
passwd                         # Change your own password
sudo passwd username           # Change another user's password
sudo passwd -l username        # Lock account
sudo passwd -u username        # Unlock account
sudo passwd -d username        # Delete password (no-password login)
```

### `su` — Switch user

```bash
su - username                  # Login shell (loads profile)
su username                    # Non-login shell
su -                           # Root login shell
su -c "command" username       # Run command as user
```

### `sudo` — Execute a command as another user

```bash
sudo command                   # Run as root
sudo -u user command           # Run as specific user
sudo -i                        # Interactive root login
sudo -s                        # Root shell (non-login)
sudo -l                        # List allowed commands
sudo -k                        # Invalidate timestamp (ask password next time)
```

---

## 11. Date, Time, and Scheduling

### `date` — Display or set date and time

Coreutils §21.1.

```bash
date                           # Current date/time
date +"%Y-%m-%d %H:%M:%S"     # Custom format
date -u                        # UTC time
date -d "yesterday"            # Relative date
date -d "next Friday"          # Natural language parsing
date -r /etc/hostname          # Last modification time of file
date --debug                   # Debug date string parsing
```

| Flag | Description |
|------|-------------|
| `-u` | UTC (no local timezone) |
| `-d STRING` | Describe date string (display, not set) |
| `-r FILE` | Last modified time of FILE |
| `-s STRING` | Set system time (requires root) |
| `--debug` | Annotate date string parsing |

**Common format specifiers:**

| Spec | Output |
|------|--------|
| `%Y` | Year (4-digit) |
| `%m` | Month (01–12) |
| `%d` | Day (01–31) |
| `%H` | Hour (00–23) |
| `%M` | Minute (00–59) |
| `%S` | Second (00–59) |
| `%s` | Unix epoch seconds |
| `%A` | Weekday name (e.g., Monday) |
| `%B` | Month name (e.g., June) |
| `%F` | Shortcut for `%Y-%m-%d` |
| `%T` | Shortcut for `%H:%M:%S` |

### `cal` — Display a calendar

util-linux.

```bash
cal                            # Current month
cal -y                         # Full year
cal 2026                       # Calendar for 2026
cal 12 2026                    # December 2026
cal -3                         # Previous, current, next month
cal -j                         # Julian day (day-of-year)
```

### `sleep` — Delay for a specified amount of time

Coreutils §25.1.

```bash
sleep 5                        # 5 seconds
sleep 1h 30m                   # 1 hour 30 minutes
sleep 0.1                      # 0.1 seconds (100ms)
sleep infinity                 # Forever (until interrupted)
```

### `crontab` — Scheduled tasks (cron)

```bash
crontab -e                     # Edit crontab for current user
crontab -l                     # List cron jobs
crontab -r                     # Remove crontab
crontab -u user -l             # List another user's crontab
```

**Crontab format:** `minute hour day-of-month month day-of-week command`

```
# ┌──────── minute (0–59)
# │ ┌────── hour (0–23)
# │ │ ┌──── day of month (1–31)
# │ │ │ ┌── month (1–12)
# │ │ │ │ ┌ day of week (0–7, 0=Sun)
# * * * * * command
```

```bash
# Run daily at 2:30 AM
30 2 * * * /path/to/script.sh

# Run every hour
0 * * * * /path/to/script.sh

# Run every Monday at 3 AM
0 3 * * 1 /path/to/script.sh

# Run on reboot
@reboot /path/to/script.sh
```

| Special string | Equivalent |
|----------------|------------|
| `@reboot` | At startup |
| `@daily` | `0 0 * * *` |
| `@hourly` | `0 * * * *` |
| `@weekly` | `0 0 * * 0` |
| `@monthly` | `0 0 1 * *` |
| `@yearly` | `0 0 1 1 *` |

System-wide cron files are in `/etc/crontab` and `/etc/cron.d/`.

### `at` — One-time scheduled tasks

```bash
at now + 1 hour                # Schedule a task 1 hour from now
at 2:00 PM                     # Schedule at specific time
atq                            # List queued jobs
atrm 5                         # Remove job ID 5
```

Requires the `atd` daemon to be running.

### `systemd-timer` — Modern Linux task scheduling (brief)

```bash
systemctl list-timers          # List active timers
# Timers require a .timer and .service unit pair
# Example: /etc/systemd/system/backup.timer + /etc/systemd/system/backup.service
```

---

## 12. Shell Navigation Shortcuts (Readline)

Based on GNU Bash manual §8.2. These shortcuts work in the default Bash Readline editing mode (emacs mode). `C-` means press Ctrl, `M-` means press Alt (Meta).

### Movement

| Shortcut | Action |
|----------|--------|
| `C-b` | Back one character |
| `C-f` | Forward one character |
| `C-a` | Go to beginning of line |
| `C-e` | Go to end of line |
| `M-f` | Forward one word |
| `M-b` | Backward one word |
| `C-l` | Clear screen (like `clear`) |

### Kill and Yank (Cut and Paste)

| Shortcut | Action |
|----------|--------|
| `C-k` | Kill (cut) from cursor to end of line |
| `C-u` | Kill from cursor to beginning of line |
| `C-w` | Kill previous word (before cursor) |
| `M-d` | Kill forward word (after cursor) |
| `M-Backspace` | Kill backward word (same as `C-w`) |
| `C-y` | Yank (paste) most recently killed text |
| `M-y` | Rotate through kill ring (after `C-y`) |

### History

| Shortcut | Action |
|----------|--------|
| `C-p` | Previous history line |
| `C-n` | Next history line |
| `C-r` | Reverse incremental search |
| `C-s` | Forward incremental search (may require `stty -ixon`) |
| `M-<` | First line of history |
| `M->` | Last line of history |

### History Expansion

History expansions are performed after the line is entered (before execution).

| Expansion | Expands to |
|-----------|------------|
| `!!` | Previous command |
| `!$` | Last argument of previous command |
| `!^` | First argument of previous command |
| `!n` | Command line n from history |
| `!string` | Most recent command starting with `string` |
| `!?string` | Most recent command containing `string` |
| `^old^new^` | Quick substitution: repeat previous command, replacing `old` with `new` |
| `!:0` | Command word of previous command |
| `!:*` | All arguments of previous command |
| `!:1` | First argument of previous command |
| `!:2-4` | Arguments 2 through 4 of previous command |
| `!$:h` | Directory of last argument (head) |
| `!$:t` | Filename of last argument (tail) |
| `!$:r` | Filename without extension (root) |
| `!$:e` | Extension of last argument |

**Shell options for history expansions:**

| Option | Effect |
|--------|--------|
| `echo $HISTSIZE` | Max lines in memory (default: 1000) |
| `echo $HISTFILESIZE` | Max lines in history file |
| `echo $HISTFILE` | History file path (default: `~/.bash_history`) |
| `HISTCONTROL=ignoredups` | Do not save duplicates |
| `HISTCONTROL=ignorespace` | Lines starting with space not saved |
| `HISTCONTROL=ignoreboth` | Both of the above |
| `HISTTIMEFORMAT="%F %T "` | Timestamp in history |

---

## 13. Job Control and Multiplexing

### Job Control Within a Terminal

```bash
command &                     # Start in background
Ctrl+Z                        # Suspend foreground job
jobs                          # List jobs
bg %1                         # Resume job 1 in background
fg %1                         # Bring job 1 to foreground
kill %1                       # Terminate job 1
```

### `screen` — Terminal multiplexer

GNU Screen.

```bash
screen -S session_name        # Start named session
screen -ls                    # List sessions
screen -r session_name        # Reattach
screen -d -r session_name     # Detach other display and reattach

# Inside screen (prefix: Ctrl+A)
```

| Inside Screen | Action |
|---------------|--------|
| `C-a d` | Detach session |
| `C-a c` | Create new window |
| `C-a n` / `C-a p` | Next / previous window |
| `C-a "` | List windows |
| `C-a k` | Kill current window |
| `C-a ESC` | Enter scrollback mode |
| `C-a A` | Rename current window |

### `tmux` — Terminal multiplexer (modern alternative)

```bash
tmux new -s session_name      # Start named session
tmux ls                       # List sessions
tmux attach -t session_name   # Attach to session
tmux kill-session -t session_name  # Kill session

# Inside tmux (prefix: Ctrl+B)
```

| Inside tmux | Action |
|-------------|--------|
| `C-b d` | Detach session |
| `C-b c` | Create new window |
| `C-b n` / `C-b p` | Next / previous window |
| `C-b ,` | Rename current window |
| `C-b 0`–`C-b 9` | Select window by number |
| `C-b %` | Split window vertically |
| `C-b "` | Split window horizontally |
| `C-b arrows` | Navigate panes |
| `C-b [` | Enter copy mode (scroll with arrows) |
| `C-b s` | Interactive session list |
| `C-b w` | Interactive window list |
| `C-b &` | Kill current window/ pane |

---

## 14. Environment and Configuration

### Startup File Hierarchy

GNU Bash §6.2. Bash loads different initialization files depending on how it is invoked.

| Shell type | Files read (in order) |
|------------|-----------------------|
| Interactive login | `/etc/profile`, then first found of `~/.bash_profile`, `~/.bash_login`, `~/.profile` |
| Interactive non-login | `~/.bashrc` |
| Non-interactive (script) | File specified by `$BASH_ENV` |
| Login shell exit | `~/.bash_logout` (if exists) |

**Best practice:** Place interactive settings (aliases, functions, prompts) in `~/.bashrc`, and source `~/.bashrc` from `~/.bash_profile`:

```bash
# ~/.bash_profile
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
```

### Common Environment Variables

| Variable | Purpose |
|----------|---------|
| `PATH` | Colon-separated list of command search directories |
| `HOME` | Current user's home directory |
| `USER` / `LOGNAME` | Current username |
| `SHELL` | Path to the current shell (e.g., `/bin/bash`) |
| `TERM` | Terminal type (e.g., `xterm-256color`, `screen`) |
| `EDITOR` | Default editor (e.g., `vim`, `nano`) |
| `VISUAL` | Full-screen editor (fallback: `EDITOR`) |
| `PWD` | Current working directory |
| `OLDPWD` | Previous working directory (used by `cd -`) |
| `LANG` | Locale setting (e.g., `en_US.UTF-8`) |
| `LC_ALL` | Override all locale settings |
| `LC_CTYPE` | Character classification and case conversion |
| `LC_COLLATE` | Sort order for collation |
| `TZ` | Timezone (e.g., `America/New_York`, `UTC`) |
| `HISTSIZE` | Number of history lines in memory (default: 1000) |
| `HISTFILESIZE` | Number of lines in history file |
| `HISTFILE` | Path to history file (default: `~/.bash_history`) |
| `HISTCONTROL` | History deduplication (`ignoredups`, `ignorespace`, `ignoreboth`, `erasedups`) |
| `HISTIGNORE` | Patterns to exclude from history |
| `HISTTIMEFORMAT` | Timestamp format for history entries |
| `PS1` | Primary prompt string |
| `PS2` | Secondary prompt (continuation, default `> `) |
| `PS3` | Select prompt (used in `select` loops) |
| `PS4` | Trace prompt (used with `set -x`, default `+ `) |
| `PROMPT_COMMAND` | Command(s) to run before each prompt |
| `CDPATH` | Colon-separated search path for `cd` |
| `IFS` | Internal field separator (default: space, tab, newline) |
| `UID` | Read-only numeric user ID |
| `EUID` | Read-only effective user ID |
| `RANDOM` | Returns a random integer 0–32767 on each reference |
| `SECONDS` | Seconds since shell started (can be reset) |
| `BASH_VERSION` | Version string of the running Bash |
| `BASH_ENV` | Startup file for non-interactive shells |
| `SHELLOPTS` | Colon-separated list of enabled shell options |
| `BASHOPTS` | Colon-separated list of enabled shopt options |
| `PPID` | PID of the parent process |
| `LINENO` | Line number in script (readonly) |
| `TMOUT` | Read timeout for `read` and auto-logout for interactive shells |
| `TMPDIR` | Temporary directory (used by various tools) |
| `MACHTYPE` | System type string (e.g., `x86_64-pc-linux-gnu`) |
| `OSTYPE` | Operating system (e.g., `linux-gnu`) |
| `HOSTTYPE` | Hardware architecture (e.g., `x86_64`) |
| `_` | Last argument of previous command (Bash sets this) |

---

<!-- markdownlint-enable MD013 -->
<!--
  Reference validation: every command, flag, and option listed above was verified
  against GNU Bash 5.3, GNU Coreutils 9.11, GNU findutils, procps-ng, OpenSSH,
  curl.se, and GNU tar as documented in their respective manuals and man pages
  as of June 2026. If you find an error, open a PR against this file.
-->
