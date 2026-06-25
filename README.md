# Pokédex — Microfrontend Architecture

A Senior Frontend technical challenge implementing a Pokemon application using **Module Federation + Vite + React**.

---

## Credenciales de acceso

El login es un mock — no valida contra ningún backend. Cualquier combinación funciona:

| Campo    | Valor de ejemplo |
|----------|-----------------|
| Username | `ash`           |
| Password | `1234`          |

Solo se exige que ambos campos estén completos. El usuario queda guardado en `localStorage`, así que al recargar la página no se vuelve a pedir el login.

---

## Levantar el proyecto

### Requisitos previos

- Node.js ≥ 18
- npm ≥ 7 (soporte de workspaces)

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd poke-mf
npm install
```

### 2. Modo desarrollo

```bash
npm run dev
```

Esto ejecuta tres pasos en orden:

1. Compila `mf-detail` y `mf-history` y genera sus archivos `remoteEntry.js`
2. Levanta ambos microfrontends en modo preview (puertos **3001** y **3002**)
3. Levanta el Shell en modo dev en el puerto **3000**

Abrí el browser en **http://localhost:3000**

### 3. Build de producción + preview

```bash
npm run preview
```

Compila los tres paquetes y los sirve todos en modo preview.

### 4. Correr los tests

```bash
npm test
```

Corre las 87 pruebas unitarias de los tres paquetes en secuencia.

Para correr solo un paquete, o en modo watch:

```bash
npm run test --workspace=shell        # solo shell
npm run test --workspace=mf-detail    # solo mf-detail
npm run test --workspace=mf-history   # solo mf-history

npm run test:watch --workspace=shell  # modo watch (re-corre al guardar)
```

### 5. Detener los servidores

```bash
lsof -ti:3000,3001,3002 | xargs kill -9
```

---

## Guía de uso

| Acción | Cómo |
|--------|------|
| Buscar Pokemon | Click en la barra del navbar o presionar `⌘K` |
| Cambiar tipo | Click en los chips (Fire, Water, Grass…) |
| Ver detalle | Click en cualquier tarjeta de Pokemon |
| Cerrar detalle | Click fuera del panel o presionar `Escape` |
| Cambiar tema | Click en el ícono 🌙 / ☀️ del navbar |
| Ver historial | Scroll hacia abajo en el home |
| Cerrar sesión | Click en tu nombre → Sign Out |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Shell (Port 3000)                     │
│  • Login / Auth        • Category browsing (10/type)     │
│  • Global search modal • Dark/Light theme                │
│  • Toast notifications • User dropdown                   │
│                                                          │
│   ┌─────────────────┐     ┌─────────────────────┐       │
│   │  MF Detail 3001 │     │  MF History 3002    │       │
│   │  PokemonDetail  │     │  PokemonHistory     │       │
│   │  (image, types, │     │  (visit count,      │       │
│   │   stats, abil.) │     │   persistence)      │       │
│   └─────────────────┘     └─────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Capa | Elección |
|------|----------|
| Framework | React 18 + Vite 6 |
| Federation | @originjs/vite-plugin-federation |
| Styling | Tailwind CSS v3 (dark mode via `class`) |
| Estado | Zustand v5 |
| Data fetching | TanStack Query v5 |
| Tests | Vitest + React Testing Library |
| API | [PokeAPI](https://pokeapi.co) |

---

## Features

### Shell (Port 3000)
- **Login** — Mock auth, cualquier usuario/clave
- **Home** — 10 categorías de tipo con 10 Pokemon cada una (fire, water, grass, electric, psychic, ghost, dragon, fighting, ice, poison)
- **Search Modal** (`⌘K` o botón del navbar) — Modal fullscreen con infinite scroll (30 por página) y búsqueda por nombre exacto
- **Detail Panel** — Panel deslizable desde la derecha que consume **MF1** (imagen oficial, tipos, stats, habilidades, altura/peso)
- **Dark/Light Theme** — Persistido en `localStorage`, toggle en el navbar
- **Toast** — Al recargar la página muestra el último Pokemon visitado; el botón de cerrar previene que vuelva a aparecer hasta la próxima visita (flag en `sessionStorage`)
- **User Dropdown** — Muestra username, opción de Sign Out

### MF Detail (Port 3001)
Módulo expuesto: `mf_detail/PokemonDetail`
- Artwork oficial con fondo degradado basado en el tipo
- Tipos, habilidades (con badge de "hidden"), barras de stats
- Altura, peso, experiencia base

### MF History (Port 3002)
Módulo expuesto: `mf_history/PokemonHistory`
- Persistido en `localStorage` con clave `pokemon_history`
- Registra `{ name, image, visits }` por Pokemon (sin duplicados, incrementa visitas)
- Se sincroniza con el Shell via `CustomEvent('pokemon_history_updated')`
- Botón "Clear All"
- Hacer click en una tarjeta del historial abre el panel de detalle

---

## Estructura del proyecto

```
poke-mf/
├── package.json              # npm workspaces root + scripts globales
├── shell/                    # Host app (Port 3000)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── bootstrap.jsx
│   │   ├── index.css
│   │   ├── setupTests.js
│   │   ├── store/
│   │   │   └── useStore.js
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── SearchModal.jsx
│   │   │   ├── PokemonCard.jsx
│   │   │   ├── DetailPanel.jsx        ← consume MF1 via lazy()
│   │   │   ├── HistorySection.jsx     ← consume MF2 via lazy()
│   │   │   ├── Toast.jsx
│   │   │   └── UserDropdown.jsx
│   │   ├── __mocks__/
│   │   │   ├── PokemonDetail.jsx      ← stub para tests
│   │   │   └── PokemonHistory.jsx     ← stub para tests
│   │   └── __tests__/
│   │       ├── store/useStore.test.js
│   │       └── components/
│   │           ├── Login.test.jsx
│   │           ├── Navbar.test.jsx
│   │           ├── Toast.test.jsx
│   │           ├── PokemonCard.test.jsx
│   │           └── UserDropdown.test.jsx
│   ├── vite.config.js
│   └── vitest.config.js
├── mf-detail/                # Microfrontend 1 (Port 3001)
│   ├── src/
│   │   ├── PokemonDetail.jsx
│   │   └── __tests__/PokemonDetail.test.jsx
│   ├── vite.config.js
│   └── vitest.config.js
└── mf-history/               # Microfrontend 2 (Port 3002)
    ├── src/
    │   ├── PokemonHistory.jsx
    │   └── __tests__/PokemonHistory.test.jsx
    ├── vite.config.js
    └── vitest.config.js
```

---

## Detalle técnico

### Module Federation con Vite

Se utilizó `@originjs/vite-plugin-federation`. El shell consume los módulos remotos a través de sus `remoteEntry.js`:

```
mf_detail  →  http://localhost:3001/assets/remoteEntry.js
mf_history →  http://localhost:3002/assets/remoteEntry.js
```

Los remotos necesitan estar compilados antes de que el shell los pueda consumir. Por eso el script `npm run dev` primero compila los remotos (`vite build`) y luego los sirve con `vite preview`, mientras que el shell corre con `vite` (modo dev con HMR).

`react` y `react-dom` están declarados como `shared` para evitar que cada microfrontend cargue su propia copia.

### Comunicación entre Shell y MF2 (historial)

No se comparte un store de Zustand entre microfrontends (hacerlo crea problemas de instancias singleton cuando los módulos vienen de diferentes bundles). En cambio, la comunicación se hace a través de dos mecanismos nativos del browser:

- **`localStorage`**: el Shell escribe la entrada en `pokemon_history` al visitar un Pokemon.
- **`CustomEvent('pokemon_history_updated')`**: el Shell dispara este evento tras cada escritura; MF2 lo escucha y relee el localStorage para actualizarse.

Esto mantiene ambas apps independientemente desplegables y sin acoplamiento de código.

### Degradación ante fallas de remotos

Cada remoto está envuelto en un `React.ErrorBoundary`. Si `mf-detail` o `mf-history` no están disponibles, el shell muestra un mensaje descriptivo en lugar de romper toda la aplicación.

### Infinite Scroll en el modal de búsqueda

Se usa `IntersectionObserver` sobre un elemento centinela al final de la lista. Cuando el centinela entra al viewport, se llama `fetchNextPage()` de `useInfiniteQuery` (TanStack Query), que carga los siguientes 30 Pokemon desde `GET /pokemon?limit=30&offset=N`.

### Tests unitarios

Las pruebas no requieren que los servidores de los remotos estén levantados. El `vitest.config.js` del shell mapea los imports de federation (`mf_detail/PokemonDetail`, `mf_history/PokemonHistory`) a componentes stub locales mediante `resolve.alias`, desacoplando completamente el test de la infraestructura de despliegue.

**Cobertura — 87 tests:**

| Paquete | Tests | Qué se prueba |
|---------|-------|---------------|
| shell | 59 | Store (addToHistory, login, logout, tema, selectPokemon), Login, Navbar, Toast, PokemonCard, UserDropdown |
| mf-detail | 14 | Estados vacío/carga/error/éxito, stats, tipos, re-fetch al cambiar prop |
| mf-history | 14 | Estado vacío, historial con visitas, badge 99+, onSelect, Clear All, reactividad por eventos |

### Persistencia

| Dato | Mecanismo | Clave |
|------|-----------|-------|
| Usuario logueado | `localStorage` | `poke_user` |
| Tema (dark/light) | `localStorage` | `poke_theme` |
| Historial de visitas | `localStorage` | `pokemon_history` |
| Toast descartado | `sessionStorage` | `toast_dismissed` |
