import mqtt from "mqtt";
import { MQTT_URL } from "./mqttConfig.js";

const TOPIC = "estufa/alerta/incendio";

const client = mqtt.connect(MQTT_URL, {
  clientId: "sub-fogo",
  clean: false
});

const recebidas = new Set();

client.on("connect", () => {
  console.log("SUB Fogo: conectado");

  client.subscribe(TOPIC, { qos: 2 }, () => {
    console.log(`SUB Fogo inscrito em ${TOPIC}`);
  });
});

client.on("message", (topic, msg) => {
  const payload = JSON.parse(msg.toString());
  const chave = payload.alertaId;

  if (recebidas.has(chave)) {
    console.log(`SUB Fogo recebeu duplicata do alerta ${chave} em ${topic}`);
  } else {
    recebidas.add(chave);
    console.log(`SUB Fogo recebeu alerta ${chave} em ${topic}:`, payload);
    console.log("SUB Fogo: acionando sistema de extincao automatica");
  }
});

client.on("error", (error) => {
  console.error("SUB Fogo erro:", error.message);
});
