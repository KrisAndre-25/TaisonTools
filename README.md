<div align="center">

# TAISON TOOLS

**Desarrollo & Diseño UX/UI**

Estudio de software y diseño · Santiago, Chile

</div>

---

TaisonTools es un estudio formado por un desarrollador full-stack y un diseñador UX/UI. Creamos sitios, aplicaciones, software a medida y automatizaciones donde cada pantalla se piensa y se construye en conjunto: el diseño llega al código listo para construirse, y el código respeta cada decisión de diseño.

Este repositorio contiene el sitio del estudio.

## Equipo

| | Disciplina | Rol |
| --- | --- | --- |
| **Kristopher Astudillo** | Desarrollo | Full-Stack Developer · Analista Programador |
| **Rodrigo Contador** | Diseño | Diseñador Gráfico · UX/UI Designer |

Un equipo pequeño a propósito: quien encarga un proyecto conversa directamente con las personas que lo diseñan y lo programan.

## Servicios

Software a medida · Desarrollo web · UX/UI · Soluciones digitales · Automatización · Productos digitales

## El sitio

- **Inicio a pantalla completa** — el logotipo sobre un panal de hexágonos interactivo dibujado en canvas, que reacciona al cursor.
- **Loader propio** — la O de TOOLS se completa de 1% a 100% mientras su cursor da una vuelta completa.
- **Movimiento con intención** — titulares que entran por palabra, secciones que aparecen al hacer scroll y un proceso que avanza con la lectura.
- **Modo de alto contraste** — todo el sitio en negro con tinta blanca, a un clic o según la preferencia del sistema.
- **Accesible** — pensado para WCAG 2.2 AA: contraste verificado, navegación completa con teclado, foco visible, textos alternativos y respeto por *reducir movimiento*.

## Tecnología

| | |
| --- | --- |
| Framework | Angular 21 — componentes standalone y signals |
| Lenguaje | TypeScript |
| Estilos | SCSS con design tokens propios |
| Pruebas | Vitest |
| Tipografías | Inter Tight · JetBrains Mono |

## Desarrollo local

Requiere Node.js y npm.

```bash
npm install     # instala las dependencias
npm start       # servidor local en http://localhost:4200
npm run build   # build de producción en dist/
npm test        # pruebas unitarias
```

## Estructura

```
src/
├── app/
│   ├── core/       contenido del sitio y modelos
│   ├── layout/     header y footer
│   ├── pages/      página de inicio
│   ├── sections/   inicio, servicios, proceso, proyectos, stack, nosotros, contacto
│   └── shared/     logo, loader, panal interactivo, texto escalonado, servicios comunes
└── styles/         tokens, tipografía, layout, botones y movimiento
```

---

<!--
  Imagen de cierre: guarda la imagen (con su licencia) en docs/cover.png y
  reemplaza este comentario por:

  <p align="center"><img src="docs/cover.png" alt="TaisonTools" width="100%"></p>
-->

<div align="center">

**TAISON TOOLS** · Desarrollo & Diseño UX/UI · Santiago, Chile

</div>
