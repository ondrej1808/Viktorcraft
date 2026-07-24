ServerEvents.recipes(event => {
  event.shaped(
    Item.of('endrem:nether_eye'),
    [
      'HCL',
      'BES',
      'PAV'
    ],
    {
      H: 'minecraft:netherite_helmet',
      C: 'minecraft:netherite_chestplate',
      L: 'minecraft:netherite_leggings',
      B: 'minecraft:netherite_boots',
      E: 'minecraft:ender_eye',
      S: 'minecraft:netherite_sword',
      P: 'minecraft:netherite_pickaxe',
      A: 'minecraft:netherite_axe',
      V: 'minecraft:netherite_shovel'
    }
  ).id('eyeguide:nether_eye_craft')
})
