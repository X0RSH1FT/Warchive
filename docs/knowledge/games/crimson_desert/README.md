# Crimson Desert Knowledge Base

Last checked: 2026-11-13 | Base game patch: 2.05.00 | Platforms: PS5, Xbox Series X|S, Steam (PC and Mac), Epic Games Store, Mac App Store (rollout of 2.05.00 on the Mac App Store was still in progress on the check date)

Source-backed reference notes on *Crimson Desert* (Pearl Abyss) for humans and coding agents. Every claim links to a source and carries an evidence status. Most pages now hold item-level, name-by-name tables, but they are researched catalogues, not exhaustive databases: the research found no official manual or complete database, and the community indexes it relied on disagree on counts. Each catalogue page states its researched entry count, the source-reported index sizes, its method, and why it cannot be called complete.

## Documents

| Document | Covers | Evidence strength |
|---|---|---|
| [overview.md](overview.md) | Premise, release, editions, platforms, preorder and Deluxe Pack availability, base game versus DLC | High (official); entitlement mostly not established |
| [characters-factions.md](characters-factions.md) | Kliff, Oongka, Damiane, factions, named NPCs, vendors, NPC and shop index counts, Trust and romance | High for basics; medium for timing; counts reported |
| [systems-progression.md](systems-progression.md) | Progression model, camp, housing, DLC feature inventory, patch timeline | Mixed |
| [quests.md](quests.md) | Quest counts and conflicts, 13 chapter titles, 30 quest-entry rows (23 individually named), DLC quest-title evidence | Medium; partial |
| [locations.md](locations.md) | 18 DLC islands, 9 puzzle locations, named places | Partial |
| [bosses.md](bosses.md) | Boss system facts, 20 named encounters, count conflicts | Partial |
| [character-moves.md](character-moves.md) | Combat system, named skills, unlock routes, default inputs | High (system level); partial |
| [weapons.md](weapons.md) | Weapon families, 14 DLC weapons, recipe-listed weapons, life tools | Partial |
| [armor.md](armor.md) | 12 DLC sets, 5 accessories, named pieces | Partial |
| [equipment-enhancements.md](equipment-enhancements.md) | Enhancement levels, Abyss Gear catalogue, refinement evidence | Low to medium detail |
| [items-materials.md](items-materials.md) | Item index counts, named items and materials | Partial |
| [item-name-catalogue.md](item-name-catalogue.md) | Raw community item-name export (6,325 source rows) joined to item-limits metadata, reproduced as-is | Community snapshot; unverified, uncategorized, not complete game coverage |
| [recipes-crafting.md](recipes-crafting.md) | Crafting stations and recipe fragments | Partial |
| [collectibles-resources.md](collectibles-resources.md) | Collectible subtypes, knowledge categories, DLC markers, activities | Counts only; partial |
| [mounts.md](mounts.md) | Mount types, base and DLC mounts (19 individually named across mounts and ships), ships | Partial |
| [pets.md](pets.md) | Pet categories, DLC pets, pet gear | Partial |
| [sources.md](sources.md) | Source register with URLs, dates, reliability, count conflicts | n/a |

## Catalogue status

Research snapshot 2026-11-13, base game patch 2.05.00. "Researched entries" counts rows in the page's catalogue tables, split into individually named, grouped or category, and index-count rows where a page mixes them; "index counts" are what the cited third-party indexes claim, which this knowledge base does not verify and never adds to the researched rows. **No catalogue is claimed complete.**

| Catalogue | Page | Researched entries | Source-reported index counts | Why it is not exhaustive |
|---|---|---:|---|---|
| Weapons | [weapons.md](weapons.md) | 30 | 707 (Gaming.tools); 557 claimed, 240 exposed (CrimsonDesert.app); 483 over 5 pages (VULKK Weapons); 14 DLC-index weapons | Base weapons not itemized; counts conflict; base and post-launch additions not separable |
| Armor, outfits, accessories | [armor.md](armor.md) | 21 | Armor 2,257 (1,662 "Damaged Gear") in Gaming.tools; Accessories 84; VULKK Armor 700 over 7 pages, Accessories 88; 12 DLC sets | Sets lack piece lists and stats; Game8 guide blocked; VULKK rows not itemized |
| Abyss Gear and refinement | [equipment-enhancements.md](equipment-enhancements.md) | 12 | Abyss 499 (376 itemized subcategory total) in Gaming.tools; 209 over 3 pages (VULKK Abyss Gear); 52 of 1,065 Abyss Artifact sources shown | No cost table or socket catalogue; subcategory gap unexplained |
| Items and materials | [items-materials.md](items-materials.md) | 19 | 5,338 (VULKK); 11 Gaming.tools categories; VULKK Materials 108, Alchemy 82 | Categories overlap; item tables truncated; search-only totals conflict; VULKK rows not itemized |
| Item names (raw community export) | [item-name-catalogue.md](item-name-catalogue.md) | None curated; 6,325 source rows reproduced unmodified, not counted as researched entries | 6,325 item records with unique itemKey values; 5,892 matched to item-limits metadata, 433 names-only, 7 metadata-only IDs, 0 duplicates; 5,899 limits records ([ITEM-NAMES-JSON], [ITEM-LIMITS-JSON]) | 6,325 is the number of rows in one community snapshot, not a count of all game items; mixed provenance; numeric category and slot codes are uninterpreted because the repository's schema TODO lists category offsets as unresolved |
| Recipes | [recipes-crafting.md](recipes-crafting.md) | 23 | About 100 cooking recipes (RPS); 700 Crafting Manuals (Gaming.tools); VULKK Cooked Food 331, Blueprints 89 (item-index counts) | No recipe listed in full; no cooking recipe or blueprint names captured |
| Collectibles, resources, activities | [collectibles-resources.md](collectibles-resources.md) | 42 | 264 collectible records; 161 Gatherables; 901 DLC markers | Subtype and category counts only; no individual collectible, fish, or gatherable names |
| Quests | [quests.md](quests.md) | 43 rows (13 chapter titles, 30 quest entries of which 23 are individually named) | 680 tracker records; 636, 1,142, 482, 46, 39 in other sources | Tracker exposed part of its catalogue; counts conflict; most rows lack giver, reward, and unlock |
| Locations | [locations.md](locations.md) | About 46 distinct places (62 rows with overlap) | 14,300+ and 901 markers; 18 versus 17 islands | Markers are not places; no settlement or dungeon catalogue; no coordinates |
| Bosses | [bosses.md](bosses.md) | 20 | 104, 57, 87; search snippets 75, 88, 127 | Counts unreconciled; directory mixes DLC, variants, and elite records |
| Skills and moves | [character-moves.md](character-moves.md) | 18 rows (11 skills) | 179 skills claimed (Pywel) | Most skill names not captured; unlock paths partly undocumented |
| Mounts and ships | [mounts.md](mounts.md) | 28 rows (19 individually named, 4 group or category, 5 mount-type) | 63 (VULKK); 49 (Gaming.tools) | Different taxonomies; base list predates DLC; two DLC acquisitions unresolved |
| Pets | [pets.md](pets.md) | 14 | 86 (VULKK) | Only two pets named from the index; no per-entry acquisition |
| NPCs, factions, shops | [characters-factions.md](characters-factions.md) | 24 rows (3 playable characters, 8 faction and group, 6 named NPC, 3 vendor, 4 index-count) | 465 NPCs; 510 People; 139 Factions; 265 shops | Index rows not exported; duplicates and generic records |
| Systems, housing, DLC features | [systems-progression.md](systems-progression.md) | About 48 rows | 17 residences claimed, 15 named; 265 shops | Housing building lists not carried into the research; digest skips versions |

## Conventions

| Label | Meaning |
|---|---|
| Verified | Stated by an official or publisher-authored source |
| Reported | Stated by a named guide; attributed and dated, may predate patches |
| Moderate / Medium | Reputable secondary or preview source, not confirmed in current official material |
| Unverified | Fan-maintained, prerelease, inaccessible, or inconsistent; recorded only as a lead or flagged as excluded |
| Not stated | The sources are silent; nothing is assumed |

- Source labels such as `[PATCH-2.05.00]` are clickable links defined at the bottom of each page and listed in [sources.md](sources.md).
- Each page has Coverage limitations and Patch-sensitive caveats sections.
- Catalogue pages carry a Catalogue status table (entries, index counts, method, completeness) and use the availability values Base, DLC, and Not stated; DLC is never merged into Base silently.

## Global coverage limitations

- No official player manual, atlas, boss database, item database, or complete control map was found.
- Several guide sites (parts of IGN, Fextralife, Fandom, Game8, GamesRadar) were inaccessible or unusable during research; gaps are not evidence of absence.
- Official digests are selective and combine categories (for example 120 mounts and pets, 70 outfits/equipment/items).
- Stats, drop rates, costs, and recipes are documented only where a community record gave them (for example DLC weapon ATK at +10, Ambergris drop chances); most rows state "Not stated".
- Community index and marker counts disagree and are quoted only as attributed claims; DLC guides were updated 2026-11-10, before patch 2.05.00.
- URLs were taken from the research reports and not re-fetched while this knowledge base was written. A later correction pass added the VULKK category index links; web research could read those index pages and sample entries, but full extraction abbreviated rows and a direct API request was blocked by a Cloudflare JavaScript challenge that was not bypassed, and a raw VULKK HTML request returned HTTP 403 with no challenge bypassed. The only bulk export in this knowledge base is the community item-name snapshot in [item-name-catalogue.md](item-name-catalogue.md); it is not a complete or authoritative inventory of any catalogue.

## Patch-sensitive material

- Current patch at the check date: 2.05.00 (2026-11-13). Re-check later notices before relying on any statement.
- Live issues (updated 2026-11-13) affect Greymane faction quests for Damiane and Oongka, summoned mounts after Garden of Trials, and evasion remapping with Hold; see [KNOWN-ISSUES].
- Mismatched base-game and DLC versions can crash the game.
- Base game, the Enhanced edition, and the Charting the Unknown DLC are distinct; see [overview.md](overview.md).

## Notes for agents

1. Prefer official patch notes over guides when they conflict.
2. Do not present partial lists as complete; use the phrase "researched catalogue" and cite the page's Catalogue status.
3. Quote index counts (for example 104 bosses, 707 weapons) only as claims of a named source, and do not total or reconcile conflicting counts.
4. When a fact is missing, say it is not stated rather than inferring it.

[KNOWN-ISSUES]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=68
[ITEM-NAMES-JSON]: https://raw.githubusercontent.com/NattKh/CrimsonDesertCommunityItemMapping/main/item_names.json
[ITEM-LIMITS-JSON]: https://raw.githubusercontent.com/NattKh/CrimsonDesertCommunityItemMapping/main/data/item_limits.json
