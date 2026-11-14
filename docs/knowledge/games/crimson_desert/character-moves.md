# Crimson Desert Character Moves and Skills

Last checked: 2026-11-13 | Base game patch: 2.05.00 | Evidence: official for system-level combat; community skill index for names, unlocks, and default inputs | Return to the [index](README.md)

Researched catalogue, not an exhaustive one. No complete move list, skill index, or official button mapping was found. The community Pywel skill database claims 179 skills, but only a handful of individual skill names were carried into the research, so this page lists those and is far from a full skill table.

## Catalogue status

| Measure | Value |
|---|---|
| Item-level entries on this page | 11 named skill or move rows, 4 unlock-route rows, 3 default-input rows (18 rows) |
| Source-reported sizes | Pywel Skills: 179 skills, filterable by Kliff, Damiane, Oongka, and unlock method |
| Method | Skill names and unlock routes from the Pywel skills database; inputs from the Pywel controls guide; patch corrections from Pearl Abyss 2.05.00 notes |
| Complete? | No. The parsed index has repeated generic labels, some unlock paths are left as "meet certain conditions" or undocumented, the 179 total is not an independently verified unique-move count, and Pywel's patch history stops at 1.14 (July) |

Sources: [PYWEL-SKILLS], [PYWEL-CONTROLS], [PYWEL-PATCHES], [PATCH-2.05.00].

## Combat system (official, broad)

Combat is a flexible action system that combines weapons, unarmed attacks, kicks, grapples, dodges, counters, slides, and ranged weapons. Listed weapon families: swords, spears, greatswords, axes, dual wielding, and ranged options. Each playable character has distinct combat styles, weapons, and skills ([STEAM-BASE]). Weapon detail is in [weapons.md](weapons.md).

## Move categories

| Category | Status | Source |
|---|---|---|
| Weapon attacks (sword, spear, greatsword, axe, dual wield, ranged) | Verified, system level | [STEAM-BASE] |
| Unarmed attacks | Verified | [STEAM-BASE] |
| Kicks | Verified | [STEAM-BASE] |
| Grapples | Verified | [STEAM-BASE] |
| Dodges, slides | Verified | [STEAM-BASE] |
| Counters | Verified | [STEAM-BASE] |

## Named skills and moves (11 entries)

Availability: Base unless stated (the sources do not tag most skills; post-launch additions are marked). Confidence: Reported (community index or guide) unless Verified is stated.

| # | Name | Character | Unlock or prerequisite | Effect or use | Availability | Source |
|---|---|---|---|---|---|---|
| 1 | Force Palm | Not stated | Not stated; also appears among early skills in the IGN guide | Traversal and puzzle uses; used to subdue DLC mounts Shark and Orca | Base | [IGN-SKILLS], [IGN-TIPS], [APP-DLC-UNDERWATER] |
| 2 | Axiom Force | Damiane and Oongka | Post-launch addition; unlock path not documented | Not captured | Post-launch (version not stated) | [PYWEL-SKILLS] |
| 3 | Nature's Snare | Not stated | Post-launch addition; unlock path not documented | Not captured | Post-launch (version not stated) | [PYWEL-SKILLS] |
| 4 | Evasive Slash | Not stated | Unlocked by Armed Combat upgrades | Not captured | Base | [PYWEL-SKILLS] |
| 5 | Skystep | Damiane | Not stated | 2.05.00 corrected its description to match its actual requirements (Verified) | Base | [PATCH-2.05.00] |
| 6 | Vertical Flight | Oongka | Not stated | 2.05.00 corrected its description to match its actual requirements (Verified) | Base | [PATCH-2.05.00] |
| 7 | Unarmed skills (group) | Damiane | Added in 1.07.00 | Unarmed combat skills (Verified, digest) | Base (post-launch) | [UPDATE-HIGHLIGHTS] |
| 8 | New skills per playable character (group) | Kliff, Damiane, Oongka | Added in 1.03.00; individual skills not named (Verified, digest) | Not captured | Base (post-launch) | [UPDATE-HIGHLIGHTS] |
| 9 | Story-learned skills (group) | Not stated | Learned during named chapters per Pywel; skill and chapter names not captured | Not captured | Base | [PYWEL-SKILLS] |
| 10 | Armed Combat upgrades (group) | Not stated | Prerequisite of Evasive Slash | Not captured | Base | [PYWEL-SKILLS] |
| 11 | Horse summon | Not stated | Not stated | Summons a mount; default input in the table below | Base | [PYWEL-CONTROLS] |

The actual requirements of Skystep and Vertical Flight were not stated. Which character owns Force Palm, Nature's Snare, and Evasive Slash is not stated.

## Unlock routes (4 entries)

Pywel identifies four unlock routes. Source: [PYWEL-SKILLS]; the IGN and PlayStation sources support the first and part of the third.

| # | Route | Detail | Source |
|---|---|---|---|
| 1 | Abyss Artifacts | Unlock or upgrade skills and stats (guide); the PlayStation preview says they unlock abilities | [PYWEL-SKILLS], [IGN-SKILLS], [PS-BLOG] |
| 2 | Default availability | Available without an unlock step | [PYWEL-SKILLS] |
| 3 | Watch & Learn | Some abilities can be learned by observing them (guide-reported) | [PYWEL-SKILLS], [IGN-SKILLS] |
| 4 | Story progression | Skills learned during named chapters | [PYWEL-SKILLS] |

## Default inputs (3 entries)

From the Pywel controls guide, which gives PS5, Xbox, and keyboard/mouse mappings. It is a general control table, not a per-skill input catalogue. These are default mappings; remapping and platform settings change them, and 2.05.00 changed at least one housing input. Source: [PYWEL-CONTROLS].

| # | Action | Controller | Keyboard and mouse |
|---|---|---|---|
| 1 | Force Palm | R3 | Middle Mouse |
| 2 | Axiom Force | L3 | Tab |
| 3 | Horse summon | D-pad Up | H |

## How skills are acquired

- Abyss Artifacts unlock or upgrade skills and stats (guide-reported; the PlayStation preview also says they unlock abilities).
- Some abilities can be learned by observing them (guide-reported).
- See [systems-progression.md](systems-progression.md) for the progression model.

Sources: [IGN-SKILLS], [PS-BLOG].

## Controls history (official digest, selective)

| Version | Change |
|---|---|
| 1.00.00 | Improved controls |
| 1.04.00 | Keyboard/mouse and controller presets |
| 1.09.00 | Controller remapping |

Source: [UPDATE-HIGHLIGHTS]. Known Issues (2026-11-13) reports an evasion remapping issue when Evasion Control is set to Hold ([KNOWN-ISSUES]).

## Coverage limitations

- 11 skill rows against a claimed 179 skills; no full list of skills per character, costs, or prerequisites.
- Skill trees are described only as separate per character (guide).
- Exact per-move inputs, character variants, and costs are not established; the three default inputs are the only ones captured.
- Pywel's records leave some unlock paths undocumented and repeat generic labels.

## Patch-sensitive caveats

- Skill prerequisites and descriptions have been corrected by patches (Skystep and Vertical Flight in 2.05.00); prefer in-game text over launch-era guides, which may predate patch 1.00.03 and later ([IGN-SKILLS], [IGN-TIPS]).
- Pywel's patch history stops at 1.14 (July), so its skill records may be stale; use official notes for current behavior.
- Control presets and remapping options changed after launch; default inputs need a version and device qualifier.

## Related documents

[Characters and factions](characters-factions.md) | [Weapons](weapons.md) | [Bosses](bosses.md) | [Systems and progression](systems-progression.md)

[STEAM-BASE]: https://store.steampowered.com/app/3321460/Crimson_Desert_Enhanced/
[PS-BLOG]: https://blog.playstation.com/2026/03/04/crimson-desert-hands-on-report-four-hours-in-the-rpgs-massive-open-world/
[IGN-SKILLS]: https://www.ign.com/wikis/crimson-desert/Best_Skills_to_Get_First
[IGN-TIPS]: https://www.ign.com/wikis/crimson-desert/Essential_Tips_and_Tricks
[UPDATE-HIGHLIGHTS]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=118
[PATCH-2.05.00]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=157
[KNOWN-ISSUES]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=68
[PYWEL-SKILLS]: https://www.pywel.app/en/database/skills/
[PYWEL-CONTROLS]: https://www.pywel.app/en/guides/controls/
[PYWEL-PATCHES]: https://www.pywel.app/en/patch-notes/
[APP-DLC-UNDERWATER]: https://www.crimsondesert.app/en/dlc/underwater
