// Chisel Reborn's chisel (data/chisel/recipe/chisel.json: iron ingot + stick, anti-diagonal
// " #"/"S ") and Simply Swords' Iron Sai (data/simplyswords/recipe/iron_sai.json: iron ingot +
// c:wood_sticks tag, same anti-diagonal once the blank top row is trimmed) ship the exact same
// shaped recipe (same items, same 2x2 diagonal shape), so only one of the two ever ends up
// craftable - same class of bug as the earlier wand/spear conflict. Gold/diamond Sai don't
// collide (different ingot), so only the chisel recipe needs to move.
//
// First attempt re-shaped the chisel recipe onto the opposite diagonal ("# "/" S" - ingot
// top-left, stick bottom-right), but that still collided: Minecraft's shaped-recipe matcher also
// tries every pattern in its horizontally-mirrored form, and the mirror of "# "/" S" is exactly
// " #"/"S " - Iron Sai's original shape. A diagonal can never truly avoid a diagonal from the
// other mod this way. Use a single-column vertical stack instead (ingot directly above the
// stick) - mirroring a 1-column pattern is a no-op, so it cannot degenerate into any diagonal
// shape regardless of orientation.
ServerEvents.recipes(event => {
  event.remove({ id: 'chisel:chisel' })

  event.shaped(
    Item.of('chisel:chisel'),
    [
      '#',
      'S'
    ],
    {
      '#': 'minecraft:iron_ingot',
      'S': 'minecraft:stick'
    }
  ).id('packfixes:chisel')
})
