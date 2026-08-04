---
name: mana-interactive-hero
description: Aplica, constrói e personaliza heros interativos estilo Mana Yerba Mate. Inclui acordeão vertical de colunas de produtos, renderização/rotação 3D (Three.js/CSS 3D), transições dinâmicas de cores de fundo, micro-animações vetoriais (estrelas, bolhas, elementos flutuantes) e divisores de seção em curvas orgânicas SVG. Use SEMPRE que o usuário pedir "hero estilo Mana Yerba Mate", "slider de produtos em colunas", "carrossel 3D interativo com cores dinâmicas", "animação de lata 3D", ou "hero com efeito parallax de bebidas/produtos".
---

# Mana Interactive 3D Hero & Multi-Column Carousel Skill

Esta skill fornece as diretrizes arquiteturais, estilos CSS3 e lógica JavaScript de alta performance para construir um **Hero Interativo de Alto Impacto Visual**, inspirado no site premiado da *MANA Yerba Maté*.

---

## 🎨 Características do Design System

1. **Acordeão Vertical de Colunas (Multi-Column Active Focus)**:
   - A tela inicial é dividida em colunas verticais (uma para cada sabor/produto).
   - Ao passar o mouse ou clicar nas setas/pílulas de navegação, a coluna em foco expande a largura, enquanto as outras encolhem elegantemente.
   - Cada coluna possui uma paleta de cor própria (ex: Verde Mentola `#67C378`, Amarelo Pamplemousse `#F6C445`, Azul Blackberry `#4076E0`, Rosa Tropical `#F2628E`).

2. **Apresentação 3D do Produto**:
   - O produto central (ex: lata de bebida ou embalagem) flutua no centro de cada coluna com efeito 3D (iluminação, sombras e rotação em resposta ao ponteiro do mouse ou transição de slide).
   - Pode ser implementado com **Three.js** (WebGL) ou via **CSS3 3D Transforms** de altíssima performance.

3. **Ilustrações & Micro-Animações Vetoriais Flutuantes**:
   - Atrás da lata/produto, elementos gráficos (estrelas, frutas, borbulhas de gás, plantas) flutuam suavemente com micro-animações infinitas (`keyframes` CSS e rotação leve).

4. **Divisor de Seção em Curva Orgânica SVG (Arc Wave)**:
   - A transição do Hero para o conteúdo da página possui uma curva em arco SVG suave (`<svg viewBox="0 0 1517 93">`), criando um efeito orgânico e fluido.

5. **Barra de Navegação em Pílulas (Pill Navigation & Arrows)**:
   - Botões arredondados em formato de pílula (`border-radius: 9999px`) com animação de preenchimento e elevação 3D no hover.
   - Setas circulares com efeito de pulso/bounce ao interagir.

---

## 📁 Estrutura do Código HTML

```html
<section class="mana-hero">
  <!-- Container das Colunas -->
  <div class="mana-hero__columns">
    
    <!-- Coluna 1: Melon & Mint -->
    <article class="mana-column active" data-color="#55c171" data-flavor="melon">
      <div class="mana-column__bg"></div>
      <div class="mana-column__decorations">
        <span class="decoration star s-1">✨</span>
        <span class="decoration leaf l-1">🍃</span>
        <div class="organic-shape shape-green"></div>
      </div>
      <div class="mana-column__content">
        <h2 class="mana-column__title">MELON & MINT</h2>
        <div class="mana-product-wrapper">
          <img src="can-melon.png" alt="Mana Melon & Mint" class="mana-can-3d" />
        </div>
        <a href="#discover" class="mana-btn-discover">Discover this product</a>
      </div>
    </article>

    <!-- Coluna 2: Grapefruit -->
    <article class="mana-column" data-color="#f5b82e" data-flavor="grapefruit">
      <div class="mana-column__bg"></div>
      <div class="mana-column__decorations">
        <span class="decoration star s-2">✨</span>
        <span class="decoration bubble b-1">🫧</span>
        <div class="organic-shape shape-yellow"></div>
      </div>
      <div class="mana-column__content">
        <h2 class="mana-column__title">GRAPEFRUIT</h2>
        <div class="mana-product-wrapper">
          <img src="can-grapefruit.png" alt="Mana Grapefruit" class="mana-can-3d" />
        </div>
        <a href="#discover" class="mana-btn-discover">Discover this product</a>
      </div>
    </article>

    <!-- Coluna 3: Blackberry & Hibiscus -->
    <article class="mana-column" data-color="#3d72e6" data-flavor="blackberry">
      <div class="mana-column__bg"></div>
      <div class="mana-column__decorations">
        <span class="decoration star s-3">✨</span>
        <span class="decoration flower f-1">🌺</span>
        <div class="organic-shape shape-blue"></div>
      </div>
      <div class="mana-column__content">
        <h2 class="mana-column__title">BLACKBERRY</h2>
        <div class="mana-product-wrapper">
          <img src="can-blackberry.png" alt="Mana Blackberry" class="mana-can-3d" />
        </div>
        <a href="#discover" class="mana-btn-discover">Discover this product</a>
      </div>
    </article>
  </div>

  <!-- Barra de Controles de Navegação -->
  <div class="mana-hero__controls">
    <button class="mana-arrow mana-arrow--prev" aria-label="Previous Flavor">
      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
    </button>

    <nav class="mana-pills">
      <button class="mana-pill active" data-index="0">Melon & Mint</button>
      <button class="mana-pill" data-index="1">Grapefruit</button>
      <button class="mana-pill" data-index="2">Blackberry & Hibiscus</button>
    </nav>

    <button class="mana-arrow mana-arrow--next" aria-label="Next Flavor">
      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 5l6 6-6 6"/></svg>
    </button>
  </div>

  <!-- Borda Inferior em Arco SVG Orgânico -->
  <div class="mana-hero__bottom-arc">
    <svg viewBox="0 0 1517 93" fill="none" preserveAspectRatio="none">
      <path d="M0 92.0674C528.5 -28.9327 977.5 -32.4328 1516.5 92.0674H0Z" fill="#FDFBF7"/>
    </svg>
  </div>
</section>
```

---

## 🎨 Estilos CSS3 Fundamentais

```css
:root {
  --mana-transition-speed: 0.6s;
  --mana-easing: cubic-bezier(0.25, 1, 0.5, 1);
  --mana-bg-cream: #FDFBF7;
}

/* Layout Geral */
.mana-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  background-color: #55c171;
  transition: background-color var(--mana-transition-speed) var(--mana-easing);
}

/* Container de Colunas */
.mana-hero__columns {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Coluna Individual */
.mana-column {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: flex var(--mana-transition-speed) var(--mana-easing), filter 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 1.5rem 6rem;
}

/* Expansão de Coluna Ativa */
.mana-column.active {
  flex: 1.8;
}

.mana-column:not(.active) {
  filter: brightness(0.92);
}

/* Fundo das Colunas */
.mana-column[data-flavor="melon"] { background-color: #67C378; }
.mana-column[data-flavor="grapefruit"] { background-color: #F6C445; }
.mana-column[data-flavor="blackberry"] { background-color: #4076E0; }

/* Título */
.mana-column__title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 3.5rem);
  font-weight: 800;
  color: #111;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  text-align: center;
  transition: transform var(--mana-transition-speed) var(--mana-easing);
}

.mana-column:not(.active) .mana-column__title {
  transform: scale(0.85);
  opacity: 0.8;
}

/* Lata 3D e Parallax */
.mana-product-wrapper {
  position: relative;
  width: 100%;
  max-width: 280px;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.mana-can-3d {
  width: 100%;
  max-height: 380px;
  object-fit: contain;
  filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.25));
  transition: transform 0.5s var(--mana-easing), filter 0.5s ease;
  transform-style: preserve-3d;
}

.mana-column:hover .mana-can-3d {
  transform: translateY(-12px) rotateY(12px) scale(1.05);
  filter: drop-shadow(0 35px 30px rgba(0, 0, 0, 0.3));
}

/* Elementos Flutuantes (Estrelas, Bolhas, Formas) */
.decoration {
  position: absolute;
  pointer-events: none;
  animation: floatInfinite 4s ease-in-out infinite alternate;
}

.s-1 { top: 20%; left: 15%; font-size: 2rem; animation-delay: 0s; }
.s-2 { top: 30%; right: 15%; font-size: 2.5rem; animation-delay: 1s; }
.b-1 { bottom: 25%; left: 20%; font-size: 2rem; animation-delay: 0.5s; }

@keyframes floatInfinite {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-18px) rotate(12deg); }
}

/* Controles de Navegação (Pílulas & Setas) */
.mana-hero__controls {
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mana-pills {
  display: flex;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 6px;
  border-radius: 9999px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}

.mana-pill {
  border: none;
  background: transparent;
  padding: 10px 22px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
}

.mana-pill.active {
  background-color: #111;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.2);
}

.mana-arrow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.mana-arrow:hover {
  transform: scale(1.1);
  background: #f0f0f0;
}

/* Borda Inferior Orgânica Arc Wave */
.mana-hero__bottom-arc {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 90px;
  pointer-events: none;
  z-index: 5;
}

.mana-hero__bottom-arc svg {
  width: 100%;
  height: 100%;
}
```

---

## ⚡ Lógica JavaScript (Interatividade e Parallax 3D)

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const columns = document.querySelectorAll('.mana-column');
  const pills = document.querySelectorAll('.mana-pill');
  const prevBtn = document.querySelector('.mana-arrow--prev');
  const nextBtn = document.querySelector('.mana-arrow--next');
  let currentIndex = 0;

  function setActiveFlavor(index) {
    currentIndex = index;
    
    // Atualizar colunas ativas
    columns.forEach((col, idx) => {
      if (idx === index) {
        col.classList.add('active');
      } else {
        col.classList.remove('active');
      }
    });

    // Atualizar pílulas de navegação
    pills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx === index);
    });
  }

  // Eventos de clique nas colunas
  columns.forEach((col, idx) => {
    col.addEventListener('click', () => setActiveFlavor(idx));
  });

  // Eventos de clique nas pílulas
  pills.forEach((pill, idx) => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveFlavor(idx);
    });
  });

  // Setas de Próximo / Anterior
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + columns.length) % columns.length;
      setActiveFlavor(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % columns.length;
      setActiveFlavor(newIndex);
    });
  }

  // Parallax 3D com o Movimento do Mouse
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const moveX = (clientX - centerX) / centerX;
    const moveY = (clientY - centerY) / centerY;

    const activeCan = document.querySelector('.mana-column.active .mana-can-3d');
    if (activeCan) {
      activeCan.style.transform = `translateY(${moveY * -15}px) rotateY(${moveX * 18}deg) rotateX(${moveY * -10}deg)`;
    }

    // Mover levemente os decorativos (efeito profundidade)
    document.querySelectorAll('.decoration').forEach(decor => {
      decor.style.transform = `translate(${moveX * 25}px, ${moveY * 25}px)`;
    });
  });
});
```

---

## 🎯 Regras de Ouro para IAs que Utilizarem esta Skill

1. **Garantir Alto Contraste & Legibilidade**: As cores das pílulas e textos devem ter contraste impecável contra a cor de fundo ativa.
2. **Responsividade Mobile**: Em telas pequenas (`< 768px`), alterar as colunas verticais para um carrossel horizontal de tela cheia ou abas com navegação por deslize (touch swipe).
3. **Desempenho 60FPS**: Utilizar apenas `transform` e `opacity` para animações contínuas, mantendo o renderizador do navegador otimizado em GPU.
4. **Sem Imagens Quebradas**: Utilizar svgs inline ou imagens geradas para demonstração das latas.
