import mqtt from "mqtt";
import { MQTT_URL } from "./mqttConfig.js";

const TOPIC = "estufa/agua/nivel";
const options = {
  clientId: "sub-agua",
  clean: false
};

const client = mqtt.connect(MQTT_URL, options);
const leiturasRecebidas = new Set();

client.on("connect", (connack) => {
  console.log(`SUB Agua: conectado (Sessao recuperada: ${connack.sessionPresent})`);
  client.subscribe(TOPIC, { qos: 1 }, () => {
    console.log(`SUB Agua inscrito em ${TOPIC}`);
  });
});

client.on("message", (topic, msg) => {
  const payload = JSON.parse(msg.toString());
  const status = leiturasRecebidas.has(payload.leituraId) ? "duplicada" : "nova";

  leiturasRecebidas.add(payload.leituraId);
  console.log(`SUB Agua recebeu leitura ${payload.leituraId} (${status}) em ${topic}:`, payload);
});

client.on("error", (error) => {
  console.error("SUB Agua erro:", error.message);
});
