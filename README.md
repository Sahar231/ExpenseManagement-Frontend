# Expense Portal

Application web de gestion des frais professionnels destinée aux employés et aux managers.

## 1. Description du projet

L’objectif de cette application est de permettre à un employé de déclarer ses frais professionnels, puis de permettre à un manager de les valider ou de les rejeter.

Le flux principal est le suivant :

1. Un employé se connecte à l’application.
2. Il saisit une note de frais et la soumet.
3. La note passe en attente de validation.
4. Un manager consulte la demande et décide de l’approuver ou de la rejeter avec un commentaire si nécessaire.
5. L’employé peut suivre l’évolution du statut de sa note de frais à tout moment.

## 2. Fonctionnalités principales

### Pour l’employé
- Se connecter à l’application
- Créer une note de frais
- Modifier une note si elle est encore en brouillon ou rejetée
- Soumettre une note pour validation
- Consulter l’état de ses demandes

### Pour le manager
- Consulter les notes de frais soumises
- Approuver ou rejeter une demande
- Ajouter un commentaire en cas de rejet
- Suivre l’historique des décisions



## 3. Architecture du projet

Le projet suit une architecture simple en 3 couches :

- Frontend : Angular
- Backend : .NET Web API
- Base de données : SQL Server

Le frontend envoie des requêtes au backend, qui applique les règles métier et interagit avec la base de données via Entity Framework.

L’authentification repose sur des tokens JWT, envoyés à chaque requête pour identifier l’utilisateur connecté et son rôle.

## 4. Modèle de données principal

### Entités principales
- User : identifiant, nom, prénom, email, mot de passe, rôle (Employé / Manager)
- Mission : nom, manager associé, lieu, date de début, date de fin
- Expense : note de frais avec montant, date, catégorie, statut, commentaire
- Approval : historique des décisions d’approbation ou de rejet

### Règles métier importantes
- Une note de frais ne peut être modifiée que si elle est en Brouillon ou Rejetée.
- Une note en Soumis ou Approuvé est figée.
- Un employé ne voit que ses propres frais.
- Un manager ne voit que les frais des missions qu’il gère.
- Un commentaire est obligatoire en cas de rejet.

## 5. Statuts de la note de frais

Le cycle de vie d’une note de frais est le suivant :

- Brouillon
- Soumis
- Approuvé
- Rejeté

## 6. Technologies utilisées

- Angular 22
- TypeScript
- RxJS
- Bootstrap 5
- Bootstrap Icons
- Vitest / Angular testing setup

## 7. Prérequis

Avant de commencer, assurez-vous d’avoir installé :

- Node.js (version 20 ou supérieure recommandée)
- npm

## 8. Installation et exécution

### Installer les dépendances

```bash
npm install
```

### Lancer l’application en mode développement

```bash
npm start
```

Puis ouvrez votre navigateur à l’adresse suivante :

```text
http://localhost:4200/
```

### Construire l’application pour la production

```bash
npm run build
```

### Exécuter les tests

```bash
npm test
```

## 9. Structure du projet frontend

```text
src/
  app/
    core/           # services et gardes d’authentification
    pages/
      auth/         # login et signup
      dashbord/     # tableau de bord
      frais/        # liste et validation des frais
```

## 10. Routes principales

- /login : page de connexion
- /signup : page d’inscription
- /dashboard : tableau de bord principal
- /dashboard/frais/liste : liste des frais
- /dashboard/frais/validation : validation des frais

