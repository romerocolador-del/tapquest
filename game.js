let gold = 0;
let energy = 100;
let currentZone = null;

function enterZone(zone) {
  currentZone = zone;

  document.getElementById("zone").style.display = "block";
  document.querySelector(".card").style.display = "none";

  if (zone === 1) {
    document.getElementById("zoneName").innerText = "🌲 Bosque Inicial";
  }
}

function back() {
  document.getElementById("zone").style.display = "none";
  document.querySelector(".card").style.display = "block";
}

function tap() {
  if (energy <= 0) {
    alert("Sin energía 😴");
    return;
  }

  gold += 1;
  energy -= 1;

  document.getElementById("gold").innerText = gold;
  document.getElementById("energy").innerText = energy;
}
