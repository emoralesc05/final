require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY exists:", !!process.env.SUPABASE_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post("/api/validate", async (req, res) => {
  try {
    const { code } = req.body;

    console.log("CODE RECEIVED:", code);

    const { data, error } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .single();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error || !data) {
      return res.status(401).json({ error: "Invalid code" });
    }

    if (!data.active) {
      return res.status(401).json({ error: "Code inactive" });
    }

    if (data.type !== "master" && data.used >= data.max_uses) {
      return res.status(401).json({ error: "Code exhausted" });
    }

    if (data.type !== "master") {
      await supabase
        .from("access_codes")
        .update({ used: data.used + 1 })
        .eq("id", data.id);
    }

const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
const device = req.headers["user-agent"];

await supabase.from("events").insert([
  {
    code: data.code,
    email: null,
    ip,
    device,
    location: "Pendiente"
  }
]);

    return res.json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }

});
app.get("/test", async (req, res) => {
  const { data, error } = await supabase
    .from("access_codes")
    .select("*");

  res.json({ data, error });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
