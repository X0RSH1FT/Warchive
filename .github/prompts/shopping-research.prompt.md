---
name: shopping-research
description: "Use when researching something to purchase, comparing products or listings, evaluating deals, or producing an evidence-backed shopping recommendation."
argument-hint: "[Item or outcome, use case, budget, must-haves, preferences, exclusions, timing, and location if different from Georgia, USA]"
agent: Online Shopping Agent
---

Research and report on the user's purchase request. Treat the invocation text as the concrete shopping brief.

1. Extract the product or desired outcome, use case, budget, hard requirements, preferences, exclusions, quantity, timing, condition, compatibility needs, and delivery or pickup context.
2. If a missing detail could materially change viable products or rankings, use `#askQuestions` to collect only that detail before researching. Otherwise, state a reasonable assumption and proceed.
3. Apply the Online Shopping Agent's research workflow and decision rules. Use current web sources, compare exact variants and known total costs, and deeply verify the strongest candidates.
4. Return the agent's standard report: shopping brief and scope, best overall recommendation, useful category winners, comparison table, tradeoffs, risks and unknowns, direct source URLs with access dates, and the user's pre-purchase checks.
5. Do not perform any transaction, account, cart, reservation, bid, or seller-contact action.

Examples:

- `/shopping-research Find a durable cordless drill kit under $150 for occasional home repairs.`
- `/shopping-research Compare these two laptop listings for software development and light gaming: <URLs>.`
- `/shopping-research Find the best-value refurbished phone with at least 256 GB, a strong camera, and a one-year warranty.`

## Output Example

Adapt this structure to the request. Omit artificial category winners, add request-specific criteria when useful, and never present placeholders as researched facts.

```markdown
# Shopping Research: [Product or outcome]

**Researched:** [YYYY-MM-DD]
**Request:** [Use case, budget, and priorities]
**Hard requirements:** [Requirements used as filters]
**Assumptions:** [Location, condition, timing, or other assumptions]
**Search scope:** [Seller types and evidence sources checked, plus coverage gaps]

## Recommendation

**Best overall: [Exact product, model, and variant] from [seller] at [known total cost]**

[Two or three sentences explaining why it best satisfies the brief, the decisive evidence, and its main compromise.]

## Category Winners

| Category | Winner | Why it wins | Main compromise |
|---|---|---|---|
| Best budget | [Exact option] | [Reason] | [Tradeoff] |
| Best quality | [Exact option] | [Reason] | [Tradeoff] |
| Best value | [Exact option] | [Reason] | [Tradeoff] |

## Finalist Comparison

| Option | Seller / condition | Known total cost | Decisive criteria | Warranty / returns | Evidence quality | Important caveat |
|---|---|---:|---|---|---|---|
| [Exact model / variant] | [Seller / new, used, refurbished, or open-box] | [$ amount or unknown] | [Relevant strengths] | [Terms] | [High, Medium, or Low with reason] | [Risk or limitation] |
| [Exact model / variant] | [Seller / condition] | [$ amount or unknown] | [Relevant strengths] | [Terms] | [Rating with reason] | [Risk or limitation] |
| [Exact model / variant] | [Seller / condition] | [$ amount or unknown] | [Relevant strengths] | [Terms] | [Rating with reason] | [Risk or limitation] |

## Tradeoffs

- **[Option]:** Gain [benefit]; give up [cost or capability].
- **[Option]:** Gain [benefit]; give up [cost or capability].

## Risks And Unknowns

- [Unverified compatibility, uncertain tax or shipping, stock risk, weak review evidence, seller concern, or promotion expiry.]
- [Distinguish observed facts from manufacturer claims, seller claims, review themes, and inference.]

## Sources

1. [Manufacturer specification or product page](https://example.com) - specifications and warranty; accessed [YYYY-MM-DD].
2. [Retailer or marketplace listing](https://example.com) - price, condition, stock, and seller terms; accessed [YYYY-MM-DD].
3. [Independent test or authoritative source](https://example.com) - performance or safety evidence; accessed [YYYY-MM-DD].

## Before You Buy

[The most important price, variant, compatibility, warranty, return-policy, seller, or stock detail the user should independently verify before purchasing.]
```