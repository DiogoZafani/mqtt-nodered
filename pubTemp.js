import mqtt from "mqtt";
import { MQTT_URL } from "./mqttConfig.js";

const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log("PUB Temp: conectado");

  setInterval(() => {
    const temperatura = 30;
    client.publish("estufa/temp/ambiente", `msg ${temperatura} C (QoS0)`, { qos: 0 });
    console.log("PUB QoS0 enviou:", temperatura);

  }, 5000);
});

client.on("error", (error) => {
  console.error("PUB Temp erro:", error.message);
});
