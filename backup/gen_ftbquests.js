const fs = require('fs');
const path = require('path');

const OUT = 'C:/Users/ondra/OneDrive/Dokumenty/Projects/victorpack_v1-01/overrides/config/ftbquests/quests';

let counter = 1;
function nextId() {
  return (counter++).toString(16).toUpperCase().padStart(16, '0');
}

// registry: key -> id, for cross references (chapters, groups, quests)
const ids = {};
function idFor(key) {
  if (!ids[key]) ids[key] = nextId();
  return ids[key];
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function taskSnbt(chapterKey, questKey, task, idx) {
  const tid = idFor(`${chapterKey}.${questKey}.task${idx}`);
  if (task.type === 'item') {
    return `{
			count: ${task.count || 1}L
			id: "${tid}"
			item: "${task.item}"
			type: "item"
		}`;
  }
  if (task.type === 'advancement') {
    return `{
			advancement: "${task.advancement}"
			id: "${tid}"
			type: "advancement"
		}`;
  }
  if (task.type === 'checkmark') {
    return `{
			id: "${tid}"
			type: "checkmark"
		}`;
  }
  if (task.type === 'dimension') {
    return `{
			dimension: "${task.dimension}"
			id: "${tid}"
			type: "dimension"
		}`;
  }
  if (task.type === 'kill') {
    return `{
			entity: "${task.entity}"
			id: "${tid}"
			type: "kill"
			value: ${task.count || 1}L
		}`;
  }
  throw new Error('unknown task type ' + task.type);
}

function rewardSnbt(chapterKey, questKey, reward, idx) {
  const rid = idFor(`${chapterKey}.${questKey}.reward${idx}`);
  if (reward.type === 'item') {
    return `{
			count: ${reward.count || 1}
			id: "${rid}"
			item: "${reward.item}"
			type: "item"
		}`;
  }
  if (reward.type === 'xp') {
    return `{
			id: "${rid}"
			type: "xp"
			xp: ${reward.xp}
		}`;
  }
  if (reward.type === 'xp_levels') {
    return `{
			id: "${rid}"
			type: "xp_levels"
			xp_levels: ${reward.levels}
		}`;
  }
  throw new Error('unknown reward type ' + reward.type);
}

function iconFor(quest) {
  if (quest.icon) return quest.icon;
  const first = quest.tasks[0];
  const raw = first.item || 'minecraft:book';
  // icons must be a concrete item, not a tag (tasks may legally use a #tag, icons may not)
  return raw.startsWith('#') ? 'minecraft:book' : raw;
}

function questSnbt(chapterKey, quest, x, y) {
  const qid = idFor(`${chapterKey}.${quest.key}`);
  const depsList = quest.deps || [];
  const deps = depsList.length ? `[\n\t\t\t${depsList.map(d => `"${idFor(d)}"`).join('\n\t\t\t')}\n\t\t]` : '[]';
  const tasks = quest.tasks.map((t, i) => taskSnbt(chapterKey, quest.key, t, i)).join('\n\t\t');
  const rewards = (quest.rewards || []).map((r, i) => rewardSnbt(chapterKey, quest.key, r, i)).join('\n\t\t');
  return `{
		dependencies: ${deps}
		description: [
			"${esc(quest.desc || '')}"
		]
		icon: "${iconFor(quest)}"
		id: "${qid}"
		rewards: [
		${rewards}
		]
		shape: "${quest.shape || 'circle'}"
		size: 1.0d
		tasks: [
		${tasks}
		]
		title: "${esc(quest.title)}"
		x: ${x.toFixed(1)}d
		y: ${y.toFixed(1)}d
	}`;
}

function chapterSnbt(ch) {
  const cid = idFor(ch.key);
  const groupId = ch.group ? idFor(ch.group) : '';
  let x = 0, y = 0, col = 0;
  const questBlocks = ch.quests.map((q, i) => {
    const qx = (i % 4) * 3;
    const qy = Math.floor(i / 4) * 3;
    return questSnbt(ch.key, q, qx, qy);
  }).join('\n\t');

  return `{
	default_hide_dependency_lines: false
	default_quest_shape: ""
	filename: "${ch.key}"
	group: "${groupId}"
	icon: "${ch.icon}"
	id: "${cid}"
	order_index: ${ch.order}
	quest_links: []
	quests: [
	${questBlocks}
	]
	subtitle: "${esc(ch.subtitle || '')}"
	title: "${esc(ch.title)}"
}
`;
}

// ---------------- DATA ----------------

const chapters = [];

chapters.push({
  key: 'getting_started', group: 'grp_welcome', order: 0,
  title: 'Getting Started', icon: 'minecraft:grass_block',
  subtitle: 'Welcome to Summerpack',
  quests: [
    { key: 'read_guide', title: 'Read the Summerpack Guide', desc: "Craft or find your Summerpack Guide book and give it a read - it's a map of everything in this pack.",
      tasks: [{ type: 'item', item: 'patchouli:guide_book', count: 1 }], rewards: [{ type: 'xp', xp: 10 }] },
    { key: 'read_eyes', title: 'Read the Book of Eyes', desc: 'The End Remastered eyes are this pack\'s signature system - read up before you go hunting for them.',
      tasks: [{ type: 'item', item: 'patchouli:guide_book', count: 1 }], rewards: [{ type: 'xp', xp: 10 }], deps: [] },
    { key: 'punch_tree', title: 'Punch a Tree', desc: 'The oldest tradition.', tasks: [{ type: 'item', item: '#minecraft:logs' }], rewards: [{ type: 'xp', xp: 5 }] },
    { key: 'craft_table', title: 'Crafting Table', tasks: [{ type: 'item', item: 'minecraft:crafting_table' }], rewards: [{ type: 'xp', xp: 5 }], deps: ['getting_started.punch_tree'] },
    { key: 'stone_tools', title: 'Stone Age', tasks: [{ type: 'item', item: 'minecraft:stone_pickaxe' }], rewards: [{ type: 'xp', xp: 10 }], deps: ['getting_started.craft_table'] },
    { key: 'iron_tools', title: 'Iron Age', tasks: [{ type: 'item', item: 'minecraft:iron_pickaxe' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['getting_started.stone_tools'] },
  ]
});

chapters.push({
  key: 'mi_fundamentals', group: 'grp_technology', order: 0,
  title: 'MI Fundamentals', icon: 'modern_industrialization:steel_ingot',
  subtitle: 'Modern Industrialization: the basics',
  quests: [
    { key: 'macerator', title: 'Build a Macerator', desc: 'MI\'s first ore-doubling machine.', tasks: [{ type: 'item', item: 'modern_industrialization:macerator' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['getting_started.iron_tools'] },
    { key: 'lv_generator', title: 'LV Power', desc: 'Get your first Low Voltage generator running.', tasks: [{ type: 'item', item: 'modern_industrialization:steam_turbine' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_fundamentals.macerator'] },
    { key: 'raw_bauxite', title: 'Find Bauxite', desc: 'Aluminum starts here.', tasks: [{ type: 'item', item: 'modern_industrialization:raw_bauxite' }], rewards: [{ type: 'xp', xp: 10 }], deps: ['mi_fundamentals.macerator'] },
    { key: 'steel_ingot', title: 'Real Steel', desc: 'This pack unified steel around MI - accept no substitutes.', tasks: [{ type: 'item', item: 'modern_industrialization:steel_ingot' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['mi_fundamentals.lv_generator'] },
  ]
});

chapters.push({
  key: 'create_fundamentals', group: 'grp_technology', order: 1,
  title: 'Create Fundamentals', icon: 'create:cogwheel',
  subtitle: 'Mechanical power basics',
  quests: [
    { key: 'cogwheel', title: 'Cogwheels', tasks: [{ type: 'item', item: 'create:cogwheel' }], rewards: [{ type: 'xp', xp: 10 }], deps: ['getting_started.iron_tools'] },
    { key: 'water_wheel', title: 'Water Wheel', tasks: [{ type: 'item', item: 'create:water_wheel' }], rewards: [{ type: 'xp', xp: 10 }], deps: ['create_fundamentals.cogwheel'] },
    { key: 'crushing_wheel', title: 'Crushing Wheels', desc: 'Now works on 5 MI ores too, thanks to this pack\'s compat recipes.', tasks: [{ type: 'item', item: 'create:crushing_wheel' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['create_fundamentals.water_wheel'] },
    { key: 'mechanical_mixer', title: 'Mechanical Mixer', tasks: [{ type: 'item', item: 'create:mechanical_mixer' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['create_fundamentals.crushing_wheel'] },
  ]
});

chapters.push({
  key: 'mi_create_bridge', group: 'grp_technology', order: 2,
  title: 'MI x Create Bridge', icon: 'packfixes:crushed_raw_iridium',
  subtitle: 'Where the two tech trees meet',
  quests: [
    { key: 'crush_mi_ore', title: 'Crush an MI Ore', desc: 'Antimony, Iridium, Lead, Nickel or Tin ore, crushed with a Create Crushing Wheel.', tasks: [{ type: 'item', item: 'packfixes:crushed_raw_iridium' }], rewards: [{ type: 'xp', xp: 20 }], deps: ['mi_fundamentals.steel_ingot', 'create_fundamentals.mechanical_mixer'] },
    { key: 'find_a_vent', title: 'Find a Molten Vent', desc: 'Renewable orestone generators, found as dormant stone on land or underwater - rarer in this pack (3x default). Look for a patch of stone that doesn\'t quite match its surroundings.', tasks: [{ type: 'item', item: 'molten_vents:dormant_molten_veridium' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_create_bridge.crush_mi_ore'] },
    { key: 'activate_a_vent', title: 'Activate It', desc: 'Blow up the dormant vent with TNT to activate it, then pump lava into the resulting block. Once active, it grows more orestone around itself over time - a real renewable source, not a one-time drop.', tasks: [{ type: 'checkmark' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['mi_create_bridge.find_a_vent'] },
    { key: 'vent_veridium', title: 'Veridium Vent - Copper', desc: 'Mine the active vent and crush it with a Create Crushing Wheel.', tasks: [{ type: 'item', item: 'create:crushed_raw_copper' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_create_bridge.activate_a_vent'] },
    { key: 'vent_crimsite', title: 'Crimsite Vent - Iron', desc: 'Mine the active vent and crush it with a Create Crushing Wheel.', tasks: [{ type: 'item', item: 'create:crushed_raw_iron' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_create_bridge.activate_a_vent'] },
    { key: 'vent_ochrum', title: 'Ochrum Vent - Gold', desc: 'Mine the active vent and crush it with a Create Crushing Wheel.', tasks: [{ type: 'item', item: 'create:crushed_raw_gold' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_create_bridge.activate_a_vent'] },
    { key: 'vent_asurine', title: 'Asurine Vent - Zinc', desc: 'Mine the active vent and crush it with a Create Crushing Wheel.', tasks: [{ type: 'item', item: 'create:crushed_raw_zinc' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_create_bridge.activate_a_vent'] },
    { key: 'vent_scoria', title: 'Scoria Vent - Dead End', desc: "This one doesn't crush into any ore - Create has no crushing recipe for Scoria. If you activate one, it's a wash. Confirm before you sink time into it - we may be wrong about which of Scoria/Scorchia is the useless one, so treat this as a heads-up rather than gospel.", tasks: [{ type: 'checkmark' }], rewards: [{ type: 'xp', xp: 5 }], deps: ['mi_create_bridge.activate_a_vent'] },
    { key: 'vent_scorchia', title: 'Scorchia Vent - Also No Ore', desc: 'Same story as Scoria - no Create crushing recipe exists for it either, as far as we could verify. Worth confirming for yourself in-game.', tasks: [{ type: 'checkmark' }], rewards: [{ type: 'xp', xp: 5 }], deps: ['mi_create_bridge.activate_a_vent'] },
  ]
});

chapters.push({
  key: 'ae2_storage', group: 'grp_technology', order: 3,
  title: 'AE2 Storage', icon: 'appliedenergistics2:controller',
  subtitle: 'Digital storage networks',
  quests: [
    { key: 'me_controller', title: 'ME Controller', tasks: [{ type: 'item', item: 'appliedenergistics2:controller' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_fundamentals.steel_ingot'] },
    { key: 'me_drive', title: 'ME Drive', tasks: [{ type: 'item', item: 'appliedenergistics2:drive' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['ae2_storage.me_controller'] },
    { key: 'me_terminal', title: 'ME Terminal', tasks: [{ type: 'item', item: 'appliedenergistics2:crafting_terminal' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['ae2_storage.me_drive'] },
  ]
});

chapters.push({
  key: 'mi_advanced', group: 'grp_technology', order: 4,
  title: 'MI Advanced', icon: 'modern_industrialization:mv_wire_coil',
  subtitle: 'MV/HV tiers',
  quests: [
    { key: 'mv_machine', title: 'Reach Medium Voltage', tasks: [{ type: 'item', item: 'modern_industrialization:mv_wire_coil' }], rewards: [{ type: 'xp_levels', levels: 3 }], deps: ['mi_create_bridge.activate_a_vent', 'ae2_storage.me_terminal'] },
    { key: 'hv_machine', title: 'Reach High Voltage', tasks: [{ type: 'item', item: 'modern_industrialization:hv_wire_coil' }], rewards: [{ type: 'xp_levels', levels: 4 }], deps: ['mi_advanced.mv_machine'] },
    { key: 'nickel_ingot', title: 'Nickel Processing', tasks: [{ type: 'item', item: 'modern_industrialization:nickel_ingot' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['mi_advanced.mv_machine'] },
  ]
});

chapters.push({
  key: 'create_advanced', group: 'grp_technology', order: 5,
  title: 'Create Advanced', icon: 'create:andesite_casing',
  subtitle: 'Contraptions and beyond',
  quests: [
    { key: 'contraption', title: 'Build a Contraption', tasks: [{ type: 'item', item: 'create:mechanical_bearing' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['create_fundamentals.mechanical_mixer'] },
    { key: 'train_track', title: 'Lay Track', tasks: [{ type: 'item', item: 'create:track' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['create_advanced.contraption'] },
    { key: 'electric_motor', title: 'Electric Motor', desc: 'Create Crafts & Additions bridges Create rotation and FE power.', tasks: [{ type: 'item', item: 'createaddition:electric_motor' }], rewards: [{ type: 'xp_levels', levels: 3 }], deps: ['create_advanced.contraption', 'mi_advanced.mv_machine'] },
  ]
});

chapters.push({
  key: 'vanilla_plus_structures', group: 'grp_exploration', order: 0,
  title: 'Vanilla-Plus Structures', icon: 'minecraft:bastion_remnant',
  subtitle: "Yung's structure overhaul",
  quests: [
    { key: 'raid_dungeon', title: 'Raid a Dungeon', tasks: [{ type: 'item', item: 'minecraft:iron_sword' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['getting_started.iron_tools'] },
    { key: 'mineshaft', title: 'Explore a Mineshaft', tasks: [{ type: 'item', item: 'minecraft:rail' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['vanilla_plus_structures.raid_dungeon'] },
    { key: 'stronghold', title: 'Reach a Stronghold', tasks: [{ type: 'item', item: 'minecraft:ender_pearl' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['vanilla_plus_structures.mineshaft'] },
    { key: 'nether_fortress', title: 'Storm a Nether Fortress', tasks: [{ type: 'item', item: 'minecraft:blaze_rod' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['vanilla_plus_structures.raid_dungeon'] },
    { key: 'bastion', title: 'Loot a Bastion Remnant', tasks: [{ type: 'item', item: 'minecraft:netherite_scrap' }], rewards: [{ type: 'xp_levels', levels: 3 }], deps: ['vanilla_plus_structures.nether_fortress'] },
  ]
});

chapters.push({
  key: 'the_aether', group: 'grp_exploration', order: 1,
  title: 'The Aether', icon: 'aether:ambrosium_shard',
  subtitle: 'A peaceful sky dimension',
  quests: [
    { key: 'enter_aether', title: 'Enter the Aether', tasks: [{ type: 'dimension', dimension: 'aether:the_aether' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['getting_started.iron_tools'] },
    { key: 'ambrosium', title: 'Mine Ambrosium', tasks: [{ type: 'item', item: 'aether:ambrosium_shard' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['the_aether.enter_aether'] },
  ]
});

chapters.push({
  key: 'deeper_darker', group: 'grp_exploration', order: 2,
  title: 'Deeper and Darker', icon: 'minecraft:sculk',
  subtitle: 'A more dangerous Deep Dark',
  quests: [
    { key: 'find_sculk', title: 'Find the Deep Dark', tasks: [{ type: 'item', item: 'minecraft:echo_shard' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['getting_started.iron_tools'] },
  ]
});

chapters.push({
  key: 'the_bumblezone', group: 'grp_exploration', order: 3,
  title: 'The Bumblezone', icon: 'the_bumblezone:royal_jelly_bottle',
  subtitle: 'A bee-themed dimension',
  quests: [
    { key: 'enter_bumblezone', title: 'Enter the Bumblezone', desc: 'Throw an Ender Pearl or push yourself into a beehive with a piston.', tasks: [{ type: 'dimension', dimension: 'the_bumblezone:the_bumblezone' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['getting_started.iron_tools'] },
    { key: 'royal_jelly', title: 'Get Royal Jelly', desc: 'From the Bee Queen - also the key ingredient for the Bee Eye.', tasks: [{ type: 'item', item: 'the_bumblezone:royal_jelly_bottle' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['the_bumblezone.enter_bumblezone'] },
  ]
});

// ---- Eyes chapter: 24 quests ----
const eyesWithLoot = [
  ['wither_eye', 'endrem:wither_eye', 'Wither Eye', 'Dropped by the Wither (90% x2 rolls).'],
  ['guardian_eye', 'endrem:guardian_eye', 'Guardian Eye', 'Dropped by Elder Guardians (35%).'],
  ['cursed_eye', 'endrem:cursed_eye', 'Cursed Eye', 'Found in Bastion Treasure chests (70%).'],
  ['old_eye', 'endrem:old_eye', 'Old Eye', 'Found in Desert Pyramid (15%) or Simple Dungeon (2.5%) chests.'],
  ['corrupted_eye', 'endrem:corrupted_eye', 'Corrupted Eye', 'Found in Pillager Outpost chests (30%).'],
  ['cold_eye', 'endrem:cold_eye', 'Cold Eye', 'Found in Igloo chests (70%), or crafted.'],
  ['rogue_eye', 'endrem:rogue_eye', 'Rogue Eye', 'Found in Jungle Temple chests (40%), or crafted.'],
  ['black_eye', 'endrem:black_eye', 'Black Eye', 'Found in Buried Treasure (30%) or Shipwreck (5%) chests.'],
  ['lost_eye', 'endrem:lost_eye', 'Lost Eye', 'Found in Abandoned Mineshaft (20%) or Simple Dungeon (2.5%) chests.'],
  ['nether_eye', 'endrem:nether_eye', 'Nether Eye', 'Found in Bastion/Nether Fortress chests (10%), or crafted from Netherite gear.'],
  ['magical_eye', 'endrem:magical_eye', 'Magical Eye', 'Dropped by Evokers (5%) or found in Woodland Mansion chests (10%).'],
];
const eyesWithAdvancement = [
  ['venus_eye', 'endrem:venus_eye', 'Venus Eye', 'Crafted from Stellaris Venus Stone + Ender Eye.'],
  ['industrial_eye', 'endrem:industrial_eye', 'Industrial Eye', 'Crafted from MI Analog Circuits + Ender Eye.'],
  ['mars_eye', 'endrem:mars_eye', 'Mars Eye', 'Crafted from Stellaris Mars Stone + Ender Eye.'],
  ['soul_eye', 'endrem:soul_eye', 'Soul Eye', 'Crafted from a Deeper and Darker Soul Crystal + Ender Eye.'],
  ['bee_eye', 'endrem:bee_eye', 'Bee Eye', 'Crafted from Bumblezone Royal Jelly + Ender Eye.'],
  ['lunar_eye', 'endrem:lunar_eye', 'Lunar Eye', 'Crafted from Stellaris Moon Stone + Ender Eye.'],
  ['mechanical_eye', 'endrem:mechanical_eye', 'Mechanical Eye', 'Crafted from a Create Precision Mechanism + Ender Eye.'],
];
const eyesCraftOnly = [
  ['witch_eye', 'endrem:witch_eye', 'Witch Eye', 'Craft a Witch Pupil (10% Witch drop) with an Eye of Ender.'],
  ['cryptic_eye', 'endrem:cryptic_eye', 'Cryptic Eye', 'A 1/120 chance every time you enchant an item.'],
  ['evil_eye', 'endrem:evil_eye', 'Evil Eye', 'Traded from a Master-level Cleric villager.'],
  ['undead_eye', 'endrem:undead_eye', 'Undead Eye', 'Craft an Undead Soul (25% Skeleton Horse drop) with Bone, Rotten Flesh, Phantom Membrane and Ghast Tear.'],
  ['exotic_eye', 'endrem:exotic_eye', 'Exotic Eye', 'Craft 2 Conduits, 4 kinds of coral, 2 Glow Ink Sacs and an Eye of Ender.'],
];

const eyeQuests = [];
for (const [key, item, title, desc] of eyesWithLoot) {
  eyeQuests.push({ key, title, desc, tasks: [{ type: 'item', item }], rewards: [{ type: 'xp', xp: 20 }] });
}
for (const [key, adv, title, desc] of eyesWithAdvancement) {
  eyeQuests.push({ key, title, desc, tasks: [{ type: 'advancement', advancement: adv }], rewards: [{ type: 'xp', xp: 20 }] });
}
for (const [key, item, title, desc] of eyesCraftOnly) {
  eyeQuests.push({ key, title, desc, tasks: [{ type: 'item', item }], rewards: [{ type: 'xp', xp: 20 }] });
}
eyeQuests.push({
  key: 'tasty_eye', title: 'Tasty Eye (Pack Original)',
  desc: "This one isn't from End Remastered - it's an original addition to this pack. Craft it from Cocoa Beans, Cake, Cookie, Honey Bottle, Sweet Berries, Glow Berries, Sugar Water Bottle and a Create Bar of Chocolate around an Eye of Ender. It doesn't count toward opening the portal, but it's a fun 24th eye to collect.",
  tasks: [{ type: 'item', item: 'eyeguide:tasty_eye' }], rewards: [{ type: 'xp_levels', levels: 2 }]
});
eyeQuests.push({
  key: 'open_the_portal', title: 'Open the Portal', shape: 'gear',
  desc: 'Vanilla End Portals need 12 unique eyes out of the 23 canonical ones. You do not need the Tasty Eye for this.',
  tasks: [{ type: 'checkmark' }],
  rewards: [{ type: 'xp_levels', levels: 10 }],
  deps: [...eyesWithLoot, ...eyesWithAdvancement, ...eyesCraftOnly].map(e => `end_remastered_eyes.${e[0]}`)
});

chapters.push({
  key: 'end_remastered_eyes', group: 'grp_exploration', order: 4,
  title: 'End Remastered: The Eyes', icon: 'endrem:corrupted_eye',
  subtitle: '24 eyes, 24 stories',
  quests: eyeQuests
});

chapters.push({
  key: 'end_outer_islands', group: 'grp_exploration', order: 5,
  title: 'End Outer Island Ore Veins', icon: 'modern_industrialization:iridium_ore',
  subtitle: 'Large, End-exclusive ore veins',
  quests: [
    { key: 'reach_outer_islands', title: 'Reach the Outer Islands', desc: 'Past an End Gateway, never the central island.', tasks: [{ type: 'item', item: 'minecraft:ender_pearl', count: 4 }], rewards: [{ type: 'xp_levels', levels: 3 }], deps: ['end_remastered_eyes.open_the_portal', 'mi_advanced.hv_machine'] },
    { key: 'exotic_vein', title: 'Find an Exotic Vein', desc: 'Iridium, Uranium, Monazite or MI Quartz - the rarest of the 6 vein types.', tasks: [{ type: 'item', item: 'modern_industrialization:iridium_ore' }], rewards: [{ type: 'xp_levels', levels: 4 }], deps: ['end_outer_islands.reach_outer_islands'] },
  ]
});

chapters.push({
  key: 'stellaris_space_race', group: 'grp_exploration', order: 6,
  title: 'Stellaris: Space Race', icon: 'stellaris:moon_stone',
  subtitle: 'Rockets, Moon, Mars, Venus, Mercury',
  quests: [
    { key: 'build_rocket', title: 'Build a Rocket', tasks: [{ type: 'item', item: 'stellaris:steel_ingot' }], rewards: [{ type: 'xp_levels', levels: 3 }], deps: ['mi_advanced.hv_machine'] },
    { key: 'moon_landing', title: 'Land on the Moon', tasks: [{ type: 'item', item: 'stellaris:moon_stone' }], rewards: [{ type: 'xp_levels', levels: 5 }], deps: ['stellaris_space_race.build_rocket'] },
    { key: 'mars_landing', title: 'Land on Mars', tasks: [{ type: 'item', item: 'stellaris:mars_stone' }], rewards: [{ type: 'xp_levels', levels: 6 }], deps: ['stellaris_space_race.moon_landing'] },
    { key: 'venus_landing', title: 'Land on Venus', tasks: [{ type: 'item', item: 'stellaris:venus_stone' }], rewards: [{ type: 'xp_levels', levels: 7 }], deps: ['stellaris_space_race.mars_landing'] },
  ]
});

chapters.push({
  key: 'weapons_armor', group: 'grp_combat', order: 0,
  title: 'Weapons & Armor', icon: 'minecraft:diamond_sword',
  subtitle: 'Simply Swords and Artifacts',
  quests: [
    { key: 'spear', title: 'Forge a Spear', tasks: [{ type: 'item', item: 'simplyswords:iron_spear' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['getting_started.iron_tools'] },
    { key: 'first_artifact', title: 'Find an Artifact', tasks: [{ type: 'item', item: 'minecraft:rabbit_foot' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['weapons_armor.spear'] },
  ]
});

chapters.push({
  key: 'guns_plus_plus', group: 'grp_combat', order: 1,
  title: 'Guns++', icon: 'minecraft:crossbow',
  subtitle: 'Rebalanced with MI Steel and Lead/Bronze ammo',
  quests: [
    { key: 'recipes_book', title: 'Get the Guns++ Recipes Book', tasks: [{ type: 'item', item: 'minecraft:written_book' }], rewards: [{ type: 'xp', xp: 10 }], deps: ['mi_advanced.hv_machine', 'weapons_armor.first_artifact'] },
    { key: 'first_gun', title: 'Craft Your First Gun', desc: 'Gun frames now use MI Steel instead of Iron - a deliberate nerf.', tasks: [{ type: 'item', item: 'minecraft:carrot_on_a_stick' }], rewards: [{ type: 'xp_levels', levels: 3 }], deps: ['guns_plus_plus.recipes_book'] },
    { key: 'ammo', title: 'Craft Ammo', desc: 'Standard bullets use MI Lead, shell-type rounds use MI Bronze.', tasks: [{ type: 'item', item: 'minecraft:clock' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['guns_plus_plus.first_gun'] },
    { key: 'gunpowder_automation', title: 'Automate Gunpowder', desc: 'MI Mixer: Coke Dust + Sulfur Dust -> 2x Gunpowder.', tasks: [{ type: 'item', item: 'minecraft:gunpowder', count: 16 }], rewards: [{ type: 'xp_levels', levels: 3 }], deps: ['guns_plus_plus.ammo'] },
  ]
});

chapters.push({
  key: 'storage_solutions', group: 'grp_utility', order: 0,
  title: 'Storage Solutions', icon: 'sophisticatedbackpacks:backpack',
  subtitle: 'Backpacks, Tom\'s Storage, or AE2 - your choice',
  quests: [
    { key: 'backpack', title: 'Craft a Backpack', tasks: [{ type: 'item', item: 'sophisticatedbackpacks:backpack' }], rewards: [{ type: 'xp', xp: 10 }], deps: ['mi_fundamentals.macerator'] },
    { key: 'storage_terminal', title: "Tom's Storage Terminal", tasks: [{ type: 'item', item: 'toms_storage:basic_storage_terminal' }], rewards: [{ type: 'xp', xp: 15 }], deps: ['storage_solutions.backpack'] },
  ]
});

chapters.push({
  key: 'getting_around', group: 'grp_utility', order: 1,
  title: 'Getting Around', icon: 'waystones:waystone',
  subtitle: 'Waystones, aircraft, and maps',
  quests: [
    { key: 'waystone', title: 'Place a Waystone', tasks: [{ type: 'item', item: 'waystones:waystone' }], rewards: [{ type: 'xp', xp: 10 }], deps: ['getting_started.iron_tools'] },
    { key: 'aircraft', title: 'Build an Aircraft', tasks: [{ type: 'item', item: 'immersive_aircraft:gyrodyne' }], rewards: [{ type: 'xp_levels', levels: 2 }], deps: ['getting_around.waystone'] },
  ]
});

// ---------------- WRITE FILES ----------------

const groups = [
  ['grp_welcome', 'Welcome', 0],
  ['grp_technology', 'Technology', 1],
  ['grp_exploration', 'Exploration', 2],
  ['grp_combat', 'Combat & Adventure', 3],
  ['grp_utility', 'Utility & Comfort', 4],
];

for (const ch of chapters) {
  const snbt = chapterSnbt(ch);
  fs.writeFileSync(path.join(OUT, 'chapters', `${ch.key}.snbt`), snbt);
}

const groupsSnbt = `{
	chapter_groups: [
${groups.map(([key, title]) => `		{
			id: "${idFor(key)}"
			title: "${esc(title)}"
		}`).join('\n')}
	]
}
`;
fs.writeFileSync(path.join(OUT, 'chapter_groups.snbt'), groupsSnbt);

const dataSnbt = `{
	chapter_groups: "chapter_groups.snbt"
	default_reward_team_bonus: 0.0d
	drop_loot_crates: false
	emergency_items: []
	emergency_items_cooldown: 0
	loot_crate_no_drop_penalty: 1.0d
	loss_action: 0
	order_index: 0
	reward_auto_claim: false
	title: "Summerpack"
}
`;
fs.writeFileSync(path.join(OUT, 'data.snbt'), dataSnbt);

// lang file: chapter titles/subtitles + quest titles/descriptions with translation keys
// (FTB Quests supports plain inline text too - since we already wrote plain text directly
// into the chapter SNBT via title/description fields, a separate lang file isn't required;
// leaving an empty lang override for parity with FTB's own default project layout)
fs.writeFileSync(path.join(OUT, 'lang', 'en_us.snbt'), '{\n}\n');

console.log('Chapters written:', chapters.length);
console.log('Total quests:', chapters.reduce((s, c) => s + c.quests.length, 0));
console.log('Total unique IDs generated:', counter - 1);
