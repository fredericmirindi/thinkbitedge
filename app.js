// ThinkBit Edge Corp - Interactive Functionality
class ThinkBitEdgeApp {
  constructor() {
    this.currentSection = 'home';
    this.mobileMenuOpen = false;
    this.theme = localStorage.getItem('theme') || 'light';
    this.countersAnimated = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTheme();
    this.setupIntersectionObserver();
    this.setupFormHandlers();
    this.preloadImages();
    this.setupScrollAnimations();
    
    // Initialize with home section
    this.showSection('home');
  }

  setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('href').substring(1);
        this.showSection(targetSection);
        this.updateActiveNavLink(link);
        this.closeMobileMenu();
      });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // CTA buttons and internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('href').substring(1);
        if (targetSection && document.getElementById(targetSection)) {
          this.showSection(targetSection);
          this.updateActiveNavLink(document.querySelector(`[href="#${targetSection}"]`));
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const nav = document.getElementById('nav');
      const toggle = document.getElementById('mobile-menu-toggle');
      
      if (this.mobileMenuOpen && !nav.contains(e.target) && !toggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.showSection(targetId);
          this.updateActiveNavLink(document.querySelector(`[href="#${targetId}"]`));
        }
      }
    });
  }

  setupTheme() {
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeIcon();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    this.updateThemeIcon();
    
    // Add animation effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-toggle__icon');
    if (themeIcon) {
      themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('mobile-menu-toggle');
    
    if (this.mobileMenuOpen) {
      nav.classList.add('nav--open');
      toggle.classList.add('mobile-menu-toggle--open');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      nav.classList.remove('nav--open');
      toggle.classList.remove('mobile-menu-toggle--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  closeMobileMenu() {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      const nav = document.getElementById('nav');
      const toggle = document.getElementById('mobile-menu-toggle');
      
      nav.classList.remove('nav--open');
      toggle.classList.remove('mobile-menu-toggle--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('section--active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('section--active');
      this.currentSection = sectionId;
      
      // Update page title
      this.updatePageTitle(sectionId);
      
      // Animate counters if showing impact section or about section
      if ((sectionId === 'impact' || sectionId === 'about') && !this.countersAnimated) {
        this.animateCounters();
        this.countersAnimated = true;
      }
      
      // Reset counter animation for home section
      if (sectionId === 'home') {
        this.animateCounters();
      }
      
      // Trigger scroll animations for the new section
      this.triggerSectionAnimations(sectionId);
      
      // Scroll to top of section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  updatePageTitle(sectionId) {
    const titles = {
      'home': 'ThinkBit Edge Corp - Empowering Youth Through Technology',
      'about': 'About Us - ThinkBit Edge Corp',
      'programs': 'Our Programs - ThinkBit Edge Corp',
      'impact': 'Our Impact - ThinkBit Edge Corp',
      'get-involved': 'Get Involved - ThinkBit Edge Corp',
      'contact': 'Contact Us - ThinkBit Edge Corp'
    };
    
    document.title = titles[sectionId] || titles['home'];
  }

  updateActiveNavLink(clickedLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav__link').forEach(link => {
      link.classList.remove('nav__link--active');
    });
    
    // Add active class to clicked link
    if (clickedLink) {
      clickedLink.classList.add('nav__link--active');
    }
  }

  setupIntersectionObserver() {
    // Animate elements when they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Special handling for timeline items
          if (entry.target.classList.contains('timeline__item')) {
            entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200}ms`;
            entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
          }
        }
      });
    }, observerOptions);

    // Observe cards and other elements for animation
    document.querySelectorAll(`
      .program-card, 
      .metric, 
      .story-card, 
      .involvement-card, 
      .value-card, 
      .team-member,
      .mission-vision__item,
      .timeline__item,
      .impact-stat
    `).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  setupScrollAnimations() {
    // Add CSS animations for timeline
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  triggerSectionAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Reset and trigger animations for elements in the current section
    const animatedElements = section.querySelectorAll(`
      .program-card, 
      .metric, 
      .story-card, 
      .involvement-card, 
      .value-card, 
      .team-member,
      .mission-vision__item,
      .timeline__item,
      .impact-stat
    `);

    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  animateCounters() {
    const counters = document.querySelectorAll('.metric__number[data-target], .impact-stat__number');
    
    counters.forEach(counter => {
      const targetText = counter.getAttribute('data-target');
      if (!targetText) return;
      
      const target = parseInt(targetText);
      if (isNaN(target)) return;
      
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60 FPS
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      
      // Reset counter
      counter.textContent = '0';
      
      // Start animation with a slight delay
      setTimeout(() => {
        updateCounter();
      }, Math.random() * 200);
    });
  }

  setupFormHandlers() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter__form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmit(e.target);
      });
    }

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactSubmit(e.target);
      });
    }

    // Program application buttons
    document.querySelectorAll('.btn').forEach(btn => {
      if (btn.textContent.includes('Apply Now')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleProgramApplication(btn);
        });
      }
    });

    // Volunteer and donation buttons
    document.querySelectorAll('.btn').forEach(btn => {
      if (btn.textContent.includes('Volunteer Now')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleVolunteerSignup(btn);
        });
      }
      if (btn.textContent.includes('Donate')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleDonation(btn);
        });
      }
      if (btn.textContent.includes('Partner With Us')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handlePartnership(btn);
        });
      }
    });

    // Enhanced form validation
    document.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('blur', (e) => {
        this.validateField(e.target);
      });
      
      input.addEventListener('input', (e) => {
        this.clearFieldError(e.target);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styles
    field.classList.remove('form-control--error');
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !this.validateEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('form-control--error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('form-control--error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  handleNewsletterSubmit(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (this.validateEmail(email)) {
      // Show success message
      this.showNotification('Thank you for subscribing! You\'ll receive updates about our programs and impact.', 'success');
      
      // Reset form
      form.reset();
      
      // Simulate API call
      console.log('Newsletter subscription:', { email, timestamp: new Date().toISOString() });
    } else {
      this.showNotification('Please enter a valid email address.', 'error');
    }
  }

  handleContactSubmit(form) {
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') || form.querySelector('#name').value,
      email: formData.get('email') || form.querySelector('#email').value,
      subject: formData.get('subject') || form.querySelector('#subject').value,
      message: formData.get('message') || form.querySelector('#message').value
    };
    
    // Validate all fields
    let isValid = true;
    Object.keys(data).forEach(key => {
      if (!data[key]) {
        const field = form.querySelector(`#${key}`);
        if (field) {
          this.showFieldError(field, 'This field is required');
          isValid = false;
        }
      }
    });
    
    if (!this.validateEmail(data.email)) {
      const emailField = form.querySelector('#email');
      this.showFieldError(emailField, 'Please enter a valid email address');
      isValid = false;
    }
    
    if (!isValid) {
      this.showNotification('Please correct the errors in the form.', 'error');
      return;
    }
    
    // Show success message
    this.showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
    
    // Reset form
    form.reset();
    
    // Clear any remaining errors
    form.querySelectorAll('.form-control').forEach(field => {
      this.clearFieldError(field);
    });
    
    // Simulate API call
    console.log('Contact form submission:', { ...data, timestamp: new Date().toISOString() });
  }

  handleProgramApplication(btn) {
    const programElement = btn.closest('.program-detail, .program-card');
    const programName = programElement ? programElement.querySelector('h3, h4').textContent : 'Program';
    
    // Show modal or redirect to application
    this.showNotification(`Thank you for your interest in ${programName}! Our admissions team will contact you with application details.`, 'info');
    
    // Simulate tracking
    console.log('Program application interest:', { 
      program: programName, 
      timestamp: new Date().toISOString() 
    });
  }

  handleVolunteerSignup(btn) {
    this.showNotification('Thank you for your interest in volunteering! We\'ll contact you soon with opportunities that match your skills and availability.', 'success');
    
    // Simulate tracking
    console.log('Volunteer signup:', { timestamp: new Date().toISOString() });
  }

  handleDonation(btn) {
    this.showNotification('Thank you for your generosity! You\'ll be redirected to our secure donation portal.', 'info');
    
    // Simulate tracking
    console.log('Donation click:', { timestamp: new Date().toISOString() });
    
    // In a real application, this would redirect to a payment processor
    setTimeout(() => {
      this.showNotification('Donation portal will be available soon. Please contact us directly for donation opportunities.', 'info');
    }, 2000);
  }

  handlePartnership(btn) {
    this.showNotification('Thank you for your interest in partnering with us! Our partnerships team will reach out to discuss collaboration opportunities.', 'success');
    
    // Simulate tracking
    console.log('Partnership inquiry:', { timestamp: new Date().toISOString() });
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__message">${message}</span>
        <button class="notification__close" aria-label="Close notification">×</button>
      </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'notification-styles';
      styleSheet.textContent = `
        .notification {
          position: fixed;
          top: 100px;
          right: 20px;
          max-width: 400px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 1001;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        
        .notification--success {
          border-left: 4px solid var(--color-success);
        }
        
        .notification--error {
          border-left: 4px solid var(--color-error);
        }
        
        .notification--info {
          border-left: 4px solid var(--color-info);
        }
        
        .notification--warning {
          border-left: 4px solid var(--color-warning);
        }
        
        .notification__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-16);
          gap: var(--space-12);
        }
        
        .notification__message {
          color: var(--color-text);
          font-size: var(--font-size-sm);
          line-height: var(--line-height-normal);
        }
        
        .notification__close {
          background: none;
          border: none;
          font-size: var(--font-size-lg);
          cursor: pointer;
          color: var(--color-text-secondary);
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: background-color 0.15s ease;
        }
        
        .notification__close:hover {
          background: var(--color-secondary);
        }
        
        .form-control--error {
          border-color: var(--color-error);
        }
        
        .field-error {
          color: var(--color-error);
          font-size: var(--font-size-sm);
          margin-top: var(--space-4);
        }
      `;
      document.head.appendChild(styleSheet);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
      this.closeNotification(notification);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        this.closeNotification(notification);
      }
    }, 5000);
  }

  closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }

  preloadImages() {
    // Preload hero and key images for better performance
    const imageUrls = [
      'https://pplx-res.cloudinary.com/image/upload/v1748566599/pplx_project_search_images/0c4db760b5ac87d22622fbbaa1e657b94ce4ddad.jpg',
      'https://pplx-res.cloudinary.com/image/upload/v1751646831/pplx_project_search_images/d615d47387d8369e4f5fcc74ee565decb6e33a70.jpg',
      'https://pplx-res.cloudinary.com/image/upload/v1751646831/pplx_project_search_images/10f68dcc9362263fc06491c4293e6969d832423a.jpg'
    ];
    
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  // Progressive Web App functionality
  setupPWA() {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button
      this.showInstallPrompt(deferredPrompt);
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      deferredPrompt = null;
    });
  }

  showInstallPrompt(deferredPrompt) {
    // Create install prompt
    const installButton = document.createElement('button');
    installButton.className = 'btn btn--primary install-prompt';
    installButton.textContent = '📱 Install App';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '20px';
    installButton.style.right = '20px';
    installButton.style.zIndex = '1000';
    installButton.style.boxShadow = 'var(--shadow-lg)';
    
    installButton.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            this.showNotification('Thank you for installing ThinkBit Edge! You can now access our app offline.', 'success');
          }
          deferredPrompt = null;
          installButton.remove();
        });
      }
    });
    
    document.body.appendChild(installButton);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (installButton.parentNode) {
        installButton.remove();
      }
    }, 10000);
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('a[href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Focus management for modal-like interactions
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      
      // Section navigation with arrow keys
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        this.navigateSections(e.key === 'ArrowRight' ? 'next' : 'prev');
      }
    });

    // Add ARIA labels and roles
    this.enhanceAccessibility();
  }

  enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    document.querySelectorAll('.btn').forEach(btn => {
      if (!btn.getAttribute('aria-label') && btn.textContent) {
        btn.setAttribute('aria-label', btn.textContent.trim());
      }
    });

    // Add role attributes to cards
    document.querySelectorAll('.program-card, .story-card, .involvement-card, .value-card').forEach(card => {
      card.setAttribute('role', 'article');
    });

    // Add navigation landmarks
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
  }

  navigateSections(direction) {
    const sections = ['home', 'about', 'programs', 'impact', 'get-involved', 'contact'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % sections.length;
    } else {
      nextIndex = (currentIndex - 1 + sections.length) % sections.length;
    }
    
    const nextSection = sections[nextIndex];
    this.showSection(nextSection);
    this.updateActiveNavLink(document.querySelector(`[href="#${nextSection}"]`));
    
    // Announce section change for screen readers
    this.announceForScreenReader(`Navigated to ${nextSection} section`);
  }

  announceForScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  handleTabNavigation(e) {
    // Enhanced tab navigation for better accessibility
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    const currentFocus = document.activeElement;
    const focusableArray = Array.from(focusableElements);
    const currentIndex = focusableArray.indexOf(currentFocus);
    
    if (e.shiftKey) {
      // Shift + Tab (backward)
      if (currentIndex === 0) {
        e.preventDefault();
        focusableArray[focusableArray.length - 1].focus();
      }
    } else {
      // Tab (forward)
      if (currentIndex === focusableArray.length - 1) {
        e.preventDefault();
        focusableArray[0].focus();
      }
    }
  }

  // Performance monitoring
  setupPerformanceMonitoring() {
    // Measure page load performance
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
          console.log('DOM content loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
        }
      }
    });

    // Measure JavaScript execution time
    const startTime = performance.now();
    window.addEventListener('load', () => {
      const endTime = performance.now();
      console.log('JavaScript execution time:', endTime - startTime);
    });

    // Monitor section switching performance
    this.originalShowSection = this.showSection;
    this.showSection = (sectionId) => {
      const start = performance.now();
      this.originalShowSection(sectionId);
      const end = performance.now();
      console.log(`Section switch to ${sectionId}:`, end - start, 'ms');
    };
  }

  // Analytics and tracking
  trackEvent(eventName, eventData = {}) {
    // Simulate analytics tracking
    console.log('Analytics Event:', {
      event: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      section: this.currentSection
    });
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new ThinkBitEdgeApp();
  
  // Setup additional features
  app.setupAccessibility();
  app.setupPerformanceMonitoring();
  
  // Setup PWA features if supported
  if ('serviceWorker' in navigator) {
    app.setupPWA();
  }
  
  // Global app reference for debugging
  window.ThinkBitEdgeApp = app;
  
  // Track page load
  app.trackEvent('page_load', {
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  });
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause animations or heavy operations
    console.log('Page hidden, optimizing performance');
  } else {
    // Page is visible, resume operations
    console.log('Page visible, resuming normal operations');
  }
});

// Handle connection status for offline functionality
window.addEventListener('online', () => {
  console.log('Connection restored');
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  document.body.classList.add('offline');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThinkBitEdgeApp;
}