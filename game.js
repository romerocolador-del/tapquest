Telegram.WebApp.ready();

/* ========= DATA ========= */
let data = JSON.parse(localStorage.getItem("tapquest")) || {
  level:1,
  xp:0,
  coin:0
};

let enemyHp = 100;
const enemyMaxHp = 100;

/* ========= SAVE ========= */
function save(){
  localStorage.setItem("tapquest", JSON.stringify(data));
}

/* ========= UI ========= */
function updateMenu(){
  document.getElementById("level").textContent = data.level;
  document.getElementById("xp").textContent = data.xp;
  document.getElementById("coin").textContent = data.coin;
}

function updateEnemyBar(){
  const bar = document.getElementById("enemyHpBar");
  bar.style.width = (enemyHp / enemyMaxHp * 100) + "%";
}

/* ========= NAV ========= */
function startGame(){
  document.getElementById("menu").classList.remove("show");
  document.getElementById("game").classList.add("show");
  resetEnemy();
}

function backMenu(){
  document.getElementById("game").classList.remove("show");
  document.getElementById("menu").classList.add("show");
  updateMenu();
}

/* ========= ENEMY ========= */
function resetEnemy(){
  enemyHp = enemyMaxHp;
  updateEnemyBar();
}

/* ========= COMBAT ========= */
function attack(){
  if(enemyHp <= 0) return;

  const enemy = document.getElementById("enemy");

  let dmg = Math.floor(Math.random() * 6) + 4;
  enemyHp -= dmg;

  // hit effect
  enemy.classList.add("hit");
  setTimeout(()=>enemy.classList.remove("hit"),120);

  // floating damage
  let f = document.createElement("div");
  f.className = "float";
  f.style.left = "50%";
  f.style.top = "50%";
  f.textContent = "-" + dmg;
  enemy.appendChild(f);
  setTimeout(()=>f.remove(),1000);

  updateEnemyBar();

  if(enemyHp <= 0){
    winEnemy();
  }
}

/* ========= WIN ========= */
function winEnemy(){
  data.xp += 20;
  data.coin += 5;

  if(data.xp >= 100){
    data.xp = 0;
    data.level++;
  }

  save();
  updateMenu();
  resetEnemy();
}

/* ========= INIT ========= */
updateMenu();
save();function save(){
  localStorage.setItem("tapquest",JSON.stringify(data));
}

/* ================= NAV ================= */
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
}

/* ================= MAP / ENEMY ================= */
function spawnEnemy(){
  isBoss = data.level % 5 === 0;

  let zone = zones[data.zone];
  enemyHp = isBoss ? zone.enemyHp * 2.5 : zone.enemyHp;

  zoneTitle.textContent = zone.name + (isBoss ? " 👑 BOSS" : "");
  enemyHpBar.style.width="100%";

  enemy.className = "sprite enemy-idle" + (isBoss ? " boss" : "");
}

/* ================= INVENTORY ================= */
function renderInventory(){
  items.innerHTML="";
  data.inventory.forEach(i=>{
    let d=document.createElement("div");
    d.className="item "+i.rarity;
    d.innerHTML=`<img src="${i.img}"><div>${i.name}<br>+${i.dmg} DMG</div>`;
    d.onclick=()=>{data.weapon=i;save();alert("Arma equipada")};
    items.appendChild(d);
  });
}

/* ================= COMBAT ================= */
function attack(){
  const hero=document.getElementById("hero");
  const enemy=document.getElementById("enemy");

  hero.className="sprite hero-attack";
  enemy.className="sprite enemy-hit"+(isBoss?" boss":"");

  let weaponBonus=data.weapon?data.weapon.dmg:0;
  let base = isBoss ? 4 : 6;
  let dmg=Math.floor(Math.random()*6)+base+weaponBonus;

  enemyHp-=dmg;
  enemyHpBar.style.width=Math.max(enemyHp,0)/(isBoss?zones[data.zone].enemyHp*2.5:zones[data.zone].enemyHp)*100+"%";

  let f=document.createElement("div");
  f.className="float";
  f.textContent="-"+dmg;
  enemy.appendChild(f);
  setTimeout(()=>f.remove(),800);

  if(enemyHp<=0){
    killEnemy();
  }

  setTimeout(()=>{
    hero.className="sprite hero-idle";
    enemy.className="sprite enemy-idle"+(isBoss?" boss":"");
  },400);
}

/* ================= KILL ================= */
function killEnemy(){
  let zone = zones[data.zone];

  data.xp += isBoss ? 40 : 20;
  data.coin += isBoss ? zone.reward*3 : zone.reward;

  if(Math.random() < (isBoss ? 0.9 : 0.3)){
    rollDrop();
  }

  if(data.xp>=100){
    data.xp=0;
    data.level++;

    if(data.level % 3 === 0 && data.zone < zones.length-1){
      data.zone++;
      alert("🗺️ Nueva zona desbloqueada: "+zones[data.zone].name);
    }
  }

  save();
  updateMenu();
  spawnEnemy();
}

/* ================= DROP ================= */
function rollDrop(){
  let r=Math.random(), acc=0;
  for(let i of dropTable){
    acc+=i.chance;
    if(r<=acc){
      data.inventory.push(i);
      alert("🎁 Obtuviste: "+i.name);
      break;
    }
  }
}

updateMenu();
save();  enemyHp=100;
  enemyHpBar.style.width="100%";
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
}

/* INVENTORY */
function renderInventory(){
  items.innerHTML="";
  data.inventory.forEach(i=>{
    let d=document.createElement("div");
    d.className="item "+i.rarity;
    d.innerHTML=`<img src="${i.img}"><div>${i.name}<br>+${i.dmg} DMG</div>`;
    d.onclick=()=>{data.weapon=i;save();alert("Arma equipada")};
    items.appendChild(d);
  });
}

/* COMBAT */
function attack(){
  const hero=document.getElementById("hero");
  const enemy=document.getElementById("enemy");

  hero.className="sprite hero-attack";
  enemy.className="sprite enemy-hit";

  let weaponBonus=data.weapon?data.weapon.dmg:0;
  let dmg=Math.floor(Math.random()*6)+6+weaponBonus;

  enemyHp-=dmg;
  enemyHpBar.style.width=Math.max(enemyHp,0)+"%";

  let f=document.createElement("div");
  f.className="float";
  f.textContent="-"+dmg;
  enemy.appendChild(f);
  setTimeout(()=>f.remove(),800);

  if(enemyHp<=0){
    enemyHp=100;
    data.xp+=20;
    data.coin+=5;
    rollDrop();
    if(data.xp>=100){data.xp=0;data.level++}
  }

  setTimeout(()=>{
    hero.className="sprite hero-idle";
    enemy.className="sprite enemy-idle";
    updateMenu();
    save();
  },500);
}

/* DROP */
function rollDrop(){
  let r=Math.random(), acc=0;
  for(let i of dropTable){
    acc+=i.chance;
    if(r<=acc){
      data.inventory.push(i);
      alert("🎁 Obtuviste: "+i.name);
      break;
    }
  }
}

updateMenu();
save();
