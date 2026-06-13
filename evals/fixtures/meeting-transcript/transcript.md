# Product Planning Meeting — 2026-06-08

**Attendees:** Sarah (PM), James (Eng Lead), Priya (Design), Tom (CS Lead)

---

**Sarah** [00:02:15]: Let's talk about the notification preferences feature. We've
had 47 support tickets in the last month about users getting too many emails.

**Tom** [00:03:00]: Confirming — the top complaint is digest frequency. Users want
daily or weekly digests instead of real-time for non-critical notifications.

**James** [00:04:22]: Technically we can support per-category preferences — marketing,
product updates, security alerts. Security should always be real-time though.

**Priya** [00:05:10]: I'd suggest a simple matrix UI: categories on the left,
frequency options across the top. We have a pattern for this in our settings pages.

**Sarah** [00:06:45]: Success metric should be reducing support tickets about
notification overload by 60% within 30 days.

**James** [00:08:30]: One risk — we need to migrate existing users to the new
preference schema. That's a one-time background job, but we need to decide on
defaults for existing users.

**Sarah** [00:09:15]: Default existing users to their current behavior. New users
get the recommended defaults from the matrix.

**Tom** [00:10:00]: We should also add an unsubscribe link in every email that
goes directly to the preference page. That's a legal requirement in some markets.

**ACTION ITEMS:**
- Sarah: write the PRD by Friday
- Priya: mock up the preference matrix
- James: spike on the migration job
