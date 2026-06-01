# Diseño de Software (3648) — UNLaM

Sitio de apuntes de teoría y material de estudio de la asignatura **3648 — Diseño de Software** (Trayecto Desarrollo de Software, Ingeniería en Informática, UNLaM). Publicado con **GitHub Pages** usando el tema [just-the-docs](https://just-the-docs.com/).

- **Sitio publicado:** https://unlam-informatica.github.io/diseno-de-software
- Contenido en **español**, organizado por unidad según el programa analítico de la cátedra.
- Objetivo actual: **material de teoría** para los parciales. Los ejercicios/casos prácticos se incorporarán más adelante.

## Programa (6 unidades)

1. **Diseño de software** — abstracción, refinamiento, modularidad, cohesión, acoplamiento, independencia funcional, reutilización.
2. **Del diseño de sistemas al diseño de software** — procesos de negocio y de software, roles, atributos de calidad y restricciones.
3. **Los patrones y el diseño** — GRASP y GoF (creacionales, estructurales, de comportamiento); antipatrones.
4. **Diseño, refinamiento y especificación** — requisitos y diseño; topologías Web, Móvil y Escritorio; SOA y eventos.
5. **Diseño de sistemas de tiempo real** — sensores, actuadores y núcleo; tareas, sincronización, prioridades; Redes de Petri.
6. **Interfaz Hombre-Computadora** — UX vs UI, principios de interfaces, diseño centrado en el usuario, e-commerce.

Evaluación: **primer parcial** sobre unidades 1–3; **segundo parcial** (TP de investigación) sobre unidades 1–6. Materia de promoción.

## Estructura

```
_config.yml              # Config Jekyll/just-the-docs (title, baseurl, callouts, etc.)
index.md                 # Home: índice de unidades, evaluación y bibliografía
unidad-N/index.md        # Landing de cada unidad (overview + temas + bibliografía)
unidad-N/teoria.md       # Teoría de la unidad (página hija)
_sass/custom/*.scss      # Overrides de estilo del tema
_includes/head_custom.html, assets/js/page-toc.js   # TOC de página (columna derecha)
reference/               # PDFs fuente de la cátedra (excluidos del build)
```

## Desarrollo local

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000/diseno-de-software/
```

## Publicación

Push a `main`; GitHub Pages buildea desde la raíz (Settings → Pages → Deploy from a branch → `main` / `/ (root)`).
