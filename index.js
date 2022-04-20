const $ = document.querySelector.bind(document)
const goalX = $('.goalX')
const goalO = $('.goalO')
const round = $('.roundnum')
const formSetting = document.getElementById('setting-modal')
const app = $('.app')
const settingBox = $('.settingBox')
const randomPlayerBtn = $('.btn-random-player')
const settingBtn = $('.btn-setting')
const acceptSettingBtn = $('.complete-setting')
const spaceBox = $('.play-box .box')
const header = $('.header')
const btnNextRound = $('.btn-nextRound')
const messageEnd = $('.message-end span')
let abcColIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let numbox;
let tickWin;
let numset;
let roundCurrent = 1;
let positionX = []
let positionO = []
let hasWinner = false;
let theWinner;
let positionCurrent;
//Rendering
formSetting.addEventListener('submit', function (e) {
    e.preventDefault()
    const formValue = Array.from(this.elements).reduce((value, element) => {
        if (element.localName === 'input') {
            if (element.id === 'numbox' || element.id === 'numset' || element.id === 'numtickWin') {
                value[element.id] = element.value
            } else {
                element.checked === true ? value['first__player'] = element.id : null
            }
        }
        return value
    }, {})
    if (formValue.first__player == null) {
        alert("Please select a player")
    } else {
        numset = formValue.numset
        numbox = formValue.numbox
        tickWin = formValue.numtickWin

        spaceBox.classList.add(`playing-${formValue.first__player[0]}`)
        app.classList.add('playing')
        rendering(numbox, tickWin)

    }





})
//Open Setting
settingBtn.addEventListener('click', () => {
    confirm('Are you sure want to setting again? The last setting will be reset') ? app.classList.remove('playing') : false
})
btnNextRound.addEventListener('click', () => {
    roundCurrent++
    round.innerText = roundCurrent
    spaceBox.classList.remove('done')
    hasWinner = false;
    positionX = []
    positionO = []
    positionCurrent = ''
    rendering(numbox, tickWin)
})


function rendering(numbox, tickWin) {
    spaceBox.innerHTML = ''
    Object.assign(spaceBox.style, {
        gridTemplateColumns: `repeat(${numbox},1fr)`,
        gridTemplateRows: `repeat(${numbox},1fr)`,
        width: `${Math.floor((numbox / 5) * 15)}rem`,
        height: `${Math.floor((numbox / 5) * 15)}rem`
    })
    header.style.height = `${((((window.innerHeight - ((numbox / 5) * 150)) / 2) / window.innerHeight) * 100)}vh`
    header.style.width = `${Math.floor(((numbox / 5) * 15))}rem`
    header.style.top = `-${((((window.innerHeight - ((numbox / 5) * 150)) / 2) / window.innerHeight) * 100)}vh`
    // window.addEventListener('resize', () => {
    //     header.style.height = `${((((window.innerHeight - ((numbox / 5) * 150)) / 2) / window.innerHeight) * 100)}vh`
    //     header.style.top = `-${((((window.innerHeight - ((numbox / 5) * 150)) / 2) / window.innerHeight) * 100)}vh`

    // })
    for (let i = 1; i <= numbox; i++) {
        for (let j = 0; j < numbox; j++) {
            const divBoxItem = document.createElement('div')
            divBoxItem.className = `box-item ${i}${abcColIndex[j]}`
            divBoxItem.innerHTML = `<i class="icon icon-player-O far fa-circle"></i>
            <i class="icon icon-player-X fas fa-times"></i>`
            //Click event tick
            divBoxItem.addEventListener('click', () => {
                if (!divBoxItem.classList.contains('tick')) {
                    positionCurrent = divBoxItem.className.split(' ')[1]
                    divBoxItem.classList.add('tick')
                    if (spaceBox.classList.contains('playing-X')) {
                        //Push position
                        positionX.push(positionCurrent)
                        //Sort
                        positionX.sort((a, b) => a.slice(0, a.length - 1) - b.slice(0, b.length - 1))
                        divBoxItem.classList.add('tickplaying-X')
                        if (positionX.length >= tickWin) {
                            checkWinner(positionCurrent, positionX, 'tickplaying-X')
                        }
                        if (!hasWinner) {
                            setTimeout(() => { spaceBox.className = 'box playing-O' }, 30);
                        }
                        // console.log(positionX)
                    }
                    if (spaceBox.classList.contains('playing-O')) {
                        //Push position
                        positionO.push(positionCurrent)
                        //Sort
                        positionO.sort((a, b) => a.slice(0, a.length - 1) - b.slice(0, b.length - 1))

                        divBoxItem.classList.add('tickplaying-O')
                        if (positionO.length >= tickWin) {
                            checkWinner(positionCurrent, positionO, 'tickplaying-O')
                        }
                        if (!hasWinner) {
                            setTimeout(() => { spaceBox.className = 'box playing-X' }, 30);
                        }
                    }
                    // Check Winner

                }
            })
            spaceBox.appendChild(divBoxItem)
        }

    }
}

function checkWinner(positionCurrent, playertick, selector) {

    let numrowCurrent = +positionCurrent.slice(0, positionCurrent.length - 1)
    let charInPositionCurrent = positionCurrent.slice(positionCurrent.length - 1, positionCurrent.length)
    let numcolCurrent = abcColIndex.indexOf(charInPositionCurrent)
    //Find Valid value become winner
    let horiItemsMustCheck = []
    let vertItemsMustCheck = []
    let dia1ItemsMustCheck = []
    let dia2ItemsMustCheck = []
    let count = tickWin - 1;
    for (let i = numcolCurrent - tickWin + 1; i < numcolCurrent + tickWin; i++) {
        if (i >= 0 && i <= numbox) {
            horiItemsMustCheck.push(`${numrowCurrent}${abcColIndex[i]}`)
            if (numrowCurrent - count > 0 && numrowCurrent - count <= numbox) {
                dia1ItemsMustCheck.push(`${numrowCurrent - count}${abcColIndex[i]}`)
            }
            if (numrowCurrent + count <= numbox) {
                dia2ItemsMustCheck.push(`${numrowCurrent + count}${abcColIndex[i]}`)
            }
        }
        if (i === numcolCurrent) {
            for (let i = numrowCurrent - tickWin + 1; i < numrowCurrent + tickWin; i++) {
                if (i > 0 && i <= numbox) {
                    vertItemsMustCheck.push(`${i}${charInPositionCurrent}`)
                }
            }
        }
        count -= 1
    }
    //Check ticked-player found valid value
    let checkHorizontal = checkValid(horiItemsMustCheck, playertick)
    let checkVertical = checkValid(vertItemsMustCheck, playertick, 'vertical')
    let checkDiagonal1 = checkValid(dia1ItemsMustCheck, playertick)
    let checkDiagonal2 = checkValid(dia2ItemsMustCheck, playertick)
    let checkStreakWin = checkHorizontal?.streakWin || checkVertical?.streakWin || checkDiagonal1?.streakWin || checkDiagonal2?.streakWin
    if (checkHorizontal.hasWin || checkVertical.hasWin || checkDiagonal1.hasWin || checkDiagonal2.hasWin) {
        alert(`${selector} winner`)
        if (selector === 'tickplaying-X') {
            goalX.innerText = +goalX.innerText + 1
        }
        if (selector === 'tickplaying-O') {
            goalO.innerText = +goalO.innerText + 1
        }
        if (+goalX.innerText === +goalO.innerText) {
            goalO.style.color = '#000'
            goalX.style.color = '#000'

        } else if (+goalX.innerText > +goalO.innerText) {
            goalX.style.color = 'rgba(9, 9, 121, 1)'
            goalO.style.color = '#000'
        } else {
            goalO.style.color = 'rgba(253, 29, 29, 1)'
            goalX.style.color = '#000'
        }
        if (roundCurrent == numset) {
            spaceBox.classList.add('endstate')
            if (+goalX.innerText === +goalO.innerText) {
                messageEnd.innerText = 'This game is draw'
            } else if (+goalX.innerText > +goalO.innerText) {
                messageEnd.innerText = 'The winner is X'
            } else {
                messageEnd.innerText = 'The winner is O'

            }

        } else {
            spaceBox.classList.add('done')
        }

        const divBoxItems = document.querySelectorAll('div.box-item')
        checkStreakWin.forEach(item => {
            divBoxItems.forEach(boxitem => {
                if (boxitem.classList.contains(item)) {
                    boxitem.classList.add('highlight')
                }
            })
        })

        hasWinner = true;
    }

}
function checkValid(check, tick, style = "none") {
    //Array of valid-player similar valid value
    let result = {}
    let validTick = [];
    for (let i = 0; i < tick.length; i++) {
        check.includes(tick[i]) ? validTick.push(tick[i]) : false
    }
    validStreakArray = 0;
    let arraySuccessCheck;
    if (style === 'vertical') {
        arraySuccessCheck = validTick.map((valid, index) => ({ value: +valid.slice(0, valid.length - 1), index }))
    } else {
        arraySuccessCheck = validTick.map((valid, index) => ({ value: abcColIndex.indexOf(valid.slice(valid.length - 1, valid.length)), index }))
    }
    // console.log(arraySuccessCheck)
    arraySuccessCheck.sort((a, b) => a.value - b.value)
    //Check win streak, if your streak = tickWin, you are winner of this game
    let streakWin = []
    arraySuccessCheck.forEach((valid, index, array) => {
        if (index === 0) {
            validStreakArray++
            streakWin.push(valid)


        } else {
            if (valid.value - array[index - 1].value === 1) {
                validStreakArray++
                streakWin.push(valid)

            } else {
                validStreakArray = 0
                streakWin = []
            }
        }
    })
    let streakWinFinal = streakWin.map(item => validTick[item.index])
    if (streakWin.length > tickWin) {
        posCurInStreakWin = streakWinFinal.indexOf(positionCurrent)
        streakWinFinal = streakWinFinal.slice(posCurInStreakWin - ((tickWin - 1) / 2), posCurInStreakWin + 1 + ((tickWin - 1) / 2))
    }
    result.hasWin = validStreakArray >= tickWin
    streakWin.length < tickWin ? false : result.streakWin = streakWinFinal
    return result



}
