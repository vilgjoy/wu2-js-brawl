let playerHp = 30
let enemyHp = 30

function rollDice() {
    return Math.ceil(Math.random() * 6)
}

const playerHpElement = document.querySelector("#player-hp")
const enemyHpElement = document.querySelector("#enemy-hp")

function battleTurn() {
    const pRoll = rollDice()
    const eRoll = rollDice()
    if (pRoll > eRoll) {
        enemyHp -= pRoll - eRoll
        console.log(`You dealt damage to the enemy. enemy hp is at ${enemyHp} while yours is at ${playerHp}`)
    }
    else if (eRoll > pRoll) {
        playerHp -= eRoll - pRoll
        console.log(`The enemy dealt damage to you. player hp is at ${playerHp} while enemy hp is at ${enemyHp}`)
    }
    else {
        console.log("tie e uh block")
    }
    playerHpElement.textContent = playerHp
    enemyHpElement.textContent = enemyHp
    checkDead()
}

function checkDead() {
    if (playerHp <= 0) {
        console.log("You died! Game over.")
    }
    else if (enemyHp <= 0) {
        console.log("You defeated the enemy! You win!")
    }
}

const playButton = document.querySelector("#play-button")
playButton.addEventListener("click", battleTurn,)
