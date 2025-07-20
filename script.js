const mobs = {
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

const mobList = document.getElementById("mobList");
const mobInfo = document.getElementById("mobInfo");

for (const groupName in mobs) {
  const group = document.createElement("div");
  group.className = "mob-group";

  const header = document.createElement("div");
  header.className = "mob-group-header";
  header.textContent = groupName;

  const variants = document.createElement("div");
  variants.className = "mob-variants";

  header.addEventListener("click", () => {
    variants.style.display = variants.style.display === "block" ? "none" : "block";
  });

  mobs[groupName].forEach(mob => {
    const variant = document.createElement("div");
    variant.className = "mob-variant";

    const img = document.createElement("img");
    img.src = `images/${mob.image}`;
    img.alt = mob.name;

    const span = document.createElement("span");
    span.textContent = mob.name;

    variant.appendChild(img);
    variant.appendChild(span);

    variant.addEventListener("click", () => {
      mobInfo.innerHTML = `
        <h2>${mob.name}</h2>
        <img src="images/${mob.image}" alt="${mob.name}" style="width: 100px; border-radius: 8px;">
        <p>${mob.info}</p>
      `;
    });

    variants.appendChild(variant);
  });

  group.appendChild(header);
  group.appendChild(variants);
  mobList.appendChild(group);
}
