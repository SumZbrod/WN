import {typeEffect} from "./TypingModule.js"
import {Draw_CG, DrawSprite, clearAllSprites} from "./Paiting.js"
// Кэш для аудиофайлов
const audioCache = new Map();

let currentVoiceAudio = new Audio();

// Texts
const textContainer = document.getElementById('text-container');
let currentBatch = [];
let nextBatch = [];
let currentIndex = 0;
const batchSize = 20; // Размер пачки
const MAX_VOICE_CACHE_SIZE = 10;
const VOICE_VOLUME = .8;

function createAudioPlayer() {
    const audioPlayer = document.createElement('div');
    audioPlayer.classList.add('audio-player');

    const playButton = document.createElement('button');
    playButton.classList.add('play-button');
    playButton.textContent = '▶️';

    const timeline = document.createElement('div');
    timeline.classList.add('timeline');

    const progress = document.createElement('div');
    progress.classList.add('progress');
    timeline.appendChild(progress);

    const currentTime = document.createElement('span');
    currentTime.classList.add('time');
    currentTime.textContent = '00:00';

    playButton.addEventListener('click', () => {
        if (currentVoiceAudio.paused) {
            currentVoiceAudio.play();
            playButton.textContent = '⏸️';
        } else {
            currentVoiceAudio.pause();
            playButton.textContent = '▶️';
        }
    });

    timeline.addEventListener('click', (e) => {
        const timelineWidth = timeline.offsetWidth;
        const clickPosition = e.offsetX;
        const newTime = (clickPosition / timelineWidth) * currentVoiceAudio.duration;
        currentVoiceAudio.currentTime = newTime;
    });

    audioPlayer.appendChild(playButton);
    audioPlayer.appendChild(timeline);
    audioPlayer.appendChild(currentTime);

    return { audioPlayer, playButton, timeline, progress, currentTime };
}

const { audioPlayer, playButton, timeline, progress, currentTime } = createAudioPlayer(currentVoiceAudio);


function cacheAudio(audioCache, url) {
    // Проверяем, есть ли аудио в кэше
    if (audioCache.has(url)) {
        return audioCache.get(url);
    }
    
    // Если кэш заполнен, удаляем первый добавленный элемент
    if (audioCache.size >= MAX_VOICE_CACHE_SIZE) {
        const firstKey = audioCache.keys().next().value;
        audioCache.delete(firstKey);
    }
    
    // Создаем новый аудио объект и добавляем в кэш
    const audio = new Audio(url);
    audioCache.set(url, audio);
    return audio;
}

function fetchTextBatch(callback) {
    // console.log("Fetching new batch of text...");
    fetch('/get_text')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText);
            }
            return response.json();
        })
        .then(batch => {
            callback(batch);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function addNextBlock() {
    console.log('currentIndex', currentIndex);
    if (currentIndex < currentBatch.length) {
        const item = currentBatch[currentIndex];
        console.log('item.block_type', item.block_type)
        if (item.block_type === "speach_line") {
            // console.log('type speach')
            const content = item.content
            
            const textBox = document.createElement('div');
            textBox.classList.add('text-box');
            
            // Сохраняем путь к аудио в блок
            if (content.audioPath) {
                textBox.dataset.voicePath = content.audioPath;
            
                // Кнопка воспроизведения
                const playButton = document.createElement('button');
                playButton.classList.add('play-button');
                playButton.textContent = '▶️';
                playButton.addEventListener('click', (event) => {
                    const voice_path = event.currentTarget.closest('.text-box')?.dataset.voicePath;
                    if (!voice_path) return;
            
                    if (currentVoiceAudio) {
                        currentVoiceAudio.pause();
                        currentVoiceAudio.currentTime = 0;
                    }
                    let VoiceAudio = new cacheAudio(audioCache, voice_path);
                    currentVoiceAudio = VoiceAudio;
                    currentVoiceAudio.volume = VOICE_VOLUME;
                    currentVoiceAudio.play().catch(error => {
                        console.error('Ошибка воспроизведения аудио:', error);
                    });
                });
                textBox.appendChild(playButton);
            
                // Кнопка обновления Anki карточки
                const updateButton = document.createElement('button');
                updateButton.classList.add('anki-update-button');
                updateButton.textContent = '🔄'; // Можно заменить на другую иконку
                updateButton.addEventListener('click', async (event) => {
                    const voice_path = event.currentTarget.closest('.text-box')?.dataset.voicePath;
                    console.log('voice_path', voice_path);
                    if (!voice_path) return;
            
                    try {
                        const audioFilename = `audio_${Date.now()}.mp3`;
                        console.log('audioFilename', audioFilename);
                        
                        // Загружаем аудиофайл и кодируем
                        const audioBase64 = await fetch(voice_path)
                            .then(res => res.arrayBuffer())
                            .then(buffer => {
                                const bytes = new Uint8Array(buffer);
                                return btoa(String.fromCharCode(...bytes));
                            });
            
                        // Сохраняем в медиатеку Anki
                        await fetch("http://127.0.0.1:8765", {
                            method: "POST",
                            body: JSON.stringify({
                                action: "storeMediaFile",
                                version: 6,
                                params: {
                                    filename: audioFilename,
                                    data: audioBase64
                                }
                            })
                        });
            
                        // Получаем последнюю добавленную карточку
                        const findRes = await fetch("http://127.0.0.1:8765", {
                            method: "POST",
                            body: JSON.stringify({
                                action: "findNotes",
                                version: 6,
                                params: { query: "added:1" }
                            })
                        });
                        const findData = await findRes.json();
                        if (!findData.result.length) {
                            alert("Карточка не найдена.");
                            return;
                        }
                        const noteId = findData.result[0];
                        console.log('noteId', noteId);
                        // Обновляем поле SentenceAudio
                        await fetch("http://127.0.0.1:8765", {
                            method: "POST",
                            body: JSON.stringify({
                                action: "updateNoteFields",
                                version: 6,
                                params: {
                                    note: {
                                        id: noteId,
                                        fields: {
                                            SentenceAudio: `[sound:${audioFilename}]`
                                        }
                                    }
                                }
                            })
                        });
            
                        console.log("Аудио успешно обновлено в карточке Anki.");
                    } catch (err) {
                        console.error("Ошибка:", err);
                        console.log("Произошла ошибка при обновлении Anki.");
                    }
                });
                textBox.appendChild(updateButton);
            }
            
            const originalText = document.createElement('p');
            originalText.classList.add('original');
            
            const translatedText = document.createElement('p');
            translatedText.classList.add('translated');
            translatedText.textContent = content.translate;
            
            textBox.appendChild(originalText);
            textBox.appendChild(translatedText);
            textContainer.appendChild(textBox);
            



            textContainer.scrollTo(0, textContainer.scrollHeight+100); // Прокручиваем к началу
            typeEffect(originalText, content.orig);
            if (content.audioPath) {
                currentVoiceAudio.src = content.audioPath; // Устанавливаем путь к аудио
                currentVoiceAudio.volume = VOICE_VOLUME
                currentVoiceAudio.play(); // Проигрываем аудио
            }
        }
        
        else if (item.block_type === 'bgmse') {
            const bgmse_path = item.content.path;
            const bgmse_channel = item.content.channel;
            const bgmse_audio_type = item.content.audio_type;
            BGMSE_player(bgmse_path, bgmse_channel, bgmse_audio_type);
        }
        else if (item.block_type === 'mute_bgm') {
            const bgm_channel = item.content.channel;
            BGM_mute(bgm_channel);
        }
        else if (item.block_type === 'draw_cg') {
            const cg_path = item.content.path;
            Draw_CG(cg_path);
        }
        else if (item.block_type === 'clear_sprites') {
            clearAllSprites();
        }
        else if (item.block_type === 'draw_sprite') {
            const sprite_path = item.content.path;
            const x_pos = item.content.position_x;
            DrawSprite(sprite_path, x_pos);
        }
        currentIndex++;
        // Загружаем следующую пачку, если достигли 5-го блока текущей
        if (currentIndex === batchSize / 2) {
            fetchTextBatch((batch) => {
                // console.log('Preload next batch')
                nextBatch = batch;
            });
        }
        if (item.wait_time >= 0) {
            setTimeout(() => {
                addNextBlock(); // Переходим к следующему блоку после ожидания
            }, item.wait_time * 1000);
        }
    }
    else {
        // console.log("Switch to next batch")
        // Переход на следующую пачку и загрузка новой пачки
        currentBatch = nextBatch;
        currentIndex = 0;
        nextBatch = [];
        if (currentBatch) {
            addNextBlock(); // Отображаем первый блок из новой пачки
        }
    }
}

function setupTextAudio() {

    document.body.appendChild(audioPlayer);
    
    // Обновление таймлайна
    currentVoiceAudio.addEventListener('timeupdate', () => {
        const progressPercent = (currentVoiceAudio.currentTime / currentVoiceAudio.duration) * 100;
        progress.style.width = progressPercent + '%';
        const mins = Math.floor(currentVoiceAudio.currentTime / 60);
        const secs = Math.floor(currentVoiceAudio.currentTime % 60);
        currentTime.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    });
    // Обработчик события нажатия пробела
    document.addEventListener('keydown', (event) => {
        // console.log(event.code)
        if (event.code === 'Space') {
            event.preventDefault(); // Предотвращаем стандартное поведение пробела (например, прокрутка)
            addNextBlock();
            textContainer.scrollTo(0, textContainer.scrollHeight+100); // Прокручиваем к началу
        }
        else if (event.code === 'KeyR') {
            currentVoiceAudio.pause();
            currentVoiceAudio.currentTime = 0;
            currentVoiceAudio.play().catch(error => {
                console.error('Ошибка воспроизведения аудио:', error);
            });
        }
    });
    
    // Инициализация с первой пачки
    fetchTextBatch((batch) => {
        currentBatch = batch;
        // addNextBlock();
    });
}

export {setupTextAudio};



