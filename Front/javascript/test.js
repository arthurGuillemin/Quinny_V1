let quizName;
let identifierBtn = document.getElementById("identifier");
let id_eleve;
let scrore_fiabilite = 40; 
let sortie = 0;
let derniereSortie = null;
let total_time_outside_tab = 0; 
let nbrTab = 0 ;
let id_classe; 
let reponses = []; 
let submitButtonClicked = false;




setTimeout(function() {
    let quizNameLocation = document.getElementById('quizName');
    quizName = quizNameLocation.innerText.trim(); 
    getQuizID(); 
}, 500);



/** identification de l'eleve et du quiz */

// Fonction pour récupérer les réponses d'un elve
async function getStudentReponse(id_eleve, quizId) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/studentReponse?id_eleve=${id_eleve}&quizId=${quizId}`);
        const data = await response.json();
        const studentReponse = JSON.parse(decodeURIComponent(data[0].data))
        return studentReponse;
    } catch (error) {
        console.error("Erreur lors de la récupération des réponses de l'élève:", error);
    }
}

async function getStudentId(nom, prenom) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/idEleve?nom=${nom}&prenom=${prenom}`);
        const data = await response.json();
        id_eleve = data[0].id_eleve; 

    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
    }
}


async function getClasseId() {
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    try {
        const response = await fetch(`http://localhost:3000/api/v1/idClasse?nom=${nom}&prenom=${prenom}`);
        const data = await response.json();
        id_classe = data[0].id_classe; 
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
    }
}


async function getQuizID() {
    try {        
        const response = await fetch(`http://localhost:3000/api/v1/quizId?quizName=${quizName}`);       
        const data = await response.json();
        let quizId = data[0].id_exam;        
        console.log("ID du quiz:", quizId);        
        return quizId;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du quiz:', error);
    }
};


// quizz.js

// ...

// Cacher les questions tant que l'user n'est pas co (l'ideal serait de charger le quiz une fois qu'il est co la on peut clairement contourner ça avec inspecter l'element)


async function getStudentComp(id_eleve, quizId) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/getComportement?id_eleve=${id_eleve}&quizId=${quizId}`);
        if (!response.ok) {
            console.error('la requete na pas abouti')
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
// Événement au clic sur le bouton d'identification
identifierBtn.addEventListener("click", async () => {
    
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    await getStudentId(nom, prenom);
    await getClasseId();
    const quizId = await getQuizID();
    const studentReponse = await getStudentReponse(id_eleve, quizId);
    if (studentReponse) {
        submitButton.disabled = true;
        popupAlready();
        setTimeout(() => {
            window.location.href='index.html'
        }, 1500);
    } else {
        // Show questions
        document.querySelectorAll('.intitule').forEach(element => {
            element.style.display = 'block';
        });
        console.log("Les réponses de l'élève n'ont pas été trouvées.");
        // Autres actions à effectuer si nécessaire
    }
});


function popupAlready() {
    const popUpBackground = document.createElement('div');
    popUpBackground.classList.add('popup-background');
    const popUpDiv = document.createElement('div');
    popUpDiv.classList.add('popup');  
    popUpDiv.innerHTML = `
        <h2 id='already'>Vous avez déjà participé à ce quiz</h2>
    `;
    
    popUpBackground.appendChild(popUpDiv);
    document.body.appendChild(popUpBackground);
}

window.addEventListener('beforeunload', async function(e) {
    if (submitButtonClicked === false) {
    
    e.preventDefault(); 
    e.returnValue = ''; // For older browsers
    try {
        const quizId = await getQuizID(); 
        if (quizId) {
            enregistrerComportement(nomInput.value, prenomInput.value, sortie, nbrTab, total_time_outside_tab, scrore_fiabilite, id_eleve, quizId);
        } 
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du quiz dans afficherPop:', error);
    }

    try {
        const nom = nomInput.value.trim();
        const prenom = prenomInput.value.trim();
        await getStudentId(nom, prenom);
        console.log(id_eleve);
        await getClasseId();
        console.log(id_classe);
        const quizData = await creerCompo();
        const urlParams = new URLSearchParams(window.location.search);
        quizId = urlParams.get('id');
        await createCompo(quizData, id_eleve, id_classe, quizId);
    } catch (error) {
        console.error('Erreur lors de la création de la composition:', error);
    }
    const confirmationMessage = 'Êtes-vous sûr de vouloir quitter cette page ? Vos données non enregistrées seront perdues.';
    }
    
});





/** detection des comportements de triche */

document.addEventListener('mouseleave', e => {
        if (e.clientY <= 0) {
            console.log("La souris quitte la page");
            sortie++;
            console.log(`Nombre de sorties: ${sortie}`);
            scrore_fiabilite = scrore_fiabilite -2; 
            verifierFiabilite();
        }
    });

//restrictions
document.addEventListener('DOMContentLoaded', function() {
    // empecher la copie sur toute la page , on peut toujours le selectionner par contre
    document.addEventListener('copy', function(event) {
        event.preventDefault();
    });

    // desactiver le clic droit
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

    // desactiver le collage 
    document.addEventListener('paste', function(event) {
        event.preventDefault();
    });

    verifierFiabilite();
});
  /** detcter si il change de page le bg */
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            scrore_fiabilite = scrore_fiabilite -4
            nbrTab ++;
            verifierFiabilite();
            console.log('L\'utilisateur a changé d\'onglet ou minimisé la fenêtre.');
            derniereSortie = Date.now();
        } else {
            console.log('L\'utilisateur est revenu sur l\'onglet actif.');
            if (derniereSortie) {
                const dureeAbsence = Date.now() - derniereSortie;
                console.log(`L\'utilisateur était absent pendant ${dureeAbsence / 1000} secondes.`);
                total_time_outside_tab += dureeAbsence;
                console.log(`Le temps total passé hors de l'onglet est de ${total_time_outside_tab / 1000} secondes.`);
                derniereSortie = null;
            }
        }
    });


/** Section  enregistrement du comportement */

    const nomInput = document.getElementById("nom");
    const prenomInput = document.getElementById("prenom");
    const submitButton = document.getElementById("button");


    

    // fonction pour  enregistrer le comportement dans la db
    async function enregistrerComportement(nom, prenom, sortie, nbrTab, total_time_outside_tab , scrore_fiabilite , id_eleve , quizId) {
            const data = {
                Nom: nom,
                Prenom: prenom,
                mousleave: sortie,
                new_tab: nbrTab,
                new_tab_time: total_time_outside_tab / 1000,
                score  : scrore_fiabilite , 
                id_eleve : id_eleve ,
                id_exam : quizId
            };
    
            console.log("Data to be sent to server:", data); 
            const response = await fetch('http://localhost:3000/api/v1/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    }


    //je sais qu'il y est 2 fois mais si je l'enleve il n'arrive pas a envoyer l'id dansle comportement je regarderais si je peut corriiger ca aavnt de le rendre 
async function getStudentId() {
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    try {
        const response = await fetch(`http://localhost:3000/api/v1/idEleve?nom=${nom}&prenom=${prenom}`);
        const data = await response.json();
        id_eleve = data[0].id_eleve; 
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
    }
}

    
// popuptriche
async function afficherPop() {
    const popUpBackground = document.createElement('div');
    popUpBackground.classList.add('popup-background');
    const popUpDiv = document.createElement('div');
    popUpDiv.classList.add('popup');
    
    const tremblingImage = document.createElement('img');
    tremblingImage.src = './assets/alerte4.png'; 
    tremblingImage.classList.add('trembling-image');

    tremblingImage.classList.add('tremble-animation');

    popUpDiv.innerHTML = `
        <div class="popup-content">
            <h2>Tentative de Triche détectée</h2>
            <p>Vous ne pouvez plus effectuer d'actions sur cette page.</p>
            <div class="trembling-image-container">
                ${tremblingImage.outerHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(popUpBackground);
    document.body.appendChild(popUpDiv);

    try {
        const quizId = await getQuizID(); 
        if (quizId) {
            enregistrerComportement(nomInput.value, prenomInput.value, sortie, nbrTab, total_time_outside_tab, scrore_fiabilite, id_eleve, quizId);
        } 
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du quiz dans afficherPop:', error);
    }

    try {
        const nom = nomInput.value.trim();
        const prenom = prenomInput.value.trim();
        await getStudentId(nom, prenom);
        console.log(id_eleve);
        await getClasseId();
        console.log(id_classe);
        const quizData = await creerCompo();
        const urlParams = new URLSearchParams(window.location.search);
        quizId = urlParams.get('id');
        await createCompo(quizData, id_eleve, id_classe, quizId);
    } catch (error) {
        console.error('Erreur lors de la création de la composition:', error);
    }
    setTimeout(() => {
        window.location.href = `index.html`;
    }, 500);
}





//verifier le score  de fiabilite
function verifierFiabilite() {
    adapterChouette();
    if (scrore_fiabilite <= 0) {
        afficherPop();
    }
}

function adapterChouette() {
    let cheatingHowl = document.getElementById('chouetteTriche');
    if (scrore_fiabilite > 40) {
        cheatingHowl.src = './assets/alert0.png';
    } else if (scrore_fiabilite < 40 && scrore_fiabilite >= 30) {
        cheatingHowl.src = './assets/alerte1.png'; 
    } else if (scrore_fiabilite < 30 && scrore_fiabilite >= 20) {
        cheatingHowl.src = './assets/alerte2.png';
    } else if (scrore_fiabilite < 20 && scrore_fiabilite >= 10) {
        cheatingHowl.src = './assets/alerte3.png';
    } else if (scrore_fiabilite < 10) {
        cheatingHowl.src = './assets/alerte4.png';
    }
}


// save le comportement quand il lique sur submit

submitButton.addEventListener("click", async () => {
    submitButtonClicked = true;
    const nom = nomInput.value;
    const prenom = prenomInput.value;
    console.log(scrore_fiabilite);

    try {
        console.log("Data received in enregistrerComportement:", nom, prenom, sortie, nbrTab, total_time_outside_tab, scrore_fiabilite, id_eleve); 
        const quizId = await getQuizID();
        if (quizId) {
            await enregistrerComportement(nom, prenom, sortie, nbrTab, total_time_outside_tab, scrore_fiabilite, id_eleve, quizId);
            console.log('Comportement enregistré avec succès.');
        } 
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du comportement :', error);
    }
});


// section pour enrigtreser les reponses de l'eleve
async function creerCompo() {
    try {
        const reponses = []; 
        const reponsesV = document.querySelectorAll('textarea[name^="reponse"]');
        reponsesV.forEach(reponse => {
            if (reponse.value.trim() !== '') {
                reponses.push(reponse.value.trim());
            }
        });
        console.log(reponses);
        const quizData = encodeURIComponent(JSON.stringify({reponses }));
        console.log(" composition:", quizData);
        return quizData; 
    } catch (error) {
        console.error(error);
    }
}

async function createCompo(quizData, id_eleve, id_classe, quizId) { 
    try {
        quizData = await creerCompo();
        console.log(`quizData : ${quizData}`);

        const response = await fetch('http://localhost:3000/api/v1/createCompo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizData, id_eleve, id_classe, quizId }) 
        });
        console.log("Composition créée avec succès !:", quizData);
    } catch (error) {
        console.error(error);
    }
};

submitButton.addEventListener("click", async function () {
    try {
        const nom = nomInput.value.trim();
        const prenom = prenomInput.value.trim();
        await getStudentId(nom, prenom);
        console.log(id_eleve);
        await getClasseId();
        console.log(id_classe);
        const quizId = await getQuizID();
        const quizData = await creerCompo();
        await createCompo(quizData, id_eleve, id_classe, quizId);
    } catch (error) {
        console.error('Erreur lors de la création de la composition:', error);
    }
    setTimeout(() => {
        window.location.href = `index.html`;
    }, 500);
});
