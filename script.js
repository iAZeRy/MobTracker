const mobGroups = [
  {
    groupName: "Zombies",
    mobs: [
      {
        name: "Zombie_Blacksmith",
        location: "Overworld – Dörfer",
        spawnChance: "2%",
        difficulty: "Normal & Schwer"
      },
      {
        name: "Zombie_Butcher",
        location: "Overworld – Dörfer",
        spawnChance: "2%",
        difficulty: "Normal & Schwer"
      },
      {
        name: "Zombie_Farmer",
        location: "Overworld – Dörfer",
        spawnChance: "2%",
        difficulty: "Normal & Schwer"
      },
      {
        name: "Zombie_Fisherman",
        location: "Overworld – Dörfer",
        spawnChance: "2%",
        difficulty: "Normal & Schwer"
      },
      {
        name: "Zombie_Librarian",
        location: "Overworld – Dörfer",
        spawnChance: "2%",
        difficulty: "Normal & Schwer"
      },
      {
        name: "Zombie_Shepherd",
        location: "Overworld – Dörfer",
        spawnChance: "2%",
        difficulty: "Normal & Schwer"
      }
    ]
  },
  {
    groupName: "Chicken Jockeys",
    mobs: [
      {
        name: "Chicken_Jockey_Baby_Zombie",
        location: "Overworld – Dunkle Orte",
        spawnChance: "0.25%",
        difficulty: "Normal & Schwer"
      },
      {
        name: "Chicken_Jockey_Baby_Husk",
        location: "Wüsten",
        spawnChance: "0.25%",
        difficulty: "Normal & Schwer"
      }
    ]
  }
];

function renderMobs() {
  const container = document.getElementById("mobContainer");
  container.innerHTML = "";

  mobGroups.forEach((group, i) => {
    const groupWrapper = document.createElement("div");
    groupWrapper.classList.add("mob-group");

    const header = document.createElement("div");
    header.classList.add("accordion-header");
    header.innerText = group.groupName;
    header.addEventListener("click", () => {
      const content = groupWrapper.querySelector(".accordion-content");
      content.style.display = content.style.display === "none" ? "block" : "none";
    });

    const content = document.createElement("div");
    content.classList.add("accordion-content");
    content.style.display = "none";

    group.mobs.forEach(mob => {
      const mobDiv = document.createElement("div");
      mobDiv.classList.add("mob-card");
      
      mobDiv.innerHTML = `
        <h3>${mob.name.replace(/_/g, " ")}</h3>
        <p><strong>Ort:</strong> ${mob.location}</p>
        <p><strong>Spawnrate:</strong> ${mob.spawnChance}</p>
        <p><strong>Schwierigkeit:</strong> ${mob.difficulty}</p>
        <video src="videos/${mob.name}.webm" autoplay loop muted width="160" height="160"></video>
      `;
      
      content.appendChild(mobDiv);
    });

    groupWrapper.appendChild(header);
    groupWrapper.appendChild(content);
    container.appendChild(groupWrapper);
  });
}

renderMobs();
