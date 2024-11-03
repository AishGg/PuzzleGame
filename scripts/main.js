import { Game } from './game.js';
let game;

window.addEventListener('load', function () {

    game = new Game();
    game.getPuzzles();

    
    window.addEventListener('click', (e) => {

        if (e.target.id === 'settButton') {
            document.querySelector('.settings').style.display = 'flex';
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
            game.checkAnswer();
        }
        if (e.target.id === 'nextLevel') {
            game.nextLevel();
        }
        
    });











});