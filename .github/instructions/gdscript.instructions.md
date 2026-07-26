---
name: "Godot GDScript"
description: "Godot 4.x GDScript guidance"
applyTo: "**/*.gd"
---

# Godot GDScript Guidance

Keep this file focused on Godot GDScript, scenes, and the scene tree. Follow the repository's broader rules where they apply.

## Types and Script Structure

- Use `extends` to declare the Godot base type that owns the script, and keep the script's responsibility aligned with that node or resource.
- Prefer static typing where the project compatibility permits it: type variables, parameters, return values, signal callbacks, and typed arrays where supported. Use typed dictionaries only after confirming that the project's exact Godot version supports the intended syntax.
- Use `:=` only when the assigned expression makes the type clear; use an explicit annotation when it does not. Prefer a declared type over `as` when a mismatch should fail immediately.
- Use `class_name` selectively for reusable project classes that should be globally available. Do not register every helper script globally.
- Follow Godot naming conventions: snake_case for files, functions, variables, and signals; PascalCase for classes and node names; CONSTANT_CASE for constants and enum members.

## Exports, References, and Timing

- Use `@export` for Inspector-editable data with clear serializable types and defaults. Treat exported values as scene configuration and do not overwrite them accidentally during initialization.
- Use `@onready` for child-node references that require the scene tree. Do not combine `@onready` and `@export` casually when the on-ready initializer could replace an Inspector assignment.
- Resolve scene children in `_ready()` or through `@onready`; do not assume children exist during ordinary member initialization.
- Use relative node paths, `$` shorthand, or `%` unique-node access only when the scene contract is clear. Prefer direct references and avoid long ancestor paths that weaken encapsulation.
- Treat node names and paths as contracts. Validate required references and make broken scene assumptions visible instead of allowing a later null access.

## Lifecycle and Delta

- Use `_enter_tree()` for work that must happen as the node enters the tree, `_ready()` after the relevant children are ready, and `_exit_tree()` for teardown and signal disconnection.
- Expect enter and exit callbacks to recur when a node leaves and re-enters the tree. Make registration, initialization, and cleanup safe to repeat.
- Use `_process(delta)` for frame-based work and `_physics_process(delta)` for fixed-step or physics-sensitive work. Apply `delta` to time-based movement and simulation, and do not assume a fixed rate without checking project settings.

## Signals, Await, and Groups

- Define custom signals with `signal`, connect them with the signal's `connect` method, and emit them with the signal's `emit` method. Use signals to keep scene components decoupled.
- Disconnect signals in `_exit_tree()` when the receiver or connection lifetime requires explicit teardown, and avoid duplicate connections across repeated tree entry.
- Use `await` for signals and coroutine results. Await a dependency when the caller must wait for it; otherwise make the asynchronous continuation and its lifetime explicit.
- Use node groups as stable tags for decoupled lookup or broadcast behavior. Prefer clear snake_case group names and avoid groups as a substitute for a direct scene dependency.

## Scenes, Resources, and Lifetime

- Treat scenes as `PackedScene` resources: use `preload()` for constant paths and `load()` for runtime or variable paths, call `instantiate()`, and add the instance to the intended parent.
- Remember that resources are shared and cached by path. Duplicate a mutable resource deliberately when independent state is required.
- `Node` instances remain alive until `free()` or `queue_free()`; use `queue_free()` for ordinary removal so destruction is deferred safely. Freeing a node recursively frees its children.
- Account for reference-like behavior of arrays, dictionaries, nodes, and resources, and for copied built-in value types such as vectors when mutation versus duplication matters.

## Errors and Validation

- Use clear parser errors, warnings, assertions, and debugger output to expose invalid node paths, missing resources, failed signal connections, and invalid state. Include useful context and do not hide a failed contract behind a fallback.
- Check editor diagnostics for the changed script. Open the affected scene and verify script attachment, exported values, node references, resources, groups, and ownership in the Inspector.
- Run the affected scene and then the wider project when the change crosses scene boundaries. Inspect the Godot debugger for lifecycle, runtime, signal, resource, and freed-object errors.
- Use the installed Godot executable's version and help output before selecting command-line validation options; do not assume a flag, renderer, or executable name across Godot 4.x environments.
