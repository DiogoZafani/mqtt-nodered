import mqtt from "mqtt";
import { MQTT_URL } from "./mqttConfig.js";

const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log("SUB QoS0: conectado");
  client.subscribe("estufa/temp/ambiente", { qos: 0 });
});

client.on("message", (topic, msg) => {
  console.log("SUB QoS0 recebeu:", msg.toString());
});
