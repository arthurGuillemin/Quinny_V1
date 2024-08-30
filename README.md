# **Projet Quinny**

## **Résumé**
**Quinny** est un projet co-réalisé avec ma collègue de formation [Kelly Gama](https://github.com/KellyGama).

La consigne qui nous a été donnée était de réaliser un moyen de tester les connaissances d'apprenants tout en assurant que la personne ne triche pas.

Nous avons donc eu l'idée de **Quinny** : une plateforme qui permet de créer ses propres quizz avec un nombre illimité de questions. Lorsque quelqu'un passe le quizz, l'application détecte et enregistre sur une base de données SQL (via **Supabase**) tous les comportements suspects, tels que :

- La souris sortant de l'écran
- La réalisation d'un **Ctrl + C** ou **Ctrl + V**
- Les clics droits
- Le temps passé sur un autre onglet
- L'ouverture des outils développeur
- L'ouverture d'un nouvel onglet

Tous ces comportements font baisser un score de fiabilité. Si celui-ci descend trop bas, le participant est immédiatement exclu du quizz.

Chaque créateur de quizz peut ensuite consulter les réponses des participants et afficher en détail tous les comportements suspects détectés.
