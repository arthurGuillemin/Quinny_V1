let quizId;

/** affiche les participants a un quiz  */
document.addEventListener("DOMContentLoaded", async function () {
    const participantsList = document.getElementById("participantsList");
    const urlParams = new URLSearchParams(window.location.search);
    quizId = urlParams.get('id_quiz');
    try {
        const response = await fetch(`http://localhost:3000/api/V1/displayParticipantsWithNames?quizId=${quizId}`);
        const { data } = await response.json();
        console.log(data);
// si data vide ou pas de data 
        if ( data.length === 0 || !data) {
            participantsList.innerHTML = '<li>Aucun élève n\'a participé à ce quiz.</li>';
            return;
        }
// pour chaque participants (le fetch renvoie tout les nom des participants )
        data.forEach(participant => {
            const listItem = document.createElement('li');
            const participantName = `${participant.Prenom}`;
            const participantId = participant.id_eleve;
            console.log(participantId);

            listItem.textContent = `${participantName}`;

            const correctionButton = document.createElement('button');
            correctionButton.textContent = 'Corriger les réponses';
            correctionButton.addEventListener('click', function() {
                window.location.href = `compo.html?Prenom=${participant.Prenom}&quizId=${quizId}`;
            });
            listItem.appendChild(correctionButton);
            participantsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        participantsList.innerHTML = '<li>Une erreur est survenue lors de la récupération des participants.</li>';
    }
});
