import mqtt from "mqtt";
import { MQTT_ROOT_TOPIC, MQTT_URL } from "./mqttConfig.js";

const INTERVAL_MS = Number(process.env.PUBLISH_INTERVAL_MS ?? 3000);

const device = {
  ambiente: "laboratorio",
  id: "esp32-01",
  temp: 26.5,
  humidity: 69,
  led: false
};

const client = mqtt.connect(MQTT_URL);

function topic(device, type) {
  return `${MQTT_ROOT_TOPIC}/${device.ambiente}/${device.id}/${type}`;
}

function randomAround(base, variation) {
  return Number((base + (Math.random() - 0.5) * variation).toFixed(1));
}

function publishTelemetry() {
  const payload = {
    deviceId: device.id,
    ambiente: device.ambiente,
    temperature: randomAround(device.temp, 3),
    humidity: randomAround(device.humidity, 8),
    led: device.led,
    ts: new Date().toISOString()
  };

  client.publish(topic(device, "telemetry"), JSON.stringify(payload), {
    qos: 1,
    retain: true
  });

  console.log(topic(device, "telemetry"), payload);
}

function handleCommand(messageTopic, message) {
  const [, ambiente, deviceId, type] = messageTopic.split("/");
  if (type !== "cmd") return;
  if (ambiente !== device.ambiente || deviceId !== device.id) return;

  const command = JSON.parse(message.toString());
  device.led = Boolean(command.led);

  const event = {
    message: `LED ${device.led ? "ON" : "OFF"}`,
    deviceId,
    ambiente,
    ts: new Date().toISOString()
  };

  client.publish(topic(device, "event"), JSON.stringify(event), {
    qos: 1,
    retain: false
  });

  console.log("Comando recebido:", messageTopic, event.message);
}

client.on("connect", () => {
  console.log(`Publisher conectado em ${MQTT_URL}`);
  client.subscribe(`${MQTT_ROOT_TOPIC}/+/+/cmd`, { qos: 1 });
  publishTelemetry();
  setInterval(publishTelemetry, INTERVAL_MS);
});

client.on("message", handleCommand);

client.on("error", (error) => {
  console.error("Erro MQTT:", error.message);
});
