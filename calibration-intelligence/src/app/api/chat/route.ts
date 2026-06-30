import { NextRequest, NextResponse } from "next/server";
import { MOCK_INSTRUMENTS, MOCK_RECORDS, MOCK_KPIS, MOCK_RECOMMENDATIONS } from "@/lib/mock-data";

// Build a compact context string from the mock data for the AI
function buildCalibrationContext(): string {
  const failingInstruments = MOCK_INSTRUMENTS.filter((i) => i.failCount > 0);
  const overdue = MOCK_INSTRUMENTS.filter((i) => i.isOverdue);
  const critical = MOCK_INSTRUMENTS.filter((i) => i.riskLevel === "critical");
  const highDrift = MOCK_INSTRUMENTS.filter((i) => i.avgDrift > 0.4).sort((a, b) => b.avgDrift - a.avgDrift);

  return `
CALIBRATION INTELLIGENCE PLATFORM — DATA SUMMARY
Plant: Acme Manufacturing, Houston TX
Analysis Date: ${new Date().toLocaleDateString()}

KEY METRICS:
- Total instruments: ${MOCK_KPIS.totalInstruments}
- Fleet pass rate: ${MOCK_KPIS.passRate}%
- Fail rate: ${MOCK_KPIS.failRate}%
- Overdue: ${MOCK_KPIS.overdueRate}%
- Average drift: ${MOCK_KPIS.avgDrift.toFixed(3)}%
- Annual program cost: $${MOCK_KPIS.estimatedAnnualCost.toLocaleString()}
- Total labor hours: ${MOCK_KPIS.totalLaborHours}
- Critical instruments: ${MOCK_KPIS.criticalInstruments}

CRITICAL RISK INSTRUMENTS:
${critical.map((i) => `- ${i.instrumentTag} (${i.instrumentName}): ${i.failCount} failures, avg drift ${i.avgDrift.toFixed(3)}%, ${i.consecutiveFailures} consecutive failures`).join("\n")}

INSTRUMENTS WITH FAILURES:
${failingInstruments.map((i) => `- ${i.instrumentTag} (${i.instrumentName}): ${i.failCount}/${i.totalCalibrations} failures, pass rate ${i.passRate}%, avg drift ${i.avgDrift.toFixed(3)}%, cost $${i.totalCost}`).join("\n")}

OVERDUE INSTRUMENTS:
${overdue.map((i) => `- ${i.instrumentTag} (${i.instrumentName}): due ${i.nextCalibrationDate}, last cal ${i.lastCalibrationDate}`).join("\n")}

HIGH DRIFT INSTRUMENTS (avg drift > 0.4%):
${highDrift.map((i) => `- ${i.instrumentTag} (${i.instrumentName}): avg ${i.avgDrift.toFixed(3)}%, max ${i.maxDrift.toFixed(3)}%, trend ${JSON.stringify(i.driftTrend.map((d) => d.toFixed(3)))}`).join("\n")}

ALL INSTRUMENTS:
${MOCK_INSTRUMENTS.map((i) => `- ${i.instrumentTag}: ${i.instrumentName} | ${i.category} | ${i.department} | Risk: ${i.riskLevel} | Pass: ${i.passRate}% | Avg Drift: ${i.avgDrift.toFixed(3)}% | Cost: $${i.totalCost} | ${i.isOverdue ? "OVERDUE" : "Current"}`).join("\n")}

AI RECOMMENDATIONS GENERATED:
${MOCK_RECOMMENDATIONS.map((r) => `- [${r.priority.toUpperCase()}] ${r.title}: ${r.problem} Est. savings: $${r.estimatedSavings}/yr. Confidence: ${r.confidenceScore}%`).join("\n")}

CALIBRATION RECORDS (${MOCK_RECORDS.length} total):
${MOCK_RECORDS.slice(0, 20).map((r) => `- ${r.instrumentTag} on ${r.calibrationDate}: ${r.status.toUpperCase()}, drift ${r.drift.toFixed(3)}%, as-found ${r.asFoundError.toFixed(3)}%, tolerance ±${r.tolerance}%, cost $${r.calibrationCost}`).join("\n")}
`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return a helpful mock response when no API key is configured
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      const mockResponse = generateMockResponse(lastUserMsg);
      return NextResponse.json({ content: mockResponse });
    }

    const context = buildCalibrationContext();

    const systemPrompt = `You are Calibration Intelligence AI, an expert system for industrial calibration analytics. You analyze calibration data, identify patterns, and provide actionable recommendations to maintenance supervisors, reliability engineers, and plant managers.

You have access to the following real-time calibration data from Acme Manufacturing:

${context}

Guidelines:
- Be precise, concise, and quantitative. Reference specific instrument tags, drift values, and costs.
- When identifying problems, always quantify the risk and estimated business impact.
- When asked for recommendations, provide structured, actionable advice.
- Format responses with clear sections using markdown when appropriate.
- Focus on business value: cost savings, risk reduction, compliance, and uptime.
- Tone: professional, analytical, similar to a senior reliability engineer.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "No response generated.";

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateMockResponse(query: string): string {
  if (query.includes("replace") || query.includes("replacement")) {
    return `**Instruments Recommended for Replacement:**

1. **FT-205 (Coriolis Flow Meter)** — CRITICAL PRIORITY
   - 4 consecutive failures, drift accelerating from 0.72% to 1.12%
   - Estimated replacement cost: ~$12,000 vs. ongoing failure costs of $34,000/yr
   - Recommend immediate replacement with new Micro Motion F200

2. **VT-1205 (Vibration Transmitter)** — CRITICAL PRIORITY
   - 2/2 calibrations failed, monitors Compressor Train 1
   - Single compressor failure risk: ~$180,000 in downtime
   - Replace before next scheduled calibration (Nov 2025)

*Note: Configure ANTHROPIC_API_KEY in .env.local for live AI responses.*`;
  }

  if (query.includes("drift")) {
    return `**Instruments with Highest Drift:**

| Rank | Tag | Instrument | Avg Drift | Trend |
|------|-----|-----------|-----------|-------|
| 1 | FT-205 | Coriolis Flow Meter | 0.900% | ↑↑↑ Accelerating |
| 2 | VT-1205 | Vibration Transmitter | 0.780% | ↑↑ Rising |
| 3 | PT-101 | Pressure Transmitter A | 0.330% | ↑ Rising |
| 4 | TE-702 | Type K Thermocouple | 0.360% | ↑ Rising |
| 5 | DPT-910 | DP Transmitter | 0.550% | Overdue |

**Key Insight:** FT-205 and VT-1205 have drift values exceeding tolerance (0.5%) and require immediate action.

*Note: Configure ANTHROPIC_API_KEY in .env.local for live AI responses.*`;
  }

  if (query.includes("interval") || query.includes("frequency")) {
    return `**Calibration Interval Optimization Opportunities:**

**Extend intervals (stable, low-drift instruments):**
- **AT-520** (Gas Chromatograph): 0.08% avg drift — 40% of tolerance used. Extend from 6-month to annual. Saves ~$1,900/yr.
- **TT-310, TT-311** (RTD Sensors): <0.06% drift. Consider extending to 18-month intervals.
- **FT-830** (Vortex Flow Meter): Consistent 0.11-0.13% drift. Candidate for annual interval.

**Tighten intervals (problematic instruments):**
- **PT-101**: Drift increasing each cycle — reduce from 6-month to 3-month intervals immediately.
- **TE-702**: Tripled drift in 18 months — increase to quarterly.

**Estimated net savings from optimization: ~$14,800/yr**

*Note: Configure ANTHROPIC_API_KEY in .env.local for live AI responses.*`;
  }

  if (query.includes("cost") || query.includes("sav")) {
    return `**Cost Analysis Summary:**

**Program Costs:**
- Estimated annual calibration cost: $187,400
- Cost of failures (rework, repeat calibrations): ~$19,200/yr
- Labor (82 hours YTD at blended rate)

**Where Money is Being Lost:**
1. FT-205 — 4 failures = $3,270 in calibration costs alone + quality risk
2. VT-1205 — 2 failures = $2,050 + compressor risk exposure
3. AT-520 (GC) — High individual cost $5,650 but zero failures; optimization candidate

**Savings Opportunities:**
- Replace FT-205 + VT-1205: ~$119,000/yr risk reduction
- Interval optimization (7 instruments): ~$14,800/yr direct savings
- Overdue calibration resolution: ~$14,700/yr risk reduction

**Total addressable savings: ~$171,000/yr**

*Note: Configure ANTHROPIC_API_KEY in .env.local for live AI responses.*`;
  }

  return `**Calibration Intelligence Analysis**

Here's a summary of the current fleet status:

- **20 instruments** monitored across 5 departments
- **Pass rate: 71.4%** — declining trend over 18 months (was 85%+ in early 2024)
- **2 critical instruments**: FT-205 (4 consecutive failures) and VT-1205 (2 consecutive failures)
- **2 overdue**: LT-415 (12+ months) and DPT-910 (4+ months)
- **Average drift: 0.31%** — trending upward, approaching 0.5% tolerance threshold

**Top Priorities:**
1. Replace FT-205 and VT-1205 immediately
2. Schedule overdue calibrations for LT-415 and DPT-910 this week
3. Investigate PT-101 and TE-702 for root cause of accelerating drift

Ask me anything specific about your instruments, costs, or recommendations.

*Note: Configure ANTHROPIC_API_KEY in .env.local for full AI capability.*`;
}
