import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responses, questions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare the data for AI analysis
    const questionTexts = questions.map((q: any) => q.text).join("\n");
    const responseData = Object.entries(responses)
      .map(([qId, answer]) => {
        const question = questions.find((q: any) => q.id === parseInt(qId));
        return `Q: ${question?.text}\nA: ${answer}/5`;
      })
      .join("\n\n");

    const systemPrompt = `You are a mental wellness AI assistant. Analyze the user's mood assessment responses and provide:
1. An overall wellness score (0-100)
2. Scores for 10 wellness dimensions (each 0-100):
   - emotional_wellbeing
   - stress_anxiety (note: lower stress = higher score)
   - sleep_quality
   - social_connections
   - physical_health
   - work_life_balance
   - self_care
   - mental_clarity
   - resilience
   - life_satisfaction
3. Personalized insights and actionable recommendations

Be empathetic, supportive, and provide specific, actionable advice. Keep insights concise but meaningful.`;

    const userPrompt = `Here are the assessment responses:\n\n${responseData}\n\nPlease analyze these responses and provide the wellness scores and insights.`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_wellness_analysis",
            description: "Provide comprehensive wellness analysis with scores and insights",
            parameters: {
              type: "object",
              properties: {
                overallScore: {
                  type: "integer",
                  description: "Overall wellness score from 0-100",
                },
                metrics: {
                  type: "object",
                  properties: {
                    emotional_wellbeing: { type: "integer" },
                    stress_anxiety: { type: "integer" },
                    sleep_quality: { type: "integer" },
                    social_connections: { type: "integer" },
                    physical_health: { type: "integer" },
                    work_life_balance: { type: "integer" },
                    self_care: { type: "integer" },
                    mental_clarity: { type: "integer" },
                    resilience: { type: "integer" },
                    life_satisfaction: { type: "integer" },
                  },
                  required: [
                    "emotional_wellbeing",
                    "stress_anxiety",
                    "sleep_quality",
                    "social_connections",
                    "physical_health",
                    "work_life_balance",
                    "self_care",
                    "mental_clarity",
                    "resilience",
                    "life_satisfaction",
                  ],
                },
                insights: {
                  type: "string",
                  description: "Personalized insights and recommendations (2-3 paragraphs)",
                },
              },
              required: ["overallScore", "metrics", "insights"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_wellness_analysis" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls[0];
    const analysis = JSON.parse(toolCall.function.arguments);

    // Return the structured analysis
    return new Response(
      JSON.stringify({
        overallScore: analysis.overallScore,
        metrics: analysis.metrics,
        insights: analysis.insights,
        scores: responses, // Original responses for reference
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-mood function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});