export function save2LastAction(key, value){
    const lastAction = JSON.parse(localStorage['lastAction']);
    lastAction[key] = value;
    localStorage.setItem('lastAction', JSON.stringify(lastAction));
} 


export function loadFromLastAction(key){
    const lastAction = JSON.parse(localStorage['lastAction']);
    const value = lastAction[key];
    return value
} 

