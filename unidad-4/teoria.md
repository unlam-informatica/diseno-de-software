---
title: Teoría
parent: "Unidad 4 — Diseño, refinamiento y especificación"
nav_order: 1
has_toc: false
---

## Introducción

La Unidad 4 conecta dos actividades centrales de la ingeniería de software: **especificar qué debe hacer el sistema** (requisitos) y **decidir cómo se construirá** (diseño). El diseño no surge de la nada: refina progresivamente las decisiones, desde una visión arquitectónica de alto nivel hasta el diseño detallado de cada componente.

Esa estructura de alto nivel —cómo se reparten responsabilidades, dónde reside cada parte y cómo se comunican— constituye la **arquitectura** del software. Las formas recurrentes de organizar esa arquitectura se denominan **estilos** o **patrones arquitectónicos** (en capas, cliente-servidor, MVC, etc.), y la manera concreta en que las piezas se despliegan e interconectan es la **topología de diseño**.

En esta unidad estudiamos:

- Cómo se especifican requisitos y cómo se relacionan con el diseño (trazabilidad).
- El refinamiento del diseño (de lo arquitectónico a lo detallado).
- Las topologías según el tipo de sistema: **Escritorio, Web y Móvil**.
- Los **estilos arquitectónicos** clásicos (Sommerville / Pressman).
- Arquitecturas **orientadas a servicios (SOA)** y **microservicios**.
- Arquitecturas **basadas en eventos (event-driven)**.
- **Topologías emergentes**: serverless, cloud-native, edge, contenedores.

{: .note }
> Bibliografía de referencia: **Sommerville**, *Software Engineering* (10ª ed.) — diseño arquitectónico, sistemas distribuidos e ingeniería de software orientada a servicios; y **Pressman & Maxim**, *Software Engineering: A Practitioner's Approach* — diseño arquitectónico y diseño de WebApps.

## Especificación de requisitos

### Requisitos funcionales y no funcionales

Un **requisito** es una declaración de un servicio que el sistema debe proveer o de una restricción sobre el sistema. Sommerville distingue dos grandes tipos:

- **Requisitos funcionales (RF):** describen *qué debe hacer* el sistema, sus servicios, cómo reacciona ante entradas particulares y cómo se comporta en situaciones específicas.
  *Ejemplo:* "El usuario podrá buscar productos por nombre y categoría".
- **Requisitos no funcionales (RNF):** son restricciones sobre los servicios o sobre el proceso. No describen funciones, sino **propiedades de calidad** (atributos de calidad). Suelen ser **críticos**: si fallan, el sistema completo puede resultar inutilizable.
  *Ejemplo:* "El sistema responderá a una búsqueda en menos de 2 segundos con 1000 usuarios concurrentes".

Sommerville clasifica los RNF en tres familias:

| Tipo de RNF | Origen | Ejemplos |
|---|---|---|
| **De producto** | Comportamiento del software | Rendimiento, disponibilidad, seguridad, usabilidad, fiabilidad |
| **Organizacionales** | Políticas de la empresa/cliente | Estándares de proceso, lenguajes, entornos operativos |
| **Externos** | Factores externos al proyecto | Legales, regulatorios, interoperabilidad, éticos |

{: .note }
> Los RNF son la principal fuente de **decisiones arquitectónicas**: requisitos como rendimiento, seguridad o disponibilidad determinan en gran medida el estilo arquitectónico elegido.

### El documento de especificación (SRS)

La **Especificación de Requisitos del Software** (*Software Requirements Specification*, SRS) es el documento oficial que registra lo que el equipo debe implementar. Reúne tanto los **requisitos de usuario** (descripciones en lenguaje natural, orientadas al cliente) como los **requisitos del sistema** (descripciones detalladas y precisas, orientadas a desarrolladores).

Según Sommerville, un buen SRS debe ser:

- **Completo:** define todos los servicios requeridos.
- **Consistente:** sin contradicciones entre requisitos.
- **No ambiguo y verificable:** cada requisito debe poder probarse.

Estructura típica (IEEE / Sommerville): introducción y objetivos, requisitos de usuario, arquitectura del sistema, requisitos del sistema (RF y RNF), modelos del sistema, evolución y apéndices.

### Relación entre especificación y diseño: trazabilidad

La especificación responde **qué** y el diseño responde **cómo**. La conexión entre ambos se gestiona mediante la **trazabilidad**: la capacidad de seguir un requisito a través de los artefactos que lo realizan.

- **Trazabilidad hacia adelante (forward):** de cada requisito hacia los elementos de diseño y código que lo implementan.
- **Trazabilidad hacia atrás (backward):** de cada componente de diseño hacia el/los requisito(s) que justifica(n) su existencia.

Una **matriz de trazabilidad** vincula requisitos con elementos de diseño, casos de prueba y componentes. Sirve para:

- Verificar que **todo requisito esté cubierto** por el diseño (sin huecos).
- Detectar **diseño sin justificación** (componentes que no responden a ningún requisito).
- Analizar el **impacto del cambio**: si un requisito cambia, saber qué partes del diseño se ven afectadas.

{: .note }
> Idea clave para el parcial: el diseño es la **realización** de la especificación. Los RNF (especialmente los de producto) condicionan la arquitectura; los RF se traducen en componentes, módulos y operaciones.

## Refinamiento del diseño

El **refinamiento** es un proceso de **descomposición sucesiva**: se parte de una descripción de alto nivel y se la elabora en niveles cada vez más detallados, decidiendo en cada paso *cómo* se realiza lo que el nivel anterior dejó *abstracto*. Es complementario de la **abstracción**: mientras la abstracción oculta detalle, el refinamiento lo revela.

El diseño avanza por niveles:

1. **Diseño arquitectónico (alto nivel):** identifica los subsistemas/componentes principales, sus responsabilidades y relaciones, y el estilo arquitectónico. Responde a los RNF globales.
2. **Diseño detallado (bajo nivel):** especifica el interior de cada componente: clases, interfaces, estructuras de datos, algoritmos y colaboraciones.

El proceso de diseño arquitectónico de Sommerville implica decisiones sobre: **estructura** (¿cómo se descompone?), **distribución** (¿centralizado o distribuido?), **estilos** (¿qué patrones aplican?), **control** (¿cómo se coordina la ejecución?) y **modularización**.

{: .note }
> Buenos atributos del diseño que guían el refinamiento: **modularidad**, **encapsulamiento**, **bajo acoplamiento** (componentes poco dependientes entre sí) y **alta cohesión** (cada componente con una responsabilidad bien definida).

## Topologías de diseño

Una **topología de diseño** describe cómo se **organizan y despliegan** los componentes de un sistema y cómo se comunican entre sí (qué corre en el cliente, qué en el servidor, cuántos niveles físicos hay, cómo fluyen los datos).

La topología adecuada **depende de**:

- El **tipo de sistema** y su contexto de uso (Escritorio, Web, Móvil).
- Los **RNF**: rendimiento, escalabilidad, disponibilidad, seguridad.
- El **modelo de despliegue (deployment):** ¿una sola máquina, cliente-servidor, n capas distribuidas, nube?
- La **conectividad** esperada (siempre en línea, intermitente, sin conexión).

Conviene distinguir tres planos relacionados:

- **Estilo arquitectónico:** patrón lógico de organización (capas, cliente-servidor, MVC…).
- **Topología:** disposición física/de despliegue de esos componentes.
- **Tecnología:** las herramientas concretas que lo implementan.

A continuación, las topologías según el tipo de sistema.

## Diseño de sistemas de Escritorio (desktop)

Las aplicaciones de escritorio se **instalan y ejecutan localmente** en la máquina del usuario, normalmente con acceso completo a sus recursos (CPU, disco, periféricos) y sin depender de un navegador.

**Características:**

- Ejecución local, frecuentemente con capacidad **offline**.
- Interfaz rica y de baja latencia, integrada al sistema operativo.
- Distribución por instalador; actualizaciones que el usuario debe aplicar.
- Dependencia de la plataforma (Windows, macOS, Linux).

**Arquitecturas típicas:**

- **Monolítica:** toda la lógica (UI, negocio, datos) en un único ejecutable. Simple de desarrollar y desplegar, pero difícil de mantener y escalar al crecer.
- **En capas:** separa presentación, lógica de negocio y acceso a datos dentro de la aplicación, mejorando el mantenimiento.
- **Cliente-servidor (2 capas):** un cliente de escritorio "rico" que se conecta a un servidor de base de datos central (clásico modelo *fat client*).

| Ventajas | Limitaciones |
|---|---|
| Alto rendimiento y respuesta | Distribución/actualización compleja |
| Funcionamiento offline | Atada a la plataforma |
| Acceso completo al hardware local | Difícil escalar a muchos usuarios |
| Mayor control sobre seguridad local | Mantenimiento por equipo en cada máquina |

## Diseño de sistemas Web

Las aplicaciones Web se ejecutan sobre la arquitectura **cliente-servidor**: el **cliente** (navegador) solicita recursos y un **servidor** los provee, comunicándose por **HTTP/HTTPS**. Pressman las trata específicamente como **WebApps**, con énfasis en arquitecturas de contenido, interacción y funcionalidad.

### Modelo de n capas

El estilo dominante es la organización **en capas (n-tier)**:

| Capa | Responsabilidad | Tecnologías típicas |
|---|---|---|
| **Presentación** | Interfaz de usuario (UI/UX) | HTML, CSS, JS, frameworks frontend |
| **Lógica de negocio** | Reglas, validaciones, procesamiento | Lenguajes/frameworks de backend |
| **Datos** | Persistencia y acceso | Bases de datos (SQL/NoSQL) |

La separación en capas permite escalar y mantener cada nivel de forma independiente.

### HTTP sin estado (stateless)

HTTP es **stateless**: cada petición es independiente y el servidor no recuerda peticiones previas. El estado entre solicitudes se gestiona con mecanismos como **cookies, tokens (JWT) y sesiones**. Esta naturaleza sin estado **favorece la escalabilidad horizontal** (cualquier servidor puede atender cualquier petición).

### REST y APIs

**REST** (*Representational State Transfer*) es un estilo arquitectónico para servicios Web basado en:

- **Recursos** identificados por URL.
- Verbos **HTTP** (GET, POST, PUT, DELETE) para operar sobre ellos.
- Comunicación **stateless** y uso de formatos como **JSON**.

Una **API** REST expone la lógica del servidor para que la consuman clientes Web, móviles u otros servicios.

### Renderizado: servidor vs cliente; SPA

- **Server-Side Rendering (SSR):** el servidor genera el HTML completo y lo envía listo. Bueno para SEO y primera carga; más carga en el servidor.
- **Client-Side Rendering (CSR):** el servidor envía HTML mínimo + JavaScript, y el navegador construye la UI consumiendo APIs.
- **SPA (Single Page Application):** un caso de CSR donde la aplicación carga una sola página y actualiza el contenido dinámicamente sin recargas completas, mejorando la fluidez (estilo aplicación de escritorio en el navegador).

### Herramientas

- **Postman:** cliente para **probar y documentar APIs** (enviar peticiones, inspeccionar respuestas).
- **Swagger / OpenAPI:** estándar y herramientas para **especificar y documentar APIs** REST de forma legible y autodescriptiva.

| Ventajas (Web) | Limitaciones (Web) |
|---|---|
| Sin instalación; acceso multiplataforma | Requiere conectividad |
| Actualización centralizada | Latencia de red |
| Escalabilidad (horizontal) | Dependencia del navegador |
| Mantenimiento en el servidor | Seguridad expuesta en red pública |

## Diseño de sistemas Móviles

Las aplicaciones móviles se ejecutan en dispositivos con **recursos limitados** y un contexto de uso muy particular, lo que impone restricciones de diseño propias.

**Características y restricciones:**

- **Recursos limitados:** batería, memoria, CPU y almacenamiento acotados.
- **Conectividad variable:** intermitente; conviene contemplar modo **offline** y sincronización.
- **UX específica:** pantallas pequeñas, interacción táctil, gestos, orientación.
- **Sensores y contexto:** GPS, cámara, acelerómetro, notificaciones push.
- **Distribución por tiendas:** App Store / Google Play, con sus políticas y revisiones.

### Tipos de aplicaciones móviles

| Tipo | Descripción | Ventajas | Desventajas |
|---|---|---|---|
| **Nativa** | Desarrollada para una plataforma (Kotlin/Java en Android, Swift en iOS) | Máximo rendimiento; acceso total al hardware | Un código por plataforma; mayor costo |
| **Híbrida / multiplataforma** | Un código para varias plataformas (React Native, Flutter) | Reutilización de código; menor costo | Rendimiento algo menor; acceso a hardware mediado |
| **PWA (Progressive Web App)** | App web instalable que corre en el navegador | Sin tienda; multiplataforma; actualización web | Acceso limitado a hardware; depende del navegador |

### Arquitecturas móviles

Predominan patrones que **separan la UI de la lógica** para facilitar pruebas y mantenimiento:

- **MVVM (Model-View-ViewModel):** la *View* (UI) se enlaza (*data binding*) a un *ViewModel* que expone el estado, y el *Model* contiene los datos/negocio. Muy usado en Android (Jetpack) e iOS.
- También se aplican **MVC** y **MVP**, y por debajo es habitual una **arquitectura en capas** (presentación, dominio, datos) con consumo de **APIs REST**.

## Patrones y estilos arquitectónicos (Sommerville / Pressman)

Un **estilo (o patrón) arquitectónico** es una organización estructural recurrente, con sus ventajas, desventajas y contextos de aplicación. Sommerville describe varios estilos fundamentales:

### En capas (layered)

Organiza el sistema en **capas** donde cada una ofrece servicios a la superior y se apoya en la inferior. Favorece la separación de responsabilidades y el reemplazo de capas completas. Ejemplo: arquitectura Web de presentación/negocio/datos.

### Cliente-servidor

El sistema se divide en **servidores** que proveen servicios y **clientes** que los consumen a través de la red. Base de las aplicaciones Web y distribuidas.

### MVC (Model-View-Controller)

Separa el sistema en tres componentes: **Model** (datos y lógica), **View** (presentación) y **Controller** (gestiona la interacción y coordina los otros dos). Permite múltiples vistas de los mismos datos y desacopla presentación de lógica.

### Repositorio (repository)

Los componentes comparten datos a través de un **repositorio o almacén central** común. Cada componente lee/escribe en él en lugar de comunicarse directamente entre sí. Útil cuando hay grandes volúmenes de datos compartidos (ej.: IDEs, sistemas de información).

### Tubería y filtros (pipe and filter)

Los datos fluyen a través de una secuencia de **filtros** (transformaciones) conectados por **tuberías (pipes)**. Cada filtro procesa y pasa el resultado al siguiente. Ideal para **procesamiento por lotes** y flujos de datos (ej.: pipelines de datos, comandos Unix).

| Estilo | Ventajas | Desventajas | Cuándo usar |
|---|---|---|---|
| **En capas** | Separación clara; capas reemplazables | Rendimiento (atravesar capas); acoplamiento entre capas adyacentes | Sistemas con niveles de servicio bien diferenciados |
| **Cliente-servidor** | Distribución; escalabilidad; servicios reutilizables | Punto único de falla en el servidor; dependencia de red | Sistemas distribuidos, Web |
| **MVC** | Múltiples vistas; desacople UI/lógica | Complejidad adicional para casos simples | UIs con datos que cambian y varias representaciones |
| **Repositorio** | Datos compartidos consistentes y centralizados | El repositorio es cuello de botella y punto de falla | Grandes volúmenes de datos compartidos |
| **Tubería-filtros** | Reutilización de filtros; fácil de extender | Mal ajuste para interacción; sobrecarga de transformación de datos | Procesamiento secuencial de datos / por lotes |

## Arquitectura Orientada a Servicios (SOA)

La **ingeniería de software orientada a servicios** (Sommerville) organiza el sistema como un conjunto de **servicios** débilmente acoplados, independientes y reutilizables, que se comunican a través de la red.

**Conceptos clave:**

- **Servicio:** unidad lógica autónoma que expone una funcionalidad a través de una **interfaz/contrato** bien definido, independiente de su implementación.
- **Contrato:** define qué ofrece el servicio y cómo invocarlo (clásicamente con **WSDL** y mensajes **SOAP/XML** en SOA "tradicional").
- **ESB (Enterprise Service Bus):** infraestructura de comunicación central que **orquesta, enruta y transforma** los mensajes entre servicios. Actúa como columna vertebral de integración.
- **Bajo acoplamiento y reutilización:** los servicios se combinan (*composición*) para construir procesos de negocio.

### Microservicios

Los **microservicios** son una evolución de las ideas de SOA hacia servicios **muy pequeños, autónomos y desplegables de forma independiente**, cada uno responsable de una capacidad de negocio y con su propia base de datos. Se comunican típicamente con **APIs REST ligeras** o mensajería, **sin un ESB central**.

| Aspecto | SOA (tradicional) | Microservicios |
|---|---|---|
| **Granularidad** | Servicios grandes, de empresa | Servicios pequeños y específicos |
| **Comunicación** | ESB centralizado; SOAP/XML | APIs ligeras (REST), mensajería; sin ESB |
| **Datos** | Tienden a compartir bases de datos | Una base de datos por servicio |
| **Despliegue** | Más acoplado | Independiente por servicio |
| **Gobierno** | Centralizado | Descentralizado |

**Ventajas de los microservicios:** despliegue y escalado independientes, equipos autónomos, tolerancia a fallos por aislamiento, libertad tecnológica por servicio.

**Desafíos:** mayor complejidad operativa (red, monitoreo, despliegue), **consistencia de datos distribuida**, latencia de comunicación, necesidad de DevOps y observabilidad.

{: .note }
> Regla mnemotécnica: SOA busca **integrar la empresa** con servicios reutilizables y un bus central; microservicios buscan **descomponer una aplicación** en piezas pequeñas e independientes, sin bus central.

## Arquitecturas basadas en eventos (event-driven)

En una **arquitectura dirigida por eventos** (*event-driven architecture*, EDA), los componentes se comunican **produciendo y consumiendo eventos** en lugar de invocarse directamente. Un **evento** es una notificación de que "algo ocurrió" (ej.: "pedido creado").

**Elementos:**

- **Productores (publishers):** generan eventos cuando ocurre un cambio de estado.
- **Consumidores (subscribers):** reaccionan a los eventos que les interesan.
- **Broker / canal de eventos:** intermediario que recibe y distribuye eventos (ej.: Kafka, RabbitMQ).
- **Pub/Sub (publish-subscribe):** los productores publican en un *tópico* y todos los consumidores suscriptos reciben el evento, **sin conocerse entre sí**.

**Event sourcing:** patrón en el que el estado del sistema se reconstruye a partir de la **secuencia de eventos** almacenados (en lugar de guardar solo el estado actual), conservando el historial completo de cambios.

**Ventajas:**

- **Desacople** fuerte entre productores y consumidores.
- **Escalabilidad** y procesamiento **asíncrono**.
- **Extensibilidad:** agregar nuevos consumidores sin tocar a los productores.
- Buena tolerancia a picos de carga (los eventos se encolan).

**Desafíos:** flujo difícil de seguir/depurar, consistencia eventual, garantías de entrega y orden de eventos. Suele combinarse con microservicios.

## Topologías emergentes

Tendencias actuales que extienden o reemplazan las topologías clásicas, fuertemente ligadas a la **nube (cloud)**:

- **Serverless / FaaS (Function as a Service):** el desarrollador escribe **funciones** que el proveedor ejecuta bajo demanda, escalando automáticamente y cobrando por uso. No hay servidores que administrar (ej.: AWS Lambda). Ideal para cargas event-driven e intermitentes.
- **Cloud-native:** aplicaciones diseñadas **desde el origen para la nube**, típicamente con microservicios, contenedores, escalado elástico y despliegue automatizado (DevOps/CI-CD).
- **Edge computing:** el procesamiento se acerca al **borde de la red**, cerca de donde se generan los datos (dispositivos, IoT), reduciendo latencia y tráfico hacia el centro.
- **Contenedores:** empaquetan una aplicación con sus dependencias en una unidad portable y aislada (ej.: **Docker**), orquestada a escala (ej.: **Kubernetes**). Son la base técnica de las arquitecturas cloud-native y de microservicios.

{: .note }
> Hilo conductor: todas estas topologías persiguen **escalabilidad elástica, despliegue independiente y desacople**, los mismos objetivos que motivan microservicios y EDA.

## En síntesis (para el parcial)

- La **especificación de requisitos** (RF + RNF) define *qué* hace el sistema; el **diseño** define *cómo*. La **trazabilidad** (matriz de trazabilidad) los vincula y asegura cobertura completa. Los **RNF** son los principales motores de las decisiones arquitectónicas.
- El **SRS** debe ser completo, consistente, no ambiguo y verificable.
- El **refinamiento** descompone el diseño sucesivamente: del **diseño arquitectónico** (alto nivel) al **diseño detallado** (bajo nivel), buscando **bajo acoplamiento** y **alta cohesión**.
- Una **topología de diseño** organiza y despliega los componentes; depende del **tipo de sistema**, los **RNF** y el **modelo de despliegue**.
- **Escritorio:** local, offline, alto rendimiento, atado a la plataforma; arquitectura monolítica o en capas.
- **Web:** cliente-servidor, n capas, **HTTP stateless**, **REST/APIs**, **SPA**, SSR vs CSR; herramientas Postman y Swagger.
- **Móvil:** recursos y conectividad limitados, UX táctil; **nativo vs híbrido vs PWA**; patrón **MVVM**.
- **Estilos arquitectónicos (Sommerville):** en capas, cliente-servidor, MVC, repositorio, tubería-filtros, cada uno con sus ventajas/desventajas y contexto.
- **SOA:** servicios con contrato + **ESB** central; **microservicios:** servicios pequeños, independientes, sin ESB, una BD por servicio.
- **Event-driven:** productores/consumidores, **brokers**, **pub/sub**, **event sourcing**; aporta desacople y escalabilidad.
- **Topologías emergentes:** **serverless/FaaS**, **cloud-native**, **edge** y **contenedores**, orientadas a escalabilidad elástica y despliegue independiente.
