/* ================= PANTALLAS ================= */
let currentScreen = "menu";

function openScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(`screen-${name}`).classList.add("active");
  currentScreen = name;
}

/* ================= SAVE / LOAD ================= */
const SAVE_KEY = "tapquest_save_simple";

let player = {
  baseDamage: 2,
  gold: 0,
  tq: 0,
  xp: 0,

  level: 1,
  xpToNext: 50,

  critChance: 0.1,
  critMultiplier: 2,
  weapon: null,
  inventory: [],

  lastWithdraw: 0 // ⬅️ agregado
};

let enemiesDefeated = 0;

const XP_MULTIPLIER = 2;
const BOSS_XP_MULTIPLIER = 4;
const BOSS_EVERY = 10;

/* ====== RETIROS ====== */
const WITHDRAW_FEE = 0.05; // 5%
const WITHDRAW_COOLDOWN = 24 * 60 * 60 * 1000; // 24h
const MIN_WITHDRAW_TQ = 50;

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ player, enemiesDefeated }));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    player = { ...player, ...data.player };
    enemiesDefeated = data.enemiesDefeated ?? 0;
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }
}

/* ================= SONIDOS ================= */
const hitSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
hitSound.volume = 0.25;

/* ================= ENEMIGOS ================= */
const enemies = [
  { emoji: "🟢", name: "Slime Verde", maxHp: 10, gold: 1, xp: 15 },
  { emoji: "🐺", name: "Lobo Salvaje", maxHp: 20, gold: 5, xp: 20 },
  { emoji: "👹", name: "Demonio Menor", maxHp: 35, gold: 12, xp: 35 }
];

let enemy = null;

/* ================= UI ================= */
const levelText = document.getElementById("level-text");
const xpBar = document.getElementById("xp-bar");
const xpText = document.getElementById("xp-text");
const enemyName = document.getElementById("enemy-name");
const enemyHpBar = document.getElementById("enemy-hp");
const enemyLifeText = document.getElementById("enemy-life");
const goldText = document.getElementById("gold");
const tqText = document.getElementById("tq-points");
const log = document.getElementById("log");

/* ================= NIVEL & DAÑO ================= */
function gainXP(amount, bossBonus = false) {
  player.xp += amount;

  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;

    player.baseDamage += bossBonus ? 2 : 1;
    player.xpToNext = Math.floor(player.xpToNext * 1.5);

    log.innerText = bossBonus
      ? `👑 JEFE derrotado → Nivel ${player.level} | Daño +2`
      : `⬆️ Nivel ${player.level} | Daño +1`;
  }
}

/* ================= ECONOMÍA ================= */

// 🔄 Oro → $TQ
function exchangeGoldToTQ(amount) {
  if (player.gold < amount) {
    log.innerText = "❌ Oro insuficiente";
    return;
  }

  const RATE = 1;
  player.gold -= amount;
  player.tq += amount * RATE;

  log.innerText = `🔄 Canjeaste ${amount} Oro → ${amount * RATE} $TQ`;
  updateUI();
  saveGame();
}

// 📤 Retiro con fee + cooldown
function requestWithdraw(amount) {
  const now = Date.now();

  if (amount < MIN_WITHDRAW_TQ) {
    log.innerText = `❌ Mínimo de retiro: ${MIN_WITHDRAW_TQ} $TQ`;
    return;
  }

  if (player.tq < amount) {
    log.innerText = "❌ $TQ insuficiente";
    return;
  }

  if (now - player.lastWithdraw < WITHDRAW_COOLDOWN) {
    const remaining = WITHDRAW_COOLDOWN - (now - player.lastWithdraw);
    const hours = Math.ceil(remaining / (1000 * 60 * 60));
    log.innerText = `⏳ Retiro disponible en ${hours}h`;
    return;
  }

  const fee = Math.ceil(amount * WITHDRAW_FEE);
  const finalAmount = amount - fee;

  player.tq -= amount;
  player.lastWithdraw = now;

  log.innerText = `🏧 Retiro solicitado: ${finalAmount} $TQ (Fee ${fee})`;

  // 🔗 aquí va TON wallet / smart contract
  console.log("Retiro TON pendiente:", finalAmount);

  updateUI();
  saveGame();
}

/* ================= GAME ================= */
function spawnEnemy() {
  const e = enemies[Math.floor(Math.random() * enemies.length)];
  const isBoss = enemiesDefeated > 0 && enemiesDefeated % BOSS_EVERY === 0;

  const scale = 1 + enemiesDefeated * 0.12;

  let hp = Math.floor(e.maxHp * scale);
  let gold = e.gold;
  let xp = e.xp;
  let name = e.name;
  let emoji = e.emoji;

  if (isBoss) {
    hp = Math.floor(hp * 2.5);
    gold *= 2;
    xp *= 50;
    name = "JEFE " + e.name;
    emoji = "👑";
  }

  enemy = {
    ...e,
    isBoss,
    name,
    emoji,
    maxHp: hp,
    hp,
    gold,
    xp
  };

  enemyName.innerText = `${enemy.emoji} ${enemy.name}`;
  updateUI();
}

function attack() {
  enemy.hp -= player.baseDamage;
  hitSound.play();

  if (enemy.hp <= 0) {
    enemiesDefeated++;
    player.gold += enemy.gold;

    const xpGained = enemy.isBoss
      ? enemy.xp * XP_MULTIPLIER * BOSS_XP_MULTIPLIER
      : enemy.xp * XP_MULTIPLIER;

    gainXP(xpGained, enemy.isBoss);
    spawnEnemy();
  }

  updateUI();
  saveGame();
}

function updateUI() {
  enemyHpBar.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
  enemyLifeText.innerText = `${enemy.hp} / ${enemy.maxHp}`;
  goldText.innerText = player.gold;
  tqText.innerText = `🪙 $TQ: ${player.tq}`;

  levelText.innerText = `Nivel ${player.level}`;
  xpText.innerText = `${player.xp} / ${player.xpToNext} XP`;
  xpBar.style.width = `${(player.xp / player.xpToNext) * 100}%`;
}

/* ================= BOTÓN ================= */
document.getElementById("attack").onclick = attack;

/* ================= START ================= */
loadGame();
spawnEnemy();
updateUI();
