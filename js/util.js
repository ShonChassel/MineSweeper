'use strict'



function createMat(ROWS, COLS) {
    var mat = []

    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive

}

function setTime() {
    var startTime = Date.now()
    var elTimer = document.querySelector('.timer-container')
    gInterval = setInterval(function () {
        var currTime = Date.now()
        var time = ((currTime - startTime) / 1000).toFixed(3);
        elTimer.querySelector('.timer').innerText = time
    }, 100)
}

function setMinesNegsCount(board, cellI, cellJ) {
    var count = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

function choseLevel() {

    var elEasy = document.querySelector('.easy')
    var elMid = document.querySelector('.mid')
    var elDifficult = document.querySelector('.difficult')

    switch (gLevel.SIZE) {
        case 4:
            elEasy.style.boxShadow = '1px 1px 10px 6px'
            elMid.style.boxShadow = 'none'
            elDifficult.style.boxShadow = 'none'
            break;
        case 8:
            elMid.style.boxShadow = '1px 1px 10px 6px'
            elEasy.style.boxShadow = 'none'
            elDifficult.style.boxShadow = 'none'
            break;
        case 12:
            elDifficult.style.boxShadow = '1px 1px 10px 6px'
            elEasy.style.boxShadow = 'none'
            elMid.style.boxShadow = 'none'
    }
}