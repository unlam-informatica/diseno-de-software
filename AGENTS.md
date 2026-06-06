# AGENTS.md

Guía para agentes que trabajen en este repositorio.

## Qué es este proyecto

Sitio de apuntes de la asignatura **3648 — Diseño de Software** (Trayecto Desarrollo de Software, Ingeniería en Informática, UNLaM), publicado con **GitHub Pages** usando el tema **just-the-docs** (vía `remote_theme`). El contenido está en **español** y se organiza por unidad según el programa analítico de la cátedra.

- Sitio publicado: `https://unlam-informatica.github.io/diseno-de-software`
- El objetivo actual es el **material de teoría** para estudiar para los parciales. Los ejercicios/casos prácticos se incorporarán más adelante.

## Fuentes de referencia

La carpeta [`reference/`](reference/) contiene los documentos de la cátedra que son la fuente de verdad del contenido. **No se publican** (no son parte del sitio):

- `reference/programa.pdf` — programa analítico oficial: unidades, contenidos mínimos, planificación, evaluación y bibliografía.
- `reference/ejercicios.pdf` — guía de trabajos prácticos.

Ante cualquier duda sobre alcance, nombres de temas o cobertura mínima, el programa analítico manda.

## Programa (6 unidades)

1. **Diseño de software** — diseño de sistemas vs. de software; abstracción, refinamiento, modularidad, cohesión, acoplamiento, rediseño, independencia funcional, reutilización.
2. **Del diseño de sistemas al diseño de software** — procesos de negocio y de software, roles, gobierno de procesos, adopción; atributos de calidad y restricciones.
3. **Los patrones y el diseño** — GRASP y GoF (creacionales, estructurales, de comportamiento); antipatrones y mejores prácticas.
4. **Diseño, refinamiento y especificación** — requisitos y diseño; topologías Web, Móvil y Escritorio; SOA, eventos y topologías emergentes.
5. **Diseño de sistemas de tiempo real** — sensores, actuadores y núcleo; tareas, sincronización, prioridades, eventos; Redes de Petri.
6. **Interfaz Hombre-Computadora** — UX vs UI, principios de interfaces, diseño centrado en el usuario, e-commerce.

Evaluación: **primer parcial** sobre unidades 1-3; **segundo parcial** (TP de investigación) sobre unidades 1-6. Materia de promoción.

## Bibliografía y prioridad

La bibliografía prioritaria y considerada como **referencia principal** por la cátedra es:

- **GoF**, *Design Patterns* — patrones creacionales/estructurales/de comportamiento y reutilización de soluciones de diseño.
- **Larman**, *UML y patrones* — GRASP, asignación de responsabilidades y diseño OO.

El resto de la bibliografía se usa para validar ideas, ampliar definiciones generales o cubrir conceptos que no estén desarrollados en la bibliografía principal:

- **Sommerville**, *Software Engineering* (10.ª) — consulta para proceso, requisitos, arquitectura, topologías y calidad.
- **Pressman & Maxim**, *Software Engineering* (9.ª) — consulta para conceptos clásicos de diseño, calidad y UI.
- **Yourdon**, *Análisis estructurado moderno* — complementaria.

Al escribir o revisar teoría, priorizar el enfoque de **responsabilidades, colaboración entre objetos, bajo acoplamiento, alta cohesión y patrones**. Cuando se usen conceptos de Pressman, Sommerville o Yourdon, presentarlos como apoyo o contexto salvo que el programa exija específicamente ese enfoque.

## Diagramas, UML e imágenes

- Para todo lo relacionado con **UML**, diagramas de diseño, relaciones entre clases, secuencias, estados, componentes, flujos o aclaraciones visuales de conceptos, usar **Mermaid** cuando sea necesario para mejorar la comprensión.
- Mermaid está habilitado en `_config.yml`; usar bloques:

  ````markdown
  ```mermaid
  classDiagram
      class Venta
      Venta --> LineaDeVenta
  ```
  ````

- Preferir Mermaid para diagramas que representen modelos modificables en Markdown: clases, secuencia, estados, flujo, componentes, relaciones conceptuales.
- Si Mermaid no aplica, no alcanza para expresar la idea, o el resultado sería confuso, generar una imagen explicativa en **SVG** dentro de `assets/img/` e incorporarla al Markdown:

  ```markdown
  ![Descripción clara de la imagen]({{ '/assets/img/nombre-del-diagrama.svg' | relative_url }})
  ```

- Mantener los SVG simples, legibles, livianos y con texto en español. Usarlos para curvas, esquemas conceptuales, mapas visuales o diagramas donde Mermaid no sea adecuado.
- No agregar imágenes decorativas: toda imagen o diagrama debe aclarar una idea, concepto o ejemplo del apunte.

## Estructura del sitio

```
_config.yml              # Config Jekyll/just-the-docs (title, baseurl, callouts, etc.)
index.md                 # Home: índice de unidades, evaluación y bibliografía
unidad-N/index.md        # Landing de cada unidad (overview + temas + bibliografía)
unidad-N/teoria.md       # Teoría de la unidad (página hija)
practicas/index.md       # Landing de la sección Prácticas
practicas/practica-N.md  # Resolución de cada caso de la guía (una página por práctica)
_sass/custom/*.scss      # Overrides de estilo del tema
_includes/head_custom.html, assets/js/page-toc.js   # TOC de página (columna derecha)
assets/img/              # Imágenes y diagramas propios del sitio
reference/               # PDFs fuente de la cátedra (excluidos del build)
```

## Navegación (just-the-docs)

- El **home** usa `nav_order: 1`.
- Cada unidad es una carpeta `unidad-N/` con un `index.md` como página de sección (`has_children: true`, `has_toc: false`, `nav_order: N+1`, título `Unidad N — <tema>`).
- La teoría va en `unidad-N/teoria.md` como **página hija** (`parent: "Unidad N — <tema>"`, `nav_order: 1`, `has_toc: false`).
- `has_toc: false` desactiva el TOC automático del tema. El TOC de cada página lo genera `assets/js/page-toc.js` en la columna derecha; no usar TOC manual (`{:toc}`) ni el automático del tema.
- Los **casos prácticos** viven en `practicas/` (`index.md` con `has_children: true`, `has_toc: false`, `nav_order: 8`, título `Prácticas`). Una página por práctica: `practicas/practica-N.md`.

## Callouts disponibles

Definidos en `_config.yml`: `enunciado` (ámbar) y `resolucion` (teal), además de los estándar de just-the-docs (`note`, `warning`, etc.). Uso:

```markdown
{: .note }
> Texto del callout.
```

## Convenciones de contenido

- **Idioma:** español. Términos técnicos consagrados en inglés se pueden dejar en inglés (p. ej. *Singleton*, *coupling*) aclarando la traducción la primera vez.
- **Estructura por página:** usar encabezados `##` y `###` para que el TOC lateral se genere bien. Evitar saltar de `##` a `####`.
- **Enfoque de estudio:** priorizar definiciones claras, comparaciones en tablas, ejemplos breves y secciones "para el parcial" sobre extensión innecesaria.
- **Autor/enfoque:** citar a qué autor o enfoque corresponde cada tema cuando sea relevante, especialmente si se contrasta Larman/GoF con Pressman, Sommerville o Yourdon.
- **Cobertura:** antes de dar por terminada una unidad, contrastar contra `reference/programa.pdf` para no omitir temas.
- **Prácticas:** al armar una práctica, el callout `enunciado` debe contener el **enunciado completo y exacto** del caso tal como figura en `reference/ejercicios.pdf`, copiado palabra por palabra. No modificar, resumir, parafrasear, reordenar, abreviar ni mejorar la redacción. Cualquier aclaración propia va fuera del callout.
- **Frontmatter mínimo** en páginas hijas de teoría:

  ```yaml
  ---
  title: Teoría
  parent: "Unidad N — <tema>"
  nav_order: 1
  has_toc: false
  ---
  ```

## Desarrollo local

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000/diseno-de-software/
```

Publicación: push a `main`; GitHub Pages buildea desde la raíz.
