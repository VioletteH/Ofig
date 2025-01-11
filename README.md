# O'Fig

Matériel donné : une BDD create_db.sql et une integration statique

Ce qui a été réalisé sur ce projet :

## Mise en place du projet

- créer l'architecture du projet avec Express et EJS
- utiliser le module dotenv et un fichier .env
- créer des partials pour le header, le footer et le menu de gauche

## Base de données

- créer un utilisateur et une BDD dans PostgresSQL et importer les données fournies
- créer un fichier database et datamapper pour récuperer les figurines, les avis et les catégories avec utilisation des jointures

## Dynamisation

- créer des fonctions de controller pour envoyer les données du data mapper aux vues
- utiliser try / catch pour la gestion d'erreur
- dynamiser les différentes vues avec EJS

## Session

- mettre en place un mécanisme de session
- permettre à l'utilisateur d'ajouter ou de supprimer des figurines en favoris en fonction de sa session

## Catégories

- créer un middleware en fonction des routes pour afficher le menu de gauche
- filtrer les figurines en fonction de leur catégories

## Reviews

- afficher une pop up avec les reviews en fonction des figurines
- calculer et afficher la note moyenne des reviews pour chaque figurine

## Moteur de recherche

- créer un moteur de recherche interne dans le menu
- créer la route et les fonctions dans le data mapper et le controller