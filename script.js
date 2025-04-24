const items = [
    { text: "Tralalero Tralala", image: "assets/images/1.webp", sound: "assets/sounds/1.mp3" },
    { text: "Trippi Troppi Troppa Trippa", image: "assets/images/2.webp", sound: "assets/sounds/2.mp3" },
    { text: "Tung tung tung sahur", image: "assets/images/3.webp", sound: "assets/sounds/3.mp3" },
    { text: "Ballerina Cappuccina", image: "assets/images/4.webp", sound: "assets/sounds/4.mp3" },
    { text: "Bombombini Gusini", image: "assets/images/5.webp", sound: "assets/sounds/5.mp3" },
    { text: "Brr brr Patapim", image: "assets/images/6.webp", sound: "assets/sounds/6.mp3" },
    { text: "Capuchino Assassino", image: "assets/images/7.webp", sound: "assets/sounds/7.mp3" },
    { text: "Lirilì Larilà", image: "assets/images/8.webp", sound: "assets/sounds/8.mp3" },
    { text: "Bobritto bandito", image: "assets/images/9.webp", sound: "assets/sounds/9.mp3" },
    { text: "Bombardiro Crocodillo", image: "assets/images/10.webp", sound: "assets/sounds/10.mp3" },
    { text: "La Vaca Saturno Saturnita", image: "assets/images/11.webp", sound: "assets/sounds/11.mp3" },
    { text: "Boneca Ambalabu", image: "assets/images/12.webp", sound: "assets/sounds/12.mp3" },
    { text: "Chimpanzini Bananini", image: "assets/images/13.webp", sound: "assets/sounds/13.mp3" },
    { text: "Frigo Camelo", image: "assets/images/14.webp", sound: "assets/sounds/14.mp3" },
    { text: "U Din Din Din Din Dun Ma Din Din Din Dun", image: "assets/images/15.webp", sound: "assets/sounds/15.mp3" },
    { text: "Trulimero Trulicina", image: "assets/images/16.webp", sound: "assets/sounds/16.mp3" },
    { text: "Garamaraman dan Madudungdung tak tuntung perkuntung", image: "assets/images/17.webp", sound: "assets/sounds/17.mp3" },
    { text: "Girafa Celestre Viaggio Agreste", image: "assets/images/18.webp", sound: "assets/sounds/18.mp3" },
    { text: "Trippa Troppa Tralala Lirilì Rilà Tung Tung Sahur Boneca Tung Tung Tralalelo Trippi Troppa Crocodina", image: "assets/images/19.webp", sound: "assets/sounds/19.mp3" },
];

let questions = [];
let shuffledQuestions = [];
let currentQuestion = 0;
let score = 0;
let startTime;
let timerInterval;

const startButton = document.getElementById("start-button");
const quizContainer = document.getElementById("quiz-container");
const startScreen = document.getElementById("start-screen");
const questionText = document.getElementById("question-text");
const imageGrid = document.getElementById("image-grid");
const timerDisplay = document.getElementById("timer");
const resultScreen = document.getElementById("result-screen");
const resultScore = document.getElementById("result-score");
const resultTime = document.getElementById("result-time");

startButton.addEventListener("click", () => {
    startScreen.classList.remove("flex");
    startScreen.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    quizContainer.classList.add("flex");
    questions = generateQuestions(10); // Сколько хочешь вопросов
    shuffledQuestions = shuffleArray(questions);
    currentQuestion = 0;
    score = 0;
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    showQuestion();
});

window.addEventListener("load", () => {
    preloadAssets();
});


function preloadAssets() {
    items.forEach(item => {
        // Предзагрузка изображения
        const img = new Image();
        img.src = item.image;

        // Предзагрузка звука
        const audio = new Audio();
        audio.src = item.sound;
        audio.preload = "auto";
    });
}

function generateQuestions(count = 5) {
    const usedIndices = new Set();
    const result = [];

    while (result.length < count && usedIndices.size < items.length) {
        const correctIndex = Math.floor(Math.random() * items.length);
        if (usedIndices.has(correctIndex)) continue;

        const correctItem = items[correctIndex];
        usedIndices.add(correctIndex);

        const incorrectOptions = items
            .filter((_, i) => i !== correctIndex)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(item => item.image);

        result.push({
            text: correctItem.text,
            sound: correctItem.sound,
            correctImage: correctItem.image,
            incorrectImages: incorrectOptions
        });
    }

    return result;
}

function showQuestion() {
    const q = shuffledQuestions[currentQuestion];
    questionText.textContent = q.text;

    const audio = new Audio(q.sound);
    const audio_success = new Audio("assets/sounds/success.mp3");
    const audio_error = new Audio("assets/sounds/error.mp3");
    audio.play();

    imageGrid.innerHTML = "";
    const allImages = shuffleArray([q.correctImage, ...q.incorrectImages]);

    allImages.forEach(imgSrc => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("image-option");

        img.addEventListener("click", () => {
            audio.pause()
            const isCorrect = imgSrc === q.correctImage;
            img.classList.add(isCorrect ? "correct" : "wrong");

            // Заблокировать остальные после выбора
            Array.from(document.querySelectorAll('.image-option')).forEach(option => {
                option.style.pointerEvents = "none";
            });

            if (isCorrect) {
                score++;
                audio_success.play();
            } else {
                audio_error.play();
            }

            setTimeout(() => {
                audio_success.pause()
                audio_error.pause()
                currentQuestion++;
                if (currentQuestion < shuffledQuestions.length) {
                    showQuestion();
                } else {
                    endQuiz();
                }
            }, 1000);
        });

        imageGrid.appendChild(img);
    });
}

function endQuiz() {
    clearInterval(timerInterval);
    quizContainer.classList.remove("flex");
    quizContainer.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    resultScreen.classList.add("flex");
    resultScore.textContent = `Правильных ответов: ${score} из ${shuffledQuestions.length}`;
    resultTime.textContent = `Время: ${timerDisplay.textContent}`;
}

function updateTimer() {
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}
