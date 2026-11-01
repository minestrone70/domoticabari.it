document.querySelectorAll('.bed-voice-figure').forEach((figure) => {
  const button = figure.querySelector('.bed-voice-toggle');
  if (!button) return;

  button.addEventListener('click', () => {
    const paused = figure.classList.toggle('is-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Riprendi animazione' : 'Metti in pausa';
  });
});
