ServerEvents.recipes(event => {
  event.shaped(
    Item.of('endrem:industrial_eye'),
    [
      ' C ',
      'CEC',
      ' C '
    ],
    {
      C: 'modern_industrialization:analog_circuit',
      E: 'minecraft:ender_eye'
    }
  ).id('eyeguide:industrial_eye_craft')

  event.shaped(
    Item.of('endrem:lunar_eye'),
    [
      'MMM',
      'MEM',
      'MMM'
    ],
    {
      M: 'stellaris:moon_stone',
      E: 'minecraft:ender_eye'
    }
  ).id('eyeguide:lunar_eye_craft')

  event.shaped(
    Item.of('endrem:mars_eye'),
    [
      'MMM',
      'MEM',
      'MMM'
    ],
    {
      M: 'stellaris:mars_stone',
      E: 'minecraft:ender_eye'
    }
  ).id('eyeguide:mars_eye_craft')

  event.shaped(
    Item.of('endrem:venus_eye'),
    [
      'VVV',
      'VEV',
      'VVV'
    ],
    {
      V: 'stellaris:venus_stone',
      E: 'minecraft:ender_eye'
    }
  ).id('eyeguide:venus_eye_craft')

  event.shapeless(
    Item.of('endrem:soul_eye'),
    [
      'deeperdarker:soul_crystal',
      'minecraft:ender_eye'
    ]
  ).id('eyeguide:soul_eye_craft')

  event.shapeless(
    Item.of('endrem:bee_eye'),
    [
      'the_bumblezone:royal_jelly_bottle',
      'minecraft:ender_eye'
    ]
  ).id('eyeguide:bee_eye_craft')
})
