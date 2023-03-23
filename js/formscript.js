    const form = document.querySelector('#message-form');
    form.addEventListener('submit', handleSubmit);

    function handleSubmit(event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const message = document.querySelector('#message').value;
  const telefono = document.querySelector('#telefono').value;

  const data = { name: name, email: email, message: message, telefono: telefono };

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout della richiesta. Riprova più tardi.'));
    }, 5000); // imposta un timeout di 5 secondi
  });

  Promise.race([
    fetch('https://maledizione.duckdns.org/api/webhook/form_domoticabari', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }),
    timeoutPromise
  ])
  .then(response => {
    if (response.ok) {
      document.querySelector('#response').textContent = 'Il messaggio è stato inviato con successo!';
    } else {
      document.querySelector('#response').textContent = 'Si è verificato un errore durante l\'invio del messaggio. Riprova più tardi.';
    }
  })
  .catch(error => {
    document.querySelector('#response').textContent = error.message;
  });
}