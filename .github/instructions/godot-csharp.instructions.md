---
name: "Godot C#"
description: "Godot 4.x C# script guidance"
applyTo: "**/*.cs"
---

# Godot C# Guidance

Apply these rules in addition to the repository's broad C# rules. Keep this file focused on Godot script and scene integration.

## Script and Node Structure

- Apply Godot-specific rules in this file to types that inherit from, hold, or otherwise interact with Godot APIs. Pure C# classes that do not cross a Godot boundary should follow the repository's broad C# rules instead.

- Define attached Godot scripts as `public partial` classes and inherit from the appropriate Godot type, usually `Node` or a more specific node class.
- Keep the class name aligned with the `.cs` file and the script attached to the intended scene node.
- Use the generated C# Godot API and its PascalCase members at engine boundaries. Use generated `MethodName`, `PropertyName`, and `SignalName` constants when an API requires names as strings and those constants are available.

## Lifecycle and Timing

- Override Godot lifecycle methods with their C# signatures, including `_EnterTree`, `_Ready`, `_ExitTree`, `_Process(double delta)`, and `_PhysicsProcess(double delta)` when appropriate.
- Use `_EnterTree` for work that must happen as the node enters the tree, `_Ready` for initialized child access, and `_ExitTree` for teardown.
- Expect enter and exit callbacks to recur when a node is removed and later re-entered. Make setup and teardown safe to repeat.
- Use `delta` for frame-rate-independent time-based behavior. Use `_PhysicsProcess` for fixed-step or physics-sensitive work, and do not assume its configured rate without checking project settings.

## Exports and References

- Use `[Export]` for Inspector-configured fields or properties with clear, serializable defaults and types.
- Prefer exported typed `Node` or `Resource` references when a scene explicitly owns the dependency. Export `NodePath` only when a path is the intended, stable contract.
- Resolve child references with `GetNode<T>()` in `_Ready` or later, unless the reference is an exported dependency whose assignment is guaranteed by the scene.
- Treat node names and paths as scene contracts. Validate required references and report a useful error when the contract is broken rather than hiding a null or invalid node.
- Rebuild the C# assemblies after changing exported members, signals, or editor-visible script metadata so the editor can refresh the generated information.

## Signals and Lifetime

- Prefer generated C# events for built-in Godot signals. Define custom signals with `[Signal]` and a public delegate whose name ends in `EventHandler`, then emit them with `EmitSignal` and the generated signal identifier.
- Use `Connect` when consuming signals from GDScript or when connection flags or dynamic names are required. Preserve Godot's expected signal and method naming at dynamic API boundaries.
- Disconnect connections in `_ExitTree` or disposal when a connection or captured callback could outlive its receiver. Avoid duplicate connections across repeated tree entry.
- Keep signal handlers resilient to nodes leaving the tree and to freed or disposed Godot objects.

## Scenes and Resources

- Treat a scene as a `PackedScene` resource. Load it with `GD.Load<T>()` or `ResourceLoader.Load<T>()`, instantiate it, and attach the instance with `AddChild()` under the intended parent. `AddChild()` establishes the parent/child relation; when scene ownership is required for editor or save workflows, assign the instantiated node's `Owner` explicitly and appropriately.
- Use runtime loading for variable paths and choose a preload-like strategy only through APIs supported by C#; do not assume GDScript `preload()` syntax exists in C#.
- Keep resource ownership and sharing explicit. Godot `Resource` and `RefCounted` instances are reference-counted and may be shared, while nodes are tree-owned objects.
- Remember that C# value types such as vectors are copied. Change a local value and assign the complete value back when updating a Godot property.

## Ownership, Freeing, and Errors

- Use `QueueFree()` for ordinary node deletion so removal occurs safely at the end of the current frame. Use `Free()` only when immediate destruction is intentional and safe.
- Freeing a node also frees its children. Do not retain or use node references after they have been freed; account for invalid or disposed objects at asynchronous and signal boundaries.
- Before using a `GodotObject` across async, signal, or deferred boundaries, validate it with `GodotObject.IsInstanceValid(...)` where relevant. An ordinary null check alone does not establish native object validity.
- Use Godot diagnostics such as `GD.Print`, warnings, errors, assertions, and the debugger with enough context to identify the node and scene contract. Do not treat a logged error as successful recovery.
- Check return values and connection or resource-loading failures where the API provides them. Prefer explicit guards over null-forgiving assumptions.

## Validation

- Check editor and parser diagnostics for the changed script, then rebuild the C# project when metadata or assemblies may have changed.
- Open the affected scene and verify script attachment, exported values, node paths, resources, and ownership in the Inspector.
- Run the affected scene and then the wider project when the change crosses scene boundaries. Inspect the Godot debugger for lifecycle, invalid-node, resource-loading, signal, and disposed-object errors.
- Use the installed Godot executable's version and help output before selecting command-line validation options; do not assume a flag, renderer, or executable name across Godot 4.x environments.
