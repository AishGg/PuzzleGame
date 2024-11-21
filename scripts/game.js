export class Game {

    constructor() {
        this.level = 1;
        this.currentPuzzle = {};
        this.currentHintIndex = 0;
        this.currentRiddle = {};
        this.currentQuestion = {};
        this.currentMusic = './sounds/sound2.mp3'
    }

   startGame(){
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
            // console.log(data);
            // Select stories or riddles based on 'type'
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
        container.innerHTML = ''; // Clear existing options if any

        options.forEach((option, index) => {
            // Create a label and input for each option
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `option${index}`;
            checkbox.value = option;

            const label = document.createElement('label');
            label.htmlFor = `option${index}`;
            label.textContent = option;

            // Append the checkbox and label to the container
            container.appendChild(checkbox);
            container.appendChild(label);
        });
    }

    createHintCanvas() {

    }

    getHint() {
        if (this.currentHintIndex >= this.currentPuzzle.hints.length) {
            // Clear the canvas and display "No more hints"
            const canvas = document.getElementById('hintCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

            ctx.fillStyle = '#333'; // Set text color
            ctx.font = 'bold 24px ComicNeue-Regular'; // Set font style to bold and larger size
            ctx.textAlign = 'center'; // Center text alignment
            ctx.fillText('No more hints', canvas.width / 2, canvas.height / 2); // Display message

            return; // Exit the function
        }
        document.querySelector('.options').style.display = 'none';
        // Get the existing canvas from HTML
        const canvas = document.getElementById('hintCanvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size based on game div (increased size)
        const gameDiv = document.querySelector('.game');
        canvas.width = gameDiv.offsetWidth * 0.85;  // Changed to 85% of game width
        canvas.height = gameDiv.offsetHeight * 0.7; // Changed to 70% of game height

        // Position canvas
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.top = '40%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translateX(-50%)';
        canvas.style.zIndex = '1000';

        // Clear any previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw cloud shape with flat bottom
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.3, canvas.height * 0.7);  // Start at 30% from left

        // Left curve up
        ctx.bezierCurveTo(
            canvas.width * 0.3, canvas.height * 0.2,    // Control point 1: much higher up
            canvas.width * 0.4, canvas.height * 0.2,    // Control point 2: right at top
            canvas.width * 0.4, canvas.height * 0.3     // End point: top-left bump
        );

        // Middle curve
        ctx.bezierCurveTo(
            canvas.width * 0.45, canvas.height * 0.15,  // Control point 1: even higher up
            canvas.width * 0.55, canvas.height * 0.15,  // Control point 2: even higher up
            canvas.width * 0.6, canvas.height * 0.3     // End point: top-right bump
        );

        // Right curve down
        ctx.bezierCurveTo(
            canvas.width * 0.6, canvas.height * 0.2,    // Control point 1: keeping curve
            canvas.width * 0.7, canvas.height * 0.2,    // Control point 2: right side
            canvas.width * 0.7, canvas.height * 0.7     // End point: bottom-right
        );

        // Straight line to close the bottom
        ctx.lineTo(canvas.width * 0.3, canvas.height * 0.7);

        // Fill cloud with a new light color
        ctx.fillStyle = 'rgba(173, 216, 230, 0.95)'; // Changed to a light blue color
        ctx.fill();

        // Draw close button
        const btnX = canvas.width * 0.7;
        const btnY = canvas.height * 0.3;
        const btnRadius = 15;

        ctx.beginPath();
        ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();

        // Draw X
        ctx.beginPath();
        ctx.moveTo(btnX - 8, btnY - 8);
        ctx.lineTo(btnX + 8, btnY + 8);
        ctx.moveTo(btnX + 8, btnY - 8);
        ctx.lineTo(btnX - 8, btnY + 8);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add hint text with proper wrapping and positioning
        ctx.fillStyle = '#333';
        ctx.font = '24px ComicNeue-Regular';
        ctx.textAlign = 'center';  // Enable center text alignment

        // Calculate text boundaries relative to cloud shape
        const textAreaWidth = canvas.width * 0.3;  // 30% of canvas width for text
        const lineHeight = 25;
        const centerX = canvas.width * 0.5;        // Center of canvas for text alignment
        let startY = canvas.height * 0.35;         // Start text at 35% from top
        const maxY = canvas.height * 0.65;         // Don't let text go below 65% height

        // Word wrap text

        const words = this.currentPuzzle.hints[this.currentHintIndex].split(' ');
        this.currentHintIndex++;
        let line = '';
        let y = startY;
        let lines = [];  // Store lines for centering vertically

        // First pass: collect all lines
        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > textAreaWidth) {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());  // Add the last line

        // Calculate vertical center position
        const totalTextHeight = lines.length * lineHeight;
        const cloudHeight = maxY - startY;
        let currentY = startY + (cloudHeight - totalTextHeight) / 2;

        // Second pass: render centered text
        for (let i = 0; i < lines.length; i++) {
            if (currentY + lineHeight > maxY) {
                // Add ellipsis to last visible line if truncated
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

        // Add click handler
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if click is within close button
            const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));
            if (distance <= btnRadius) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = 'none';
                document.querySelector('.options').style.display = 'flex';
            }
        };

        // Add hover effect
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
                // Clear the options
                const container = document.querySelector('.puzzleOptions');
                container.innerHTML = ''; // Clear existing options
                // Hide feedback
                document.querySelector('.feedback').style.display = 'none';
                // Fetch and display the riddle
                this.getRiddles();
            } else {
                document.querySelector('.incorrectFeedback').style.display = 'flex';
                document.querySelector('.main').classList.add('blur');
            }
        } else {
            document.getElementById('selectOption').style.display = 'block'; // Alert if no option is selected
        }
    }


    checkRiddleAnswer() {
        const selectedOption = Array.from(document.querySelectorAll('.puzzleOptions input[type="checkbox"]'))
            .find(checkbox => checkbox.checked); // Find the checked checkbox

        if (selectedOption) {
            if (selectedOption.value === this.currentRiddle.correctAnswer) {
                console.log('Correct answer! Fetching question...');
                this.currentRiddle = {};
                document.getElementById('selectOption').style.display = 'none';
                // Clear the options
                const container = document.querySelector('.puzzleOptions');
                container.innerHTML = ''; // Clear existing options
                // Hide feedback
                document.querySelector('.feedback').style.display = 'none';
                // Fetch and display the riddle
                this.getTriviaQuestions(); // Fetch and display a brainteaser after checking the riddle answer
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
            .find(checkbox => checkbox.checked); // Find the checked checkbox

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
            document.getElementById('selectOption').style.display = 'block'; // Alert if no option is selected
        }
    }

}

