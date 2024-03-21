import express from 'express';
const router = express.Router();
import supabase from '../model/supabase.js'; // Importez l'instance Supabase

router.post('/api/v1/addClasse', async (req, res) => {
    try {
        // Récupérez les données envoyées dans le corps de la requête
        const { nomClasse, nomsEleves } = req.body;

        // Créez le schéma de la table pour la classe
        const { data: tableSchema, error: schemaError } = await supabase
            .rpc('create_table_type1', { t_name: nomClasse });

        // Vérifiez s'il y a une erreur lors de la création du schéma
        if (schemaError) {
            throw new Error("Erreur lors de la création du schéma de la table :", schemaError);
        }

        // Répondez avec un statut 200 et un message de succès
        res.status(200).json({ message: 'Classe ajoutée avec succès.' });
    } catch (error) {
        // En cas d'erreur, répondez avec un statut 500 et un message d'erreur
        console.error('Erreur lors de l\'ajout de la classe :', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout de la classe.' });
    }
});

export default router;
