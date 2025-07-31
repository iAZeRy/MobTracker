// Globale Variablen
let allMobs = [];
let currentGroupFilter = 'all';
let currentSortKey = '';
let currentSearch = '';

// DOM-Elemente cachen
const mobList = document.getElementById('mobList');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('mobSearch');
const modal = document.getElementById('infopanel-modal');
const infoText = document.getElementById('infotext');

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    loadMobs();
    setupEventListeners();
});

// Event Listeners einrichten
function setupEventListeners() {
    filterSelect?.addEventListener('change', handleFilterChange);
    sortSelect?.addEventListener('change', handleSortChange);
    searchInput?.addEventListener('input', debounce(handleSearchInput, 300));
    
    // Modal-Events
    modal?.addEventListener('click', handleModalClick);
    document.addEventListener('keydown', handleKeydown);
    
    // Close-Button im Modal
    const closeBtn = modal?.querySelector('.close');
    closeBtn?.addEventListener('click', closeModal);
}

// Debounce für Suchfeld
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Event Handler
function handleFilterChange(e) {
    currentGroupFilter = e.target.value;
    applyFilters();
}

function handleSortChange(e) {
    currentSortKey = e.target.value;
    applyFilters();
}

function handleSearchInput(e) {
    currentSearch = e.target.value.toLowerCase().trim();
    applyFilters();
}

function handleModalClick(e) {
    if (e.target === modal) {
        closeModal();
    }
}

function handleKeydown(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
    
    // Enter/Space für Mob-Karten
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('mob-card')) {
        e.preventDefault();
        const mobName = e.target.dataset.mobName;
        const mob = allMobs.find(m => m.name === mobName);
        if (mob) showInfoPanel(mob);
    }
}

// Mobs laden
async function loadMobs() {
    try {
        showLoadingState();
        
        const response = await fetch('mobs.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validierung der Daten
        if (!data || !Array.isArray(data.mobs)) {
            throw new Error('Ungültiges Datenformat');
        }
        
        allMobs = data.mobs;
        hideLoadingState();
        applyFilters();
        
    } catch (error) {
        console.error('Fehler beim Laden der Mobs:', error);
        showErrorState(error.message);
    }
}

// Loading/Error States
function showLoadingState() {
    if (mobList) {
        mobList.innerHTML = '<div class="loading">Mobs werden geladen...</div>';
    }
}

function hideLoadingState() {
    const loadingElement = mobList?.querySelector('.loading');
    loadingElement?.remove();
}

function showErrorState(message) {
    if (mobList) {
        mobList.innerHTML = `
            <div class="error-state">
                <h3>❌ Fehler beim Laden</h3>
                <p>${message}</p>
                <button onclick="loadMobs()" class="retry-btn">Erneut versuchen</button>
            </div>
        `;
    }
}

// Filter und Sortierung
function applyFilters() {
    let filtered = [...allMobs]; // Shallow copy

    // Suche anwenden
    if (currentSearch) {
        filtered = filtered.filter(mob =>
            mob.name.toLowerCase().includes(currentSearch) ||
            (mob.group && mob.group.toLowerCase().includes(currentSearch)) ||
            (mob.description && mob.description.toLowerCase().includes(currentSearch))
        );
    }

    // Gruppenfilter anwenden
    if (currentGroupFilter !== 'all') {
        filtered = filtered.filter(mob => mob.group === currentGroupFilter);
    }

    // Sortierung anwenden
    filtered = applySorting(filtered);

    // Ergebnisse rendern
    const groups = groupMobs(filtered);
    renderGroups(groups);
    updateResultsCount(filtered.length);
}

function applySorting(mobs) {
    if (!currentSortKey) return mobs;

    return mobs.sort((a, b) => {
        switch (currentSortKey) {
            case 'name':
                return a.name.localeCompare(b.name, 'de');
                
            case 'lebenspunkte':
                const getHP = str => {
                    const match = str?.toString().match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                };
                return getHP(b.lebenspunkte) - getHP(a.lebenspunkte);
                
            case 'spawnrate':
                const getAvgSpawnRate = val => {
                    if (!val) return 0;
                    const match = val.toString().match(/(\d+)-?(\d+)?/);
                    if (!match) return 0;
                    const min = parseInt(match[1]);
                    const max = match[2] ? parseInt(match[2]) : min;
                    return (min + max) / 2;
                };
                return getAvgSpawnRate(b.spawnrate) - getAvgSpawnRate(a.spawnrate);
                
            default:
                return 0;
        }
    });
}

// Mobs gruppieren
function groupMobs(mobs) {
    const groups = {};
    mobs.forEach(mob => {
        const group = mob.group || 'Unbekannt';
        if (!groups[group]) groups[group] = [];
        groups[group].push(mob);
    });
    return groups;
}

// Gruppen rendern
function renderGroups(groups) {
    if (!mobList) return;

    const groupKeys = Object.keys(groups);
    
    if (groupKeys.length === 0) {
        mobList.innerHTML = `
            <div class="no-results">
                <h3>🔍 Keine Mobs gefunden</h3>
                <p>Versuche andere Suchkriterien oder Filter.</p>
            </div>
        `;
        return;
    }

    // Fragment für bessere Performance
    const fragment = document.createDocumentFragment();

    groupKeys.forEach(groupName => {
        const groupSection = createGroupSection(groupName, groups[groupName]);
        fragment.appendChild(groupSection);
    });

    mobList.innerHTML = '';
    mobList.appendChild(fragment);
}

function createGroupSection(groupName, mobs) {
    const section = document.createElement('section');
    section.className = 'mob-group';
    section.setAttribute('aria-labelledby', `group-${groupName}`);

    const header = document.createElement('h2');
    header.id = `group-${groupName}`;
    header.textContent = `${groupName} (${mobs.length})`;
    
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'mob-group-cards';

    mobs.forEach(mob => {
        const card = createMobCard(mob);
        cardsContainer.appendChild(card);
    });

    section.appendChild(header);
    section.appendChild(cardsContainer);
    
    return section;
}

function createMobCard(mob) {
    const card = document.createElement('div');
    card.className = 'mob-card';
    card.tabIndex = 0;
    card.dataset.mobName = mob.name;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Mob-Karte für ${mob.name}. Klicken für Details.`);

    // Bild erstellen
    const img = document.createElement('img');
    img.src = `images/${mob.image}`;
    img.alt = `Bild von ${mob.name}`;
    img.loading = 'lazy';
    img.onerror = handleImageError;

    // Name-Element
    const nameElement = document.createElement('div');
    nameElement.className = 'mob-name';
    nameElement.textContent = mob.name;

    // Gruppe-Element
    const groupElement = document.createElement('div');
    groupElement.className = 'mob-group-badge';
    groupElement.textContent = mob.group || 'Unbekannt';

    // Event-Listener
    card.addEventListener('click', () => showInfoPanel(mob));

    // Elemente hinzufügen
    card.appendChild(img);
    card.appendChild(nameElement);
    card.appendChild(groupElement);

    return card;
}

function handleImageError(e) {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNDQ0IiByeD0iNCIvPgo8dGV4dCB4PSIzMiIgeT0iMzgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj4/PC90ZXh0Pgo8L3N2Zz4K';
    e.target.alt = 'Bild nicht verfügbar';
}

// Info-Panel anzeigen
function showInfoPanel(mob) {
    if (!mob || !infoText) return;

    const info = `
        <h2>${escapeHtml(mob.name)}</h2>
        ${mob.image ? `<img src="images/${mob.image}" alt="${escapeHtml(mob.name)}" class="modal-image" onerror="this.style.display='none'">` : ''}
        <div class="info-grid">
            <div class="info-item">
                <strong>Gruppe:</strong> ${escapeHtml(mob.group || 'Unbekannt')}
            </div>
            <div class="info-item">
                <strong>Lebenspunkte:</strong> ${escapeHtml(mob.lebenspunkte || 'Unbekannt')}
            </div>
            <div class="info-item">
                <strong>Spawnrate:</strong> ${escapeHtml(mob.spawnrate || 'Unbekannt')}
            </div>
            <div class="info-item">
                <strong>Biom:</strong> ${escapeHtml(mob.biom || 'Unbekannt')}
            </div>
        </div>
        <div class="description">
            <strong>Beschreibung:</strong>
            <p>${escapeHtml(mob.description || 'Keine Beschreibung verfügbar.')}</p>
        </div>
    `;

    openModal(info);
}

// HTML escaping für Sicherheit
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal-Funktionen
function openModal(info) {
    if (!modal || !infoText) return;
    
    infoText.innerHTML = info;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus auf Close-Button setzen
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) closeBtn.focus();
    
    // Body-Scroll verhindern
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    
    // Body-Scroll wieder erlauben
    document.body.style.overflow = '';
    
    // Focus zurück auf vorheriges Element
    const activeCard = document.querySelector('.mob-card:focus');
    if (activeCard) activeCard.focus();
}

// Ergebniszähler aktualisieren
function updateResultsCount(count) {
    const counter = document.getElementById('results-count');
    if (counter) {
        counter.textContent = `${count} Mob${count !== 1 ? 's' : ''} gefunden`;
    }
}

// Legacy-Funktion für Kompatibilität
function filterAndRenderMobs() {
    applyFilters();
}
