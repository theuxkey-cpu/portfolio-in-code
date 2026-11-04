/**
 * Everything the fictional ad-account assistant knows and says. The replies are
 * written by hand and played back; no model runs behind this prototype. The
 * account, campaigns and numbers are invented.
 */

export type CampaignId = "broad" | "retarget" | "tiktok"

export interface Campaign {
  id: CampaignId
  name: string
  /** Daily budget in dollars. */
  budget: number
}

export const INITIAL_CAMPAIGNS: readonly Campaign[] = [
  { id: "broad", name: "Spring Sale · Broad", budget: 140 },
  { id: "retarget", name: "Spring Sale · Retargeting", budget: 60 },
  { id: "tiktok", name: "TikTok · Prospecting", budget: 90 },
]

export type ScenarioId = "cpa" | "tiktok"

/** data = read from the account, inference = my reading of it, missing = a number I do not have. */
export type StepKind = "data" | "inference" | "missing"

export interface Step {
  kind: StepKind
  /** What the assistant is doing, shown while the step runs. */
  doing: string
  /** What it found, shown once the step is done. */
  found: string
}

export interface Proposal {
  fromId: CampaignId
  toId: CampaignId
  /** Dollars per day moved, as first proposed. */
  amount: number
  step: number
  min: number
  max: number
  /** Cost per conversion of the campaign that gets the money. */
  toCpa: number
  /** Past this daily budget the receiving campaign is outside what the assistant has seen. */
  seenUpTo: number
}

export interface Scenario {
  id: ScenarioId
  prompt: string
  steps: readonly Step[]
  answer: string
  proposal?: Proposal
  /** What would unblock the assistant, when it can't recommend anything. */
  needs?: readonly string[]
}

export const SCENARIOS: Readonly<Record<ScenarioId, Scenario>> = {
  cpa: {
    id: "cpa",
    prompt: "Why did the cost per conversion go up on Spring Sale?",
    steps: [
      {
        kind: "data",
        doing: "Reading Spring Sale spend and conversions, last 14 days against the 14 before",
        found: "Cost per conversion went from $18.40 to $26.10 (up 42%).",
      },
      {
        kind: "data",
        doing: "Splitting the change by campaign",
        found: "Broad went from $19.60 to $31.80. Retargeting stayed near $11.20.",
      },
      {
        kind: "inference",
        doing: "Looking for a cause",
        found:
          "Broad's frequency went from 2.1 to 3.8 views per person. The audience may be wearing out. I can't confirm that from this data.",
      },
    ],
    answer:
      "Most of the rise is in Spring Sale · Broad, and it looks like audience fatigue, though that part is my reading and not something I can confirm. Retargeting is steady and cheaper. I'd move part of Broad's daily budget there. The change is below, and nothing is applied until you approve it.",
    proposal: {
      fromId: "broad",
      toId: "retarget",
      amount: 40,
      step: 10,
      min: 10,
      max: 60,
      toCpa: 11.2,
      seenUpTo: 80,
    },
  },
  tiktok: {
    id: "tiktok",
    prompt: "Can I raise the TikTok budget?",
    steps: [
      {
        kind: "data",
        doing: "Reading TikTok · Prospecting spend, last 14 days",
        found: "Spend is steady at $90 a day, $1,260 in total.",
      },
      {
        kind: "missing",
        doing: "Reading TikTok conversions, last 14 days",
        found: "There are no conversions after Oct 11. The last 9 days are empty, which is not the same as zero.",
      },
      {
        kind: "data",
        doing: "Checking the days that do have conversions",
        found: "Over Oct 7 to 11 the cost per conversion was $24.30, above the $20 target.",
      },
    ],
    answer:
      "I can't recommend raising it. I can see what TikTok spends, but not what it returns for the last 9 days, and the last numbers I do have were already over target. I would rather tell you that than guess. I'm not proposing a change.",
    needs: [
      "Conversions flowing again from the TikTok tracking pixel, which stopped after Oct 11",
      "Or the conversions number from TikTok's own report, if you can paste it here",
    ],
  },
}

export const SCENARIO_ORDER: readonly ScenarioId[] = ["cpa", "tiktok"]
