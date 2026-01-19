Telegram.WebApp.ready();

/* DATA */
let data = JSON.parse(localStorage.getItem("tapquest")) || {
  level:1,
  xp:0,
  coin:0,
  weapon:null,
  inventory:[]
};

let enemyHp = 100;

/* ITEMS */
const dropTable = [
  {id:"sword_common",name:"Espada Común",rarity:"common",dmg:2,img:"assets/items/sword_common.png",chance:0.5},
  {id:"sword_rare",name:"Espada Rara",rarity:"rare",dmg:5,img:"assets/items/sword_rare.png",chance:0.25},
  {id:"sword_epic",name:"Espada Épica",rarity:"epic",dmg:8,img:"assets/items/sword_epic.png",chance:0.15},
  {id:"sword_leg",name:"Espada Legendaria",rarity:"legendary",dmg:12,img:"assets/items/sword_legendary.png",chance:0.1}
];

/* UI */
function updateMenu(){
  level.textContent=data.level;
  xp.textContent=data.xp;
  coin.textContent=data.coin;
  xpBar.style.width=data.xp+"%";
}
function save(){
  localStorage.setItem("tapquest",JSON.stringify(data));
}

/* NAV */
function startGame(){
  menu.classList.remove("show");
  game.classList.add("show");
  enemyHp=100;
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
