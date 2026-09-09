# Cachito San Juan XXIII - variante por grupos

Esta configuracion describe la variante explicada por el usuario.

## Base del turno

- Juegan varios jugadores, por ejemplo 3.
- La partida individual puede tener hasta 5 jugadores.
- La modalidad 3 vs 3 usa 6 jugadores.
- La partida se juega a una cantidad configurable de victorias.
- Por defecto se juega a 5 victorias.
- En modo individual gana la partida el jugador que llegue primero a la meta de victorias.
- En modo equipos gana la partida el equipo que llegue primero a la meta de victorias.
- Los jugadores pueden ser personas o maquinas.
- Cada jugador lanza sus dados en su turno.
- Puede plantarse si considera que el resultado es bueno.
- Si no se planta, puede lanzar una segunda vez conservando los dados que quiera.
- Si aun no se planta, puede hacer un ultimo tiro conservando nuevamente los dados que quiera.
- Al final del turno se calcula el resultado con los dados finales.

## Cantidad de dados

- Por defecto se juega con 5 dados.
- La cantidad de dados debe ser configurable para permitir variantes.

## Regla de tiros de la ronda

El primer jugador que tira en una ronda define el maximo de tiros para los demas.

- Si se planta en el primer tiro, todos los demas jugadores solo pueden tirar 1 vez.
- Si se planta en el segundo tiro, todos los demas jugadores solo pueden tirar hasta 2 veces.
- Si usa los 3 tiros, todos los demas jugadores pueden tirar hasta 3 veces.

Cada jugador puede plantarse antes de llegar al maximo permitido para esa ronda.

## Inicio de partida

Para decidir quien empieza:

- Todos los jugadores lanzan dados.
- Empieza quien saque el resultado mayor.
- Si hay empate en el mayor resultado, solo los jugadores empatados vuelven a tirar.
- Se repite hasta que exista un unico ganador del desempate.
- Luego se juega siguiendo un sentido elegido para la partida: derecha o izquierda.

## Orden de valor

El orden de menor a mayor es:

```text
2, 3, 4, 5, 6, 1
```

El `1` cuenta como as y es el valor mas alto.

## Nombres

```text
1 = ases
2 = patos
3 = tricas
4 = cuadras
5 = chinas
6 = senas
```

## Regla de agrupacion

El resultado no se calcula solamente contando dados iguales.

Se pueden juntar grupos compatibles y declarar la cantidad total usando el valor mas alto del grupo resultante.

Tambien se puede sumar un grupo menor, incluso si ese grupo menor es un solo dado. El nombre de la jugada siempre lo define el valor mas alto usado.

Por ahora se interpreta como union de dos grupos: el grupo principal y un grupo menor. No se suman todos los dados menores automaticamente.

Ejemplos:

```text
2, 2, 5, 5, 4
```

Se juntan `2,2` y `5,5`.

Resultado declarado:

```text
4 quinas
```

Porque hay 4 dados agrupados y el valor mayor entre esos grupos es `5`.

```text
2, 2, 3, 4, 5, 1
```

Se juntan `2,2` con `1`.

Resultado declarado:

```text
3 ases
```

Porque el grupo usa 3 dados y el valor mayor es el as (`1`).

```text
1, 1, 5, 4, 3
```

Se juntan `1,1` con `5`.

Resultado declarado:

```text
3 ases
```

Porque ya hay un grupo de ases y se le suma un dado menor.

## Cachito

Si un jugador obtiene 5 ases, el resultado es `cachito` y gana automaticamente.
La victoria ocurre inmediatamente al terminar la tirada, sin que el jugador tenga que plantarse.

## Modalidad 3 vs 3

Existe una variante por equipos de 3 contra 3.

### Inicio

- Se define quien empieza lanzando dados.
- El jugador que obtiene el mayor resultado inicia la ronda.
- Ese jugador lanza su jugada y puede plantarse donde quiera, siguiendo el maximo de 3 tiros.
- Su resultado queda como la jugada activa que debe ser superada.

### Reto entre equipos

- Despues de la jugada inicial, el equipo contrario debe intentar ganarle.
- Si el primer jugador del equipo contrario no logra ganarle, intenta el siguiente jugador de su mismo equipo.
- Si ese tampoco logra ganarle, intenta el tercer jugador de ese equipo.
- Si uno de ellos logra superar la jugada activa, entonces el reto vuelve al equipo inicial.
- El equipo inicial debe responder intentando superar la nueva jugada activa.
- Gana el equipo cuyo jugador haya conseguido la jugada ganadora al final del enfrentamiento.

### Interpretacion actual

La partida funciona como una cadena de retos:

```text
Equipo A marca una jugada.
Equipo B intenta superarla con sus jugadores disponibles.
Si Equipo B la supera, Equipo A debe responder.
Si Equipo A no logra responder, gana Equipo B.
Si Equipo A supera, el reto vuelve a Equipo B.
```

## Salas y bots

- Un jugador crea la partida y actua como host.
- Otros jugadores pueden entrar a la partida.
- El host puede indicar que algunos puestos seran bots.
- Los bots se ejecutan usando los recursos del host.
- No habra un servidor controlando los bots.
- Los demas jugadores solo reciben y ven los resultados que produce el host para esos bots.
- La app empieza con acceso local: username y nombre visible.
- Luego muestra un lobby con datos del usuario, salas para entrar y opcion de crear sala.
- La creacion de sala se hace en un popup con tipo publica o privada, modalidad, dados, sentido y nombres singulares de cada numero.
- La creacion de sala incluye la meta de victorias para ganar la partida.
- Despues de crear una sala, el usuario pasa a una sala de espera.
- En la sala de espera se configuran puestos como jugador o bot.
- En modo 3 vs 3, la sala de espera muestra los puestos separados por Equipo A y Equipo B.
- Por defecto, los puestos libres se crean como bots ya cargados con nombres reales.
- Si un puesto cambia de jugador a bot, se vuelve a cargar automaticamente como bot.
- Cada nombre muestra un simbolo pequeno que indica si es jugador o bot, sin texto extra de tipo.
- La ficha del usuario actual usa un color distinto.
- Si un puesto es jugador, queda preparado para que luego Firebase espere a otra persona real.
- Si un puesto es bot, el host define el nombre y el navegador del host lo ejecuta.
- En la version local, los bots conservan su mejor grupo y siguen tirando mientras tengan tiros disponibles.
- Si un bot saca `cachito`, no se planta: gana automaticamente y la ronda termina.
- Los bots se plantan automaticamente si ya llegaron al limite de tiros permitido.
- Si un bot abre la ronda, puede plantarse antes para limitar a los demas si obtiene una jugada fuerte.
- Como criterio inicial, si abre con 4 senas o 4 ases en el primer tiro, se planta.
- Si abre con 4 chinas, 4 senas o 4 ases en el segundo tiro, tambien se planta.
- Si el bot esta respondiendo una marca, intenta superar la jugada activa antes de plantarse.

## Estados visuales

- El jugador que ya tiro en la ronda se muestra mas opaco.
- El jugador que tiene el turno actual se resalta con mas fuerza.
- El ganador de la ronda anterior muestra una corona en la esquina superior izquierda de su ficha.
- Las fichas de jugadores que ya tiraron se pueden voltear para ver su jugada en dados.
- Tambien existe una opcion general para mostrar u ocultar los dados de todas las fichas jugadas.

## Pendientes

- Confirmar si `senas` es el nombre correcto del grupo para el valor `6`.
- Confirmar si el ejemplo `2, 2, 3, 4, 5, 1` corresponde a una variante con 6 dados o solo fue un ejemplo conceptual.
- Confirmar el orden exacto de turnos en la modalidad 3 vs 3: si se alterna por posicion en mesa, por eleccion del equipo o por un orden fijo de jugadores.
- Confirmar si en 3 vs 3 cada jugador puede participar solo una vez por enfrentamiento o si puede volver a jugar cuando el reto regresa a su equipo.
