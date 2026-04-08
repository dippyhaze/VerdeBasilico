# 🌿 VerdeBasilico

Un'applicazione web moderna per la ricerca e raccomandazione di ricette, costruita con **React 19**, **TypeScript** e **Vite**.

## 📋 Descrizione

VerdeBasilico è un recipe recommender che permette agli utenti di scoprire ricette in base a preferenze di categoria e area geografica. L'app offre:

- 🔍 **Quick Search**: ricerca rapida per nome ricetta
- 🧙 **Wizard**: filtro interattivo per categoria e area di provenienza
- 📜 **Cronologia**: memorizza le ricerche recenti con feedback (like/dislike)
- 🌐 **Bandiere**: visualizza il paese di provenienza della ricetta
- 💾 **Persistenza**: salva la cronologia nel localStorage del browser
- 📗 **Accessibilità**: E' possibile la navigazione attraverso metodi di accessibilità

## 🏗️ Architettura e Decisioni di Design

### Stack Tecnologico

| Componente | Scelta | Motivo |
|-----------|--------|--------|
| **Framework** | React 19 | Ultima versione stabile con hook avanzati |
| **Linguaggio** | TypeScript ~5.9.3 | Type safety e developer experience |
| **Build Tool** | Vite 8 | Performance, HMR veloce, bundling ottimizzato |
| **Router** | React Router DOM 7 | Navigazione SPA senza page reload |
| **UI Icons** | lucide-react 1.7.0 | Icone leggere e performanti |

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
│       ├── HistoryCard/    # Sezione cronologia
│       └── HistoryList/   # Lista cronologia
├── hooks/                 # Custom React hooks
│   ├── useLocalStorage.ts # Persistenza dati
│   └── useDebounce.ts     # Debouncing input
│   └── useResponsive.ts   # Gestione MediaQuery
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
└── HistoryCard
    │   ├── HistoryList (lista cronologia)

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

#### 5. **Styling**
- **CSS Modules** per scoping locale
- **Layout Grid**: App container responsive
- **Accordion History**: collapsible con chevron animato


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

**Sviluppo**:
- `typescript@5.9.3` - Type checking
- `vite@8.0.1` - Build tool
- `eslint@9.39.4` + `typescript-eslint@8.57.0` - Linting
- `@vitejs/plugin-react@6.0.1` - React Fast Refresh

## 📱 Funzionalità

### 1. QuickSearch
- Barra di ricerca con debounce
- Risultati istantanei mentre digiti
- Clicca su ricetta → vai a `/recipe/:idMeal`

### 2. Wizard (Workflow)
- **Step 1**: Seleziona area geografica (grid thumbnails)
- **Step 2**: Seleziona categoria (grid pills)
- **Risultati**: Ricette che matchano ENTRAMBI i criteri

### 3. ResultView
- Visualizza ricetta completa
- Ingredienti + misure
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
