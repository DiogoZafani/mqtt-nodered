import mqtt from "mqtt";
import { MQTT_URL } from "./mqttConfig.js";

const TOPIC = "estufa/agua/nivel";
const INTERVALO_MS = 5000;

const client = mqtt.connect(MQTT_URL, {
  clientId: "pub-agua",
  clean: false
});

client.on("connect", () => {
  console.log("PUB Agua: conectado");
  let leituraId = 0;

  setInterval(() => {
    const nivel = "71%";
    const payload = JSON.stringify({
      sensor: "nivel_agua",
      leituraId,
      nivel
    });

    client.publish(TOPIC, payload, { qos: 1 }, (error) => {
      if (error) {
        console.error(`PUB Agua falhou na leitura ${leituraId}:`, error.message);
        return;
      }

      console.log(`PUB Agua enviou leitura ${leituraId}: ${nivel}`);
      leituraId++;
    });
  }, INTERVALO_MS);
});

client.on("error", (error) => {
  console.error("PUB Agua erro:", error.message);
});
