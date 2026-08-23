# Godot 4 First Shader: Cyberpunk Building Material

Audience and scope: A practical first Godot 4 spatial-shader walkthrough for graphics programmers and technical artists who already know OpenGL, DirectX, and Unreal Materials. It covers one `MeshInstance3D`, one `ShaderMaterial`, procedural building panels, and the minimum runtime parameter workflow needed to experiment safely.

Last updated: 2026-07-26

## Source and research limitation

This page consolidates the shader implementation and workflow from the prior shader discussion into a durable research note. The code and steps are intended for Godot 4, but they were not live-checked against a running project or a version-specific official documentation page during this update. Confirm the exact Godot 4 minor version, renderer, syntax, and built-in behavior in the installed editor before treating this as production guidance. No live-document citations are claimed here.

## Mental model

Godot's source-level workflow is close to the GPU concepts familiar from OpenGL and DirectX, while its resource wiring is the useful bridge from Unreal Materials:

| Godot concept | OpenGL or DirectX comparison | Unreal Materials comparison |
| --- | --- | --- |
| `Shader` resource | The shader source and its compiled stages | The material graph's generated shader logic, authored as source here |
| `ShaderMaterial` | A program plus its bound uniform values and render state | A material instance-like resource that points at a shader and stores parameter values |
| `uniform` | A shader parameter or constant-buffer value | A scalar, vector, color, texture, or scalar parameter exposed on a material |
| `MeshInstance3D.material_override` or a mesh surface material | Binding a program/material to a draw | Assigning a material to a mesh component or material slot |
| `ALBEDO`, `EMISSION`, `ROUGHNESS`, and similar outputs | Fragment-stage outputs and fixed-function/PBR inputs | Material output pins such as Base Color, Emissive Color, and Roughness |
| `vertex()` and `fragment()` | Vertex and fragment/pixel entry points | The vertex and pixel portions hidden behind the material graph |

For this example, `shader_type spatial` means a 3D material. The shader writes a dark panel color to `ALBEDO`, adds cyan and magenta light to `EMISSION`, and adjusts `ROUGHNESS`. A `ShaderMaterial` owns the values of the exposed uniforms; the shader only declares and reads them.

## Create and attach the material

1. Create or open a Godot 4 project and record its exact version and renderer. Use a 3D scene with a `Camera3D`, a `DirectionalLight3D` or `OmniLight3D`, and a `WorldEnvironment`.
2. Add a `MeshInstance3D` to the scene. Assign a `BoxMesh`, `CylinderMesh`, or another test mesh to its `Mesh` property. A box is useful for the building look; a tall box gives the effect a readable silhouette.
3. In the FileSystem dock, create a new `Shader` resource, for example `cyberpunk_building.gdshader`.
4. Open the shader resource, replace its contents with the complete shader in the next section, and save it. The first line must remain `shader_type spatial;`.
5. Select the `MeshInstance3D`. In the Inspector, find `Geometry > Material Override` and create a new `ShaderMaterial`.
6. Open the new `ShaderMaterial`, set its `Shader` property to `cyberpunk_building.gdshader`, and expand the shader parameters. The declared uniforms become the exposed controls.
7. Set the initial colors, scale, speed, and emission values in the Inspector. Run the scene and confirm that the material is attached before changing the effect.
8. If the material should apply to only one surface, assign the `ShaderMaterial` to the relevant material slot on the mesh instead of using `Material Override`.

`Material Override` is a useful first test because it makes the assignment unambiguous. Once the shader works, move it to a mesh surface or a reusable scene if that better matches the intended asset workflow.

## Complete cyberpunk building shader

Create `cyberpunk_building.gdshader` with this code:

```glsl
shader_type spatial;

render_mode diffuse_burley, specular_schlick_ggx;

uniform vec4 panel_color : source_color = vec4(0.008, 0.012, 0.022, 1.0);
uniform vec4 seam_color : source_color = vec4(0.01, 0.35, 0.55, 1.0);
uniform vec4 cyan_color : source_color = vec4(0.0, 0.85, 1.0, 1.0);
uniform vec4 magenta_color : source_color = vec4(1.0, 0.02, 0.55, 1.0);

uniform float panel_scale = 8.0;
uniform float panel_depth = 0.12;
uniform float seam_width = 0.035;
uniform float accent_width = 0.018;
uniform float pulse_speed = 1.6;
uniform float pulse_strength = 1.4;
uniform float scanline_density = 28.0;
uniform float scanline_strength = 0.22;
uniform float emission_strength = 3.0;
uniform float vertical_stretch = 2.5;

varying vec3 local_position;

float hash21(vec2 point) {
	point = fract(point * vec2(123.34, 456.21));
	point += dot(point, point + 45.32);
	return fract(point.x * point.y);
}

void vertex() {
	local_position = VERTEX;
}

void fragment() {
	vec2 scaled_uv = UV * vec2(panel_scale, panel_scale * vertical_stretch);
	vec2 cell = floor(scaled_uv);
	vec2 cell_uv = fract(scaled_uv);

	float edge_x = smoothstep(0.0, seam_width, cell_uv.x);
	edge_x *= 1.0 - smoothstep(1.0 - seam_width, 1.0, cell_uv.x);
	float edge_y = smoothstep(0.0, seam_width, cell_uv.y);
	edge_y *= 1.0 - smoothstep(1.0 - seam_width, 1.0, cell_uv.y);
	float seam = 1.0 - min(edge_x, edge_y);

	float panel_seed = hash21(cell);
	float window_band = step(0.52, panel_seed);
	float window_column = step(0.18, cell_uv.x) * step(cell_uv.x, 0.82);
	float window_row = step(0.16, cell_uv.y) * step(cell_uv.y, 0.84);
	float window = window_band * window_column * window_row;

	float pulse = 0.5 + 0.5 * sin(TIME * pulse_speed + cell.y * 0.7 + cell.x * 0.31);
	float scanline = 0.5 + 0.5 * sin((local_position.y + TIME * pulse_speed) * scanline_density);
	float diagonal = smoothstep(1.0 - accent_width, 1.0, fract(cell_uv.x + cell_uv.y));
	float magenta_band = step(0.72, hash21(cell + vec2(17.0, 4.0))) * diagonal;

	vec3 base = panel_color.rgb;
	base += seam_color.rgb * seam * 0.35;
	base += mix(cyan_color.rgb, magenta_color.rgb, magenta_band) * window * 0.08;

	vec3 cyan_emission = cyan_color.rgb * window * (0.25 + pulse * pulse_strength);
	vec3 magenta_emission = magenta_color.rgb * magenta_band * (0.3 + pulse * 0.8);
	vec3 emission = (cyan_emission + magenta_emission) * emission_strength;
	emission += cyan_color.rgb * seam * scanline * scanline_strength;

	ALBEDO = base;
	EMISSION = emission;
	ROUGHNESS = clamp(0.48 + panel_depth * 0.35, 0.0, 1.0);
}
```

The shader uses the mesh UVs to divide the surface into panel cells. Each cell gets a stable pseudo-random value, so some cells become windows and some remain dark. `TIME` animates the window pulse and scanline. `local_position` supplies a local-space height signal without assuming that the fragment-stage `VERTEX` value is still in object space.

## Coordinates, UVs, and silhouette

- **UV requirements:** This material expects usable `UV` coordinates. A primitive mesh normally supplies them, but a custom building mesh must have a UV channel with sensible 0-to-1 coverage. If the whole object is one stretched UV island, the panel grid will also be stretched. Visualize `UV` as color during debugging when the pattern is unexpectedly uniform.
- **Local versus world coordinates:** `local_position` is captured in `vertex()` before the normal spatial transform and passed to `fragment()`. Use local/object space for a self-contained individual building when the scanline should follow that building's transform. Use world space for a city-wide aligned sweep across multiple buildings; in that case, use or convert the appropriate world-position value in the shader rather than relying on `local_position`, and validate the transform before extending the effect beyond one building.
- **Geometry silhouette:** A shader can shade existing faces but cannot create a convincing roofline, antenna, balcony, or irregular skyline by itself. Use a sufficiently tall mesh, separate meshes, or actual geometry for the building silhouette. Use vertex displacement only for controlled experiments and validate normals, collision, and shadow behavior afterward.
- **Lighting and glow:** `EMISSION` is bright material output, not automatically a visible bloom halo. Add a `WorldEnvironment`, assign an `Environment`, enable `Glow`, and tune its intensity, bloom, and threshold settings in the active renderer. Glow depends on the renderer and project settings, so confirm the result in the target Godot 4 configuration.

## Runtime material parameters

Shader parameters belong to the `ShaderMaterial` resource. Duplicate the material when each building needs independent values; otherwise changing one shared resource changes every user of it.

```gdscript
@onready var building: MeshInstance3D = $Building

func _ready() -> void:
	var source_material := building.get_active_material(0) as ShaderMaterial
	if source_material == null:
		return

	var building_material := source_material.duplicate() as ShaderMaterial
	building.material_override = building_material
	building_material.set_shader_parameter("pulse_speed", 2.2)
	building_material.set_shader_parameter("emission_strength", 4.0)
```

For a material already assigned as an override, use `building.material_override as ShaderMaterial` instead of `get_active_material(0)`. Keep the parameter name identical to the shader uniform name and pass a compatible type: `float`, `Vector4` or `Color`, and so on. A single shared material is appropriate when all buildings should pulse and color together.

## Testing and debugging progression

Use one change at a time and stop at the first failed boundary:

1. **Compile:** Replace the shader body temporarily with a minimal `fragment()` that writes a constant `ALBEDO`. Fix syntax or type errors before investigating the scene.
2. **Attach:** Confirm the constant color appears on the intended `MeshInstance3D`. Check `Material Override`, mesh surface slots, camera framing, and lights.
3. **Restore inputs:** Add `UV`, then the panel grid, and finally the `TIME` animation. A uniform pattern usually indicates missing or unsuitable UVs.
4. **Inspect coordinates:** Temporarily set `ALBEDO = fract(local_position * 0.1);` or output a UV-based color. This separates coordinate assumptions from lighting problems.
5. **Inspect emission:** Set `EMISSION` to a constant cyan and temporarily raise its strength. If the surface is bright but has no halo, check `WorldEnvironment` Glow rather than the shader math.
6. **Check render state:** Test back-face visibility, depth, transparency, shadows, and the chosen renderer only after the opaque material works.
7. **Profile the result:** Reduce panel scale, emission, and animation complexity when testing many buildings. Confirm the visual cost on the target hardware before adding texture sampling or extra layers.

## Suggested first exercises

1. Change only `panel_color` and `seam_color` in the Inspector, then observe which parts are albedo and which are emission.
2. Replace the hash-driven window selection with a uniform window pattern to understand the UV cell math.
3. Expose a `uniform float window_threshold` and use it instead of the hard-coded `0.52` value.
4. Make the pulse travel upward by using `local_position.y` rather than only the per-cell phase.
5. Duplicate the material for three buildings and give each a different `pulse_speed`, `cyan_color`, or `magenta_color`.
6. Add a simple texture lookup only after the procedural version is stable, then compare texture-driven and procedural panel details.

## Tuning recommendations

- Start with `emission_strength` between `1.5` and `3.0`; increase it only after Glow is configured.
- Keep `seam_width` and `accent_width` small relative to the UV cell. Large values erase the dark panel read.
- Adjust `panel_scale` to the mesh's UV layout rather than forcing one value across unrelated meshes.
- Use `pulse_speed` below `2.0` for a readable architectural rhythm. Faster motion can look like noise.
- Use `scanline_strength` sparingly. It should support the silhouette and windows, not flatten the material into a full-screen effect.
- Tune `ROUGHNESS` against the scene lights. A dark building still needs enough reflected structure to remain legible.

## Godot 4 version caveat

Godot 4 minor versions, renderers, import settings, and editor UI can change available shader features or the location and naming of material controls. Before sharing this material or building on it, test the shader in the project's exact Godot version and renderer, confirm the `source_color` hints and `set_shader_parameter()` calls, and check current official references for `spatial` built-ins, Glow, and render modes. This page intentionally labels that live-doc verification limitation instead of inventing version-specific citations.
