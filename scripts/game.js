export class Game{

    constructor(){
        this.level = 1;
        this.currentPuzzle = {};
        this.currentHintIndex = 0;
    }

    getLevel(){
        return this.level;
    }
    nextLevel(){
        this.level++;
        document.getElementById('level').innerText = `Level ${this.level}`;
        document.querySelector('.feedback').style.display = 'none';
        this.getPuzzles();
    }

    async getPuzzles() {
        try {
            const response = await fetch('../puzzles.json');
            const data = await response.json();
            
            data.puzzles.filter(puzzle =>{
                if(puzzle.level === this.level){
                    this.currentPuzzle = puzzle;
                    this.currentHintIndex = 0;
                    this.displayPuzzle();
                }
            } );
        } catch (error) {
            console.error('Error loading puzzles:', error);
            return [];
        }
    }

    displayPuzzle(){
        console.log(this.currentPuzzle);
        document.getElementById('question').innerHTML = this.currentPuzzle.question;
    }

    createHintCanvas(){

    }

    getHint() {
        if(this.currentHintIndex >= this.currentPuzzle.hints.length){
            alert('No more hints available');
            return;
        }
        document.querySelector('.answerBox').style.display = 'none';
        // Get the existing canvas from HTML
        const canvas = document.getElementById('hintCanvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size based on game div
        const gameDiv = document.querySelector('.game');
        canvas.width = gameDiv.offsetWidth * 0.8;  // 80% of game width
        canvas.height = gameDiv.offsetHeight * 0.6; // 60% of game height

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

        // Fill cloud
        ctx.fillStyle = 'rgba(220, 220, 220, 0.95)';
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
        ctx.font = '16px ComicNeue-Regular';
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
                document.querySelector('.answerBox').style.display = 'flex';
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

    checkAnswer(){  
        if(document.getElementById('answer').value === this.currentPuzzle.answer){
            document.querySelector('.feedback').style.display = 'flex';
            document.getElementById('answer').value = '';
        }else{
            alert('Incorrect');
        }
    }
}

