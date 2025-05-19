export function setupTranslatorListner() {

  document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyT') {
      changeVisibility(true);
    }
  });

  document.addEventListener('keyup', function(event) {
    if (event.code === 'KeyT') {
      changeVisibility(false);
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
