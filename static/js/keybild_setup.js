function isNearBottom(container, threshold = 50) {
    const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

    return distanceFromBottom < threshold;
}

export function setupTranslatorListner() {
    const textContainer = document.getElementById('text-container');


    
  document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyT') {
      changeVisibility(true);
      requestAnimationFrame(() => {
        textContainer.scrollTop = textContainer.scrollHeight;
    });

    }
  });

  document.addEventListener('keyup', function(event) {
    if (event.code === 'KeyT') {
      changeVisibility(false);
      requestAnimationFrame(() => {
    if (isNearBottom(textContainer)) {
        textContainer.scrollTop = textContainer.scrollHeight;
    }
});

    }
  });
  
  function changeVisibility(isVisible) {
    const translatedElements = document.querySelectorAll('.translated');
    const originalElements = document.querySelectorAll('.original');
    
    translatedElements.forEach(element => {
      element.style.display = isVisible ? 'block' : 'none';
    });
    
    originalElements.forEach(element => {
      element.style.display = isVisible ? 'none' : 'block';
    });
  }
  
}


export function setupHideUI() {

  let isVisible = true;
  document.addEventListener('keyup', function(event) {
    if (event.key === 'v') {
      changeVisibility();
    }
  });
  
  document.addEventListener('keyup', function(event) {
    console.log('event.key', event.key);
    if (event.key === 'Escape') {
          window.location.assign('/menu')
      }
  });

  function changeVisibility() {
      const audioPlayer = document.querySelector('.audio-player');
      const textContainer = document.querySelector('#text-container');
      if (isVisible) {
          isVisible = false;
      } 
      else {
          isVisible = true;
      }
      audioPlayer.style.display = isVisible ? 'block': 'none';
      
      textContainer.style.display = isVisible ? 'block': 'none';
  }

}
