import { Game } from './game.js';
let game;

window.addEventListener('load', function () {

    game = new Game();
    game.getPuzzles();

    
    window.addEventListener('click', (e) => {

        if (e.target.id === 'settButton') {
            document.querySelector('.settings').style.display = 'flex';
        }
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelector('.settings').style.display = 'none';
            }
        });
                    
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
            }
        }

        if (e.target.id === 'nextLevel') {
            game.nextLevel();
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