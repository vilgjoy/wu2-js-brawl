let playerWarning = false
const playerMaxHp = 50

function rollDice() {
    return Math.ceil(Math.random() * 16)
}

function checkDead() {
    if (player.hp <= 0) {
        log("you died! ez gg")
        playButton.disabled = true
    }
    else if (enemy.hp <= 0) {
        log("you defeated the enemy! i could have done better fr")
        playButton.disabled = true
    }

    if (!playerWarning && player.hp <= playerMaxHp / 2) {
        log("warning, you at low hp dog", false, true)
        playerWarning = true
    }
}

function getTimeString() {
    const date = new Date()
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit"})
}

const playerHpElement = document.querySelector("#player-hp")
const enemyHpElement = document.querySelector("#enemy-hp")
const combatLogElement = document.querySelector("#combat-log")
const playButton = document.querySelector("#play-button")

function log(msg, type, bold = false) {
    const li = document.createElement("li")

    const timestampSpan = document.createElement("span")
    timestampSpan.textContent = `[${getTimeString()}]`
    timestampSpan.classList.add("log-timestamp")
    li.appendChild(timestampSpan)

    const msgSpan = document.createElement("span")
    msgSpan.textContent = msg
    if (type) msgSpan.classList.add(type)
    if (bold) msgSpan.classList.add("bold")
    li.appendChild(msgSpan)

    combatLogElement.appendChild(li)
    if (combatLogElement.childNodes.length > 10) {
        combatLogElement.removeChild(combatLogElement.firstChild)
    }
}

const enemy= {
    "name": "Goblin",
    "hp": 50,
}

const player= {
    "hp": 50,
}

function battleTurn() {
    const pRoll = rollDice()
    const eRoll = rollDice()
    if (pRoll > eRoll) {
        const dmg = pRoll - eRoll
        enemy.hp -= dmg 
        const playerAtkMsg= [
            `You hit the enemy for ${dmg} damage, so they are at ${enemy.hp}`,
            `You slashed and dashed the enemy for ${dmg} damage, so they are at ${enemy.hp}`,
            `With the weight of a mountain, you bashed the enemy for ${dmg} damage, so they are at ${enemy.hp}`,
            `You shoot shoot your sword towards the enemy, dealing ${dmg} damage, so they are at ${enemy.hp}`,
        ]
        log(playerAtkMsg[Math.floor(Math.random() * playerAtkMsg.length)], "player")
    }
    else if (eRoll > pRoll) {
        const dmg = eRoll - pRoll
        player.hp -= dmg
        log(`The enemy dealt ${dmg} to you. player hp is at ${player.hp} while enemy hp is at ${enemy.hp}`, "enemy")
    }
    else {
        log("tie e uh block")
    }
    playerHpElement.textContent = player.hp < 1 ? 0 : player.hp
    enemyHpElement.textContent = enemy.hp < 1 ? 0 : enemy.hp
    checkDead()
}

playButton.addEventListener("click", battleTurn)
