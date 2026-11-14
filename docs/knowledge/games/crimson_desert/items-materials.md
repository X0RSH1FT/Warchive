# Crimson Desert Items and Materials

Last checked: 2026-11-13 | Base game patch: 2.05.00 | Evidence: official patch notes plus community item records; names, selected stats, and acquisition clues | Return to the [index](README.md)

Researched catalogue, not an exhaustive one. Do not label an item as a crafting material or upgrade unless a source states that use. Gear is catalogued on [weapons.md](weapons.md), [armor.md](armor.md), and [equipment-enhancements.md](equipment-enhancements.md); recipes are on [recipes-crafting.md](recipes-crafting.md).

## Catalogue status

| Measure | Value |
|---|---|
| Item-level entries on this page | 19 named item and material rows, plus 11 index-category rows and 3 other index-count rows (not counted as items) |
| Source-reported index sizes | Gaming.tools: 11 categories listed below. VULKK Items: 5,338 items across 54 pages. Search-only totals of 6,400+, 7,239+, and 8,278+ were not verified |
| Method | Transcribed from official patch notices, the DLC item index (updated 2026-11-10), and Gaming.tools and VULKK item pages; no item-by-item crawl of the Gaming.tools or VULKK index rows was possible |
| Source index links | See [VULKK category and subcategory indexes](#vulkk-category-and-subcategory-indexes) below; third-party totals, not game-verified |
| Raw name export | [item-name-catalogue.md](item-name-catalogue.md) holds 6,325 community name rows, reproduced unmodified and not itemized on this page; see [Raw item-name export](#raw-item-name-export) |
| Complete? | No. Index totals disagree, categories overlap (Armor alone includes 1,662 "Damaged Gear" entries), and the item tables inspected were truncated (for example 52 of 1,065 Abyss Artifact sources) |

## Index category counts (Gaming.tools)

These are index-entry counts, not verified counts of unique usable items. Categories and subcategories can overlap. The Abyss subcategories shown account for only 376 of 499 entries; the difference is unexplained. Source: [GT-ITEMS].

| Category | Entries | Where covered |
|---|---:|---|
| Abyss | 499 | [equipment-enhancements.md](equipment-enhancements.md) (partial) |
| Accessories | 84 | [armor.md](armor.md) (5 DLC rows) |
| Armor | 2,257 (1,662 "Damaged Gear") | [armor.md](armor.md) |
| Collectibles | 1,569 | [collectibles-resources.md](collectibles-resources.md) |
| Consumables | 397 | This page (elixirs only) |
| Documents | 1,918 | Not covered |
| Equipment | 507 | Not itemized |
| Materials | 575 | This page (selected) |
| Miscellaneous | 18 | Not covered |
| Special Equipment | 380 | Not itemized |
| Weapons | 707 | [weapons.md](weapons.md) |

Other index counts: VULKK Items reports 5,338 items over 54 pages with item categories and DLC tags; rows often give type and stats or effects but not full acquisition, location, cost, or materials ([VULKK-ITEMS]). The Gaming.tools Knowledge index reports 700 Crafting Manuals and 161 Gatherables, which are knowledge records rather than item counts ([GT-KNOWLEDGE]).

## VULKK category and subcategory indexes

Third-party archive totals as reported by each index page; they are not game-verified totals and are not reconciled with the Gaming.tools categories above or with the 5,338 overall figure. Web research could inspect these index pages and sample entry pages, but full page extraction abbreviated rows, so no row from them is itemized in this knowledge base and no individual entry URL is cited. A direct API request was blocked by a Cloudflare JavaScript challenge and was not bypassed.

| Index | Reported entries | Reported pages | Where covered | Source |
|---|---:|---|---|---|
| Weapons | 483 | 5 | [weapons.md](weapons.md) | [VULKK-WEAPONS] |
| Armor | 700 | 7 | [armor.md](armor.md) | [VULKK-ARMOR] |
| Accessories | 88 | Not stated | [armor.md](armor.md) | [VULKK-ACCESSORIES] |
| Materials | 108 | 2 | Not itemized from this index; named rows below come from other sources | [VULKK-MATERIALS] |
| Alchemy | 82 | Not stated | Not itemized from this index | [VULKK-ALCHEMY] |
| Abyss Gear | 209 | 3 | [equipment-enhancements.md](equipment-enhancements.md) | [VULKK-ABYSS-GEAR] |
| Cooked Food (subcategory) | 331 | 4 | [recipes-crafting.md](recipes-crafting.md); no dishes itemized | [VULKK-COOKED-FOOD] |
| Blueprints (subcategory) | 89 | Not stated | [recipes-crafting.md](recipes-crafting.md); none itemized | [VULKK-BLUEPRINTS] |

## Raw item-name export

[item-name-catalogue.md](item-name-catalogue.md) reproduces the community `item_names.json` export (6,325 records, each with a unique `itemKey`) joined by numeric `itemKey` to `item_limits.json`: 5,892 keys match, 433 are names-only, 7 are metadata-only IDs, and there are no duplicates. Use it to look up a name or key; do not treat it as a curated item list.

- It is not authoritative. The source is a community repository that describes itself as an item-name database ([ITEM-MAPPING-REPO]); the limits file declares its source as `live_game_memory_v2` ([ITEM-LIMITS-JSON]), and that declaration is not independently verified here.
- It is not a categorized catalogue. Name, category, and internal-name strings are the source's own values; this knowledge base has not checked them. Numeric fields such as `inventoryCategory` and `slotType` are kept verbatim and must not be read as meanings, because the repository's schema TODO lists category offsets as unresolved.
- 6,325 counts rows in one snapshot, not all items in the game. It is not reconciled with the 5,338 VULKK figure or the Gaming.tools category counts above, and none of its rows are added to this page's 19 named rows.
- A raw VULKK HTML request returned HTTP 403; no challenge was bypassed, so VULKK rows are not part of the export.

## Named items and materials (19 entries)

Availability uses Base, DLC, or Not stated. "Reported" means a community record or index; "Verified" means an official notice.

| # | Item | Category (as sourced) | Detail | Acquisition | Availability | Source |
|---|---|---|---|---|---|---|
| 1 | Leviakan's Scales | Boss reward, material | Defeating Leviakan grants its scale (2.04.08); acquirable on Bergel Island after defeating Leviakan (2.05.00). Not the same item as Aeserion's Scale. Use in any recipe not established | Boss reward | DLC (Bergel Island and Leviakan are DLC-listed) | [PATCH-2.04.08], [PATCH-2.05.00] |
| 2 | Aeserion's Scale | Material | Used in recipes for Aeserion Dagger, Mace, Sword, Bow, Halberd, Greataxe, Greathammer, Warhammer, Spear, Longsword, plus Abyssal Fusion; also the +10 refinement step of Eastern Witch's Fan | Source not captured | Not stated | [GT-AESERION], [GT-WINGFAN] |
| 3 | Abyss Artifact | Progression currency, upgrade material | Guide and preview: spent on skills and stats. Community record: usable to enhance skills or refine equipment; has crafting uses, many possible character sources, and vendors | Source table showed 52 of 1,065 entries, so no complete source list | Base (preview 2026-03-04 mentions it) | [IGN-SKILLS], [PS-BLOG], [GT-ARTIFACT] |
| 4 | Abyss Cells | Material | 20 are required to craft Eastern Witch's Fan at a Blacksmith | Not stated | Not stated | [GT-WINGFAN] |
| 5 | Ambergris | Gatherable, gear-adjacent material | Sell price 2.05 (unit not stated); stack size 100; used in named Greater Elixir recipes and ship-stern recipes (recipe names not captured); 2.05.00 placed extra ambergris near giant whale bones at Seafloor Plain | Sperm and blue whales (one item at 30%); Rare Ocean Relics (1 to 2 at 1%); world placement | DLC | [GT-AMBERGRIS], [PATCH-2.05.00] |
| 6 | Rare Ocean Relics | Source container | Listed as an ambergris source; contents otherwise not captured | Not stated | Not stated | [GT-AMBERGRIS] |
| 7 | Elixir of Luftis (Lesser, Greater) | Consumable | Named while fixing inventory grouping in 2.05.00; effects not stated | Not stated | Not stated | [PATCH-2.05.00] |
| 8 | Elixir of Fluva (Lesser, Greater) | Consumable | Same | Not stated | Not stated | [PATCH-2.05.00] |
| 9 | Elixir of Lucaris (Lesser, Greater) | Consumable | Same | Not stated | Not stated | [PATCH-2.05.00] |
| 10 | Fish Fillet | Food | Fed to Electric Ray and Sunfish to reach 100 Trust (see [mounts.md](mounts.md)) | Not stated | Not stated | [APP-DLC-UNDERWATER] |
| 11 | Abyss Gears (example: Parting Gift) | Gear, reward | Added to witch Trust rewards in 2.05.00; catalogued in [equipment-enhancements.md](equipment-enhancements.md) | Trust reward | DLC context | [PATCH-2.05.00] |
| 12 | Wagon equipment materials | Crafting materials | Required amounts changed in 2.05.00; which materials and quantities are not stated | Not stated | Not stated | [PATCH-2.05.00] |
| 13 | Diving Helm and Suit (craftability) | Craftable gear | Canine Charter's pieces craftable at a Crafting Station (2.05.00); ingredients not listed | Crafting | DLC | [PATCH-2.05.00] |
| 14 | Charter's Diving Set and Charter's Light Diving Set | Bonus gear listed as preorder rewards by the community DLC index | Names from [APP-DLC-ITEMS]; a third-party guide separately reports a "Charter's Diving Outfit" as a *Charting the Unknown* preorder bonus (guide not registered; relationship to these rows not established). Not the same as the official Canine Charter's pet gear. See [armor.md](armor.md) | Preorder; Xbox claim via the Add-on menu | DLC (as listed); entitlement not established | [APP-DLC-ITEMS], [XBOX-NOTICE] |
| 15 | Preorder and Deluxe Edition bonus items | Bonus items | Exist; can have enhancement levels; full names and gear types not given beyond row 14. The official editions notice separates the Khaled preorder, the Grotevant PS5 bonus, and the Kairos, Balgran, and Exclaire Deluxe Pack; Steam sells the Deluxe Pack separately. See [overview.md](overview.md#editions-preorders-and-dlc-availability) | Add-on claim; Steam purchase of the Deluxe Pack | Not stated; entitlement not established | [PATCH-2.05.00], [XBOX-NOTICE], [OFF-EDITIONS], [STEAM-DELUXE], [STEAM-DLC-LIST] |
| 16 | Ice arrow | Ammunition | Mentioned in 2.05.00; recipe and source not stated | Not stated | Not stated | [PATCH-2.05.00] |
| 17 | Oongka's Skyway Rocket Pack | Traversal gear (as named) | Named in the DLC item index; stats not captured | Not stated | DLC (as listed) | [APP-DLC-ITEMS] |
| 18 | Legendary insects (three, unnamed) and insect storage | Collectible, storage feature | Named in the DLC item index; the insects' names were not captured | Not stated | DLC (as listed) | [APP-DLC-ITEMS] |
| 19 | Combat-usable life tools (Frying Pan, Ladle, Frying Pan Lid, Jar Lid, Kitchen Knife) | Life tools | Catalogued in [weapons.md](weapons.md) | Not stated | DLC | [PATCH-2.04.00] |

Gear items (Harpoon Gun, Eastern Witch's Fan, Constellation Helm, Nibrak Cloth Armor, sets, accessories) are on their own pages: [weapons.md](weapons.md), [armor.md](armor.md).

## Acquisition clues

| Method | Example | Source |
|---|---|---|
| Boss reward | Leviakan's Scales; Abyss Gear from Trukan, Leviakan, Kharzek, and Sir Catfish | [PATCH-2.04.08], [APP-DLC-ITEMS] |
| World placement | Ambergris at Seafloor Plain | [PATCH-2.05.00] |
| Creature or container drop | Ambergris from whales and Rare Ocean Relics | [GT-AMBERGRIS] |
| Trust reward | Abyss Gears from witches | [PATCH-2.05.00] |
| Crafting | Diving gear at a Crafting Station; Eastern Witch's Fan at a Blacksmith | [PATCH-2.05.00], [GT-WINGFAN] |
| Vendor | Harpoon Gun at fishing docks (after first acquisition); Eastern Witch's Fan at Witch's Workshop-Lyselia | [PATCH-2.05.00], [GT-WINGFAN] |
| Activity reward | Lumen Longsword for clearing all 10 Garden of Trials groups | [APP-DLC-ITEMS] |
| Add-on claim (Xbox) | Preorder or Deluxe bonus items via the Add-on menu | [XBOX-NOTICE] |

## Coverage limitations

- Only 19 item or material rows are named; the broad indexes list thousands of entries that were not itemized. The raw name export ([item-name-catalogue.md](item-name-catalogue.md)) lists 6,325 source rows but is uncategorized community data, not a curated or complete item list.
- Stats, drop rates, costs, and prices are absent except the few values quoted above (Ambergris sell price, stack size, and drop chances; Eastern Witch's Fan ATK on [weapons.md](weapons.md)).
- The Fandom Items category lists only a few pages and is not used ([FANDOM-ITEMS]).
- Cooking and fishing items are covered only as far as [recipes-crafting.md](recipes-crafting.md) and [collectibles-resources.md](collectibles-resources.md) allow; no fish list was verified.

## Patch-sensitive caveats

- Item placement (ambergris), acquisition location (Leviakan's Scales), and inventory grouping (elixirs) changed in 2.05.00.
- Wagon crafting material amounts changed without published values.
- Gaming.tools item pages may have changed since they were read; the Ambergris sell price (2.05) is quoted as shown, with no currency unit.

## Related documents

[Equipment enhancements](equipment-enhancements.md) | [Recipes and crafting](recipes-crafting.md) | [Collectibles and resources](collectibles-resources.md) | [Locations](locations.md) | [Bosses](bosses.md) | [Systems and progression](systems-progression.md) | [Item name catalogue](item-name-catalogue.md)

[PATCH-2.05.00]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=157
[PATCH-2.04.08]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=152
[PATCH-2.04.00]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=140
[XBOX-NOTICE]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=155
[STEAM-DLC-LIST]: https://store.steampowered.com/dlc/3321460/Crimson_Desert/
[IGN-SKILLS]: https://www.ign.com/wikis/crimson-desert/Best_Skills_to_Get_First
[PS-BLOG]: https://blog.playstation.com/2026/03/04/crimson-desert-hands-on-report-four-hours-in-the-rpgs-massive-open-world/
[APP-DLC-ITEMS]: https://www.crimsondesert.app/en/dlc/items
[APP-DLC-UNDERWATER]: https://www.crimsondesert.app/en/dlc/underwater
[GT-ITEMS]: https://crimsondesert.gaming.tools/items
[GT-KNOWLEDGE]: https://crimsondesert.gaming.tools/knowledge
[GT-ARTIFACT]: https://crimsondesert.gaming.tools/items/abyss_artifact
[GT-AESERION]: https://crimsondesert.gaming.tools/items/item_gimmick_snake_boss_scales_01
[GT-WINGFAN]: https://crimsondesert.gaming.tools/items/witch_wingfan
[GT-AMBERGRIS]: https://crimsondesert.gaming.tools/items/ambergris
[VULKK-ITEMS]: https://vulkk.com/database/crimson-desert/items/
[VULKK-WEAPONS]: https://vulkk.com/database/crimson-desert/item-category/weapons/
[VULKK-ARMOR]: https://vulkk.com/database/crimson-desert/item-category/armor/
[VULKK-ACCESSORIES]: https://vulkk.com/database/crimson-desert/item-category/accessories/
[VULKK-MATERIALS]: https://vulkk.com/database/crimson-desert/item-category/materials/
[VULKK-ALCHEMY]: https://vulkk.com/database/crimson-desert/item-category/alchemy/
[VULKK-ABYSS-GEAR]: https://vulkk.com/database/crimson-desert/item-category/abyss-gear/
[VULKK-COOKED-FOOD]: https://vulkk.com/database/crimson-desert/item-subcategory/cooked-food/
[VULKK-BLUEPRINTS]: https://vulkk.com/database/crimson-desert/item-subcategory/blueprints/
[OFF-EDITIONS]: https://crimsondesert.pearlabyss.com/en-US/News/Notice/Detail?_boardNo=49
[STEAM-DELUXE]: https://store.steampowered.com/app/4024620/Crimson_Desert_Deluxe_Pack/
[FANDOM-ITEMS]: https://crimsondesert.fandom.com/wiki/Category:Items
[ITEM-NAMES-JSON]: https://raw.githubusercontent.com/NattKh/CrimsonDesertCommunityItemMapping/main/item_names.json
[ITEM-LIMITS-JSON]: https://raw.githubusercontent.com/NattKh/CrimsonDesertCommunityItemMapping/main/data/item_limits.json
[ITEM-MAPPING-REPO]: https://github.com/NattKh/CrimsonDesertCommunityItemMapping
