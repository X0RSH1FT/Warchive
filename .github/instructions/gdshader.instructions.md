---
name: "Godot Shaders"
description: "Godot 4.x shader guidance"
applyTo: "**/*.gdshader"
---

# Godot Shader Guidance

## Ownership and Structure

- Keep each shader responsible for one material effect and compatible with the Godot resource or scene that owns it.
- Start with the appropriate Godot `shader_type` (`spatial`, `canvas_item`, or another type supported by the project). Treat the selected type as the contract for available built-ins, outputs, and stage behavior.
- Use `render_mode` only for modes supported by the selected shader type and only when the material needs that render-state behavior.
- Keep stage entry points explicit: use `vertex()` for per-vertex work, `fragment()` for per-fragment material outputs, and `light()` only when custom lighting is required by the material. Do not assume a stage runs or exposes the same values as another stage.
- Keep helper functions small and typed, and preserve the Godot shader syntax and built-in names expected by the project's exact Godot 4 version and renderer.

## Uniforms and Material Integration

- Declare exposed `uniform` values with meaningful defaults, appropriate Godot hints, and names that remain stable for Inspector and script callers. Keep ranges and hints aligned with the values the shader actually accepts.
- Treat `ShaderMaterial` as the owner of uniform values. Assign the shader to the intended material slot or `material_override`, and confirm the resource is attached to the intended node or surface.
- When changing parameters from GDScript, use `ShaderMaterial.set_shader_parameter()` with the exact uniform name and a compatible value type. Duplicate a shared material before per-instance mutation; otherwise all users of the resource may change together.
- Keep shader parameter names and expected types synchronized with scripts, scenes, and material resources. Make a parameter change visible through the Inspector or a focused runtime check before layering on more shader logic.

## Coordinates and Varyings

- Name coordinate spaces in code and comments when a value crosses a stage. Verify whether a position is local, view, world, or screen space before combining it with another value.
- Declare `varying` values deliberately, write them in the producing stage, and read them only in compatible consuming stages. Keep varying payloads small and avoid using them to pass values that can be recomputed cheaply and consistently.
- Treat `UV`, normals, transforms, screen coordinates, and other built-ins as Godot shader inputs with renderer and shader-type constraints. Validate their availability and orientation in the target material instead of importing assumptions from another engine.
- Preserve perspective-correct behavior unless a specific effect requires otherwise, and validate interpolation-sensitive effects on the actual mesh, canvas item, or viewport that owns the shader.

## Performance and Resources

- Prefer the simplest expression that produces the required effect. Avoid unnecessary texture reads, dependent work, branches, high-frequency loops, and duplicated calculations in `fragment()`.
- Keep uniform and texture usage intentional, and avoid adding resources or passes without measuring their visual and runtime value. Do not use a shader to replace geometry when the effect requires a reliable silhouette, collision, or shadow shape.
- Evaluate cost at the target resolution, mesh or screen coverage, instance count, renderer, and hardware. Reduce procedural layers, animation work, and emission complexity before optimizing unrelated scene code.

## Debugging and Validation

- Check Godot editor shader diagnostics first, then verify the shader is assigned to the intended `ShaderMaterial` and surface or node. Use the installed project's exact Godot 4 version and renderer when validating syntax and behavior.
- Isolate failures in stages: compile a minimal constant material output, attach it to the intended resource, verify coordinates and UVs, then restore uniforms, animation, lighting, transparency, and custom render modes one change at a time.
- Use temporary outputs such as constant color, UV color, position-derived color, or constant emission to distinguish shader math, coordinate assumptions, material wiring, lighting, and environment effects. Remove diagnostic output before finishing.
- Run the affected scene or project and inspect the Godot debugger for shader compilation, material, resource, and runtime errors. Check visual results on representative geometry and target renderer settings.
- Confirm changed uniforms, textures, render modes, and stage boundaries in the Inspector or focused runtime path. Do not treat a successful parse as proof that the material is correctly bound or visually correct.

## Boundaries

- Prefer Godot's documented shader types, built-ins, stage outputs, hints, render modes, resource workflow, and renderer behavior over generic GLSL/HLSL portability advice.
- Do not assume desktop GLSL/HLSL entry-point syntax, arbitrary external uniforms, engine-specific semantics, or another engine's coordinate conventions apply to `.gdshader` files.
- Keep renderer- or version-sensitive behavior explicitly verified in the local Godot project; avoid unsupported feature claims and invented compatibility guarantees.
