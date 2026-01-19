const tg = window.Telegram.WebApp;
tg.expand();

/* ESTADO DEL JUGADOR */
let gold = 0;
let energy = 100;
let currentZone = null;

/* ENEMIGO */
let enemyHP = 0;
let enemyMaxHP = 0;

/* MISIONES */
let missionKills = 0;
let missionGoal = 5;
let missionCompleted = false;

/* ZONAS */
const zones = {
  1: { name: "🌲 Bosque Inicial", enemyHP: 10, reward: 2 },
  2: { name: "🏜️ Desierto Antiguo", enemyHP: 20, reward: 4 },
  3: { name: "🏔️ Montañas de Hielo", enemyHP: 35, reward: 6 }
};

/* ENTRAR EN ZONA */
function enterZone(zone) {
  currentZone = zone;

  document.getElementById("map").classList.add("hidden");
  document.getElementById("zone").classList.remove("hidden");

  document.getElementById("zoneName").innerText = zones[zone].name;

  spawnEnemy();
  updateUI();
}

/* VOLVER AL MAPA */
function back() {
  document.getElementById("zone").classList.add("hidden");
  document.getElementById("map").classList.remove("hidden");
}

/* GENERAR ENEMIGO */
function spawnEnemy() {
  enemyMaxHP = zones[currentZone].enemyHP;
  enemyHP = enemyMaxHP;
}

/* TAP / ATAQUE */
function tap() {
  if (energy <= 0) {
    alert("🔋 Sin energía");
    return;
  }

  energy -= 1;
  enemyHP -= 1;

  if (enemyHP <= 0) {
    defeatEnemy();
  }

  updateUI();
}

/* DERROTAR ENEMIGO */
function defeatEnemy() {
  gold += zones[currentZone].reward;
  missionKills += 1;

  spawnEnemy();

  if (missionKills >= missionGoal && !missionCompleted) {
    missionCompleted = true;
    gold += 10;
    alert("🎉 Misión completada! +10 Oro");
  }
}

/* ACTUALIZAR UI */
function updateUI() {
  document.getElementById("gold").innerText = gold;
  document.getElementById("energy").innerText = energy;

  document.getElementById("enemyHP").innerText =
    enemyHP + " / " + enemyMaxHP;

  document.getElementById("mission").innerText =
    missionCompleted
      ? "✅ Misión completada"
      : `🗡 Derrota ${missionGoal} enemigos (${missionKills}/${missionGoal})`;
}

/* ENERGÍA IDLE */
setInterval(() => {
  if (energy < 100) {
    energy += 1;
    updateUI();
  }
}, 5000);
/* VOLVER AL MAPA */
function back() {
  document.getElementById("zone").classList.add("hidden");
  document.getElementById("map").classList.remove("hidden");
}

/* GENERAR ENEMIGO */
function spawnEnemy() {
  enemyMaxHP = zones[currentZone].enemyHP;
  enemyHP = enemyMaxHP;
}

/* TAP / ATAQUE */
function tap() {
  if (energy <= 0) {
    alert("🔋 Sin energía");
    return;
  }

  energy -= 1;
  enemyHP -= 1;

  if (enemyHP <= 0) {
    defeatEnemy();
  }

  updateUI();
}

/* DERROTAR ENEMIGO */
function defeatEnemy() {
  gold += zones[currentZone].reward;
  missionKills += 1;

  spawnEnemy();

  if (missionKills >= missionGoal && !missionCompleted) {
    missionCompleted = true;
    gold += 10;
    alert("🎉 Misión completada! +10 Oro");
  }
}

/* ACTUALIZAR UI */
function updateUI() {
  document.getElementById("gold").innerText = gold;
  document.getElementById("energy").innerText = energy;

  document.getElementById("enemyHP").innerText =
    enemyHP + " / " + enemyMaxHP;

  document.getElementById("mission").innerText =
    missionCompleted
      ? "✅ Misión completada"
      : `🗡 Derrota ${missionGoal} enemigos (${missionKills}/${missionGoal})`;
}

/* ENERGÍA IDLE */
setInterval(() => {
  if (energy < 100) {
    energy += 1;
    updateUI();
  }
}, 5000);
  let reward = 1;

  if (currentZone === 2) reward = 3;
  if (currentZone === 3) reward = 5;

  gold += reward;
  energy -= 1;

  updateUI();
}

function updateUI() {
  document.getElementById("gold").innerText = gold;
  document.getElementById("energy").innerText = energy;
}

/* 🔋 REGENERACIÓN IDLE */
setInterval(() => {
  if (energy < 100) {
    energy += 1;
    updateUI();
  }
}, 5000);
