onload = () => {
  console.log("Page loaded");
  const loadingText = document.querySelector('.loading-text');
  const flowersEl = document.querySelector('.flowers');
  // Remove not-loaded class immediately to start animations
  document.body.classList.remove("not-loaded");
  // Show loading text explicitly
  if (loadingText) {
    loadingText.style.opacity = '1';
    loadingText.style.pointerEvents = 'none';
    loadingText.style.visibility = 'visible';
  }
  if (flowersEl) {
    console.log("Flowers element found");
    flowersEl.addEventListener('animationend', () => {
      console.log("Flowers animation ended");
      // Do not hide loading text here to keep it visible during fade-away
      setTimeout(() => {
        console.log("Starting countdown sequence");
        startCountdownSequence();
      }, 3000);
    }, { once: true });
  } else {
    console.log("Flowers element NOT found");
    // Hide loading text if flowers element not found
    if (loadingText) {
      loadingText.style.opacity = '0';
      loadingText.style.pointerEvents = 'none';
      loadingText.style.visibility = 'hidden';
    }
  }
};

function typeText(element, speed = 100, callback) {
  const text = element.textContent;
  element.textContent = '';
  let index = 0;
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function createSpark() {
  const spark = document.createElement('div');
  spark.classList.add('spark');

  // Randomly choose an edge: 0=top,1=right,2=bottom,3=left
  const edge = Math.floor(Math.random() * 4);
  let startX, startY, endX, endY;

  switch(edge) {
    case 0: // top
      startX = Math.random() * 100;
      startY = 0;
      endX = startX + (Math.random() * 40 - 20);
      endY = 100;
      break;
    case 1: // right
      startX = 100;
      startY = Math.random() * 100;
      endX = 0;
      endY = startY + (Math.random() * 40 - 20);
      break;
    case 2: // bottom
      startX = Math.random() * 100;
      startY = 100;
      endX = startX + (Math.random() * 40 - 20);
      endY = 0;
      break;
    case 3: // left
      startX = 0;
      startY = Math.random() * 100;
      endX = 100;
      endY = startY + (Math.random() * 40 - 20);
      break;
  }

  spark.style.left = startX + 'vw';
  spark.style.top = startY + 'vh';

  // Store end positions as data attributes for animation
  spark.dataset.endX = endX;
  spark.dataset.endY = endY;

  // Random animation duration
  spark.style.animationDuration = (Math.random() * 3 + 2) + 's';

  return spark;
}

// Update startSparkAnimation to animate sparks from start to end positions
function startSparkAnimation() {
  const container = document.getElementById('spark-container');
  if (!container) return;

  if (sparkIntervalId) {
    clearInterval(sparkIntervalId);
  }

  sparkIntervalId = setInterval(() => {
    const spark = createSpark();
    container.appendChild(spark);

    // Animate spark movement using JS
    const endX = parseFloat(spark.dataset.endX);
    const endY = parseFloat(spark.dataset.endY);

    spark.animate([
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: `translate(${endX - parseFloat(spark.style.left)}vw, ${endY - parseFloat(spark.style.top)}vh)`, opacity: 0 }
    ], {
      duration: parseFloat(spark.style.animationDuration) * 1000,
      easing: 'ease-out',
      fill: 'forwards'
    });

    spark.addEventListener('animationend', () => {
      spark.remove();
    });

    // Also remove spark after animation duration as fallback
    setTimeout(() => {
      if (spark.parentElement) spark.remove();
    }, parseFloat(spark.style.animationDuration) * 1000 + 100);
  }, 100);
}

let sparkIntervalId = null;

function startSparkAnimation() {
  const container = document.getElementById('spark-container');
  if (!container) return;

  // Clear any existing interval to avoid duplicates
  if (sparkIntervalId) {
    clearInterval(sparkIntervalId);
  }

  // Create sparks repeatedly at intervals for continuous falling effect
  sparkIntervalId = setInterval(() => {
    const spark = createSpark();
    container.appendChild(spark);

    // Remove spark after animation
    spark.addEventListener('animationend', () => {
      spark.remove();
    });
  }, 100); // create a spark every 100ms
}

function stopSparkAnimation() {
  if (sparkIntervalId) {
    clearInterval(sparkIntervalId);
    sparkIntervalId = null;
  }
}


function startCountdownSequence() {
  const flowersEl = document.querySelector('.flowers');
  const birthdayMessage = document.querySelector('.birthday-message');
  const birthdayHeading = document.getElementById('birthday-heading');
  const birthdayParagraphs = Array.from(document.querySelectorAll('.birthday-message p'));

  // Hide paragraphs initially
  birthdayParagraphs.forEach(p => {
    p.style.visibility = 'hidden';
  });

  setTimeout(() => {
    flowersEl.classList.add('fade-away');
    // Hide loading text together with flowers fade-away with smooth fade out
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      console.log("Setting loadingText opacity to 0 for fade out");
      loadingText.style.opacity = '0';
      // After fade out duration (3s), hide completely
      setTimeout(() => {
        console.log("Setting loadingText pointerEvents and visibility to none");
        loadingText.style.pointerEvents = 'none';
        loadingText.style.visibility = 'hidden';
      }, 4000);
    }
  }, 4000);

  setTimeout(() => {
    flowersEl.style.display = 'none';
    birthdayMessage.classList.add('visible');
    birthdayMessage.style.pointerEvents = 'auto';

    // Start spark animation when typing begins
    startSparkAnimation();

    // Start meteor animation
    startMeteorAnimation();

    // Start typing heading
    typeText(birthdayHeading, 150, () => {
      // After heading typing, show paragraphs and type them sequentially
      let delay = 0;
      function typeNextParagraph() {
        if (delay < birthdayParagraphs.length) {
          birthdayParagraphs[delay].style.visibility = 'visible';
          typeText(birthdayParagraphs[delay], 100, () => {
            delay++;
            typeNextParagraph();
          });
        }
      }
      typeNextParagraph();
    });
  }, 6500);
}

// Meteor animation function
function startMeteorAnimation() {
  const meteor = document.getElementById('meteor');
  if (!meteor) return;

  meteor.style.display = 'block';
  meteor.style.top = '-10vmin';
  meteor.style.left = '-10vmin';

  meteor.style.animation = 'none';
  // Trigger reflow to restart animation
  void meteor.offsetWidth;
  meteor.style.animation = 'meteor-move 1.5s ease forwards';

  meteor.addEventListener('animationend', () => {
    meteor.style.display = 'none';
  }, { once: true });
}

