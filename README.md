# CCR Cachito

Juego local de Cachito San Juan XXIII hecho con HTML, CSS y JavaScript puro.

## Descripcion

CCR Cachito es una version web responsive de la variante Cachito San Juan XXIII, con practica individual, practica por equipos, bots, animaciones de vaso y dados, fichas de jugadores, rondas, marcador de victorias y deteccion automatica de jugadas.

## Como ejecutar

Abre `index.html` directamente en el navegador.

No requiere instalacion, servidor local ni dependencias externas.

## Caracteristicas

- Practica individual con valores por defecto.
- Practica por equipos con valores por defecto.
- Multijugador preparado visualmente, actualmente desactivado.
- Lobby con usuario, username y salida.
- Modal de creacion de sala conservado para una futura version online.
- Modalidad todos contra todos.
- Modalidad por equipos.
- Bots locales para simular jugadores.
- Sorteo inicial para definir quien empieza.
- Orden de turno configurable por sentido de mesa.
- Limite de tiros definido por el primer jugador que se planta.
- Dados guardados entre tiros.
- Dados guardados del turno actual editables antes de volver a lanzar.
- Fichas laterales de jugadores con puntaje, orden, jugada, tiros y dados.
- Etiqueta superior con la jugada a superar, ganador de ronda o campeon.
- Animaciones de vaso boca abajo, entrada de dados al vaso, barajado y salida de dados.
- Animacion de ganador de ronda y campeon de partida.
- Soporte responsive para movil vertical y movil horizontal.

## Reglas

La variante esta documentada en:

- `reglas-variante.md`

## Estructura

```text
cachito/
|-- index.html
|-- styles.css
|-- app.js
|-- reglas-variante.md
|-- README.md
`-- .gitignore
```

## Estado del proyecto

Version local jugable. La base de interfaz para multijugador existe, pero el modo online queda pendiente para conectarse posteriormente con una solucion como Firebase u otro backend.
