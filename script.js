async function loadMobs() {
    try {
        const response = await fetch('mobs.json');
        if (!response.ok) throw new Error('Datei konnte nicht geladen werden.');
        const data = await response.json();
        allMobs = data.mobs;
        filterAndRenderMobs(); // Direktes Rendering nach dem Laden
    } catch (error) {
        console.error('Fehler beim Laden der Mobs:', error);
        alert('Es gab einen Fehler beim Laden der Mobs. Bitte versuche es später erneut.');
    }
}

// Aktueller Filter- und Suchzustand
let currentGroupFilter = 'all';
let currentSortKey = '';
let currentSearch = '';

function applyFilters() {
    let filtered = allMobs;

    // Suche
    if (currentSearch) {
        filtered = filtered.filter(mob =>
            mob.name.toLowerCase().includes(currentSearch) ||
            (mob.group && mob.group.toLowerCase().includes(currentSearch))
        );
    }

    // Gruppenfilter
    if (currentGroupFilter !== 'all') {
        filtered = filtered.filter(mob => mob.group === currentGroupFilter);
    }

    // Sortierung
    if (currentSortKey === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSortKey === 'lebenspunkte') {
        const getHP = str => parseInt(str?.match(/\d+/)?.[0] || 0);
        filtered.sort((a, b) => getHP(b.lebenspunkte) - getHP(a.lebenspunkte));
    } else if (currentSortKey === 'spawnrate') {
        const avg = val => {
            const match = val?.match(/(\d+)-?(\d+)?/);
            if (!match) return 0;
            const min = parseInt(match[1]);
            const max = match[2] ? parseInt(match[2]) : min;
            return (min + max) / 2;
        };
        filtered.sort((a, b) => avg(b.spawnrate) - avg(a.spawnrate));
    }

    // Die gruppierten Mobs rendern
    renderGroups(groupMobs(filtered));
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
    mobList.innerHTML = ''; // Zuerst leeren

    if (Object.keys(groups).length === 0) {
        mobList.innerHTML = '<p>Keine Mobs gefunden.</p>';
        return;
    }

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
searchInput.style.marginRight = '20px';

// Füge das Suchfeld direkt vor den Steuerungen ein
const controls = document.getElementById('controls');
controls.parentNode.insertBefore(searchInput, controls);

searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase();
    applyFilters();
});


function showInfoPanel(mob) {
    openModal(`
        <h2>${mob.name}</h2>
        <p><strong>Beschreibung:</strong> ${mob.description || "Keine Beschreibung."}</p>
        <p><strong>Spawnrate:</strong> ${mob.spawnrate || "Keine Spawnrate."}</p>
        <p><strong>Lebenspunkte:</strong> ${mob.lebenspunkte || "Keine Lebenspunkte."}</p>
        <p><strong>Biom:</strong> ${mob.biom || "Kein Biom."}</p>
    `);
}

let allMobs = [];
loadMobs();  // ✅ nur das hier
});

function openModal(info) {
    document.getElementById('infotext').innerHTML = info;
    document.getElementById('infopanel-modal').style.display = 'block';
}
function closeModal() {
    document.getElementById('infopanel-modal').style.display = 'none';
}

document.getElementById('filterSelect').addEventListener('change', e => {
    currentGroupFilter = e.target.value;
    applyFilters();
});

document.getElementById('sortSelect').addEventListener('change', e => {
    currentSortKey = e.target.value;
    applyFilters();
});

function filterAndRenderMobs() {
    applyFilters();  // Mehr braucht es nicht
}

