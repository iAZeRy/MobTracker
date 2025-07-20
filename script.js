const mobData = {
   "Zombies": [
    { name: "Zombie", image: "Zombie.png", info: "Spawnt in dunklen Biomen. Wahrscheinlichkeit: Hoch. Schwierigkeit: Alle." },
    { name: "Zombie_in_diamond_armor", image: "Zombie_in_diamond_armor.png", info: "Sehr selten. Wahrscheinlichkeit: Sehr niedrig. Schwierigkeit: Schwer." },
    { name: "Zombie_Librarian", image: "Zombie_Librarian.png", info: "Dorfzombie. Wahrscheinlichkeit: Mittel. Schwierigkeit: Normal und Schwer." }
  ],
  "Chicken Jockeys": [
    { name: "Chicken_Zombie_Butcher_Jockey", image: "Chicken_Zombie_Butcher_Jockey.png", info: "Extrem selten. Spawnt in bestimmten Dörfern." },
    { name: "Chicken_Zombie_Farmer_Jockey", image: "Chicken_Zombie_Farmer_Jockey.png", info: "Sehr selten. Spawnt bei Dorfüberfällen." }
  ],
  "Boss Mobs": [
    { name: "Ender_Dragon", image: "Ender_Dragon.png", info: "Einzigartiger Boss. Spawnt im End. Schwierigkeit: Alle." },
    { name: "Wither", image: "Wither.png", info: "Manuell beschworen. Schwierigkeit: Alle." }
  ]
};

function createMobCard(id, mob) {
  const card = document.createElement('button');
  card.className = 'mob-card';
  card.setAttribute('aria-label', mob.name);
  card.innerHTML = `
    <img src="images/${id}.png" alt="${mob.name}" />
    <div>${mob.name}</div>
  `;
  card.onclick = () => showInfo(id);
  return card;
}

function renderMobs() {
  const mobContent = document.getElementById('mobContent');
  Object.entries(mobData).forEach(([id, mob]) => {
    mobContent.appendChild(createMobCard(id, mob));
  });
}

function showInfo(id) {
  const mob = mobData[id];
  document.getElementById("infoTitle").innerText = mob.name;
  document.getElementById("infoContent").innerHTML = `
    <strong>Biome:</strong> ${mob.biome}<br/>
    <strong>Spawn-Wahrscheinlichkeit:</strong> ${mob.chance}<br/>
    <strong>Schwierigkeitsgrad:</strong> ${mob.difficulty}
  `;
  document.getElementById("infoPanel").classList.add("active");
}

document.getElementById('closeInfoPanel').onclick = () => {
  document.getElementById("infoPanel").classList.remove("active");
};

renderMobs();
