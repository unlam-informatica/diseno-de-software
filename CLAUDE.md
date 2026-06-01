# CLAUDE.md

Guía para trabajar en este repositorio.

## Qué es este proyecto

Sitio de apuntes de la asignatura **3648 — Diseño de Software** (Trayecto Desarrollo de Software, Ingeniería en Informática, UNLaM), publicado con **GitHub Pages** usando el tema **just-the-docs** (vía `remote_theme`). El contenido está en **español** y se organiza por unidad según el programa analítico de la cátedra.

- Sitio publicado: `https://unlam-informatica.github.io/diseno-de-software`
- El objetivo actual es el **material de teoría** para estudiar para los parciales. Los ejercicios/casos prácticos se incorporarán más adelante.

## Fuentes de referencia

La carpeta [`reference/`](reference/) contiene los documentos de la cátedra que son la fuente de verdad del contenido. **No se publican** (no son parte del sitio):

- `reference/programa.pdf` — programa analítico oficial: unidades, contenidos mínimos, planificación, evaluación y bibliografía.
- `reference/ejercicios.pdf` — guía de trabajos prácticos (para la futura sección de ejercicios).

Ante cualquier duda sobre alcance o nombres de temas, el programa analítico manda.

## Programa (6 unidades)

1. **Diseño de software** — diseño de sistemas vs. de software; abstracción, refinamiento, modularidad, cohesión, acoplamiento, rediseño, independencia funcional, reutilización.
2. **Del diseño de sistemas al diseño de software** — procesos de negocio y de software, roles, gobierno de procesos, adopción; atributos de calidad y restricciones.
3. **Los patrones y el diseño** — GRASP y GoF (creacionales, estructurales, de comportamiento); antipatrones y mejores prácticas.
4. **Diseño, refinamiento y especificación** — requisitos y diseño; topologías Web, Móvil y Escritorio; SOA, eventos y topologías emergentes.
5. **Diseño de sistemas de tiempo real** — sensores, actuadores y núcleo; tareas, sincronización, prioridades, eventos; Redes de Petri.
6. **Interfaz Hombre-Computadora** — UX vs UI, principios de interfaces, diseño centrado en el usuario, e-commerce.

Evaluación: **primer parcial** sobre unidades 1–3; **segundo parcial** (TP de investigación) sobre unidades 1–6. Materia de promoción.

## Bibliografía (tratamiento esperado)

Al escribir o revisar teoría, alinear con el enfoque de estos textos:

- **Sommerville**, *Software Engineering* (10.ª) — proceso, requisitos, arquitectura, topologías, calidad.
- **Pressman & Maxim**, *Software Engineering* (9.ª) — conceptos de diseño, calidad, UI.
- **GoF**, *Design Patterns* — patrones creacionales/estructurales/de comportamiento.
- **Larman**, *UML y patrones* — GRASP, asignación de responsabilidades, diseño OO.
- **Yourdon**, *Análisis estructurado moderno* (complementaria).

## Estructura del sitio

```
_config.yml              # Config Jekyll/just-the-docs (title, baseurl, callouts, etc.)
index.md                 # Home: índice de unidades, evaluación y bibliografía
unidad-N/index.md        # Landing de cada unidad (overview + temas + bibliografía)
unidad-N/teoria.md       # Teoría de la unidad (página hija)
_sass/custom/*.scss      # Overrides de estilo del tema
_includes/head_custom.html, assets/js/page-toc.js   # TOC de página (columna derecha)
reference/               # PDFs fuente de la cátedra (excluidos del build)
```

### Navegación (just-the-docs)

- El **home** usa `nav_order: 1`.
- Cada unidad es una carpeta `unidad-N/` con un `index.md` como página de sección (`has_children: true`, `has_toc: false`, `nav_order: N+1`, título `Unidad N — <tema>`).
- `has_toc: false` desactiva la "Table of contents" automática de páginas hijas que just-the-docs agrega en las páginas con `has_children`. El TOC de cada página lo genera `assets/js/page-toc.js` en la columna derecha; no usar TOC manual (`{:toc}`) ni el automático del tema.
- La teoría va en `unidad-N/teoria.md` como **página hija** (`parent: "Unidad N — <tema>"`).
- Los futuros ejercicios irán como otra página hija (`ejercicios.md`) en la misma carpeta.

### Callouts disponibles

Definidos en `_config.yml`: `enunciado` (ámbar) y `resolución` (teal), además de los estándar de just-the-docs (`note`, `warning`, etc.). Uso:

```markdown
{: .note }
> Texto del callout.
```

## Convenciones de contenido

- **Idioma:** español. Términos técnicos consagrados en inglés se pueden dejar en inglés (p. ej. *Singleton*, *coupling*) aclarando la traducción la primera vez.
- **Estructura por página:** encabezados `##` y `###` para que el TOC de página (derecha) se genere bien. Evitar saltar de `##` a `####`.
- **Enfoque de estudio:** priorizar definiciones claras, comparaciones (tablas), ejemplos breves y "para el parcial" sobre extensión. Citar a qué autor/enfoque corresponde cada tema cuando sea relevante.
- **Frontmatter mínimo** en páginas hijas:

  ```yaml
  ---
  title: Teoría
  parent: "Unidad N — <tema>"
  nav_order: 1
  ---
  ```

## Desarrollo local

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000/diseno-de-software/
```

Publicación: push a `main`; GitHub Pages buildea desde la raíz.
