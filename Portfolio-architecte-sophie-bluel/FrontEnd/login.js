// Sélectionner le formulaire
const soumettre = document.getElementById('soumettre');
console.log(soumettre)

// Ajouter un écouteur d'événement pour soumettre le formulaire
soumettre.addEventListener('click', function (event) {
    event.preventDefault() // Empêcher le formulaire de se soumettre normalement

    // Récupérer les valeurs des champs de formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Envoyer les données du formulaire à l'API pour l'authentification
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // Envoyer les données JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la requête');
            }
            // Extraire le token d'authentification de la réponse
            return response.json();
        })
        .then(data => {
            const token = data.token; // Supposons que le token est renvoyé sous la clé 'token'
            // Stocker le token dans le stockage local
            localStorage.setItem('authToken', token);

            // Rediriger vers la page d'accueil
            window.location.href = 'index.html';
        })
        .catch(error => {
            // Erreur lors de la requête
            console.error("Erreur lors de la requête :", error);
            // Afficher un message d'erreur
            document.getElementById('errorMessage').textContent = 'Erreur dans l’identifiant ou le mot de passe';
        });
}, true);