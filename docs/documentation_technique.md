# Documentation Technique - Application Mawen

## 1. Vue d'ensemble

Ce projet est une application web développée avec Flask, conçue pour gérer et afficher plusieurs "marketplaces" comme un menu de restaurant, une liste de boissons et une boutique. Elle dispose d'une interface d'administration pour la gestion de contenu et d'une interface publique pour les utilisateurs.

L'application est conçue pour être robuste, sécurisée et facilement déployable grâce à Docker.

## 2. Architecture

L'application suit une architecture modulaire et découplée :

*   **Framework Backend** : **Flask** est utilisé comme framework principal, avec une structure basée sur les **Blueprints** pour séparer les différentes sections logiques de l'application (`admin`, `menu`, `shop`, `contact`).
*   **Interface Frontend** : Le frontend est dynamique et moderne, construit avec des **Web Components** standards (probablement via la bibliothèque Lit), permettant une interface utilisateur modulaire et réutilisable.
*   **Couche de Données** : Une couche de service (`DataService`) abstrait la logique de persistance des données.
*   **Stockage** : L'application est flexible et peut utiliser deux types de backends de stockage :
    *   **Minio** : Un stockage objet compatible S3, idéal pour le développement et les déploiements auto-hébergés.
    *   **Google Drive** : Pour une intégration avec l'écosystème Google.
    Le choix du backend se fait via une variable d'environnement.
*   **Mise en cache** : **Redis** est utilisé pour la mise en cache des données, réduisant la latence et le nombre d'accès au stockage principal.
*   **Conteneurisation** : L'ensemble de l'application et de ses services (Redis, Minio) est conteneurisé avec **Docker** et orchestré via `docker-compose.yml`.

## 3. Technologies et Dépendances

*   **Backend** : Python 3, Flask, Gunicorn
*   **Frontend** : HTML5, CSS3, JavaScript (Web Components)
*   **Stockage** : Minio, Google Drive API
*   **Cache** : Redis
*   **Sécurité** : Flask-Talisman (headers de sécurité), Flask-WTF (protection CSRF), Flask-Limiter (limitation de débit)
*   **Déploiement** : Docker, Docker Compose

## 4. Structure du Projet

```
.
├── app/
│   ├── __init__.py         # Factory de l'application Flask, enregistrement des blueprints
│   ├── config.py           # Classes de configuration (Prod, Dev)
│   ├── admin/              # Blueprint pour l'administration (CRUD, auth)
│   ├── menu/               # Blueprint pour la page "Menu"
│   ├── shop/               # Blueprint pour la page "Boutique"
│   ├── services/
│   │   └── data_service.py # Service central pour l'accès aux données
│   ├── storage/
│   │   ├── base.py         # Classe de base pour les backends de stockage
│   │   ├── minio_store.py  # Implémentation pour Minio
│   │   └── google_drive.py # Implémentation pour Google Drive
│   ├── static/             # Fichiers statiques (CSS, JS, images)
│   │   └── js/components/  # Composants Web Components
│   └── templates/          # Templates Jinja2
├── docker-compose.yml      # Orchestration des conteneurs (app, redis, minio)
├── Dockerfile              # Définition de l'image Docker pour l'application
├── requirements.txt        # Dépendances Python
└── run.py                  # Point d'entrée pour le développement local
```

## 5. Installation et Démarrage

### Prérequis

*   Docker
*   Docker Compose

### Démarrage avec Docker (Recommandé)

1.  **Créer le fichier d'environnement** :
    Copiez `.env.example` vers un nouveau fichier nommé `.env` et ajustez les variables si nécessaire. Pour un démarrage rapide, les valeurs par défaut sont suffisantes.
    ```bash
    cp .env.example .env
    ```

2.  **Construire et démarrer les conteneurs** :
    Cette commande va construire l'image de l'application et démarrer les services `web`, `redis` et `minio`.
    ```bash
    docker-compose up --build
    ```

3.  **Accès à l'application** :
    *   Application : [http://localhost:8000](http://localhost:8000)
    *   Interface d'administration : [http://localhost:8000/admin](http://localhost:8000/admin)
    *   Console Minio : [http://localhost:9001](http://localhost:9001) (identifiants par défaut : `minioadmin`/`minioadmin`)

### Développement Local (Sans Docker)

1.  **Créer un environnement virtuel** :
    ```bash
    python -m venv venv
    source venv/bin/activate  # Sur Windows: venv\Scripts\activate
    ```

2.  **Installer les dépendances** :
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configurer l'environnement** :
    Créez un fichier `.env` comme décrit dans la section Docker. Assurez-vous d'avoir des instances de Redis et Minio accessibles localement et de configurer les variables d'environnement correspondantes.

4.  **Lancer l'application** :
    ```bash
    python run.py
    ```
    L'application sera accessible sur [http://localhost:5000](http://localhost:5000).

## 6. Configuration

L'application est configurée via des variables d'environnement définies dans le fichier `.env`.

| Variable | Description | Défaut |
| --- | --- | --- |
| `SECRET_KEY` | Clé secrète pour la sécurité des sessions Flask. | `change-me` |
| `STORAGE_BACKEND` | Backend de stockage à utiliser (`minio` ou `gdrive`). | `minio` |
| `MINIO_ENDPOINT` | Endpoint du serveur Minio. | `minio:9000` |
| `MINIO_ACCESS_KEY` | Clé d'accès Minio. | `minioadmin` |
| `MINIO_SECRET_KEY` | Clé secrète Minio. | `minioadmin` |
| `MINIO_BUCKET` | Nom du bucket à utiliser. | `mawenhouse` |
| `REDIS_URL` | URL de connexion au serveur Redis. | `redis://redis:6379/0` |
| `ADMIN_EMAIL` | Email de l'administrateur. | `admin@example.com` |
| `ADMIN_PASSWORD` | Mot de passe de l'administrateur. | `admin123` |

## 7. Modules de l'Application

### `admin`
*   **Fonctionnalité** : Fournit une interface web et une API RESTful pour gérer le contenu des marketplaces.
*   **Routes principales** :
    *   `/admin/` : Tableau de bord principal.
    *   `/admin/login` : Page de connexion.
    *   `/admin/<marketplace>` : Interface de gestion pour une marketplace spécifique.
*   **API CRUD** :
    *   `GET /admin/<marketplace>/items` : Lister les articles.
    *   `POST /admin/<marketplace>/items` : Ajouter un article.
    *   `PUT /admin/<marketplace>/items/<id>` : Mettre à jour un article.
    *   `DELETE /admin/<marketplace>/items/<id>` : Supprimer un article.

### `menu`, `shop`, `boisson`, `contact`
*   **Fonctionnalité** : Blueprints publics qui affichent le contenu géré via l'interface d'administration. Ils récupèrent leurs données via le `DataService`.
