import { Game } from './game.js';
let game;

const musicTracks = [
    './sounds/sound1.mp3',
    './sounds/sound2.mp3'
];

let currentTrackIndex = 0;

window.addEventListener('click', (e) => {

});

window.addEventListener('load', function () {

    game = new Game();
    game.getPuzzles();


    const audioElement = document.querySelector('audio');
    audioElement.src = musicTracks[currentTrackIndex];
    audioElement.play();


    window.addEventListener('click', (e) => {
        if (e.target.id === 'restartButton') {
            document.querySelector('.gameEnd').style.display = 'none';
            document.querySelector('.startPage').style.display = 'flex';
            document.querySelector('.main').style.display = 'none';
        }
    });

    window.addEventListener('click', (e) => {

        if (e.target.id === 'startButton') {
            game.startGame();
            document.querySelector('.startPage').style.display = 'none';
            document.querySelector('.main').style.display = 'block';

            const audioElement = document.querySelector('audio');
            audioElement.src = musicTracks[currentTrackIndex];
            audioElement.volume = 0.1;
            audioElement.play();
        }



        if (e.target.id === 'volume') {
            const volumeValue = document.querySelector('audio').volume;
            if (volumeValue === 0) {
                document.querySelector('audio').volume = 1;
                document.getElementById('volume').src = "./images/volume.png";
            } else {
                document.querySelector('audio').volume = 0;
                document.getElementById('volume').src = "./images/silent.png";
            }
        }

        if (e.target.id === 'ChangeMusic') {
            currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
            audioElement.src = musicTracks[currentTrackIndex];
            audioElement.play()
        }

        if (e.target.id === 'settButton') {
            document.querySelector('.settings').style.display = 'flex';
            document.querySelector('.main').classList.add('blur');

        }

        if (e.target.id === 'closeSettings') {
            document.querySelector('.settings').style.display = 'none';
            document.querySelector('.main').classList.remove('blur');
        }

        if (e.target.id === 'hintButton') {
            game.getHint();
        }

        if (e.target.id === 'submit') {
            if (game.currentPuzzle.title) {
                game.checkAnswer();
            } else if (game.currentRiddle.description) {
                game.checkRiddleAnswer();
            } else if (game.currentQuestion.description) {
                game.checkTriviaQuestion();
            }
        }

        if (e.target.id === 'nextLevel') {
            game.nextLevel();
        }

        if (e.target.id === 'tryAgain') {
            document.querySelector('.main').classList.remove('blur');
            document.querySelector('.incorrectFeedback').style.display = 'none';
        }


        if (e.target.type === 'checkbox') {
            const checkboxes = document.querySelectorAll('.puzzleOptions input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox !== e.target) {
                    checkbox.checked = false;
                }
            });
        }
    });



});