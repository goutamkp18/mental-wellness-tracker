require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { spawn } = require("child_process");

// Supabase Client
const supabase = require("./supabase.js");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- SIGNUP --------------------
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = await supabase
    .from("users")
    .insert([{ name, email, password }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ success: true });
});

// -------------------- LOGIN --------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data)
    return res.status(400).json({ error: "Invalid email or password" });

  res.json({ name: data.name, email: data.email });
});

// -------------------- GET RESULTS --------------------
app.get("/api/results", async (req, res) => {
  const email = req.query.email;

  const { data } = await supabase
    .from("results")
    .select("*")
    .eq("email", email)
    .order("ts", { ascending: false });

  res.json(data);
});

// -------------------- FALLBACK JS ANALYSIS --------------------
function useFallback(req, res) {
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    total += parseInt(req.body[`q${i}`]) || 2;
  }

  const dummyBreakdown = {
    energy: total,
    emotional: total - 2,
    social: total - 4,
    mental: total - 6,
    outlook: total - 8
  };

  const result = {
    score: total,
    mood: "Neutral",
    breakdown: dummyBreakdown,
    answers: []
  };

  res.json(result);
}

// -------------------- CALCULATE BREAKDOWN --------------------
function calculateBreakdown(answers) {
  return {
    energy: (answers[0] || 0) + (answers[1] || 0),
    emotional: (answers[2] || 0) + (answers[3] || 0),
    social: (answers[4] || 0) + (answers[5] || 0),
    mental: (answers[6] || 0) + (answers[7] || 0),
    outlook: (answers[8] || 0) + (answers[9] || 0),
  };
}

// -------------------- ANALYZE (C PROGRAM) --------------------
app.post("/api/analyze", async (req, res) => {
  try {
    const formData = new URLSearchParams();

    // Send q1–q10 to C program
    for (let i = 1; i <= 10; i++) {
      formData.append(`q${i}`, req.body[`q${i}`] || "2");
    }

    if (req.body.email) formData.append("email", req.body.email);

    // If .exe is missing → fallback mode
    if (!fs.existsSync("./mindsurvey.exe")) {
      console.log("C program NOT found → fallback");
      return useFallback(req, res);
    }

    const exe = spawn("./mindsurvey.exe", {
      env: { JSON_MODE: "1" },
    });

    let output = "";
    exe.stdin.write(formData.toString());
    exe.stdin.end();

    exe.stdout.on("data", (d) => (output += d.toString()));

    exe.on("close", async () => {
      console.log("RAW C OUTPUT:", output);

      const start = output.indexOf("{");
      const end = output.lastIndexOf("}") + 1;

      if (start === -1 || end === 0) {
        console.log("⚠ INVALID JSON → fallback");
        return useFallback(req, res);
      }

      let result;
      try {
        result = JSON.parse(output.substring(start, end));
      } catch {
        console.log("⚠ JSON PARSE FAIL → fallback");
        return useFallback(req, res);
      }

      // Compute breakdown if missing
      const breakdown = result.breakdown || calculateBreakdown(result.answers);

      // ------------------ SAVE TO SUPABASE ------------------
      console.log("📌 Saving to Supabase...");

      const { error } = await supabase.from("results").insert([
        {
          email: req.body.email,
          score: result.score,
          mood: result.mood,
          breakdown: breakdown,
          answers: result.answers,
          ts: new Date().toISOString(),
        },
      ]);

      if (error) console.log("❌ SUPABASE ERROR:", error);

      // ---------- FIX RESULT FOR FRONTEND ----------
      result.breakdown = breakdown;
      result.message = result.message || "";
      result.suggestions = result.suggestions || result.advice || "";

      return res.json({
        score: result.score,
        mood: result.mood,
        message: result.message,
        suggestions: result.suggestions,
        breakdown: breakdown,
        answers: result.answers,
      });
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    useFallback(req, res);
  }
});

// -------------------- HEALTH CHECK --------------------
app.get("/api/health", (_, res) =>
  res.json({ status: "OK", ts: new Date().toISOString() })
);

// -------------------- START SERVER --------------------
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
