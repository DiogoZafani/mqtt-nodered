import mqtt from "mqtt";
import { MQTT_URL } from "./mqttConfig.js";

const TOPIC = "estufa/alerta/incendio";
const INTERVALO_MONITORAMENTO_MS = 3000;

const client = mqtt.connect(MQTT_URL, {
  clientId: "pub-fogo",
  clean: false
});

client.on("connect", () => {
  console.log("PUB Fogo: conectado e monitorando");
  let alertaId = 0;

  setInterval(() => {
    const incendioDetectado = Math.random() < 0.2;

    if (!incendioDetectado) {
      console.log("PUB Fogo: sem indicios de incendio");
      return;
    }

    const payload = JSON.stringify({
      sensor: "detector_incendio",
      alertaId,
      tipo: "fogo_ou_fumaca",
    });

    client.publish(TOPIC, payload, { qos: 2 }, (error) => {
      if (error) {
        console.error(`PUB Fogo falhou no alerta ${alertaId}:`, error.message);
        return;
      }

      console.log(`PUB Fogo enviou alerta ${alertaId}`);
      alertaId++;
    });
  }, INTERVALO_MONITORAMENTO_MS);
});

client.on("error", (error) => {
  console.error("PUB Fogo erro:", error.message);
});
