import {loadFromLastAction, save2LastAction} from './save_localstorage.js'

export function Draw_CG(path) {
    save2LastAction('CG', path)
    document.body.style.backgroundImage = "url('" + path +"')"; 
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundColor = 'black';
    document.body.style.backgroundSize = 'cover';
    document.body.style.position = 'center';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.backgroundSize = 'auto 100vh'; 
}


// export function DrawSprite(path, positionX, add_to_save=true) {
//     if (add_to_save) {
//         let sprite_params = loadFromLastAction('spriteParams');
//         if (sprite_params == null) {
//             sprite_params = '[]';
//         }
//         sprite_params = JSON.parse(sprite_params);
//         sprite_params.push([path, positionX]);
//         save2LastAction('spriteParams', JSON.stringify(sprite_params));
//     }
//     const spriteElement = document.createElement('div');
//     spriteElement.classList.add('sprite');

//     // // Устанавливаем изображение спрайта
//     // spriteElement.style.backgroundImage = `url(${path})`;
//     // spriteElement.style.backgroundRepeat = 'no-repeat';
//     // spriteElement.style.width = '100%';  
//     // spriteElement.style.height = '100%';

//     // // Устанавливаем позиционирование
//     // spriteElement.style.position = 'fixed'; // Делаем элемент позиционированным

//     console.log('positionX', positionX);
//     // Вычисляем позицию по горизонтали
//     const halfWindowWidth = window.innerWidth / 2;
//     const calculatedPositionX = halfWindowWidth + 2*positionX;

//     // Устанавливаем стили для позиционирования
//     console.log('calculatedPositionX', calculatedPositionX);
//     // spriteElement.style.left = `${calculatedPositionX}px`; // -25px для центрирования элемента (ширина / 2)
//     // spriteElement.style.bottom = '0'; // Располагаем низ элемента у нижнего края окна
//     // spriteElement.style.filter = 'brightness(90%)';
//     // Добавляем элемент в body
//     document.body.appendChild(spriteElement);
// }

export function DrawSprite(path, positionX, add_to_save = true) {

    const spriteElement = document.createElement('div');
    spriteElement.classList.add('sprite');

    spriteElement.style.backgroundImage = `url(${path})`;

    spriteElement.style.backgroundPositionX = `${positionX}px`;

    document.body.appendChild(spriteElement);
}

export function clearAllSprites() {
    const sprites = document.querySelectorAll('.sprite');
    sprites.forEach(sprite => sprite.remove());
    save2LastAction('spriteParams', "[]");
}