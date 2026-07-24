// Holy Eye - pack-original 24th eye, not one of the 23 canonical eyes. Registered as a real
// endrem:holy_eye item (config/EndRemastered-NeoForge/Eyes/holy_eye.json, craft/trade-only per
// JsonEye, matching Venus Eye's pattern) rather than a separate standalone item, same as every
// other pack-added eye. Its only obtain method is a guaranteed drop from the Aether's Sun Spirit
// boss (aether:entities/sun_spirit) - added via LootJS rather than the JsonEye system since the
// source is a different mod's boss loot table, not one of End Remastered's own bundled tables.
LootJS.modifiers(event => {
  event.addTableModifier('aether:entities/sun_spirit')
    .addLoot(LootEntry.of('endrem:holy_eye').randomChance(1.0))
})
