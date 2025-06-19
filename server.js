require("dotenv").config();
const express = require("express");
const app = express();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

let lastNotificationTime = 0; // timestamp en ms

app.get("/", async (req, res) => {
  const now = Date.now();

  // Vérifie s’il y a moins de 30 secondes entre 2 scans
  if (now - lastNotificationTime < 30 * 1000) {
    return res
      .status(429)
      .send("<h1>⚠️ Trop de scans récents, merci de patienter 30 secondes.</h1>");
  }

  lastNotificationTime = now;

  const date = new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
  const time = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" });

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `<@1234284178804183151>\n📦 **Colis scanné !**
📍 **Date :** ${date}
🕒 **Heure :** ${time}
📌 _Va le chercher !_`
      })
    });

    console.log("Webhook Discord envoyé");
    res.send("<h1>✅ Notification envoyée, Merci pour la livraison</h1>");
  } catch (err) {
    console.error("Erreur webhook Discord:", err);
    res.status(500).send("<h1>❌ Erreur lors de l'envoi de la notification</h1>");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur le port ${PORT}`);
});
