# Summerpack 1.1.24 - Changelog

Consolidated changelog for everything built this session. Previously scattered across a run of
1.1.1-1.1.7 -> 1.2.0 -> 1.3.3 micro-bumps (one per fix); collapsed back down to a single 1.1.8
entry, organized by feature instead of by commit. 1.1.9 added the first real runtime-verified fixes
from headless server boots. 1.1.10-1.1.12 were rounds 1-3 of the user's actual in-game playtesting -
each round caught real bugs the previous one missed, including two of round 1's own fixes (Patchouli
books, Tasty Eye) turning out to be wrong on the first attempt. 1.1.13/1.1.14 were round 4, in two
parts: the first fix corrected an actual JSON-escaping bug but was itself based on a wrong
assumption about how Patchouli renders line breaks (real newline characters do nothing - only
`$(br)`/`$(br2)` markup works, confirmed by reading Patchouli's own source), caught and corrected
before it could wrongly ship as "fixed". 1.1.15 was round 5: a latent bug affecting all 7 of this
pack's custom eyes (a raw untranslated tooltip line) surfaced via Holy Eye. 1.1.16 adds two new
mods (Just Zoom, Default Options) and reorganizes `CHECKLIST.md` into confirmed/needs-a-look/
removed sections instead of one long numbered list. 1.1.17 fixes the Molten Vents rarity regression
(the earlier "fix" was backwards), adds Create: Copycats+, and does a full documentation pass -
`CLAUDE.md` gets a Tags column on every mod table plus a corrected pack-original-content reference,
and the Summerpack Guide gets 5 new Storage & Utility entries (Lootr, Chunky, Nature's Compass,
Gravestone, Building Wands) that had zero coverage, plus in-game-guide pointers on the AE2 and
Create entries. 1.1.18 fixes another shaped-recipe collision, this time between Chisel Reborn's
chisel and Simply Swords' Iron Sai. 1.1.19 tunes Molten Vents rarity again per direct playtest
feedback - 2x rarer than the 1.1.17 fix. 1.1.20 is a bigger round: the chisel/sai fix from 1.1.18
turned out to be incomplete (Minecraft's shaped-recipe matcher also tries the horizontal mirror of
a pattern, so the "opposite diagonal" reshape still collided - fixed for real with a
mirror-proof vertical pattern), Molten Vents rarity is re-anchored directly off the mod's own
default instead of chaining multipliers, MI's 32 dye-colored pipe icons get real baked textures
(the earlier fix's `"tints"` field was silently not applying - every color rendered identically),
the End outer island ore vein feature is removed entirely (never found in-game, deprecated per
user direction), and five Patchouli book pages that were overflowing their bounds get split into
multiple pages. 1.1.21 fixes a genuine ore-processing dead end: MI's tin/lead/nickel/platinum/
uranium ore, once crushed, produced Create's own native crushed item with no way to smelt it into
an ingot - and confirms the whole 1.1.20 batch (chisel/sai, vents, pipe textures, both books) as
working via real playtest. 1.1.22 finally wires up Default Options, which had been present but
inert since 1.1.16. 1.1.23 re-enables Stellaris steel ore generation per user direction. 1.1.24 fixes 9 mods that were
incorrectly declared server-required when they're actually client-only, which is what was forcing
them onto the user's dedicated server and producing `RuntimeDistCleaner`/mixin warnings for
client-rendering classes. `Summerpack_DEPLOY.mrpack` (a same-content copy of the latest versioned
build, stable filename for the user's GitHub Pages-hosted server deployment at
`ondrej1808.github.io/Viktorcraft`) is introduced from 1.1.24 onward - update it alongside every
new version bump. Going forward, version bumps stay incremental (1.1.25, 1.1.26, etc.) - reserving
a minor/major bump for an actual reason (new mod set, breaking recipe changes).

## 1.1.24: Fixed 9 client-only mods incorrectly forced onto the dedicated server

- User reported a dedicated-server log full of `RuntimeDistCleaner`/mixin warnings ("Attempted to
  load class ... for invalid dist DEDICATED_SERVER", client rendering classes like
  `MultiBufferSource$BufferSource`, `VertexFormat$Mode`, `FogRenderer$FogData`,
  `GlStateManager$SourceFactor`) and suspected Just Zoom. Checked Just Zoom's `env` in
  `modrinth.index.json` - it was already correctly `server: unsupported`, so a Modrinth-aware
  server generator would never have downloaded it. That ruled out Just Zoom as the specific cause,
  but prompted an audit of every mod's `env` block against Modrinth's own declared `client_side`/
  `server_side` values (queried live via the API, not assumed) - and found a real, much bigger bug
  that's been in the pack from before this session: **9 genuinely client-only mods were tagged
  `server: required`** instead of `unsupported`, meaning any Modrinth-compliant server pack
  generator would force-download and load them on a dedicated server, exactly producing the
  reported symptom:
  - `chat_heads` (Chat Heads)
  - `MouseTweaks` (Mouse Tweaks)
  - `ImmediatelyFast`
  - `neoculus` (NeOculus)
  - `SimplyTooltips` (Simply Tooltips)
  - `notenoughanimations` (Not Enough Animations)
  - `embeddium` (Embeddium)
  - `BetterF3`
  - `continuity` (Continuity)

  Corrected all 9 to `server: unsupported` in `modrinth.index.json`, matching their real Modrinth
  project declarations. Also checked several other suspects that turned out fine on inspection:
  Xaero's Minimap/World Map and Sound Physics Remastered are legitimately `server: optional` per
  Modrinth (safe to load on a server, just unnecessary - not a bug); AppleSkin and Simple Voice
  Chat are `optional`/`optional` (Simple Voice Chat genuinely needs a server component for
  proxying audio, unlike the others); Athena (Chisel Reborn's baked-model-loader dependency) was
  already correctly `unsupported` - confused briefly by an unrelated Modrinth project that also
  uses the slug `athena`, resolved by checking the jar's own `displayURL` for the real project
  (`athena-ctm`).
  - **Important caveat for anyone running an existing dedicated server**: this fixes the pack
    metadata so a *fresh* server install/reinstall via a Modrinth-aware tool won't download these
    9 jars going forward. It does **not** retroactively remove them from a server that's already
    running - those 9 jars need to be manually deleted from that server's `mods/` folder for the
    warnings to actually stop.
- Also investigated the user's second report - a non-crashing Stellaris recipe-scan warning for
  `stellaris:water_separation` - and whether updating from the pack's current 1.4.23 to the newer
  1.4.24/1.4.25 would fix it. Found the exact upstream report
  ([st0x0ef/stellaris#208](https://github.com/st0x0ef/stellaris/issues/208), "Failed to scan
  recipe stellaris:water_separation"), closed by the mod author with: *"You can safely ignore this
  warning. The recipe work well."* Neither 1.4.24's nor 1.4.25's changelog mentions this warning
  at all (1.4.24 is gravity/launchpad/jet-suit fixes, 1.4.25 is a direct-launch-to-planet hotfix) -
  consistent with it being a harmless, by-design log message rather than a bug that gets fixed in
  a later version. **No version bump applied** - updating Stellaris wouldn't resolve this specific
  warning, though 1.4.24 does contain unrelated real fixes if there's a separate reason to update.
- **Validated a fresh dedicated-server boot straight from `Summerpack_DEPLOY.mrpack`** - extracted
  the mrpack, downloaded every mod whose `env.server` isn't `unsupported` (97 of 112 files, mirroring
  exactly what a real Modrinth-compliant server generator would fetch), installed NeoForge
  21.1.233, and booted. Reached `Done (11.225s)! For help, type "help"` with **zero**
  `RuntimeDistCleaner` errors (confirming the 9-mod env fix above actually works end-to-end - none
  of those jars were even downloaded) and zero `FATAL` errors. Only warnings present were the
  already-known, non-blocking ones: the Stellaris `water_separation`/`fuel_refining` Zeta
  recipe-scan warnings (confirmed harmless above), Create Crafts & Additions' fluid-tag recipe
  parsing falling back to vanilla, and a Stoneholm loot table using a removed NBT function - all
  pre-existing upstream issues unrelated to this pack.

## 1.1.23: Stellaris steel ore generation re-enabled

- User: "comment out steel ore disable generation script please." Disabled
  `overrides/kubejs/data/packfixes/neoforge/biome_modifier/disable_stellaris_steel_ore.json` by
  renaming it to `.disabled` (the same convention already used for client-only mod jars) rather
  than deleting it outright, so it's a one-line rename to restore if needed - JSON doesn't support
  comments, so a rename is the practical equivalent of "commenting out" a datapack file.
- Stellaris steel ore (`stellaris:steel_ore`/`stellaris:steel_ore_deepslate`) now generates
  normally in the overworld again. Steel unification itself is untouched - the ingot/nugget → MI
  steel conversion recipes in `steel_unification.js` still apply once Stellaris steel ore is
  smelted with the mod's own recipe, so MI steel stays the only *usable* steel, just via ore that
  can be mined again rather than needing loot/old stock as the only source.
- Updated the Summerpack Guide's Modern Industrialization entry, which previously said "Stellaris
  steel ore has been disabled" - now describes the current mine → smelt → convert flow instead.

## 1.1.22: Default Options wired up for real

- Default Options (added in 1.1.16) needed a `config/defaultoptions/` folder generated in-game via
  `/defaultoptions saveAll` - an interactive step this session couldn't do headlessly, so the mod
  shipped present but inert, with `overrides/options.txt` doing the actual work of seeding default
  keybinds instead. User ran the command on the `Summerpack-1.1.20` test instance and provided the
  generated `config/defaultoptions/options.txt` and `keybindings.txt`.
- Copied both files into `overrides/config/defaultoptions/` and **deleted** `overrides/options.txt`.
  The two mechanisms can't coexist: a modpack-seeded root `options.txt` already exists by the time
  a fresh instance's first launch happens, so Default Options - which only applies its bundled
  config when no `options.txt` is present yet - would see settings already exist and silently do
  nothing. Removing the raw override lets the mod's own (functionally equivalent, since it was
  captured from a real configured session) defaults actually take effect.
- Spot-checked the generated `options.txt` for anything that shouldn't ship as a pack default
  before copying it in - no player-identifying data (`lastServer` was empty), no unexpected
  telemetry opt-in. `resourcePacks:["fabric"]` is the only resource pack auto-enabled, consistent
  with this pack's earlier decision not to force-enable the 4 bundled resource packs by default
  (CHECKLIST #42, "DISCARDED per user direction").

## 1.1.21: Crushed platinum/tin/lead/nickel/uranium smelting fix

- **Confirmed working via user playtest**: the whole 1.1.20 batch - Book of Eyes ("Eyes book OK"),
  Summerpack Guide page-overflow fixes ("all books are OK"), the chisel/sai mirror-proof recipe
  fix ("Chisel recipe conflict fixed"), the baked per-color MI pipe icons ("MI pipes texture are
  OK"), and the re-anchored Molten Vents rarity ("vent spawning is OK") - and Create: Copycats+
  ("copycats OK").
- **Crushed raw platinum had no smelting recipe - and neither did tin, lead, nickel, or uranium.**
  User: "crushed raw platinum -> no smelting. create already adds crushed variants: raw platinum,
  raw tin, raw lead, raw uranium, raw nickel but no smelting/washing recipes for them." Investigated
  via jar inspection and confirmed: MI's ore for these 5 metals carries the common `#c:ores/<material>`
  tag, which Create's own bundled crushing recipes (`data/create/recipe/crushing/{tin,lead,nickel,
  platinum,uranium}_ore.json`) already match - producing Create's own `create:crushed_raw_<material>`
  item instead of this pack's. That silently made our earlier `packfixes:crushing_{tin,lead,nickel}_ore_ore`
  recipes (added back when the crushed-ore chain was first built) dead code - unreachable, since
  Create's native recipe for the same input tag wins. Worse, Create only ships furnace-smelting
  recipes for its own 4 base metals (iron/gold/copper/zinc); everything else in its crushed-material
  tag, including tin/lead/nickel/platinum/uranium, is meant to be wired up by whichever ore mod is
  actually present - Mekanism, Thermal, IC2, Immersive Engineering and others all have their own
  compat data bundled in the Create jar, but Modern Industrialization isn't one Create recognizes,
  so these 5 crushed items were a genuine dead end regardless of which mod's crushing recipe fired.
  Fixed by: removing the now-dead `packfixes:crushed_raw_{tin,lead,nickel}` items, textures, and
  crushing recipes (kept for antimony and iridium, which have no Create-native crushed-material
  equivalent at all); adding smelting + blasting recipes straight from Create's own
  `create:crushed_raw_<material>` to the matching MI ingot for all 5
  (`modern_industrialization:{tin,lead,nickel,platinum,uranium}_ingot`). Washing (Create's
  "splashing" bonus-yield recipe type, the other half of the user's report) was deliberately **not**
  added this round - this session had no network access to spin up a headless validation server and
  confirm the KubeJS-Create splashing API signature before shipping it, and smelting/blasting alone
  fully unblocks the ore chain the user reported as broken. Flagged as a follow-up in `CHECKLIST.md`.

## 1.1.20: Chisel/Sai root cause fix, vents re-anchored, real pipe textures, End veins removed, page overflow fixes

- **Chisel/Sai conflict, take two.** 1.1.18's fix (re-shaping the chisel recipe onto the opposite
  diagonal) was itself broken - user confirmed: "sai x chisel conflict not fixed !!!" Root cause:
  Minecraft's shaped-recipe matcher tries a pattern in both its normal AND horizontally-mirrored
  form, and the mirror of "ingot top-left, stick bottom-right" is exactly Iron Sai's original
  "ingot top-right, stick bottom-left" - so any 2x2 diagonal reshape was doomed to still collide
  with a diagonal from the other mod. Fixed for real using a single-column vertical pattern
  (ingot directly above the stick) - a 1-column pattern's mirror is itself, so it's structurally
  immune to ever degenerating into a diagonal shape.
- **Molten Vents rarity, re-anchored.** After three rounds of adjusting the previous fix's own
  output (1.1.17 "3x more common", 1.1.19 "2x rarer than that"), user asked for a cleaner
  reference point: "make it 2x less common than mod molten vents default." Set directly off the
  mod's own bundled defaults instead of chaining off the last patch's numbers: land chance
  1000→2000, aquatic 690→1380, across all 12 vent-type files.
- **MI pipe icons actually recolored.** User: "design proper textures for all MI pipes (they have
  colors) item/fluid pipe." Investigated why the earlier fix's icons all looked identical despite
  16 dye-color variants (visible in a JEI search screenshot): the model JSONs used a `"tints"`
  field to recolor a shared texture, but `"tints"` isn't a real recognized field on a plain
  `minecraft:item/generated` model - it was silently doing nothing. Worse, the shared texture
  itself was the raw 64x64 4-tile connected-texture sheet the mod uses for in-world block
  rendering (`block/pipes/item.png`/`fluid.png`), squished into a 16x16 icon slot - never designed
  to be an icon. Fixed by cropping one representative 16x16 tile from each sheet and baking 16 real
  dye-tinted PNG variants per type (32 new textures under
  `overrides/kubejs/assets/modern_industrialization/textures/item/pipes/`), with all 32 colored
  pipe model JSONs updated to reference the baked texture directly. The 6 machine-casing pipe
  variants (bronze/iridium/nuclear_alloy/stainless_steel/steel/titanium) already used real
  per-material textures, not the broken shared sheet, so they were left untouched.
- **End outer island ore veins removed entirely.** User: "I cannot find any of the ore veins, i
  think there is not an endstone variant of the ores. lets deprecate the ore veins in end feature
  completely." Deleted the `packfixes:end_outer_island_ore_veins` biome modifier and all 12
  configured/placed feature files (6 vein types), removed the Book of Eyes guide entry, and
  rewrote the "What This Pack Changed" summary page that referenced it.
- **Patchouli page overflow fixed on 5 entries.** User (Czech): "1.1.18 tady se to moc nevejde na
  stránku" - screenshots showed the Modern Industrialization and AE2 Summerpack Guide pages with
  text running to the very bottom edge. Patchouli doesn't auto-paginate a `"text"` page's content -
  same root cause as the earlier Bee Eye cutoff bug. Split the overloaded entries into multiple
  pages, one topic per page: Modern Industrialization, AE2, Create, New Dimensions (Aether/Deeper
  and Darker/Bumblezone), and What This Pack Changed (rewritten from 3 dense pages into 5 focused
  ones, also updated to describe the chisel/sai fix and drop the removed End vein feature).
- Just Zoom confirmed working by user playtest ("just zoom works OK").

## 1.1.17: Vents rarity re-fix, Copycats, documentation pass

- **Molten Vents rarity was backwards.** An earlier pass (before this session's Round 5) tried to
  triple vent frequency by multiplying `rarity_filter` chance values UP (1000→3000 land,
  690→2070 aquatic) - but `rarity_filter`'s `chance` is a 1-in-N roll, so a *higher* number means
  *rarer*, not more common. This made vents genuinely 3x scarcer than the mod's own default, and
  the earlier "vents are more rare OK" playtest confirmation (CHECKLIST #19) was itself evidence of
  the bug, not the fix - just misread at the time as a positive result. User confirmed the real
  symptom directly: "Vents are too much rare now! cannot be found!" Fixed for real by dividing the
  mod's true bundled defaults (re-confirmed by decompiling
  `molten_vents-1.21.1-2.1.1.jar`'s own `data/molten_vents/worldgen/placed_feature/*.json`) by 3
  instead: land vent chance 1000→333, aquatic 690→230, across all 12 vent-type files (6 land + 6
  aquatic). Validated via a clean headless server boot (0 new errors).
- **Added Create: Copycats+** (`copycats-3.0.4+mc.1.21.1-neoforge.jar`, Modrinth `copycats`) -
  camouflage blocks that mimic any other block's texture, letting Create builds blend into any
  style. Depends only on Create and JEI, both already in the pack - no new dependency jars needed.
  Validated via headless boot: loads clean, only the same pre-existing upstream warnings plus one
  harmless mixin-discard notice specific to Copycats' own bundled mixins.
- **`CLAUDE.md` documentation pass.** Added a `Tags` column (`tech`, `storage`, `utility`,
  `combat`, `exploration`, `worldgen`, `decoration`, `ui`, `perf`, `audio`, `lib`, `has-guide`) to
  every mod table so the catalog can answer "what kind of mod is this" at a glance, not just "what
  does it do." Fixed a stale reference in "Pack-original content" that still named the deleted
  `eyeguide:tasty_eye` item - now correctly points at `endrem:holy_eye` and explains it's a real
  registered End Remastered eye (config-based, matching Venus/Bee Eye), not a standalone item.
- **Summerpack Guide utility coverage audit.** The Storage & Utility category only had entries for
  Tom's Storage, Sophisticated Backpacks, and Waystones - Lootr, Chunky, Nature's Compass,
  Gravestone, and Building Wands had zero guide coverage despite being in the pack. Added one entry
  per mod (icons verified against each mod's real registered item IDs via `unzip -l` on the actual
  jars: `lootr:lootr_chest`, `naturescompass:naturescompass`, `gravestone:gravestone`,
  `wands:iron_wand`; Chunky has no items of its own, command-only, so its entry uses a vanilla
  `minecraft:filled_map` icon instead). Also added `has-guide` pointers to the existing AE2 and
  Create entries - AE2 now mentions its own bundled GuideMe book for anything past a basic ME
  terminal, Create now mentions its Ponder tutorial system (right-click any Create item/block with
  the Ponder key) instead of the guide trying to re-teach kinetic mechanics from scratch. All 52
  Patchouli book JSON files (5 new) re-validated as parseable JSON.
- **Researched (not yet acted on): Continuity vs AE2 facades.** User asked whether Continuity can
  be configured to ignore AE2 facades and MI pipes. Confirmed: Continuity has no blacklist/
  exclusion config of any kind (checked its wiki - only "Home" and "Continuity Connected Textures
  Specification" pages exist, neither documents one). MI pipes' icon breakage was already worked
  around this session via 40 manual `minecraft:item/generated` model overrides. AE2 facades have
  the same *class* of bug per an open, unresolved upstream issue
  ([PepperCode1/Continuity#682](https://github.com/PepperCode1/Continuity/issues/682)) but it is
  not yet confirmed broken in this specific pack - no model-override workaround has been applied
  to AE2 facades. Documented in `CLAUDE.md`'s Continuity row; needs a decision once/if it's
  confirmed visibly broken in-game.

## 1.1.18: Chisel/Sai recipe conflict fix

- **Chisel Reborn's chisel and Simply Swords' Iron Sai shipped the exact same shaped recipe** -
  same items (iron ingot + a stick, Sai's via the `c:wood_sticks` tag which includes
  `minecraft:stick`), same anti-diagonal 2x2 shape once Sai's blank top row is trimmed
  (`chisel:chisel`: `" #"`/`"S "`; `simplyswords:iron_sai`: `"  "`/`" X"`/`"# "`, normalizes to the
  same 2-row shape) - user reported: "chisel and sai has recipe config one stick and ingot
  diagonally". Same class of bug as the earlier wand/spear conflict (see "Files touched" below).
  Gold Sai and Diamond Sai don't collide (different ingot material, so they're distinct recipes
  despite sharing the same shape). Fixed by re-shaping the chisel recipe only (leaves the Sai
  tier family's shape consistent across iron/gold/diamond) onto the opposite diagonal
  (`"# "`/`" S"` - ingot top-left, stick bottom-right) via
  `overrides/kubejs/server_scripts/chisel_sai_conflict_fix.js`, mirroring the exact
  remove-and-reshape approach used for wands/spears.

## 1.1.19: Molten Vents rarity tuned again (2x rarer than 1.1.17)

- User feedback after 1.1.17's re-fix: "vents are too much common make them 2x more rare." Doubled
  every `rarity_filter` `chance` value from 1.1.17's corrected baseline (land 333→666, aquatic
  230→460) across all 12 vent-type files (6 land + 6 aquatic:
  veridium/crimsite/ochrum/asurine/scoria/scorchia). This still lands roughly 1.5x more common
  than the mod's own default (1000/690) - between the mod default and the 1.1.17 "3x more common"
  fix - per direct playtest feedback rather than re-deriving from the mod's defaults again. All
  12 files re-validated as parseable JSON and synced to the test instance.

## 1.1.9: Runtime-verified fixes (from a real `latest.log`)

The `Summerpack-1.1.8` Prism instance was actually launched and played through (world saved and
exited cleanly across all 30 dimensions - no crash). Its `logs/latest.log` surfaced two real bugs
that static JSON/SNBT validation couldn't have caught:

- **`nether_eye` loot injection was silently broken, in two layers.** `nether_eye.json` originally
  pointed `loot_to_inject_id` at a made-up `endrem:injections/nether_eye` loot table (a custom file
  this session had added under `overrides/kubejs/data/endrem/loot_table/injections/`) instead of the
  mod's own pre-existing, working `endrem:minecraft/chests/nether_bridge` table - every other fixed
  eye (`cold_eye`, `rogue_eye`, `black_eye`, `lost_eye`, `magical_eye`) already used this "point at
  the mod's own bundled table" pattern; `nether_eye` never did. First fix attempt repointed
  `loot_to_inject_id` at the mod's real table but kept fanning it out to all 5 target chests
  (`nether_bridge` + 4 bastion room types) added for wiki-accuracy. That still crashed - pulled the
  mod's actual NeoForge 1.21.1 source
  ([`VanillaLootInjector.java`](https://github.com/Jack-Bagel/End-Remastered/blob/1.21.1/neoforge/src/main/java/com/teamremastered/endrem/utils/VanillaLootInjector.java))
  to see why: it calls `injectTable.getPool("eye_pool")` once per `loot_tables_id` entry against the
  *same* cached source-table instance, and that call only survives being made once - a second call
  against the same object throws, caught generically and logged as
  `Could not find the "eye_pool" inside the Loot Table located in: <source id>`. One source can only
  ever feed one target safely; every other confirmed-working eye already only had one. Fixed for real
  by dropping `nether_eye.json` back to a single target (`minecraft:chests/nether_bridge`, the one
  source the mod ships pre-populated at 30%) - the 4 extra bastion sources from the wiki pass are
  reverted, since this mod version can't inject one pool into more than one loot table without
  crashing. Confirmed via a real headless dedicated-server boot (see below) with zero `eye_pool`
  errors after the fix, across 5 separate boot attempts while narrowing this down.
- **All 5 MI crushed-ore crushing recipes failed to load.** `mi_crushed_ores.js` passed a bare item
  tag string (`` `#c:ores/${material}` ``) as the crushing recipe's input. Log showed every one of
  the 5 recipes (`antimony`, `iridium`, `lead`, `nickel`, `tin`) rejected at load with
  `Recipe has more fluid inputs (1) than supported (0)`, and the generated JSON revealed the tag had
  been serialized as a **fluid** ingredient (`{"type":"neoforge:tag","tag":"c:ores/tin","amount":1000}`)
  instead of an item ingredient. This is a confirmed upstream KubeJS Create bug
  ([kube-mods/kubejs#1086](https://github.com/kube-mods/kubejs/issues/1086)) affecting exactly this
  pack's `kubejs-create-neoforge-2101.3.1-build.18` build: bare tag strings get misprioritized as
  fluid ingredients over item ingredients. Fixed per the issue's documented workaround - wrapped the
  tag in an explicit item ingredient: `Ingredient.of('#c:ores/${material}').withCount(1)`.

**How this was validated:** no Minecraft-specific MCP tooling exists to drive a live client, so both
fixes were confirmed by standing up a real headless NeoForge 21.1.233 dedicated server (downloaded
the official installer, ran it against this pack's actual `mods`/`config`/`kubejs` folders copied
from the `Summerpack-1.1.8` Prism instance) and booting it end-to-end. Client-only rendering mods
(minimaps, Embeddium, shaders, tooltips, etc.) were disabled for this server-only run since they're
not designed to construct on a dedicated server and aren't relevant to loot table / recipe loading;
that's a limitation of this validation method, not a pack bug. The server booted, loaded all data,
and shut down cleanly with zero `eye_pool` or `fluid inputs` errors after both fixes landed.

**One more real bug found by cross-checking the checklist against actual log/file evidence** (not a
new claim - actually diffing every checkable item against the real `Summerpack-1.1.8` played
session log and its files):

- **Broken default keybind.** `overrides/options.txt` shipped `key_key.jei.toggleCheatMode:key.keyboard.unknown`,
  which throws `NumberFormatException: For input string: "key.keyboard.unknown"` and a
  `Failed to load options` error at boot - inherited as-is from the read-only `Viktorcraft1.0.0`
  source instance. Non-fatal (every other keybind, including the Jade keypad bindings and JEI's
  Ctrl+F search, was confirmed still present and correct in the post-session `options.txt` - only
  this one JEI-specific key choked), but real and worth cleaning up. Fixed by dropping that one
  line so cheat mode falls back to JEI's own default (unbound).

**Not a bug, ruled out during the same pass:** `arcadia-patch-create` showing up `.jar.disabled` in
the `Summerpack-1.1.8` client test instance. `modrinth.index.json` correctly declares it
`env: {server: required, client: optional}` - it's a server-side Create patch, so Prism disabling
it in a client-only test instance is expected, not a pack defect. Confirmed working correctly on a
live dedicated server.

**Known upstream issue, not fixed (out of scope):** Create: Crafts & Additions' own bundled mixing/
filling recipes (`biomass_from_*`, `netherrack`, `chocolate_cake`, `honey_cake`, `cake`, etc.) fail
to parse their fluid-tag/fluid-stack ingredients on this Create/NeoForge version
(`Unknown registry key ... neoforge:fluid_ingredient_type: minecraft:fluid_tag`) and silently fall
back to vanilla recipes. This is the addon's own recipe data, not anything in this pack's overrides
- would need a `createaddition` update or a KubeJS recipe override to fix, and isn't blocking (game
boots and plays fine either way).

## Real playtest fixes (from actual in-game screenshots, not just log/file evidence)

The user actually played the pack and reported real bugs that no amount of static/log validation
had caught:

- **Both Patchouli books were completely broken** ("Invalid book: eyeguide:eyes_guide" /
  "Invalid book: packguide:intro" shown right on the item tooltip - the books couldn't even open).
  Root cause: wrong folder structure. Per Patchouli's own docs, `book.json` belongs under
  `data/<namespace>/patchouli_books/<book>/`, but the localized content (`en_us/categories`,
  `en_us/entries`) belongs under **`assets/<namespace>/patchouli_books/<book>/`** - a completely
  different top-level folder. This pack had put *everything*, including the `en_us` content, under
  `data/`, which Patchouli doesn't scan for entries/categories at all. A book with book.json but no
  visible content anywhere gets treated as invalid. Fixed by moving `en_us/` for both books from
  `kubejs/data/...` to `kubejs/assets/...`, keeping `book.json` in `data/` where it belongs.
- **Adding Tasty Eye to the EndRem config created a real, duplicate ghost item.** Following through
  on "add tasty eye to endremastered config," `tasty_eye.json` was added to
  `config/EndRemastered-NeoForge/Eyes/`. This looked safe based on the loot-injection code
  (`VanillaLootInjector`) - but missed a second consumer of the same config:
  `CommonItemRegistry.registerEyes()` unconditionally creates a **brand-new real `EREnderEye`
  item** for every entry in that folder, registered under the `endrem` namespace using the config's
  `id` field as the item name. So this created a second, genuine `endrem:tasty_eye` item alongside
  the pack's real `eyeguide:tasty_eye` - with no texture, no lang entry (explains the raw
  `item.endrem.tasty_eye` / `item.endrem.tasty_eye.description` tooltip the user saw), and - unlike
  the earlier claim - it *would* have been a real, portal-fillable `EREnderEye` instance, since it's
  a genuine Java class instance this time, not a KubeJS item. **Fully reverted**: deleted
  `config/EndRemastered-NeoForge/Eyes/tasty_eye.json` entirely. Tasty Eye stays a pure standalone
  KubeJS item under the `eyeguide` namespace, craft-only, never touching the EndRem Eyes config
  system again. Also added a proper `item.eyeguide.tasty_eye` lang entry so its own name renders
  correctly regardless.
- **Evoker's Magical Eye drop rate raised from the mod's fixed 5% to 40%**, per request. The JsonEye
  config system only supports one fixed weight per source (baked into the mod's own bundled loot
  table, not editable), so this couldn't be tuned by just editing a number. Moved *both* of Magical
  Eye's sources (Evoker + Woodland Mansion) to LootJS `addTableModifier` calls instead of the
  JsonEye system - `magical_eye.json` is now craft/trade-only (`minecraft:empty`, matching Venus
  Eye's pattern) so there's no risk of double-counting between a JsonEye injection and a LootJS
  modifier on the same table.
- **Guide book recipes made unambiguous.** Both books previously crafted from a single shapeless
  Dirt - identical ingredient lists for two different outputs, which can make grid-crafting
  non-deterministic about which one you get. Book of Eyes stays 1x Dirt (shapeless); Summerpack
  Guide changed to a 2x2 Dirt shaped recipe, per the user's suggested fix.

Re-validated all of the above via a fresh headless dedicated-server boot: `End Remastered eyes
loaded with success`, zero `eye_pool` errors, clean shutdown. The Patchouli book-open experience
itself is client-side and couldn't be re-verified headlessly - needs a real in-game check to fully
confirm, but the folder-structure fix now matches Patchouli's documented requirements exactly.

**Still open / needs another test pass, per the user's screenshots:**
- `cold_eye` reported not appearing in igloo chests despite matching the mod's own default config
  1:1 - no root cause found yet, needs a cleaner re-test (small sample size could just be bad luck
  on a 70% roll, but flagged as unresolved rather than assumed fine).
- `nether_eye` loot not yet tested by the user.

## Round 2 of real playtest fixes

A second round of the user's actual gameplay testing (checklist version 1.1.10) confirmed most of
the round-1 work (rogue/black/lost eye loot, all 3 craft recipes, book-on-join, steel conversion,
steel ore disable, MI crushed-ore chain, wand/spear fix, Molten Vents rarity, all 3 Guns++ balance
changes, default keybinds, and - via a follow-up `/loot give` test - `cold_eye` and `nether_eye`
loot too), but also caught two of round 1's actual fixes not working, plus one new bug:

- **Round 1's Patchouli book fix didn't work - wrong convention for a modpack.** Moving book
  content from `data/` to `assets/<namespace>/patchouli_books/` (the convention documented for a
  *mod* shipping its own book) still produced "Invalid book" on both a spawn-given and a `/give`d
  copy. Patchouli's docs have a **separate, simpler convention specifically for modpacks**:
  everything - `book.json` and `en_us/` together - goes under one plain top-level folder,
  `.minecraft/patchouli_books/<book>/`, with the namespace **always** `patchouli` (not a custom
  mod ID). Confirmed this was the right path by finding the actual installed instance already had
  an empty top-level `patchouli_books/` folder - Patchouli itself creates it, expecting content
  there. Moved both books to `overrides/patchouli_books/eyes_guide/` and
  `overrides/patchouli_books/intro/`, changed the item component predicates from
  `eyeguide:eyes_guide`/`packguide:intro` to `patchouli:eyes_guide`/`patchouli:intro`. Deleted the
  now-dead `kubejs/data/eyeguide`, `kubejs/data/packguide`, and their `assets/` counterparts
  entirely. Re-validated via headless boot (no errors); the actual "does it open" experience is
  client-side and still needs a real in-game re-check.
- **Round 1's Tasty Eye revert was also wrong - the user was right to push back.** User: "Wrong, u
  need to register tasty eye through end remaster (see venus eye for example)." Investigated how
  this pack's other 6 custom eyes (`venus_eye`, `mechanical_eye`, `industrial_eye`, `lunar_eye`,
  `mars_eye`, `soul_eye`, `bee_eye` - none of which exist in the base mod either, confirmed by
  `unzip -l` on the mod jar) are actually built: a real `config/EndRemastered-NeoForge/Eyes/<id>.json`
  entry, plus `assets/endrem/models/item/<id>.json`, `assets/endrem/textures/item/<id>.png`, and a
  lang entry - exactly the pattern the round-1 fix was trying to avoid. The round-1 "duplicate
  item" bug wasn't caused by registering through the config at all - it was caused by *also*
  keeping the old standalone `eyeguide:tasty_eye` KubeJS item registered at the same time. Applied
  the full, correct pattern: `endrem:tasty_eye` is now a real config-registered eye with its own
  model/texture/lang, matching Venus Eye exactly; the old standalone KubeJS item
  (`startup_scripts/tasty_eye.js`) is deleted entirely so there's only one item. Its craft recipe
  and tooltip moved into the same files (`modded_eyes.js`, `main.js`) the other 6 custom eyes
  already use, for consistency. Re-validated via headless boot (no errors); not yet re-tested
  in-game.
- **Guns++ items in JEI: distinct entries, but every icon rendered as a plain Carrot on a Stick.**
  User: "visible all look like carrot on stick." Checked the actual installed
  `guns++-5.7.3.jar` with `unzip -l` - it contains **only** a `data/` folder, zero `assets/` at
  all (confirmed the file size, 777,858 bytes, matches Modrinth's real `5.7.3+mod` release exactly,
  so it's not a corrupted/wrong download - the mod is genuinely just a datapack with no textures of
  its own). Cross-checked Modrinth's API for the matching `5.7.3` datapack-loader release and found
  it ships as **two separate files**: the datapack itself (293KB) and a `required-resource-pack`
  (`guns1-21-(0,1)v4.3-rp.zip`, ~7MB, explicitly flagged `file_type: "required-resource-pack"`) -
  which this pack never included. Added the resource pack to `modrinth.index.json`
  (`resourcepacks/guns1-21-(0,1)v4.3-rp.zip`) and to `overrides/options.txt`'s `resourcePacks` list.
- **None of the 5 bundled resource packs were actually enabled by default.** Found while fixing the
  Guns++ resource pack above: `overrides/options.txt` never had a `resourcePacks` line at all, so
  NewGlowingOres, Fresh Moves, LowOnFire, and MandalasGUI were sitting inert in the `resourcepacks/`
  folder on every fresh install, available but not selected, unless a player manually enabled them.
  Added a `resourcePacks` line enabling all 5 (the 4 existing + Guns++) by default.

## Round 3: book category fix, Guns++ fully removed, Tasty Eye -> Holy Eye

Third round of the user's real playtest (checklist version 1.1.11) confirmed round 2's fixes made
real progress - both books now open past the title/landing page, all round-1 and round-2 fixes hold
up - but surfaced one more real bug, plus two explicit direction changes:

- **Books progressed from "Invalid book" to a new error: bad category references.** Both books now
  open and show their title/landing page (confirms the round-2 `patchouli:` namespace + top-level
  folder move was correct), but clicking into a category threw
  `Entry in file patchouli:patchouli_books/eyes_guide/en_us/entries/eyes/bee_eye.json does not have
  a valid category`. Root cause: every entry file's own `"category"` field still pointed at the
  *old* namespace (`"eyeguide:eyes"`, `"packguide:combat"`, etc.) from before the round-2 rename -
  only the book's top-level identifier had been updated, not each entry's internal pointer to its
  category. Bulk-fixed all 39 stale `"category"` references across both books to `"patchouli:..."`.
  (Left the unrelated `"recipe": "eyeguide:*_craft"` fields alone - those are real KubeJS recipe
  registry IDs, a completely different namespace concern from the book's own.) Also caught and fixed
  a second, pre-existing staleness bug while auditing every entry for accuracy: the Magical Eye and
  Nether Eye Book of Eyes pages still described their *original* drop rates/sources (Evoker at the
  old fixed 5%; Nether Eye still listing the 4 bastion sources that were reverted for crashing back
  in 1.1.9) instead of the actual current values (40%; Nether Fortress only, 30%).
- **Guns++ removed entirely, per explicit direction: "i dont like it."** Deleted the mod jar
  (`guns++-5.7.3.jar`) and its required resource pack (`guns1-21-(0,1)v4.3-rp.zip`, added just one
  round ago to fix its icons) from `modrinth.index.json`, `overrides/options.txt`'s `resourcePacks`
  list, and the repo/test-instance copies. Deleted all 51 `overrides/kubejs/data/thepa/recipe/*.json`
  rebalance overrides, the `guns_jei.js` JEI integration script, the Combat > Guns++ and
  Technology > Automating Gunpowder Summerpack Guide entries (the gunpowder-automation entry was
  written specifically to support Guns++ ammo crafting, so it went too rather than being kept as an
  orphaned, unmotivated page), and the `CLAUDE.md` catalog row. Mod count: 105 -> 104.
- **Tasty Eye replaced by Holy Eye**, per explicit direction. New lore: drops from the Aether's
  **Sun Spirit** boss (`aether:entities/sun_spirit`, found in the Sun Temple dungeon) instead of
  being crafted from food items - a **guaranteed (100%) drop**, added via LootJS
  `addTableModifier` (the same proven mechanism already used for Magical Eye's Evoker/Woodland
  Mansion sources), since Sun Spirit's loot table belongs to a different mod (Aether), not one of
  End Remastered's own bundled tables that JsonEye can target directly. The old cocoa/cake/honey
  craft recipe is removed - Holy Eye is boss-drop only. New texture (item icon + the separate
  in-frame render texture Ancient Portal Frames use, `assets/endrem/textures/block/eyes/holy_eye.png`
  - missing before, which is why the item showed as a solid magenta cube once placed in a frame):
  both generated by recoloring the previous Tasty Eye textures toward a bright, desaturated gold
  (sampled loosely from Sun Spirit's own fire-orange palette, then pushed toward "holy/radiant"
  rather than literally copying its fire-red) with brightened highlights for a glowing look. New
  lang entry (`item.endrem.holy_eye`), new tooltip, and - since Tasty Eye never actually had one -
  a brand new Book of Eyes entry documenting the real acquisition method. `holy_eye.json` stays
  registered through `config/EndRemastered-NeoForge/Eyes/` (craft/trade-only per JsonEye, matching
  Venus Eye's pattern) exactly like Tasty Eye was in round 2 - only the id, texture, lore, and
  acquisition method changed, not the underlying registration approach that round 2 already fixed.

Re-validated all of the above via a fresh headless dedicated-server boot: `End Remastered eyes
loaded with success`, zero `eye_pool` errors, zero remaining `thepa`/`guns`/`tasty` references
anywhere in the pack, clean shutdown. As before, the actual book-open and Sun Spirit boss-fight
experiences are client-side/gameplay and still need a real in-game re-check to fully confirm.

## Round 4: book text was showing literal `\n\n` instead of line breaks, plus a corrupted entry

Fourth round of playtest screenshots showed real progress from Round 3 - both books now open, load
their category pages, and show real per-eye content (Corrupted Eye, Cursed Eye, Old Eye, Guardian
Eye, Magical Eye, Wither Eye, Witch Eye, Undead Eye, Exotic Eye, Evil Eye, Cryptic Eye, Industrial
Eye, Lunar Eye, Mars Eye, Venus Eye, Soul Eye, Bee Eye, Mechanical Eye, Black Eye all rendering
correctly with icons and recipe pages) - but flagged two remaining problems: **literal `\n\n` text**
showing up instead of actual line breaks on every entry, and the **Bee Eye page overflowing/cutting
off** mid-sentence.

- **Root cause of the literal `\n\n`:** a JSON-escaping mistake in the original authoring. Every
  entry's `"text"` field used `\\n\\n` in the source JSON (i.e. the literal four-character sequence
  backslash-backslash-n-backslash-backslash-n). JSON only recognizes a *single* backslash followed
  by `n` (`\n`) as the escape for an actual newline character - a *doubled* backslash (`\\`) is
  itself the JSON escape for one literal backslash character, so `\\n` decodes to the two literal
  characters `\` and `n`, not a line break. Patchouli then just printed those two characters as-is.
  Affected all 32 book entry files that used a multi-source `\n\n`-separated layout.
  - **First attempted fix went wrong and produced invalid JSON.** A bulk find/replace intended to
    turn the escape into a real newline instead left a stray literal backslash immediately
    followed by a raw, unescaped newline character in the file - which is not valid JSON at all
    (control characters aren't allowed unescaped inside a JSON string). Caught this immediately by
    actually validating every file with a JSON parser afterward rather than assuming the edit
    worked, which is what surfaced the mistake. Redid the fix correctly, byte-for-byte, replacing
    the broken backslash+newline sequences with the proper two-character `\n` escape, then
    confirmed all 47 book JSON files parse cleanly.
- **Bee Eye had a second, unrelated problem:** a genuinely raw, unescaped newline character
  embedded directly in the middle of its text (separate from the `\\n` mistake above - this one
  had no backslash at all, just a literal line break typed into the JSON file, likely from an
  earlier manual edit to add lore text). This alone was enough to make the file invalid JSON
  regardless of the other fix. Also split Bee Eye's single overly-long page into two pages (the
  short recipe info, then the Bumblezone-access lore separately) to fix the reported overflow/
  cutoff, since it was one of the longest entries in the whole book.

Every other Book of Eyes and Summerpack Guide entry was left as-is content-wise (only the escaping
was fixed) - several other entries are similarly long and could theoretically still overflow a
single page (`end_ore_veins`, `create`, `modern_industrialization`, the pack-changes summary pages,
etc. are all 300-540 characters), but weren't reported as broken, so they weren't blindly rewritten
without evidence they're actually a problem - worth a look next playtest pass if any of them turn
out to cut off too.

**Round 4's fix was itself based on a wrong assumption, caught before it shipped.** Assumed a real
JSON `\n` (single-backslash escape, decoding to an actual newline character) would render as a
paragraph break in Patchouli, matching how newlines behave in most text formats. That's not how
Patchouli works - checked its actual open-source Java
([`BookTextParser.java`](https://github.com/VazkiiMods/Patchouli/blob/main/Xplat/src/main/java/vazkii/patchouli/client/book/text/BookTextParser.java))
rather than assume, and confirmed line breaks are **only** ever produced by the `$(br)` / `$(br2)` /
`$(p)` command syntax (matched via a `\$\(([^)]*)\)` regex) - there is no code path anywhere that
treats a raw newline character specially; it would just become part of an ordinary text `Span` and
get word-wrapped like any other whitespace, not shown as a paragraph break. So even a syntactically
valid real newline wouldn't have looked right in-game. Re-fixed all 32 affected entries again,
replacing every double-newline with `$(br2)` (paragraph break) - this is genuinely Patchouli's
documented mechanism this time, not a JSON-escaping guess. All 47 files re-validated as valid JSON.

## Round 5: Holy Eye's raw `item.endrem.holy_eye.description` tooltip line

Confirmed via user playtest (checklist version 1.1.12): "holy eye is working properly" - single
item, correct golden texture, correct "Holy Eye" name - but the tooltip showed a raw untranslated
`item.endrem.holy_eye.description` line above the actual flavor text.

Root cause: `EREnderEye.appendHoverText()` (the mod's own Java, `EREnderEye.java`) unconditionally
adds a tooltip line built from `item.%s.%s.description` (mod ID + item ID) for **every** real eye
item, with no way to opt out. None of this pack's 7 custom eyes - `mechanical_eye`, `industrial_eye`,
`lunar_eye`, `mars_eye`, `venus_eye`, `soul_eye`, `bee_eye`, and now `holy_eye` - ever had that lang
key defined, so this was a latent bug affecting all of them from the moment each was added, not
something specific to Holy Eye; it just took a player actually hovering over one to notice.

Fixed by adding `item.endrem.<id>.description` lang entries for all 7 (folding the existing 2-line
flavor text from `client_scripts/main.js`'s `ItemEvents.modifyTooltips` into one consolidated line
each), then **removing that `modifyTooltips` block entirely** - with the lang entries in place, the
mod's own built-in mechanism now produces the tooltip correctly, so the KubeJS block would only
have duplicated it. Also confirmed: **Create Crafts & Additions** and **Light Level Overlay** both
work correctly (user: "crafts and additions work", "light overlay is OK works").

## New mods: Just Zoom, Default Options

- **Just Zoom** (`justzoom_neoforge_2.1.0_MC_1.21.1.jar`) - client-only zoom keybind. Its only
  dependency, Konkrete, was already in the pack (required by Xaero's mods), so nothing else needed
  adding.
- **Default Options** (`defaultoptions-neoforge-1.21.1-21.1.7.jar`) - lets a modpack ship default
  settings that only apply on a genuinely fresh install and don't get silently overwritten on
  future pack updates once a player has customized them - a real improvement over the current
  `overrides/options.txt` approach, which reapplies on every fresh instance but has no such
  update-safety story. Its only dependency, Balm, was already in the pack too.
  **Not yet actually wired up**: this mod reads its defaults from a `config/defaultoptions/`
  folder that has to be generated *in-game* via the `/defaultoptions saveAll` command - there's no
  way to produce that folder's content headlessly or by hand-authoring JSON, it has to come from an
  actual client session with real keybind/settings state. The mod's own docs are explicit that
  `options.txt` should be dropped once this is set up (shipping both together isn't the intended
  usage), but removing `options.txt` now - before `defaultoptions saveAll` has ever been run for
  this pack - would just delete the current default keybinds with nothing to replace them. So for
  now: the mod is present and loaded, but inert, and `overrides/options.txt` remains the actual
  source of default settings until someone runs the in-game command and the output gets folded in.
- Both mods added to `modrinth.index.json` with real hashes from the Modrinth API, downloaded and
  hash-verified into the `Summerpack-1.1.8` test instance, and re-validated via a headless
  dedicated-server boot (both are client-only, so disabled for that run same as the other
  client-only mods already excluded there) - zero new errors, clean shutdown. Mod count: 104 -> 106.

## Endrem Eyes overhaul

Root cause of most "eyes never drop" reports: the mod's per-eye config
(`config/EndRemastered-NeoForge/Eyes/*.json`) had `loot_tables_id: []` for most of them, so loot
injection never ran even though the mod ships working default loot pools internally. Cross-checked
every one of the 23 eyes against the mod's own default data and the official wiki, then fixed:

- **Loot sources restored:** `cold_eye` -> Igloo Chest (70%); `rogue_eye` -> Jungle Temple (40%);
  `black_eye` -> Buried Treasure (30%, on top of the existing Shipwreck 5%); `lost_eye` ->
  Abandoned Mineshaft (20%, on top of Simple Dungeon 2.5%); `magical_eye` -> added its missing
  Woodland Mansion source (10%, via LootJS since the Eyes config only supports one pool per eye
  and Evoker already owns that slot at 5%).
- **`nether_eye`:** new loot source across all Bastion chests + Nether Fortress (10%, custom loot
  injection table). Ruined Portal was tried first but removed - its loot table isn't
  Nether-specific (ruined portals spawn in the Overworld too), confirmed wrong per your report.
- **New crafting recipes** for eyes that had zero obtain path:
  - `nether_eye`: full Netherite armor + tool set around an Eye of Ender.
  - `rogue_eye`: Cobweb, Dead Bush, Wither Rose, Tipped Arrow, Crossbow, Bow, Rabbit Hide, Leather
    around an Eye of Ender.
  - `cold_eye`: Snow, Powder Snow Bucket, Snowball, Goat Horn, Packed Ice, Ice, Blue Ice around an
    Eye of Ender.
- **Confirmed already working, no changes needed:** `witch_eye`/`undead_eye` (mob drop + craft,
  built into the mod jar), `exotic_eye` (pure vanilla craft), `evil_eye` (Cleric villager trade),
  `cryptic_eye` (1/120 chance on enchanting).
- **Book of Eyes corrections:** Exotic Eye needs 2 Conduits + 2 Glow Ink Sacs (not 1 each);
  Cryptic Eye's chance is 1/120 (~0.83%).
- Checked the wiki specifically for a **"Tasty Eye"** as requested - **it does not exist** in End
  Remastered (confirmed via the wiki's own search returning zero results). It's an original,
  non-canonical addition to this pack (see below), not a real End Remastered eye.

## New: Holy Eye (`endrem:holy_eye`, formerly Tasty Eye)

Original 24th eye (23 canonical End Remastered eyes + this one pack-original addition), not part
of the base mod. There is no official End Remastered tutorial for adding custom eyes (checked the
mod's GitHub README, its wiki - which doesn't exist - and the Fandom wiki; nothing documents
extending the eye system). A third-party "How to Create Custom Eyes" tutorial was also checked and
found to **not** describe this mod.

**Registered as a real eye through `config/EndRemastered-NeoForge/Eyes/holy_eye.json`**, matching
the exact pattern this pack's other 6 custom eyes already use (`venus_eye`, `mechanical_eye`,
`industrial_eye`, `lunar_eye`, `mars_eye`, `soul_eye`, `bee_eye` - none of which exist in the base
mod either): a JsonEye config entry, `assets/endrem/models/item/holy_eye.json`,
`assets/endrem/textures/item/holy_eye.png` + `assets/endrem/textures/block/eyes/holy_eye.png` (the
in-frame render texture), and `item.endrem.holy_eye` + `item.endrem.holy_eye.description` lang
entries (the latter added in "Round 5" above, after a latent bug affecting all 7 custom eyes -
their tooltip's mandatory description line has no other source). Craft/trade-only per JsonEye
(matches Venus Eye's config), but its *only* obtain method is a **guaranteed drop from the Aether's
Sun Spirit boss** (see "Round 3" above for the full story of the Tasty Eye -> Holy Eye redesign and
why it uses LootJS instead of JsonEye for the boss drop itself). See "Round 2 of real playtest
fixes" above for why an earlier pass tried keeping this eye as a separate standalone item instead,
and why that was wrong regardless of which specific eye it is.

## New: Book of Eyes + Summerpack Guide (Patchouli books)

- **Book of Eyes** (`patchouli:eyes_guide`) - documents all 23 canonical eyes plus Holy Eye: source,
  drop chance, and a live recipe page where applicable.
- **Summerpack Guide** (`patchouli:intro`) - introduces the pack itself: Welcome; Technology
  (Create, Modern Industrialization, AE2); Exploration & Dimensions (End Remastered, Stellaris,
  Yung's structures, Aether/Deeper&Darker/Bumblezone, End Outer Island Ore Veins); Storage &
  Utility (Waystones, Tom's Storage, Sophisticated Backpacks); Combat & Adventure (Simply Swords,
  Artifacts); and a "What This Pack Changed" summary page.
- Both books are given automatically the first time a player ever spawns (tracked per-player via
  persistent data, fires once), and can each be crafted (Book of Eyes: 1x Dirt shapeless;
  Summerpack Guide: 2x2 Dirt shaped) as a backup.
- Live under `overrides/patchouli_books/<book>/` (Patchouli's "For Modpackers" convention, always
  namespace `patchouli`) - see "Round 2 of real playtest fixes" above for why this replaced an
  earlier, incorrect mod-style `data`/`assets` split.

## Steel unification (Modern Industrialization vs Stellaris)

- Stellaris steel ingots/nuggets found in loot chests lost the `c:ingots/steel` /
  `c:nuggets/steel` / `stellaris:steel` tags (by design, to make MI steel canonical) but had no
  way to convert into something usable. Added 1:1 shapeless conversion recipes for both the ingot
  and the nugget: Stellaris -> MI.
- **Disabled Stellaris' own Steel Ore** (overworld + deepslate) via a `neoforge:remove_features`
  biome modifier, so the only steel source is MI's own ore chain. Existing Stellaris raw steel
  still smelts into MI steel (handled by the recipe replacement above).

## Modern Industrialization x Create compat

- **Crushed-ore chain:** Create crushing-wheel support for the 5 MI ores with no Create compat out
  of the box (Antimony, Iridium, Lead, Nickel, Tin - Silver has no MI ore block so it's excluded).
  New `packfixes:crushed_raw_<material>` items; crushing recipe mirrors Create's own vanilla ore
  crushing (1x guaranteed + 75% chance second + 75% chance XP nugget); furnace/blast furnace
  recipe turns the crushed item into the ingot. **Custom textures added** (previously an
  unmodified `create:item/crushed_raw_iron` placeholder shared by all 5): generated by recoloring
  Create's crushed-ore shape toward each material's real MI ingot color (sampled directly from
  `modern_industrialization`'s own ingot textures), so each material is visually distinct and
  consistent with the pack's existing art.
- **Molten Vents rarity** tripled (land: chance 1000 -> 3000, aquatic: 690 -> 2070), per the mod's
  GitHub source since the installed jar couldn't be inspected directly at the time.
- **Molten Vents mechanic corrected in the (now-postponed) quest content:** the original quest
  description was wrong about how vents work. Real mechanic: find the dormant vent, blow it up
  with TNT to activate it, then pump lava into the resulting block - it then grows more orestone
  around itself over time (genuinely renewable). Verified the ore mapping directly against
  Create's own crushing recipes: Veridium -> Copper, Crimsite -> Iron, Ochrum -> Gold,
  Asurine -> Zinc. **Scoria and Scorchia have no crushing recipe at all** in vanilla Create (nor
  does Molten Vents add one) - contradicts the "just one of them is useless" assumption; both
  appear to be dead ends, worth confirming in-game since this is surprising enough to double-check.

## Building Wands x Simply Swords recipe conflict fix

Building Wands (Iron/Diamond wand - this build has no Gold tier at all, only
Stone/Copper/Iron/Diamond/Netherite per `config/wands.json`) and Simply Swords (Iron/Diamond
spear) shipped the exact same shaped recipe (ingot/gem + 2 sticks on an anti-diagonal), so only
one of the two was ever craftable per tier. Re-shaped the two colliding wand recipes (mirrored
diagonal) so both the wand and the spear work. Simply Swords' spear recipes were left untouched
since other addon-compat spears (Gobber, Mythic Metals) assume that same shape.

## Fixed: MI pipe item textures missing (2D icon override)

Root cause: **Continuity** breaks the custom 3D `modern_industrialization:delegate` item model
loader used by all 40 pipe items (16 colors x item/fluid pipe, base item/fluid pipe, 6
machine-casing pipes), leaving them with no texture at all in inventories. Tracked upstream as
[AztechMC/Modern-Industrialization#1264](https://github.com/AztechMC/Modern-Industrialization/issues/1264)
("invisible cable/pipes?") - **re-checked and confirmed still open/unfixed upstream** (checked
directly via the GitHub API: `state: open`, `closed_at: null`), so this pack's own workaround
below remains necessary and shouldn't be reverted. Fixed by overriding all 40 to plain vanilla
`minecraft:item/generated` (flat 2D icon): the 6 machine-casing pipes reuse their own existing
16x16 block texture directly (look fine as-is); the 16 colored item/fluid pipes reuse MI's pipe
surface texture (not designed as a standalone icon) with a `minecraft:constant` tint matching the
pipe's dye color, so they're at least color-coded and distinguishable, if not pretty. MI
cables/ME wires use the identical broken delegate loader and likely have the same bug, but
weren't touched (out of the original ask's scope).

## End Outer Island Ore Veins

New, End-exclusive worldgen feature: large ore veins on the outer End islands (`end_highlands`,
`end_midlands`, `end_barrens`, `small_end_islands`) - explicitly not the central island, and not
anywhere in any other dimension. Six vein types (`minecraft:ore` blob, size 48-64, rare per-chunk
placement, replacing End Stone):

| Vein | Ores | Rarity (1 in N chunks) |
|---|---|---|
| Ferrous | Iron, Coal | 48 |
| Conductive | Copper, Gold | 56 |
| Light Metals | Bauxite, Tin, Antimony | 64 |
| Battery Metals | Nickel, Lead, Lignite Coal, Salt | 72 |
| Refractory Metals | Titanium, Tungsten, Platinum | 96 |
| Exotic | Iridium, Uranium, Monazite, MI Quartz | 140 |

Covers every MI ore with an actual mineable block (Silver has none, so it's absent by design) plus
vanilla Iron/Coal/Copper/Gold. Wired in via a `neoforge:add_features` biome modifier targeting
only those 4 biomes.

## Guns++ integration and rebalance - **removed entirely, see "Round 3" above**

This section documented Guns++'s integration for the record (gun frame steel rebalance, bullet
lead/bronze rebalance, gunpowder automation, JEI support via `guns_jei.js`) across most of this
session. **Removed in full per explicit direction** ("REMOVE ALL GUNS++ things... i dont like it")
- the mod jar, its required resource pack, all 51 recipe overrides, the JEI script, and its guide
book entries are all gone. See "Round 3: book category fix, Guns++ fully removed, Tasty Eye -> Holy
Eye" above for the removal details.

## Default keybinds and curated configs

Pulled from `Viktorcraft1.0.0` (an earlier real play-through of this pack, same mod list, **read
only** - nothing there was modified).

- **`overrides/options.txt`** (new): all 228 `key_*` keybind lines from that instance and nothing
  else (no video/audio/personal settings - Minecraft falls back to hardcoded defaults for whatever
  isn't present). Ships sensible keybinds for things mods leave unbound (Xaero, JEI, Jade on
  keypad, AE2, Create, Quark, etc.). Only takes effect on a genuinely fresh instance - Minecraft
  won't overwrite an existing `options.txt`.
- **Config files copied** (UI/display preference only, each verified non-gameplay-affecting): JEI
  (client/colors/mod-id-format/sort-order), Xaero minimap + world map + HUD, Sound Physics
  Remastered (all 4 files), `oculus.properties`, `create-client.toml`, `ferritecore-mixin.toml`,
  `fml.toml`, `fabric/indigo-renderer.properties`.
- **Deliberately not copied**, each checked and excluded for a specific reason:
  `config/EndRemastered-NeoForge/Eyes/*.json` (that instance has the *old, broken* eye configs
  from before the fixes above - copying would have silently undone the entire eyes overhaul);
  `embeddium-fingerprint.json`/`embeddium-options.json` (tied to that specific GPU);
  `voicechat/player-volumes.properties`, PatPat's player-list/stats files (personal per-player
  data); `quark-common.toml` (real gameplay feature toggles, not just cosmetic - didn't want to
  silently change balance without a dedicated pass); `config/jei/world/` and `config/spark/tmp/`
  (per-save history / cache, not settings).

## FTB Quests - postponed

Wanted a full FTB Quests progression tree (18 chapters, 83 quests across 5 chapter groups, with
real cross-mod dependency ordering and a dedicated 24-quest Eyes chapter using Advancement tasks
for the 7 eyes that have them). Content is fully written as SNBT (FTB Quests has no KubeJS
authoring API for quest structure, confirmed via research - it's hand/GUI-authored data like
everything else). **Blocked on the mods themselves:** confirmed via the Modrinth API that
**FTB Library, FTB Teams, and FTB Quests don't exist on Modrinth at all** (checked both
`ftb-quests`/`ftb-quests-forge` slugs and full-text search - zero hits for the real mods). They're
on CurseForge, but the file-download page is gated behind a Cloudflare JS challenge that can't be
scripted around.

Rather than keep blocking releases on this, **moved (not deleted) `overrides/config/ftbquests/` to
`backup/ftbquests-questline/`** (outside `overrides/`, so excluded from the `.mrpack`), along with
the generator script and a README on how to restore it once the 3 mods are actually available -
either drop their jars in the repo root (same trick as Guns++) or once Modrinth/CurseForge access
allows a direct add.

## Mod additions

| Mod | Version | Note |
|---|---|---|
| ~~Guns++~~ | ~~5.7.3~~ | you provided the jar directly - **removed in Round 3, see above** |
| Create: Power Loader | 2.0.5-mc1.21.1 | added via GitHub releases during a Modrinth outage, later re-pointed at the real Modrinth CDN link once access was restored |
| Chisel Reborn | neoforge-1.21.1-1.8.1 | requested directly |
| Controlling | 19.0.5 | requested directly |
| Create Crafts & Additions | 1.5.2 | confirmed as the right `createaddition` |
| Light Level Overlay | 1.3.0 | picked over "Light Overlay" - this one has a build targeting 1.21.1 exactly |
| Athena | 4.0.6 | required dependency of Chisel Reborn (CTM texture library), wasn't in the pack yet |
| Searchables | 1.0.2 | required dependency of Controlling (adds its search bar) |

**Not added: Dave's Potioneering.** Checked every Modrinth version - stops at Minecraft 1.20.1
(Fabric only), no NeoForge support and nothing for 1.21.x.

**Already installed, no action needed:** Nether Portal Fix
(`netherportalfix-neoforge-1.21.1-21.1.1.jar`).

Also fixed a **pre-existing** broken entry unrelated to anything added this session:
`arcadia-patch-create` had a bare-domain placeholder URL (not a real file link) and a stale
hash/filesize, which only surfaced once Prism tried a full fresh download of all 105 mods instead
of relying on files already present locally. Re-resolved against Modrinth, verified by downloading
it myself and comparing hashes. Swept all entries for the same class of bug afterward - nothing
else was broken, and every entry now downloads from `cdn.modrinth.com` (nothing from GitHub or
elsewhere).

## `CLAUDE.md` - mod catalog

New project-root reference doc: one table per category (Technology, Exploration & Dimensions,
Combat & Adventure, Storage & Utility, Decoration, Performance, UI/QoL, Library/API,
resource/shader packs) covering all 105 mods, plus a short section on pack-original content.

## Testing infrastructure

`Victorpack_v1-02-test` (Prism instance: copy of an earlier real playthrough instance + this
session's `overrides` + every newly-added mod jar already sitting in its `mods` folder, no
download needed) stays synced after every change and is the primary local test target. A fresh
`Summerpack-1.1.8.mrpack` build was also spot-checked by importing into a brand-new instance and
diffing its downloaded `mods`/`resourcepacks`/`shaderpacks` against `modrinth.index.json` - matched
exactly except `arcadia-patch-create` showing up `.disabled` (correctly downloaded, just toggled
off - worth checking that's intentional).

## Known issues

- **MI cables/ME wires** likely have the same missing-texture bug as pipes (same broken delegate
  loader), not yet fixed - out of the original ask's scope.
- **Molten Vents Scoria/Scorchia** - need in-game confirmation neither actually yields ore, since
  that contradicts the original assumption that only one of them is a dead end.
- **Holy Eye / Sun Spirit drop** and the **book category fix** are both not yet re-tested in-game
  as of this writing - see "Round 3" above.
- **FTB Quests** postponed, see above.

## Verification checklist

Moved to its own file: **`CHECKLIST.md`** (project root), kept separate so it can be updated
without bloating this file's diff on every pass.

## Files touched (representative, not exhaustive - see git history / diff for the full list)

- `overrides/config/EndRemastered-NeoForge/Eyes/{cold,rogue,nether,black,lost,magical,holy}_eye.json`
- `overrides/patchouli_books/{eyes_guide,intro}/**` (Book of Eyes + Summerpack Guide - the
  "For Modpackers" top-level convention, namespace always `patchouli`; all `"category"` references
  fixed to match in Round 3)
- `overrides/kubejs/data/packfixes/neoforge/biome_modifier/{disable_stellaris_steel_ore,end_outer_island_ore_veins}.json`
- `overrides/kubejs/data/packfixes/worldgen/{configured_feature,placed_feature}/end_vein_*.json` (12 files)
- `overrides/kubejs/data/molten_vents/worldgen/placed_feature/*.json` (12 files)
- `overrides/kubejs/assets/modern_industrialization/models/item/*.json` (40 files, pipe icon fix)
- `overrides/kubejs/assets/endrem/{models/item,textures/item,textures/block/eyes}/holy_eye.{json,png}`,
  `overrides/kubejs/assets/endrem/lang/en_us.json`
- `overrides/kubejs/startup_scripts/mi_crushed_ores.js`
- `overrides/kubejs/client_scripts/main.js`
- `overrides/kubejs/server_scripts/{nether_eye,rogue_eye,cold_eye,mi_crushed_ores,wand_spear_conflict_fix,steel_unification,modded_eyes,mechanical_eye,magical_eye_woodland_mansion,guide_books_give,holy_eye_sun_spirit}.js`
- `overrides/options.txt` (default keybinds + `resourcePacks` enabling all 4 bundled packs)
- `overrides/config/{jei,xaero,sound_physics_remastered,...}` (curated default configs, see above)
- `CLAUDE.md`, `CHECKLIST.md` (new, project root)
- `backup/ftbquests-questline/`, `backup/gen_ftbquests.js`, `backup/README.md` (postponed quest content)
- `chisel-neoforge-1.21.1-1.8.1.jar`, `Controlling-neoforge-1.21.1-19.0.5.jar`, `createaddition-1.5.2.jar`, `lightleveloverlay-neoforge-1.3.0+mc1.21.1.jar`, `athena-neoforge-1.21.1-4.0.6.jar`, `Searchables-neoforge-1.21.1-1.0.2.jar` (repo root)
- `modrinth.index.json` (version 1.0.1 -> 1.1.12; mods + resource pack changes across all rounds)
- **Removed in Round 3:** `guns++-5.7.3.jar`, `resourcepacks/guns1-21-(0,1)v4.3-rp.zip`,
  `overrides/kubejs/data/thepa/recipe/*.json` (51 files),
  `overrides/kubejs/client_scripts/guns_jei.js`,
  `overrides/patchouli_books/intro/en_us/entries/{combat/guns,technology/gunpowder}.json`,
  `overrides/kubejs/startup_scripts/tasty_eye.js` and `server_scripts/tasty_eye.js` (superseded by
  `holy_eye_sun_spirit.js` + the `modded_eyes.js` entry)
