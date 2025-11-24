// --- VARIABLER & SETUP ---
let playerWarning = false
let gameLoopTimeout = null
let isGameRunning = false
let level = 1
let currentEnemyMaxHp = 100

// DOM Elements
const playerHpElement = document.querySelector("#player-hp")
const enemyHpElement = document.querySelector("#enemy-hp")
const combatLogElement = document.querySelector("#combat-log")
const playButton = document.querySelector("#play-button")
const stopButton = document.querySelector("#stop-button")

// Nya DOM Elements för UI
const playerBarFill = document.querySelector("#player-bar-fill")
const enemyBarFill = document.querySelector("#enemy-bar-fill")
const goldDisplay = document.querySelector("#gold-display")
const levelDisplay = document.querySelector("#level-display")
const enemyNameDisplay = document.querySelector("#enemy-name")
const shopArea = document.querySelector("#shop-area")
const combatArea = document.querySelector(".combat-area")

// Shop Buttons
document.querySelector("#buy-potion").addEventListener("click", buyPotion)
document.querySelector("#buy-upgrade").addEventListener("click", buyUpgrade)
document.querySelector("#next-level-btn").addEventListener("click", nextLevel)

// --- OBJEKT ---

const player = {
    maxHp: 100,
    hp: 100,
    gold: 0,
    extraDmg: 0 // Vi kan öka denna i shoppen
}

class Enemy {
    constructor(name, hp) {
        this.name = name
        this.hp = hp
        this.maxHp = hp
    }
}

let enemy = new Enemy("Goblin", 100)

// --- HJÄLPFUNKTIONER ---

function rollDice() {
    return Math.ceil(Math.random() * 30)
}

function getTimeString() {
    const date = new Date()
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit"})
}

function updateUI() {
    // Text updates
    playerHpElement.textContent = Math.max(player.hp, 0)
    enemyHpElement.textContent = Math.max(enemy.hp, 0)
    goldDisplay.textContent = player.gold
    levelDisplay.textContent = level
    enemyNameDisplay.textContent = enemy.name

    // Health Bar updates (Räknar ut procent)
    const playerPercent = (player.hp / player.maxHp) * 100
    const enemyPercent = (enemy.hp / enemy.maxHp) * 100
    
    playerBarFill.style.width = `${Math.max(playerPercent, 0)}%`
    enemyBarFill.style.width = `${Math.max(enemyPercent, 0)}%`
}

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
    // Scrolla automatiskt till botten
    combatLogElement.scrollTop = combatLogElement.scrollHeight
}

// --- SPELLOGIK ---

function checkDead() {
    if (player.hp <= 0) {
        log("You died! Game Over.", "enemy", true)
        playButton.disabled = true
        playButton.textContent = "Dead"
        isGameRunning = false
    }
    else if (enemy.hp <= 0) {
        log(`You defeated the ${enemy.name}!`, "player", true)
        
        // Vinst: Ge guld och öppna shoppen
        const goldFound = Math.floor(Math.random() * 20) + 10 + (level * 5)
        player.gold += goldFound
        log(`You found ${goldFound} gold!`, null, true)
        
        stop() // Stoppa loopen
        toggleShop(true) // Visa shoppen
    }

    if (!playerWarning && player.hp <= player.maxHp / 2) {
        log("Warning, you at low hp dog", false, true)
        playerWarning = true
    }
}

function battleTurn() {
    const pRoll = rollDice() + player.extraDmg // Lägger till extra skada från uppgraderingar
    const eRoll = rollDice()
    
    // Tie
    if (pRoll === eRoll) {
        log("Clash! Both blocked.", "bold")
        return
    }

    // Player Wins Roll
    if (pRoll > eRoll) {
        let dmg = pRoll - eRoll
        
        // Heal chans (30%)
        if (Math.random() < 0.3) {
            const healAmount = Math.min(dmg, player.maxHp - player.hp) // Kan inte heala över max
            player.hp += healAmount
            log(`You healed for ${healAmount} hp.`, "healing")
        } else {
            enemy.hp -= dmg 
            log(`You hit ${enemy.name} for ${dmg} damage!`, "player")
        }
    }
    // Enemy Wins Roll
    else {
        let dmg = eRoll - pRoll
        
        // Enemy Heal chans (30%)
        if (Math.random() < 0.3) {
            enemy.hp = Math.min(enemy.hp + dmg, enemy.maxHp)
            log(`${enemy.name} healed for ${dmg} hp.`, "healing")
        } else {
            player.hp -= dmg
            log(`${enemy.name} dealt ${dmg} damage to you.`, "enemy")
        }
    }
    
    updateUI()
    checkDead()
}

// --- GAME LOOP ---

function gameLoop() {
    if (isGameRunning) return
    
    isGameRunning = true
    playButton.textContent = "Fighting..."
    playButton.disabled = true
    stopButton.disabled = false

    function runTurn() {
        if (!isGameRunning) return

        battleTurn()

        if(player.hp > 0 && enemy.hp > 0) {
            gameLoopTimeout = setTimeout(runTurn, 1000)
        }
    }
    runTurn()
}

function stop() {
    isGameRunning = false
    clearTimeout(gameLoopTimeout)
    playButton.textContent = "Fight!"
    playButton.disabled = false
    stopButton.disabled = true
}

// --- SHOP & LEVELS ---

function toggleShop(show) {
    if (show) {
        combatArea.classList.add("hidden")
        shopArea.classList.remove("hidden")
        updateUI()
    } else {
        combatArea.classList.remove("hidden")
        shopArea.classList.add("hidden")
    }
}

function buyPotion() {
    if (player.gold >= 50) {
        player.gold -= 50
        player.hp = Math.min(player.hp + 30, player.maxHp)
        log("Bought a potion. Glug glug.", "healing")
        updateUI()
    } else {
        alert("Not enough gold!")
    }
}

function buyUpgrade() {
    if (player.gold >= 100) {
        player.gold -= 100
        player.extraDmg += 2
        log("Upgraded weapon You feel stronger.", "bold")
        updateUI()
    } else {
        alert("not enough gold")
    }
}

function nextLevel() {
    level++
    
    // kapa ny fiende som är starkare
    const newHp = 100 + (level * 20)
    const names = ["Goblin", "Orc", "Troll", "Dark Knight", "Dragon"]
    // välj namn baserat på level (eller sista namnet om level är hög)
    const name = names[Math.min(level - 1, names.length - 1)]
    
    enemy = new Enemy(name, newHp)
    
    playerWarning = false // reset warning
    
    log(`--- LEVEL ${level} STARTED: ${name} approaches! ---`, "bold")
    toggleShop(false) // dölj shop, visa strid
    updateUI()
}
