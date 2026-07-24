ServerEvents.recipes(event => {
  event.shaped(
    Item.of('endrem:rogue_eye'),
    [
      'CDR',
      'AEX',
      'BHL'
    ],
    {
      C: 'minecraft:cobweb',
      D: 'minecraft:dead_bush',
      R: 'minecraft:wither_rose',
      A: 'minecraft:tipped_arrow',
      E: 'minecraft:ender_eye',
      X: 'minecraft:crossbow',
      B: 'minecraft:bow',
      H: 'minecraft:rabbit_hide',
      L: 'minecraft:leather'
    }
  ).id('eyeguide:rogue_eye_craft')
})
