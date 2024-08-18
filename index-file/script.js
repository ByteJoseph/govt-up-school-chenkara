document.addEventListener('DOMContentLoaded', () => {
  const loaderContainer = document.getElementById('loader-container');
  const content = document.getElementById('the-content');
  let playCount = 0;
  const maxPlays = 3;

  const animation = lottie.loadAnimation({
    container: document.getElementById('loader'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'resources/animations/Animation - 1722839560780.json'
  });

  function showLoader() {
    loaderContainer.style.display = 'block';
    content.style.display = 'none';
  }

  function hideLoader() {
    loaderContainer.style.display = 'none';
    content.style.display = 'block';
  }

  function playAnimation() {
    if (playCount < maxPlays) {
      playCount++;
      animation.goToAndStop(0, true);
      animation.play();
    } else {
      hideLoader();
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        return reg.ready;
      })
      .catch(err => console.log('Service Worker: Registration Failed: ' + err));

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_COMPLETE') {
        playAnimation();
      }
    });
  }

  animation.addEventListener('complete', playAnimation);
  animation.addEventListener('error', hideLoader);
});


const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('header-list-overlay');

hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('menu-active');
});

document.querySelectorAll('.header-list-overlay a').forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-active');
    });
});

/*******************************************/
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.face3-cards');

    function handleScroll() {
        const triggerPoint = window.innerHeight / 1.5;
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerPoint) {
                if (card.classList.contains('face3-card1')) {
                    card.classList.add('slide-in-left');
                } else if (card.classList.contains('face3-card2')) {
                    card.classList.add('slide-in-right');
                }
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});

/**********************************************/

window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const scrollPercent = scrollPosition / maxScroll;

    let targetWidth;
    if (window.innerWidth >= 1024) {
        // For bigger screens
        targetWidth = 14;
    } else {
        // For smaller screens
        targetWidth = 40;
    }

    const lineWidth = scrollPercent * targetWidth;
    document.getElementById('growing-line').style.width = `${lineWidth}vw`;
});

/**********************************************/

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 900);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.face4-cards');
    cards.forEach(card => observer.observe(card));
});

/***************************************************/

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelector('.slides');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    let currentIndex = 0;
  
    function showSlide(index) {
      const slideWidth = slides.children[0].offsetWidth + 30; // card width + margin
      slides.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  
    prevButton.addEventListener('click', function() {
      if (currentIndex > 0) {
        currentIndex--;
        showSlide(currentIndex);
      }
    });
  
    nextButton.addEventListener('click', function() {
      if (currentIndex < slides.children.length - 1) {
        currentIndex++;
        showSlide(currentIndex);
      }
    });
});

/****************************************************/

document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.querySelector('.face5-h1');
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.8
    });
  
    observer.observe(textElement);
  });

/******************************************************/

document.addEventListener('scroll', function() {
    const line2 = document.getElementById('face6-line');
    const scrollPercentage2 = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    let maxLineWidth2;;
    if (window.innerWidth >= 1024) {
        // For bigger screens
        maxLineWidth2 = 40;
    } else {
        // For smaller screens
        maxLineWidth2 = 30;
    }
    const lineWidth2 = maxLineWidth2 * scrollPercentage2;

    line2.style.width = `${lineWidth2}%`;
});

/*****************************************************/

document.addEventListener('DOMContentLoaded', function() {
    const sections = [
        {section: 'section1', tail: 'tail1', downArrow: 'downarrow1', upArrow: 'uparrow1'},
        {section: 'section2', tail: 'tail2', downArrow: 'downarrow2', upArrow: 'uparrow2'},
        {section: 'section3', tail: 'tail3', downArrow: 'downarrow3', upArrow: 'uparrow3'},
        {section: 'section4', tail: 'tail4', downArrow: 'downarrow4', upArrow: 'uparrow4'},
        {section: 'section5', tail: 'tail5', downArrow: 'downarrow5', upArrow: 'uparrow5'},
        {section: 'section6', tail: 'tail6', downArrow: 'downarrow6', upArrow: 'uparrow6'},
        {section: 'section7', tail: 'tail7', downArrow: 'downarrow7', upArrow: 'uparrow7'},
        {section: 'section8', tail: 'tail8', downArrow: 'downarrow8', upArrow: 'uparrow8'},
        {section: 'section9', tail: 'tail9', downArrow: 'downarrow9', upArrow: 'uparrow9'},
        {section: 'section10', tail: 'tail10', downArrow: 'downarrow10', upArrow: 'uparrow10'},
        {section: 'section11', tail: 'tail11', downArrow: 'downarrow11', upArrow: 'uparrow11'},
        {section: 'section12', tail: 'tail12', downArrow: 'downarrow12', upArrow: 'uparrow12'}
    ];

    sections.forEach(({section, tail, downArrow, upArrow}) => {
        document.getElementById(downArrow).addEventListener('click', function() {
            document.getElementById(tail).style.display = 'block';
            document.getElementById(downArrow).style.display = 'none';
            document.getElementById(upArrow).style.display = 'inline';
        });

        document.getElementById(upArrow).addEventListener('click', function() {
            document.getElementById(tail).style.display = 'none';
            document.getElementById(downArrow).style.display = 'inline';
            document.getElementById(upArrow).style.display = 'none';
        });
    });
});

/***CONSOLE-BLOCKER*******/
console.error = function(){};

document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('.face12-message h4, .face12-message p');
    let currentElementIndex = 0;
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          startTyping();
        }
      });
    }, { threshold: 0.1 });
  
    observer.observe(document.querySelector('.face12-message'));
  
    function startTyping() {
      if (currentElementIndex < elements.length) {
        const element = elements[currentElementIndex];
        element.classList.remove('hidden');
        const text = element.textContent;
        element.textContent = '';
        typeText(element, text, () => {
          currentElementIndex++;
          startTyping();
        });
      }
    }
  
    function typeText(element, text, callback, index = 0) {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        element.classList.add('typing');
        setTimeout(() => {
          typeText(element, text, callback, index + 1);
        }, 25);
      } else {
        element.classList.remove('typing');
        if (callback) callback();
      }
    }
});
  