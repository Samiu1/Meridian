# SUPPORT-102: CSV export times out on large datasets

**Reporter:** James Okafor (Enterprise, Globex Inc)
**Priority:** P2
**Created:** 2026-06-01

## Description
Exporting more than 50k rows causes a timeout (504). The spinner runs for
about 90 seconds, then the page shows an error. Smaller exports work fine.

## Impact
Globex's analytics dataset has ~120k rows. They cannot export it at all.
They've asked for a workaround twice this week.

## Workaround attempted
Pagination workaround (export page by page) is not viable — no way to
specify pages in the current UI.
