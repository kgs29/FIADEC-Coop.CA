# Guide de contribution FIADEC-COOP-CA

Merci de votre intérêt pour le portail FIADEC-COOP-CA. Ce guide vous aidera à contribuer efficacement au développement de la plateforme.

## Comment contribuer

### 1. Préparation
- Forkez le dépôt sur GitLab 
- Clonez votre fork localement
- Créez une branche à partir de `develop` avec un nom descriptif :
  ```bash
  git checkout -b feature/nom-fonctionnalite
  ```

### 2. Développement
- Respectez les bonnes pratiques de développement Next.js et React
- Suivez les conventions de code du projet
- Rédigez du code clair, maintenable et bien documenté
- Ajoutez des tests unitaires pour vos modifications

### 3. Validation
- Exécutez tous les tests localement avant de soumettre
- Vérifiez que votre code passe l'analyse SonarQube
- Assurez-vous qu'il n'y a pas de régression

### 4. Soumission
- Committez vos changements avec des messages clairs et descriptifs
- Poussez votre branche vers votre fork
- Créez une merge request vers la branche `develop` du dépôt principal
- Remplissez le template de merge request avec toutes les informations nécessaires

##  Qualité du code

### Standards de qualité
- **SonarQube** : Toutes les contributions doivent passer l'analyse SonarQube sans erreurs bloquantes
- **Couverture de tests** : Maintenez ou améliorez la couverture de code existante
- **Revue de code** : Toute merge request doit être revue et approuvée par au moins un mainteneur

### Bonnes pratiques
- Corrigez les problèmes de qualité et de sécurité détectés par SonarQube
- Évitez la duplication de code
- Utilisez des noms de variables et fonctions explicites
- Limitez la complexité cyclomatique de vos fonctions

##  Structure des branches

- `main` : Branche de production (stable)
- `develop` : Branche principale de développement
- `feature/*` : Nouvelles fonctionnalités
- `bugfix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes en production
- `tech/*` : Pour les changement de technologie 
 

##  Code de conduite

### Principes
- **Respect** : Soyez respectueux envers tous les contributeurs
- **Collaboration** : Travaillez en équipe et partagez vos connaissances
- **Constructivité** : Fournissez des retours constructifs lors des revues de code
- **Transparence** : Signalez les bugs et problèmes via le système d'issues GitLab

### Engagement
En contribuant au portail FIADEC-COOP-CA, vous acceptez de respecter ces principes et de maintenir un environnement professionnel et bienveillant.
