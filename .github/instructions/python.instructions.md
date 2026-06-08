---
name: "Python Code Style"
description: "Python coding standards and formatting guidelines"
applyTo: "**/*.py"
---

# Python Code Style and Formatting

This document defines the coding standards and formatting guidelines for Python code in the project.

## Code Organization

### Region Comments
Use `# region <Name>` and `# endregion` to organize code into logical sections.

Common regions: `Imports`, `Logger`, `Enum`, `Static`, `Properties`, `Constructor`, `Functions`, `Operations`, `Nodes`, `Tests`, `Fixtures`

### File Structure
1. Imports region (always at top)
2. Logger region (module-level logger: `LOGGER = LogUtility.get(__name__)`)
3. Static/module-level constants
4. Class definitions
5. Test fixtures and functions (if test file)

## Type Hints and Documentation

- **Always** use type hints for parameters and return types
- Use `typing` module: `Optional`, `Sequence`, `Callable`, `Literal`, `Any`
- Use `typing_extensions.Self` for methods returning same class type
- **Never use quoted type hints** (e.g., `"ClassName"`) - always use unquoted types
- Use triple-quoted docstrings for all classes, methods, and functions
- Include structured Args and Returns sections in docstrings
  ```python
  """
  Remove all whitespace from a string.

  Args:
    text: The input string from which to remove whitespace.
    performance: Choose the method for removing whitespace.

  Returns:
    `str`: The modified string with whitespace removed.
  """
  ```
- Add inline docstrings after class attributes
  ```python
  LOGGER = LogUtility.get(__name__)
  """Logger for the module"""
  ```

## Pydantic Models

- All classes in this repository should be Pydantic-based. Prefer `BaseModel` for records, configuration, and structured state.
- Avoid `dataclasses` entirely; do not use them for model classes or as a shortcut for behavioral helpers.
- For behavior-first code, keep logic in methods on Pydantic-backed classes or in module-level functions rather than introducing dataclasses.

### Field Definitions
- Always use `Field` with descriptive metadata for Pydantic model properties
- Provide default values or `default_factory` where appropriate
- Include both inline and docstring descriptions:
  ```python
  name: str = Field(default="", description="Name of the entity")
  """Name of the entity"""
  ```

### Model Organization
- Organize model classes with nested Enum/Constant classes first, then Static (ClassVar) declarations, then properties, then methods
- Place all enums and constant classes in an `# region Enum` section at the top of the class
- Place ClassVar declarations (like mappings) in an `# region Static` section after enums
- Use `model_post_init` for post-initialization logic
- Implement custom serializers with `@field_serializer` when needed

### Class Example

```python
class MyModel(BaseModel):

    # region Enum
  
    class Status(str, Enum):
        ACTIVE = "active"
        INACTIVE = "inactive"
    
    class Keys:
        ID = "id"
        NAME = "name"

    # endregion
    
    # region Static

    DEFAULT_TIMEOUT: ClassVar[int] = 30

    # endregion
    
    # region Properties

    name: str = Field(default="", description="Name")
    """Name of the entity"""

    # endregion
    
    # region Functions

    @classmethod
    def process(cls, data: dict) -> dict:
        return {cls.Keys.ID: data[cls.Keys.ID]}
    
    # endregion
```

### Nested Constants
- **Always** nest enums and constant classes inside their parent class
- Access via `cls.Keys.NAME` (class methods) or `self.Keys.NAME` (instance methods)
- **Never use raw string literals** for keys/identifiers - use constants for refactor safety

```python
# Bad: Brittle strings
state["agent"]  # Typo risk

# Good: Refactor-safe constants
state[cls.Keys.AGENT]  # linter support
```

### Class Methods
- Use `@classmethod` for utility methods and factory methods
- Prefer class methods over instance methods for utility classes
- Use descriptive method names that clearly indicate their purpose
- Access nested constants using `cls.NestedClass.CONSTANT` within class methods

### Static Loggers
- Create module-level loggers in a Logger region:
  ```python

  # region Imports

  from logging import getLogger

  # endregion

  # region Logger
  
  LOGGER = getLogger(__name__)
  """Logger for the module"""
  
  # endregion
  ```

## Naming Conventions

- **Classes**: PascalCase (e.g., `EntityFactory`, `GoblinFactory`)
- **Functions/Methods**: snake_case (e.g., `build_language`, `remove_whitespace`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `LOGGER`, `WHITE_SPACE_FUNC_MAP`)
- **Private attributes**: prefix with single underscore (e.g., `_internal_cache`)
- **Type hints**: Use descriptive names that match their purpose

## Private vs Public Members

### Properties (Attributes)
- **Private properties** (prefixed with `_`) are strongly preferred and enforced by Pydantic
- Use private properties to protect internal state from external modification
- Expose private properties through public `@property` methods when read access is needed
- Example:
  ```python
  class MyModel(BaseModel):
      _internal_state: int = PrivateAttr(default=0)
      
      @property
      def internal_state(self) -> int:
          """Get the internal state value."""
          return self._internal_state
  ```

### Methods
- **Public methods** (no underscore prefix) are strongly preferred for all callable functionality
- Methods are part of the public API and should be accessible
- Private methods (prefixed with `_`) are NOT enforced in Python and provide no real encapsulation
- Only use private methods if there's a compelling reason for signaling internal-only usage
- Rationale: Unlike properties which Pydantic enforces, method privacy is merely a naming convention that provides no actual protection

```python
# Preferred: Public methods with clear, descriptive names
class MyClass:
    def compute_result(self, data: dict) -> int:
        """Compute and return a result from the data."""
        return self.process_data(data)
    
    def process_data(self, data: dict) -> int:
        """Process the data and extract a value."""
        return data.get("value", 0)

# Avoid: Private methods without compelling reason
class MyClass:
    def compute_result(self, data: dict) -> int:
        """Compute and return a result from the data."""
        return self._process_data(data)  # Unnecessary privacy marker
    
    def _process_data(self, data: dict) -> int:
        """Process the data and extract a value."""
        return data.get("value", 0)
```

## Logging Conventions

- **Multi-line log messages** - Use `"\n".join([...])` pattern with f-strings for complex log messages
- **Never use old-style formatting** - Avoid `%` formatters (`%s`, `%d`, etc.) in logger calls
- **Structure log messages** - Build log messages as lists of f-strings for readability
- Example:
  ```python
  LOGGER.info(
      "\n".join(
          [
              f"Starting operation",
              f"Participants: {count}",
              f"Rounds: {rounds}",
              f"Mode: {mode or 'Default'}",
          ]
      )
  )
  ```

## Formatting Rules

- **Indentation**: Use 4 spaces (never tabs)
- **Line length**: Keep lines reasonably short (aim for < 100 characters when practical)
- **Blank lines**: 
  - Two blank lines between top-level classes and functions
  - One blank line between methods within a class
  - No blank line immediately after region markers
- **String quotes**: Use double quotes for strings by default
- **Imports**: 
  - Group standard library, third-party, and local imports
  - Use absolute imports from the package root (e.g., `from evertome.core import LogUtility`)

## Dependencies and Imports

- Import only what is needed from each module
- Use `from` imports for specific items rather than importing entire modules
- Group related imports together
- Maintain alphabetical ordering within import groups where it improves readability
- **Never use lazy imports** - All imports must be declared at the top of the file in the `# region Imports` section
  - Lazy imports (imports inside functions/methods) hide dependencies and make code harder to maintain
  - They can cause circular import issues to go undetected
  - They make refactoring more difficult and error-prone
  - Exception: Only use lazy imports if absolutely necessary to break circular dependencies, and document why with a comment
  - If you have a circular dependency, consider refactoring the code structure instead

---

## Code Change Workflow

1. **Make changes** - Follow style guidelines, add type hints and docstrings, use region markers
2. **Format code** - Run `uv format`
3. **Check linting**
  - Run `uv run pylint src`
  - Run `uv run pyright src`
4. **Run tests** - Run `uv run pytest`

**Always format, lint, then test.** Aim for a pylint score of 9.0 or higher. Address all errors (E) and most warnings (W).
