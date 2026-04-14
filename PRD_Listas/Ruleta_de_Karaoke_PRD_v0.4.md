# PRD - Ruleta de Karaoke
**Versión:** v0.4  
**Estado:** Draft actualizado  
**Tipo de producto:** Web app / party game social  
**Estrategia de implementación:** **shared-screen first**, resuelta inicialmente como **desktop web adaptable a pantalla grande**  
**Compatibilidad secundaria:** mobile responsive para abrir, entender y explorar  
**Evolución natural:** control desde celular y arquitectura host + phones

---

## 1. Resumen del producto

**Ruleta de Karaoke** es una web app de party game pensada para previas, juntadas, vacaciones y streams grupales. La app transforma el karaoke tradicional en una experiencia social, rápida y caótica: una ruleta elige una canción popular y una segunda ruleta define una consigna incómoda o absurda para cantarla.

El producto no está pensado como un karaoke convencional ni como una app técnica. Su propuesta es simple: abrir, girar, exponer a alguien y generar una situación lo bastante graciosa como para que el grupo quiera seguir jugando y, idealmente, filmarlo.

La primera implementación debe priorizar una **pantalla compartida**: notebook, TV con navegador, monitor o proyector. El control desde celular es una mejora posterior, no el centro del MVP inicial.

## 2. Visión del producto

Convertir el karaoke en un party game simple, inmediato y memorable, diseñado para activar una juntada, reducir la fricción de elegir canciones y generar momentos graciosos, filmables y rejugables.

## 3. Estrategia de producto

### Implementación inicial
La primera versión debe ser **web shared-screen first**, resuelta como experiencia desktop adaptable a distintos tamaños y resoluciones de pantalla.

### Compatibilidad secundaria
Debe poder abrirse en mobile, adaptarse a vertical y permitir “entrar a ver qué onda”, pero esa no será la prioridad de diseño del MVP.

### Evolución posterior
El producto debe diseñarse desde el inicio para evolucionar naturalmente hacia:
- control desde celular
- sesiones tipo host + phones
- party mode más robusto

### Principio rector
Aunque el MVP inicial sea single-screen, las decisiones de UX y arquitectura no deben bloquear la futura separación entre pantalla compartida y control individual.

## 4. Objetivo del producto

Validar un producto simple y altamente jugable que:

- reduzca la fricción típica del karaoke tradicional
- convierta una canción en una dinámica de juego
- funcione casi instantáneamente al abrirse
- genere suficiente diversión como para sostener varias rondas seguidas
- tenga potencial de viralidad social y visual
- funcione bien en una pantalla compartida desde su primera implementación

## 5. Problema que resuelve

### Problema funcional
En reuniones sociales, el karaoke tradicional suele fallar por:
- exceso de tiempo eligiendo canciones
- dependencia de una persona que pilotee la experiencia
- poca participación del grupo
- dificultad para que se animen quienes cantan peor o tienen vergüenza

### Problema social
Muchas juntadas necesitan una actividad que:
- active rápido al grupo
- rompa el hielo
- genere risas sin demasiada preparación
- no requiera explicar reglas complejas
- se vea bien y se entienda fácil en una pantalla compartida

### Solución propuesta
Ruleta de Karaoke elimina la decisión de qué cantar, suma una restricción absurda o incómoda y convierte cada ronda en una situación de juego simple, inmediata y social.

## 6. Usuario objetivo

### Usuario principal
Adolescentes y jóvenes que participan de:
- previas
- juntadas en casas
- vacaciones grupales
- reuniones sociales de entre 5 y 15 personas

### Usuario secundario
- familias o cumpleaños informales
- streamers o creadores que quieran usarlo en vivo
- hosts/eventos que busquen una dinámica rápida

## 7. Propuesta de valor

**No elegís qué cantar ni cómo cantarlo: la ruleta decide y vos te arreglás.**

La app convierte el karaoke en un party game simple, inmediato y memorable, diseñado para activar un grupo y generar momentos filmables con mínima fricción.

## 8. Principios del producto

1. **Instantáneo**  
   Al abrir la app, debe poder arrancar una ronda en segundos.

2. **Simple**  
   Point-and-click. Nada técnico, nada recargado.

3. **El juego manda**  
   No es un reproductor de karaoke con adornos. Es un party game musical.

4. **Shared-screen first**  
   La interfaz principal debe diseñarse para verse bien a distancia y frente a varias personas.

5. **Vergüenza divertida, no humillante**  
   El humor puede ser incómodo o picante, pero no expulsivo.

6. **Visualmente grabable**  
   El reveal, la composición y el ritmo deben verse bien en cámara.

7. **Rejugable**  
   Tiene que invitar a hacer “una más”.

8. **Diseño evolutivo**  
   El MVP no debe trabar el futuro paso a host + phones.

## 9. Objetivo del MVP inicial

La primera versión busca validar:

- que el loop principal funcione
- que la combinación canción + desafío sea divertida
- que la experiencia sea suficientemente simple como para empezar a jugar sin tutorial
- que la UI funcione bien en notebook, monitor, TV o proyector
- que el producto tenga potencial real de uso en contexto social
- que la reproducción embebida no rompa el flujo

### El MVP inicial no busca resolver todavía
- control desde celular
- party sessions con código o QR
- roles multi-device
- cast nativo
- sincronización en tiempo real entre dispositivos
- scoring, ranking o modos competitivos

## 10. Alcance por etapas

### Etapa 1 - MVP inicial shared-screen
Incluye:
- web app desktop/shared-screen first
- responsive básico para mobile
- catálogo inicial de canciones en español
- catálogo inicial de desafíos
- configuración básica
- giro de canción y desafío
- reproducción embebida del karaoke
- hasta 2 cambios de canción por ronda
- opción de cargar jugadores, no obligatoria
- persistencia de configuración básica

### Etapa 2 - Evolución social
Incluye:
- control desde celular
- party mode tipo host + phones
- código y/o QR para sumarse
- separación entre pantalla espectáculo y pantalla control

### Fuera de alcance inicial
- puntaje
- votación
- ranking
- ganador
- modo torneo
- modo dúo formal
- catálogo colaborativo de usuarios
- login complejo
- perfiles avanzados
- anuncios
- cast nativo
- AirPlay / Chromecast dedicados

## 11. Mecánica central

### Loop principal
1. El usuario abre la app.
2. Si quiere, ajusta configuración inicial.
3. Toca **Girar**.
4. Gira la ruleta de canciones.
5. Gira la subruleta de desafíos, o dos ruedas sobre el mismo eje.
6. Se revelan:
   - canción + artista
   - desafío
7. Se muestran dos botones:
   - **Cantar**
   - **Cambiar canción**
8. Si toca **Cantar**, se abre el karaoke embebido dentro de la app.
9. Si toca **Cambiar canción**, se mantiene el desafío y se elige otra canción.
10. Máximo 2 cambios por ronda.
11. Finalizada o interrumpida la canción, se puede pasar a la siguiente ronda.

## 12. Reglas del juego v1

### Regla 1: una canción + un desafío
Cada ronda tiene obligatoriamente:
- 1 canción aleatoria
- 1 desafío aleatorio

### Regla 2: el desafío queda fijo
El desafío no se puede rerollear. Solo puede cambiarse la canción.

### Regla 3: límite de cambios
Cada ronda permite hasta **2 cambios de canción**.

### Regla 4: sin puntaje
No hay scoring automático ni validación de performance.

### Regla 5: jugadores opcionales
Se pueden cargar nombres, pero no es requisito para jugar.

## 13. Configuración inicial

La configuración debe existir, pero no frenar el arranque.

### Configuraciones v1
- **Idioma:** español
- **Intensidad de desafíos:** suave / estándar / picante
- **Jugadores:** opcional
- **Guardar preferencias:** sí

### Requerimiento UX
La app debe recordar las configuraciones elegidas previamente para minimizar fricción.

## 14. Requerimientos funcionales - MVP inicial

### RF1. Inicio rápido
El usuario debe poder abrir la app y acceder de inmediato al botón principal de juego.

### RF2. Configuración editable
La app debe permitir configurar intensidad, jugadores y defaults antes de comenzar y modificarlos más tarde.

### RF3. Motor de selección aleatoria
La app debe seleccionar una canción y un desafío al azar según los filtros activos.

### RF4. Reveal visual
La selección debe mostrarse mediante una ruleta o mecanismo visual equivalente que comunique azar y expectativa.

### RF5. Resultado de ronda
La app debe mostrar:
- canción
- artista
- desafío
- cantidad de cambios restantes
- botón **Cantar**
- botón **Cambiar canción**

### RF6. Reemplazo de canción
El usuario debe poder cambiar solo la canción, manteniendo el mismo desafío, hasta un máximo de 2 veces.

### RF7. Reproducción embebida
El karaoke debe reproducirse dentro de la app, sin sacar al usuario a YouTube.

### RF8. Control básico del reproductor
Durante la reproducción, la app debe permitir:
- pausar
- terminar canción
- avanzar a siguiente ronda

### RF9. Persistencia simple
La app debe recordar configuraciones básicas entre sesiones.

### RF10. Adaptación a pantalla grande
La UI debe poder escalar correctamente a notebook, monitor, TV o proyector, manteniendo legibilidad, jerarquía visual y claridad a distancia.

### RF11. Compatibilidad mobile secundaria
La app debe poder abrirse en mobile sin romperse, con adaptación básica a vertical para exploración, aunque no sea la experiencia principal del MVP.

## 15. Requerimientos no funcionales

### RNF1. Velocidad
La primera ronda debe poder iniciarse en menos de 10 segundos desde la apertura de la app.

### RNF2. Claridad
La interfaz debe ser comprensible sin tutorial.

### RNF3. Legibilidad a distancia
Tipografía, botones y jerarquía visual deben funcionar en pantalla compartida.

### RNF4. Baja fricción
La navegación debe minimizar pasos, modales y pantallas intermedias.

### RNF5. Estética social
La interfaz debe sentirse festiva, viva y fácil de grabar con otro celular.

### RNF6. Adaptabilidad
La experiencia debe comportarse bien en distintas resoluciones y tamaños de pantalla.

## 16. Contenido inicial v1

### Canciones
- **Cantidad objetivo:** 100
- **Idioma:** español
- **Tipo:** hits masivos, reconocimiento inmediato
- **Uso:** cada canción debe tener asociado un video karaoke reproducible embebido

### Desafíos
- **Cantidad objetivo:** 12 a 15
- **Organización por intensidad**
  - suaves
  - estándar
  - picantes

### Criterio de contenido
La prioridad no es diversidad extrema sino jugabilidad.  
En v1 conviene priorizar canciones que la mayoría reconozca y desafíos que funcionen rápido.

## 17. Arquitectura de experiencia - MVP inicial

### Pantalla 1 - Home
Debe incluir:
- branding / nombre
- botón principal **Girar**
- acceso secundario a configuración

### Pantalla 2 - Configuración
Debe permitir:
- elegir intensidad
- cargar jugadores opcionalmente
- guardar defaults

### Pantalla 3 - Giro
Animación de ruleta:
- ruleta de canción
- subruleta de desafío o doble rueda
- reveal claro, visible a distancia

### Pantalla 4 - Resultado
Debe mostrar:
- canción + artista
- desafío
- cambios restantes
- botón **Cantar**
- botón **Cambiar canción**

### Pantalla 5 - Reproductor
Debe mostrar:
- video karaoke embebido
- controles mínimos
- acción clara para terminar ronda

## 18. User flow principal

### Flujo base
1. Usuario abre app
2. Ve botón principal de juego
3. Toca **Girar**
4. Se ejecuta reveal
5. Se muestran resultado y acciones
6. Usuario canta o cambia canción
7. Se reproduce karaoke
8. Usuario termina ronda
9. Vuelve al inicio de ronda

### Flujo alternativo
1. Usuario abre app
2. Entra a configuración
3. Ajusta intensidad / jugadores
4. Guarda
5. Inicia ronda

## 19. Métricas de validación inicial

### Métricas de uso
- tiempo hasta primera ronda
- cantidad de rondas por sesión
- tasa de uso de “cambiar canción”
- porcentaje de rondas que llegan a reproducción
- duración media de sesión

### Métricas de validación cualitativa
- ¿la gente entiende el juego sin explicación?
- ¿se ríen rápido?
- ¿aparece la necesidad espontánea de “otra ronda”?
- ¿alguien lo filma o lo muestra?
- ¿la experiencia se siente más cercana a un juego que a un karaoke?

## 20. Riesgos

### Riesgo 1: dependencia de videos externos
Si los videos embebidos fallan, desaparecen o se bloquean, la experiencia se rompe.

### Riesgo 2: catálogo insuficiente
Si las 100 canciones no están bien elegidas, el juego puede sentirse repetitivo o flojo demasiado rápido.

### Riesgo 3: desafíos flojos
Si los desafíos no son lo bastante graciosos o variados, el diferencial del producto cae.

### Riesgo 4: interfaz poco legible en pantalla grande
Si la UI no se ve clara a distancia, el producto pierde parte central de su valor.

### Riesgo 5: deriva hacia un karaoke convencional
Si se agregan demasiadas opciones, modos o configuraciones, el producto puede perder simpleza y gracia.

## 21. Oportunidades post-MVP

### Etapa siguiente
- control desde celular
- party mode tipo host + phones
- reveal más filmable y teatral
- expansión a 150-200 canciones
- mejoras visuales de ronda

### Etapa posterior
- inglés
- modo dúo
- packs temáticos
- propuesta de canciones por usuarios
- branded challenges
- monetización con ads o patrocinios

## 22. Decisiones ya tomadas

- El producto es un **party game**, no un karaoke tradicional.
- El objetivo principal es **risa y caos social**, no competencia.
- La primera implementación es **shared-screen first**.
- La resolución inicial será **desktop web adaptable a pantalla grande**.
- Mobile debe ser compatible, pero no es prioridad de diseño.
- El desafío **no puede cambiarse**.
- La canción **sí puede cambiarse**, máximo 2 veces.
- La experiencia debe ser **instantánea**.
- La v1 debe empezar con **100 canciones en español**.
- El contenido debe ser de **hits reconocibles**.
- La app debe sentirse **simple, visual y grabable**.
- El control desde celular es **evolución posterior**, no centro del MVP.

## 23. Open questions

- ¿El reroll de canción mantiene la misma animación o usa una transición más corta?
- ¿La carga de jugadores afecta turnos o solo sirve como referencia visual?
- ¿Cuál es la duración ideal de la animación de reveal antes de volverse molesta?
- ¿Qué criterio editorial asegura videos karaoke embebibles estables?
- ¿Cómo se presentará en mobile para que sirva de puerta de entrada sin desviar foco?

## 24. Definición final del MVP

**Ruleta de Karaoke MVP es una web app de party game diseñada prioritariamente para pantalla compartida, implementada inicialmente como desktop web adaptable a notebook, TV, monitor o proyector. Permite iniciar una ronda en segundos, seleccionar al azar una canción popular en español y una consigna incómoda para cantarla, mantener el desafío fijo y habilitar hasta dos cambios de canción antes de reproducir el karaoke embebido dentro de la app. El producto está diseñado para ser simple, inmediato, rejugable y socialmente gracioso, sin puntajes, sin competencia y con foco total en generar momentos memorables.**
