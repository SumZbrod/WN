function getLastBI() {
    const block_list = document.querySelectorAll('.text-box')
    const last_block = block_list[block_list.length-1];
    return last_block.dataset['block_id'];
}

export function SetupSaveButton() {
    const save_button = document.querySelector('.save-button');
    save_button.addEventListener('click', async (event) => {
        const last_id = getLastBI(); 
        localStorage.setItem('last_id', last_id);
    })
}