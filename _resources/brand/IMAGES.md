# Brand Images — Da Vinci Assets

All images are **public domain** sourced from Wikimedia Commons.

| File | Subject | Size | Suggested use |
|---|---|---|---|
| `davinci_vitruvian_man.jpg` | Hombre de Vitruvio, ~1490 | 1400×1903px, 751 KB | Hero background (TheName section), decorative overlay con opacity baja |
| `davinci_self_portrait.jpg` | Autorretrato, ~1512 | 420×659px, 70 KB | Pequeño elemento decorativo, OG image secondary |
| `davinci_notebook_anatomy.jpg` | Estudios anatómicos del brazo, ~1510 | 1168×1676px, 460 KB | Textura de fondo (background-image con opacity 3-5%), sección TheName |
| `davinci_codex_flight.jpg` | Boceto de máquina voladora (Codex) | 700×548px, 76 KB | Feature card, elemento decorativo horizontal |

## Uso en Next.js

Todos están en `public/images/` → accesibles en `/images/davinci_*.jpg`

### Ejemplo TheName section con Vitruvian Man de fondo:
```tsx
<section style={{ backgroundImage: 'url(/images/davinci_vitruvian_man.jpg)', backgroundOpacity: 0.04 }}>
```

O mejor con `next/image`:
```tsx
import Image from 'next/image'
<Image src="/images/davinci_vitruvian_man.jpg" alt="" fill className="object-cover opacity-[0.04] mix-blend-luminosity" />
```

## Créditos
- Fuente: [Wikimedia Commons — Leonardo da Vinci](https://commons.wikimedia.org/wiki/Leonardo_da_Vinci)
- Todos en dominio público (>500 años)
