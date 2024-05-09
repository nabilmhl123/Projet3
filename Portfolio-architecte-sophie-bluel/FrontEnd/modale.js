fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then(data => console.log(data))    
.catch(error => console.error(error));



document.addEventListener('DOMContentLoaded', function () {
    const modalTrigger = document.querySelector('.modal-trigger');
    const modalContainer = document.querySelector('.modal-container');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalContent = document.querySelector('.modal-content');
    const addPhotoBtn = document.querySelector('.add-photo-btn');
    const secondModalContainer = document.querySelector('.second-modal-container');
    const secondCloseModalBtn = secondModalContainer.querySelector('.close-modal');
    const secondSubmitPhotoBtn = secondModalContainer.querySelector('#submitPhotoBtn');
    const galleryElement = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filtre-button > div');

    // Tableau des objets images
    let images = [
        { src: 'assets/images/abajour-tahina.png', alt: 'Abajour Tahina', caption: 'Abajour Tahina', category: 'objets' },
        { src: 'assets/images/appartement-paris-v.png', alt: 'Appartement Paris V', caption: 'Appartement Paris V', category: 'appartements' },
        { src: 'assets/images/restaurant-sushisen-londres.png', alt: 'Restaurant Sushisen - Londres', caption: 'Restaurant Sushisen - Londres', category: 'hotel' },
        { src: 'assets/images/la-balisiere.png', alt: 'Villa La Balisiere - Port Louis', caption: 'Villa La Balisiere', category: 'appartements' },
        { src: 'assets/images/structures-thermopolis.png', alt: 'Structures Thermopolis', caption: 'Structures Thermopolis', category: 'objets' },
        { src: 'assets/images/appartement-paris-x.png', alt: 'Appartement Paris X', caption: 'Appartement Paris X', category: 'appartements' },
        { src: 'assets/images/le-coteau-cassis.png', alt: 'Pavillon Le coteau', caption: 'Pavillon Le coteau', category: 'hotel' },
        { src: 'assets/images/villa-ferneze.png', alt: 'Villa Ferneze - Isola d’Elba', caption: 'Villa Ferneze - Isola d’Elba', category: 'appartements' },
        { src: 'assets/images/appartement-paris-xviii.png', alt: 'Appartement Paris XVIII', caption: 'Appartement Paris XVIII', category: 'appartements' },
        { src: 'assets/images/bar-lullaby-paris.png', alt: 'Bar Lullaby - Paris', caption: 'Bar “Lullaby” - Paris', category: 'hotel' },
        { src: 'assets/images/hotel-first-arte-new-delhi.png', alt: 'Hotel First Arte - New Delhi', caption: 'Hotel First Arte - New Delhi', category: 'hotel' },
        // Ajoutez le reste de vos images avec leurs catégories correspondantes
    ];

    // Fonction pour mettre à jour la galerie en fonction de la catégorie sélectionnée
    function updateGallery(category) {
        galleryElement.innerHTML = ''; // Efface la galerie existante

        images.forEach(image => {
            if (category === 'tous' || image.category === category) {
                const figureElement = document.createElement('figure');
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;

                const figcaptionElement = document.createElement('figcaption');
                figcaptionElement.textContent = image.caption; // Utiliser le texte de la légende

                figureElement.appendChild(imgElement);
                figureElement.appendChild(figcaptionElement);

                galleryElement.appendChild(figureElement);
            }
        });
    }

    // Écouteurs d'événements pour les boutons de catégorie
    filterButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Empêcher le comportement par défaut du lien
            // Mettre à jour la classe active pour les boutons de filtre
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.id;
            updateGallery(category);
        });
    });

    // Fonction pour afficher les images dans la galerie principale
    function displayImages() {
        modalContent.innerHTML = ''; // Effacer le contenu précédent

        images.forEach(function (image) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-container');

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            deleteIcon.addEventListener('click', function () {
                imgContainer.remove();
                images = images.filter(img => img !== image);
                updateGallery('tous'); // Mettre à jour la galerie après suppression

                // Mettre à jour les données dans le localStorage après la suppression
                saveImagesToLocalStorage();
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteIcon);
            modalContent.appendChild(imgContainer);
        });
    }

    // Gérer l'affichage de la première modale
    modalTrigger.addEventListener('click', function () {
        modalContainer.style.display = 'block';
        displayImages();
    });

    // Fermer la première modale
    closeModalBtn.addEventListener('click', function () {
        modalContainer.style.display = 'none';
    });

    // Fermer la première modale en cliquant en dehors d'elle
    modalContainer.addEventListener('click', function (event) {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });

    // Afficher la deuxième modale au clic sur le bouton "Ajouter une photo"
    addPhotoBtn.addEventListener('click', function () {
        modalContainer.style.display = 'none'; // Cacher la première modale
        secondModalContainer.style.display = 'block'; // Afficher la deuxième modale
    });

    // Fermer la deuxième modale
    secondCloseModalBtn.addEventListener('click', function () {
        secondModalContainer.style.display = 'none';
    });

    // Gérer la soumission du formulaire de la deuxième modale
    secondSubmitPhotoBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)

        const photoFile = document.getElementById('photoFile').files[0];
        const photoTitle = document.getElementById('photoTitle').value;
        const photoCategory = document.getElementById('photoCategory').value;

        if (photoFile && photoTitle && photoCategory) {
            const newImage = {
                src: URL.createObjectURL(photoFile),
                alt: photoTitle,
                caption: photoTitle, // Utiliser le titre comme légende par défaut
                category: photoCategory
            };
            images.push(newImage);

            // Sauvegarder les images dans le localStorage
            saveImagesToLocalStorage();

            // Fermer la deuxième modale
            secondModalContainer.style.display = 'none';

            // Mettre à jour la galerie principale avec le filtre actuel
            updateGallery(photoCategory);
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });

    // Fonction pour sauvegarder les images dans le localStorage
    function saveImagesToLocalStorage() {
        localStorage.setItem('images', JSON.stringify(images));
    }

    // Charger les images depuis le localStorage au chargement de la page
    function loadImagesFromLocalStorage() {
        const storedImages = localStorage.getItem('images');
        if (storedImages) {
            images = JSON.parse(storedImages);
            updateGallery('tous'); // Mettre à jour la galerie après chargement depuis le localStorage
        }
    }

    // Initialiser la galerie avec toutes les images au chargement de la page
    updateGallery('tous');
});