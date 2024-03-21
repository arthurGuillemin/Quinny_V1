let prenom;
    let id_eleve;
    let scrore_fiabilite

    // extraire les paramètres d'une URL source : https://stackoverflow.com/questions/45790423/how-to-get-parameter-name
/**  au final c'est obsolete => utiliser 
 *     const urlParams = new URLSearchParams(window.location.search);
    quizId = urlParams.get('id_quiz');
*/
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Fonction pour récupérer les données d'un quiz avec son ID
    async function getQuizData(quizId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/quizData?quizId=${quizId}`);
            const data = await response.json();
            const decodedData = JSON.parse(decodeURIComponent(data[0].partage));
            return decodedData;
        } catch (error) {
            console.error('Erreur lors de la récupération des données du quiz:', error);
        }
    }

    // Fonction pour récupérer l'ID d'un élève à partir de son prénom
    async function getStudentId2(prenom) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/idEleve2?prenom=${prenom}`);
            const data = await response.json();
            const id_eleve = data[0].id_eleve; 
            if (id_eleve) {
                return id_eleve
            } 
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID de l'élève:", error);
        }
    }

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


document.addEventListener('DOMContentLoaded', async function () {
    const prenom = getParameterByName('Prenom');
    const id_eleve = await getStudentId2(prenom); 
    const quizId = getParameterByName('quizId');
    getStudentComp(id_eleve , quizId)
    const studentResponses = await getStudentReponse(id_eleve, quizId); 
    try {
        studentResponses.reponses.forEach((reponse, index) => {
            const textarea = document.querySelector(`textarea[name="reponse${index + 1}"]`);
            if (textarea) {
                textarea.value = reponse; 
            }
        });
        } catch (error) {
    console.error("Erreur lors du traitement des réponses de l'élève:", error);
}
} 
);

    // creer le quiz avec les donnees
    window.onload = async function() {
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('quizId');
        const quizData = await getQuizData(quizId);
        
        const { quizName, questions } = quizData;
        const quizContainer = document.getElementById('quizQuestions');
    
        const quizNameElement = document.getElementById('quizName');
        quizNameElement.textContent = quizName;
        quizContainer.insertBefore(quizNameElement, quizContainer.firstChild);

        questions.forEach((question, index) => {
            const questionElement = document.createElement('section');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <div class="enonce">
                    <p class="intitule" id="question${index + 1}">Question ${index + 1}: ${question}</p>
                </div>
                <div id="reponse">
                    <textarea rows="3" name="reponse${index + 1}" id="reponse"></textarea>
                </div>
            `;
            quizContainer.appendChild(questionElement);
            const textarea = document.getElementById(`reponse`);
            preapreAutogrowing(textarea);
        });
    };


// Pour que le textarea des reponses s'adapte a la taille du texte
        function preapreAutogrowing(element) {
            var style = element.style;
            function onAction() {
                style.height = 'auto';
                style.height = element.scrollHeight + 'px';  
            }
            element.addEventListener('input', onAction);
            element.addEventListener('change', onAction);
            var destroyed = false;
            return {
                update: onAction,
                destroy: function() {
                    if (destroyed) {
                        return;
                    }
                    destroyed = true;
                    element.removeEventListener('input', onAction);
                    element.removeEventListener('change', onAction);
                }
            };
        }
        
        
        var element = document.querySelector('#my-element');
        var autogrowing = preapreAutogrowing(element);

        element.value = '';
        
        autogrowing.update();  


// Fonction pour récupérer le comportement d'un elve
async function getStudentComp(id_eleve, quizId) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/getComportement?id_eleve=${id_eleve}&quizId=${quizId}`);
        if (!response.ok) {
            console.error('la requete na pas abouti')
        }
        const data = await response.json();
        console.log(data);
        // je sais ça pique les yeux
        const nomEleve = data[0].Nom;
        const prenomEleve = data[0].Prenom;
        const newTabs = data[0].new_tab;
        const newTabsTime = data[0].new_tab_time;
        const mousleaves = data[0].mousleave;
        score = data[0].score;
        const comportementElement = document.getElementById('comportement');
        const NomLocation = document.getElementById('Nom')
        NomLocation.innerHTML= `Nom de l'eleve : ${nomEleve} ${prenomEleve}` ;
        const TabsLocation = document.getElementById('newTabs')
        TabsLocation.innerHTML=`Nombre de nouveaux onglets ouverts pendant le quiz  : ${newTabs}` ;
        const TimeLocation = document.getElementById('newTabsTime')
        TimeLocation.innerHTML=`Temps passé sur ces nouveaux onglets (en secondes): ${newTabsTime}` ;
        const MouseLeavesLocation = document.getElementById('mouseleave')
        MouseLeavesLocation.innerHTML=`Nombre de sorties de la souris de l'écran : ${mousleaves}`;
        const ScoreLocation = document.getElementById('score')
        ScoreLocation.innerHTML=`Score de fiabilité de l'eleve sur ce quiz :  ${score}`;
        //petit truc pour changer la couleur du score inspiration : https://alleyful.github.io/2019/06/01/algorithm/hackerrank/10Days_Day2_ConditionalStatements_IfElse/
        function getScoreColor(score) {
            if (score > 40) {
                return 'green';
            } else if (score >= 30) {
                return 'lightgreen'; 
            } else if (score >= 20) {
                return 'yellow'; 
            } else if (score >= 10) {
                return 'orange'; 
            } else {
                return 'red'; 
            }
        }
        const cheater = document.getElementById('cheater')
        const scoreColor = getScoreColor(score);
        ScoreLocation.style.color = scoreColor;
        // adapter la chouette aux tricheurs 
        let cheatingHowl = document.getElementById('chouetteTriche');
        if (score > 40) {
            cheatingHowl.src = './assets/alert0.png';
        } else if (score < 40 && score >= 30) {
            cheatingHowl.src = './assets/alerte1.png'; 
        } else if (score < 30 && score >= 20) {
            cheatingHowl.src = './assets/alerte2.png';
        } else if (score < 20 && score >= 10) {
            cheatingHowl.src = './assets/alerte3.png';
        } else if (score < 10) {
            cheatingHowl.src = './assets/alerte4.png';
        }
        else if (score == 0){
            cheater.style.innerHTML ='Tricheur'
        }
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération du comportement de l'leve:", error);
    }
}








