import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const target = req.query.url as string;

  if (!target) return res.status(400).json({ error: "Missing url param" });

  const response = await fetch(target, {
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(response.status).json(data);
}