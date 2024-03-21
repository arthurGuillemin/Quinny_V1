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

//Récuperer les donnes du quiz avec son id 
async function getQuizData(quizId) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/quizData?quizId=${quizId}`);
        const data = await response.json();
        const decodedData = JSON.parse(decodeURIComponent(data[0].partage));
        console.log("Données du quiz:", decodedData);
        return decodedData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données du quiz:', error);
    }
}

// creer le quiz avec les donnees
window.onload = async function() {
    const quizId = getParameterByName('id');
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

  /** */

  