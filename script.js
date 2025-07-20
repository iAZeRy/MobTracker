async function loadMobs() {
    const response = await fetch('mobs.json');
    return await response.json();
}

function groupMobs(mobs) {
    const groups = {};
    mobs.forEach(mob => {
        if (!groups[mob.group]) groups[mob.group] = [];
        groups[mob.group].push(mob);
    });
    return groups;
}

function renderGroups(groups) {
    const mobList = document.getElementById('mobList');
    mobList.innerHTML = '';
    for (const group in groups) {
        const groupSection = document.createElement('section');
        groupSection.className = 'mob-group';
        groupSection.innerHTML = `<h2>${group}</h2><div class="mob-group-cards"></div>`;
        const cardsContainer = groupSection.querySelector('.mob-group-cards');
        groups[group].forEach(mob => {
            const card = document.createElement('div');
            card.className = 'mob-card';
            card.tabIndex = 0;
            card.innerText = mob.name;
            card.addEventListener('click', () => showInfoPanel(mob));

            // Bild einfügen:
            const img = document.createElement('img');
            img.src = `images/${mob.image}`;
            img.alt = mob.name;
            card.appendChild(img);

            cardsContainer.appendChild(card);
        });
        mobList.appendChild(groupSection);
    }
}

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.id = 'mobSearch';
searchInput.placeholder = 'Mob suchen...';
const mobList = document.getElementById('mobList');
mobList.parentNode.insertBefore(searchInput, mobList);

searchInput.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const filteredMobs = allMobs.filter(mob => 
        mob.name.toLowerCase().includes(search) || 
        (mob.group && mob.group.toLowerCase().includes(search))
    );
    renderGroups(groupMobs(filteredMobs));
});

function showInfoPanel(mob) {
    openModal(`<h2>${mob.name}</h2><p>${mob.description || "Keine Beschreibung."}</h2></p>${mob.spawnrate || "Keine Spawnrate."}</h2></p>${mob.lebenspunkte || "Keine Lebenspunkte."}</h2></p>${mob.biom || "Kein Biom."}</p>`);
}

let allMobs = [];
loadMobs().then(data => {
    allMobs = data.mobs;
    renderGroups(groupMobs(allMobs));
});

function openModal(info) {
    document.getElementById('infotext').innerHTML = info;
    document.getElementById('infopanel-modal').style.display = 'block';
}
function closeModal() {
    document.getElementById('infopanel-modal').style.display = 'none';
}
