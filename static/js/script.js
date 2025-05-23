
import { setupTextAudio } from './textaudio_builder.js';
import { setupHideUI, setupTranslatorListner } from './keybild_setup.js';

setupTextAudio();
setupTranslatorListner();
setupHideUI(); 

if (localStorage['lastAction'] == null){
    localStorage['lastAction'] = JSON.stringify({});
}