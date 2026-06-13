# PRD: Notification Preferences

## Problem
Users receive too many notifications and have no way to control which ones
they get. Support ticket SUPPORT-441 reports "notification fatigue" as the
#2 reason for churn in the Q1 exit survey.

## Goals
- Reduce notification-related churn by 30%
- Give users granular control over notification channels and frequency

## Non-goals
- Redesigning the notification UI itself
- Push notification support (Phase 2)

## Users
- **End user** — receives notifications, wants to reduce noise
- **Team admin** — sets default notification policies for their team

## Requirements

### P0
- FEAT-201: User can toggle notifications on/off per category (mentions,
  updates, digest)
- FEAT-202: User can choose channel per category (email, in-app, both)
- FEAT-203: Changes take effect immediately, no page reload required

### P1
- FEAT-204: Team admin can set default preferences for new members
- FEAT-205: User can set "quiet hours" (no notifications between time X and Y)

### P2
- FEAT-206: Weekly digest email summarizing muted notifications

## Risks
- If defaults are too aggressive, users miss critical mentions
- Quiet hours across timezones is complex for distributed teams

## Success metrics
- Notification-related support tickets drop 40% within 60 days
- 50% of users customize at least one preference within 30 days
