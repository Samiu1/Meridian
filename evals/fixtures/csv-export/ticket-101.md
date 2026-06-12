# SUPPORT-101: Users cannot export filtered data

**Reporter:** Sarah Chen (Enterprise, Acme Corp)
**Priority:** P1
**Created:** 2026-05-28

## Description
When I apply filters to the dashboard (date range + segment), the "Export"
button downloads the full unfiltered dataset as CSV. Expected: export should
respect active filters.

## Impact
Our compliance team needs filtered exports for quarterly audits. They're
currently re-filtering in Excel, which adds ~2 hours per report.

## Acceptance criteria (from reporter)
- CSV export matches the on-screen filtered view
- Column order matches the table column order
- File name includes the applied filter summary
