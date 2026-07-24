ServerEvents.recipes(event => {
  event.shaped(
    Item.of('endrem:mechanical_eye'),
    [
      'PPP',
      'PEP',
      'PPP'
    ],
    {
      P: 'create:precision_mechanism',
      E: 'minecraft:ender_eye'
    }
  ).id('eyeguide:mechanical_eye_craft')
})
