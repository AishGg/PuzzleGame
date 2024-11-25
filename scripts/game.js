export class Game {

    constructor() {
        this.level = 1;
        this.currentPuzzle = {};
        this.currentHintIndex = 0;
        this.currentRiddle = {};
        this.currentQuestion = {};
        this.currentMusic = './sounds/sound2.mp3';
        this.words = []
    }

    startGame() {
        this.level = 1;
        document.getElementById('level').innerText = `Level ${this.level}`;
        this.getPuzzles();
    }

    getLevel() {
        return this.level;
    }


    nextLevel() {
        this.level++;
        document.getElementById('level').innerText = `Level ${this.level}`;
        document.querySelector('.feedback').style.display = 'none';
        document.querySelector('.main').classList.remove('blur');
        this.getPuzzles();
    }

    async getPuzzles() {
        try {
            const response = await fetch('../puzzle_data.json');
            const data = await response.json();
            const puzzles = data.stories;
            const key = `story${this.level}`;
            if (puzzles.hasOwnProperty(key)) {
                this.currentPuzzle = puzzles[key];
                console.log(this.currentPuzzle);
                this.currentHintIndex = 0;
                this.displayPuzzle();
                this.displayOptions(this.currentPuzzle.options);
            }
            else {
                document.querySelector('.gameEnd').style.display = 'flex';
                document.querySelector('.main').style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading puzzles:', error);
        }
    }
    async getRiddles() {
        try {
            const response = await fetch('../puzzle_data.json');
            const data = await response.json();
            const riddles = data.riddles;

            const key = `riddle${this.level}`;
            if (riddles.hasOwnProperty(key)) {
                this.currentRiddle = riddles[key];
                console.log(this.currentRiddle);
                this.currentHintIndex = 0;
                this.displayRiddle();
                this.displayOptions(this.currentRiddle.options);
            } else {
                console.warn('No riddles found for the specified level');
            }
        } catch (error) {
            console.error('Error loading riddle:', error);
        }
    }
    async getTriviaQuestions() {
        try {
            const response = await fetch('../puzzle_data.json');
            const data = await response.json();
            const triviaQuestions = data.triviaQuestions;
            console.log(triviaQuestions)

            const key = `question${this.level}`;
            console.log(key);
            if (triviaQuestions.hasOwnProperty(key)) {
                this.currentQuestion = triviaQuestions[key];
                console.log(this.currentQuestion);
                this.currentHintIndex = 0;
                this.displaytriviaQuestion();
                this.displayOptions(this.currentQuestion.options);
            } else {
                console.warn('No riddles found for the specified level');
            }
        } catch (error) {
            console.error('Error loading riddle:', error);
        }
    }


    displayPuzzle() {
        document.getElementById('title').innerHTML = this.currentPuzzle.title;
        document.getElementById('question').innerHTML = this.currentPuzzle.description;
    }
    displayRiddle() {
        document.getElementById('title').innerText = "Time for Riddle"
        document.getElementById('question').innerHTML = this.currentRiddle.description;
    }
    displaytriviaQuestion() {
        document.getElementById('title').innerText = "One Quick Genral Question"
        document.getElementById('question').innerHTML = this.currentQuestion.description;
    }


    displayOptions(options) {
        const container = document.querySelector('.puzzleOptions');
        container.innerHTML = '';

        options.forEach((option, index) => {

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `option${index}`;
            checkbox.value = option;

            const label = document.createElement('label');
            label.htmlFor = `option${index}`;
            label.textContent = option;

            container.appendChild(checkbox);
            container.appendChild(label);
        });
    }

    createHintCanvas() {

    }

    getHint() {
        if (this.currentHintIndex >= this.currentPuzzle.hints.length) {
            this.words = ["No", "More", "Hints"];
        } else {
            this.words = this.currentPuzzle.hints[this.currentHintIndex].split(' ');
        }
        document.querySelector('.options').style.display = 'none';

        const canvas = document.getElementById('hintCanvas');
        const ctx = canvas.getContext('2d');


        const gameDiv = document.querySelector('.game');
        canvas.width = gameDiv.offsetWidth * 0.85;
        canvas.height = gameDiv.offsetHeight * 0.7;

        // Position canvas
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.top = '40%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translateX(-50%)';
        canvas.style.zIndex = '1000';

        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.3, canvas.height * 0.7);

        // Left curve up
        ctx.bezierCurveTo(
            canvas.width * 0.3, canvas.height * 0.2,
            canvas.width * 0.4, canvas.height * 0.2,
            canvas.width * 0.4, canvas.height * 0.3
        );

        // Middle curve
        ctx.bezierCurveTo(
            canvas.width * 0.45, canvas.height * 0.15,
            canvas.width * 0.55, canvas.height * 0.15,
            canvas.width * 0.6, canvas.height * 0.3
        );

        // Right curve down
        ctx.bezierCurveTo(
            canvas.width * 0.6, canvas.height * 0.2,
            canvas.width * 0.7, canvas.height * 0.2,
            canvas.width * 0.7, canvas.height * 0.7
        );

       
        ctx.lineTo(canvas.width * 0.3, canvas.height * 0.7);

        
        ctx.fillStyle = 'rgba(173, 216, 230, 0.95)';
        ctx.fill();

        
        const btnX = canvas.width * 0.7;
        const btnY = canvas.height * 0.3;
        const btnRadius = 15;

        ctx.beginPath();
        ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();

        
        ctx.beginPath();
        ctx.moveTo(btnX - 8, btnY - 8);
        ctx.lineTo(btnX + 8, btnY + 8);
        ctx.moveTo(btnX + 8, btnY - 8);
        ctx.lineTo(btnX - 8, btnY + 8);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        
        ctx.fillStyle = '#333';
        ctx.font = '24px ComicNeue-Regular';
        ctx.textAlign = 'center';

        
        const textAreaWidth = canvas.width * 0.3;
        const lineHeight = 25;
        const centerX = canvas.width * 0.5;
        let startY = canvas.height * 0.35;
        const maxY = canvas.height * 0.65;

        this.currentHintIndex++;
        let line = '';
        let y = startY;
        let lines = [];

        
        for (const word of this.words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > textAreaWidth) {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());

        
        const totalTextHeight = lines.length * lineHeight;
        const cloudHeight = maxY - startY;
        let currentY = startY + (cloudHeight - totalTextHeight) / 2;

        
        for (let i = 0; i < lines.length; i++) {
            if (currentY + lineHeight > maxY) {
                
                let lastLine = lines[i - 1];
                const ellipsis = '...';
                while (ctx.measureText(lastLine + ellipsis).width > textAreaWidth) {
                    lastLine = lastLine.slice(0, -1);
                }
                ctx.fillText(lastLine + ellipsis, centerX, currentY - lineHeight);
                break;
            }
            ctx.fillText(lines[i], centerX, currentY);
            currentY += lineHeight;
        }

       
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            
            const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));
            if (distance <= btnRadius) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = 'none';
                document.querySelector('.options').style.display = 'flex';
            }
        };

        
        canvas.onmousemove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));
            canvas.style.cursor = distance <= btnRadius ? 'pointer' : 'default';
        };
    }

    checkAnswer() {
        const selectedOption = Array.from(document.querySelectorAll('.puzzleOptions input[type="checkbox"]'))
            .find(checkbox => checkbox.checked);
        console.log(selectedOption);
        console.log(this.currentRiddle.correctAnswer);

        if (selectedOption) {
            if (selectedOption.value === this.currentPuzzle.correctAnswer) {
                console.log('Correct answer! Fetching riddle...');
                this.currentPuzzle = {};
                document.getElementById('selectOption').style.display = 'none';
                
                const container = document.querySelector('.puzzleOptions');
                container.innerHTML = '';
                
                document.querySelector('.feedback').style.display = 'none';
                
                this.getRiddles();
            } else {
                document.querySelector('.incorrectFeedback').style.display = 'flex';
                document.querySelector('.main').classList.add('blur');
            }
        } else {
            document.getElementById('selectOption').style.display = 'block';
        }
    }


    checkRiddleAnswer() {
        const selectedOption = Array.from(document.querySelectorAll('.puzzleOptions input[type="checkbox"]'))
            .find(checkbox => checkbox.checked); 

        if (selectedOption) {
            if (selectedOption.value === this.currentRiddle.correctAnswer) {
                console.log('Correct answer! Fetching question...');
                this.currentRiddle = {};
                document.getElementById('selectOption').style.display = 'none';
                
                const container = document.querySelector('.puzzleOptions');
                container.innerHTML = '';
               
                document.querySelector('.feedback').style.display = 'none';
                
                this.getTriviaQuestions();
            } else {
                document.querySelector('.main').classList.add('blur');
                document.querySelector('.incorrectFeedback').style.display = 'flex';
            }
        } else {
            document.getElementById('selectOption').style.display = 'block';
        }
    }
    checkTriviaQuestion() {
        const selectedOption = Array.from(document.querySelectorAll('.puzzleOptions input[type="checkbox"]'))
            .find(checkbox => checkbox.checked);
        if (selectedOption) {
            if (selectedOption.value === this.currentQuestion.correctAnswer) {
                document.getElementById('selectOption').style.display = 'none';
                document.querySelector('.feedback').style.display = 'flex';
                document.querySelector('.main').classList.add('blur');
            } else {
                document.querySelector('.main').classList.add('blur');
                document.querySelector('.incorrectFeedback').style.display = 'flex';
            }
        } else {
            document.getElementById('selectOption').style.display = 'block';
        }
    }

}

