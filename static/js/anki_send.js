export async function trimAndSendAudio(voicePath, startTime = 0, audioFilename = "trimmed.ogg") {
    // 1. Загрузим и декодируем звук
    const audioContext = new AudioContext();
    const response = await fetch(voicePath);
    const arrayBuffer = await response.arrayBuffer();
    const originalBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 2. Вычислим сэмплы для обрезки
    const sampleRate = originalBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = originalBuffer.length;
    const frameCount = endSample - startSample;

    // 3. Создаём новый AudioBuffer с вырезанным участком
    const trimmedBuffer = audioContext.createBuffer(
        originalBuffer.numberOfChannels,
        frameCount,
        sampleRate
    );

    for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
        const trimmedData = trimmedBuffer.getChannelData(channel);
        const originalData = originalBuffer.getChannelData(channel);
        trimmedData.set(originalData.slice(startSample, endSample));
    }

    // 4. Проигрываем и записываем через MediaRecorder
    const dest = audioContext.createMediaStreamDestination();
    const source = audioContext.createBufferSource();
    source.buffer = trimmedBuffer;
    source.connect(dest);

    const mediaRecorder = new MediaRecorder(dest.stream, { mimeType: 'audio/ogg' });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    const recordingPromise = new Promise((resolve) => {
        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'audio/ogg' });
            const arrayBuffer = await blob.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            const base64 = btoa(String.fromCharCode(...bytes));

            // Отправляем в Anki
            await fetch("http://127.0.0.1:8765", {
                method: "POST",
                body: JSON.stringify({
                    action: "storeMediaFile",
                    version: 6,
                    params: {
                        filename: audioFilename,
                        data: base64
                    }
                })
            });

            resolve();
        };
    });

    mediaRecorder.start();
    source.start();
    source.onended = () => mediaRecorder.stop();

    await recordingPromise;
}
