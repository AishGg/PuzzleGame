import { Game } from './game.js';
let game;

const musicTracks = [
    './sounds/sound1.mp3', // Replace with your actual music file paths
    './sounds/sound2.mp3'
];

let currentTrackIndex = 0;

window.addEventListener('load', function () {

    game = new Game();
    game.getPuzzles();
    
    
    const audioElement = document.querySelector('audio');
    audioElement.src = musicTracks[currentTrackIndex];
    audioElement.play();

    
    window.addEventListener('click', (e) => {

      
        if (e.target.id === 'volume') {
            const volumeValue = document.querySelector('audio').volume;
            if(volumeValue ===0){
                document.querySelector('audio').volume = 1;
                document.getElementById('volume').src = "./volume.png";
            }else{
                document.querySelector('audio').volume = 0;
                document.getElementById('volume').src = "./silent.png";
            }
        }

        if (e.target.id === 'ChangeMusic') { // Check if the close button is clicked
            currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length; // Move to the next track
            audioElement.src = musicTracks[currentTrackIndex]; // Update the audio source
            audioElement.play()
        }

        if (e.target.id === 'settButton') {
            document.querySelector('.settings').style.display = 'flex';
            document.querySelector('.main').classList.add('blur');
            
        }

        if (e.target.id === 'closeSettings') { // Check if the close button is clicked
            document.querySelector('.settings').style.display = 'none'; // Hide settings
            document.querySelector('.main').classList.remove('blur');
        }
                    
        if (e.target.id === 'levels') {
            alert("you clicked the img");
        }

        if (e.target.id === 'hintButton') {
            game.getHint();
        }

        if (e.target.id === 'submit') {
            if (game.currentPuzzle.title) {
                game.checkAnswer();
            } else if (game.currentRiddle.description) {
                game.checkRiddleAnswer();
            }else if (game.currentQuestion.description) {
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