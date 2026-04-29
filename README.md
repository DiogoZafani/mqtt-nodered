# Desafio MQTT + Node-RED

Projeto simples com:

- Mosquitto
- Node-RED com dashboard FlowFuse
- 1 dispositivo simulado em `publisher.js`

## Como Rodar

```bash
npm install
docker compose --profile demo up --build
```

Abra:

```text
http://localhost:1880/dashboard/
```

Se a porta `1883` estiver ocupada:

```bash
MQTT_PORT=1884 docker compose --profile demo up --build
```

## Como Funciona

O `publisher.js` simula o dispositivo:

```text
laboratorio/esp32-01
```

Ele envia temperatura e umidade para este topico:

```text
iot/laboratorio/esp32-01/telemetry
```

O Node-RED recebe esses dados e mostra no dashboard:

- gauge de temperatura
- gauge de umidade
- grafico de temperatura e umidade
- aviso em vermelho
- lampada visual do LED

## Regra Do LED

Se acontecer uma dessas condicoes:

- temperatura `>= 27 C`
- umidade `>= 70%`

o Node-RED:

1. mostra o aviso vermelho
2. envia comando MQTT para ligar o LED
3. acende a lampada visual
4. desliga o LED depois de 3 segundos

Topico do comando:

```text
iot/laboratorio/esp32-01/cmd
```

Payload:

```json
{
  "led": true
}
```

## Resumo

O dispositivo publica dados MQTT. O Node-RED assina esses dados, mostra no dashboard e envia um comando MQTT quando a temperatura ou a umidade passa do limite.
