export function typeEffect(element, text) {
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
    }, interval);
}