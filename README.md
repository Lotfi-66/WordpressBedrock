# Projet WordPress Bedrock avec Sage

Ce projet utilise Bedrock comme structure de base pour WordPress et intègre le thème Sage pour une gestion moderne des ressources front-end.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants :

- [PHP](https://www.php.net/downloads) (>= 7.4)
- [Composer](https://getcomposer.org/download/)
- [Node.js](https://nodejs.org/en/download/) (inclut npm)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
- [WP-CLI](https://wp-cli.org/fr/) (optionnel mais recommandé)
- [Docker](https://www.docker.com/get-started) (pour un environnement de développement isolé, si nécessaire)

## Installation

### 1. Cloner le dépôt

Ouvrez votre terminal et clonez le dépôt :

```bash
git clone https://github.com/votre-utilisateur/votre-depot.git
cd votre-depot
```

### 2. Installer les dépendances PHP

Installez les dépendances avec Composer :

```bash
composer install
```

### 3. Configurer l'environnement

Copiez le fichier d'exemple d'environnement et modifiez-le pour votre configuration :

```bash
cp .env.example .env
```

Ouvrez le fichier `.env` dans un éditeur de texte et remplissez les informations suivantes :

```env
DB_NAME='nom_de_la_base_de_données'
DB_USER='utilisateur_de_la_base_de_données'
DB_PASSWORD='mot_de_passe_de_la_base_de_données'
DB_HOST='localhost' # ou l'adresse de votre serveur de base de données
```

### 4. Installer les dépendances Node.js

Installez les dépendances front-end avec npm ou yarn. Choisissez l'un des deux :

```bash
npm install
```

ou

```bash
yarn install
```

### 5. Générer les clés de sécurité

Utilisez WP-CLI pour générer des clés de sécurité dans le fichier `.env` :

```bash
wp dotenv salts generate --path=web/wp
```

### 6. Initialiser la base de données

Si vous utilisez WP-CLI, vous pouvez créer la base de données et installer WordPress avec :

```bash
wp db create
wp core install --url='http://localhost' --title='Titre du Site' --admin_user='admin' --admin_password='motdepasse' --admin_email='email@exemple.com'
```

### 7. Lancer le serveur

Pour démarrer le projet, utilisez la commande suivante :

```bash
make start
```

Accédez ensuite à l'application à l'adresse `http://localhost:8000` (ou une autre URL définie dans votre configuration).

## Développement

Pour le développement, utilisez les commandes suivantes pour construire vos fichiers CSS et JavaScript :

```bash
npm run dev
```

ou pour un suivi des modifications :

```bash
npm run watch
```

## Déploiement

Pour déployer le projet, configurez votre environnement de production et assurez-vous que le fichier `.env` contient les bonnes informations. Exécutez les commandes suivantes pour installer les dépendances et construire le projet :

```bash
composer install --no-dev
npm run build
```

## Contribuer

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité ou correction de bug (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos modifications (`git commit -m 'Ajout d\'une fonctionnalité'`).
4. Poussez vers votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

## License

Ce projet est sous la [MIT License](LICENSE).

---

**Note** : Assurez-vous de remplir les sections avec vos informations spécifiques, notamment les URL et les identifiants de base de données.
