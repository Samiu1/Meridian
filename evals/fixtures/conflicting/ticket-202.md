# FEAT-202: Dashboard edit locking

**Reporter:** Engineering — Maria Santos
**Priority:** P1
**Created:** 2026-05-22

## Description
Implement exclusive edit locks on dashboards. When a user clicks "Edit",
the dashboard locks for others until the editor saves or the lock times out
(5 min). This prevents conflicting changes that corrupt widget layout.

## Scope
- "Edit" button acquires a server-side lock (user + timestamp)
- Other users see a read-only banner: "Editing locked by {user}"
- Lock auto-expires after 5 minutes of inactivity
- Admin can force-release a lock

## Rationale
CRDT-based real-time editing is too complex for our current architecture.
A simple lock is safer and ships in one sprint.
