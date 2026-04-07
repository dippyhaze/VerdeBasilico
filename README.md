# 🌿 VerdeBasilico

Un'applicazione web moderna per la ricerca e raccomandazione di ricette, costruita con **React 19**, **TypeScript** e **Vite**.

## 📋 Descrizione

VerdeBasilico è un recipe recommender che permette agli utenti di scoprire ricette in base a preferenze di categoria e area geografica. L'app offre:

- 🔍 **Quick Search**: ricerca rapida per nome ricetta
- 🧙 **Wizard**: filtro interattivo per categoria e area di provenienza
- 📜 **Cronologia**: memorizza le ricerche recenti con feedback (like/dislike)
- 🌐 **Bandiere**: visualizza il paese di provenienza della ricetta
- 💾 **Persistenza**: salva la cronologia nel localStorage del browser

## 🏗️ Architettura e Decisioni di Design

### Stack Tecnologico

| Componente | Scelta | Motivo |
|-----------|--------|--------|
| **Framework** | React 19 | Ultima versione stabile con hook avanzati |
| **Linguaggio** | TypeScript ~5.9.3 | Type safety e developer experience |
| **Build Tool** | Vite 8 | Performance, HMR veloce, bundling ottimizzato |
| **Router** | React Router DOM 7 | Navigazione SPA senza page reload |
| **UI Icons** | lucide-react 1.7.0 | Icone leggere e performanti |
| **Flags** | react-world-flags 1.6.0 | Visualizzazione bandiere paesi |

### Struttura delle Cartelle

```
src/
├── api/                    # Integrazione API esterna
│   └── mealApi.ts         # Wrapper TheMealDB
├── components/            # Componenti riutilizzabili
│   ├── Layout/
│   │   └── Header/        # Header dell'app
│   ├── Search/
│   │   └── QuickSearch/   # Barra ricerca veloce
│   ├── Loader/            # Loading spinner
│   ├── ErrorState/        # Gestione errori
│   └── StepHeader/        # Header step wizard
├── features/              # Funzionalità principali
│   └── recommender/
│       ├── Wizard/        # Workflow filtri categoria/area
│       ├── StepCategory/  # Step 1: selezione categoria
│       ├── StepArea/      # Step 2: selezione area
│       ├── ResultView/    # Visualizzazione ricetta
│       └── HistoryList/   # Lista cronologia
├── hooks/                 # Custom React hooks
│   ├── useLocalStorage.ts # Persistenza dati
│   └── useDebounce.ts     # Debouncing input
├── types/                 # Type definitions TypeScript
│   └── index.ts           # Recipe, HistoryItem, Category, Area
├── utils/                 # Utility functions
│   └── recipeUtils.ts     # Mapping area → country code, random picker
├── App.tsx                # Root component + routing
└── main.tsx               # Entry point React
```

### Decisioni Architetturali Principali

#### 1. **API Layer - TheMealDB**
- **Base URL**: `https://www.themealdb.com/api/json/v1/1`
- **Endpoints utilizzati**:
  - `search.php?s={query}` - Ricerca per nome
  - `lookup.php?i={id}` - Dettagli completi ricetta
  - `categories.php` - Elenco categorie
  - `filter.php?c={category}` - Filtra per categoria
  - `filter.php?a={area}` - Filtra per area

**Decisione**: Normalizzazione dati raw TheMealDB in interfacce `Recipe` e `RecipeSummary` per type safety.

#### 2. **Data Flow - Componenti**
```
App (routing + history state)
├── Header (layout)
├── QuickSearch (ricerca diretta)
└── Routes
    ├── Wizard (home)
    │   ├── StepCategory (seleziona categoria)
    │   ├── StepArea (seleziona area)
    │   └── [Random/Results View]
    └── ResultView/:idMeal (dettagli ricetta + feedback)
```

#### 3. **Persistenza - localStorage Hook**
**`useLocalStorage<T>`**: Custom hook generico che:
- Deserializza JSON al mount
- Risincronizza localStorage ad ogni cambio stato
- Gestisce errori di accesso
- Ritorna tuple `[value, setValue]` compatibile con pattern useState

**Caso d'uso**: `recipeHistory` - array di `HistoryItem` con timestamp e flag like/dislike

#### 4. **Performance - Debouncing**
**`useDebounce<T>`**: Ritarda l'esecuzione di callback durante typing rapido
- Delay configurabile (default: ~300ms in QuickSearch)
- Evita troppe richieste API

#### 5. **Filtro Combinato - Logica AND**
```typescript
// Wizard: Categoria AND Area
// 1. Fetch ricette per area
// 2. Fetch ricette per categoria
// 3. Intersection via Set (O(n) instead of O(n²))
```
Scelta: **Set lookup** anziché nested loop per performance su grandi dataset.

#### 6. **Styling**
- **CSS Modules** per scoping locale
- **Layout Grid**: App container responsive
- **Accordion History**: collapsible con chevron animato

### Type Definitions

```typescript
interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
  strSource?: string;
  ingredients: string[]; // Normalizzato da API
}

interface HistoryItem extends Recipe {
  liked: boolean;
  timestamp: number;
}

interface RecipeSummary {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}
```

## 🚀 Istruzioni di Avvio

### Prerequisiti
- Node.js 18+
- npm o yarn

### Installazione

```bash
cd verde-basilico
npm install
```

### Sviluppo
```bash
npm run dev
# L'app sarà disponibile a http://localhost:5173
```

### Build Produzione
```bash
npm run build
# Output in ./dist
```

### Preview Produzione
```bash
npm run preview
```

### Linting
```bash
npm run lint
# ESLint + TypeScript type checking
```

## 📦 Dipendenze Principali

**Produzione**:
- `react@19.2.4` - UI library
- `react-dom@19.2.4` - DOM rendering
- `react-router-dom@7.14.0` - Client-side routing
- `lucide-react@1.7.0` - Icon library
- `react-world-flags@1.6.0` - Flag display

**Sviluppo**:
- `typescript@5.9.3` - Type checking
- `vite@8.0.1` - Build tool
- `eslint@9.39.4` + `typescript-eslint@8.57.0` - Linting
- `@vitejs/plugin-react@6.0.1` - React Fast Refresh

## 🎨 Utilità e Helper

### `areaToCountryCode`
Mappa area di TheMealDB → codici ISO paese per flag rendering:
```
'Italian' → 'IT'
'Japanese' → 'JP'
... (31 paesi supportati)
```

### `pickRandom<T>`
Seleziona elemento casuale da array — usato per suggerimento surprise nel Wizard.

## 📱 Funzionalità

### 1. QuickSearch
- Barra di ricerca con debounce
- Risultati istantanei mentre digiti
- Clicca su ricetta → vai a `/recipe/:idMeal`

### 2. Wizard (Workflow)
- **Step 1**: Seleziona categoria (grid thumbnails)
- **Step 2**: Seleziona area geografica (dropdown/list)
- **Risultati**: Ricette che matchano ENTRAMBI i criteri
- **Surprise**: Pulsante per ricetta casuale

### 3. ResultView
- Visualizza ricetta completa
- Ingredienti + misure
- Link video YouTube (se disponibile)
- Pulsanti Like/Dislike → salva in history

### 4. History
- Accordion collapsibile "Ultime Ricerche"
- Timestamped con feedback (👍/👎)
- Clicca item → torna alla ricetta
- Persiste nel localStorage

## 🔒 Sicurezza

- **TypeScript**: Elimina interi classi di bug di tipo
- **ESLint**: Enforces best practices React/hooks
- **CORS**: TheMealDB API è pubblica, no auth necessaria

## 📄 Licenza

MIT

---

**Creato con ❤️ da dippyhaze** | [Repository GitHub](https://github.com/dippyhaze/VerdeBasilico)
