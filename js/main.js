'use strict'
window.addEventListener("contextmenu", e => e.preventDefault());

var winAudio = new Audio('sound/win.wav');
var gameOverAudio = new Audio('sound/game-over.wav');


const NORMAL = '😄'
const Sad = '🤯'
const Sunglasses = '😎'

const MINES = 'MINES'
const FLAG = 'FLAG'

const MINES_IMG = '\n\t\t<img class="icon" src="img/MINES.png">\n'
const FLAG_IMG = '\n\t\t<img class="icon" src="img/FLAG.png">\n'

const HEART1 = '\n\t\t<img class="icon" src="img/heart1.png">\n'
const HEART2 = '\n\t\t<img class="icon" src="img/heart2.png">\n'

var gInterval
var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame

function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        minesCount: 0,
        life: 3
    }
    gBoard = buildBoard()
    smiley(NORMAL)
    choseLevel()


    var elRestart = document.querySelector('.restart')
    elRestart.style.display = 'none'

    clearInterval(gInterval)
    var elTimer = document.querySelector('.timer-container')
    elTimer.querySelector('.timer').innerText = '00:00'

    createLife(HEART1, HEART1, HEART1)
    renderBoard(gBoard)

}

function buildBoard() {
    var board = []

    board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }
    }

    createMines(gLevel.MINES, board)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)

        }

    }

    return board
}

function renderBoard(board) {

    var elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            strHTML += `\t<td oncontextmenu="onAddFlag(${i},${j})" onclick="cellClicked(event,${i},${j})">`

            if (currCell.isMine === true && currCell.isShown === true) {
                strHTML += MINES_IMG
            } else if (currCell.isMarked === true) {
                strHTML += FLAG_IMG
            } else if (currCell.minesAroundCount >= 0 && currCell.isShown === true) {
                strHTML += currCell.minesAroundCount
            }

            strHTML += '\t</td>\n'

        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {

    if (gBoard[i][j].isShown) {
        return
    }
    gGame.shownCount++
    gBoard[i][j].isShown = true
    if (!gGame.isOn) {
        setTime()
    }
    gGame.isOn = true

    if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
        gGame.minesCount++
        gGame.life--
        if (gGame.life === 2) {
            createLife(HEART2, HEART1, HEART1)
            smiley(Sad)
        }
        else if (gGame.life === 1) {
            createLife(HEART2, HEART2, HEART1)
            smiley(Sad)
        }
        else if (gGame.life === 0) {
            createLife(HEART2, HEART2, HEART2)
            smiley(Sad)
        }
    }
    isVictory()
    gameOver()
    if (gameOver()) {
        return
    }
    renderBoard(gBoard)
    console.log('gBoard', gBoard)
    console.log('gGame.shownCount', gGame.shownCount)
}

function createMines(num, board) {

    for (var i = 0; i < num; i++) {
        var randomI = getRandomInt(0, board.length - 1)
        var randomJ = getRandomInt(0, board.length - 1)
        var randomCell = board[randomI][randomJ]


        randomCell.isMine = true


    }


}

function onChoseLevel(size, mines) {

    gLevel.SIZE = size
    gLevel.MINES = mines
    choseLevel()
    initGame()
}

function onAddFlag(i, j) {
    if (!gGame.isOn) {
        setTime()
    }
    gGame.isOn = true
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if (!gBoard[i][j].isMarked) {
        gGame.markedCount--
    } else {
        gGame.markedCount++
    }

    renderBoard(gBoard)
}

function isVictory() {
    if (gLevel.SIZE * gLevel.SIZE - gLevel.MINES === gGame.shownCount ||
        gLevel.MINES === gGame.minesCount) {
        console.log('winer',)
        winAudio.play()
        smiley(Sunglasses)

        var elRestart = document.querySelector('.win')
        elRestart.style.display = 'block'
        
        clearInterval(gInterval)

        var elRestart = document.querySelector('.restart')
        elRestart.style.display = 'block'


    }
    console.log('gGame.shownCount', gGame.shownCount)

}

function gameOver() {
    if (gGame.life === 0) {
        gGame.isOn = false

        gameOverAudio.play()
        clearInterval(gInterval)
        var elRestart = document.querySelector('.restart')
        elRestart.style.display = 'block'

        var elRestart = document.querySelector('.win')
        elRestart.innerHTML = 'GAME OVER '
        elRestart.style.display = 'block'        
    }

}

function smiley(icon) {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = icon
    
}

function createLife(img1, img2, img3) {
    var elLife = document.querySelector('.life')

    elLife.innerHTML = img1 + img2 + img3


}