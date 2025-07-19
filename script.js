// Funktion zum Laden der Mob-Daten
fetch('mobs.json')
  .then(response => response.json())
  .then(mobs => {
    const mobListContainer = document.querySelector('.mob-list');
    mobs.forEach(mob => {
      const mobItem = document.createElement('div');
      mobItem.classList.add('mob-item');

      mobItem.innerHTML = `
        <img src="${mob.image}" alt="${mob.name}">
        <h2>${mob.name}</h2>
        <p><strong>Chance:</strong> ${mob.chance}</p>
        <p><strong>Dimension:</strong> ${mob.dimension}</p>
        <p><strong>Lichtlevel:</strong> ${mob.light}</p>
        <p><strong>Bedingungen:</strong> ${mob.conditions.join(', ')}</p>
        <p><strong>Hinweis:</strong> ${mob.note}</p>
      `;

      mobListContainer.appendChild(mobItem);
    });
  })
  .catch(error => console.error('Fehler beim Laden der Mobs:', error));
