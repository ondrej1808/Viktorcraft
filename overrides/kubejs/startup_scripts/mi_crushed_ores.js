// Crushed-raw variants for the Modern Industrialization ores that have no Create
// crushing compat out of the box (silver has no mineable ore block in MI, so it's excluded).
// Lead, nickel and tin used to be here too, but Create ships its own native `#c:ores/<material>`
// crushing recipe for those three (plus platinum and uranium) that outputs its own
// create:crushed_raw_<material> item - it silently wins over our custom crushing recipe for the
// same tag, so our packfixes items for those three were unreachable dead code. See
// mi_crushed_ores.js (server_scripts) for the fix that hooks Create's own items into MI smelting
// instead of duplicating them.
const MI_CRUSHABLE_ORES = ['antimony', 'iridium']

StartupEvents.registry('item', event => {
  MI_CRUSHABLE_ORES.forEach(material => {
    event.create(`packfixes:crushed_raw_${material}`)
      .texture(`packfixes:item/crushed_raw_${material}`)
      .rarity('common')
  })
})
