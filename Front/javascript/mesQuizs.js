/** Afficher les diffrents quizs */
document.addEventListener("DOMContentLoaded", async function () {
    const quizList = document.getElementById("quizList");

    try {
        const response = await fetch('http://localhost:3000/api/v1/displayQuizs');//l'url devrait s'appeler getQuizs plutot que display
        console.log("Réponse du serveur:", response);

        const data = await response.json();
        console.log("Données récupérées depuis le serveur:", data);

        /** inverse l'ordre de la repondse pour avoir les quizs les plus récents en premiers */
        data.reverse();

        data.forEach(quiz => {
            console.log("ID du quiz:", quiz.id_exam); 
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${quiz.id_exam}, Nom: ${quiz.nom}`;

            const correctionButton = document.createElement('button');
            correctionButton.textContent = 'Corriger';

            correctionButton.addEventListener('click', ()=>{
                window.location.href = `participants.html?id_quiz=${quiz.id_exam}`;
                console.log('Correction du quiz:', quiz.id_exam);
            });

            listItem.appendChild(correctionButton);
            quizList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des quizs:', error);
    }
});

