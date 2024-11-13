document.addEventListener("DOMContentLoaded", function() {
    // Funzione per inviare una richiesta al webhook
    const webhookUrl = 'https://wildcat.freeddns.org/api/webhook/-KOg46vLBrtUt85BbBE4igjBW'; 
    // Ottieni l'IP pubblico usando ipify
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(ipData => {
            // Prepara i dati da inviare al webhook
            const data = {
                timestamp: new Date().toISOString(),  // Timestamp della visita
                user_agent: navigator.userAgent,      // User agent del visitatore
                ip_address: ipData.ip                 // IP pubblico del visitatore
            };

            // Invia la richiesta POST al webhook
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)  // Converte l'oggetto in formato JSON
            })
            .then(response => {
                if (response.ok) {
                    console.log('Visita registrata con successo');
                } else {
                    console.error('Errore nel registrare la visita');
                }
            })
            .catch(err => {
                console.error('Errore di rete:', err);
            });
        })
        .catch(err => {
            console.error('Errore nel recupero dell\'IP:', err);
        });
});
