document.addEventListener('DOMContentLoaded', function () {
    const scriptLinks = document.querySelectorAll('.script-link');
    const lastClickedScript = localStorage.getItem('lastClickedScript');
    if (localStorage.getItem('finishScript') === null){
        localStorage.setItem('finishScript', JSON.stringify([]));
    }
    // Если ранее была нажата кнопка, применяем стиль
    if (lastClickedScript) {
        scriptLinks.forEach(link => {
            if (link.textContent.trim() === lastClickedScript) {
                link.classList.add('active');
            }
        });
    }

    // Добавляем обработчик событий на каждую ссылку
    const scriptsArray = JSON.parse(localStorage.getItem('finishScript'));
    scriptLinks.forEach(link => {
        let link_name = link.textContent.trim();
        link.addEventListener('click', function (event) {
            // Сохраняем название нажатой кнопки
            localStorage.setItem('lastClickedScript', link_name);

            // Удаляем класс active со всех ссылок
            scriptLinks.forEach(link => link.classList.remove('active'));

            // Добавляем класс active к нажатой ссылке
            link.classList.add('active');
        });
        if (scriptsArray.includes(link_name)) {
            link.classList.add('finish');
        }
    });
    
});