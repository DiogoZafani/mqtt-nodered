Sensor 1:
R: Qos0, pois os dados não são críticos e não tem problema caso não envie.
Sensor 2:
R: Qos1, porque eu preciso que a mensagem seja enviada, mas não tenho problema caso a mensagem seja duplicada.
Sensor 3:
R: Qos2, preciso que a mensagem seja enviada e não posso ter duplicidades.# mqtt-nodered
