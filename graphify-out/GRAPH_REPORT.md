# Graph Report - C:/Users/abdib/OneDrive/Desktop/Ana s gift  (2026-04-18)

## Corpus Check
- Corpus is ~3,697 words - fits in a single context window. You may not need a graph.

## Summary
- 35 nodes · 21 edges · 16 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Video Player|Video Player]]
- [[_COMMUNITY_Star SVG Asset|Star SVG Asset]]
- [[_COMMUNITY_Constellation Animation|Constellation Animation]]
- [[_COMMUNITY_Friend Profile Page|Friend Profile Page]]
- [[_COMMUNITY_Stars Background|Stars Background]]
- [[_COMMUNITY_App Root|App Root]]
- [[_COMMUNITY_Finale Screen|Finale Screen]]
- [[_COMMUNITY_Friend Node Card|Friend Node Card]]
- [[_COMMUNITY_Landing Page|Landing Page]]
- [[_COMMUNITY_Floating Quotes|Floating Quotes]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_Friends Data|Friends Data]]
- [[_COMMUNITY_Quotes Data|Quotes Data]]

## God Nodes (most connected - your core abstractions)
1. `star.svg SVG File` - 3 edges
2. `Five-Pointed Star Shape` - 3 edges
3. `SVG Icon Asset` - 3 edges
4. `32x32 ViewBox` - 2 edges
5. `Gold/Warm Yellow Fill Color #ffd89b` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Hyperedges (group relationships)
- **Star Icon Visual Composition: Shape, Color, and Viewport** — star_svg_star_shape, star_svg_color_ffd89b, star_svg_32x32_viewport [EXTRACTED 0.97]

## Communities

### Community 0 - "Video Player"
Cohesion: 0.4
Nodes (0): 

### Community 1 - "Star SVG Asset"
Cohesion: 0.6
Nodes (5): 32x32 ViewBox, Gold/Warm Yellow Fill Color #ffd89b, star.svg SVG File, Five-Pointed Star Shape, SVG Icon Asset

### Community 2 - "Constellation Animation"
Cohesion: 0.67
Nodes (0): 

### Community 3 - "Friend Profile Page"
Cohesion: 0.67
Nodes (0): 

### Community 4 - "Stars Background"
Cohesion: 0.67
Nodes (0): 

### Community 5 - "App Root"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Finale Screen"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Friend Node Card"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Landing Page"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Floating Quotes"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Tailwind Config"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "App Entry Point"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Friends Data"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Quotes Data"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **1 isolated node(s):** `Gold/Warm Yellow Fill Color #ffd89b`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `App Root`** (2 nodes): `App()`, `App.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Finale Screen`** (2 nodes): `Finale()`, `Finale.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Friend Node Card`** (2 nodes): `FriendNode()`, `FriendNode.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Landing Page`** (2 nodes): `Landing()`, `Landing.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Floating Quotes`** (2 nodes): `FloatingQuotes()`, `Quote.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry Point`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Friends Data`** (1 nodes): `friends.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Quotes Data`** (1 nodes): `quotes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `Five-Pointed Star Shape` (e.g. with `Gold/Warm Yellow Fill Color #ffd89b` and `SVG Icon Asset`) actually correct?**
  _`Five-Pointed Star Shape` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Gold/Warm Yellow Fill Color #ffd89b` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._