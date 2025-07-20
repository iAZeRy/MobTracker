<script>
  // Gruppen öffnen/schließen
  document.querySelectorAll('.group-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const variants = button.nextElementSibling;
      variants.style.display = variants.style.display === 'flex' ? 'none' : 'flex';
    });
  });

  // Infos ein-/ausblenden
  function toggleInfo(card) {
    const infoBox = card.querySelector('.mob-info');

    // Wenn schon offen, schließen
    if (infoBox.style.display === 'block') {
      infoBox.style.display = 'none';
      card.style.transform = 'scale(1)';
    } else {
      // Alle anderen schließen
      document.querySelectorAll('.mob-info').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.mob-card').forEach(el => el.style.transform = 'scale(1)');

      // Diese öffnen
      infoBox.style.display = 'block';
      card.style.transform = 'scale(1.05)';
    }
  }
</script>
