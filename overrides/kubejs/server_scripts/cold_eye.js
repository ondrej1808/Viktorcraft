ServerEvents.recipes(event => {
  event.shaped(
    Item.of('endrem:cold_eye'),
    [
      'SPS',
      'WEG',
      'KIB'
    ],
    {
      S: 'minecraft:snow',
      P: 'minecraft:powder_snow_bucket',
      W: 'minecraft:snowball',
      E: 'minecraft:ender_eye',
      G: 'minecraft:goat_horn',
      K: 'minecraft:packed_ice',
      I: 'minecraft:ice',
      B: 'minecraft:blue_ice'
    }
  ).id('eyeguide:cold_eye_craft')
})
