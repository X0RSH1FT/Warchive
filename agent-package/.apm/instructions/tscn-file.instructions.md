---
name: "Godot Scene Files"
description: "Godot 4.x .tscn scene file guidance"
applyTo: "**/*.tscn"
---

# Godot Scene File Guidance

## Ownership and Editing

- Treat `.tscn` files as serialized scene composition: node hierarchy, resource wiring, script and material attachments, Inspector-configured values, groups, and scene ownership data.
- Prefer narrow, source-anchored edits. Preserve the existing section order, structure, identifiers, formatting, and unrelated serialized values unless the requested scene change requires them to change.
- Use the Godot editor for structural changes when practical. When editing text directly, follow the file's existing serialization patterns and avoid broad rewrites or identifier renumbering.

## Serialized Relationships

- Preserve the relationships among node names and paths, external resources, subresources, script attachments, exported values, groups, ownership-related scene data, and their dependents.
- Update dependent references together. For example, when renaming a node, update dependent node paths and verify script references; when replacing a resource identifier, update its declaration and all uses.
- Preserve resource identities and references that are outside the requested change. Do not guess at serialized properties, resource types, or syntax that the installed Godot version has not confirmed.

## Boundaries

- Defer GDScript behavior to [gdscript.instructions.md](gdscript.instructions.md) and Godot C# behavior to [godot-csharp.instructions.md](godot-csharp.instructions.md).
- Defer shader and shader-material code to [gdshader.instructions.md](gdshader.instructions.md). Keep this file focused on scene composition and serialized resource connections.

## Validation

- Check editor and available file diagnostics for the changed scene. Open the scene and inspect the hierarchy and Inspector configuration, including node paths, external resources, subresources, script and material attachments, exported values, groups, and ownership-related data.
- Run the affected scene with a focused scene run and inspect Godot debugger output for missing resources, invalid node paths, attachment failures, and runtime configuration errors. Run the wider project when the change crosses scene boundaries.
- Check the installed Godot executable's version and help output before choosing command-line validation syntax. Do not assume executable names, flags, renderer options, or other command behavior across Godot 4.x environments.