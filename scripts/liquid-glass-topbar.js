/**
 * Liquid Glass Effect for Topbar
 * Advanced version with SVG filters for chromatic aberration and refraction
 * Based on liquid-glass-react, adapted for vanilla JS/Hexo
 *
 * 配置统一放在下方 config；useSVGFilter 为 true 时才会把 SVG 色散滤镜注入页面。
 */

const config = {
  elasticity: 0.06,              // 弹性跟随强度，越小越含蓄
  activationZone: 100,           // 鼠标激活范围（px）
  useSVGFilter: false,           // true 时启用 SVG 色散滤镜
  navbarSelector: 'nav.navbar'   // Fluid 主题的导航栏元素
};

const style = `
<style>
  /* ========== Liquid Glass for Navbar ========== */
  /* Don't override position - keep navbar's original fixed positioning */
  .lg-navbar-glass {
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    background: rgba(255, 255, 255, 0.05) !important;

    /* Floating effect with margins */
    margin: 12px auto !important;
    max-width: calc(100% - 24px) !important;

    border-radius: 16px !important;

    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 2px 16px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;

    border: 1px solid rgba(255, 255, 255, 0.15) !important;

    /* 只过渡实际会变的属性，避免 transition: all 的开销 */
    transition:
      margin 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      padding 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* Scrolled state - capsule style */
  .lg-navbar-glass.lg-scrolled {
    margin: 8px auto !important;
    max-width: calc(100% - 16px) !important;
    /* 超过高度一半的圆角会被浏览器按比例压缩，天然形成完美胶囊，无需 JS 计算 */
    border-radius: 999px !important;
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.15),
      0 1px 12px rgba(0, 0, 0, 0.10),
      inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  }

  /* Shine layer for navbar */
  .lg-navbar-shine {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      circle at var(--lg-shine-x, 50%) 0%,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 60%
    );
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
    mix-blend-mode: screen;
  }

  .lg-navbar-glass:hover .lg-navbar-shine {
    opacity: 1;
  }

  /* ========== Liquid Glass for Individual Elements ========== */
  .lg-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin: 0 4px;
  }

  /* For navbar items, maintain flex behavior */
  .navbar-nav .lg-container {
    margin: 0 6px;
  }

  .lg-glass {
    position: relative;
    border-radius: var(--lg-radius, 12px);
    padding: var(--lg-padding, 8px 16px);
    backdrop-filter: blur(var(--lg-blur, 16px)) saturate(var(--lg-saturate, 150%));
    -webkit-backdrop-filter: blur(var(--lg-blur, 16px)) saturate(var(--lg-saturate, 150%));
    background: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    overflow: hidden;
    /* transform 用短过渡做弹性跟随，背景/阴影用 0.25s 淡入淡出 */
    transition:
      transform 0.12s cubic-bezier(0.4, 0, 0.2, 1),
      background 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  /* 导航栏内按钮：圆角、内边距等统一由 CSS 变量控制（不再写内联样式） */
  .lg-navbar-glass .lg-glass {
    --lg-radius: 20px; /* 胶囊样式圆角 */
    /* 水平/垂直内边距比 ≈ 1.6，接近黄金比例 */
    --lg-padding: 5px 8px;
    --lg-blur: 12px;
    --lg-saturate: 140%;
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 2px 12px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  .lg-glass:hover,
  .lg-glass:focus-within {
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  .lg-navbar-glass .lg-glass:hover,
  .lg-navbar-glass .lg-glass:focus-within {
    background: rgba(255, 255, 255, 0.2);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }

  /* SVG filter application */
  .lg-glass.with-filter {
    filter: url(#lg-filter);
  }

  /* Border glow effect - using real border for better corner rendering */
  .lg-border {
    position: absolute;
    inset: 0;
    border-radius: inherit !important;
    border: 1px solid transparent;
    background: linear-gradient(
      var(--lg-border-angle, 135deg),
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.5) calc(var(--lg-border-pos, 50%) - 20%),
      rgba(255, 255, 255, 0.6) var(--lg-border-pos, 50%),
      rgba(255, 255, 255, 0.5) calc(var(--lg-border-pos, 50%) + 20%),
      rgba(255, 255, 255, 0.2) 100%
    ) border-box;
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    transition: background 0.3s ease;
  }

  /* Navbar button border - more subtle */
  .lg-navbar-glass .lg-border {
    background: linear-gradient(
      var(--lg-border-angle, 135deg),
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.35) calc(var(--lg-border-pos, 50%) - 15%),
      rgba(255, 255, 255, 0.45) var(--lg-border-pos, 50%),
      rgba(255, 255, 255, 0.35) calc(var(--lg-border-pos, 50%) + 15%),
      rgba(255, 255, 255, 0.15) 100%
    ) border-box;
  }

  /* Shine/reflection effect */
  .lg-shine {
    position: absolute;
    inset: 0;
    border-radius: var(--lg-radius, 12px);
    background: radial-gradient(
      circle at var(--lg-shine-x, 50%) var(--lg-shine-y, 0%),
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.1) 30%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  /* Navbar button shine - more subtle */
  .lg-navbar-glass .lg-shine {
    background: radial-gradient(
      circle at var(--lg-shine-x, 50%) var(--lg-shine-y, 0%),
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.08) 25%,
      transparent 60%
    );
  }

  .lg-glass:hover .lg-shine,
  .lg-glass:focus-within .lg-shine {
    opacity: 1;
  }

  /* Content wrapper */
  .lg-content {
    position: relative;
    z-index: 1;
    color: inherit;
    text-decoration: none !important;
    display: inline;
  }

  /* Reset all spacing for elements inside glass */
  .lg-glass .nav-link,
  .lg-glass a {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Hide original SVG */
  .lg-svg-defs {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  /* 触屏设备没有鼠标跟随效果，降低模糊与混合开销 */
  @media (hover: none) {
    .lg-navbar-glass {
      backdrop-filter: blur(12px) saturate(140%) !important;
      -webkit-backdrop-filter: blur(12px) saturate(140%) !important;
    }
  }

  /* 用户偏好减少动态效果时关闭过渡动画 */
  @media (prefers-reduced-motion: reduce) {
    .lg-navbar-glass,
    .lg-glass,
    .lg-shine,
    .lg-navbar-shine {
      transition: none !important;
    }
  }
</style>`;

const svgDefs = config.useSVGFilter ? `
<!-- SVG Filter Definition -->
<svg class="lg-svg-defs" aria-hidden="true">
  <defs>
    <filter id="lg-filter" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <!-- Create displacement map -->
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" seed="0"/>
      <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="coloredNoise"/>

      <!-- Red channel displacement -->
      <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale="3" xChannelSelector="R" yChannelSelector="G" result="red-displaced"/>
      <feColorMatrix in="red-displaced" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-channel"/>

      <!-- Green channel displacement (slightly different) -->
      <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale="2.5" xChannelSelector="G" yChannelSelector="B" result="green-displaced"/>
      <feColorMatrix in="green-displaced" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green-channel"/>

      <!-- Blue channel displacement (more offset) -->
      <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale="2" xChannelSelector="B" yChannelSelector="R" result="blue-displaced"/>
      <feColorMatrix in="blue-displaced" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-channel"/>

      <!-- Combine channels with screen blend -->
      <feBlend in="green-channel" in2="blue-channel" mode="screen" result="gb-blend"/>
      <feBlend in="red-channel" in2="gb-blend" mode="screen" result="rgb-blend"/>

      <!-- Apply slight blur -->
      <feGaussianBlur in="rgb-blend" stdDeviation="0.3" result="blended"/>

      <!-- 用噪点亮度生成遮罩，让色散只在局部显露 -->
      <feColorMatrix in="coloredNoise" type="luminanceToAlpha" result="mask"/>
      <feComponentTransfer in="mask" result="mask-adjusted">
        <feFuncA type="linear" slope="3" intercept="-0.5"/>
      </feComponentTransfer>

      <!-- Blend original with chromatic aberration at masked areas -->
      <feComposite in="blended" in2="mask-adjusted" operator="in" result="aberration"/>
      <feComposite in="SourceGraphic" in2="aberration" operator="over"/>
    </filter>
  </defs>
</svg>` : '';

const script = `
<script>
(function() {
  'use strict';

  if (window.liquidGlassTopbarInit) return;
  window.liquidGlassTopbarInit = true;

  const CONFIG = ${JSON.stringify(config)};

  class LiquidGlassTopbar {
    constructor(options = {}) {
      this.config = {
        elasticity: options.elasticity ?? 0.12,
        activationZone: options.activationZone ?? 100,
        useSVGFilter: options.useSVGFilter ?? false,
        targetSelector: options.targetSelector ?? null,
        navbarSelector: options.navbarSelector ?? 'nav.navbar'
      };

      this.elements = [];
      this.navbarElement = null;
      this.mouseX = 0;
      this.mouseY = 0;
      this.rafPending = false;
      // 纯装饰效果：触屏设备或用户偏好减少动态时，跳过鼠标跟随逻辑
      this.trackPointer = window.matchMedia('(hover: hover)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.init();
    }

    init() {
      this.applyToNavbar();
      this.applyToElements();
      this.setupEventListeners();
    }

    applyToNavbar() {
      // Find navbar and apply glass effect to the container
      const navbar = document.querySelector(this.config.navbarSelector);

      if (!navbar || navbar.hasAttribute('data-lg-navbar-processed')) return;

      navbar.setAttribute('data-lg-navbar-processed', 'true');
      navbar.classList.add('lg-navbar-glass');

      const shine = document.createElement('div');
      shine.className = 'lg-navbar-shine';
      navbar.appendChild(shine);

      this.navbarElement = { element: navbar, shine };
    }

    applyToElements() {
      // Fluid 的导航项（含 dropdown-toggle，它同样带 .nav-link）都在 nav.navbar 内
      const selectors = this.config.targetSelector
        ? [this.config.targetSelector]
        : ['nav.navbar .nav-link'];

      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            this.wrapElement(el);
          });
        } catch (e) {
          console.warn('LiquidGlass: Invalid selector', selector);
        }
      });
    }

    wrapElement(element) {
      // Skip if already processed
      if (element.hasAttribute('data-lg-wrapped')) return;

      // Skip certain elements
      if (element.classList.contains('dropdown-menu') ||
          element.classList.contains('dropdown-divider') ||
          element.tagName === 'FORM' ||
          element.querySelector('.dropdown-menu')) {
        return;
      }

      element.setAttribute('data-lg-wrapped', 'true');

      const container = document.createElement('div');
      container.className = 'lg-container';

      const glass = document.createElement('div');
      glass.className = 'lg-glass';
      if (this.config.useSVGFilter) {
        glass.classList.add('with-filter');
      }

      const border = document.createElement('div');
      border.className = 'lg-border';
      glass.appendChild(border);

      const shine = document.createElement('div');
      shine.className = 'lg-shine';
      glass.appendChild(shine);

      const content = document.createElement('span');
      content.className = 'lg-content';

      element.parentNode.insertBefore(container, element);
      glass.appendChild(content);
      content.appendChild(element);
      container.appendChild(glass);

      this.elements.push({ container, glass, border, shine, element });
    }

    setupEventListeners() {
      if (this.trackPointer) {
        document.addEventListener('mousemove', (e) => {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;

          // 一帧内只调度一次，避免多次 mousemove 排队重复执行
          if (this.rafPending) return;
          this.rafPending = true;
          requestAnimationFrame(() => {
            this.rafPending = false;
            this.updateEffects();
          });
        });
      }

      // Scroll detection for navbar shape transformation
      window.addEventListener('scroll', () => {
        this.handleScroll();
      }, { passive: true });

      // Initial check（页面刷新时可能已经停在滚动位置）
      this.handleScroll();
    }

    handleScroll() {
      if (!this.navbarElement) return;

      const navbar = this.navbarElement.element;
      const scrolled = window.scrollY > 50;

      // 形态没变化时不做任何 DOM 写入；胶囊圆角由 CSS（999px 自动钳制）完成
      if (scrolled === navbar.classList.contains('lg-scrolled')) return;
      navbar.classList.toggle('lg-scrolled', scrolled);
    }

    updateEffects() {
      if (!this.trackPointer) return;

      // 先批量读完所有位置，再统一写入，避免读写交错反复触发重排
      const navbarEntry = this.navbarElement;
      const navbarRect = navbarEntry ? navbarEntry.element.getBoundingClientRect() : null;
      const rects = this.elements.map(({ glass }) => glass.getBoundingClientRect());

      // Update navbar shine
      if (navbarEntry) {
        const shineX = ((this.mouseX - navbarRect.left) / navbarRect.width) * 100;
        navbarEntry.shine.style.setProperty('--lg-shine-x', shineX + '%');
      }

      // Update individual element effects
      this.elements.forEach(({ glass, border, shine }, index) => {
        const rect = rects[index];

        // Mouse relative position
        const relX = ((this.mouseX - rect.left) / rect.width) * 100;
        const relY = ((this.mouseY - rect.top) / rect.height) * 100;

        // Update shine position
        shine.style.setProperty('--lg-shine-x', relX + '%');
        shine.style.setProperty('--lg-shine-y', relY + '%');

        // Calculate center position
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = this.mouseX - centerX;
        const deltaY = this.mouseY - centerY;

        // Distance from element edges
        const edgeDistanceX = Math.max(0, Math.abs(deltaX) - rect.width / 2);
        const edgeDistanceY = Math.max(0, Math.abs(deltaY) - rect.height / 2);
        const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY);

        // Fade in factor based on proximity
        const fadeInFactor = Math.max(0, 1 - edgeDistance / this.config.activationZone);

        if (fadeInFactor > 0) {
          // Elastic movement
          const moveX = deltaX * this.config.elasticity * 0.08 * fadeInFactor;
          const moveY = deltaY * this.config.elasticity * 0.08 * fadeInFactor;

          // Subtle scaling
          const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const stretchIntensity = Math.min(dist / 300, 1) * fadeInFactor;
          const scale = 1 + stretchIntensity * 0.05;

          // Apply transform
          glass.style.transform = 'translate(' + moveX.toFixed(2) + 'px, ' + moveY.toFixed(2) + 'px) scale(' + scale.toFixed(3) + ')';

          // Update border gradient
          const angle = 135 + deltaX * 0.3;
          const pos = 50 + deltaY * 0.2;
          border.style.setProperty('--lg-border-angle', angle + 'deg');
          border.style.setProperty('--lg-border-pos', Math.max(0, Math.min(100, pos)) + '%');
        } else if (glass.style.transform) {
          glass.style.transform = '';
        }
      });
    }
  }

  // Initialize
  function initLiquidGlass() {
    if (window.liquidGlassTopbar) return;
    window.liquidGlassTopbar = new LiquidGlassTopbar(CONFIG);
  }

  // Wait for DOM（脚本注入在 body 末尾，导航栏此时必然已解析完成）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass);
  } else {
    initLiquidGlass();
  }

})();
<\/script>`;

// 样式放 head：导航栏在页面顶部，避免解析到 body 末尾前先闪一下无玻璃样式的状态；
// 脚本与（可选的）SVG 滤镜放 body 末尾执行。
hexo.extend.injector.register('head_begin', style, 'default');
hexo.extend.injector.register('body_end', svgDefs + script, 'default');
