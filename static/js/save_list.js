function getLastBI() {
    const block_list = document.querySelectorAll('.text-box')
    const last_block = block_list[block_list.length-1];
    return last_block.dataset['block_id'];
}

export function saveLocalId() {
    const last_id = getLastBI(); 
    const last_script_name = localStorage['lastClickedScript']; 
    let save_memory;    
    if (localStorage['save_memory'] == null){
        save_memory = {};
    }
    else {
        save_memory = JSON.parse(localStorage['save_memory']);
    }
    save_memory[last_script_name] = last_id;
    localStorage.setItem('save_memory', JSON.stringify(save_memory));
}

export function SetupSaveButton() {
    const save_button = document.querySelector('.save-button');
    save_button.addEventListener('click', async (event) => {
        saveLocalId();
    })
}   