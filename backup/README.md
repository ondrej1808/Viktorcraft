This is the FTB Quests content (18 chapters, 83 quests) authored earlier this session, postponed
because FTB Library/Teams/Quests mods aren't available (Modrinth doesn't host them, CurseForge
download is gated behind Cloudflare bot-check we can't bypass programmatically).

To restore once the 3 FTB mods are added to modrinth.index.json:
1. Move ftbquests-questline/ back to overrides/config/ftbquests
2. Or re-run gen_ftbquests.js (regenerates the same chapters/*.snbt deterministically) if you want
   to make further edits to the quest data first - edit the DATA section of the script, then run:
   node gen_ftbquests.js
   (it writes into overrides/config/ftbquests/quests/chapters/)

