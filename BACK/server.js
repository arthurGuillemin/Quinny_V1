import express from "express";
import cors from "cors";
import { recupEleve , getQuizIdByName, createQuiz, getClasseId , addComp, enregistrerQuestions ,displayQuizs ,getQuizData , createCompo, displayParticipants, getParticipantsNames, getStudentReponse ,recupEleve2, getStudentComportement} from "./model/supabase.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Route pour ajouter un comportement d'un eleve
app.post('/api/v1/add', async (req, res) => {
    try {
        const { Nom, Prenom, mousleave, new_tab , new_tab_time , score , id_eleve , id_exam , } = req.body;

        await addComp({ Nom, Prenom, mousleave, new_tab , new_tab_time, score, id_eleve,id_exam   });

    } catch (error) {
        console.error('Erreur lors de l\'insertion du comportement:', error);
    }
});

// Route pour afficher tous les quizs disponibles
app.get('/api/v1/displayQuizs', async (req, res) => {
    try {
        const { data, error } = await displayQuizs();
        res.json(data); 
    } catch (error) {
        console.error("Erreur lors de la récupération des quizs:", error);
    }
});
app.get('/api/v1/displayClasses', async (req, res) => {
    try {
        const { data, error } = await displayClasses();
        if (error) {
            throw new Error(error); // Si une erreur est survenue dans la récupération des données
        }
        res.json(data); // Envoi des données au client au format JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des classes' }); // Réponse avec un code d'erreur 500 en cas d'erreur interne du serveur
    }
});

// Route pour afficher tous les quizs disponibles
app.get('/api/V1/displayParticipants', async (req, res) => {
    try {
        const quizId = req.query.quizId; 
        const data = await displayParticipants(quizId);
        res.json({ data }); 
    } catch (error) {
        console.error("Erreur :", error);
    }
});


// Route pour recuperer l'ID d'un eleve par son nom et prenom
app.get('/api/v1/idEleve', async (req, res) => {
    const { nom, prenom } = req.query;

    try {
        const { data, error } = await recupEleve(nom, prenom);
 
        res.json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'Id de l'élève:", error);
    }
});

// Route pour recuperer les donnees d'un eleve par son prenom
app.get('/api/v1/idEleve2', async (req, res) => {
    const {prenom } = req.query;

    try {
        const { data, error } = await recupEleve2(prenom);
        
        res.json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'élève:", error);
    }
});

// Route pour recuperer l'ID de la classe par le nom et prenom d'un eleve
app.get('/api/v1/idClasse', async (req, res) => {
    const { nom, prenom } = req.query;
    try {
        const { data, error } = await getClasseId(nom, prenom);
        
        res.json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération de la promo:", error);
    }
});

// Route pour recuperer l'ID d'un quiz par son nom
app.get('/api/v1/quizId', async (req, res) => {
    const { quizName } = req.query;

    try {
        const { data, error } = await getQuizIdByName(quizName);
        res.json(data);
    } catch (error) {
        console.error("Erreur  lors de la récupération de l'ID du quizz:", error);
    }
});

// Route pour recuperer le comportement d'un eleve pour un quiz donne
app.get('/api/v1/getComportement', async (req, res) => {
    const { id_eleve , quizId } = req.query;

    try {
        const { data, error } = await getStudentComportement(id_eleve , quizId);
        res.json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération du comportement", error);
    }
});

// Route pour recuperer les donnees d'un quiz par son ID
app.get('/api/v1/quizData', async (req, res) => {
    const { quizId} = req.query;
    try {
        const { data, error } = await getQuizData(quizId);
        res.json(data);
    } catch (error) {
        console.error("Erreur non gérée lors de la récupération des donnes du quizz", error);
    }
});

// Route pour recuperer les reponses d'un eleve pour un quiz donne
app.get('/api/v1/studentReponse', async (req, res) => {
    const { id_eleve ,quizId} = req.query;

    try {
        const { data, error } = await getStudentReponse(id_eleve , quizId);
        res.json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'Id du quizz:", error);
    }
});

// Route pour creer un nouveau quiz
app.post('/api/v1/createQuiz', async (req, res) => {
    try {
        const { quizName, quizData } = req.body;
        const result = await createQuiz(quizName, quizData);

        res.json(result.data);
    } catch (error) {
        console.error("Erreur lors de la création du quiz:", error);
    }
});

// Route pour creer une composition d'un eleve
app.post('/api/v1/createCompo', async (req, res) => {
    try {
        const { quizData, id_eleve, id_classe  , quizId} = req.body; 
        const result = await createCompo(quizData, id_eleve, id_classe , quizId); 
        res.json(result.data);
    } catch (error) {
        console.error("Erreur lors de la création de la compo:", error);
    }
});

// Route pour afficher les noms des participants d'un quiz
app.get('/api/V1/displayParticipantsWithNames', async (req, res) => {
    try {
        const quizId = req.query.quizId;
        const participantsData = await displayParticipants(quizId);
        const participantIds = participantsData.map(participant => participant.id_eleve);
        const participantsNames = await getParticipantsNames(participantIds);
        
        res.json({ data: participantsNames });
    } catch (error) {
        console.error("Erreur :", error);
    }
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
