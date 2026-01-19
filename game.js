const tg = window.Telegram.WebApp;
tg.expand();

let gold = 0;
let energy = 100;
let currentZone = null;

function enterZone(zone) {
  currentZone = zone;

  document.getElementById("map").classList.add("hidden");
  document.getElementById("zone").classList.remove("hidden");

  if (zone === 1) {
    document.getElementById("zoneName").innerText = "🌲 Bosque Inicial";
  }
  if (zone === 2) {
    document.getElementById("zoneName").innerText = "🏜️ Desierto Antiguo";
  }
  if (zone === 3) {
    document.getElementById("zoneName").innerText = "🏔️ Montañas de Hielo";
  }

  updateUI();
}

function back() {
  document.getElementById("zone").classList.add("hidden");
  document.getElementById("map").classList.remove("hidden");
}

function tap() {
  if (energy <= 0) {
    alert("🔋 Sin energía. Espera a que se recargue.");
    return;
  }

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
