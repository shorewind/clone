const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')
const hint = document.querySelector('.message-container')

const hintElement = document.createElement('button')
hintElement.textContent = 'Hint'
hintElement.setAttribute('id', 'Hint')
hintElement.addEventListener('click', () => hintClick('Hint'))
hint.append(hintElement)

const hintClick = () => {
    console.log('clicked', 'Hint')
    fetch(`http://localhost:8000/hint/?word=${wordle}`)
        .then(response => response.json())
        .then(json => {
            if (json === '') {
                showMessageTemp('No hint available')
            }
            else {
                console.log('hint is', json)
                showMessageTemp('Hint: ' + json)
            }
        })
    .catch(err => console.log(err))
}

let wordle

const getWordle = () => {
    fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json => {
        console.log(json)
        wordle = json.toUpperCase()
    })
    .catch(err => console.log(err))
}

getWordle()

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'DEL',
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    }) 
    tileDisplay.append(rowElement)
})

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

const handleClick = (letter) => {
    if (!isGameOver) {
        console.log('clicked', letter)
        if (letter === 'DEL') {
            deleteLetter()
            console.log('guessRows', guessRows)
            return
        }
        if (letter === 'ENTER') {
            checkRow()
            console.log('guessRows', guessRows)
            return
        }
        addLetter(letter)
        console.log('guessRows', guessRows)
    }
}

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        const dataLetter = tile.getAttribute('data')

        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)

    })
}

const showMessageTemp = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 3000)
}

const showMessagePerm = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')
    console.log('guess', guess)
    if (currentTile > 4) {
        fetch(`http://localhost:8000/check/?word=${guess}`)
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if (json == 'Entry word not found') {
                    showMessageTemp('Word not in list')
                    return  
                } else {
                    console.log('guess: ' + guess, ', word: ' + wordle)
                    flipTile()
                    if (wordle == guess) {
                        isGameOver = true
                        fetch(`http://localhost:8000/def/?word=${wordle}`)
                            .then(response => response.json())
                            .then(json => {
                            console.log(json)
                            const definition = JSON.stringify(json, null, 2);
                            showMessageTemp('Spectacular!')
                            showMessagePerm(wordle + ': ' + definition)
                            })
                        return
                    }
                    else {
                        if (currentRow >= 5) {
                            isGameOver = true
                            fetch(`http://localhost:8000/def/?word=${wordle}`)
                                .then(response => response.json())
                                .then(json => {
                                console.log(json)
                                const definition = JSON.stringify(json, null, 2);
                                showMessageTemp('Game Over!')
                                showMessagePerm(wordle + ': ' + definition)
                            })
                            return
                        }
                        if (currentRow < 5) {
                            currentRow++
                            currentTile = 0
                        }
                    }
                }
            }).catch(err => console.log(err))
    }
}