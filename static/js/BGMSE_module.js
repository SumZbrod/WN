import {save2LastAction} from './save_localstorage.js'

const bgmCache = new Map();
const seCache = new Map();
const voiceCache = new Map();
let bgmAudioArray = [null, null, null, null, null, null, null];
let seAudioArray = [null, null, null, null, null, null, null];
let BGM_volume = .2;
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
    console.log('BGMSE_player', path, channel, audio_type);
    if (audio_type === 'BGM') {
        let Audio = cacheAudio(bgmCache, path, true, BGM_volume);
            BGM_mute(channel);
            bgmAudioArray[channel] = Audio;
            bgmAudioArray[channel].play();
            save2LastAction('BGM', [path, channel]);

    }
    else if (audio_type === 'SE') { 
        let Audio = cacheAudio(seCache, path);
            if (seAudioArray[channel]) {
                if (seAudioArray[channel].playing()) {
                    seAudioArray[channel].stop();
                }
            } 
            seAudioArray[channel] = Audio;
            seAudioArray[channel].play();
    }
    else {
        console.log("Unknown audio type: ", audio_type);
    }
}

