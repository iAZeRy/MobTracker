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

 const content = document.createElement("div");
  content.className = "mob-group-content";

  const variants = document.createElement("div");
  variants.className = "mob-variants";

  const inlineInfo = document.createElement("div");
  inlineInfo.className = "mob-info-inline";
  inlineInfo.innerHTML = "<p>Klicke auf einen Mob für Details</p>";

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
      inlineInfo.innerHTML = `
        <h3>${mob.name.replace(/_/g, " ")}</h3>
        <img src="images/${mob.image}" style="width: 100px; border-radius: 8px;"><br><br>
        <strong>Biome:</strong> ${mob.biome || "Unbekannt"}<br>
        <strong>Spawn-Wahrscheinlichkeit:</strong> ${mob.chance || "Unbekannt"}<br>
        <strong>Schwierigkeitsgrad:</strong> ${mob.difficulty || "Unbekannt"}
      `;
    });

    variants.appendChild(variant);
  });

  content.appendChild(variants);
  content.appendChild(inlineInfo);

  group.appendChild(header);
  group.appendChild(content);

}
