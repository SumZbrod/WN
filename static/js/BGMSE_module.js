import {save2LastAction} from './save_localstorage.js'

const bgmCache = new Map();
const seCache = new Map();
const voiceCache = new Map();
let bgmAudioArray = [null, null, null, null, null, null, null];
let seAudioArray = [null, null, null, null, null, null, null];
let bgmAudioArrayID = [null, null, null, null, null, null, null];
let seAudioArrayID = [null, null, null, null, null, null, null];

let BGM_volume = .05;
let SE_volume = .3;
const MAX_BGMSE_CACHE_SIZE = 5;

function cacheAudio(audioCache, url, loop=false, volume=SE_volume) {
    // Проверяем, есть ли аудио в кэше
    if (audioCache.has(url)) {
        return audioCache.get(url);
    }
    
    // Если кэш заполнен, удаляем первый добавленный элемент
    if (audioCache.size >= MAX_BGMSE_CACHE_SIZE) {
        const firstKey = audioCache.keys().next().value;
        audioCache.delete(firstKey);
    }

    const audio = new Howl({
        src: [url],
        volume: volume,
        loop: loop
      });      

    audioCache.set(url, audio);
    return audio;
}


export function BGM_mute(channel) {
    if (bgmAudioArray[channel]){
        console.log(`Current state of channel ${channel}:`, bgmAudioArray[channel].state);
        if (bgmAudioArray[channel].playing()) {
            bgmAudioArray[channel].stop();
        }
    } 
    save2LastAction('BGM', '');
}
 
export function BGMSE_player(path, channel, audio_type) {
    let sound_id;
    if (audio_type === 'BGM') {
        let Audio = cacheAudio(bgmCache, path, true, BGM_volume);
            BGM_mute(channel);
            bgmAudioArray[channel] = Audio;
            sound_id = bgmAudioArray[channel].play();
            save2LastAction('BGM', [path, channel]);
            bgmAudioArrayID[channel] = sound_id;
    }
    else if (audio_type === 'SE') { 
        let Audio = cacheAudio(seCache, path);
            if (seAudioArray[channel]) {
                if (seAudioArray[channel].playing()) {
                    seAudioArray[channel].stop();
                }
            } 
            seAudioArray[channel] = Audio;
            sound_id = seAudioArray[channel].play();
            seAudioArrayID[channel] = sound_id;
    }
    else {
        console.log("Unknown audio type: ", audio_type);
    }
    if (sound_id) {

    }
}

export function changeBGMSEVolume(value) {
    console.log('changeBGMSEVolume(value)', value)
    for (let i in bgmAudioArray) {
        console.log(i);
        let bgm_audio = bgmAudioArray[i]; 
        if (bgm_audio){
            console.log(bgm_audio);
            let bgm_id = bgmAudioArrayID[i];
            bgm_audio.volume(value, bgm_id);
        }
        let se_audio = seAudioArray[i]; 
        if (se_audio){
            let se_id = seAudioArrayID[i];
            se_audio.volume(value, se_id);
        }
    }

}