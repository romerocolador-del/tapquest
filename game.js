/* === ELEMENTOS === */
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const inventory = document.getElementById("inventory");

const enemyDiv = document.getElementById("enemy");
const weaponDiv = document.getElementById("weapon");
const hpBar = document.getElementById("hpBar");
const weaponTimer = document.getElementById("weaponTimer");
const itemsDiv = document.getElementById("items");

async function claimReward(){
  if(!tonConnectUI.connected){
    alert("Conecta tu wallet primero");
    return;
  }

  alert("🔐 Transacción simulada\n(El smart contract se agrega después)");
}

/* === BOTONES === */
playBtn.onclick = startGame;
attackBtn.onclick = attack;
backBtn.onclick = backMenu;
invBtn.onclick = openInventory;
closeInvBtn.onclick = closeInventory;

/* === DATA === */
let player = {
  level: 1,
  xp: 0,
  weapon: null,
  inventory: {}
};

let difficulty = 1; // 🔥 escalado global

const weapons = [
  {name:"Espada Común",dmg:2,rarity:"common"},
  {name:"Lanza Rara",dmg:6,rarity:"rare"},
  {name:"Espada Épica",dmg:9,rarity:"epic"},
  {name:"Hoja Legendaria",dmg:14,rarity:"legendary"},
  {name:"Reliquia Mítica",dmg:22,rarity:"mythic"},
  {name:"Ultra del Vacío",dmg:35,rarity:"ultra"},
  {name:"Cazadora de Dioses",dmg:55,rarity:"god"}
];

const zones = [
  {name:"🌲 Bosque",min:1,enemy:"🟢",boss:"🌳"},
  {name:"🏜️ Desierto",min:5,enemy:"🦂",boss:"👑"},
  {name:"☠️ Cripta",min:10,enemy:"💀",boss:"🧙"},
  {name:"🌋 Volcán",min:15,enemy:"😈",boss:"🐉"}
];

let enemy = {
  hp: 100,
  maxHp: 100,
  alive: true,
  boss: false
};

/* === HELPERS === */
function popup(text){
  const p = document.createElement("div");
  p.className = "popup";
  p.textContent = text;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 2000);
}

function currentZone(){
  return zones.slice().reverse().find(z => player.level >= z.min);
}

/* === UI === */
function updateMenu(){
  level.textContent = player.level;
  xp.textContent = player.xp;
  zoneName.textContent = currentZone().name;
  weaponName.textContent = player.weapon ? player.weapon.name : "Ninguna";
}

/* === NAVEGACIÓN === */
function startGame(){
  menu.classList.remove("show");
  game.classList.add("show");
  spawnEnemy();
}

function backMenu(){
  game.classList.remove("show");
  menu.classList.add("show");
  updateMenu();
}

function openInventory(){
  menu.classList.remove("show");
  inventory.classList.add("show");
  renderInventory();
}

function closeInventory(){
  inventory.classList.remove("show");
  menu.classList.add("show");
  updateMenu();
}

/* === ENEMIGOS === */
function spawnEnemy(){
  const z = currentZone();

  enemy.boss = player.level % 5 === 0;

  enemy.maxHp = enemy.boss
    ? Math.floor(300 * difficulty)
    : Math.floor(140 * difficulty);

  enemy.hp = enemy.maxHp;
  enemy.alive = true;

  enemyDiv.textContent = enemy.boss ? z.boss : z.enemy;
  zoneTitle.textContent = z.name + (enemy.boss ? " – JEFE" : "");

  if(enemy.boss) popup("👑 JEFE DEL BIOMA");

  updateHp();
}

function updateHp(){
  hpBar.style.width = Math.max(0, enemy.hp / enemy.maxHp * 100) + "%";
}

/* === COMBATE === */
function attack(){
  if(!enemy.alive) return;

  const crit = Math.random() < 0.2;
  let dmg = Math.floor(Math.random()*8) + 6 + (player.weapon ? player.weapon.dmg : 0);
  if(crit) dmg *= 2;

  enemy.hp -= dmg;
  updateHp();

  enemyDiv.classList.add("hit");
  weaponDiv.classList.add("swing");

  if(crit){
    enemyDiv.classList.add("crit");
    weaponDiv.classList.add("crit");
  }

  if(navigator.vibrate){
    navigator.vibrate(crit ? [60,30,60] : 30);
  }

  const f = document.createElement("div");
  f.className = "float";
  f.style.left = "50%";
  f.style.top = "50%";
  f.textContent = (crit ? "CRIT " : "-") + dmg;
  enemyDiv.appendChild(f);
  setTimeout(()=>f.remove(),1000);

  setTimeout(()=>{
    enemyDiv.classList.remove("hit","crit");
    weaponDiv.classList.remove("swing","crit");
  },150);

  if(enemy.hp <= 0){
    enemy.alive = false;
    setTimeout(winEnemy, 400);
  }
}

/* === DROPS (50% menos → 15%) === */
function dropWeapon(){
  if(Math.random() > 0.15) return;

  const w = weapons[Math.floor(Math.random()*weapons.length)];

  if(!player.inventory[w.name]){
    player.inventory[w.name] = {
      ...w,
      qty: 0,
      time: 30 // ⏳ 30 segundos
    };
  }

  if(player.inventory[w.name].qty < 999){
    player.inventory[w.name].qty++;
  }

  popup("🎁 " + w.name);
}

/* === VICTORIA === */
function winEnemy(){
  player.xp += enemy.boss ? 50 : 25;

  if(enemy.boss){
    difficulty *= 2; // 🔥 ESCALADO REAL
    popup("⚠️ DIFICULTAD x" + difficulty);
  }

  if(player.xp >= 100){
    player.xp = 0;
    player.level++;
    popup("⬆️ NIVEL " + player.level);
  }

  dropWeapon();
  updateMenu();
  spawnEnemy();
}

/* === INVENTARIO === */
function renderInventory(){
  itemsDiv.innerHTML = "";

  for(const k in player.inventory){
    const w = player.inventory[k];
    const d = document.createElement("div");
    d.className = "item " + w.rarity;
    d.innerHTML = `
      <span>${w.name} x${w.qty}<br>⏳ ${w.time}s</span>
      <span>+${w.dmg}</span>
    `;
    d.onclick = ()=>{player.weapon = w; closeInventory();};
    itemsDiv.appendChild(d);
  }

  if(itemsDiv.innerHTML === ""){
    itemsDiv.innerHTML = "<p>Vacío</p>";
  }
}

/* === TIMER DE ARMAS (30s) === */
setInterval(()=>{
  if(player.weapon){
    player.weapon.time--;
    weaponTimer.textContent = "⏳ " + player.weapon.time + "s";

    if(player.weapon.time <= 0){
      popup("🗑️ Arma destruida");
      delete player.inventory[player.weapon.name];
      player.weapon = null;
      weaponTimer.textContent = "";
    }
  } else {
    weaponTimer.textContent = "";
  }
},1000);

updateMenu();

let tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://TU_USUARIO.github.io/TU_REPO/tonconnect-manifest.json"
});

async function connectWallet(){
  const wallet = await tonConnectUI.connectWallet();
  document.getElementById("walletAddress").innerText =
    wallet.account.address.slice(0,6)+"..."+wallet.account.address.slice(-4);
}
