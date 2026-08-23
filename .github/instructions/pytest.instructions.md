---
name: "Pytest Conventions"
description: "Testing patterns and pytest conventions for test files"
applyTo: "test/**/*.py"
---

# Pytest Conventions

Testing conventions for the pytest suite.

## Guidance

- When code changes, add or update relevant tests.
- Keep tests under `test/`.
- Keep unit tests isolated and fast.
- Categorize tests with markers such as `@mark.unit` and `@mark.data`.

## Naming

- File names: `<module>_test.py` (e.g., `agent_test.py`, `factory_test.py`)
- Class names: `Test<Feature>` (optional, for grouping)
- Function names:
  - `test_<behavior>`
  - `test_<feature>_<scenario>`

## Layout

- Group related tests in descriptive classes
- Keep shared fixtures in `test/conftest.py` or inside test modules when they are only used once.
- Keep module test fixtures at top, then followed by test classes, and then test functions

## Assertions

- Prefer assertions on externally visible behavior: returned values, state changes, and other expected effects.
- Include descriptive assertion messages with f-strings
- Use `pytest.raises(...)` for error paths and match the important part of the message.

## Style

- Use type hints
- **String quotes** - Double quotes by default
- **Line length** - < 100 characters when practical

## Comments

- Add a short docstring only when the test setup or scenario is not already obvious from the name.
- Keep comments rare and only where they clarify deterministic ordering, regression context, or unusual fixtures.

## Example

```python
# region Imports

from enum import Enum
from pathlib import Path
from pytest import fixture, mark

# endregion

# region Enums

class FileType(str, Enum):
    JSON = ".json"
    YAML = ".yaml"
    YML = ".yml"
    CSV = ".csv"
    TSV = ".tsv"
    TXT = ".txt"
    MD = ".md"
    XML = ".xml"
    TOML = ".toml"
    LOG = ".log"

# endregion

# region Fixtures

@fixture
def tmp_dir(tmp_path: Path) -> Path:
    """Provide a temporary directory for file tests."""
    return tmp_path


@fixture
def sample_dict() -> dict:
    """Provide a sample dictionary for JSON serialization tests."""
    return {"name": "Skritch", "class": "Necromancer", "level": 9, "alive": False}


@fixture
def sample_text() -> str:
    """Provide sample text content for text file tests."""
    return "From me damp crypt beneath the monster dungeon, greetings!\nYesss!"

# endregion

# region Tests

@mark.data
@mark.unit
class TestFileType:
    """Tests for the FileType enum - verifying all file extension bones are in order!"""

    def test_json_extension(self):
        """FileType.JSON should yield .json extension."""
        assert FileType.JSON == ".json", "JSON extension must be .json"

    def test_yaml_extension(self):
        """FileType.YAML should yield .yaml extension."""
        assert FileType.YAML == ".yaml", "YAML extension must be .yaml"

    def test_yml_extension(self):
        """FileType.YML should yield .yml extension."""
        assert FileType.YML == ".yml", "YML extension must be .yml"

    def test_csv_extension(self):
        """FileType.CSV should yield .csv extension."""
        assert FileType.CSV == ".csv", "CSV extension must be .csv"

    def test_tsv_extension(self):
        """FileType.TSV should yield .tsv extension."""
        assert FileType.TSV == ".tsv", "TSV extension must be .tsv"

    def test_txt_extension(self):
        """FileType.TXT should yield .txt extension."""
        assert FileType.TXT == ".txt", "TXT extension must be .txt"

    def test_md_extension(self):
        """FileType.MD should yield .md extension."""
        assert FileType.MD == ".md", "MD extension must be .md"

    def test_xml_extension(self):
        """FileType.XML should yield .xml extension."""
        assert FileType.XML == ".xml", "XML extension must be .xml"

    def test_toml_extension(self):
        """FileType.TOML should yield .toml extension."""
        assert FileType.TOML == ".toml", "TOML extension must be .toml"

    def test_log_extension(self):
        """FileType.LOG should yield .log extension."""
        assert FileType.LOG == ".log", "LOG extension must be .log"

    def test_is_str_enum(self):
        """FileType values should be usable as plain strings."""
        path = f"tome{FileType.JSON}"
        assert path == "tome.json", f"Expected 'tome.json', got '{path}'"

    def test_all_types_present(self):
        """FileType should contain all expected file type members."""
        expected = {
            "JSON",
            "YAML",
            "YML",
            "CSV",
            "TSV",
            "TXT",
            "MD",
            "XML",
            "TOML",
            "LOG",
        }
        actual = {member.name for member in FileType}
        assert actual == expected, f"Missing types: {expected - actual}"

# endregion
```

## Running Tests

```bash
# Full suite
uv run pytest

# Directory
uv run pytest test

# File
uv run pytest test/test_goap_planner.py

# Test
uv run pytest test/test_goap_planner.py::test_planner_requires_matching_effect_value_and_available_producer

# Collect-only sanity check
uv run pytest --collect-only
```

## Installation

**Install**
```bash
uv add pytest --dev
```

## Configuration
Pytest configurations for `pyproject.toml` 

```conf
[dependency-groups]
dev = [
	"pytest>=8.3",
]

[tool.pytest.ini_options]
testpaths = ["test"]
```