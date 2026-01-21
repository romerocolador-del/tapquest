/* ===============================
TELEGRAM WEBAPP
================================ */
const tg = window.Telegram ? Telegram.WebApp : null;
if (tg) {
  tg.ready();
  tg.expand();
}

/* ===============================
ELEMENTOS 
================================ */
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const inventory = document.getElementById("inventory");

const enemyDiv = document.getElementById("enemy");
const weaponDiv = document.getElementById("weapon");
const hpBar = document.getElementById("hpBar");
const weaponTimer = document.getElementById("weaponTimer");
const itemsDiv = document.getElementById("items");

const playBtn = document.getElementById("playBtn");
const attackBtn = document.getElementById("attackBtn");
const backBtn = document.getElementById("backBtn");
const invBtn = document.getElementById("invBtn");
const closeInvBtn = document.getElementById("closeInvBtn");
const claimBtn = document.getElementById("claimBtn");

/* ===============================
BOTONES
================================ */
playBtn.onclick = startGame;
attackBtn.onclick = attack;
backBtn.onclick = backMenu;
invBtn.onclick = openInventory;
closeInvBtn.onclick = closeInventory;
claimBtn.onclick = claimReward;

/* ===============================
DATA DEL JUGADOR
================================ */
let player = {
  level: 1,
  xp: 0,
  weapon: null,
  inventory: {}
};

let tq = 0;
let difficulty = 1;

/* ===============================
HELPERS
================================ */
function popup(text) {
  const p = document.createElement("div");
  p.className = "popup";
  p.textContent = text;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 2000);
}

function actualizarTQ() {
  document.getElementById("tq").innerText = "$TQ: " + tq;
}

/* ===============================
ARMAS
================================ */
const weapons = [
  { name: "Espada Común", dmg: 2, rarity: "common" },
  { name: "Lanza Rara", dmg: 6, rarity: "rare" },
  { name: "Espada Épica", dmg: 9, rarity: "epic" },
  { name: "Hoja Legendaria", dmg: 14, rarity: "legendary" }
];

/* ===============================
ZONAS
================================ */
const zones = [
  { name: "🌲 Bosque", min: 1, enemy: "🟢", boss: "🌳" },
  { name: "🏜️ Desierto", min: 5, enemy: "🦂", boss: "👑" },
  { name: "☠️ Cripta", min: 10, enemy: "💀", boss: "🧙" }
];

function currentZone() {
  return zones.slice().reverse().find(z => player.level >= z.min);
}

/* ===============================
ENEMIGO
================================ */
let enemy = {
  hp: 100,
  maxHp: 100,
  alive: true,
  boss: false
};

function spawnEnemy() {
  const z = currentZone();
  enemy.boss = player.level % 5 === 0;

  enemy.maxHp = enemy.boss ? 300 * difficulty : 140 * difficulty;
  enemy.hp = enemy.maxHp;
  enemy.alive = true;

  enemyDiv.textContent = enemy.boss ? z.boss : z.enemy;
  zoneTitle.textContent = z.name + (enemy.boss ? " – JEFE" : "");
  updateHp();
}

function updateHp() {
  hpBar.style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + "%";
}

/* ===============================
NAVEGACIÓN
================================ */
function startGame() {
  menu.classList.remove("show");
  game.classList.add("show");
  spawnEnemy();
}

function backMenu() {
  game.classList.remove("show");
  menu.classList.add("show");
}

function openInventory() {
  menu.classList.remove("show");
  inventory.classList.add("show");
  renderInventory();
}

function closeInventory() {
  inventory.classList.remove("show");
  menu.classList.add("show");
}

/* ===============================
COMBATE
================================ */
function attack() {
  if (!enemy.alive) return;

  let dmg = Math.floor(Math.random() * 6) + 4;
  if (player.weapon) dmg += player.weapon.dmg;

  enemy.hp -= dmg;
  updateHp();

  if (enemy.hp <= 0) {
    enemy.alive = false;
    setTimeout(winEnemy, 300);
  }
}

/* ===============================
GANAR ENEMIGO
================================ */
function winEnemy() {
  const reward = enemy.boss ? 5 : 1;
  tq += reward;
  actualizarTQ();

  player.xp += 25;
  if (player.xp >= 100) {
    player.level++;
    player.xp = 0;
    popup("⬆️ Nivel " + player.level);
  }

  dropWeapon();
  spawnEnemy();
}

/* ===============================
DROPS
================================ */
function dropWeapon() {
  if (Math.random() > 0.15) return;
  const w = weapons[Math.floor(Math.random() * weapons.length)];
  if (!player.inventory[w.name]) {
    player.inventory[w.name] = { ...w, qty: 0, time: 30 };
  }
  player.inventory[w.name].qty++;
  popup("🎁 " + w.name);
}

/* ===============================
INVENTARIO
================================ */
function renderInventory() {
  itemsDiv.innerHTML = "";
  for (const k in player.inventory) {
    const w = player.inventory[k];
    const d = document.createElement("div");
    d.className = "item " + w.rarity;
    d.innerHTML = `
      <span>${w.name} x${w.qty}<br>⏳ ${w.time}s</span>
      <span>+${w.dmg}</span>
    `;
    d.onclick = () => {
      player.weapon = w;
      closeInventory();
    };
    itemsDiv.appendChild(d);
  }
}

/* ===============================
TIMER ARMAS
================================ */
setInterval(() => {
  if (!player.weapon) return;
  player.weapon.time--;
  weaponTimer.textContent = "⏳ " + player.weapon.time + "s";

  if (player.weapon.time <= 0) {
    popup("🗑️ Arma destruida");
    delete player.inventory[player.weapon.name];
    player.weapon = null;
    weaponTimer.textContent = "";
  }
}, 1000);

/* ===============================
CLAIM → BOT
================================ */
function claimReward() {
  if (!tg) {
    popup("❌ Abre el juego desde Telegram");
    return;
  }

  if (tq <= 0) {
    popup("❌ No tienes $TQ");
    return;
  }

  tg.sendData(JSON.stringify({
    type: "reward",
    amount: tq
  }));

  popup("📤 Enviado al bot: " + tq + " $TQ");

  tq = 0;
  actualizarTQ();

  setTimeout(() => tg.close(), 700);
}

/* ===============================
INIT
================================ */
actualizarTQ();
