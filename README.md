# Desafio MQTT + Node-RED

Versao simples com apenas 1 dispositivo simulado.

## O Que Tem No Projeto

1. **Mosquitto**
   Broker MQTT. Recebe e distribui mensagens.

2. **publisher.js**
   Simula 1 dispositivo: `laboratorio/esp32-01`.

3. **Node-RED**
   Recebe os dados MQTT e mostra no dashboard.

No dashboard ficam apenas 5 widgets:

- Temperatura
- Umidade
- Aviso
- LED visual
- Ligar manual

## Publisher Ou Subscriber?

O dispositivo faz duas coisas:

- Ele e **publisher** quando envia temperatura e umidade.
- Ele e **subscriber** quando espera receber comando para ligar/desligar o LED.

O Node-RED tambem faz duas coisas:

- Ele e **subscriber** quando recebe os dados do dispositivo.
- Ele e **publisher** quando envia comando para o LED.

## Como Rodar

```bash
npm install
docker compose --profile demo up --build
```

Abra o dashboard:

```text
http://localhost:1880/dashboard/
```

Se a porta `1883` estiver ocupada:

```bash
MQTT_PORT=1884 docker compose --profile demo up --build
```

## Dados Enviados Pelo Dispositivo

Topico:

```text
iot/laboratorio/esp32-01/telemetry
```

Payload:

```json
{
  "deviceId": "esp32-01",
  "ambiente": "laboratorio",
  "temperature": 24.5,
  "humidity": 55,
  "led": false
}
```

## Comando Para O LED

Topico:

```text
iot/laboratorio/esp32-01/cmd
```

Payload:

```json
{
  "led": true
}
```

Teste pelo terminal:

```bash
npm run command -- laboratorio esp32-01 on
npm run command -- laboratorio esp32-01 off
```

## Regra Automatica

O Node-RED liga o LED automaticamente por 3 segundos quando:

- temperatura for maior ou igual a `27 C`
- ou umidade for maior ou igual a `70%`

Quando isso acontece, aparece um aviso temporario no dashboard:

```text
Temperatura alta
```

ou:

```text
Umidade alta
```

## Resumo Para Apresentar

O projeto usa Mosquitto como broker MQTT. Um dispositivo simulado publica temperatura e umidade. O Node-RED recebe esses dados, mostra no dashboard e, se a temperatura chegar em `27 C` ou a umidade chegar em `70%`, envia um comando MQTT para ligar o LED por 3 segundos.
