# Cahier des charges - Portail FIADEC-COOP-CA

Document de référence décrivant le périmètre fonctionnel et technique du portail web FIADEC-COOP-CA, mis à jour à la suite du rebrand complet du site public (contenu, charte graphique, navigation).

- **Projet** : `fiadec-portail`
- **Dépôt** : `site-fiadec` (branche `main`)
- **Date de mise à jour de ce document** : 2026-09-16

---

## 1. Présentation générale

Le portail FIADEC-COOP-CA est une application web unique (Next.js / App Router) qui combine :

1. **Un site public ("vitrine")** sous `/web/*` : présentation de l'institution, de ses produits financiers, de ses projets financés, prise de contact et actualités.
2. **Un back-office d'administration** sous `/admin/*` : gestion des utilisateurs, rôles/permissions, projets, paiements, contacts, newsletter, appareils connectés, journaux (logs), configuration applicative.

FIADEC-COOP-CA (Financière d'Appui au Développement Économique et Communautaire) est une institution de microfinance agréée basée au Cameroun, proposant : comptes courants et d'épargne, dépôts à terme, crédits personnels, financement PME et crédits agri-équipement pour les coopératives.

## 2. Objectifs du rebrand

- Remplacer intégralement l'habillage visuel et le contenu du portail (précédemment un site vitrine de services informatiques) par l'identité et l'offre de FIADEC-COOP-CA, en s'appuyant sur les maquettes Stitch fournies et la charte graphique officielle (palette verte « Institutional Trust », typographies Montserrat/Inter).
- Restructurer la navigation autour des produits financiers (Comptes, Produits & Services, Projets financés) plutôt que des services informatiques.
- Supprimer les pages métier sans équivalent chez FIADEC (services IT détaillés, page Conseils) et adapter Carrières/Partenaires au contexte de la microfinance.
- Garantir que le projet compile, se lint et passe la suite de tests après ces changements.

## 3. Périmètre fonctionnel - Site public (`/web`)

| Route | Contenu | Statut |
| --- | --- | --- |
| `/web` | Accueil : hero institutionnel, chiffres clés, mission/vision, aperçu des produits, témoignages | Reconstruit |
| `/web/about` | À propos : présentation institutionnelle, mission/vision/valeurs | Reconstruit |
| `/web/accounts` | Comptes : types de comptes, éligibilité et pièces requises | **Nouveau** |
| `/web/services` | Produits & Services financiers : grille filtrable (comptes, épargne, crédits, PME, agricole) | Reconstruit |
| `/web/realisations` | Projets financés : portefeuille de projets financés, filtrable par secteur | Reconstruit |
| `/web/contact-us` | Formulaire de contact, coordonnées, carte, mini-FAQ | Reconstruit |
| `/web/faq` | FAQ complète (13 questions/réponses, 5 catégories : Général, Comptes, Crédits, Agences & Support, Sécurité) | Reconstruit |
| `/web/news` | Actualités et projets publiés | Réhabillé |
| `/web/careers` | Carrières : pourquoi nous rejoindre, processus de recrutement | Copy adaptée |
| `/web/partners` | Partenaires : catégories de partenariats | Copy adaptée |
| `/web/orders`, `/web/orders/[id]` | Historique et détail des commandes utilisateur | Inchangé (hérite du thème) |
| `/web/paiement` | Tunnel de paiement | Inchangé (hérite du thème) |
| `/web/login`, `/web/reset-password`, `/web/reset-password-confirm/[uid]/[token]` | Authentification et récupération de mot de passe | Inchangé (hérite du thème) |

Pages supprimées lors du rebrand (sans équivalent FIADEC) :

- Les 8 pages de services IT détaillés (développement web/mobile, intégration ERP, vidéosurveillance, réseaux informatiques, électricité domestique, design graphique, formation).
- La page « Conseils », orientée technologie, sans équivalent côté FIADEC.

## 4. Navigation - En-tête et pied de page

### En-tête (`src/components/custum/Header.tsx`)

Navigation en 6 entrées (desktop) : Accueil, Comptes, Produits & Services, Projets financés, Actualités, groupe « À propos » (À propos, FAQ, Carrières, Partenaires), Contact - plus un bouton « Espace Client », le sélecteur de langue FR/EN et le bascule clair/sombre.

### Pied de page (`src/components/custum/Footer.tsx`)

Colonnes : identité + coordonnées + réseaux sociaux, navigation (Comptes, Produits & Services, Projets financés, Actualités, Contact), Entreprise (À propos, FAQ, Carrières, Partenaires), newsletter (connectée à l'API `core/newsletter/subscribe/`).

## 5. Architecture technique

| Aspect | Détail |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript strict |
| Style | Tailwind CSS 3, shadcn/ui (Radix UI), thème clair/sombre via `next-themes` - variables CSS alignées sur la charte FIADEC (vert institutionnel) |
| Polices | Montserrat (titres) et Inter (corps de texte) |
| État & données | Redux Toolkit + RTK Query (`src/store/apis/{auth,core,payment}`) |
| i18n | `react-i18next`, dictionnaires `src/locale/fr.json` et `en.json` (langue par défaut : français) |
| Formulaires | `react-hook-form` + `zod` |
| Tests unitaires | Vitest + Testing Library |
| Tests E2E | Cypress |
| Qualité | ESLint (`next lint`), SonarQube (`sonar-project.properties`) |
| CI/CD | GitLab CI (`.gitlab-ci.yml`) : build, tests unitaires, tests E2E, analyse SonarQube, scan de sécurité Trivy + SBOM, déploiement QA |
| Conteneurisation | Docker (`Dockerfile`, `Dockerfile.ci`, `docker-compose.*.yml`) |

## 6. Points d'attention / backlog

- **Coordonnées de contact** : l'email et le téléphone par défaut dans `src/constants/env.ts` sont des valeurs de substitution (placeholders) - à remplacer par les coordonnées réelles de FIADEC-COOP-CA via les variables d'environnement `NEXT_PUBLIC_EMAIL_ADDRESS` / `NEXT_PUBLIC_PHONE`.
- **Logo** : l'asset actuellement utilisé (`src/assets/logo_fiadec.jpg`) provient d'une capture d'écran basse résolution ; une version vectorielle ou haute résolution à fond transparent améliorerait le rendu dans l'en-tête.
- **Identifiants d'infrastructure** (registre Docker, clé Sonar, namespace GitLab dans `.gitlab-ci.yml`, `Dockerfile.ci`, `docker-compose.*.yml`) : renommés par cohérence, mais doivent être alignés avec les ressources réelles (registre, groupe GitLab) côté infrastructure avant toute exécution de la CI/CD.
- **Back-office** : conserve sa structure fonctionnelle d'origine (gestion générique de projets/paiements/utilisateurs) ; seule l'identité visuelle (couleurs, logo) a été alignée sur FIADEC. Une adaptation métier plus poussée (ex. terminologie "comptes"/"crédits") pourra faire l'objet d'un chantier ultérieur.

## 7. Traductions

Toutes les sections du site public (`web_home`, `web_about`, `web_accounts`, `web_services`, `web_realisations`, `web_contact_extra`, `web_faq`, `web_careers`, `web_partners`, `web_chat`) sont disponibles en français (`src/locale/fr.json`) et en anglais (`src/locale/en.json`), conformément au fonctionnement bilingue existant du site (sélecteur de langue FR/EN dans l'en-tête).
