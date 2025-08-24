// =====================================
// AZLAN'S PORTFOLIO JAVASCRIPT
// Enhanced with Horizontal Scrolling
// =====================================

class AzlanPortfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupHorizontalScrolling();
    this.setupSmoothScrolling();
  }

  // Event Listeners
  setupEventListeners() {
    // Navigation click handling
    document.addEventListener('click', this.handleNavigation.bind(this));
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
    
    // Portfolio navigation
    this.setupPortfolioNavigation();
    
    // Testimonials navigation
    this.setupTestimonialsNavigation();
    
    // CHANGE START: Added call for services navigation
    this.setupServicesNavigation();
    // CHANGE END
  }

  // Smooth scrolling setup
  setupSmoothScrolling() {
    // Only add smooth scrolling if user doesn't prefer reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  // Intersection Observer for animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all fade-in sections
    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });
  }

  // Handle navigation clicks
  handleNavigation(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    
    event.preventDefault();
    
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Update focus for accessibility
      targetElement.focus({ preventScroll: true });
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  }

  // Handle keyboard navigation
  handleKeyboard(event) {
    // Handle Escape key to reset any focused elements
    if (event.key === 'Escape') {
      document.activeElement.blur();
    }
    
    // Handle arrow keys for horizontal scrolling when focused on scroll containers
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const focusedElement = document.activeElement;
      // CHANGE START: Added .services-scroll to the selector
      const scrollContainer = focusedElement.closest('.portfolio-scroll, .testimonials-scroll, .services-scroll');
      // CHANGE END
      
      if (scrollContainer) {
        event.preventDefault();
        const scrollAmount = 320; // Approximate item width + gap
        
        if (event.key === 'ArrowLeft') {
          scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else if (event.key === 'ArrowRight') {
          scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  }

  // Setup horizontal scrolling functionality
  setupHorizontalScrolling() {
    // Add touch/mouse drag scrolling for better mobile experience
    // CHANGE START: Added .services-scroll to the selector
    this.addDragScrolling('.portfolio-scroll, .testimonials-scroll, .services-scroll');
    // CHANGE END
    
    // Add scroll indicators
    this.addScrollIndicators();
  }

  // Add drag scrolling functionality
  addDragScrolling(selector) {
    const containers = document.querySelectorAll(selector);
    
    containers.forEach(container => {
      let isDown = false;
      let startX;
      let scrollLeft;
      
      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });
      
      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });
      
      container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });
      
      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });
      
      // Set initial cursor
      container.style.cursor = 'grab';
    });
  }

  // Add scroll indicators
  addScrollIndicators() {
    // CHANGE START: Added .services-scroll to the selector
    const scrollContainers = document.querySelectorAll('.portfolio-scroll, .testimonials-scroll, .services-scroll');
    // CHANGE END
    
    scrollContainers.forEach(container => {
      const updateIndicators = () => {
        const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
        container.style.setProperty('--scroll-percentage', `${scrollPercentage}%`);
      };
      
      container.addEventListener('scroll', updateIndicators);
      updateIndicators(); // Initial call
    });
  }

  // Setup portfolio navigation
  setupPortfolioNavigation() {
    const portfolioContainer = document.querySelector('.portfolio-scroll');
    const prevBtn = document.querySelector('.portfolio-nav .nav-prev');
    const nextBtn = document.querySelector('.portfolio-nav .nav-next');
    
    if (!portfolioContainer || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 420; // Item width + gap
    
    prevBtn.addEventListener('click', () => {
      portfolioContainer.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      });
    });
    
    nextBtn.addEventListener('click', () => {
      portfolioContainer.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    });
    
    // Update button states based on scroll position
    const updateNavButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = portfolioContainer;
      
      prevBtn.disabled = scrollLeft <= 0;
      nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
      
      // Update button opacity
      prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    };
    
    portfolioContainer.addEventListener('scroll', updateNavButtons);
    updateNavButtons(); // Initial call
  }

  // Setup testimonials navigation
  setupTestimonialsNavigation() {
    const testimonialsContainer = document.querySelector('.testimonials-scroll');
    const prevBtn = document.querySelector('.testimonials-nav .nav-prev');
    const nextBtn = document.querySelector('.testimonials-nav .nav-next');
    
    if (!testimonialsContainer || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 320 + 24; // Item width + gap
    
    prevBtn.addEventListener('click', () => {
      testimonialsContainer.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      });
    });
    
    nextBtn.addEventListener('click', () => {
      testimonialsContainer.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    });
    
    // Update button states based on scroll position
    const updateNavButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = testimonialsContainer;
      
      prevBtn.disabled = scrollLeft <= 0;
      nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
      
      // Update button opacity
      prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    };
    
    testimonialsContainer.addEventListener('scroll', updateNavButtons);
    updateNavButtons(); // Initial call
  }

  // CHANGE START: Added navigation function for the new services section
  setupServicesNavigation() {
    const servicesContainer = document.querySelector('.services-scroll');
    const prevBtn = document.querySelector('.services-nav .nav-prev');
    const nextBtn = document.querySelector('.services-nav .nav-next');
    
    if (!servicesContainer || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 320 + 24; // Item width + gap
    
    prevBtn.addEventListener('click', () => {
      servicesContainer.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      });
    });
    
    nextBtn.addEventListener('click', () => {
      servicesContainer.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    });
    
    // Update button states based on scroll position
    const updateNavButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = servicesContainer;
      
      prevBtn.disabled = scrollLeft <= 0;
      nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
      
      // Update button opacity
      prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    };
    
    servicesContainer.addEventListener('scroll', updateNavButtons);
    updateNavButtons(); // Initial call
  }
  // CHANGE END

  // Utility method for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new AzlanPortfolio();
});

// Handle focus management for accessibility
document.addEventListener('DOMContentLoaded', () => {
  // Ensure proper focus management for skip link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#main');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  }
  
  // Add keyboard navigation hints
  // CHANGE START: Added .services-scroll to the selector
  const scrollContainers = document.querySelectorAll('.portfolio-scroll, .testimonials-scroll, .services-scroll');
  // CHANGE END
  scrollContainers.forEach(container => {
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Horizontally scrollable content. Use arrow keys to scroll.');
  });
});

// Service Worker registration (optional for PWA features)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AzlanPortfolio;
}
