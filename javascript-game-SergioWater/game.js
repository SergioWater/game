// <!-- 
// Sergio Aguilar 
// 921140724
// SergioWater
//  -->


// Game Variables
let lastHole;
let timeUp = false;
let score = 0;
let countdownDuration = 5; // Initial countdown duration
let countdown; // Holds the countdown interval ID

// DOM Elements
const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-game-button');
const restartButton = document.getElementById('restart-game-button');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');

// Utility Functions

//randomize where the mole comes out from
function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}
//speeding up the timer
function determineCountdownDuration(score) {
    if (score < 5) return 5;
    if (score < 10) return 4;
    if (score < 15) return 3;
    if (score < 20) return 2;
    return 1; // Minimum of 1 second
}

// Game Logic Functions

//start game 
function startGame() {
    scoreBoard.textContent = 'Score: 0';
    timeUp = false;
    score = 0;
    countdownDuration = 5;
    startButton.style.display = 'none';
    gameOverDisplay.style.display = 'none';
    startCountdown();
    peep();
}
//how the mole comes from the hole
function peep() {
    const time = Math.random() * 2000 + 500; // random every 2.5 sec
    const hole = randomHole(holes);
    hole.classList.add('up');
    //timer
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time );
}

function whack(e) {
    if (!e.isTrusted || !this.parentNode.classList.contains('up')) return;
    score++;
    scoreBoard.textContent = `Score: ${score}`;
    adjustCountdown();
    this.parentNode.classList.remove('up');
    clearInterval(countdown); //clears countdown
    countdownDuration = determineCountdownDuration(score);
    startCountdown();
}

function startCountdown() {
    clearInterval(countdown);
    countdown = setInterval(() => {
        timerDisplay.textContent = `Time: ${countdownDuration}`;
        countdownDuration -= 1;
        
        if (countdownDuration < 0) {
            clearInterval(countdown);
            timeUp = true;
            showGameOver();
        }
    }, 1000);
}
//timer change
function adjustCountdown() {
    countdownDuration = determineCountdownDuration(score);
}

function showGameOver() {
    gameOverDisplay.style.display = 'block';
    finalScoreDisplay.textContent = score;
    restartButton.style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    //start game
    startButton.addEventListener('click', startGame);
    //restart game
    restartButton.addEventListener('click', () => {
        gameOverDisplay.style.display = 'none';
        startGame();
    });
    
    holes.forEach(hole => {
        //whack function for everytime i press a hole
        const mole = hole.querySelector('.mole');
        mole.addEventListener('click', whack);
    });
});
