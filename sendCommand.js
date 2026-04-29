import mqtt from "mqtt";
import { MQTT_ROOT_TOPIC, MQTT_URL } from "./mqttConfig.js";

const [ambiente = "laboratorio", deviceId = "esp32-01", state = "on"] = process.argv.slice(2);
const led = ["on", "true", "1", "ligar"].includes(state.toLowerCase());

const client = mqtt.connect(MQTT_URL);
const topic = `${MQTT_ROOT_TOPIC}/${ambiente}/${deviceId}/cmd`;
const payload = JSON.stringify({ led });

client.on("connect", () => {
  client.publish(topic, payload, { qos: 1, retain: false }, () => {
    console.log(`Comando enviado: ${topic} -> LED ${led ? "ON" : "OFF"}`);
    client.end();
  });
});

client.on("error", (error) => {
  console.error("Erro MQTT:", error.message);
});
