document.addEventListener("DOMContentLoaded", async function () {
    const classesList = document.getElementById("classesList");

    try {
        const response = await fetch('http://localhost:3000/api/v1/displayClasses');
        console.log("Réponse du serveur:", response);

        const data = await response.json();
        console.log("Données récupérées depuis le serveur:", data);

        data.reverse();

        data.forEach(classe => {
            console.log("ID de la classe:", classe.id_classe); 
            const listItem = document.createElement('li');
            listItem.textContent = `Nom de la classe: ${classe.nom_classe}`;

            classesList.appendChild(listItem);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des classes:" +  error);
    }
});
