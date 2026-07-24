// Both magical_eye sources handled via LootJS directly instead of the JsonEye config system:
// - the mod's own JsonEye entry only supports one pool per eye at a fixed weight (Evoker, 5%),
//   which is lower than the pack wants, and can't be edited without overriding the mod's own
//   bundled loot table anyway.
// - going through LootJS for both keeps them independently tunable and avoids double-counting
//   between a JsonEye injection and a LootJS modifier on the same table.
LootJS.modifiers(event => {
  event.addTableModifier('minecraft:entities/evoker')
    .addLoot(LootEntry.of('endrem:magical_eye').randomChance(0.40))

  event.addTableModifier('minecraft:chests/woodland_mansion')
    .addLoot(LootEntry.of('endrem:magical_eye').randomChance(0.10))
})
