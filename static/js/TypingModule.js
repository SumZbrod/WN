

export function typeEffect(element, text) {
    const textContainer = document.getElementById('text-container');
    const totalChars = text.length;
    let interval = 30;
    let currentChar = 0;

    element.textContent = ''; // Очистка текста перед началом анимации

    const typingInterval = setInterval(() => {
        if (currentChar < totalChars) {
            element.textContent += text[currentChar];
            currentChar++;
        } else {
            clearInterval(typingInterval);
        }
        textContainer.scrollTop = textContainer.scrollHeight;
    }, interval);
}