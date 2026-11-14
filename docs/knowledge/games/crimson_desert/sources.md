# Crimson Desert Source Register

Last checked: 2026-11-13 | Base game patch referenced: 2.05.00 | Scope: all documents in this folder

This register defines the source labels used across the knowledge base. Each document repeats the clickable URLs it relies on at the bottom of the file; this page adds authority, date, and reliability notes. Return to the [index](README.md).

## How sources were obtained

- Facts come from five research reports compiled on 2026-11-13: a world/gameplay inventory and an equipment report (first pass), then three catalogue-oriented reports covering (1) gear and materials, (2) quests, locations, and bosses, and (3) moves, mounts, pets, and adjacent systems. All are session-local artifacts and are not committed or linked in this repository, so their text cannot be re-checked here. The [provenance notes](#provenance-notes-recorded-2026-11-13) below record which cited source each sampled claim was attributed to.
- The three catalogue reports each state that they could not establish a complete, reconciled catalogue and none produced a saved artifact file; they were read in full before the catalogue pages were written.
- The URLs below were taken from those reports. They were not re-fetched while writing the original documents, so page content may have changed since 2026-11-13. The URLs added in the correction pass (VULKK category indexes, OFF-EDITIONS, STEAM-DELUXE, and the DLC quest-title pages) were supplied from separate web research, which could inspect archive counts and sample pages only.
- The world/gameplay report tagged claims with numbers (S1-S15) that do not match the numbering of its own source list. Labels here were assigned by matching each claim to the source it describes. Where the report's tag could refer to either the official DLC page or the Steam DLC listing, both are cited.
- The researchers could not access an official player manual, and several guide sites (parts of IGN, Fextralife, Fandom, Game8, GamesRadar) redirected to advertising pages or failed extraction. Absence of an entry in these documents does not mean the game lacks it.
- Correction pass (2026-11-13): web research added the VULKK category and subcategory index URLs, the official editions notice, the Steam Deluxe Pack page, and four DLC quest-title pages. It could inspect archive counts and sample entry pages, but full page extraction abbreviated rows. A direct API GET to VULKK was blocked by a Cloudflare JavaScript challenge and was not bypassed. No complete exported inventory exists for any catalogue here, and no individual VULKK entry URL is cited because none was established from the inspected sources.
- Item-name export pass (2026-11-13): the raw community `item_names.json` and `item_limits.json` files were retrieved and tabulated in [item-name-catalogue.md](item-name-catalogue.md); the counts (6,325 item records with unique itemKey values, 5,892 matched, 433 names-only, 7 metadata-only IDs, zero duplicates) were verified with PowerShell on that file. A raw VULKK HTML request returned HTTP 403 and no challenge was bypassed.

## Provenance notes (recorded 2026-11-13)

These notes record the attribution made in this knowledge base, not an independent check. The cited pages were not re-fetched and the report passages are not available in this repository, so no quotation or external verification is claimed. Only claims with a stated source label are listed.

| Claim as documented | Attributed source label | Document |
|---|---|---|
| Defeating Leviakan grants its scale | PATCH-2.04.08 | [items-materials.md](items-materials.md) |
| Leviakan's Scales acquirable on Bergel Island after the boss | PATCH-2.05.00 | [items-materials.md](items-materials.md) |
| Additional ambergris placed near giant whale bones at Seafloor Plain | PATCH-2.05.00 | [items-materials.md](items-materials.md) |
| Diving Helm and Suit craftable at a Crafting Station; ingredients not listed | PATCH-2.05.00 | [items-materials.md](items-materials.md), [armor.md](armor.md) |
| Preorder and Deluxe bonus items claimed through the Add-on menu on Xbox | XBOX-NOTICE | [items-materials.md](items-materials.md) |
| DLC weapons (14), armor sets (12), accessories (5), Abyss Gear (4) | APP-DLC-ITEMS (index updated 2026-11-10; weapon values at +10) | [weapons.md](weapons.md), [armor.md](armor.md), [equipment-enhancements.md](equipment-enhancements.md) |
| Eastern Witch's Fan stats and recipe | GT-WINGFAN | [weapons.md](weapons.md), [recipes-crafting.md](recipes-crafting.md) |
| Aeserion weapon recipes (10) and Abyssal Fusion | GT-AESERION | [weapons.md](weapons.md), [recipes-crafting.md](recipes-crafting.md) |
| Ancient Reckoning Abyss Gear recipe and socket behavior | GT-PRIMUS | [equipment-enhancements.md](equipment-enhancements.md) |
| Abyss Artifact refinement use; 52 of 1,065 sources shown | GT-ARTIFACT | [items-materials.md](items-materials.md) |
| Ambergris sell price, stack size, drop sources | GT-AMBERGRIS | [items-materials.md](items-materials.md) |
| Item category counts (Weapons 707, Armor 2,257, and so on) | GT-ITEMS | [items-materials.md](items-materials.md) |
| Quest counts (680 tracker records by category) and tracker quest names | APP-QUEST-TRACKER | [quests.md](quests.md) |
| Chapter titles (Prologue plus 12 chapters) | GAME8-MAIN-QUESTS (updated 2026-10-27) | [quests.md](quests.md) |
| Main-quest names, chapters, regions | FEX-MAIN-QUESTS (last edited 2026-05-15) | [quests.md](quests.md), [locations.md](locations.md) |
| 18 DLC island names and 9 Ocean Ruins puzzle locations | APP-DLC-ISLANDS (updated 2026-11-10) | [locations.md](locations.md) |
| Boss directory names and the 104 versus 57 count conflict | APP-BOSSES, FAN-BOSS | [bosses.md](bosses.md) |
| Skill unlock routes, named skills, 179-skill claim | PYWEL-SKILLS | [character-moves.md](character-moves.md) |
| Default inputs for Force Palm, Axiom Force, horse summon | PYWEL-CONTROLS | [character-moves.md](character-moves.md) |
| Base-game mount names and three locations | FEX-MOUNTS (last edited 2026-06-06) | [mounts.md](mounts.md) |
| Seven DLC underwater mounts | APP-DLC-UNDERWATER (updated 2026-11-10) | [mounts.md](mounts.md) |
| Legendary and purchasable DLC ships | APP-DLC-SHIPS (updated 2026-11-10) | [mounts.md](mounts.md) |
| Pet index count (86), Dalmatian and Baby Dalmatian DLC tags | VULKK-PETS | [pets.md](pets.md) |
| Collectible subtype counts (264 records) and knowledge category counts | GT-COLLECTION, GT-KNOWLEDGE | [collectibles-resources.md](collectibles-resources.md) |
| Great Ocean map marker counts (901 total) | APP-DLC, APP-MAP-OCEAN | [collectibles-resources.md](collectibles-resources.md) |
| 17 residences claimed, 15 named | APP-DLC-HOUSING | [systems-progression.md](systems-progression.md) |
| VULKK category and subcategory archive totals (Weapons 483, Armor 700, Accessories 88, Materials 108, Alchemy 82, Abyss Gear 209, Cooked Food 331, Blueprints 89); third-party source-reported, not game-verified | VULKK-WEAPONS, VULKK-ARMOR, VULKK-ACCESSORIES, VULKK-MATERIALS, VULKK-ALCHEMY, VULKK-ABYSS-GEAR, VULKK-COOKED-FOOD, VULKK-BLUEPRINTS | [items-materials.md](items-materials.md), [weapons.md](weapons.md), [armor.md](armor.md), [equipment-enhancements.md](equipment-enhancements.md), [recipes-crafting.md](recipes-crafting.md) |
| Khaled preorder, Grotevant PS5 bonus, and Kairos/Balgran/Exclaire Deluxe Pack listed separately | OFF-EDITIONS | [overview.md](overview.md#editions-preorders-and-dlc-availability) |
| Deluxe Pack separately purchasable on Steam | STEAM-DELUXE | [overview.md](overview.md#editions-preorders-and-dlc-availability) |
| "Beyond the Margins" named in patch notes and by IGN | PATCH-2.05.00, IGN-BEYOND-MARGINS | [quests.md](quests.md) |
| "From the Ashes" named by IGN and Game8 (third-party only) | IGN-FROM-ASHES, GAME8-FROM-ASHES | [quests.md](quests.md) |
| "Forged Resolve" named by Game8 (third-party only) | GAME8-FORGED-RESOLVE | [quests.md](quests.md) |
| 6,325 item-name rows joined to item-limits metadata (5,892 matched, 433 names-only, 7 metadata-only IDs); community snapshot, not game-verified | ITEM-NAMES-JSON, ITEM-LIMITS-JSON, ITEM-MAPPING-REPO | [item-name-catalogue.md](item-name-catalogue.md), [items-materials.md](items-materials.md) |

## Reliability tiers

| Tier | Meaning | Labels |
|---|---|---|
| Official / publisher | Pearl Abyss notices and pages, publisher-authored store listings | OFF-SITE, OFF-DLC, STEAM-BASE, STEAM-DLC, STEAM-DLC-LIST, STEAM-NEWS, PATCH-2.05.00, PATCH-2.04.08, PATCH-2.04.07, PATCH-2.04.00, DLC-ANNOUNCE, KNOWN-ISSUES, UPDATE-HIGHLIGHTS, FEATURES-2, XBOX-NOTICE, OFF-EDITIONS, STEAM-DELUXE |
| Platform-owner preview | Platform-owner hands-on article, prerelease | PS-BLOG |
| Reputable guide | Secondary guide; dated; may predate patches | IGN-WALKTHROUGH, IGN-TIPS, IGN-SKILLS, IGN-SIDE-BOSSES, IGN-HOUSING, IGN-ROMANCE, IGN-BEYOND-MARGINS, IGN-FROM-ASHES, GAME8-MAIN-QUESTS, GAME8-FROM-ASHES, GAME8-FORGED-RESOLVE, FEX-MAIN-QUESTS, FEX-MOUNTS, RPS-RECIPES |
| Community database or index (medium to low) | Searchable fan or community record sites with stated counts; readable but unofficial and often not deduplicated | GT-ITEMS, GT-KNOWLEDGE, GT-COLLECTION, GT-ARTIFACT, GT-AESERION, GT-WINGFAN, GT-PRIMUS, GT-AMBERGRIS, VULKK-ITEMS, VULKK-MOUNTS, VULKK-PETS, VULKK-NPCS, VULKK-SHOPS, VULKK-QUESTS, VULKK-WEAPONS, VULKK-ARMOR, VULKK-ACCESSORIES, VULKK-MATERIALS, VULKK-ALCHEMY, VULKK-ABYSS-GEAR, VULKK-COOKED-FOOD, VULKK-BLUEPRINTS, PYWEL-SKILLS, PYWEL-CONTROLS, PYWEL-PATCHES, ITEM-NAMES-JSON, ITEM-LIMITS-JSON, ITEM-MAPPING-REPO |
| Community / fan, low trust | Fan-maintained; completeness or counts unverified | FAN-MAP, FAN-BOSS, APP-HOME, APP-QUEST-TRACKER, APP-QUEST-INDEX, APP-MAP-OCEAN, APP-BOSSES, APP-WEAPONS, APP-DLC, APP-DLC-ITEMS, APP-DLC-ISLANDS, APP-DLC-UNDERWATER, APP-DLC-SHIPS, APP-DLC-HOUSING, FANDOM-WEAPONS, FANDOM-ITEMS |
| Not verified | Page could not be read; research lead only | GAME8-MOUNTS, GAME8-DLC-ARMOR |

## Official sources

| Label | Title and date | Used for | URL |
|---|---|---|---|
| PATCH-2.05.00 | Patch Notes Version 2.05.00, 2026-11-13 05:50 UTC | Current patch; changes to quests, locations, bosses, combat, mounts, housing, ships, management, items, equipment | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=157> |
| PATCH-2.04.08 | Patch Notes Version 2.04.08, 2026-11-06 | Leviakan scale reward; enhancement reset issue | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=152> |
| PATCH-2.04.07 | Patch Notes Version 2.04.07 (All Platforms Hotfix), 2026-11-05 | Nibrak Cloth Armor fix | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=151> |
| PATCH-2.04.00 | Patch Notes Version 2.04.00, 2026-10-29 | DLC update scope: story quests and their "Journey's End" requirement, ocean quest "A Wider World", ships, underwater mounts, new equipment, five combat-usable life tools, Garden of Trials, diving-suit refinement and Breath | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=140> |
| DLC-ANNOUNCE | Official DLC launch notice, 2026-10-29 | DLC release announcement (2026-10-29 22:00 UTC) | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=143> |
| KNOWN-ISSUES | Known Issues notice, last updated 2026-11-13 08:10 UTC | Live bugs and caveats | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=68> |
| UPDATE-HIGHLIGHTS | Update Highlights, 2026-08-12 | Selective digest of the first 17 patches; not a full change list | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=118> |
| FEATURES-2 | Features Overview #2: Combat and Progression, 2026-02-05 | Prerelease confirmation that combat, weapons, equipment upgrades, and progression are official features | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=58> |
| XBOX-NOTICE | Xbox DLC preorder / Twitch Drops notice (resolved), updated 2026-11-13 | Claim flow for bonus items on Xbox | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=155> |
| OFF-SITE | Official game site | Release, platforms, Enhanced messaging | <https://crimsondesert.pearlabyss.com/en-US/Main/Index> |
| OFF-DLC | Official Charting the Unknown page | DLC feature descriptions | <https://crimsondesert.pearlabyss.com/en-US/Game/DLC/charting-the-unknown> |
| STEAM-BASE | Steam listing, Crimson Desert Enhanced (publisher-authored) | Premise, characters, combat families, systems, mounts | <https://store.steampowered.com/app/3321460/Crimson_Desert_Enhanced/> |
| STEAM-DLC | Steam listing, Charting the Unknown (publisher-authored) | DLC release date (2026-10-29), base-game requirement, features | <https://store.steampowered.com/app/5001840/Crimson_Desert_Enhanced_Charting_the_Unknown/> |
| STEAM-DLC-LIST | Steam DLC listing for the base game | Charting the Unknown release 2026-10-29 at $24.99; separate Deluxe Pack from launch | <https://store.steampowered.com/dlc/3321460/Crimson_Desert/> |
| STEAM-NEWS | Steam news hub for the base game | Newest patch listing on the research date (2.05.00, 2026-11-13) | <https://store.steampowered.com/news/app/3321460> |
| OFF-EDITIONS | Official editions notice | Separates the Khaled preorder, the Grotevant PS5 bonus, and the Kairos, Balgran, and Exclaire Deluxe Pack | <https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=49> |
| STEAM-DELUXE | Steam listing, Crimson Desert Deluxe Pack (publisher-authored) | Deluxe Pack is separately purchasable | <https://store.steampowered.com/app/4024620/Crimson_Desert_Deluxe_Pack/> |

## Platform-owner and guide sources

| Label | Title and date | Used for | URL |
|---|---|---|---|
| PS-BLOG | PlayStation Blog hands-on report (four hours in), 2026-03-04 (preview) | Starting weapon, weapon families found, Abyss Artifact progression | <https://blog.playstation.com/2026/03/04/crimson-desert-hands-on-report-four-hours-in-the-rpgs-massive-open-world/> |
| IGN-WALKTHROUGH | IGN Walkthrough, updated 2026-06-12 | Chapter and major-quest structure, camp, difficulty | <https://www.ign.com/wikis/crimson-desert/Walkthrough> |
| IGN-TIPS | IGN Essential Tips and Tricks, updated 2026-03-23 | Inventory, skills, fast travel, crime, camp, pets, horses, food; playable-character timing | <https://www.ign.com/wikis/crimson-desert/Essential_Tips_and_Tricks> |
| IGN-SKILLS | IGN Best Skills to Get First, updated 2026-03-26 | Abyss Artifacts, observation learning, Force Palm | <https://www.ign.com/wikis/crimson-desert/Best_Skills_to_Get_First> |
| IGN-SIDE-BOSSES | IGN Side Boss Locations and Drops, updated 2026-06-30 | Discovered side bosses and quest links | <https://www.ign.com/wikis/crimson-desert/Side_Boss_Locations_and_Drops> |
| IGN-HOUSING | IGN Housing Guide, updated 2026-10-21 | Housing, storage, workstations; covers updates through 1.12 | <https://www.ign.com/wikis/crimson-desert/Housing_Guide> |
| IGN-ROMANCE | IGN Romance Guide, updated 2026-10-30 (still being updated) | DLC romance, marriage, Trust | <https://www.ign.com/wikis/crimson-desert/Romance_Guide> |
| GAME8-MAIN-QUESTS | Game8 main-quest index, updated 2026-10-27; self-described work in progress | Chapter titles (Prologue plus 12), 46 top-level entries | <https://game8.co/games/Crimson-Desert/archives/582136> |
| FEX-MAIN-QUESTS | Fextralife Main Quests table, last edited 2026-05-15 | Quest names with chapter, region, location | <https://crimsondesertgame.wiki.fextralife.com/Main_Quests> |
| FEX-MOUNTS | Fextralife Mounts page, last edited 2026-06-06 | Base-game mount names and locations; predates the DLC | <https://crimsondesertgame.wiki.fextralife.com/Mounts> |
| RPS-RECIPES | Rock Paper Shotgun cooking-recipes guide | "Nearly 100" recipes, "found so far", excludes quality variants | <https://www.rockpapershotgun.com/crimson-desert-all-cooking-recipes> |
| IGN-BEYOND-MARGINS | IGN Beyond the Margins Walkthrough | Title evidence for the DLC quest "Beyond the Margins" (third-party) | <https://www.ign.com/wikis/crimson-desert/Beyond_the_Margins_Walkthrough> |
| IGN-FROM-ASHES | IGN From the Ashes Walkthrough | Title evidence for the DLC quest "From the Ashes" (third-party) | <https://www.ign.com/wikis/crimson-desert/From_the_Ashes_Walkthrough> |
| GAME8-FROM-ASHES | Game8 guide for From the Ashes | Title evidence (third-party) | <https://game8.co/games/Crimson-Desert/archives/636164> |
| GAME8-FORGED-RESOLVE | Game8 guide for Forged Resolve | Only source for the title "Forged Resolve" (third-party) | <https://game8.co/games/Crimson-Desert/archives/636231> |

## Community databases and indexes (added 2026-11-13)

These sources supplied item-level names, counts, and fields for the catalogue pages. They are readable but unofficial, their counts are index-entry or marker counts, and several pages redirected to an ad-sync endpoint on a later fetch (for example the DLC item index). Handling: record names and fields as Reported with the source label; never treat a count as a verified total.

| Label | Description | Used for | URL |
|---|---|---|---|
| GT-ITEMS | Gaming.tools item index | Category counts: Abyss 499, Accessories 84, Armor 2,257, Collectibles 1,569, Consumables 397, Documents 1,918, Equipment 507, Materials 575, Miscellaneous 18, Special Equipment 380, Weapons 707 | <https://crimsondesert.gaming.tools/items> |
| GT-KNOWLEDGE | Gaming.tools Knowledge index | 95 categories; counts for Creatures, People, Collectibles, Crafting Manuals, Factions, Gatherables, Bosses, Quests, Mounts, Memory Fragments | <https://crimsondesert.gaming.tools/knowledge> |
| GT-COLLECTION | Gaming.tools Collectibles knowledge | 264 records in eight subtypes | <https://crimsondesert.gaming.tools/knowledge/collection> |
| GT-ARTIFACT | Gaming.tools item record: Abyss Artifact | Use for skills and refinement; source table truncated at 52 of 1,065 | <https://crimsondesert.gaming.tools/items/abyss_artifact> |
| GT-AESERION | Gaming.tools item record: Aeserion's Scale | Eleven recipes | <https://crimsondesert.gaming.tools/items/item_gimmick_snake_boss_scales_01> |
| GT-WINGFAN | Gaming.tools item record: Eastern Witch's Fan | Stats, recipe, vendor, +10 refinement | <https://crimsondesert.gaming.tools/items/witch_wingfan> |
| GT-PRIMUS | Gaming.tools item record: Abyss Gear (Ancient Reckoning) | Socket behavior, station, recipe, source | <https://crimsondesert.gaming.tools/items/item_skill_abyssgear_primus> |
| GT-AMBERGRIS | Gaming.tools item record: Ambergris | Sell price, stack, drop sources, recipe uses | <https://crimsondesert.gaming.tools/items/ambergris> |
| VULKK-ITEMS | VULKK items database | 5,338 items across 54 pages | <https://vulkk.com/database/crimson-desert/items/> |
| VULKK-MOUNTS | VULKK mounts database | 63 entries, DLC ships tagged | <https://vulkk.com/database/crimson-desert/mounts/> |
| VULKK-PETS | VULKK pets database | 86 entries, DLC pets tagged | <https://vulkk.com/database/crimson-desert/pets/> |
| VULKK-NPCS | VULKK NPC database | 465 records over five pages | <https://vulkk.com/database/crimson-desert/npcs/> |
| VULKK-SHOPS | VULKK shops database | 265 shops over three pages | <https://vulkk.com/database/crimson-desert/stores/> |
| VULKK-QUESTS | VULKK quests index | 1,142 quests | <https://vulkk.com/database/crimson-desert/questlines/> |
| VULKK-WEAPONS | VULKK Weapons category index | 483 entries reported, 5 pages | <https://vulkk.com/database/crimson-desert/item-category/weapons/> |
| VULKK-ARMOR | VULKK Armor category index | 700 entries reported, 7 pages | <https://vulkk.com/database/crimson-desert/item-category/armor/> |
| VULKK-ACCESSORIES | VULKK Accessories category index | 88 entries reported | <https://vulkk.com/database/crimson-desert/item-category/accessories/> |
| VULKK-MATERIALS | VULKK Materials category index | 108 entries reported, 2 pages | <https://vulkk.com/database/crimson-desert/item-category/materials/> |
| VULKK-ALCHEMY | VULKK Alchemy category index | 82 entries reported | <https://vulkk.com/database/crimson-desert/item-category/alchemy/> |
| VULKK-ABYSS-GEAR | VULKK Abyss Gear category index | 209 entries reported, 3 pages | <https://vulkk.com/database/crimson-desert/item-category/abyss-gear/> |
| VULKK-COOKED-FOOD | VULKK Cooked Food subcategory index | 331 entries reported, 4 pages | <https://vulkk.com/database/crimson-desert/item-subcategory/cooked-food/> |
| VULKK-BLUEPRINTS | VULKK Blueprints subcategory index | 89 entries reported | <https://vulkk.com/database/crimson-desert/item-subcategory/blueprints/> |
| PYWEL-SKILLS | Pywel skills database | 179 skills claimed; four unlock routes | <https://www.pywel.app/en/database/skills/> |
| PYWEL-CONTROLS | Pywel controls guide | Default PS5, Xbox, keyboard/mouse mappings | <https://www.pywel.app/en/guides/controls/> |
| PYWEL-PATCHES | Pywel patch notes (fan summary; stops at 1.14, July) | Pet and skill patch history | <https://www.pywel.app/en/patch-notes/> |

The eight VULKK category and subcategory rows (VULKK-WEAPONS through VULKK-BLUEPRINTS) are third-party archive totals as reported on each index page, not game-verified totals. The pages were inspected via web research, but full page extraction abbreviated rows and a direct API GET was blocked by a Cloudflare JavaScript challenge that was not bypassed. No individual VULKK entry URL is recorded, and no complete exported inventory exists.

## Community item-name export (added 2026-11-13)

A public community repository supplied the raw item-name and item-limits files tabulated in [item-name-catalogue.md](item-name-catalogue.md). Handling: record names and fields as Reported with the source label; the data is not authoritative.

| Label | Description | Used for | URL |
|---|---|---|---|
| ITEM-NAMES-JSON | `item_names.json` in the community item-mapping repository | 6,325 item-name records, each with a unique numeric `itemKey`, reproduced unmodified | <https://raw.githubusercontent.com/NattKh/CrimsonDesertCommunityItemMapping/main/item_names.json> |
| ITEM-LIMITS-JSON | `data/item_limits.json` in the same repository; declares its source as `live_game_memory_v2` | 5,899 limits records joined by `itemKey`: 5,892 match a name, 7 are metadata-only IDs | <https://raw.githubusercontent.com/NattKh/CrimsonDesertCommunityItemMapping/main/data/item_limits.json> |
| ITEM-MAPPING-REPO | Repository README, which describes a community item-name database | Context for provenance and the schema TODO | <https://github.com/NattKh/CrimsonDesertCommunityItemMapping> |

Caveats:

- Community data with mixed provenance. The `live_game_memory_v2` declaration is the file's own claim and has not been independently verified here.
- The repository's schema TODO says category offsets are unresolved, so numeric category and slot codes are preserved verbatim and not interpreted.
- The 6,325 rows are one snapshot, not all game items; 433 names have no limits record and 7 limits IDs have no name.
- The three links above were supplied with the generated catalogue and not re-fetched while this register was written.

## CrimsonDesert.app pages (fan-maintained, added 2026-11-13)

The fan site CrimsonDesert.app supplied the DLC item index and DLC guides (updated 2026-11-10, before 2.05.00) plus quest, boss, and map indexes. The site's own counts conflict internally (see [Cross-source conflicts and staleness](#cross-source-conflicts-and-staleness)).

| Label | Description | Used for | URL |
|---|---|---|---|
| APP-HOME | App homepage | Catalogue-size claims (482 or 680 quests; 14,300+ markers) | <https://www.crimsondesert.app/en/> |
| APP-QUEST-TRACKER | Quest tracker | 680 records by category; named quests | <https://www.crimsondesert.app/en/wiki/quests/tracker> |
| APP-QUEST-INDEX | Quest index (all view) | Quest index cross-check | <https://www.crimsondesert.app/en/wiki/quests?view=all> |
| APP-MAP-OCEAN | Great Ocean map | 901 DLC markers | <https://www.crimsondesert.app/en/map/great-ocean> |
| APP-BOSSES | Boss directory | 104 entries; boss names | <https://www.crimsondesert.app/en/wiki/bosses> |
| APP-WEAPONS | Weapon index | 557 weapons claimed across 18 filters; 240 exposed | <https://www.crimsondesert.app/en/wiki/weapons> |
| APP-DLC | DLC guide | Partial marker counts (hydrothermal deposits 160, manganese nodules 73, chests 53, faction quests 21); latest patch label 2.04.08 | <https://www.crimsondesert.app/en/dlc> |
| APP-DLC-ITEMS | DLC item index, updated 2026-11-10 | DLC weapons, sets, accessories, Abyss Gear, and acquisition notes | <https://www.crimsondesert.app/en/dlc/items> |
| APP-DLC-ISLANDS | DLC island guide, updated 2026-11-10 | 18 islands; 9 Ocean Ruins puzzle locations | <https://www.crimsondesert.app/en/dlc/islands> |
| APP-DLC-UNDERWATER | DLC underwater guide, updated 2026-11-10 | Seven underwater mounts | <https://www.crimsondesert.app/en/dlc/underwater> |
| APP-DLC-SHIPS | DLC ships guide, updated 2026-11-10 | Ship categories and four legendary ships | <https://www.crimsondesert.app/en/dlc/ships> |
| APP-DLC-HOUSING | DLC housing guide | Residences, castles, businesses, festivals; 17-versus-15 residence discrepancy | <https://www.crimsondesert.app/en/dlc/housing> |

## Community and unverified sources

| Label | Description | Handling | URL |
|---|---|---|---|
| FAN-MAP | Fan-made interactive map; claims over 2,000 markers; reports June 2026 updates | Navigation lead only; counts are the site's own claims | <https://crimsondeserthub.com/map> |
| FAN-BOSS | Fan companion boss list; claims 104 bosses, and its own text says 57 total (28 main story) | Per-boss difficulty, healing, drop, and respawn data excluded; counts recorded only as conflicting claims; boss names recorded from the app directory (APP-BOSSES) | <https://crimsondesert.app/en/wiki/all-boss-locations> |
| GAME8-MOUNTS | Game8 "List of All Mounts" (search result dated 2026-11-02) | Page redirected to an ad interstitial; no entries verified | <https://game8.co/games/Crimson-Desert/archives/587091> |
| GAME8-DLC-ARMOR | Game8 "All DLC New Armor and Armor Sets" | Direct inspection blocked; lead only, no rows taken | <https://game8.co/games/Crimson-Desert/archives/635799> |
| FANDOM-WEAPONS | Fandom Weapons article; prerelease-oriented | Stale taxonomy; flagged, not used as fact | <https://crimsondesert.fandom.com/wiki/Weapons> |
| FANDOM-ITEMS | Fandom Items category; few pages | Not comprehensive; not used as fact | <https://crimsondesert.fandom.com/wiki/Category:Items> |

## Cross-source conflicts and staleness

- The update digest ([UPDATE-HIGHLIGHTS]) covers 17 early patches through 1.16; current notes are 2.05.00. Do not assume the digest covers versions 1.17 to 2.05.
- IGN guides carry launch-era dates (March to June) and may predate later patches. Official patch notes override them where they conflict.
- IGN states Abyss Artifacts also pay for gear refinement; the PlayStation preview supports only character upgrades and abilities. See [equipment-enhancements.md](equipment-enhancements.md).
- Combined counts in official digests (120 mounts and pets, 70 outfits/equipment/items) mix categories and are not catalog totals.
- Index and marker counts conflict across community sites and are not reconciled. They are recorded as attributed claims, never as verified totals:

| Topic | Conflicting figures | Where |
|---|---|---|
| Quests | 680 (tracker), 482 (app homepage), 636 (Gaming.tools), 1,142 (VULKK), 46 (Game8 top-level), 39 (IGN major) | [quests.md](quests.md) |
| Bosses | 104 (app directory), 57 (app article), 87 (Gaming.tools); search snippets 75, 88, 127 | [bosses.md](bosses.md) |
| Weapons | 707 (Gaming.tools), 557 claimed and 240 exposed (app), 483 (VULKK Weapons category) | [weapons.md](weapons.md) |
| Mounts | 63 (VULKK), 49 (Gaming.tools) | [mounts.md](mounts.md) |
| DLC islands | 18 (app), 17 (Game8, as cited by the app) | [locations.md](locations.md) |
| Residences | 17 claimed, 15 named (app housing guide) | [systems-progression.md](systems-progression.md) |
| Total items | 5,338 (VULKK); search-only 6,400+, 7,239+, 8,278+; 6,325 name rows in a community export snapshot (not a verified total, not reconciled with the others) | [items-materials.md](items-materials.md), [item-name-catalogue.md](item-name-catalogue.md) |

- Freshness: Pywel's patch history stops at 1.14 (July); CrimsonDesert.app's DLC page says latest 2.04.08 (2026-11-06); Pearl Abyss confirms 2.05.00 on 2026-11-13. Use official notes for current patch-sensitive behavior.
- The Abyss category in Gaming.tools shows subcategories totaling only 376 of its 499 entries; the gap is unexplained.

## Coverage limitations

- Completeness blocker: no catalogue in this knowledge base (weapons, armor, Abyss Gear, items and materials, recipes, cooked food, blueprints, quests, mounts, NPCs) is a complete or exported inventory. The raw item-name snapshot in [item-name-catalogue.md](item-name-catalogue.md) is a community export, not a verified or complete inventory. The VULKK index pages can be read for totals and samples, but full extraction abbreviated rows, the direct API GET was blocked by a Cloudflare JavaScript challenge, and a raw VULKK HTML request returned HTTP 403; no challenge was bypassed.
- URL availability and page content have not been independently reverified; the register lists what the reports attributed, not what the pages currently show.
- The session-local reports behind this register are not in the repository, so the provenance notes and source labels have not been independently reverified against them.
- Search-result snippets cited in the reports (for example boss totals of 75, 88, and 127 and item totals above 6,000) were treated as leads and are not recorded as facts.
- Not-verified sources (GAME8-MOUNTS, GAME8-DLC-ARMOR) are leads only. Community databases and fan pages supply names and fields marked Reported; their counts are never promoted to verified totals. No official player manual was available (see [How sources were obtained](#how-sources-were-obtained)).

## Patch-sensitive caveats

- Everything here reflects base game patch 2.05.00 as of 2026-11-13. Later patches may change the sources, dates, and tiers listed.
- Official patch notes override guide and fan sources where they conflict (see [Cross-source conflicts and staleness](#cross-source-conflicts-and-staleness)).
- The KNOWN-ISSUES notice is live and may have changed since its 2026-11-13 08:10 UTC update.

[PATCH-2.05.00]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=157
[UPDATE-HIGHLIGHTS]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=118
