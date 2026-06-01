---
title: Teoría
parent: "Unidad 5 — Diseño de sistemas de tiempo real"
nav_order: 1
---

## Introducción

Un **sistema de tiempo real** (*real-time system*) es aquel cuyo correcto funcionamiento no depende únicamente del resultado lógico de los cálculos, **sino también del instante en el que ese resultado se produce**. Una respuesta correcta entregada demasiado tarde puede ser tan inútil —o tan peligrosa— como una respuesta incorrecta.

Estos sistemas suelen ser **reactivos** y **embebidos** (*embedded*): están integrados dentro de un dispositivo o proceso físico (un automóvil, un marcapasos, una planta industrial, un teléfono) y reaccionan continuamente a eventos del entorno mediante el ciclo **estímulo → procesamiento → respuesta**. Sommerville los caracteriza como sistemas en los que la interacción con el mundo físico impone restricciones temporales estrictas que condicionan todo el diseño.

{: .note }
> La diferencia esencial con un sistema convencional es que en tiempo real **el tiempo es parte de la especificación funcional**: hay plazos (*deadlines*) que deben cumplirse, no son una mera cuestión de rendimiento.

En esta unidad estudiamos qué define a estos sistemas, cómo se clasifican según la severidad de sus restricciones temporales, cuál es su arquitectura típica (sensores, sistema, actuadores y núcleo de tiempo real), cómo se organizan en tareas concurrentes que se sincronizan y comunican, cómo se planifican esas tareas para cumplir los plazos, y finalmente cómo se modela formalmente su comportamiento concurrente mediante **redes de Petri**.

## Concepto de sistema de tiempo real

Un sistema de tiempo real es un sistema de software (habitualmente embebido) que **monitorea y/o controla su entorno** mediante sensores y actuadores, y que debe responder a estímulos externos dentro de plazos finitos y conocidos.

Características distintivas:

- **Corrección temporal además de corrección lógica:** el resultado debe ser correcto *y* puntual.
- **Reactividad:** el sistema no controla el ritmo de los estímulos; el entorno los impone (por ejemplo, la llegada de datos de un sensor).
- **Concurrencia:** múltiples eventos pueden ocurrir simultáneamente, por lo que el software se organiza en tareas concurrentes.
- **Determinismo y predecibilidad:** más importante que ser "rápido en promedio" es ser **predecible**: poder garantizar el peor caso.
- **Fiabilidad:** muchos son sistemas críticos (*safety-critical*), donde un fallo temporal puede causar daños.

{: .note }
> Tiempo real **no** significa "muy rápido". Significa **predecible y acotado**: el sistema garantiza que responderá dentro de un plazo determinado, aunque ese plazo sea de varios segundos.

### Sistemas reactivos y embebidos

- **Sistema reactivo:** mantiene una interacción continua con su entorno, respondiendo a un flujo de eventos en lugar de calcular una salida a partir de una entrada y terminar.
- **Sistema embebido:** software alojado dentro de un hardware específico (microcontrolador, ECU automotriz, dispositivo médico) que forma parte de un producto mayor. La gran mayoría de los sistemas de tiempo real son embebidos.

## Tiempo real duro, blando y firme

Según la consecuencia de **no cumplir un plazo (deadline)**, los sistemas se clasifican en:

| Tipo | ¿Qué pasa si se pierde el deadline? | Valor del resultado tardío | Ejemplos |
|------|-------------------------------------|----------------------------|----------|
| **Duro (hard)** | Fallo catastrófico del sistema; consecuencias graves o inaceptables | Nulo o negativo (peligroso) | Airbag, control de vuelo (*fly-by-wire*), frenos ABS, marcapasos |
| **Firme (firm)** | El resultado tardío es inútil, pero un fallo ocasional es tolerable | Nulo (se descarta), sin daño catastrófico | Procesamiento de cuadros de video/audio, sistemas de predicción financiera por lote |
| **Blando (soft)** | El sistema sigue funcionando, pero degrada su calidad/servicio | Disminuye gradualmente con el retraso | Streaming multimedia, reservas online, telefonía, interfaz de usuario |

Claves para distinguir:

- En **hard real-time** el plazo es **inviolable**: el diseño debe garantizar matemáticamente que **nunca** se pierde. Se dimensiona para el peor caso.
- En **firm real-time** perder ocasionalmente un plazo no rompe el sistema, pero el resultado tardío **no aporta valor** y se descarta.
- En **soft real-time** perder plazos **degrada la calidad de servicio (QoS)** pero el sistema continúa siendo útil.

{: .note }
> Un mismo sistema puede combinar componentes de distinto tipo: en un auto, el control del motor es *hard*, mientras que la actualización del display de información al conductor es *soft*.

## Restricciones temporales

Las propiedades temporales que deben especificarse y respetarse:

- **Plazo / vencimiento (deadline):** instante límite antes del cual una tarea debe completar su respuesta. Es la restricción central.
- **Tiempo de respuesta (response time):** intervalo entre la llegada del estímulo y la finalización de la respuesta correspondiente. Debe ser ≤ deadline.
- **Período (period):** para tareas periódicas, el intervalo de tiempo entre dos activaciones sucesivas.
- **Jitter:** variación (desviación) en el tiempo entre activaciones o respuestas que deberían ser regulares. Un jitter alto es indeseable en control y multimedia.
- **WCET (Worst-Case Execution Time):** **peor tiempo de ejecución** posible de una tarea. Es fundamental: el análisis de planificabilidad se basa en el WCET, no en el tiempo promedio, porque las garantías deben sostenerse en el peor caso.
- **Latencia:** retardo entre que ocurre un evento y que el sistema comienza a atenderlo (incluye latencia de interrupción).
- **Utilización (utilization):** fracción del tiempo de CPU consumida; para *n* tareas, U = Σ (Cᵢ / Tᵢ), donde Cᵢ es el WCET y Tᵢ el período.

{: .note }
> El **WCET** es el parámetro más importante para razonar sobre tiempo real duro: si no se conoce el peor caso, no se puede garantizar ningún plazo.

## Arquitectura de un sistema de tiempo real

El modelo de referencia es el **sensor–sistema–actuador**, basado en el ciclo estímulo/respuesta:

```
        estímulo                          respuesta
  Entorno  ──►  [ SENSORES ] ──► [ SISTEMA DE      ] ──► [ ACTUADORES ] ──►  Entorno
   físico       (entrada)         CONTROL / NÚCLEO ]      (salida)            físico
                                  (procesos + RTOS)
                  ▲                                              │
                  └──────────────── lazo de control ────────────┘
```

Componentes:

- **Sensores:** transducen magnitudes físicas del entorno (temperatura, posición, presión, velocidad) en señales que el sistema lee. Generan los **estímulos**. Su gestión suele asociarse a **procesos sensores** que muestrean o reciben interrupciones.
- **Sistema de control / procesamiento:** el software que recibe los estímulos, decide y calcula las respuestas. Se descompone en **procesos/tareas concurrentes**.
- **Actuadores:** transforman las decisiones del sistema en acciones físicas sobre el entorno (motores, válvulas, relés, pantallas). Reciben las **respuestas**. Se asocian a **procesos actuadores**.
- **Lazo de control (control loop):** en muchos sistemas el efecto de los actuadores se realimenta a través de los sensores, cerrando el ciclo (control realimentado).

Sommerville propone diseñar este tipo de sistemas identificando estímulos y respuestas, asociando un proceso a cada uno y definiendo sus restricciones temporales.

### El administrador o núcleo: RTOS

El **núcleo (kernel) / administrador del sistema** es el corazón del software de tiempo real. Habitualmente forma parte de un **sistema operativo de tiempo real (RTOS, *Real-Time Operating System*)**. Sus responsabilidades:

- **Planificación (scheduling):** decidir qué tarea ejecuta la CPU en cada momento, respetando prioridades y plazos.
- **Despacho (dispatcher):** realizar el cambio de contexto (*context switch*) entre tareas.
- **Gestión de interrupciones:** atender eventos del hardware con baja latencia.
- **Gestión de recursos y temporización:** relojes, temporizadores (*timers*), sincronización y comunicación entre tareas.
- **Gestión de la concurrencia:** proveer mutex, semáforos, colas de mensajes, etc.

Características de un RTOS frente a un SO de propósito general:

- **Planificación apropiativa basada en prioridades** y **determinista**.
- **Latencias acotadas y predecibles** (de interrupción y de planificación).
- Tamaño reducido y comportamiento predecible antes que máximo rendimiento promedio.

{: .note }
> El objetivo del planificador de un RTOS no es maximizar el *throughput*, sino **garantizar que cada tarea cumpla su deadline**.

## Modelo de tareas y procesos concurrentes

El software de tiempo real se estructura como un conjunto de **tareas** (también llamadas procesos o hilos) que se ejecutan **concurrentemente** y cooperan. Cada tarea atiende típicamente un estímulo o una responsabilidad acotada.

### Tipos de tareas según su activación

- **Tareas periódicas:** se activan a intervalos regulares fijos (período *T*). Ejemplo: muestrear un sensor cada 10 ms. Se caracterizan por (Cᵢ, Tᵢ, Dᵢ) = WCET, período y deadline.
- **Tareas aperiódicas:** se activan en respuesta a eventos que ocurren en instantes impredecibles (una alarma, una pulsación). No tienen período fijo.
- **Tareas esporádicas:** un caso de aperiódicas con un **tiempo mínimo garantizado entre activaciones** (*minimum inter-arrival time*), lo que permite acotarlas para el análisis.

### Estados de una tarea

Una tarea atraviesa estados gestionados por el planificador:

- **Lista / Preparada (ready):** puede ejecutar, espera la CPU.
- **En ejecución (running):** tiene asignada la CPU.
- **Bloqueada / En espera (blocked/waiting):** espera un recurso, un evento o un mensaje; no compite por la CPU.
- **Suspendida / Dormida (suspended):** inactiva hasta su próxima activación (típico de tareas periódicas entre períodos).

```
            despacho
   READY ───────────────► RUNNING
     ▲  ◄───────────────    │  │
     │   apropiación         │  │ pide recurso / espera evento
     │   (preemption)        │  ▼
     │                      BLOCKED
     └──── recurso/evento listo ◄──┘
```

## Mecanismos de sincronización

Cuando varias tareas concurrentes acceden a **recursos compartidos** (variables, buffers, dispositivos), hay que coordinarlas para evitar **condiciones de carrera (race conditions)** e inconsistencias.

- **Sección crítica (critical section):** fragmento de código que accede a un recurso compartido y que **solo una tarea puede ejecutar a la vez**.
- **Exclusión mutua (mutual exclusion, mutex):** propiedad/mecanismo que garantiza que a lo sumo una tarea esté en la sección crítica. Un **mutex** es un cerrojo binario con noción de "propietario".
- **Semáforo (semaphore):** variable entera con operaciones atómicas **wait/P** (decrementa, bloquea si <0) y **signal/V** (incrementa, desbloquea). El **semáforo binario** sirve para exclusión mutua; el **semáforo contador** para administrar *n* recursos o sincronizar (productor/consumidor).
- **Monitor:** construcción de más alto nivel que encapsula los datos compartidos y los procedimientos que los manipulan, garantizando exclusión mutua automática; usa **variables de condición** (wait/signal) para sincronización.

Comparación:

| Mecanismo | Nivel | Garantiza exclusión mutua | Notas |
|-----------|-------|---------------------------|-------|
| **Sección crítica** | Concepto | Es el problema a resolver | Define la región protegida |
| **Mutex** | Bajo | Sí (binario, con dueño) | Solo el dueño libera; soporta herencia de prioridad |
| **Semáforo** | Bajo | Sí (binario) / No (contador) | También sincroniza y cuenta recursos |
| **Monitor** | Alto | Sí (automática) | Encapsula datos + operaciones; más seguro y legible |

### Inversión de prioridades y herencia de prioridad

La **inversión de prioridades (priority inversion)** es un problema clásico: una tarea de **alta** prioridad queda bloqueada esperando un recurso (mutex) que retiene una tarea de **baja** prioridad; si además una tarea de prioridad **media** se interpone y desplaza a la de baja, la de alta prioridad puede sufrir un retraso prolongado e impredecible —puede perder su deadline—.

Soluciones:

- **Herencia de prioridad (priority inheritance):** mientras la tarea de baja prioridad retiene el recurso que necesita una de alta, **eleva temporalmente** su prioridad a la de la tarea bloqueada, de modo que no pueda ser desplazada por tareas de prioridad media. Al liberar el recurso, vuelve a su prioridad original.
- **Techo de prioridad (priority ceiling):** a cada recurso se le asigna una prioridad "techo" igual a la de la tarea más prioritaria que lo usa; quien lo toma adquiere ese techo. Previene además interbloqueos.

{: .note }
> El caso real más famoso de inversión de prioridades ocurrió en el robot **Mars Pathfinder (1997)**, resuelto activando remotamente la herencia de prioridad.

## Ejecución y planificación (scheduling)

La **planificación** decide a qué tarea se le asigna la CPU en cada instante para que todas cumplan sus plazos.

- **Planificador no apropiativo (non-preemptive):** una tarea se ejecuta hasta ceder voluntariamente la CPU. Simple, pero puede retrasar tareas urgentes.
- **Planificador apropiativo (preemptive):** el planificador puede **interrumpir** la tarea en ejecución para dar la CPU a otra más prioritaria. Es el modelo dominante en tiempo real porque permite responder a tiempo a eventos urgentes.

Estrategias de asignación de prioridades:

- **Prioridad estática:** se fija en tiempo de diseño y no cambia (ej. RM).
- **Prioridad dinámica:** se recalcula en ejecución según la situación (ej. EDF).

### Rate Monotonic (RM)

Algoritmo **apropiativo con prioridades estáticas**: asigna **mayor prioridad a la tarea con menor período** (mayor frecuencia). Es **óptimo** entre los de prioridad fija para tareas periódicas independientes con D = T. Test de planificabilidad suficiente (Liu & Layland):

```
U = Σ (Cᵢ / Tᵢ)  ≤  n · ( 2^(1/n) − 1 )
```

Para *n* grande la cota tiende a **ln 2 ≈ 0,693** (69 %). Si U está por debajo de la cota, el conjunto es planificable con RM.

### Earliest Deadline First (EDF)

Algoritmo **apropiativo con prioridades dinámicas**: en cada instante ejecuta la tarea cuyo **deadline absoluto está más próximo**. Es **óptimo** entre todos los algoritmos (de prioridad fija o dinámica) para un procesador: si algún algoritmo puede planificar el conjunto, EDF también. Test de planificabilidad (para D = T):

```
U = Σ (Cᵢ / Tᵢ)  ≤  1   (100 %)
```

### RM vs EDF

| Aspecto | Rate Monotonic (RM) | Earliest Deadline First (EDF) |
|---------|---------------------|-------------------------------|
| Tipo de prioridad | Estática (fija) | Dinámica (según deadline) |
| Criterio | Menor período → mayor prioridad | Deadline más cercano → mayor prioridad |
| Cota de utilización | ≈ 69 % (n→∞) | 100 % |
| Aprovechamiento de CPU | Menor | Máximo |
| Implementación | Simple, predecible | Más compleja (recalcular prioridades) |
| Comportamiento en sobrecarga | Degrada de forma más predecible | Puede sufrir "efecto dominó" (fallos en cascada) |
| Optimalidad | Óptimo entre prioridad fija | Óptimo en general (monoprocesador) |

{: .note }
> Regla práctica: **RM** cuando se prioriza simplicidad y predecibilidad; **EDF** cuando se busca exprimir al máximo la CPU. RM nunca supera ~69 % garantizado; EDF llega al 100 %.

## Paso de mensajes e interfaces entre tareas

Las tareas se comunican principalmente de dos formas:

- **Memoria compartida (shared memory):** comparten variables/buffers protegidos por mecanismos de sincronización (mutex, semáforos). Eficiente, pero acopla las tareas y exige cuidado con la concurrencia.
- **Paso de mensajes (message passing):** las tareas intercambian datos a través de mensajes, sin compartir memoria directamente. Es la forma preferida para **desacoplar** tareas y por su claridad.

Modalidades del paso de mensajes:

- **Síncrono (rendezvous):** el emisor se bloquea hasta que el receptor recibe el mensaje. Sincroniza ambas tareas.
- **Asíncrono:** el emisor deja el mensaje (en una cola/buffer) y continúa sin esperar. Requiere almacenamiento intermedio.

Interfaces y estructuras de comunicación:

- **Cola de mensajes (message queue):** estructura FIFO donde una tarea encola mensajes y otra los desencola; desacopla productor y consumidor en el tiempo.
- **Buffer:** región de memoria intermedia que absorbe diferencias de velocidad entre quien produce y quien consume datos (clave en el patrón **productor-consumidor**, típicamente resuelto con semáforos contadores).
- **Mailbox / puerto:** punto de comunicación con nombre por el que se intercambian mensajes.

{: .note }
> El esquema **productor-consumidor con buffer acotado** es el ejemplo canónico: el productor se bloquea si el buffer está lleno y el consumidor si está vacío, coordinados mediante semáforos.

## Almacenamiento y manejo de eventos

Los eventos externos (estímulos) llegan de forma asíncrona y deben capturarse sin perderse, aun cuando el sistema esté ocupado.

- **Interrupción (interrupt):** señal de hardware que suspende la ejecución actual para atender un evento urgente. Es el mecanismo más rápido de notificación.
- **Manejador de interrupción (ISR, *Interrupt Service Routine*):** rutina que atiende la interrupción. Debe ser **corta y rápida**: típicamente solo lee el dato y lo encola o despierta a una tarea, difiriendo el procesamiento pesado (modelo *top-half / bottom-half*).
- **Latencia de interrupción:** tiempo entre que ocurre el evento y que comienza a ejecutarse el ISR; debe ser acotada y mínima.
- **Cola de eventos (event queue):** estructura donde se almacenan los eventos pendientes hasta que una tarea los procese, evitando pérdidas y desacoplando captura de procesamiento.
- **Buffering (doble buffer / buffer circular):** permite que el ISR escriba en un buffer mientras una tarea procesa otro, evitando bloqueos y pérdidas a alta tasa de eventos.
- **Polling (sondeo):** alternativa en la que el sistema consulta periódicamente el estado del dispositivo en lugar de esperar interrupciones; más simple pero consume CPU y aumenta la latencia.

{: .note }
> Regla de oro de los ISR: **hacer lo mínimo indispensable** dentro de la interrupción (leer el dato, encolarlo, señalizar una tarea) y delegar el procesamiento a una tarea planificable, para mantener acotada la latencia.

## Redes de Petri para sistemas de tiempo real

Las **redes de Petri** son un formalismo gráfico y matemático para modelar, analizar y verificar **sistemas concurrentes**, capturando con precisión la **sincronización**, la **concurrencia** y la **exclusión mutua**. Son muy útiles en tiempo real para razonar sobre el comportamiento del sistema antes de implementarlo y detectar problemas como interbloqueos.

### Elementos

Una red de Petri es un grafo bipartito con dos tipos de nodos:

- **Lugares (places):** representan estados, condiciones o recursos. Se dibujan como **círculos**.
- **Transiciones (transitions):** representan eventos o acciones que cambian el estado. Se dibujan como **barras o rectángulos**.
- **Arcos (arcs):** conectan lugares con transiciones (entrada) y transiciones con lugares (salida). Nunca conectan dos nodos del mismo tipo (grafo bipartito). Pueden tener **peso**.
- **Marcas / fichas (tokens):** puntos dentro de los lugares que representan la "cantidad" de esa condición/recurso presente. La distribución de tokens en todos los lugares se llama **marcado (marking)** y describe el **estado global** de la red.

### Regla de disparo (firing rule)

- Una transición está **habilitada (enabled)** si **cada uno de sus lugares de entrada** contiene **al menos tantos tokens como el peso del arco** que la conecta (peso 1 por defecto).
- Al **dispararse (firing)** una transición habilitada:
  1. **Consume** tokens de cada lugar de entrada (según el peso del arco de entrada).
  2. **Produce** tokens en cada lugar de salida (según el peso del arco de salida).
- El disparo es **atómico**. Si varias transiciones están habilitadas, el disparo puede ser **no determinista** (modela concurrencia/elección).

Con estas reglas se modelan patrones fundamentales:

- **Concurrencia / paralelismo:** una transición con varios lugares de salida activa varias ramas simultáneas (*fork*).
- **Sincronización (join):** una transición que requiere tokens de varios lugares de entrada solo dispara cuando **todos** están presentes (espera a que todas las ramas lleguen).
- **Exclusión mutua:** un lugar que actúa como **token de recurso (mutex)** garantiza que solo una rama acceda a su sección crítica a la vez.

### Ejemplo conceptual: exclusión mutua entre dos tareas

Dos tareas (T1 y T2) deben acceder a un recurso compartido en exclusión mutua. Un lugar **Mutex** contiene **1 token** que representa el cerrojo disponible:

```
   (P1_listo)                                  (P2_listo)
       |                                            |
       v                                            v
   [tomar_1] <---- (Mutex: ●) ----> [tomar_2]
       |                ^   ^                        |
       v                |   |                        v
   (P1_critica)         |   |                  (P2_critica)
       |                |   |                        |
       v                |   |                        v
   [liberar_1] --------- ---------- [liberar_2]
       (devuelve token a Mutex)
```

Lectura del modelo:

- Inicialmente `Mutex` tiene **1 token**; `P1_listo` y `P2_listo` tienen un token cada uno.
- `tomar_1` está habilitada si hay token en `P1_listo` **y** en `Mutex`. Al dispararse, **consume el token de Mutex** y pone a T1 en `P1_critica`.
- Mientras `Mutex` esté vacío, `tomar_2` **no puede dispararse**: T2 espera. Así se garantiza la **exclusión mutua** (nunca hay tokens simultáneos en `P1_critica` y `P2_critica`).
- `liberar_1` devuelve el token a `Mutex`, habilitando nuevamente a la otra tarea.

### Propiedades analizables y extensiones para tiempo real

Sobre una red de Petri se pueden verificar formalmente propiedades como:

- **Alcanzabilidad (reachability):** qué marcados (estados) son posibles.
- **Ausencia de interbloqueo (deadlock):** que siempre haya alguna transición disparable.
- **Seguridad (safety / boundedness):** que ningún lugar acumule más tokens de los previstos.
- **Vivacidad (liveness):** que toda transición pueda eventualmente dispararse (sin inanición).

Para sistemas de **tiempo real** se usan extensiones que incorporan el tiempo:

- **Redes de Petri temporizadas (timed Petri nets):** asocian una duración a transiciones o lugares.
- **Redes de Petri con tiempo (time Petri nets):** asocian un intervalo [mín, máx] de disparo a cada transición, permitiendo modelar y verificar plazos y restricciones temporales.

{: .note }
> Lo potente de las redes de Petri en tiempo real es que permiten **demostrar** propiedades de concurrencia y temporización (ausencia de deadlock, cumplimiento de plazos) sobre el modelo, antes de escribir código.

## En síntesis (para el parcial)

- Un **sistema de tiempo real** es correcto solo si entrega el resultado **correcto** y **a tiempo**: la dimensión temporal es funcional, no de mero rendimiento. Suelen ser **reactivos y embebidos**. Tiempo real = **predecible y acotado**, no "rápido".
- Clasificación según el deadline: **duro (hard)** = perderlo es catastrófico; **firme (firm)** = el resultado tardío se descarta sin daño grave; **blando (soft)** = degrada la calidad pero el sistema sigue útil.
- Restricciones temporales clave: **deadline**, **tiempo de respuesta**, **período**, **jitter** y especialmente el **WCET** (peor caso), base del análisis de planificabilidad.
- Arquitectura **sensor → sistema → actuador** con ciclo estímulo/respuesta y **lazo de control**; el **núcleo/RTOS** planifica, despacha, gestiona interrupciones y provee primitivas de concurrencia con latencias acotadas.
- El software se organiza en **tareas concurrentes** (periódicas, aperiódicas, esporádicas) con estados ready/running/blocked/suspended.
- **Sincronización:** secciones críticas protegidas por **mutex, semáforos y monitores**; cuidado con la **inversión de prioridades**, resuelta con **herencia** o **techo de prioridad**.
- **Planificación apropiativa:** **RM** (prioridad estática, menor período → mayor prioridad, cota ≈ 69 %) vs **EDF** (prioridad dinámica, deadline más cercano, cota 100 %, óptimo).
- **Comunicación** por memoria compartida o **paso de mensajes** (síncrono/asíncrono) con **colas y buffers** (productor-consumidor).
- **Eventos:** **interrupciones** atendidas por **ISR cortos**, **colas de eventos** y **buffering** para no perder estímulos; minimizar la latencia.
- **Redes de Petri:** **lugares, transiciones, arcos y tokens**; la **regla de disparo** (habilitación → consume/produce tokens) modela **concurrencia, sincronización y exclusión mutua**, y con extensiones temporizadas permite verificar plazos y ausencia de deadlock.
