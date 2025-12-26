/**
 * Liquid Glass Effect for Topbar
 * Advanced version with SVG filters for chromatic aberration and refraction
 * Based on liquid-glass-react, adapted for vanilla JS/Hexo
 */

hexo.extend.injector.register('body_end', `
<style>
  /* ========== Liquid Glass for Navbar Container ========== */
  .lg-navbar-wrapper {
    position: relative;
  }

  /* Apply liquid glass effect to navbar itself */
  .lg-navbar-glass {
    /* Don't override position - keep navbar's original sticky/fixed positioning */
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    background: rgba(255, 255, 255, 0.05) !important;

    /* Floating effect with margins */
    margin: 12px auto !important;
    max-width: calc(100% - 24px) !important;

    /* Rounded corners - expanded state */
    border-radius: 16px !important;

    /* Enhanced shadow for floating effect */
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 2px 16px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;

    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* Scrolled state - capsule style */
  .lg-navbar-glass.lg-scrolled {
    margin: 8px auto !important;
    max-width: calc(100% - 16px) !important;
    /* Super long capsule: only left/right corners are rounded */
    border-radius: 50px !important;
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
    transition: opacity 0.3s ease, border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
  .navbar-nav .lg-container,
  .navbar-nav > .lg-container {
    display: inline-flex;
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
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  /* More specific rule for navbar links - golden ratio padding */
  nav .lg-glass,
  .navbar .lg-glass {
    --lg-radius: 10px !important;
    padding: 5px 8px !important;
    --lg-blur: 12px !important;
    --lg-saturate: 140% !important;
  }

  /* Special styles for navbar buttons */
  .lg-navbar-glass .lg-glass {
    --lg-radius: 10px;
    /* Golden ratio: horizontal padding / vertical padding ≈ 1.618 */
    /* 8px / 5px = 1.6 (close to golden ratio φ = 1.618) */
    --lg-padding: 5px 8px;
    --lg-blur: 12px;
    --lg-saturate: 140%;
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 2px 12px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  .lg-navbar-glass .lg-glass:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
    transform: translateY(-1px);
  }

  .lg-glass:hover {
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
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

  .lg-glass:hover .lg-shine {
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

  /* Ensure navbar links display correctly */
  .lg-navbar-glass .lg-content {
    display: inline;
  }

  /* Ensure wrapped elements maintain their styles */
  .lg-content a,
  .lg-content .nav-link {
    display: inline;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Reset all spacing for elements inside glass */
  .lg-glass .nav-link,
  .lg-glass a {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Elastic transform class */
  .lg-elastic {
    transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Hide original SVG */
  .lg-svg-defs {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }
</style>

<!-- SVG Filter Definition -->
<svg class="lg-svg-defs" aria-hidden="true">
  <defs>
    <filter id="lg-filter" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <!-- Create displacement map -->
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" seed="0"/>
      <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" in2="noise" result="coloredNoise"/>

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

      <!-- Create edge mask -->
      <feColorMatrix in="coloredNoise" type="luminanceToAlpha" result="edge-mask"/>
      <feComponentTransfer in="edge-mask" result="edge-mask-adjusted">
        <feFuncA type="linear" slope="3" intercept="-0.5"/>
      </feComponentTransfer>

      <!-- Blend original with chromatic aberration at edges -->
      <feComposite in="blended" in2="edge-mask-adjusted" operator="in" result="edge-aberration"/>
      <feComposite in="SourceGraphic" in2="edge-aberration" operator="over" result="final"/>
    </filter>
  </defs>
</svg>

<script>
(function() {
  'use strict';

  if (window.liquidGlassTopbarInit) return;
  window.liquidGlassTopbarInit = true;

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

      this.init();
    }

    init() {
      this.applyToNavbar();
      this.applyToElements();
      this.setupEventListeners();
      this.observeChanges();
    }

    applyToNavbar() {
      // Find navbar and apply glass effect to the container
      const navbar = document.querySelector(this.config.navbarSelector);

      if (!navbar || navbar.hasAttribute('data-lg-navbar-processed')) return;

      navbar.setAttribute('data-lg-navbar-processed', 'true');

      // Apply glass effect directly to navbar
      navbar.classList.add('lg-navbar-glass');

      // Create shine layer
      const shine = document.createElement('div');
      shine.className = 'lg-navbar-shine';
      navbar.appendChild(shine);

      this.navbarElement = { element: navbar, shine };
    }

    applyToElements() {
      // Target navbar elements - only wrap the links, not list items or brand
      const selectors = this.config.targetSelector
        ? [this.config.targetSelector]
        : [
            'nav.navbar .nav-link',
            'nav .dropdown-toggle',
            '.navbar-nav .nav-link'
          ];

      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            // Apply to all nav links, even inside glass navbar
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

      // Create container
      const container = document.createElement('div');
      container.className = 'lg-container';

      // Create glass
      const glass = document.createElement('div');
      glass.className = 'lg-glass lg-elastic';
      if (this.config.useSVGFilter) {
        glass.classList.add('with-filter');
      }

      // Apply golden ratio padding directly via inline style
      glass.style.padding = '5px 8px';
      glass.style.borderRadius = '20px'; // 胶囊样式圆角

      // Create border
      const border = document.createElement('div');
      border.className = 'lg-border';
      glass.appendChild(border);

      // Create shine
      const shine = document.createElement('div');
      shine.className = 'lg-shine';
      glass.appendChild(shine);

      // Create content wrapper
      const content = document.createElement('span');
      content.className = 'lg-content';

      // Insert into DOM
      element.parentNode.insertBefore(container, element);
      glass.appendChild(content);
      content.appendChild(element);
      container.appendChild(glass);

      // Store reference
      this.elements.push({ container, glass, border, shine, element });
    }

    setupEventListeners() {
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        requestAnimationFrame(() => this.updateEffects());
      });

      // Handle hover state
      document.addEventListener('mouseover', (e) => {
        const glass = e.target.closest('.lg-glass');
        if (glass) {
          glass.style.background = 'rgba(255, 255, 255, 0.15)';
        }
      });

      document.addEventListener('mouseout', (e) => {
        const glass = e.target.closest('.lg-glass');
        if (glass) {
          glass.style.background = '';
        }
      });

      // Scroll detection for navbar shape transformation
      window.addEventListener('scroll', () => {
        this.handleScroll();
      }, { passive: true });

      // 监听窗口尺寸变化，重新计算圆角
      window.addEventListener('resize', () => {
        this.debounceUpdate();
      });

      // Initial check
      this.handleScroll();
    }

    calculateCapsuleRadius() {
      if (!this.navbarElement) return 0;

      const navbar = this.navbarElement.element;
      const rect = navbar.getBoundingClientRect();

      // 获取实际高度（包括内容、padding、border）
      const actualHeight = rect.height;

      // 计算胶囊圆角半径
      // 对于完美的胶囊：圆角半径 = 高度 / 2
      const radius = actualHeight / 2;

      return Math.floor(radius); // 取整避免小数
    }

    handleScroll() {
      if (!this.navbarElement) return;

      const { element: navbar } = this.navbarElement;
      const scrollY = window.scrollY || window.pageYOffset;

      // Add/remove scrolled class based on scroll position
      if (scrollY > 50) {
        navbar.classList.add('lg-scrolled');

        // 动态计算并应用圆角
        const capsuleRadius = this.calculateCapsuleRadius();
        navbar.style.borderRadius = capsuleRadius + 'px';
      } else {
        navbar.classList.remove('lg-scrolled');
        // 展开状态显式设置圆角
        navbar.style.borderRadius = '16px';
      }
    }

    debounceUpdate() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        // 重新计算圆角
        if (this.navbarElement) {
          const navbar = this.navbarElement.element;
          if (navbar.classList.contains('lg-scrolled')) {
            const capsuleRadius = this.calculateCapsuleRadius();
            navbar.style.borderRadius = capsuleRadius + 'px';
          }
        }
      }, 250);
    }

    updateEffects() {
      // Update navbar shine
      if (this.navbarElement) {
        const { element: navbar, shine } = this.navbarElement;
        const rect = navbar.getBoundingClientRect();
        const shineX = ((this.mouseX - rect.left) / rect.width) * 100;

        shine.style.setProperty('--lg-shine-x', shineX + '%');
      }

      // Update individual element effects
      this.elements.forEach(({ glass, border, shine }) => {
        const rect = glass.getBoundingClientRect();

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
        } else {
          glass.style.transform = '';
        }
      });
    }

    observeChanges() {
      const observer = new MutationObserver((mutations) => {
        // Debounce
        clearTimeout(this.observeTimer);
        this.observeTimer = setTimeout(() => {
          this.applyToNavbar();
          this.applyToElements();
        }, 250);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Initialize
  function initLiquidGlass() {
    if (window.liquidGlassTopbar) return;

    window.liquidGlassTopbar = new LiquidGlassTopbar({
      elasticity: 0.06,          // Reduced for more subtle movement
      activationZone: 100,        // Reduced activation range
      useSVGFilter: false,        // Set to true for chromatic aberration effect
      navbarSelector: 'nav.navbar' // Selector for navbar element
    });

    console.log('Liquid Glass Topbar initialized');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass);
  } else {
    initLiquidGlass();
  }

  // Fallback for dynamic content
  setTimeout(initLiquidGlass, 1500);

})();
<\/script>
`, 'default');
