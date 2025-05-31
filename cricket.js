document.addEventListener("DOMContentLoaded", function () {
  // Cricket ball animation
  const balls = document.querySelectorAll(".cricket-ball");
  balls.forEach((ball, index) => {
    ball.style.animation = `floatBall ${3 + index}s ease-in-out infinite`;
    ball.style.animationDelay = `${index * 0.5}s`;
  });

  // Get all carousel containers
  const carouselContainers = document.querySelectorAll(".carousel-container");

  // Initialize each carousel separately
  carouselContainers.forEach(carouselContainer => {
    const carousel = carouselContainer.querySelector(".carousel");
    const cards = Array.from(carouselContainer.querySelectorAll(".carousel-card"));
    const dots = carouselContainer.querySelectorAll(".carousel-dot");
    const leftArrow = carouselContainer.querySelector(".carousel-arrow-left");
    const rightArrow = carouselContainer.querySelector(".carousel-arrow-right");

    // Configuration
    const totalCards = cards.length;
    const cardWidth = 380; // Fixed card width
    const cardGap = 20;    // Gap between cards
    let currentIndex = 0;  // Start with the first card
    let autoSlideTimer;

    // Create clone cards for infinite looping
    function setupInfiniteLoop() {
      // Clone the first card and add it to the end
      const firstCardClone = cards[0].cloneNode(true);
      carousel.appendChild(firstCardClone);
      
      // Clone the last card and add it to the beginning
      const lastCardClone = cards[cards.length - 1].cloneNode(true);
      carousel.insertBefore(lastCardClone, carousel.firstChild);
      
      // Update the cards array to include clones
      const updatedCards = Array.from(carouselContainer.querySelectorAll(".carousel-card"));
      
      // Set fixed width for all cards to ensure consistent spacing
      updatedCards.forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.flexShrink = '0';
        card.style.flexGrow = '0';
        card.style.margin = `0 ${cardGap/2}px`; // Equal margin on both sides
      });
      
      return updatedCards;
    }

    // Setup infinite loop and get updated cards
    const updatedCards = setupInfiniteLoop();
    
    // Set container to display inline-flex to ensure proper layout
    carousel.style.display = 'inline-flex';
    carousel.style.transition = 'transform 0.3s ease';

    // Start with index 1 (after the cloned last card)
    currentIndex = 1;

    // Function to update carousel position and state
    function updateCarousel(skipAnimation = false) {
      // Calculate the position that centers the active card
      const containerWidth = carouselContainer.offsetWidth;
      const centerPosition = (containerWidth / 2) - (cardWidth / 2);
      
      // Calculate the offset to position the active card in the center
      const offset = centerPosition - (currentIndex * (cardWidth + cardGap));
      
      // Update carousel position
      if (skipAnimation) {
        carousel.style.transition = 'none';
      } else {
        carousel.style.transition = 'transform 0.3s ease';
      }
      
      carousel.style.transform = `translateX(${offset}px)`;
      
      // Update active states
      updatedCards.forEach((card, idx) => {
        card.classList.remove("active");
        
        // Apply scale/hover effect only to current card (center card)
        if (idx === currentIndex) {
          card.classList.add("active");
          card.style.transform = "scale(1.05)";
          card.style.zIndex = "10";
        } else {
          card.style.transform = "scale(1)";
          card.style.zIndex = "1";
        }
      });
      
      // Update dots - only for the original cards (not the clones)
      let dotIndex = currentIndex - 1;
      if (dotIndex < 0) dotIndex = totalCards - 1;
      if (dotIndex >= totalCards) dotIndex = 0;
      
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === dotIndex);
      });
    }

    // Handle infinite loop transitions
    // New version
    function handleInfiniteLoop() {
      if (currentIndex === 0) {
        // If we're at the clone of the last card, jump to the real last card
        setTimeout(() => {
          currentIndex = totalCards;
          updateCarousel(true);
        }, 300);
      } else if (currentIndex === updatedCards.length - 1) {
        // If we're at the clone of the first card, jump to the real first card
        setTimeout(() => {
          currentIndex = 1;
          updateCarousel(true);
        }, 300);
      }
    }


    // Navigate to previous card with infinite loop
    function goToPrevious() {
      currentIndex--;
      updateCarousel();
      handleInfiniteLoop();
      resetAutoSlide();
    }

    // Navigate to next card with infinite loop
    function goToNext() {
      currentIndex++;
      updateCarousel();
      handleInfiniteLoop();
      resetAutoSlide();
    }

    // Auto-slide controls
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(goToNext, 5000);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    // Event Listeners
    leftArrow.addEventListener("click", goToPrevious);
    rightArrow.addEventListener("click", goToNext);

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index + 1; // +1 because of the clone at the beginning
        updateCarousel();
        resetAutoSlide();
      });
    });

    // Card click
    updatedCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (index !== currentIndex) {
          currentIndex = index;
          updateCarousel();
          resetAutoSlide();
        }
      });
    });

    // Auto-slide pause on hover
    carouselContainer.addEventListener("mouseenter", stopAutoSlide);
    carouselContainer.addEventListener("mouseleave", startAutoSlide);

    // Initialize
    updateCarousel();
    startAutoSlide();
  });

  // Handle window resize - update all carousels
  window.addEventListener("resize", function() {
    const carouselContainers = document.querySelectorAll(".carousel-container");
    carouselContainers.forEach(container => {
      const event = new Event('resize');
      container.dispatchEvent(event);
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Get all format tabs and ranking content sections
  const formatTabs = document.querySelectorAll('.format-tab');
  const rankingContents = document.querySelectorAll('.rankings-content');

  // Add click event listeners to format tabs
  formatTabs.forEach(tab => {
      tab.addEventListener('click', function() {
          const format = this.getAttribute('data-format');

          // Remove active class from all format tabs and content
          formatTabs.forEach(t => t.classList.remove('active'));
          rankingContents.forEach(content => content.classList.remove('active'));

          // Add active class to the clicked format tab and its content
          this.classList.add('active');
          const targetRankingContent = document.getElementById(`${format}-rankings`);
          if (targetRankingContent) {
               targetRankingContent.classList.add('active');

              // Automatically activate the first category tab (Batting) for the new format
              const categoryTabs = targetRankingContent.querySelectorAll('.category-tab');
              const categoryContents = targetRankingContent.querySelectorAll('.category-content');

              categoryTabs.forEach(t => t.classList.remove('active'));
              categoryContents.forEach(content => content.classList.remove('active'));

              const firstCategoryTab = targetRankingContent.querySelector('.category-tab');
              if (firstCategoryTab) {
                  firstCategoryTab.classList.add('active');
                  const initialCategory = firstCategoryTab.getAttribute('data-category');
                  const initialCategoryContent = document.getElementById(`${format}-${initialCategory}`);
                  if (initialCategoryContent) {
                       initialCategoryContent.classList.add('active');
                  }
              }
          }
      });
  });

  // Add click event listeners to category tabs within each format section
  rankingContents.forEach(rankingSection => {
      const categoryTabs = rankingSection.querySelectorAll('.category-tab');
      const categoryContents = rankingSection.querySelectorAll('.category-content');

      categoryTabs.forEach(tab => {
          tab.addEventListener('click', function() {
              const category = this.getAttribute('data-category');
              const formatId = this.closest('.rankings-content').id; // Get the parent format id (e.g., 'odi-rankings')
              const format = formatId.replace('-rankings', ''); // Extract format name (e.g., 'odi')

              // Remove active class from all category tabs and content within the current format
              categoryTabs.forEach(t => t.classList.remove('active'));
              categoryContents.forEach(content => content.classList.remove('active'));

              // Add active class to the clicked category tab and its content
              this.classList.add('active');
              const targetCategoryContent = document.getElementById(`${format}-${category}`);
              if (targetCategoryContent) {
                  targetCategoryContent.classList.add('active');
              }
          });
      });
  });

  const initialActiveFormatTab = document.querySelector('.format-tab.active');
  if (initialActiveFormatTab) {
      const initialFormat = initialActiveFormatTab.getAttribute('data-format');
      const initialRankingContent = document.getElementById(`${initialFormat}-rankings`);
      if (initialRankingContent) {
          initialRankingContent.classList.add('active');
          const initialActiveCategoryTab = initialRankingContent.querySelector('.category-tab.active');
          if (initialActiveCategoryTab) {
              const initialCategory = initialActiveCategoryTab.getAttribute('data-category');
               const initialCategoryContent = document.getElementById(`${initialFormat}-${initialCategory}`);
               if (initialCategoryContent) {
                   initialCategoryContent.classList.add('active');
               }
          } else {
               // If no initial category is active, default to the first one (Batting)
               const firstCategoryTab = initialRankingContent.querySelector('.category-tab');
               if (firstCategoryTab) {
                  firstCategoryTab.classList.add('active');
                  const initialCategory = firstCategoryTab.getAttribute('data-category');
                  const initialCategoryContent = document.getElementById(`${initialFormat}-${initialCategory}`);
                  if (initialCategoryContent) {
                       initialCategoryContent.classList.add('active');
                  }
               }
          }
      }
  }
});

const detailButtons = document.querySelectorAll('.details-button');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert("Match Yet To Began");
        });
    });