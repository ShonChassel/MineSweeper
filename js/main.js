'use strict'
window.addEventListener("contextmenu", e => e.preventDefault());

var winAudio = new Audio('sound/win.wav');
var gameOverAudio = new Audio('sound/game-over.wav');

const LIGHT1 = '\n\t\t<img class="icon" onclick="onLight(LIGHT1,LIGHT1,LIGHT1)" src="img/light1.png">\n'
const LIGHT2 = '\n\t\t<img class="icon" src="img/light2.png">\n'


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
var gGame

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        minesCount: 0,
        life: 3,
        isWin: false,
        light: 3,
        isLight: false
    }
    gBoard = buildBoard()
    smiley(NORMAL)
    choseLevel()


    // var elRestart = document.querySelector('.restart')
    // elRestart.style.display = 'none'

    var elRestart = document.querySelector('.win-container')
    elRestart.style.display = 'none'

    clearInterval(gInterval)
    var elTimer = document.querySelector('.timer-container')
    elTimer.querySelector('.timer').innerText = '00:00'

    createLife(HEART1, HEART1, HEART1)
    renderBoard(gBoard)

    var elLight = document.querySelector('.light')
    elLight.innerHTML = LIGHT1 + LIGHT1 + LIGHT1
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
            var className = currCell.isShown ? 'box-shadow' : ''
            strHTML += `\t<td class="${className}" oncontextmenu="onAddFlag(${i},${j})" onclick="cellClicked(event,${i},${j})">`

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
    if (gGame.isWin) {
        return
    }
    if (gBoard[i][j].isShown) {
        return
    }
    gGame.shownCount++
    gBoard[i][j].isShown = true

    if (!gGame.isOn) {
        setTime()
        expandShown(gBoard, i, j)
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
    // if(gBoard[i][j].minesAroundCount === 0){
    //     expandShown(gBoard, i, j)
    // }
    isVictory()
    gameOver()
    if (gameOver()) {
        return
    }
    renderBoard(gBoard)
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
        gLevel.SIZE * gLevel.SIZE - gLevel.MINES === gGame.shownCount + gGame.markedCount ||
        gLevel.MINES === gGame.minesCount) {
        console.log('winer',)
        winAudio.play()
        smiley(Sunglasses)
        gGame.isWin = true

        var elRestart = document.querySelector('.win-container')
        elRestart.querySelector('.win').innerHTML = 'VICTORY '
        elRestart.style.display = 'block'

        clearInterval(gInterval)

        // var elRestart = document.querySelector('.restart')
        // elRestart.style.display = 'block'


    }
    console.log('gGame.shownCount', gGame.shownCount)

}

function gameOver() {
    if (gGame.life === 0) {
        gGame.isOn = false
        gGame.isWin = true

        gameOverAudio.play()
        clearInterval(gInterval)
        // var elRestart = document.querySelector('.restart')
        // elRestart.style.display = 'block'

        var elRestart = document.querySelector('.win-container')
        elRestart.querySelector('.win').innerHTML = 'GAME OVER '
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

function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue


            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) {
                continue
            }
            else if (!board[i][j].isShown) {
                board[i][j].isShown = true
            }
        }
    }

}

function onLight(img1, img2, img3) {
    if(!gGame.isOn)return;
    var elLight = document.querySelector('.light')
    var randomI = getRandomInt(0, gBoard.length - 1)
    var randomJ = getRandomInt(0, gBoard.length - 1)

    gGame.isLight = true

    if (gGame.isLight) {
        lightShown(gBoard, randomI, randomJ)
    }

    // elLight.innerHTML = img1 + img2 + img3

}

function lightShown(board, cellI, cellJ) {
    var cellsShown = []

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (board[i][j].isShown) continue;
            if (!board[i][j].isShown) {
                board[i][j].isShown = true
                cellsShown.push({ i, j })
            }

        }
    }
    renderBoard(board)
    setTimeout(closeCells, 500)

    function closeCells() {

        for (var f = 0; f < cellsShown.length; f++) {
            gBoard[cellsShown[f].i][cellsShown[f].j].isShown = false
        }

        renderBoard(gBoard)
        gGame.isLight = true,
            console.log('gGame.light', gGame.light)
        gGame.light--
        console.log('gGame.light', gGame.light)

        var elLight = document.querySelector('.light')
        if (gGame.light === 2) {
            elLight.innerHTML = LIGHT2 + LIGHT1 + LIGHT1
        } else if (gGame.light === 1) {
            elLight.innerHTML = LIGHT2 + LIGHT2 + LIGHT1
        } else if (gGame.light === 0) {
            elLight.innerHTML = LIGHT2 + LIGHT2 + LIGHT2
        }
    }



}

