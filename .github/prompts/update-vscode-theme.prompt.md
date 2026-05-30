---
name: update-vscode-theme
description: Update VS Code settings with a color palette for the current project or requested scope. Use when you want the editor surfaces recolored to match a palette, mood, or repository vibe.
argument-hint: "[Optional: palette name or hex colors, target scope (workspace, .code-workspace, or user settings), mood controls like darker/calmer/higher contrast, and any surfaces to prioritize.]"
agent: Implementation Agent
---

Update VS Code settings with a coherent color palette.

Use this prompt when the user wants to recolor VS Code for the current project, a specific workspace file, or user settings.

Multiple repositories:
- If the user specifies a collection of repositories or workspace folders, assign each repository a distinct palette unless the user explicitly asks for a shared theme or provides a per-repository mapping.
- When no per-repository palette is provided, infer a fitting palette for each repository from its own README, Copilot instructions, or nearest durable docs instead of reusing the first repository's colors everywhere.
- Keep the palettes visually separable at a glance. Favor clearly different title bar, activity bar, status bar, and editor background combinations.
- If the user specifies one palette family for the whole collection, keep a consistent family but vary the dominant accents enough to distinguish repositories.

Default ownership:
- Prefer workspace-local settings in `.vscode/settings.json`.
- If the user explicitly asks for an open `.code-workspace` file or user settings, target that scope instead.
- Reuse and refine existing `workbench.colorCustomizations` when present instead of replacing unrelated settings.

Palette source:
- If the user provides a palette, theme name, or hex colors, use that as the source of truth.
- If no palette is specified, inspect the repository vibe before inventing one. Read only enough context to choose a fitting palette, in this order:
  1. `README.md`
  2. `.github/copilot-instructions.md`
  3. One or two nearby durable docs or folder READMEs that best reflect the active project area
- Keep the scan narrow. Stop once you can justify one palette direction.

Mood controls:
- If the user gives modifiers such as darker, lighter, calmer, higher contrast, or neon-heavy, translate them into palette adjustments rather than asking for a full palette.
- Keep contrast readable, but optimize for the requested feel.

Core execution path:
1. Identify the target settings file and read only enough of it to find the existing color customization surface.
2. Form one local hypothesis about whether the current workspace already owns the relevant colors or whether you need to create the settings file.
3. If the request spans multiple repositories, plan the palette set first so the repositories end up distinct rather than drifting into minor variations of the same colors.
4. Apply the smallest coherent palette update that affects the most visible VS Code surfaces.
5. Cover the main editor surfaces explicitly so the blank editor area is not left at the theme default when the user expects it to change.
6. Prefer built-in-safe customization through `workbench.colorCustomizations`. Do not require an extension unless the user explicitly asks for one.
7. Do not add `workbench.colorTheme` unless the user explicitly asks to pin a base theme.

Concrete settings to consider:
- `window.titleBarStyle` when custom title bar coloring is needed
- `workbench.colorCustomizations.titleBar.activeBackground`
- `workbench.colorCustomizations.titleBar.activeForeground`
- `workbench.colorCustomizations.titleBar.inactiveBackground`
- `workbench.colorCustomizations.titleBar.inactiveForeground`
- `workbench.colorCustomizations.activityBar.background`
- `workbench.colorCustomizations.activityBar.foreground`
- `workbench.colorCustomizations.activityBar.activeBorder`
- `workbench.colorCustomizations.activityBarBadge.background`
- `workbench.colorCustomizations.activityBarBadge.foreground`
- `workbench.colorCustomizations.sideBar.background`
- `workbench.colorCustomizations.sideBar.foreground`
- `workbench.colorCustomizations.sideBar.border`
- `workbench.colorCustomizations.sideBarTitle.foreground`
- `workbench.colorCustomizations.sideBarSectionHeader.background`
- `workbench.colorCustomizations.sideBarSectionHeader.foreground`
- `workbench.colorCustomizations.editorGroupHeader.tabsBackground`
- `workbench.colorCustomizations.editorGroupHeader.tabsBorder`
- `workbench.colorCustomizations.editorGroup.emptyBackground`
- `workbench.colorCustomizations.tab.activeBackground`
- `workbench.colorCustomizations.tab.activeForeground`
- `workbench.colorCustomizations.tab.activeBorderTop`
- `workbench.colorCustomizations.tab.inactiveBackground`
- `workbench.colorCustomizations.tab.inactiveForeground`
- `workbench.colorCustomizations.editor.background`
- `workbench.colorCustomizations.editor.lineHighlightBackground`
- `workbench.colorCustomizations.editorCursor.foreground`
- `workbench.colorCustomizations.editor.selectionBackground`
- `workbench.colorCustomizations.editor.inactiveSelectionBackground`
- `workbench.colorCustomizations.editorIndentGuide.activeBackground1`
- `workbench.colorCustomizations.editorIndentGuide.background1`
- `workbench.colorCustomizations.statusBar.background`
- `workbench.colorCustomizations.statusBar.foreground`
- `workbench.colorCustomizations.statusBar.border`
- `workbench.colorCustomizations.statusBar.debuggingBackground`
- `workbench.colorCustomizations.statusBar.debuggingForeground`
- `workbench.colorCustomizations.panel.background`
- `workbench.colorCustomizations.panel.border`
- `workbench.colorCustomizations.panelTitle.activeForeground`
- `workbench.colorCustomizations.panelTitle.activeBorder`
- `workbench.colorCustomizations.panelTitle.inactiveForeground`
- `workbench.colorCustomizations.focusBorder`
- `workbench.colorCustomizations.list.hoverBackground`
- `workbench.colorCustomizations.list.activeSelectionBackground`
- `workbench.colorCustomizations.list.activeSelectionForeground`
- `workbench.colorCustomizations.list.highlightForeground`
- `workbench.colorCustomizations.button.background`
- `workbench.colorCustomizations.button.foreground`
- `workbench.colorCustomizations.button.hoverBackground`
- `workbench.colorCustomizations.input.background`
- `workbench.colorCustomizations.input.foreground`
- `workbench.colorCustomizations.input.border`
- `workbench.colorCustomizations.dropdown.background`
- `workbench.colorCustomizations.dropdown.foreground`
- `workbench.colorCustomizations.dropdown.border`
- `workbench.colorCustomizations.terminal.background`
- `workbench.colorCustomizations.terminal.foreground`
- `workbench.colorCustomizations.terminalCursor.background`
- `workbench.colorCustomizations.terminalCursor.foreground`
- `workbench.colorCustomizations.terminal.ansiBlack`
- `workbench.colorCustomizations.terminal.ansiRed`
- `workbench.colorCustomizations.terminal.ansiGreen`
- `workbench.colorCustomizations.terminal.ansiYellow`
- `workbench.colorCustomizations.terminal.ansiBlue`
- `workbench.colorCustomizations.terminal.ansiMagenta`
- `workbench.colorCustomizations.terminal.ansiCyan`
- `workbench.colorCustomizations.terminal.ansiWhite`
- `workbench.colorCustomizations.terminal.ansiBrightBlack`
- `workbench.colorCustomizations.terminal.ansiBrightRed`
- `workbench.colorCustomizations.terminal.ansiBrightGreen`
- `workbench.colorCustomizations.terminal.ansiBrightYellow`
- `workbench.colorCustomizations.terminal.ansiBrightBlue`
- `workbench.colorCustomizations.terminal.ansiBrightMagenta`
- `workbench.colorCustomizations.terminal.ansiBrightCyan`
- `workbench.colorCustomizations.terminal.ansiBrightWhite`

Required baseline:
- At minimum, explicitly cover the title bar, activity bar, side bar, editor tabs, `editor.background`, `editorGroup.emptyBackground`, selection and line highlight colors, status bar, and panel.
- Include terminal colors when they help the palette feel coherent or when the user asks for a fuller theme treatment.

Suggestion approval:
- If you want to add optional augmentations beyond the user request, such as extra terminal styling, more aggressive accent coverage, or a second preset variant, ask for approval first with `#askQuestions`.
- Keep that approval step short and present the augmentations as explicit options.

Validation:
- After the first substantive edit, immediately run the narrowest validation available on the touched settings file.
- Confirm JSON or diagnostics are clean.
- If the editor does not repaint all surfaces, mention that reloading the VS Code window may be needed.

Response expectations:
1. State the target settings scope you changed.
2. Briefly explain the palette source, whether user-provided or inferred from the project vibe.
3. If multiple repositories were involved, summarize how each repository was differentiated.
4. Summarize the key surfaces updated.
5. Report the validation result.
6. Mention reload guidance only when it is relevant.

Keep the workflow task-scoped. Do not turn this into a standing persona, a tool-policy prompt, or a bundled skill unless the workflow later needs reusable palette assets or templates.