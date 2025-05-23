import {save2LastAction} from './save_localstorage.js'

document.addEventListener('DOMContentLoaded', function () {
    const scriptLinks = document.querySelectorAll('.script-link');
    if (localStorage['lastAction'] == null){
        localStorage['lastAction'] = JSON.stringify({});
    }
    const lastAction = JSON.parse(localStorage['lastAction']);
    const script_name = lastAction['script_name'];
    console.log('script_name', script_name);
    if (localStorage.getItem('finishScript') === null){
        localStorage.setItem('finishScript', JSON.stringify([]));
    }
    // Если ранее была нажата кнопка, применяем стиль
    if (script_name) {
        scriptLinks.forEach(link => {
            if (link.textContent.trim() === script_name) {
                link.classList.add('active');
            }
        });
    }

    const scriptsArray = JSON.parse(localStorage.getItem('finishScript'));
    const save_memory = JSON.parse(localStorage['save_memory']);
    scriptLinks.forEach(link => {
        let link_name = link.textContent.trim();
        link.addEventListener('click', function (event) {
            save2LastAction('script_name', link_name); 
            scriptLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
        if (link_name in save_memory) {
            console.log('link.href', link.href);
            const url = new URL(link.href);
            const save_index = save_memory[link_name];
            url.searchParams.set('global_index', save_index);
            link.href = url.toString();
        }
        if (scriptsArray.includes(link_name)) {
            link.classList.add('finish');
        }
    });

});