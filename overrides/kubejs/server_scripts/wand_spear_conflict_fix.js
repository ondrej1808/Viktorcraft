// Building Wands (iron/diamond wand - this build has no gold wand, only
// stone/copper/iron/diamond/netherite per config/wands.json) and Simply Swords (iron/diamond
// spear) ship the exact same shaped recipe (ingot/gem + 2 sticks on an anti-diagonal), so only
// one of the two ever ends up craftable. Re-shape the wand recipes (mirrored diagonal) so both work.
ServerEvents.recipes(event => {
  event.remove({ id: 'wands:iron_wand' })
  event.remove({ id: 'wands:diamond_wand' })

  event.shaped(
    Item.of('wands:iron_wand'),
    [
      '#  ',
      ' / ',
      '  /'
    ],
    {
      '#': 'minecraft:iron_ingot',
      '/': 'minecraft:stick'
    }
  ).id('packfixes:iron_wand')

  event.shaped(
    Item.of('wands:diamond_wand'),
    [
      '#  ',
      ' / ',
      '  /'
    ],
    {
      '#': 'minecraft:diamond',
      '/': 'minecraft:stick'
    }
  ).id('packfixes:diamond_wand')
})
