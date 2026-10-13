(() => {
  const form = document.getElementById('message-form');
  const topicField = document.getElementById('argomento');
  const messageField = document.getElementById('message');
  if (!form || !topicField || !messageField) return;

  const drafts = {
    'Smart Cloud': 'Vorrei informazioni sulla soluzione Smart Cloud. La mia abitazione e le funzioni di interesse sono: ',
    'Advanced Pro': 'Vorrei valutare la soluzione Advanced Pro. La mia abitazione e le funzioni di interesse sono: ',
    'Custom Full': 'Vorrei un preventivo per un progetto Custom Full. Gli ambienti e le integrazioni richieste sono: ',
    'BNBReady · Demo e prezzi': 'Vorrei richiedere una demo di BNBReady e informazioni sui prezzi. La mia struttura e le funzioni di interesse sono: '
  };

  document.querySelectorAll('[data-pricing-topic]').forEach(link => {
    link.addEventListener('click', () => {
      const topic = link.dataset.pricingTopic;
      if (!Object.hasOwn(drafts, topic)) return;
      topicField.value = topic;
      const previousDraft = Object.values(drafts).find(draft => messageField.value.startsWith(draft));
      const details = previousDraft
        ? messageField.value.slice(previousDraft.length)
        : messageField.value.trim();
      messageField.value = drafts[topic] + details;
      requestAnimationFrame(() => messageField.focus({ preventScroll: true }));
    });
  });
})();
