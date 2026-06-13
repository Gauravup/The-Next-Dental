/* ==========================================================================
   INTERACTIVE JAVASCRIPT - NEXT GEN DENTAL CARE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Lucide SVG Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* --------------------------------------------------------
     1. Custom Cursor Glow Tracking
     -------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      // Smooth coordinate mapping using requestAnimationFrame is handled implicitly by browser 
      // but translate3d improves GPU layering
      cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    });
  }

  /* --------------------------------------------------------
     2. Mobile Toggle Menu & Navbar Scrolling
     -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu drawer
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Handle header background style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  });

  // Smooth scroll to sections with offset
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      
      // If it's a dummy link like '#'
      if (targetId === '#') return;
      
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Calculate header height offset dynamically
        const offset = navbar.classList.contains('scrolled') ? 60 : 80;
        const targetPosition = targetSection.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile drawer if active
        if (mobileToggle) {
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      }
    });
  });

  // Highlight active link corresponding to visible section (ScrollSpy)
  const sections = document.querySelectorAll('section, footer');
  
  function highlightNavOnScroll() {
    let scrollPos = window.scrollY + 120; // offset buffer
    
    sections.forEach(section => {
      if (section.id) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${section.id}`) {
              link.classList.add('active');
            }
          });
        }
      }
    });
  }

  /* --------------------------------------------------------
     3. Hero Carousel Slider (Clip-Path wiping effect)
     -------------------------------------------------------- */
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlideIndex = 0;
  let carouselInterval = null;
  const slideDuration = 6000; // 6 seconds auto-rotate

  function changeSlide(targetIndex) {
    // Stop autoplay timer temporarily
    resetAutoplay();

    // Deactivate current slide
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    // Update index boundary check
    if (targetIndex >= slides.length) {
      currentSlideIndex = 0;
    } else if (targetIndex < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = targetIndex;
    }

    // Activate next slide
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Restart autoplay
    startAutoplay();
  }

  function startAutoplay() {
    carouselInterval = setInterval(() => {
      changeSlide(currentSlideIndex + 1);
    }, slideDuration);
  }

  function resetAutoplay() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
    }
  }

  // Prev / Next button handlers
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => changeSlide(currentSlideIndex - 1));
    nextBtn.addEventListener('click', () => changeSlide(currentSlideIndex + 1));
  }

  // Clickable Pagination Dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => changeSlide(index));
  });

  // Start Carousel autoplay on load
  if (slides.length > 0) {
    startAutoplay();
  }

  /* --------------------------------------------------------
     4. Business Offerings: 3D Tilt Card Effects
     -------------------------------------------------------- */
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside element
      const y = e.clientY - rect.top;  // y position inside element
      
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      
      const centerX = cardWidth / 2;
      const centerY = cardHeight / 2;
      
      // Calculate tilt angles (scale tilt down for subtle professional effect)
      const tiltX = (centerY - y) / 12; // tilt amount in degrees
      const tiltY = (x - centerX) / 12;
      
      // Transform card with rotate values and shadow adjustment
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
      card.style.boxShadow = `0 15px 35px rgba(34, 197, 94, 0.25)`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Return card smoothly back to default
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      card.style.boxShadow = ``;
    });
  });

  /* --------------------------------------------------------
     5. Why Choose Us: Mouse Tracking Glow
     -------------------------------------------------------- */
  const chooseCards = document.querySelectorAll('.choose-glow-card');
  
  chooseCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Set CSS variables for pointer coordinates dynamically
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* --------------------------------------------------------
     6. Count-Up Animation (Scroll Observer)
     -------------------------------------------------------- */
  const counterCards = document.querySelectorAll('.scroll-reveal-counter');
  
  const animateCounter = (card) => {
    const numberEl = card.querySelector('.counter-number');
    if (!numberEl || numberEl.classList.contains('counted')) return;
    
    numberEl.classList.add('counted');
    const targetVal = parseFloat(numberEl.getAttribute('data-target'));
    const decimalPlaces = parseInt(numberEl.getAttribute('data-decimals')) || 0;
    
    const countDuration = 2500; // 2.5 seconds count timer
    const startTime = performance.now();
    
    const countStep = (timeNow) => {
      const timeElapsed = timeNow - startTime;
      const progressRatio = Math.min(timeElapsed / countDuration, 1);
      
      // Ease out cubic
      const easeVal = 1 - Math.pow(1 - progressRatio, 3);
      const currentVal = easeVal * targetVal;
      
      numberEl.textContent = currentVal.toFixed(decimalPlaces);
      
      if (progressRatio < 1) {
        requestAnimationFrame(countStep);
      } else {
        numberEl.textContent = targetVal.toFixed(decimalPlaces);
      }
    };
    
    requestAnimationFrame(countStep);
  };

  // Setup intersection observer to fire counters when visible
  if ('IntersectionObserver' in window && counterCards.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15, // trigger when 15% visible
      rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // trigger only once
        }
      });
    }, observerOptions);
    
    counterCards.forEach(card => counterObserver.observe(card));
  } else {
    // Fallback: animate all counters instantly if browser lacks observer
    counterCards.forEach(card => animateCounter(card));
  }

  /* --------------------------------------------------------
     7. Dummy Testimonials Slide Controller
     -------------------------------------------------------- */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.t-dot');
  let currentTestimonial = 0;
  let testimonialTimer = null;

  function showTestimonial(index) {
    // Remove active classes
    testimonialCards[currentTestimonial].classList.remove('active');
    testimonialDots[currentTestimonial].classList.remove('active');

    // Update index wrap
    if (index >= testimonialCards.length) {
      currentTestimonial = 0;
    } else if (index < 0) {
      currentTestimonial = testimonialCards.length - 1;
    } else {
      currentTestimonial = index;
    }

    // Set new active classes
    testimonialCards[currentTestimonial].classList.add('active');
    testimonialDots[currentTestimonial].classList.add('active');
  }

  // Dot click handlers
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      resetTestimonialTimer();
      showTestimonial(index);
      startTestimonialTimer();
    });
  });

  // Autoplay testimonials every 8 seconds
  function startTestimonialTimer() {
    testimonialTimer = setInterval(() => {
      showTestimonial(currentTestimonial + 1);
    }, 8000);
  }

  function resetTestimonialTimer() {
    if (testimonialTimer) {
      clearInterval(testimonialTimer);
    }
  }

  if (testimonialCards.length > 0) {
    startTestimonialTimer();
  }

  /* --------------------------------------------------------
     8. Interactive FAQ Accordion Panels
     -------------------------------------------------------- */
  const faqAccordionItems = document.querySelectorAll('.faq-accordion-item');
  
  faqAccordionItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other accordion panels
        faqAccordionItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current accordion panel
        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* --------------------------------------------------------
     9. Appointment Booking Form Handler & Validation
     -------------------------------------------------------- */
  const bookingForm = document.getElementById('appointment-booking-form');
  const bookingSuccessMsg = document.getElementById('form-success-msg');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Select input items
      const nameInput = document.getElementById('booking-name');
      const phoneInput = document.getElementById('booking-phone');
      const emailInput = document.getElementById('booking-email');
      const serviceSelect = document.getElementById('booking-service');
      const consentCheck = document.getElementById('booking-consent');
      
      let isFormValid = true;
      
      // Helper function to show/hide validation errors
      const validateInput = (input, condition) => {
        const parent = input.closest('.form-group') || input.closest('.form-consent');
        if (condition) {
          parent.classList.remove('invalid');
        } else {
          parent.classList.add('invalid');
          isFormValid = false;
        }
      };

      // 1. Validate Name
      validateInput(nameInput, nameInput.value.trim().length > 0);
      
      // 2. Validate Phone (numeric length validation)
      const phoneCleanRegex = /^\d{10,12}$/;
      const digitsOnly = phoneInput.value.replace(/\D/g, '');
      validateInput(phoneInput, phoneCleanRegex.test(digitsOnly));
      
      // 3. Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateInput(emailInput, emailRegex.test(emailInput.value.trim()));
      
      // 4. Validate Service Selection
      validateInput(serviceSelect, serviceSelect.value !== "");
      
      // 5. Validate Consent Checkbox
      validateInput(consentCheck, consentCheck.checked);

      // If form fields check out, start submit animation
      if (isFormValid) {
        bookingForm.classList.add('submitting');
        
        // Disable submission button
        const submitBtn = document.getElementById('booking-submit-btn');
        submitBtn.disabled = true;
        
        // Simulate network API request post (1.5 seconds delay)
        setTimeout(() => {
          // Remove loading animations
          bookingForm.classList.remove('submitting');
          
          // Reveal success screen overlay inside card container
          if (bookingSuccessMsg) {
            bookingSuccessMsg.classList.add('show');
          }
          
          // Clear all fields
          bookingForm.reset();
        }, 1800);
      }
    });

    // Remove invalid validation classes when user starts modifying fields
    const fields = bookingForm.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      field.addEventListener('input', () => {
        const parent = field.closest('.form-group') || field.closest('.form-consent');
        parent.classList.remove('invalid');
      });
      field.addEventListener('change', () => {
        const parent = field.closest('.form-group') || field.closest('.form-consent');
        parent.classList.remove('invalid');
      });
    });
  }
});
