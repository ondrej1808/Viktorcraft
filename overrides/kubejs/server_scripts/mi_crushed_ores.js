// Ore -> Create crushing -> crushed raw -> furnace/blast furnace ingot,
// as an alternative to the MI macerator for antimony and iridium (silver has no MI ore block).
// These two have no equivalent in Create's own crushed-material tag list, so they still need
// their own custom crushed item + crushing recipe.
const MI_ORES = {
  antimony: 'modern_industrialization:antimony_ingot',
  iridium: 'modern_industrialization:iridium_ingot'
}

// Tin, lead, nickel, platinum and uranium ore all carry the common `#c:ores/<material>` tag,
// which Create's own bundled crushing recipes already match (data/create/recipe/crushing/
// {tin,lead,nickel,platinum,uranium}_ore.json), producing Create's own create:crushed_raw_<material>
// item - confirmed in-game via JEI (mod badge shows "Create", not this pack). That recipe silently
// wins over anything we'd add for the same input tag, so there's no point duplicating it. The
// actual gap the user found ("crushed raw platinum -> no smelting"): Create only ships its own
// furnace-smelting recipe for its 4 base metals (iron/gold/copper/zinc); everything else in its
// crushed-material tag (including tin/lead/nickel/platinum/uranium) is meant to be wired up by
// whichever ore mod is present - Mekanism, Thermal, IC2, etc. all have their own compat data in
// the Create jar, but Modern Industrialization isn't a mod Create recognizes, so these 5 were a
// dead end: crushed, but nothing to smelt them into. Hook Create's own crushed items straight
// into MI's ingots instead of reinventing them.
const CREATE_NATIVE_CRUSHED = {
  tin: 'modern_industrialization:tin_ingot',
  lead: 'modern_industrialization:lead_ingot',
  nickel: 'modern_industrialization:nickel_ingot',
  platinum: 'modern_industrialization:platinum_ingot',
  uranium: 'modern_industrialization:uranium_ingot'
}

ServerEvents.recipes(event => {
  Object.keys(MI_ORES).forEach(material => {
    const crushed = `packfixes:crushed_raw_${material}`
    const ingot = MI_ORES[material]

    event.recipes.create.crushing(
      [
        crushed,
        CreateItem.of(crushed, 0.75),
        CreateItem.of('create:experience_nugget', 0.75)
      ],
      Ingredient.of(`#c:ores/${material}`).withCount(1)
    ).processingTime(250).id(`packfixes:crushing_${material}_ore`)

    event.smelting(ingot, crushed)
      .xp(0.7)
      .cookingTime(200)
      .id(`packfixes:smelting_crushed_${material}`)

    event.blasting(ingot, crushed)
      .xp(0.7)
      .cookingTime(100)
      .id(`packfixes:blasting_crushed_${material}`)
  })

  // Washing (Create's "splashing" recipe type) is deliberately not added here - it would be a
  // bonus-yield nicety (extra nuggets), not required for the ore to be usable at all, and this
  // session had no network access to spin up a headless server and confirm the KubeJS-Create
  // splashing API signature before shipping it. Smelting/blasting alone fully unblocks the chain
  // the user reported as broken; see CHECKLIST.md for the follow-up.
  Object.keys(CREATE_NATIVE_CRUSHED).forEach(material => {
    const crushed = `create:crushed_raw_${material}`
    const ingot = CREATE_NATIVE_CRUSHED[material]

    event.smelting(ingot, crushed)
      .xp(0.7)
      .cookingTime(200)
      .id(`packfixes:smelting_create_crushed_${material}`)

    event.blasting(ingot, crushed)
      .xp(0.7)
      .cookingTime(100)
      .id(`packfixes:blasting_create_crushed_${material}`)
  })
})
