You are a senior product and engineering assistant. I am evaluating how well you handle ambiguous real-world tasks.

Read the scenario carefully. Do not invent facts that are not supported by the prompt. If something is ambiguous, say so explicitly and make a reasonable assumption only when needed.

Scenario:

We are launching a reminder feature in a notes app.

Requirements gathered so far:
- Users can create one-time or recurring reminders.
- Reminders should arrive at 9:00 AM in the user's local time.
- We store reminder times in UTC.
- Users may travel between time zones.
- Free users can have up to 3 active reminders.
- Premium users can have unlimited active reminders.
- Marketing already published a page that says "unlimited reminders for everyone through the end of the month."
- Some users share devices.
- We must support offline creation of reminders and sync later.
- We cannot send duplicate reminders.
- We need an MVP in 2 weeks.
- Engineering has 1 backend engineer, 1 mobile engineer, and no dedicated QA.
- There is no existing notification retry system.
- Legal says we must be able to delete reminder data within 30 days of account deletion.
- Customer support wants a clear explanation for why a reminder did or did not fire.

Data points:
- Estimated weekly active users at launch: 20,000
- Expected reminder creators at launch: 15% of weekly active users
- Average active reminders per creator: 4
- Estimated daily reminder fire rate: 35% of active reminders
- Notification provider success rate: 97%
- 8% of reminder creators travel across time zones at least once per month

Your task:

1. Identify the 5 most important ambiguities, conflicts, or risks in the requirements.
2. State the assumptions you will make to proceed.
3. Give a pragmatic MVP recommendation for what to ship in 2 weeks and what to defer.
4. Estimate the rough scale of active reminders and daily reminder sends using the data above.
5. Propose a minimal technical design covering:
   - time zone handling
   - offline sync
   - duplicate prevention
   - deletion/compliance
   - support/debuggability
6. Provide 8 focused test cases that would catch high-risk failures.
7. Write a short user-facing explanation for one case where a reminder did not fire.
8. Keep the response under 500 words.

Output format:
- Ambiguities/Risks
- Assumptions
- MVP Recommendation
- Rough Scale
- Minimal Design
- Test Cases
- User-Facing Explanation



---

What to look for when comparing models:

Whether it notices the pricing conflict and the local-time-vs-UTC/travel tension.
Whether it does the rough math correctly: about 3,000 creators, about 12,000 active reminders, about 4,200 daily fires.
Whether it stays disciplined under ambiguity instead of confidently inventing policy.
Whether the MVP recommendation is realistic for a 2-week team.
Whether the output is concise, structured, and actually follows the requested format.
If you want, I can also give you:

a harder version for coding models,
a non-technical version for general assistants,
a scoring rubric so you can compare outputs consistently.