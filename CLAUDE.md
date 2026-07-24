# Summerpack — Mod Index

Minecraft NeoForge 1.21.1 modpack. 107 mods, distributed as a Modrinth-format `.mrpack`
(`modrinth.index.json` + `overrides/`). This file is a reference catalog — see `changelog.md` for
the history of pack-specific fixes/additions, and the in-game **Summerpack Guide** / **Book of
Eyes** Patchouli books for player-facing explanations.

**Tags column**: `tech` automation/machines, `storage` item/fluid storage, `utility` general
gameplay QoL feature (not UI), `combat` weapons/fighting, `exploration` traversal/finding things,
`worldgen` adds world content (structures/ores/dimensions), `decoration` cosmetic blocks,
`ui` client-side interface/HUD QoL, `perf` performance/optimization, `audio` sound/music,
`lib` silent shared dependency, no direct player-facing content. **`has-guide`** marks mods that
ship their *own* in-game documentation (a book, Ponder, etc.) - the Summerpack Guide should link to
these rather than duplicate their content; see "Summerpack Guide coverage" below for the actual
audit of what's covered vs. what should just link out.

## Technology

| Mod | Filename | Tags | Role |
|---|---|---|---|
| Modern Industrialization | `Modern-Industrialization-2.5.1.jar` | tech, storage | Main EU-based tech tree, LV-UHV, pipes/cables/multiblocks. This pack's canonical "steel" source. |
| Applied Energistics 2 | `appliedenergistics2-19.2.17.jar` | tech, storage, has-guide | Digital (ME) item/fluid storage network. Has its own in-game guide via GuideMe (below) - Summerpack Guide's AE2 entry links to it rather than re-explaining the whole system. |
| GuideMe | `guideme-21.1.16.jar` | lib | AE2's in-game guidebook framework. |
| Create | `create-1.21.1-6.0.10.jar` | tech, has-guide | Mechanical rotation-based automation — the pack's other tech spine. Ships Ponder (in-world animated tutorials, right-click any Create item/block with the Ponder-bound key) - Summerpack Guide's Create entry points players at Ponder instead of re-teaching kinetic mechanics. |
| Create: Crafts & Additions | `createaddition-1.5.2.jar` | tech | Create addon: bridges Create kinetic energy and FE/electricity. |
| Create: Copycats+ | `copycats-3.0.4+mc.1.21.1-neoforge.jar` | tech, decoration | Create addon: camouflage blocks (Copycat Blocks/Stairs/Slabs/Doors/etc.) that mimic any other block's texture - lets Create contraptions/builds blend into any build style. Requires Create (already in pack); optional JEI integration (already in pack) - no extra dependencies needed. |
| Create: Power Loader | `create_power_loader-2.0.5-mc1.21.1.jar` | tech | Create addon: andesite/brass chunk loaders. |
| Create Contraption Terminals | `createcontraptionterminals-1.21-1.3.0.jar` | tech, ui | Create addon: remote-control terminals for contraptions. |
| Create Better Villagers | `create_better_villagers-1.3.2.jar` | worldgen | Create-flavored villager trade/profession additions. |
| Arcadia Patch: Create | `arcadia-patch-create-1.4.2.jar` | lib | Bugfix/compat patch for Create. |
| Molten Vents | `molten_vents-1.21.1-2.1.1.jar` | tech, worldgen | Renewable Create-orestone-generating vents. Rarity was mistakenly tripled (made 3x *rarer*, not more common - `rarity_filter` chance is inverse to frequency) then corrected back down to genuinely 3x more common than the mod's own default. |
| KubeJS: Create | `kubejs-create-neoforge-2101.3.1-build.18.jar` | lib | KubeJS bridge for Create recipe types (`create:crushing`, etc.). |
| Ponder (KubeJS) | `ponderjs-neoforge-1.21.1-2.4.0.jar` | lib | KubeJS bridge for Create's in-game Ponder tutorial system. |

## Exploration & Dimensions

| Mod | Filename | Tags | Role |
|---|---|---|---|
| End Remastered | `endrem-neoforge-1.21.X-6.0.2.jar` | exploration, worldgen, has-guide | Custom 23-eye progression system gating the End portal — see Book of Eyes (this pack's own dedicated book for it). |
| Stellaris | `stellaris-1.21-neoforge-1.4.23.jar` | exploration, tech, worldgen | Rocket-based space travel to Moon/Mars/Venus/Mercury; also the source of this pack's original (now-disabled) Steel ore. |
| The Aether | `aether-1.21.1-1.5.10-neoforge.jar` | exploration, worldgen | Peaceful sky dimension with its own progression/bosses. Also the source of Holy Eye (pack-original, drops from the Sun Spirit boss). |
| Deeper and Darker | `deeperdarker-neoforge-1.21.1-1.4.1.jar` | exploration, worldgen | Expanded, more dangerous Deep Dark. |
| The Bumblezone | `the_bumblezone-7.15.0+1.21.1-neoforge.jar` | exploration, worldgen | Bee-themed dimension, reached via beehives. |
| Nullscape | `Nullscape_1.21.x_v1.2.14.jar` | worldgen, decoration | End dimension terrain/biome overhaul. |
| Yung's Better Dungeons | `YungsBetterDungeons-1.21.1-NeoForge-5.1.4.jar` | worldgen | Structure overhaul. |
| Yung's Better Mineshafts | `YungsBetterMineshafts-1.21.1-NeoForge-5.1.1.jar` | worldgen | Structure overhaul. |
| Yung's Better Strongholds | `YungsBetterStrongholds-1.21.1-NeoForge-5.1.3.jar` | worldgen | Structure overhaul. |
| Yung's Better Nether Fortresses | `YungsBetterNetherFortresses-1.21.1-NeoForge-3.1.5.jar` | worldgen | Structure overhaul. |
| Yung's Better Jungle Temples | `YungsBetterJungleTemples-1.21.1-NeoForge-3.1.2.jar` | worldgen | Structure overhaul. |
| Yung's Better Ocean Monuments | `YungsBetterOceanMonuments-1.21.1-NeoForge-4.1.2.jar` | worldgen | Structure overhaul. |
| Yung's Better Witch Huts | `YungsBetterWitchHuts-1.21.1-NeoForge-4.1.1.jar` | worldgen | Structure overhaul. |
| Yung's Better End Island | `YungsBetterEndIsland-1.21.1-NeoForge-3.1.2.jar` | worldgen | End main-island overhaul. |
| Yung's Bridges | `YungsBridges-1.21.1-NeoForge-5.1.1.jar` | worldgen | Nether bridge structure variety. |
| Yung's API | `YungsApi-1.21.1-NeoForge-5.1.6.jar` | lib | Shared library for all Yung's mods above. |
| Yung's Extras | `YungsExtras-1.21.1-NeoForge-5.1.1.jar` | lib | Shared library for all Yung's mods above. |
| Underground Village | `underground_village-neoforge-1.21.1-2.0.jar` | worldgen | New underground village structure. |
| Villages and Pillages | `villagesandpillages-neoforge-mc1.21.1-1.0.3.jar` | worldgen | Village/pillager structure additions. |
| Dungeons and Taverns | `dungeons-and-taverns-v4.4.4.jar` | worldgen | Extra vanilla-loot structures (dungeons + tavern safe-havens). |
| Towns and Towers | `t_and_t-neoforge-fabric-1.13.9+1.21.1.jar` | worldgen, decoration | Structure/decoration additions (building-focused, not food despite the earlier assumption otherwise). |
| Formations | `formations-1.0.4-neoforge-mc1.21.jar` | worldgen, decoration | Overworld terrain decoration feature. |
| Formations: Nether | `formationsnether-1.0.5-mc1.21+.jar` | worldgen, decoration | Nether terrain decoration feature. |
| Guard Villagers | `guardvillagers-2.4.10-1.21.1.jar` | worldgen, combat | Villagers/iron golems fight back when attacked. |
| Immersive Aircraft | `immersive_aircraft-1.4.6+1.21.1-neoforge.jar` | exploration | Craftable planes/airships/gyrocopters for exploration. |

## Combat & Adventure

| Mod | Filename | Tags | Role |
|---|---|---|---|
| Simply Swords | `simplyswords-neoforge-1.63.0-1.21.1.jar` | combat | Adds Spears, Glaives, Katanas, Rapiers, and more weapon types. |
| Better Combat | `bettercombat-neoforge-2.3.2+1.21.1.jar` | combat | Combat animation/mechanics overhaul. |
| Artifacts | `artifacts-neoforge-13.2.1.jar` | combat, utility | Accessory items (rings/charms/trinkets) with passive effects. |
| Potentials | `potentials-neoforge-1.21-0.7.1.jar` | combat, utility | Passive perk/trait system. |

## Storage & Utility

| Mod | Filename | Tags | Role |
|---|---|---|---|
| Sophisticated Backpacks | `sophisticatedbackpacks-1.21.1-3.25.65.1955.jar` | storage | Upgradeable portable storage. |
| Sophisticated Core | `sophisticatedcore-1.21.1-1.4.62.2079.jar` | lib | Shared library for Sophisticated Backpacks. |
| Tom's Storage | `toms_storage-1.21-2.3.2.jar` | storage, tech | Lightweight networked-chest storage terminal. |
| Waystones | `waystones-neoforge-1.21.1-21.1.34.jar` | exploration, utility | Placeable fast-travel points. |
| Lootr | `lootr-neoforge-1.21.1-1.11.37.121.jar` | utility | Per-player loot chests (no more racing friends to loot). |
| Chunky | `Chunky-NeoForge-1.4.23.jar` | utility | Server-side chunk pregenerator (command-driven, `/chunky`). |
| Nature's Compass | `NaturesCompass-1.21.1-3.4.0-neoforge.jar` | exploration, utility | Locates the nearest biome of a chosen type. |
| Gravestone | `gravestone-neoforge-1.21.1-1.0.37.jar` | utility | Death-location grave/inventory recovery. |
| Building Wands | `BuildingWands-neoforge-MC1.21.1-3.0.5.jar` | utility | Place many blocks at once from inventory; this session fixed a recipe collision with Simply Swords' spears. |

## Decoration & World Content

| Mod | Filename | Tags | Role |
|---|---|---|---|
| Chisel Reborn | `chisel-neoforge-1.21.1-1.8.1.jar` | decoration | Decorative block variants (chiseled/carved variants of vanilla blocks). |
| Athena | `athena-neoforge-1.21.1-4.0.6.jar` | lib | Shared library, required by Chisel Reborn. |
| Geophilic | `Geophilic v3.6.mod.jar` | decoration, worldgen | Extra biome-appropriate grass/flower decoration. |

## Performance & Optimization

| Mod | Filename | Tags | Role |
|---|---|---|---|
| Lithium | `lithium-neoforge-0.15.4+mc1.21.1.jar` | perf | General server-side performance optimizations. |
| Embeddium | `embeddium-1.0.15+mc1.21.1.jar` | perf | Sodium-family rendering optimizer (NeoForge port). |
| ModernFix | `modernfix-neoforge-5.27.14+mc1.21.1.jar` | perf | Startup time / memory optimizations. |
| FerriteCore | `ferritecore-7.0.3-neoforge.jar` | perf | Memory usage optimizations. |
| ImmediatelyFast | `ImmediatelyFast-NeoForge-1.6.10+1.21.1.jar` | perf | Rendering optimizations. |
| Faster Paths | `faster-paths-2.3.1-1.21.jar` | perf | Mob pathfinding optimization. |
| Neoculus | `neoculus-mc1.21.1-1.8.7.jar` | perf, lib | Oculus/Iris shader-loader compatibility layer for NeoForge. |

## UI & Quality of Life

| Mod | Filename | Tags | Role |
|---|---|---|---|
| JEI (Just Enough Items) | `jei-1.21.1-neoforge-19.27.0.343.jar` | ui | Recipe/usage viewer. |
| JEI Worldgen Addon | `jeiworldgen-neoforge-1.21.1-1.3.0.jar` | ui | Adds ore/loot worldgen info to JEI. |
| Just Enough Resources | `JustEnoughResources-NeoForge-1.21.1-1.6.0.17.jar` | ui | Adds resource-location info (ore gen, mob drops) to JEI. |
| Jade | `Jade-1.21.1-NeoForge-15.10.5.jar` | ui | Block/entity info tooltip overlay (WAILA-style). |
| Simply Tooltips | `SimplyTooltips-neoforge-0.1.3.jar` | ui | Tooltip visual style overhaul. |
| Xaero's Minimap | `xaerominimap-neoforge-1.21.1-26.1.0.jar` | ui, exploration | Minimap. |
| Xaero's World Map | `xaeroworldmap-neoforge-1.21.1-1.41.2.jar` | ui, exploration | Full world map. |
| Mouse Tweaks | `MouseTweaks-neoforge-mc1.21-2.26.1.jar` | ui | Inventory drag/scroll QoL. |
| Chat Heads | `chat_heads-0.15.2-neoforge-1.21.jar` | ui | Discord-style chat avatar heads. |
| Not Enough Animations | `notenoughanimations-neoforge-1.12.4-mc1.21.1.jar` | ui | Extra first/third-person player animations. |
| Better F3 | `BetterF3-11.0.3-NeoForge-1.21.1.jar` | ui | Cleaned-up/extended debug screen. |
| Better Advancements | `BetterAdvancements-NeoForge-1.21.1-0.4.3.21.jar` | ui | Improved advancement screen UI. |
| Controlling | `Controlling-neoforge-1.21.1-19.0.5.jar` | ui | Adds a search bar to the Controls/Keybinds menu. |
| Searchables | `Searchables-neoforge-1.21.1-1.0.2.jar` | lib | Shared library, required by Controlling. |
| Light Level Overlay | `lightleveloverlay-neoforge-1.3.0+mc1.21.1.jar` | ui, utility | Shows mob-spawn light levels on blocks. |
| Just Zoom | `justzoom_neoforge_2.1.0_MC_1.21.1.jar` | ui | Adjustable zoom keybind (client-only). |
| Default Options | `defaultoptions-neoforge-1.21.1-21.1.7.jar` | ui | Ships modpack-default settings via `overrides/config/defaultoptions/{options.txt,keybindings.txt}`, generated via `/defaultoptions saveAll` and now wired up - applies only on first launch, never overwrites a player's own changes on updates. Replaces the old raw `overrides/options.txt` approach (both can't coexist - a pre-seeded root `options.txt` makes the mod see settings already exist and do nothing, so it was removed). |
| AppleSkin | `appleskin-neoforge-mc1.21-3.0.9.jar` | ui | Hunger/saturation HUD info. |
| Sound Physics Remastered | `sound-physics-remastered-neoforge-1.21.1-1.5.1.jar` | audio | Reverb/occlusion audio realism. |
| Simple Voice Chat | `voicechat-neoforge-1.21.1-2.6.20.jar` | audio, utility | Proximity voice chat. |
| Melody | `melody_neoforge_1.0.10_MC_1.21.jar` | audio | Custom music/soundtrack system. |
| Patchouli | `Patchouli-1.21.1-93-NEOFORGE.jar` | ui, lib | In-game guidebook framework — powers this pack's Book of Eyes and Summerpack Guide. |
| Nether Portal Fix | `netherportalfix-neoforge-1.21.1-21.1.1.jar` | utility | Fixes vanilla Nether portal linking bugs. |
| PatPat | `PatPat-1.2.4+1.21.1+neoforge.jar` | ui | Pet/companion interaction QoL mod. |
| Continuity | `continuity-3.0.0+1.21.neoforge.jar` | ui, decoration | Connected-texture (CTM) resource pack support. **Known to break Modern Industrialization pipe/cable item icons** — see changelog. Also has an open, unresolved upstream bug affecting AE2 facade transparency (PepperCode1/Continuity#682) — no config/blacklist mechanism exists to exclude specific mods' models; not yet confirmed broken in this pack. |
| Quark | `Quark-4.1-481.jar` | decoration, worldgen, ui | Large vanilla-style QoL/decoration/world-gen content mod. |

## Library / API (silent dependencies)

| Mod | Filename | Tags | Role |
|---|---|---|---|
| KubeJS | `kubejs-neoforge-2101.7.2-build.368.jar` | lib | Scripting engine — powers essentially every custom fix/addition in this pack. |
| Rhino | `rhino-2101.2.7-build.85.jar` | lib | JavaScript engine backing KubeJS. |
| LootJS | `lootjs-neoforge-1.21.1-3.7.0.jar` | lib | KubeJS addon for loot table scripting (used for `magical_eye`'s Woodland Mansion source and Holy Eye's Sun Spirit source). |
| Kotlin for Forge | `kotlinforforge-5.12.0-all.jar` | lib | Kotlin runtime, required by several mods. |
| Architectury API | `architectury-13.0.8-neoforge.jar` | lib | Cross-loader mod API used by many multi-platform mods. |
| Cloth Config | `cloth-config-15.0.140-neoforge.jar` | lib | Shared config-screen library. |
| Balm | `balm-neoforge-1.21.1-21.0.59.jar` | lib | Shared library (Gravestone, Guard Villagers, etc.). |
| Konkrete | `konkrete_neoforge_1.9.9_MC_1.21.jar` | lib | Shared library, required by Xaero's mods and Just Zoom. |
| Resourceful Lib | `resourcefullib-neoforge-1.21-3.0.12.jar` | lib | Shared library. |
| Owo-lib | `owo-lib-neoforge-0.12.15.5-beta.1+1.21.jar` | lib | Shared library. |
| Better Lib | `better_lib-neoforge-1.21.1-1.0.109.jar` | lib | Shared library. |
| Zeta | `Zeta-1.1-40.jar` | lib | Shared library, required by Quark. |
| Connector | `connector-2.0.0-beta.14+1.21.1-full.jar` | lib | Runs Fabric-only mods on NeoForge. |
| Forgified Fabric API | `forgified-fabric-api-0.116.7+2.2.4+1.21.1.jar` | lib | Fabric API compatibility shim, required by Connector-loaded mods. |
| CristelLib | `cristellib-neoforge-1.21.1-3.1.7.jar` | lib | Shared library, required by several Yung's/structure mods. |
| Caelus API | `caelus-neoforge-7.0.1+1.21.1.jar` | lib | Elytra-flight capability API, required by Artifacts and others. |
| Fzzy Config | `fzzy_config-0.7.6+1.21+neoforge.jar` | lib | Shared config library. |
| Player Animation Lib | `player-animation-lib-forge-2.0.4+1.21.1.jar` | lib | Shared library, required by Not Enough Animations. |
| Inline | `inline-neoforge-1.21.1-1.2.2.jar` | lib, perf | Datapack function inlining/performance library. |
| Spark | `spark-1.10.124-neoforge.jar` | perf | Performance profiler (diagnostic tool, not gameplay). |

## Resource packs & shader packs (bundled)

| File | Type | Role |
|---|---|---|
| `NewGlowingOres-§6[Border]§r.zip` | Resource pack | Glowing ore highlight textures. |
| `-1.21.2 Fresh Moves v3.1 (With Animated Eyes).zip` | Resource pack | Animated player model textures. |
| `LowOnFire v26.1§8.zip` | Resource pack | Fire overlay texture replacement. |
| `MandalasGUI+Dakmode_1.21.6_v2.1.zip` | Resource pack | GUI/menu texture theme. |
| `ComplementaryReimagined_r5.8.1.zip` | Shader pack | Shaders (needs Neoculus/Oculus to run). |

## Pack-original content (not from any mod)

- `endrem:holy_eye` — a 24th, non-canonical Ender Eye variant original to this pack (End
  Remastered itself only has 23), boss-drop only from the Aether's Sun Spirit. Registered as a
  real eye through End Remastered's own config system (`config/EndRemastered-NeoForge/Eyes/
  holy_eye.json`), matching the pattern used for `venus_eye`/`bee_eye`/etc. — only its texture,
  model, and lore are pack-original, not the registration mechanism. See Book of Eyes.
- `packfixes:crushed_raw_<antimony|iridium|lead|nickel|tin>` — Create-crushing-compatible items
  for 5 Modern Industrialization ores that had no Create integration out of the box.
- Steel unification, End outer-island ore veins, and all other pack-specific worldgen/recipe
  changes — see `changelog.md` for the full history.
