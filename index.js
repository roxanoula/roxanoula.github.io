//default game setup
let squares = []
let currentSnake = [2,1,0]
let direction = 1
const width = 20
let appleIndex = 0
let score = 0
let intervalTime = 300
let speed = 0.9
let timerId = 0
let maxTableSize = 20
let minScore = 0
const right = 1
const left = -1
const up = -width
const down = width


//default game elements
const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const scoreDisplay = document.getElementById('score')
const topScoresTable = document.getElementById("historical-scores");

function createGrid() {
    for (let i=0; i < width*width; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        grid.appendChild(square)  
        squares.push(square)
    }
}

function createHistoricalEntry() {
    var tableSize = topScoresTable.rows.length;
    if (tableSize == maxTableSize+1) {
        if (score <  computeMinScore()) return;
        for (let idx=tableSize-1; idx > 1; idx--) {
            var currentScore = parseInt(topScoresTable.rows[idx].cells[1].innerHTML)
            if (currentScore === minScore) {
                topScoresTable.deleteRow(idx);
                minScore = computeMinScore();
                break;
            }
        }
    }

    var row = topScoresTable.insertRow(1);
    var dateCell = row.insertCell(0);
    var scoreCell = row.insertCell(1);
    let currentDateAndTime = new Date().toLocaleString();
    dateCell.innerHTML = currentDateAndTime;
    scoreCell.innerHTML = score;  
}

function startRestartGame() {
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[appleIndex].classList.remove('apple')
    clearInterval(timerId)
    currentSnake = [2,1,0]
    score = 0
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 300
    generateApple()
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    timerId = setInterval(move, intervalTime)
}

function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
} 

createGrid()
startRestartGame()

function move() {
    if (
        (currentSnake[0] + width >= width*width && direction === down) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === right) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === left) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === up) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake')
    ) {
        if (minScore > score) minScore = score

        scoreDisplay.textContent = score + " --> " + "Game Over ! "
        
        createHistoricalEntry()
        return clearInterval(timerId)
    }
   

    const tail = currentSnake.pop()
    squares[tail].classList.remove('snake')
    currentSnake.unshift(currentSnake[0] + direction)
    
    if (squares[currentSnake[0]].classList.contains('apple')) {
        squares[currentSnake[0]].classList.remove('apple')
        squares[tail].classList.add('snake')
        currentSnake.push(tail)

        generateApple()
        score++
        scoreDisplay.textContent = score
        clearInterval(timerId)

        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
    }
    
    squares[currentSnake[0]].classList.add('snake')
}

// 39 is right arrow
// 38 is for the up arrow
// 37 is for the left arrow
// 40 is for the down arrow

function control(e) {
    if (e.keyCode === 39) {
        direction = right
    } else if (e.keyCode === 38) {
        direction = up
    } else if (e.keyCode === 37) {
        direction = left
    } else if (e.keyCode === 40) {
        direction = down
    }
}

function computeMinScore() {
    if (topScoresTable.rows.length == 1) return minScore;

    var min = parseInt(topScoresTable.rows[1].cells[1].innerHTML);
    for (let idx=2; idx < topScoresTable.rows.length; idx++) {
        var rowScore = parseInt(topScoresTable.rows[idx].cells[1].innerHTML)
        if (rowScore < min) {
                min = rowScore
            }
    }

    return min
}

document.addEventListener('keyup', control)
startButton.addEventListener('click', startRestartGame)