---
title: Teoría
parent: "Unidad 3 — Los patrones y el diseño"
nav_order: 1
has_toc: false
---

{: .note }
> Esta unidad es central para el primer parcial. Concentra el núcleo conceptual de la materia: cómo asignar responsabilidades (GRASP) y qué soluciones probadas existen para problemas recurrentes de diseño (GoF). Conviene dominar el *propósito* y el *problema que resuelve* cada patrón antes que memorizar diagramas.

## Introducción

El diseño de software consiste en transformar los requisitos de un sistema en una estructura de componentes (clases, módulos, objetos) que colaboran para cumplirlos, atendiendo además a atributos de calidad como mantenibilidad, reutilización, extensibilidad y bajo costo de cambio. A lo largo de la práctica de la ingeniería de software se observó que ciertos **problemas de diseño aparecen una y otra vez**, y que las buenas soluciones a esos problemas comparten una estructura común. Capturar y nombrar esas soluciones probadas es la idea central de los **patrones de diseño**.

Un patrón no es un algoritmo ni un fragmento de código listo para copiar: es una **descripción de una solución a un problema en un contexto**. Su valor está en tres planos:

- **Reutilización de experiencia de diseño**: en lugar de redescubrir la solución, se aplica una conocida y validada.
- **Vocabulario compartido**: decir "acá uso un *Observer*" comunica de inmediato intención y estructura a otros desarrolladores.
- **Calidad**: los patrones encarnan principios de buen diseño (bajo acoplamiento, alta cohesión, apertura a la extensión).

En esta unidad veremos primero los **principios de diseño orientado a objetos** que sustentan los patrones, luego los **patrones GRASP** de asignación de responsabilidades (Larman), después el catálogo clásico de **patrones GoF** (creacionales, estructurales y de comportamiento), el patrón arquitectónico **MVC**, y finalmente los **antipatrones, code smells y mejores prácticas**.

{: .note }
> **Bibliografía base de la unidad.** GoF — Gamma, Helm, Johnson, Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software* (1994). Larman, *UML y Patrones* (2.ª/3.ª ed.) para GRASP y proceso de diseño. Pressman & Maxim, *Ingeniería del Software* para el encuadre general de diseño, patrones y arquitectura.

## Qué es un patrón de diseño

### Definición

Un **patrón de diseño** (*design pattern*) es una solución general y reutilizable a un problema recurrente dentro de un contexto determinado en el diseño de software. Describe la estructura de las clases u objetos participantes, sus responsabilidades y la forma en que colaboran, sin atarse a una implementación concreta.

La definición canónica de los GoF, tomando la idea del arquitecto **Christopher Alexander**, es: *"Cada patrón describe un problema que ocurre una y otra vez en nuestro entorno, y describe el núcleo de la solución a ese problema, de tal modo que se puede usar esa solución un millón de veces sin hacerla nunca dos veces de la misma manera."*

### Origen

- **Christopher Alexander (arquitectura, ~1977)**: en *A Pattern Language* propuso que los problemas de diseño arquitectónico (de edificios y ciudades) podían capturarse en *patrones* nombrados, formando un "lenguaje de patrones". Esta idea fue trasladada al software.
- **GoF — "Gang of Four" / Banda de los Cuatro (1994)**: Erich Gamma, Richard Helm, Ralph Johnson y John Vlissides publicaron *Design Patterns*, catalogando 23 patrones de diseño orientado a objetos. Es la obra fundacional del tema.
- **Craig Larman (GRASP)**: en *Applying UML and Patterns* sistematizó los **patrones GRASP** (*General Responsibility Assignment Software Patterns*), principios para asignar responsabilidades a objetos, anteriores y complementarios al catálogo GoF.

### Elementos de un patrón

Según los GoF, todo patrón se describe mediante cuatro elementos esenciales:

| Elemento | Qué describe |
|---|---|
| **Nombre** | Identificador que amplía el vocabulario de diseño y permite comunicar la solución en una palabra (p. ej. *Factory Method*). |
| **Problema** | Cuándo aplicar el patrón: el contexto, las condiciones y, a veces, una lista de síntomas de un diseño rígido que el patrón remedia. |
| **Solución** | Los elementos que componen el diseño (clases, objetos), sus relaciones, responsabilidades y colaboraciones. Es una plantilla, no un diseño concreto. |
| **Consecuencias** | Resultados y compromisos (*trade-offs*) de aplicar el patrón: impacto en flexibilidad, extensibilidad, rendimiento, acoplamiento. |

### Beneficios

- Reutilizan diseño probado y reducen la probabilidad de errores.
- Mejoran la comunicación entre diseñadores (vocabulario común).
- Hacen el sistema **más flexible y mantenible**, anticipando puntos de cambio.
- Documentan decisiones de diseño y facilitan la incorporación de nuevos integrantes al equipo.

{: .note }
> No todo se resuelve con patrones. Aplicar un patrón donde no hace falta agrega complejidad innecesaria (esto es, de hecho, un antipatrón: *Golden Hammer*). El criterio es: usar el patrón cuando el problema que resuelve **realmente está presente** o se anticipa con fundamento.

## Principios de diseño orientado a objetos

Antes de los patrones conviene fijar los principios que los sustentan. Los patrones GoF son, en buena medida, aplicaciones de estos principios.

### Encapsulamiento

Ocultar los detalles internos de una clase (estado y representación) detrás de una interfaz pública estable. Lo que cambia debe quedar "encapsulado" para que su variación no se propague al resto del sistema. Principio rector de los GoF: **"encapsular lo que varía"** (*identify the aspects that vary and separate them from what stays the same*).

### Programar para una interfaz, no para una implementación

Los clientes deben depender de **tipos abstractos** (interfaces o clases abstractas) y no de clases concretas. Así, una implementación concreta puede sustituirse por otra sin afectar a los clientes. Es la base del polimorfismo y de casi todos los patrones creacionales y de comportamiento.

```text
// Mal: el cliente conoce la clase concreta
List lista = new ArrayList();

// Bien: el cliente depende de la abstracción
List lista = obtenerLista(); // devuelve ArrayList, LinkedList, etc.
```

### Favorecer la composición sobre la herencia

La herencia ata fuertemente la subclase a la superclase (acoplamiento en tiempo de compilación, ruptura del encapsulamiento). La **composición** —un objeto que delega en otro mediante referencia— permite cambiar el comportamiento en tiempo de ejecución y combina mejor flexibilidad y bajo acoplamiento. Muchos patrones (*Strategy*, *Decorator*, *Bridge*, *Composite*) sustituyen herencia por composición/delegación.

{: .note }
> Regla mnemotécnica de los GoF: *"Favor object composition over class inheritance."* La herencia describe *es-un* (relación de tipo); la composición describe *tiene-un* / *usa-un*.

### SOLID (mención)

Cinco principios de diseño OO popularizados por Robert C. Martin que complementan lo anterior:

- **S — Single Responsibility**: una clase, una única razón para cambiar.
- **O — Open/Closed**: abierta a la extensión, cerrada a la modificación.
- **L — Liskov Substitution**: un subtipo debe poder sustituir a su tipo base sin romper el programa.
- **I — Interface Segregation**: muchas interfaces específicas mejor que una general.
- **D — Dependency Inversion**: depender de abstracciones, no de concreciones.

## Patrones GRASP (Larman)

Los **GRASP** (*General Responsibility Assignment Software Patterns* — patrones generales de asignación de responsabilidades) son principios formulados por **Craig Larman** para guiar la decisión fundamental del diseño OO: *¿a qué objeto le asigno cada responsabilidad?* No son patrones de implementación como los GoF, sino **principios de razonamiento** que se aplican durante el diseño (típicamente al construir diagramas de interacción/secuencia a partir de los casos de uso).

Una **responsabilidad** es una obligación de un objeto: *de conocer* (saber datos, derivarlos) o *de hacer* (crear objetos, ejecutar cálculos, coordinar a otros).

| Patrón GRASP | Problema | Solución (asignar a…) |
|---|---|---|
| **Experto en Información** | ¿Quién debe tener una responsabilidad? | La clase que posee la información necesaria para cumplirla. |
| **Creador** | ¿Quién crea una instancia de A? | Quien agrega/contiene/registra/usa de cerca o tiene los datos de inicialización de A. |
| **Controlador** | ¿Quién maneja un evento del sistema (de la UI)? | Un objeto que represente el sistema, un caso de uso, o la organización global. |
| **Bajo Acoplamiento** | ¿Cómo reducir el impacto de los cambios? | Asignar de modo que las dependencias entre clases sean mínimas. |
| **Alta Cohesión** | ¿Cómo mantener las clases enfocadas? | Asignar de modo que cada clase tenga responsabilidades relacionadas y acotadas. |
| **Polimorfismo** | ¿Cómo manejar alternativas según el tipo? | Distribuir el comportamiento por tipo usando operaciones polimórficas. |
| **Fabricación Pura** | ¿Dónde poner lógica que no encaja en ningún concepto del dominio? | En una clase artificial inventada para lograr alta cohesión y bajo acoplamiento. |
| **Indirección** | ¿Cómo desacoplar dos elementos? | Asignar la responsabilidad a un objeto intermediario. |
| **Variaciones Protegidas** | ¿Cómo aislar los puntos de cambio previsibles? | Envolverlos en una interfaz estable y usar polimorfismo. |

### Experto en Información (Information Expert)

- **Problema**: asignar responsabilidades de modo razonable y general.
- **Solución**: asignar la responsabilidad a la clase que **tiene la información necesaria** para cumplirla. Ejemplo: el total de una venta lo calcula la clase `Venta`, porque conoce sus líneas; cada línea calcula su subtotal, porque conoce cantidad y producto.

### Creador (Creator)

- **Problema**: ¿quién debería ser responsable de crear una instancia de cierta clase?
- **Solución**: asignar a la clase B la creación de A si B **agrega**, **contiene**, **registra**, **usa estrechamente** A o **tiene los datos** de inicialización de A. Ejemplo: `Venta` crea sus `LineaDeVenta` porque las contiene.

### Controlador (Controller)

- **Problema**: ¿qué objeto, fuera de la capa de UI, recibe y coordina una operación del sistema?
- **Solución**: asignar la responsabilidad a un **controlador**: una clase que represente el sistema global/raíz, un dispositivo, un subsistema (*facade controller*), o un escenario de caso de uso (*use-case controller*). Evita que la UI tenga lógica de negocio.

### Bajo Acoplamiento (Low Coupling)

- **Problema**: minimizar la dependencia y el impacto de los cambios; favorecer la reutilización.
- **Solución**: asignar responsabilidades de manera que el **acoplamiento** (número y fuerza de las conexiones entre clases) se mantenga bajo. Es un principio **evaluativo**: se usa para comparar alternativas de diseño.

### Alta Cohesión (High Cohesion)

- **Problema**: mantener las clases comprensibles, manejables y reutilizables.
- **Solución**: asignar responsabilidades de modo que cada clase tenga un conjunto **fuertemente relacionado y acotado** de responsabilidades. Una clase con baja cohesión hace "demasiadas cosas no relacionadas" (deriva en el antipatrón *God Object*).

### Polimorfismo (Polymorphism)

- **Problema**: manejar alternativas de comportamiento según el tipo, evitando `if`/`switch` sobre el tipo.
- **Solución**: asignar la responsabilidad usando **operaciones polimórficas** en las clases para las que el comportamiento varía. Base de patrones como *Strategy* y *State*.

### Fabricación Pura (Pure Fabrication)

- **Problema**: hay lógica que, asignada a una clase del dominio, rompería su cohesión o aumentaría el acoplamiento.
- **Solución**: crear una clase **artificial** (no del dominio) que agrupe esa responsabilidad. Ejemplo típico: una clase de persistencia/`Repository` que aísla el acceso a la base de datos.

### Indirección (Indirection)

- **Problema**: evitar el acoplamiento directo entre dos (o más) elementos.
- **Solución**: introducir un objeto **intermediario** que medie entre ellos. Sustenta patrones como *Adapter*, *Facade* y *Mediator*.

### Variaciones Protegidas (Protected Variations)

- **Problema**: diseñar de forma que las variaciones o la inestabilidad previsible de algunos elementos no impacten a otros.
- **Solución**: identificar los **puntos de variación previsibles** y crear una **interfaz estable** a su alrededor (polimorfismo, encapsulamiento). Es la formulación general que subyace al principio Open/Closed y a casi todos los patrones GoF.

{: .note }
> GRASP responde **dónde** poner la responsabilidad; GoF ofrece **soluciones concretas** ya empaquetadas. Bajo Acoplamiento, Alta Cohesión y Variaciones Protegidas son los "principios sombrilla": casi todo patrón GoF puede explicarse como una forma de lograrlos.

## Patrones GoF: clasificación

Los GoF clasifican sus 23 patrones según dos criterios.

**Por propósito** (qué hace el patrón):

- **Creacionales**: abstraen el proceso de **creación de objetos**.
- **Estructurales**: tratan la **composición de clases y objetos** en estructuras más grandes.
- **De comportamiento**: tratan los **algoritmos y la asignación de responsabilidades** entre objetos, es decir, la interacción y comunicación.

**Por alcance** (sobre qué opera el patrón):

- **De clase**: la relación entre clases se establece por **herencia** (estática, en tiempo de compilación).
- **De objeto**: la relación se establece por **composición/referencia** entre objetos (dinámica, en tiempo de ejecución).

| Propósito → / Alcance ↓ | Creacional | Estructural | De comportamiento |
|---|---|---|---|
| **Clase** | Factory Method | Adapter (de clase) | Interpreter, Template Method |
| **Objeto** | Abstract Factory, Builder, Prototype, Singleton | Adapter (de objeto), Bridge, Composite, Decorator, Facade, Flyweight, Proxy | Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Visitor |

## Patrones creacionales

Los **patrones creacionales** encapsulan el conocimiento sobre qué clases concretas usa el sistema y ocultan cómo se crean e instancian los objetos. Permiten que el sistema sea independiente de cómo se crean, componen y representan sus objetos.

### Singleton (instancia única)

- **Propósito**: garantizar que una clase tenga **una sola instancia** y proporcionar un punto de acceso global a ella.
- **Cuándo usarlo**: cuando debe existir exactamente un objeto (un gestor de configuración, un pool de conexiones, un logger) y se necesita acceso controlado a él.
- **Estructura**: constructor privado + atributo estático que guarda la única instancia + método estático `getInstance()`.
- **Consecuencias**: acceso controlado, pero introduce estado global y dificulta las pruebas unitarias (suele considerarse abusado; ver antipatrones).

```text
class Configuracion {
    private static instancia;
    private Configuracion() { }            // constructor privado
    public static Configuracion getInstance() {
        if (instancia == null)
            instancia = new Configuracion();
        return instancia;
    }
}
```

### Factory Method (método de fabricación)

- **Propósito**: definir una interfaz para crear un objeto, pero **dejar que las subclases decidan qué clase instanciar**. Difiere la instanciación a las subclases.
- **Cuándo usarlo**: cuando una clase no puede anticipar la clase de objetos que debe crear, o quiere que sus subclases especifiquen los objetos que crean.
- **Estructura**: un método abstracto `crearProducto()` declarado en `Creator`; cada subclase concreta lo redefine devolviendo un `ProductoConcreto`.

```text
abstract class Dialogo {
    abstract Boton crearBoton();          // factory method
    void render() { Boton b = crearBoton(); b.dibujar(); }
}
class DialogoWindows extends Dialogo {
    Boton crearBoton() { return new BotonWindows(); }
}
```

### Abstract Factory (fábrica abstracta)

- **Propósito**: proporcionar una interfaz para crear **familias de objetos relacionados** sin especificar sus clases concretas.
- **Cuándo usarlo**: cuando el sistema debe ser independiente de cómo se crean sus productos y se trabaja con varias familias intercambiables (p. ej. componentes de UI para Windows / macOS / Linux).
- **Estructura**: una interfaz `FabricaAbstracta` con varios métodos `crearX()`, `crearY()`; cada fábrica concreta produce una familia coherente.

```text
interface FabricaGUI { Boton crearBoton(); CheckBox crearCheck(); }
class FabricaWindows implements FabricaGUI {
    Boton crearBoton() { return new BotonWindows(); }
    CheckBox crearCheck() { return new CheckWindows(); }
}
```

{: .note }
> Diferencia clave: *Factory Method* crea **un** producto vía herencia (una subclase decide). *Abstract Factory* crea **familias** de productos vía composición (se le pasa al cliente la fábrica concreta a usar).

### Builder (constructor)

- **Propósito**: separar la **construcción** de un objeto complejo de su **representación**, de modo que el mismo proceso de construcción pueda crear distintas representaciones.
- **Cuándo usarlo**: cuando un objeto tiene muchas partes o muchos parámetros opcionales y se quiere construirlo paso a paso, evitando constructores telescópicos.
- **Estructura**: un `Builder` con métodos para cada parte; un `Director` opcional orquesta el orden; al final `getResultado()` devuelve el producto.

```text
Pizza p = new PizzaBuilder()
    .conMasa("fina")
    .conSalsa("tomate")
    .agregarTopping("muzzarella")
    .build();
```

### Prototype (prototipo)

- **Propósito**: crear nuevos objetos **clonando** un objeto existente (el prototipo), en lugar de instanciarlos desde cero.
- **Cuándo usarlo**: cuando el costo de crear un objeto es alto, o cuando las clases a instanciar se especifican en tiempo de ejecución, o para evitar una jerarquía de fábricas paralela a la de productos.
- **Estructura**: una interfaz con `clonar()`; cada clase implementa la copia (superficial o profunda) de sí misma.

```text
interface Clonable { Clonable clonar(); }
class Documento implements Clonable {
    Clonable clonar() { return new Documento(this); } // copia
}
```

## Patrones estructurales

Los **patrones estructurales** se ocupan de **cómo se componen clases y objetos** para formar estructuras más grandes, manteniendo la flexibilidad y eficiencia de esas estructuras.

### Adapter (adaptador)

- **Propósito**: convertir la interfaz de una clase en **otra interfaz** que el cliente espera. Permite colaborar a clases que de otro modo serían incompatibles.
- **Cuándo usar**: para integrar una clase existente (o una librería de terceros) cuya interfaz no coincide con la que necesita el sistema.
- **Variantes**: de clase (por herencia múltiple) o de objeto (por composición). También llamado *Wrapper*.

```text
class AdaptadorPago implements PasarelaPago {
    private ApiExterna api;                // composición
    void cobrar(monto) { api.doCharge(monto); } // traduce la llamada
}
```

### Bridge (puente)

- **Propósito**: **desacoplar una abstracción de su implementación** para que ambas puedan variar independientemente.
- **Cuándo usar**: cuando se quiere evitar una explosión de subclases por combinar dos dimensiones de variación (p. ej. *forma* × *renderizador*). Se modelan dos jerarquías unidas por composición.

### Composite (compuesto)

- **Propósito**: componer objetos en **estructuras de árbol** para representar jerarquías parte-todo, de modo que el cliente trate de manera **uniforme** objetos individuales y composiciones.
- **Cuándo usar**: árboles de objetos como sistemas de archivos (archivos y carpetas), menús con submenús, componentes gráficos anidados.

### Decorator (decorador)

- **Propósito**: **añadir responsabilidades a un objeto dinámicamente**, envolviéndolo. Alternativa flexible a la herencia para extender funcionalidad.
- **Cuándo usar**: cuando se quieren agregar comportamientos a objetos individuales sin afectar a otros y sin crear subclases para cada combinación. Ejemplo clásico: *streams* de entrada/salida (`BufferedReader` envuelve `FileReader`).

```text
Componente c = new Decorador2(new Decorador1(new ComponenteBase()));
// cada decorador agrega comportamiento antes/después de delegar
```

### Facade (fachada)

- **Propósito**: ofrecer una **interfaz unificada y simple** a un conjunto de interfaces de un subsistema, reduciendo su complejidad para el cliente.
- **Cuándo usar**: para desacoplar a los clientes de los detalles internos de un subsistema complejo y proporcionar un punto de entrada de alto nivel.

### Flyweight (peso ligero)

- **Propósito**: usar **compartición** para soportar eficientemente grandes cantidades de objetos de grano fino, separando el estado **intrínseco** (compartible) del **extrínseco** (dependiente del contexto).
- **Cuándo usar**: cuando hay muchísimos objetos similares y el costo de memoria es crítico (p. ej. caracteres en un editor de texto, partículas en un juego).

### Proxy (apoderado / representante)

- **Propósito**: proporcionar un **sustituto o representante** de otro objeto para controlar el acceso a él.
- **Cuándo usar**: para *lazy loading* (proxy virtual), control de acceso (proxy de protección), acceso a un objeto remoto (proxy remoto) o caché. El proxy implementa la misma interfaz que el objeto real.

{: .note }
> *Decorator*, *Proxy* y *Adapter* parecen similares (todos "envuelven"), pero difieren en intención: **Adapter** cambia la interfaz; **Decorator** agrega comportamiento manteniendo la interfaz; **Proxy** controla el acceso manteniendo la interfaz.

## Patrones de comportamiento

Los **patrones de comportamiento** tratan de algoritmos y de la **asignación de responsabilidades entre objetos**: describen no solo patrones de objetos sino patrones de **comunicación** entre ellos.

### Strategy (estrategia)

- **Propósito**: definir una **familia de algoritmos**, encapsular cada uno y hacerlos intercambiables. El algoritmo varía independientemente de los clientes que lo usan.
- **Cuándo usar**: cuando hay varias maneras de hacer algo (distintos algoritmos de ordenamiento, cálculo de descuento, validación) y se quiere elegir/cambiar en tiempo de ejecución, evitando condicionales sobre el tipo de algoritmo.
- **Estructura**: una interfaz `Estrategia` con un método; estrategias concretas; un `Contexto` que tiene una referencia a la estrategia y delega en ella.

```text
interface Descuento { double aplicar(double monto); }
class DescuentoNavidad implements Descuento { ... }
class Carrito {
    private Descuento estrategia;          // composición
    double total() { return estrategia.aplicar(subtotal); }
}
```

### Observer (observador)

- **Propósito**: definir una dependencia **uno-a-muchos** entre objetos, de modo que cuando uno (el *sujeto*) cambia de estado, todos sus dependientes (*observadores*) son notificados y actualizados automáticamente.
- **Cuándo usar**: cuando un cambio en un objeto requiere actualizar otros y no se sabe cuántos ni cuáles de antemano (eventos de UI, publicador/suscriptor, modelo que notifica a vistas en MVC).
- **Estructura**: `Sujeto` mantiene una lista de `Observadores` y expone `suscribir/desuscribir/notificar`; cada observador implementa `actualizar()`.

```text
interface Observador { void actualizar(estado); }
class Sujeto {
    List<Observador> obs;
    void notificar() { for (o : obs) o.actualizar(estado); }
}
```

### Command (comando / orden)

- **Propósito**: encapsular una **petición como un objeto**, permitiendo parametrizar clientes con distintas peticiones, encolarlas, registrarlas y soportar operaciones de **deshacer** (*undo*).
- **Cuándo usar**: menús y botones que disparan acciones, colas de tareas, transacciones, *undo/redo*, macros.
- **Estructura**: interfaz `Comando` con `ejecutar()` (y a veces `deshacer()`); comandos concretos que conocen al *receptor* y la acción; un *invocador* que dispara comandos sin conocer su contenido.

```text
interface Comando { void ejecutar(); }
class GuardarComando implements Comando {
    private Documento doc;
    void ejecutar() { doc.guardar(); }
}
boton.setComando(new GuardarComando(doc));
```

### Template Method (método plantilla)

- **Propósito**: definir el **esqueleto de un algoritmo** en una operación, delegando algunos pasos a las subclases. Las subclases redefinen ciertos pasos sin cambiar la estructura general del algoritmo.
- **Cuándo usar**: cuando varios algoritmos comparten la misma estructura pero difieren en pasos puntuales. Es un patrón **de clase** (usa herencia).
- **Estructura**: un método "plantilla" `final` en la clase base que llama a pasos abstractos (*primitive operations*) implementados por las subclases. A menudo incluye *hooks* opcionales.

```text
abstract class Reporte {
    final void generar() {                 // template method (no se sobreescribe)
        abrir(); escribirCuerpo(); cerrar();
    }
    abstract void escribirCuerpo();        // paso variable
    void abrir() { ... } void cerrar() { ... }
}
```

{: .note }
> *Strategy* vs. *Template Method*: ambos parametrizan un comportamiento. *Template Method* lo hace por **herencia** (subclases redefinen pasos, estructura fija en la base). *Strategy* lo hace por **composición** (se inyecta un objeto algoritmo, intercambiable en tiempo de ejecución).

### Iterator (iterador)

- **Propósito**: proporcionar una manera de **acceder secuencialmente** a los elementos de una colección **sin exponer su representación interna**.
- **Cuándo usar**: para recorrer colecciones de forma uniforme (listas, árboles, conjuntos) y poder tener varios recorridos simultáneos. Está integrado en la mayoría de los lenguajes (`for-each`, `iterator()`).
- **Estructura**: interfaz `Iterador` con `hayMas()` / `siguiente()`; la colección (`Agregado`) crea su iterador.

```text
Iterador it = coleccion.crearIterador();
while (it.hayMas()) procesar(it.siguiente());
```

### State (estado)

- **Propósito**: permitir que un objeto **altere su comportamiento cuando cambia su estado interno**; parece que el objeto cambia de clase.
- **Cuándo usar**: cuando el comportamiento de un objeto depende de su estado y hay muchos condicionales `if/switch` según ese estado (máquinas de estado: un pedido `Nuevo → Pagado → Enviado → Entregado`).
- **Estructura**: una interfaz `Estado`; estados concretos que implementan el comportamiento propio de cada estado; un `Contexto` que delega en el objeto-estado actual y puede cambiarlo.

```text
interface EstadoPedido { void avanzar(Pedido p); }
class Nuevo implements EstadoPedido {
    void avanzar(Pedido p) { p.setEstado(new Pagado()); }
}
```

{: .note }
> *State* y *Strategy* comparten estructura (un contexto que delega en un objeto). Difieren en intención: en *Strategy* el cliente elige el algoritmo y este no cambia; en *State* las transiciones entre estados están gobernadas por los propios estados o el contexto, y cambian durante la vida del objeto.

### Chain of Responsibility (cadena de responsabilidad)

- **Propósito**: evitar acoplar el emisor de una petición a su receptor dando a más de un objeto la oportunidad de manejarla. Se encadenan los receptores y la petición viaja por la cadena hasta que uno la atiende. Ejemplos: filtros/middleware HTTP, niveles de aprobación de gastos, manejadores de eventos.

### Mediator (mediador)

- **Propósito**: definir un objeto que **encapsula cómo interactúa un conjunto de objetos**, promoviendo el bajo acoplamiento al evitar que se refieran entre sí explícitamente. Ejemplo: un controlador de diálogo que coordina sus widgets.

### Memento (recuerdo)

- **Propósito**: capturar y externalizar el **estado interno** de un objeto sin violar su encapsulamiento, de modo que pueda restaurarse a ese estado más tarde. Base de las funciones de *undo* y *snapshots*.

### Visitor (visitante)

- **Propósito**: representar una **operación a realizar sobre los elementos** de una estructura de objetos, permitiendo definir nuevas operaciones sin modificar las clases de los elementos sobre los que opera. Útil cuando la estructura es estable pero las operaciones cambian.

### Interpreter (intérprete)

- **Propósito**: dado un lenguaje, definir una representación de su **gramática** junto con un intérprete que usa esa representación para interpretar sentencias del lenguaje. Útil para lenguajes simples (expresiones, reglas, consultas).

## Arquitectura MVC (Modelo-Vista-Controlador)

**MVC** es un **patrón arquitectónico** (de mayor alcance que los patrones de diseño de objetos) que separa una aplicación en tres responsabilidades:

- **Modelo (Model)**: los datos y la lógica de negocio. No conoce a la vista ni al controlador. Notifica los cambios de estado.
- **Vista (View)**: la presentación; muestra el estado del modelo al usuario. No contiene lógica de negocio.
- **Controlador (Controller)**: recibe la entrada del usuario, interpreta los eventos y actualiza el modelo (y a veces selecciona la vista).

**Objetivo**: separar **datos**, **presentación** e **interacción** para favorecer la mantenibilidad, permitir varias vistas del mismo modelo y desarrollar/probar cada capa por separado.

MVC combina varios patrones GoF: la relación Modelo→Vista suele realizarse con **Observer** (la vista se suscribe al modelo y se actualiza ante cambios); el Controlador encarna el patrón GRASP **Controller**; la selección de vistas puede usar **Strategy** o **Composite** para la composición de vistas. Variantes derivadas: MVP (Model-View-Presenter) y MVVM (Model-View-ViewModel).

{: .note }
> MVC figura en la planificación de la cátedra como patrón arquitectónico. Para el parcial conviene poder explicar las tres responsabilidades, por qué se separan y qué patrones GoF lo sustentan (sobre todo **Observer**).

## Antipatrones y malas prácticas

Un **antipatrón** (*anti-pattern*) es una solución a un problema recurrente que, **aunque a primera vista parece adecuada, resulta contraproducente**: genera más problemas de los que resuelve. A diferencia de un simple error, el antipatrón es una *forma de hacer* repetida que parece razonable pero degrada la calidad del software. Documentarlos sirve para reconocerlos y evitarlos.

### Antipatrones de diseño/arquitectura frecuentes

- **God Object / Blob (objeto todopoderoso)**: una única clase que concentra demasiadas responsabilidades y conocimiento del sistema (viola Alta Cohesión y Single Responsibility). Las demás clases quedan reducidas a meros contenedores de datos.
- **Spaghetti Code (código espagueti)**: flujo de control enredado, sin estructura ni separación de responsabilidades; difícil de seguir y modificar.
- **Golden Hammer (martillo de oro)**: "si lo único que tengo es un martillo, todo me parece un clavo". Aplicar siempre la misma tecnología o patrón conocido a cualquier problema, sea o no el adecuado.
- **Lava Flow (flujo de lava)**: código muerto o de dudosa utilidad que nadie se anima a eliminar y queda "solidificado" en el sistema, arrastrándose versión tras versión.
- **Copy-Paste Programming (programación por copia y pega)**: duplicar código en lugar de abstraerlo; viola DRY (*Don't Repeat Yourself*) y multiplica el costo de los cambios y de la corrección de errores.
- **Poltergeist (objeto fantasma)**: clases con responsabilidades mínimas y vida efímera, cuya única función es invocar a otras; agregan complejidad sin aportar valor.
- **Otros**: *Magic Numbers/Strings* (valores literales sin nombre), *Hard Coding* (valores fijos que deberían ser configurables), *Reinventing the Wheel* (reimplementar algo que ya existe), *Premature Optimization* (optimizar antes de medir), *Big Ball of Mud* (sistema sin arquitectura discernible).

### Code smells (malos olores del código)

Un **code smell** es un **síntoma superficial** que sugiere un problema de diseño más profundo (concepto popularizado por Martin Fowler en *Refactoring*). No es necesariamente un error, pero invita a refactorizar. Ejemplos:

- **Long Method** (método demasiado largo) y **Large Class** (clase enorme).
- **Long Parameter List** (lista de parámetros excesiva).
- **Duplicated Code** (código duplicado).
- **Feature Envy** (un método usa más datos de otra clase que de la propia → mover el método).
- **Data Clumps** (grupos de datos que siempre viajan juntos → encapsular en una clase).
- **Switch Statements** (condicionales sobre el tipo que pedirían polimorfismo / *Strategy* / *State*).
- **Shotgun Surgery** (un cambio obliga a tocar muchas clases → baja cohesión/alto acoplamiento).

## Mejores prácticas de diseño

Síntesis de recomendaciones, alineada con Larman, GoF y Pressman & Maxim:

- **Buscar bajo acoplamiento y alta cohesión** en cada decisión de asignación de responsabilidades.
- **Encapsular lo que varía** y programar para interfaces, no para implementaciones.
- **Favorecer la composición sobre la herencia**; usar herencia solo para relaciones *es-un* genuinas.
- **Aplicar DRY** (no duplicar) y **KISS** (*Keep It Simple* — preferir la solución simple) y **YAGNI** (*You Aren't Gonna Need It* — no diseñar para requisitos que no existen).
- **Aplicar patrones con criterio**: usar el patrón cuando el problema que resuelve está presente; no sobrediseñar (evitar *Golden Hammer*).
- **Diseñar para el cambio**: aislar los puntos de variación previsibles (Variaciones Protegidas / Open-Closed).
- **Refactorizar continuamente** ante la aparición de *code smells*, apoyándose en pruebas automatizadas.
- **Documentar las decisiones de diseño** con el vocabulario de patrones para comunicarlas con claridad.

## En síntesis (para el parcial)

Para el parcial conviene poder, de cada patrón: nombrarlo, decir su **categoría**, el **problema que resuelve** y un ejemplo de uso. GRASP guía *dónde* poner responsabilidades; GoF aporta *soluciones* concretas; los antipatrones son lo que hay que *evitar*.

| Patrón | Categoría | Problema que resuelve |
|---|---|---|
| Information Expert | GRASP | A qué clase asignar una responsabilidad (a la que tiene la info). |
| Creator | GRASP | Quién debe crear una instancia. |
| Controller | GRASP | Quién maneja un evento del sistema fuera de la UI. |
| Low Coupling | GRASP | Minimizar dependencias e impacto de cambios. |
| High Cohesion | GRASP | Mantener las clases enfocadas y manejables. |
| Polymorphism | GRASP | Manejar variación por tipo sin condicionales. |
| Pure Fabrication | GRASP | Dónde poner lógica que no encaja en el dominio. |
| Indirection | GRASP | Desacoplar dos elementos vía un intermediario. |
| Protected Variations | GRASP | Aislar puntos de cambio previsibles. |
| Singleton | Creacional | Garantizar una única instancia con acceso global. |
| Factory Method | Creacional | Diferir a subclases qué clase concreta instanciar. |
| Abstract Factory | Creacional | Crear familias de objetos relacionados. |
| Builder | Creacional | Construir paso a paso un objeto complejo. |
| Prototype | Creacional | Crear objetos clonando un prototipo. |
| Adapter | Estructural | Hacer compatibles interfaces incompatibles. |
| Bridge | Estructural | Separar abstracción de implementación. |
| Composite | Estructural | Tratar jerarquías parte-todo de forma uniforme. |
| Decorator | Estructural | Añadir responsabilidades dinámicamente. |
| Facade | Estructural | Simplificar el acceso a un subsistema complejo. |
| Flyweight | Estructural | Compartir objetos finos para ahorrar memoria. |
| Proxy | Estructural | Controlar el acceso a un objeto mediante un sustituto. |
| Strategy | Comportamiento | Intercambiar algoritmos de una familia. |
| Observer | Comportamiento | Notificar cambios a múltiples dependientes. |
| Command | Comportamiento | Encapsular una petición como objeto (undo, colas). |
| Template Method | Comportamiento | Fijar el esqueleto de un algoritmo, variar pasos. |
| Iterator | Comportamiento | Recorrer una colección sin exponer su interior. |
| State | Comportamiento | Cambiar comportamiento según el estado interno. |
| Chain of Responsibility | Comportamiento | Pasar una petición por una cadena de manejadores. |
| Mediator | Comportamiento | Centralizar la interacción entre objetos. |
| Memento | Comportamiento | Capturar y restaurar estado sin romper encapsulamiento. |
| Visitor | Comportamiento | Añadir operaciones a una estructura estable de objetos. |
| Interpreter | Comportamiento | Interpretar sentencias de un lenguaje simple. |
| MVC | Arquitectónico | Separar datos, presentación e interacción. |

{: .note }
> Trucos para recordar GoF: **creacionales** = *cómo se crean* los objetos; **estructurales** = *cómo se componen*; **de comportamiento** = *cómo interactúan*. Y los tres "primos" estructurales se distinguen por intención: Adapter (cambia interfaz), Decorator (agrega), Proxy (controla acceso).
