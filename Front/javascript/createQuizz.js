let questions = [];
let addQuestionBtn =  document.querySelector("#addQuestion");
let createBtn = document.getElementById('create')
let validerBtn = document.getElementById('nameV')
let quizName; 
let quizData;

/** Recuperer l'id du quiz avec son nom */
async function getQuizID() {
    try {     
        const response = await fetch(`http://localhost:3000/api/v1/quizId?quizName=${quizName}`);       
        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }
        const data = await response.json();
        let quizId = data[0];     
        console.log("ID du quiz:", quizId);
        return quizId;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du quiz:', error);
    }
};


/** ajouter une question */
let questionCount = 0; 

function ajouterQuestion() {
    const container = document.getElementById('questionsContainer');
    questionCount++; 
    const questionInput = document.createElement('div');
    questionInput.innerHTML = `
        <section class="creatquestion">
            <div class="enonce">
                <p id="question${questionCount}">Question ${questionCount} :</p>
            </div>
            <div id="reponse">
                <textarea rows="3" name="question${questionCount}"></textarea>
            </div>
        </section>
    `;
    container.appendChild(questionInput);
}

addQuestionBtn.addEventListener("click", function (){
    ajouterQuestion();
});



/** creer le quiz  */
async function creerQuiz() {
    questions = []; 
    const form = document.getElementById('quizForm');
    const inputs = form.getElementsByTagName('textarea');
    const quizName = document.getElementById('quizName').value;

    // parcours des inputs questions et stockge des questions -> tableau
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() !== '') {
            questions.push(inputs[i].value.trim());
        }
    }
    let quizData = encodeURIComponent(JSON.stringify({ quizName, questions }));
    console.log(quizData);
    return quizData;
    
}
//creer le quiz sur la db
async function createQuiz(){
    try {
        quizData = await creerQuiz();
        const quizName = document.getElementById('quizName').value;
        console.log(`quizName ${quizName}`);
        console.log(`quizData : ${quizData}`);
        const response = await fetch('http://localhost:3000/api/v1/createQuiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizName , quizData })
        });
        if (!response.ok) {
            throw new Error('La requête n\'a pas abouti.');
        }
        console.log("Quiz créé avec succès:", quizName , quizData);      
    } catch (error) {
        console.error(error);
    }
};
/** creation du quiz et retour a l'acceuil  */
createBtn.addEventListener('click', async function(){
    quizData = await creerQuiz();
    createQuiz(quizData);
    setTimeout(() => {
        window.location.href = `index.html`;
    }, 500);
})