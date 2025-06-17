require("dotenv").config();
const express = require("express");
const app = express();


const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))


const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

app.get("/", (req, res) => {
  const now = new Date();
  const date = now.toLocaleDateString('fr-FR', { timeZone: "Europe/Paris" });
  const time = now.toLocaleTimeString('fr-FR', { timeZone: "Europe/Paris" });

  fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
       content: `📦 **Colis scanné !**
📍 **Date :** ${date}
🕒 **Heure :** ${time}
📌 _Va le chercher ! _`
    })
  })
  .then(() => console.log('Webhook Discord envoyé'))
  .catch(err => console.error('Erreur webhook Discord:', err));

  res.send("<h1>Notification envoyée , Merci pour la livraison</h1>");
});

app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur le port ${PORT}`);
});
