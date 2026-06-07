# MySQL Command Cheatsheet

**Last updated:** 2026-06-06

**Scope:** Practical reference for everyday MySQL operations — connection, database
and table management, data manipulation, user administration, indexing, backup and
restore, diagnostics, and common administration commands. Covers MySQL 8.0+ with
emphasis on command-line client and SQL syntax. Designed for developers, DBAs,
and DevOps engineers who work with MySQL day-to-day.

<!--
  Sections are grouped by operational domain. Each section opens with a short
  summary or a quick-reference table, followed by detailed syntax blocks and
  usage notes where needed.
-->

---

## Table of Contents

1. [Connection & Authentication](#1-connection--authentication)
2. [Database Operations](#2-database-operations)
3. [Table Operations](#3-table-operations)
4. [Data Manipulation](#4-data-manipulation)
5. [User & Privilege Management](#5-user--privilege-management)
6. [Indexing](#6-indexing)
7. [Backup & Restore](#7-backup--restore)
8. [Status & Diagnostics](#8-status--diagnostics)
9. [MySQL 8+ Specific Features](#9-mysql-8-specific-features)
10. [Common Admin Commands](#10-common-admin-commands)

---

## 1. Connection & Authentication

Basic client invocation and connection options for the `mysql` command-line client.

### Quick Reference

| Goal | Command |
| ------ | --------- |
| Connect to default database | `mysql db_name` |
| Connect with user and password | `mysql --user=user_name --password db_name` |
| Connect to a remote host | `mysql --host=host --user=user --password db_name` |
| Execute a statement and exit | `mysql --execute="SELECT 1"` |
| Execute multiple statements | `mysql -e "SELECT 1; SELECT 2"` |

### Full Connection Options

| Long option | Short | Description |
| ------------- | ------- | ------------- |
| `--host=host` | `-h` | Server hostname or IP |
| `--user=user_name` | `-u` | MySQL user name |
| `--password[=pass_val]` | `-p` | Password; if omitted the client prompts interactively |
| `--port=port_num` | `-P` | TCP/IP port number (default 3306) |
| `--socket=socket_path` | `-S` | Unix socket file path |
| `--protocol={TCP\|SOCKET\|PIPE\|MEMORY}` | | Connection transport protocol |

### Password Handling

- `mysql -ptest` (no space after `-p`) — password is `test`.
- `mysql -p test` — client prompts for password; `test` is treated as the
  default database name.

### SSL/TLS

```bash
mysql --ssl-mode=REQUIRED \
      --tls-version=TLSv1.2,TLSv1.3 \
      --ssl-ca=/path/to/ca.pem \
      --ssl-cert=/path/to/client-cert.pem \
      --ssl-key=/path/to/client-key.pem
```

Key SSL options: `--ssl-mode` (DISABLED, PREFERRED, REQUIRED, VERIFY_CA,
VERIFY_IDENTITY), `--tls-ciphersuites`, `--tls-version`, `--ssl-ca`,
`--ssl-cert`, `--ssl-key`.

### Authentication Notes

- **MySQL 8.0 default auth plugin:** `caching_sha2_password`. Clients/libs must
  support it or fall back with `--default-auth=mysql_native_password`.
- **Multifactor authentication:** Use `--authentication-mfa-factor`.
- **Connection config files:** Options read from `[mysql]` and `[client]` groups
  in option files (`/etc/my.cnf`, `~/.my.cnf`). Use `--defaults-file`,
  `--defaults-extra-file`, or `--no-defaults` to control which files are loaded.

Sources:
- [mysql — Client Options](https://dev.mysql.com/doc/refman/8.0/en/mysql-command-options.html)
- [Connecting to MySQL](https://dev.mysql.com/doc/refman/8.0/en/connecting.html)

---

## 2. Database Operations

### CREATE DATABASE

```sql
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...
```

Requires the `CREATE` privilege. Options include character set, collation, and encryption.

### ALTER DATABASE

```sql
ALTER {DATABASE | SCHEMA} [db_name] alter_option ...
```

Change default character set, collation, encryption
(`ALTER DATABASE ... ENCRYPTION='Y'`), or read-only flag.

### DROP DATABASE

```sql
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

Drops all tables and the database itself. Requires the `DROP` privilege on the database.

### USE (Select Database)

```sql
USE db_name;
```

Within the `mysql` client: `\u db_name`.

### SHOW DATABASES

```sql
SHOW DATABASES [LIKE 'pattern' | WHERE expr];
```

### Current Database

```sql
SELECT DATABASE();
```

Returns the name of the current default database, or `NULL` if none is selected.

Sources:
- [CREATE DATABASE](https://dev.mysql.com/doc/refman/8.0/en/create-database.html)
- [ALTER DATABASE](https://dev.mysql.com/doc/refman/8.0/en/alter-database.html)
- [DROP DATABASE](https://dev.mysql.com/doc/refman/8.0/en/drop-database.html)
- [Creating and Selecting a Database](https://dev.mysql.com/doc/refman/8.0/en/creating-database.html)

---

## 3. Table Operations

### CREATE TABLE

```sql
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    (column_definitions) [table_options] [partition_options];

-- Create from SELECT (CTAS)
CREATE TABLE new_tbl AS SELECT * FROM source_tbl;
```

### DROP TABLE

```sql
DROP [TEMPORARY] TABLE [IF EXISTS] tbl_name [, tbl_name] ... [RESTRICT | CASCADE];
```

### ALTER TABLE

Syntax supports multiple clauses in a single statement:

```sql
ALTER TABLE tbl_name
    ADD [COLUMN] col_name definition [FIRST | AFTER col_name],
    DROP [COLUMN] col_name,
    MODIFY [COLUMN] col_name new_definition,
    CHANGE [COLUMN] old_name new_name definition,
    RENAME [COLUMN] old_name TO new_name,
    RENAME TO new_tbl_name,
    ADD {INDEX | KEY} index_name (key_part, ...),
    DROP {INDEX | KEY} index_name,
    ADD PRIMARY KEY (col_list),
    DROP PRIMARY KEY,
    ADD FOREIGN KEY (col_list) REFERENCES parent_tbl (col_list),
    ADD CHECK (expr),
    ALTER INDEX index_name {VISIBLE | INVISIBLE},
    ALGORITHM {=} {DEFAULT | INSTANT | INPLACE | COPY},
    LOCK {=} {DEFAULT | NONE | SHARED | EXCLUSIVE},
    CONVERT TO CHARACTER SET charset [COLLATE collation],
    DISCARD TABLESPACE,
    IMPORT TABLESPACE;
```

**Online DDL notes:** `ALGORITHM=INSTANT` is supported for `ADD COLUMN`
(8.0.12+) and `DROP COLUMN` (8.0.29+).

### TRUNCATE TABLE

```sql
TRUNCATE [TABLE] tbl_name;
```

Empties a table completely. Requires the `DROP` privilege. In MySQL 8.0, mapped
to `DROP TABLE` + `CREATE TABLE` internally.

### Informational Commands

| Command | Description |
| --------- | ------------- |
| `SHOW [FULL] TABLES [{FROM \| IN} db_name] [LIKE 'pattern' \| WHERE expr]` | List tables in a database |
| `{DESCRIBE \| DESC \| EXPLAIN} tbl_name [col_name \| wild]` | Show column structure of a table |
| `SHOW CREATE TABLE tbl_name` | Show the `CREATE TABLE` statement for a table |
| `SHOW [FULL] COLUMNS {FROM \| IN} tbl_name [LIKE 'pattern' \| WHERE expr]` | List columns and their types |
| `SHOW TABLE STATUS [{FROM \| IN} db_name] [LIKE 'pattern' \| WHERE expr]` | Table metadata (engine, row count, size, etc.) |

Sources:
- [CREATE TABLE](https://dev.mysql.com/doc/refman/8.0/en/create-table.html)
- [ALTER TABLE](https://dev.mysql.com/doc/refman/8.0/en/alter-table.html)
- [TRUNCATE TABLE](https://dev.mysql.com/doc/refman/8.0/en/truncate-table.html)
- [DESCRIBE](https://dev.mysql.com/doc/refman/8.0/en/describe.html)
- [SHOW CREATE TABLE](https://dev.mysql.com/doc/refman/8.0/en/show-create-table.html)

---

## 4. Data Manipulation

### SELECT

```sql
SELECT [ALL | DISTINCT] select_expr [, ...]
    [FROM table_references]
    [WHERE where_condition]
    [GROUP BY {col_name | expr | position}, ... [WITH ROLLUP]]
    [HAVING where_condition]
    [WINDOW window_name AS (window_spec) [, ...]]
    [ORDER BY ... [ASC | DESC] [, ...]]
    [LIMIT {[offset,] row_count | row_count OFFSET offset}]
    [FOR {UPDATE | SHARE} [NOWAIT | SKIP LOCKED]]
    [INTO OUTFILE 'file_name' | INTO DUMPFILE 'file_name' | INTO @variable_list];
```

### INSERT

```sql
-- Standard VALUES form
INSERT [IGNORE] INTO tbl_name [(col_list)]
    VALUES (value_list), ... [ON DUPLICATE KEY UPDATE assignment_list];

-- SET form
INSERT [IGNORE] INTO tbl_name SET col1=val1, col2=val2, ...;

-- SELECT form
INSERT [IGNORE] INTO tbl_name [(col_list)] SELECT ... FROM ...;
```

- `IGNORE` downgrades errors to warnings (duplicate key, data truncation, etc.).
- `ON DUPLICATE KEY UPDATE`: if a row matches a UNIQUE or PRIMARY KEY
  constraint, an `UPDATE` is performed instead.

### UPDATE

```sql
-- Single-table
UPDATE [LOW_PRIORITY] [IGNORE] table_reference
    SET assignment_list
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT n];

-- Multi-table (no ORDER BY / LIMIT)
UPDATE [LOW_PRIORITY] [IGNORE] table_references
    SET assignment_list
    [WHERE where_condition];
```

CTEs (`WITH` clause) are supported.

### DELETE

```sql
-- Single-table
DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name
    [WHERE where_condition]
    [ORDER BY ...]
    [LIMIT n];

-- Multi-table (two syntaxes)
DELETE tbl_name[, ...] FROM table_references [WHERE ...];
DELETE FROM tbl_name[, ...] USING table_references [WHERE ...];
```

CTEs are supported.

### JOIN Syntax

| Join type | Syntax |
| ----------- | -------- |
| INNER JOIN | `SELECT ... FROM t1 INNER JOIN t2 ON condition` |
| CROSS JOIN | `SELECT ... FROM t1 CROSS JOIN t2` |
| LEFT JOIN | `SELECT ... FROM t1 LEFT JOIN t2 ON condition` |
| RIGHT JOIN | `SELECT ... FROM t1 RIGHT JOIN t2 ON condition` |
| NATURAL JOIN | `SELECT ... FROM t1 NATURAL JOIN t2` |
| STRAIGHT_JOIN | Force left-table-first join order |

`ON` clauses use a join condition; `USING (col_list)` is shorthand for equality on named columns.

**Index hints:** `USE INDEX`, `IGNORE INDEX`, `FORCE INDEX` can be specified per table in join queries.

Sources: [SELECT](https://dev.mysql.com/doc/refman/8.0/en/select.html), [INSERT](https://dev.mysql.com/doc/refman/8.0/en/insert.html), [UPDATE](https://dev.mysql.com/doc/refman/8.0/en/update.html), [DELETE](https://dev.mysql.com/doc/refman/8.0/en/delete.html), [JOIN Syntax](https://dev.mysql.com/doc/refman/8.0/en/join.html)

---

## 5. User & Privilege Management

### CREATE USER

```sql
CREATE USER [IF NOT EXISTS]
    user [IDENTIFIED BY 'password']
    [DEFAULT ROLE role_name [, ...]]
    [REQUIRE {NONE | tls_option [{AND tls_option} ...]}]
    [WITH resource_option ...]
    [password_option ...]
    [LOCK | UNLOCK];
```

### GRANT

```sql
GRANT priv_type [(col_list)] [, ...]
    ON [object_type] priv_level
    TO user_or_role [, ...]
    [WITH GRANT OPTION]
    [AS user [WITH ROLE ...]];
```

### REVOKE

```sql
REVOKE [IF EXISTS] priv_type [(col_list)] [, ...]
    ON [object_type] priv_level
    FROM user_or_role [, ...];
```

### DROP USER

```sql
DROP USER [IF EXISTS] user [, user] ...;
```

### SHOW GRANTS

```sql
SHOW GRANTS [FOR user_or_role];
```

### ALTER USER

```sql
ALTER USER user [IDENTIFIED BY 'password' [REPLACE 'current'] [RETAIN CURRENT PASSWORD]]
    [DEFAULT ROLE {role [, ...] | ALL | NONE}]
    [REQUIRE ...]
    [WITH resource_option ...]
    [password_option ...]
    [{ACCOUNT LOCK | ACCOUNT UNLOCK}];

-- Change own password (no FOR clause needed)
ALTER USER USER() IDENTIFIED BY 'new_password';
```

### SET PASSWORD

```sql
SET PASSWORD [FOR user] = 'auth_string'
    [REPLACE 'current_password']
    [RETAIN CURRENT PASSWORD];

SET PASSWORD [FOR user] TO RANDOM;
```

### Other Privilege Commands

| Command | Description |
| --------- | ------------- |
| `FLUSH PRIVILEGES` | Reload grant tables (needed after direct INSERT/UPDATE/DELETE on `mysql.*` tables) |
| `SELECT plugin FROM mysql.user` | Check user authentication plugin |

For a complete list of privileges: [Privileges Provided by MySQL](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html).

Sources: [CREATE USER](https://dev.mysql.com/doc/refman/8.0/en/create-user.html), [GRANT](https://dev.mysql.com/doc/refman/8.0/en/grant.html), [REVOKE](https://dev.mysql.com/doc/refman/8.0/en/revoke.html), [SET PASSWORD](https://dev.mysql.com/doc/refman/8.0/en/set-password.html), [Privileges Provided](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html)

---

## 6. Indexing

### CREATE INDEX

```sql
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    ON tbl_name (key_part, ...)
    [index_option] ...;
```

- **Index types:** `BTREE` (default), `HASH` (MEMORY tables).
- **Functional indexes** (8.0.13+): `INDEX idx_name ((expression))`.
- **Multi-valued indexes:** Index JSON array values with `CAST(data->'$.path' AS ... ARRAY)`.
- **Invisible indexes:** Created as visible by default; can be made invisible to the optimizer with `ALTER TABLE ... ALTER INDEX ... INVISIBLE`.

### DROP INDEX

```sql
DROP INDEX index_name ON tbl_name;

-- Drop primary key (note the backticks around PRIMARY)
DROP INDEX `PRIMARY` ON tbl_name;
```

### SHOW INDEX

```sql
SHOW [EXTENDED] {INDEX | INDEXES | KEYS} FROM tbl_name
    [FROM db_name]
    [WHERE expr];
```

Returns columns: `Table`, `Non_unique`, `Key_name`, `Seq_in_index`, `Column_name`, `Collation`, `Cardinality`, `Sub_part`, `Packed`, `Null`, `Index_type`, `Comment`, `Index_comment`, `Visible`, `Expression`.

### ALTER TABLE Index Operations

```sql
ALTER TABLE tbl_name
    ADD INDEX index_name (col_list),
    DROP INDEX index_name,
    ADD PRIMARY KEY (col_list),
    DROP PRIMARY KEY,
    ALTER INDEX index_name {VISIBLE | INVISIBLE},
    RENAME INDEX old_name TO new_name;
```

Sources: [CREATE INDEX](https://dev.mysql.com/doc/refman/8.0/en/create-index.html), [DROP INDEX](https://dev.mysql.com/doc/refman/8.0/en/drop-index.html), [SHOW INDEX](https://dev.mysql.com/doc/refman/8.0/en/show-index.html)

---

## 7. Backup & Restore

### mysqldump

```bash
# Single database
mysqldump [options] db_name > dump.sql

# Specific databases
mysqldump --databases db1 db2 > dump.sql

# All databases
mysqldump --all-databases > dump.sql
```

### Key mysqldump Options

| Option | Description |
| -------- | ------------- |
| `--single-transaction` | Consistent backup for InnoDB (no table lock) |
| `--add-drop-table` | Add `DROP TABLE IF EXISTS` before each `CREATE TABLE` |
| `--no-data` / `-d` | Schema only (no rows) |
| `--where="condition"` | Dump only rows matching the condition |
| `--routines` | Include stored procedures and functions |
| `--events` | Include event scheduler events |
| `--triggers` | Include triggers |
| `--tab=dir_name` | Produce tab-separated data files (one per table) with `CREATE TABLE` SQL |
| `--flush-logs` | Flush binary logs before starting dump |
| `--result-file=file` | Direct output to a file (Windows-safe) |

### Restore

```bash
# From shell
mysql db_name < dump.sql

# From mysql client
mysql> SOURCE /path/to/dump.sql;

# Short form
mysql> \. /path/to/dump.sql
```

### mysqlimport

CLI wrapper for `LOAD DATA INFILE`:

```bash
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

| Option | Description |
| -------- | ------------- |
| `--delete` | Empty the table before importing |
| `--force` | Continue even if errors occur |
| `--ignore` | Duplicate-key rows are skipped (insert ignore) |
| `--replace` | Duplicate-key rows replace existing rows |
| `--fields-terminated-by=char` | Field delimiter |
| `--lines-terminated-by=str` | Line terminator |

Sources: [Using mysqldump](https://dev.mysql.com/doc/refman/8.0/en/using-mysqldump.html), [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html), [mysqlimport](https://dev.mysql.com/doc/refman/8.0/en/mysqlimport.html)

---

## 8. Status & Diagnostics

### SHOW STATUS

```sql
SHOW [GLOBAL | SESSION] STATUS [LIKE 'pattern' | WHERE expr];
```

Server status counters (connections, queries, traffic, handler operations, etc.).

### SHOW VARIABLES

```sql
SHOW [GLOBAL | SESSION] VARIABLES [LIKE 'pattern' | WHERE expr];
```

Server system variables (configuration values).

### SHOW PROCESSLIST

```sql
SHOW [FULL] PROCESSLIST;
```

Lists active threads (connections). Shows `Id`, `User`, `Host`, `db`, `Command`, `Time`, `State`, `Info`.

### EXPLAIN (Query Execution Plans)

```sql
EXPLAIN [FORMAT={TRADITIONAL | JSON | TREE}] explainable_stmt;

-- Actual query execution timings (MySQL 8.0.18+)
EXPLAIN ANALYZE select_stmt;

-- Explain a running query in another session
EXPLAIN FOR CONNECTION connection_id;
```

| FORMAT | Description |
| -------- | ------------- |
| `TRADITIONAL` | Tabular format (default) |
| `JSON` | Machine-readable plan with costs |
| `TREE` | Hierarchical format (used by `EXPLAIN ANALYZE`) |

### Other Diagnostic Commands

| Command | Description |
| --------- | ------------- |
| `SHOW WARNINGS` | Show warnings from the last statement |
| `SHOW ERRORS` | Show errors from the last statement |
| `SHOW ENGINE INNODB STATUS` | InnoDB status output (transaction, lock, buffer pool, I/O info) |
| `SHOW OPEN TABLES` | List tables in the table cache |
| `SHOW BINARY LOGS` | List binary log files on the server |
| `SHOW MASTER STATUS` | Current binary log position |
| `SHOW REPLICA STATUS` | Replication status (formerly `SHOW SLAVE STATUS`) |

Sources: [SHOW PROCESSLIST](https://dev.mysql.com/doc/refman/8.0/en/show-processlist.html), [SHOW STATUS](https://dev.mysql.com/doc/refman/8.0/en/show-status.html), [SHOW VARIABLES](https://dev.mysql.com/doc/refman/8.0/en/show-variables.html), [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html), [SHOW Statements](https://dev.mysql.com/doc/refman/8.0/en/show.html)

---

## 9. MySQL 8+ Specific Features

### Common Table Expressions (WITH / CTE)

```sql
-- Non-recursive CTE
WITH cte_name AS (
    subquery
)
SELECT * FROM cte_name;

-- Recursive CTE (anchor member UNION ALL recursive member)
WITH RECURSIVE cte_name AS (
    SELECT ...        -- anchor member
    UNION ALL
    SELECT ... FROM cte_name WHERE ...   -- recursive member
)
SELECT * FROM cte_name;
```

### Window Functions

**Supported functions:** `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `PERCENT_RANK()`, `CUME_DIST()`, `NTILE(N)`, `LAG(expr, N, default)`, `LEAD(expr, N, default)`, `FIRST_VALUE(expr)`, `LAST_VALUE(expr)`, `NTH_VALUE(expr, N)`.

Aggregate functions (`SUM`, `AVG`, `COUNT`, etc.) are also usable with an `OVER()` clause.

```sql
SELECT
    col,
    ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col) AS row_num,
    LAG(col, 1) OVER (ORDER BY sort_col) AS prev_val
FROM tbl;
```

**Frame clause:** `ROWS | RANGE {frame_start | BETWEEN frame_start AND frame_end}`.

Frame start/end: `UNBOUNDED PRECEDING`, `N PRECEDING`, `CURRENT ROW`, `N FOLLOWING`, `UNBOUNDED FOLLOWING`.

### Roles

```sql
-- Create and drop roles
CREATE ROLE role_name [, ...];
DROP ROLE [IF EXISTS] role_name [, ...];

-- Grant privileges to a role
GRANT SELECT, INSERT ON db_name.* TO role_name;

-- Assign role to a user
GRANT role_name TO user_name;

-- Set default role for a user (active on login)
ALTER USER user_name DEFAULT ROLE role_name;

-- Switch roles in the current session
SET ROLE role_name;
SET ROLE ALL;
SET ROLE NONE;

-- Settings
SET GLOBAL activate_all_roles_on_login = ON;  -- auto-activate all granted roles
```

Roles are locked by default and do not activate automatically unless `activate_all_roles_on_login=ON` or a `DEFAULT ROLE` is set.

### Default Authentication: caching\_sha2\_password

- **Default** authentication plugin in MySQL 8.0.
- Caches password hashes on the server side for fast re-authentication.
- Clients/libraries that do not support the plugin will fail. Workaround: create users with `IDENTIFIED WITH mysql_native_password`.

```sql
-- Explicitly use the old plugin for a user
CREATE USER user@host IDENTIFIED WITH mysql_native_password BY 'password';
```

Sources: [WITH / CTE](https://dev.mysql.com/doc/refman/8.0/en/with.html), [Window Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html), [Window Function Frames](https://dev.mysql.com/doc/refman/8.0/en/window-functions-frames.html), [Roles](https://dev.mysql.com/doc/refman/8.0/en/roles.html), [caching\_sha2\_password](https://dev.mysql.com/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html)

---

## 10. Common Admin Commands

### SET

```sql
-- Set a system variable at GLOBAL or SESSION scope
SET [GLOBAL | SESSION] var_name = value;

-- Persist a variable across restarts (MySQL 8.0+)
SET PERSIST var_name = value;

-- Character set and collation
SET CHARACTER SET charset_name;
SET NAMES charset_name;

-- Transaction isolation (next transaction only)
SET TRANSACTION ISOLATION LEVEL {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE};

-- Role switching
SET ROLE {role_name | ALL | NONE | DEFAULT};

-- Resource group
SET RESOURCE GROUP group_name;
```

### FLUSH

```sql
FLUSH [NO_WRITE_TO_BINLOG | LOCAL] option;
```

Common flush operations:

| Option | Description |
| -------- | ------------- |
| `PRIVILEGES` | Reload grant tables |
| `LOGS` | Close and reopen all log files |
| `TABLES` | Close all open tables |
| `TABLES tbl_name [, ...] WITH READ LOCK` | Lock and flush specific tables for backup |
| `HOSTS` | Empty the host cache |
| `STATUS` | Reset most status counters to zero |
| `USER_RESOURCES` | Reset per-user resource limits |
| `OPTIMIZER_COSTS` | Reload optimizer cost model from `mysql.engine_cost` and `mysql.server_cost` |

### RESET

```sql
RESET MASTER;              -- Delete all existing binary logs and reset index
RESET REPLICA;             -- Reset replica (formerly RESET SLAVE)
RESET REPLICA ALL;         -- Reset replica and remove connection metadata
```

### KILL

```sql
KILL [CONNECTION | QUERY] processlist_id;
```

- `CONNECTION` (default): terminate the connection and running statement.
- `QUERY`: terminate only the current statement; keep the connection open.

Thread IDs come from `SHOW PROCESSLIST` / `SHOW FULL PROCESSLIST`.

### mysqladmin Commands

```bash
mysqladmin [options] command [command_arg] [...]
```

| Command | Description |
| --------- | ------------- |
| `create db_name` | Create a database |
| `drop db_name` | Delete a database |
| `ping` | Check whether the server is alive |
| `status` | Brief server status |
| `extended-status` | Same as `SHOW GLOBAL STATUS` |
| `processlist` | Show active threads |
| `kill id [, id]` | Kill threads |
| `shutdown` | Stop the server |
| `flush-*` | Various flush operations (flush-logs, flush-hosts, flush-privileges, etc.) |
| `refresh` | Flush all tables and close log files |
| `reload` | Reload grant tables |
| `variables` | Show server variables |
| `version` | Show server version info |
| `password` | Change user password |
| `start-replica` | Start replica (formerly `start-slave`) |
| `stop-replica` | Stop replica (formerly `stop-slave`) |

### mysql Client Internal Commands

These are shortcuts usable within the interactive `mysql` client:

| Short command | Long command | Description |
| --------------- | -------------- | ------------- |
| `\h` | `help` | Display help |
| `\.` | `source` | Execute SQL script from file |
| `\u` | `use` | Select database |
| `\r` | `connect` | Reconnect to the server |
| `\d` | `delimiter` | Change statement delimiter |
| `\s` | `status` | Server status info |
| `\!` | `system` | Execute a shell command |
| `\T` | `tee` | Append output to a file |
| `\P` | `pager` | Set pager (e.g., `less`) |
| `\e` | `edit` | Edit command in `$EDITOR` |
| `\R` | `prompt` | Change the mysql prompt |
| `\q` | `quit` | Exit mysql |
| `\x` | `resetconnection` | Clean session state |
| `\W` | `warnings` | Show warnings after every statement |
| `\w` | `nowarning` | Don't show warnings |

Sources: [mysql Client Commands](https://dev.mysql.com/doc/refman/8.0/en/mysql-commands.html), [SET Statement](https://dev.mysql.com/doc/refman/8.0/en/set-statement.html), [FLUSH](https://dev.mysql.com/doc/refman/8.0/en/flush.html), [RESET](https://dev.mysql.com/doc/refman/8.0/en/reset.html), [KILL](https://dev.mysql.com/doc/refman/8.0/en/kill.html), [mysqladmin](https://dev.mysql.com/doc/refman/8.0/en/mysqladmin.html)
