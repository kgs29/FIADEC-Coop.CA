# Frontend - Portail Next.js 15

Interface web construite avec Next.js 15 (App Router), React 19 et TypeScript.

---

## Stack technique


| Couche               | Technologie                       |
| ---------------------- | ----------------------------------- |
| Framework            | Next.js 15.2.4 + App Router       |
| UI                   | React 19 + TypeScript             |
| Styling              | Tailwind CSS + shadcn/ui          |
| State management     | Redux Toolkit + RTK Query         |
| Internationalisation | i18next + react-i18next (fr/en)   |
| Tests                | Vitest (unitaire) + Cypress (E2E) |
| Qualité             | SonarQube + ESLint                |
| Sécurité           | Trivy scan                        |
| CI/CD                | GitLab CI/CD                      |
| Déploiement         | Docker + Docker Compose           |

---

## Prérequis

- Node.js 18+
- npm
- Docker (pour le déploiement)

---

## Installation

```bash
npm install --legacy-peer-deps
```

### Variables d'environnement

```bash
cp .env.example .env.local
```


| Variable              | Description          | Exemple                     |
| ----------------------- | ---------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL` | URL de base de l'API | `http://localhost:8000/v1/` |
| `NEXT_PUBLIC_APP_URL` | URL du frontend      | `http://localhost:3000`     |

---

## Développement

```bash
npm run dev      # Démarre avec Turbopack sur http://localhost:3000
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
```

---

## Structure du projet

```text
frontend/
├── src/
│   ├── app/
│   │   ├── admin/              # Espace administration
│   │   │   ├── administration/ # Utilisateurs, rôles, groupes, logs, notifications
│   │   │   │   ├── users/
│   │   │   │   ├── roles/
│   │   │   │   ├── rules/
│   │   │   │   ├── ad-group-mappings/
│   │   │   │   ├── configuration/   # Configuration de l'application
│   │   │   │   └── database/        # Export / Import de la base de données
│   │   │   ├── articles/
│   │   │   ├── notifications/
│   │   │   └── paiements/
│   │   ├── editors/            # Espace éditeurs
│   │   └── web/                # Site public
│   ├── components/
│   │   ├── ui/                 # Composants shadcn/ui + LoadingButton
│   │   ├── dashboard/          # Sidebar, Header, UserMenu, BulkActionBar
│   │   └── ...
│   ├── data/
│   │   └── breakcrumbdatas.ts  # Configuration des breadcrumbs par route
│   ├── hooks/                  # Redux hooks, use-mobile, etc.
│   ├── lib/
│   │   ├── applyTheme.ts       # Injection CSS des variables de thème
│   │   └── UrlGuard.tsx        # Protection des routes par permission
│   ├── locale/                 # Fichiers de traduction (fr.json, en.json)
│   └── store/                  # Redux store + RTK Query API slices
├── public/
├── .env.example
├── dockerfile
└── docker-compose.yml
```

---

## Fonctionnalités principales

### Espace Admin (`/admin`)

- **Tableau de bord** : statistiques et accès rapides
- **Utilisateurs** : CRUD complet, gestion des permissions par groupe
- **Rôles** : création et attribution de groupes de permissions
- **Groupes Active Directory** : mappings groupes AD ↔ rôles internes
- **Articles & Catégories** : gestion éditoriale avec publication
- **Logs d'activité** : historique des actions
- **Notifications** : liste et marquage comme lu
- **Configuration de l'application** : paramètres globaux
- **Base de données** : export (dump SQL) et import/restauration

### Espace Éditeurs (`/editors`)

- Rédaction et gestion des articles propres à l'éditeur
- Consultation des notifications

### Site public (`/web`)

- Articles publiés, actualités, pages institutionnelles

---

## Responsive & UX

- **Sidebar** rétractable sur mobile (icônes seules)
- **Boutons** : texte masqué sur petit écran (`font-size: 0`), tooltip natif via `title`
- **Thème** : dark / light mode géré via CSS variables dans `applyTheme.ts`
- **Notification bell** : badge permanent (valeur 0 par défaut), navigation directe vers `/admin/notifications`
- **Breadcrumbs** : générés automatiquement via `breakcrumbdatas.ts`

---

## Export / Import de la base de données

La page `/admin/administration/database` permet :

- **Export** : téléchargement d'un dump SQL complet via `GET /v1/core/database/export/`
- **Import** : upload d'un fichier `.sql` avec confirmation avant restauration via `POST /v1/core/database/import/`

> Accessible uniquement aux utilisateurs avec la permission `add_logentry` (staff).

---

## Tests

```bash
# Tests unitaires (Vitest)
npm run test:unit
npm run test:unit -- --coverage

# Tests E2E (Cypress)
npm run dev                  # dans un premier terminal
npm run cypress:open         # mode interactif
npm run test:e2e             # mode CI
```

---

## Docker

```bash
# Build
docker compose -f docker-compose.prod.yml build

# Production
docker compose -f docker-compose.prod.yml up -d
```

L'application est accessible sur le port **3000** (ou le port mappé dans votre `docker-compose.yml`).

---

## Pipeline CI/CD (GitLab)


| Stage        | Description                                   |
| -------------- | ----------------------------------------------- |
| Build        | Construction de l'image Docker                |
| Unit Test    | Tests unitaires + couverture de code          |
| E2E Test     | Tests Cypress                                 |
| Code Quality | Analyse SonarQube (Quality Gate)              |
| Security     | Scan Trivy des vulnérabilités Docker        |
| Version      | Gestion automatique des versions et changelog |
| Registry     | Push des images vers le registre              |
| Deploy QA    | Déploiement automatique en environnement QA  |

---

## Stratégie de branches (Git Flow)


| Branche     | Rôle                                          |
| ------------- | ------------------------------------------------ |
| `main`      | Production - protégée, merge request requise |
| `preprod`   | Préproduction - validation avant production   |
| `develop`   | Intégration continue de toutes les features   |
| `feature/*` | Nouvelles fonctionnalités (depuis`develop`)   |
| `bugfix/*`  | Corrections non critiques (depuis`develop`)    |
| `hotfix/*`  | Corrections urgentes (depuis`main`)            |
| `tech/*`    | Tâches techniques / refactoring               |

---

## Support

Pour toute question ou problème, ouvrir une issue sur le dépôt GitLab du projet.
