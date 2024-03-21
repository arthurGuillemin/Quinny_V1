const quizIdLocation = document.getElementById('quizData')
const joinBtn = document.getElementById('join')


function joinQuiz() {
joinBtn.addEventListener('click', () => {
    const quizId= quizIdLocation.value;
    window.location.href = `quiz.html?id=${quizId}`;
})
}

joinQuiz();