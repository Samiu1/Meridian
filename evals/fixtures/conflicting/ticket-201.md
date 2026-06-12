# FEAT-201: Real-time collaboration on dashboards

**Reporter:** Product — Alex Kim
**Priority:** P1
**Created:** 2026-05-20

## Description
Multiple users should be able to edit the same dashboard simultaneously,
with live cursor presence and conflict-free merging (CRDT-based). Target:
up to 10 concurrent editors.

## Scope
- Live cursors showing who is editing what widget
- Operational transform or CRDT for widget layout changes
- Presence indicators in the header
- No explicit "lock" mechanism — conflicts resolve automatically

## Success metric
Reduce "dashboard ownership confusion" support tickets by 80%.
