import {BGMSE_player, BGM_mute} from './BGMSE_module.js'
import {typeEffect} from "./TypingModule.js"
import {Draw_CG, DrawSprite, clearAllSprites} from "./Paiting.js"
import { createAudioPlayerHTML } from './AudioPlayer.js';
import {trimAndSendAudio} from './anki_send.js'

// Texts
const textContainer = document.getElementById('text-container');
let currentBatch = [];
let nextBatch = [];
let currentIndex = 0;
const batchSize = 20; // Размер пачки
const container = document.getElementById('audio-container');
const Player = createAudioPlayerHTML(container, '/static/test.ogg');
let scriptName;
let globalIndex = 0;
console.log('Script Name:', scriptName);


function fetchTextBatch(callback, new_gi=0) {
    // console.log("Fetching new batch of text...");
    // Создаем объект URL с текущим URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    scriptName = params.get('script_name')
    if (new_gi===0) {
        globalIndex = parseFloat(params.get('global_index'));
    }
    // Используем URLSearchParams для извлечения параметров
    globalIndex += new_gi;
    // Выводим значения в консоль
    // Выводим значения в консоль
    console.log('new_gi:', new_gi);
    console.log('Global Index:', globalIndex);

    fetch(`/get_text?script_name=${scriptName}&global_index=${globalIndex}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        const res = response.json();
        return res;
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
                const voice_path = content.audioPath;
                textBox.dataset.voicePath = voice_path;
                Player.change_audio(voice_path);
                // Кнопка воспроизведения
                const playButton = document.createElement('button');
                playButton.classList.add('play-button');
                playButton.textContent = '▶️';
                playButton.addEventListener('click', (event) => {
                    const voice_path = event.currentTarget.closest('.text-box')?.dataset.voicePath;
                    console.log('voice_path', voice_path);
                    if (!voice_path) return;
                    Player.change_audio(voice_path);
                });
                textBox.appendChild(playButton);
            
                // Кнопка обновления Anki карточки
                const updateButton = document.createElement('button');
                updateButton.classList.add('anki-update-button');
                updateButton.textContent = '🔄'; // Можно заменить на другую иконку
                updateButton.addEventListener('click', async (event) => {
                    const voice_path = event.currentTarget.closest('.text-box')?.dataset.voicePath;
                    const translate_sentence = event.currentTarget.closest('.text-box')?.querySelector('.translated').textContent;

                    console.log('voice_path', voice_path);
                    if (!voice_path) return;
            
                    try {
                        const audioFilename = `audio_${Date.now()}.mp3`;
                        console.log('audioFilename', audioFilename);
                        
                        trimAndSendAudio(voice_path, Player.starttime, audioFilename);
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
                        const CardsIds = findData.result;
                        const noteId = findData.result[CardsIds.length - 1];
                        console.log('noteId', noteId);
                        console.log('findData.result', findData.result);
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
                                            SentenceAudio: `[sound:${audioFilename}]`,
                                            Comment: `${translate_sentence}`,
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
            },batchSize);
        }
        if (item.wait_time >= 0) {
            setTimeout(() => {
                addNextBlock(); // Переходим к следующему блоку после ожидания
            }, item.wait_time * 1000);
        }
    }
    else {
        currentBatch = nextBatch;
        if (currentBatch.length===0) {
            window.location.assign('/menu');
            return;
        }
        currentIndex = 0;
        nextBatch = [];
        if (currentBatch) {
            addNextBlock(); // Отображаем первый блок из новой пачки
        }
    }
}

function setupTextAudio() {
    let first_time = true;
    // Обработчик события нажатия пробела
    
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            if (first_time){
                first_time = false;
                console.log("start create audio player");
            }
          

            event.preventDefault(); // Предотвращаем стандартное поведение пробела (например, прокрутка)
            addNextBlock();
            textContainer.scrollTo(0, textContainer.scrollHeight+100); // Прокручиваем к началу
        }
        else if (event.code === 'KeyR') {
            Player.repeat();
        }
        else if (event.code === 'KeyS') {
            Player.stop();
        }
    });
    
    // Инициализация с первой пачки
    fetchTextBatch((batch) => {
        currentBatch = batch;
    });
    
}


export {setupTextAudio};



