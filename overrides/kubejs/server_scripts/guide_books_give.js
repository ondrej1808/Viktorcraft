// 1.21 component-predicate item syntax - same format the /give command itself uses.
// Books live under overrides/patchouli_books/<book>/ (the "For Modpackers" convention from
// Patchouli's own docs: a plain top-level .minecraft/patchouli_books/ folder, not a mod's
// data/assets split), which is why the book ID's namespace is always "patchouli", not our own.
const EYES_GUIDE = Item.of('patchouli:guide_book[patchouli:book="patchouli:eyes_guide"]')
const INTRO_GUIDE = Item.of('patchouli:guide_book[patchouli:book="patchouli:intro"]')

// Give both guide books once, the first time a player ever spawns in.
PlayerEvents.loggedIn(event => {
  const player = event.player
  if (!player.persistentData.getBoolean('packguide_books_given')) {
    player.persistentData.putBoolean('packguide_books_given', true)
    player.give(EYES_GUIDE.copy())
    player.give(INTRO_GUIDE.copy())
  }
})

// Both guide books can also be crafted from dirt, in case a book is lost. Different shapes so the
// two recipes don't share an identical ingredient list (both were 1x dirt shapeless before, which
// made them ambiguous to craft).
ServerEvents.recipes(event => {
  event.shapeless(EYES_GUIDE.copy(), ['minecraft:dirt']).id('packfixes:craft_eyes_guide')
  event.shaped(
    INTRO_GUIDE.copy(),
    [
      'DD',
      'DD'
    ],
    { D: 'minecraft:dirt' }
  ).id('packfixes:craft_intro_guide')
})
