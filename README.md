# 龍魂旅人・作戰手帳

Owner-private Taiwan-server strategy site. Character portraits and source ratings derive from https://reurl.cc/rKOAXk, credited to 筱宮璃紗／MDM／佳里等. Character data snapshot: 2026-10-02. The roster contains screenshot-backed identifications with uncertain stars explicitly retained. User edits persist in D1. Unknown ownership is not unowned.

## Weekly unattended update

Schedule requested: Thursday 21:00 Asia/Taipei. The cloud task receives this Site's identity. Reopen the same Site with Sites get_site and verify it is active, published and owner-private. Obtain its supported service credential from get_site; send `OAI-Sites-Authorization: Bearer ...` only to its returned current_live_url. Never store credentials in files, source or prompts. The Site's private dispatch is the authorization boundary for shared `/api/updates`. Do not make the Site public without adding app-level authorization to writes.

GET `/api/update-guide` returns self-contained instructions and payload shape. GET `/api/updates` returns current content. Search and open official Taiwan announcements on sod.game-beans.com and news.game-beans.com, using reurl.cc/rKOAXk only as a secondary source for clearly labelled predictions. Preserve dates in Asia/Taipei. Do not transpose Mainland dates. Deduplicate items by stable ID and source URL, retain history and mark ended banners by their actual end time. Summarize rather than reproduce entire notices.

PUT the complete validated news snapshot to `/api/updates`; then GET it again and compare checkedAt and IDs. Routine runs update D1 without rebuilding. Retain the existing snapshot if source retrieval fails; do not replace it with empty or guessed data. Retry transient failures once, reading back after uncertain writes. Do not modify roster entries or assume new star levels. The current automation status is stored separately with `{kind:'schedule',payload:{enabled,title,status}}` to the same endpoint.

## Source / state

- `data/characters.json`: 101 characters, 107 variants, local factual portraits.
- `data/roster.json`: screenshot snapshot, uncertain entries can be corrected in the UI.
- `data/news.json`: initial official announcement snapshot.
- D1 `snapshots`: `roster`, `news`, `schedule` JSON documents.
- `/api/state` GET reads UI state; PATCH changes one validated roster record.
- `/api/updates` GET/PUT is the supported private unattended data path.

Three squad presets have six distinct characters each, and no repeats across squads within the same mode. These are suggested mixed-faction PvE trial lineups, not universally valid faction-tower teams or proven PvP meta. The third squad is explicitly underbuilt. Sleep ultimate charges nonmatching factions; that caveat is shown. Honoka's screenshot is red one, correcting a previous purple-one misidentification.
