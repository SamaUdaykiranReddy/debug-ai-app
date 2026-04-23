import Debug from "../models/Debug.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// CREATE DEBUG
export const createDebug = async (req, res) => {
  try {
    const { title, codeSnippet, errorMessage } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const debug = await Debug.create({
      user: req.user._id,
      title,
      codeSnippet,
      errorMessage,
    });

    res.status(201).json(debug);
  } catch (error) {
    console.error("Create debug error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER DEBUGS
export const getDebugs = async (req, res) => {
  try {
    const logs = await Debug.find({ user: req.user._id }).select("-__v");
    res.status(200).json(logs);
  } catch (error) {
    console.error("Get debugs error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE DEBUG
export const deleteDebug = async (req, res) => {
  try {
    const debug = await Debug.findById(req.params.id);

    if (!debug) {
      return res.status(404).json({ message: "Debug log not found" });
    }

    if (
      debug.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this log" });
    }

    await debug.deleteOne();
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    console.error("Delete debug error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// SOLVE DEBUG WITH AI
export const solveDebugWithAi = async (req, res) => {
  try {
    const debug = await Debug.findById(req.params.id);

    if (!debug) {
      return res.status(404).json({ message: "Debug log not found" });
    }

    if (
      debug.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this log" });
    }

    if (!debug.codeSnippet && !debug.errorMessage) {
      return res.status(400).json({
        message: "No code or error message provided",
      });
    }

    const prompt = `
You are a senior software engineer and debugging expert.
Analyze the following code and error, then respond in this exact format:

## Root Cause
[One clear sentence identifying the problem]

## Explanation
[2-3 sentences explaining why this error occurs]

## Step-by-Step Fix
[Numbered steps to fix the issue]

## Best Practices
[1-2 bullet points to prevent this in future]

---
CODE:
\`\`\`
${debug.codeSnippet || "No code provided"}
\`\`\`

ERROR:
${debug.errorMessage || "No error provided"}

Be concise and practical. Focus on the fix.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });

    debug.solution = response.choices[0].message.content.trim();
    debug.status = "solved";
    await debug.save();

    res.status(200).json(debug);
  } catch (error) {
    console.error("AI solve error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// APPLY AI FIX
export const applyFixAi = async (req, res) => {
  try {
    const debug = await Debug.findById(req.params.id);

    if (!debug) {
      return res.status(404).json({ message: "Debug log not found" });
    }

    if (
      debug.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this log" });
    }

    if (!debug.codeSnippet) {
      return res.status(400).json({ message: "No code snippet to fix" });
    }

    if (!debug.solution) {
      return res
        .status(400)
        .json({ message: "Solve with AI first before applying fix" });
    }

    const prompt = `
You are a senior software engineer. Fix the code below based on the AI suggestion.

CODE:
\`\`\`
${debug.codeSnippet}
\`\`\`

AI SUGGESTION:
${debug.solution}

Rules:
- Return ONLY the fixed code, no explanations, no markdown, no backticks.
- Keep the same language and structure as the original.
- Apply only the necessary changes to fix the issue.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    });

    debug.fixedCode = response.choices[0].message.content.trim();
    debug.status = "fixed";
    await debug.save();

    res.status(200).json(debug);
  } catch (error) {
    console.error("AI fix error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
