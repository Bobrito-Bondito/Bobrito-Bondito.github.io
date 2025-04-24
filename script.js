const items = [
    { text: "Tralalero Tralala", image: "assets/images/1.webp", sound: "assets/sounds/1.mp3" },
    { text: "Trippi Troppi Troppa Trippa", image: "assets/images/2.webp", sound: "assets/sounds/2.mp3" },
    { text: "Tung tung tung sahur", image: "assets/images/3.webp", sound: "assets/sounds/3.mp3" },
    { text: "Ballerina Cappuccina", image: "assets/images/4.webp", sound: "assets/sounds/4.mp3" },
    { text: "Bombombini Gusini", image: "assets/images/5.webp", sound: "assets/sounds/5.mp3" },
    { text: "Brr brr Patapim", image: "assets/images/6.webp", sound: "assets/sounds/6.mp3" },
    { text: "Capuchino Assassino", image: "assets/images/7.webp", sound: "assets/sounds/7.mp3" },
    { text: "Lirilì Larilà", image: "assets/images/8.webp", sound: "assets/sounds/8.mp3" },
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
    questions = generateQuestions(5); // Сколько хочешь вопросов
    shuffledQuestions = shuffleArray(questions);
    currentQuestion = 0;
    score = 0;
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    showQuestion();
});

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

    if (q.sound) {
        const audio = new Audio(q.sound);
        audio.play();
    }

    imageGrid.innerHTML = "";
    const allImages = shuffleArray([q.correctImage, ...q.incorrectImages]);

    allImages.forEach(imgSrc => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("image-option");

        img.addEventListener("click", () => {
            const isCorrect = imgSrc === q.correctImage;
            img.classList.add(isCorrect ? "correct" : "wrong");

            // Заблокировать остальные после выбора
            Array.from(document.querySelectorAll('.image-option')).forEach(option => {
                option.style.pointerEvents = "none";
            });

            if (isCorrect) score++;

            setTimeout(() => {
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
