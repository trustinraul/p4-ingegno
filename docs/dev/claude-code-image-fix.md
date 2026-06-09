# Claude Code — Image Fix Prompt
## 3 cambios quirúrgicos de parámetros

> Pega esto entero. No toques estructura ni copy, solo los valores indicados.

---

## Cambio 1 — `app/page.tsx` — Subir la opacidad del fondo de cuaderno

El fondo de `davinci_notebook_anatomy.jpg` existe pero es invisible a `opacity-[0.035]` con `filter invert grayscale`. Sube la opacidad y quita el invert.

**Busca exactamente este bloque:**
```tsx
<Image
  src="/images/davinci_notebook_anatomy.jpg"
  alt=""
  fill
  className="object-cover object-top opacity-[0.035] filter invert grayscale"
  sizes="100vw"
  priority
/>
```

**Reemplázalo con:**
```tsx
<Image
  src="/images/davinci_notebook_anatomy.jpg"
  alt=""
  fill
  className="object-cover object-top"
  style={{ opacity: 0.07, mixBlendMode: 'luminosity' }}
  sizes="100vw"
  priority
/>
```

---

## Cambio 2 — `components/landing/Features.tsx` — Vitruvian Man visible

La imagen del Hombre de Vitruvio existe pero tiene `opacity: 0.15` combinado con un `maskImage` de gradiente radial que la borra casi entera. Hay que hacer el frame visible como un cuadro de exposición, no como un fantasma.

**Busca exactamente este bloque** (el `<div className="relative w-full h-full...">` con el Image dentro):
```tsx
<div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-white/[0.02]">
  <Image
    src="/images/davinci_vitruvian_man.jpg"
    alt="Leonardo da Vinci - Vitruvian Man"
    fill
    className="object-cover object-center"
    style={{
      opacity: 0.15,
      filter: 'invert(1) grayscale(1) contrast(1.15)',
      maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)'
    }}
    sizes="(max-width: 1024px) 100vw, 40vw"
    priority={false}
  />
</div>
```

**Reemplázalo con:**
```tsx
<div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-white/[0.02]">
  <Image
    src="/images/davinci_vitruvian_man.jpg"
    alt="Leonardo da Vinci - Vitruvian Man"
    fill
    className="object-cover object-center"
    style={{
      opacity: 0.55,
      filter: 'grayscale(1) contrast(1.1)',
      mixBlendMode: 'luminosity',
      maskImage: 'radial-gradient(ellipse 75% 85% at 50% 50%, black 50%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 75% 85% at 50% 50%, black 50%, transparent 100%)'
    }}
    sizes="(max-width: 1024px) 100vw, 40vw"
    priority={false}
  />
</div>
```

Cambios clave:
- `opacity: 0.15` → `0.55` — la imagen tiene que leerse como imagen, no como textura
- `invert(1)` eliminado — no invertir, mostrar el dibujo en sus tonos originales sobre el fondo oscuro del card
- `maskImage` ampliado de `40%` a `75% 85%` — el gradiente ahora solo borra el borde exterior, no el 60% del centro

---

## Cambio 3 — `components/landing/TheName.tsx` — Mostrar la cara, no la barba

El retrato de Da Vinci existe pero `object-cover object-center` centra en la barba/pecho. Hay que posicionar la imagen arriba para mostrar la cara.

**Busca exactamente este bloque:**
```tsx
<Image
  src="/images/davinci_portrait.jpeg"
  alt="Leonardo da Vinci - Self Portrait"
  fill
  className="object-cover object-center"
  style={{
    opacity: 0.15,
    filter: 'invert(1) grayscale(1) contrast(1.15)',
    maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
  }}
  sizes="(max-width: 1024px) 100vw, 40vw"
  priority={false}
/>
```

**Reemplázalo con:**
```tsx
<Image
  src="/images/davinci_portrait.jpeg"
  alt="Leonardo da Vinci - Self Portrait"
  fill
  className="object-cover"
  style={{
    objectPosition: '50% 8%',
    opacity: 0.5,
    filter: 'grayscale(1) contrast(1.1)',
    mixBlendMode: 'luminosity',
    maskImage: 'radial-gradient(ellipse 70% 80% at 50% 45%, black 45%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 45%, black 45%, transparent 100%)',
  }}
  sizes="(max-width: 1024px) 100vw, 40vw"
  priority={false}
/>
```

Cambios clave:
- `object-center` → `objectPosition: '50% 8%'` — posiciona desde el 8% del top, mostrando la cara en lugar de la barba
- `opacity: 0.15` → `0.5` — el retrato tiene que verse
- `invert(1)` eliminado — no invertir colores
- `maskImage` centrado en `50% 45%` — el gradiente de fade se centra en la cara, no en el medio del cuerpo

---

## Verificación después de los cambios

1. Fondo cuaderno: scroll desde TheProblem hasta el CTA final — debe verse una textura de bocetos anatómicos muy sutil pero perceptible
2. Features: el Hombre de Vitruvio debe leerse como una figura recognizable dentro del card oscuro
3. TheName: el retrato debe mostrar la cara completa con barba y cabello visible, no recortado en la barbilla

No hay cambios de estructura, layout, copy ni animaciones.
