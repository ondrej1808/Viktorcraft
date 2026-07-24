const STELLARIS_STEEL = 'stellaris:steel_ingot'
const MI_STEEL = 'modern_industrialization:steel_ingot'
const STELLARIS_STEEL_NUGGET = 'stellaris:steel_nugget'
const MI_STEEL_NUGGET = 'modern_industrialization:steel_nugget'

ServerEvents.recipes(event => {
  event.replaceInput({ input: STELLARIS_STEEL }, STELLARIS_STEEL, MI_STEEL)
  event.replaceOutput({ output: STELLARIS_STEEL }, STELLARIS_STEEL, MI_STEEL)
  event.replaceInput({ input: STELLARIS_STEEL_NUGGET }, STELLARIS_STEEL_NUGGET, MI_STEEL_NUGGET)
  event.replaceOutput({ output: STELLARIS_STEEL_NUGGET }, STELLARIS_STEEL_NUGGET, MI_STEEL_NUGGET)

  // Stellaris steel ingots/nuggets found in loot chests lose the steel tag below and become
  // otherwise unusable - give them a 1:1 conversion path into the real (MI) steel items.
  event.shapeless(
    Item.of(MI_STEEL),
    [STELLARIS_STEEL]
  ).id('packfixes:stellaris_steel_to_mi_steel')

  event.shapeless(
    Item.of(MI_STEEL_NUGGET),
    [STELLARIS_STEEL_NUGGET]
  ).id('packfixes:stellaris_steel_nugget_to_mi_steel_nugget')
})

ServerEvents.tags('item', event => {
  event.add('c:ingots/steel', MI_STEEL)
  event.remove('c:ingots/steel', STELLARIS_STEEL)

  event.add('stellaris:steel', MI_STEEL)
  event.remove('stellaris:steel', STELLARIS_STEEL)

  event.add('c:nuggets/steel', MI_STEEL_NUGGET)
  event.remove('c:nuggets/steel', STELLARIS_STEEL_NUGGET)
})
