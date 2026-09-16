type BreadcrumbConfig = Record<string, string>;

export const breadcrumbConfig: BreadcrumbConfig = {
  "^/admin/references$": "Dashboard.sidebar.dataManagement",

  // USERS

  "^/admin/administration/users$": "users",
  "^/admin/administration/users/add$": "add_user",
  "^/admin/administration/users/[^/]+/edit$": "edit_user",
  "^/admin/administration/users/(?!add$|!formal-notice|[^/]+?/edit$)([^/]+?)(?:/)?$":
    "user_details",

  // GROUPES (rules)
  "^/admin/administration/rules$": "groupes",
  "^/admin/administration/rules/add$": "add_rule",
  "^/admin/administration/rules/[^/]+/edit$": "edit_rule",

  // ROLES
  "^/admin/administration/roles$": "roleList",
  "^/admin/administration/roles/add$": "add_role",
  "^/admin/administration/roles/[^/]+/edit$": "edit_role",

  // PROJETS
  "^/admin/projects$": "projectList",
  "^/admin/projects/add$": "add_project",
  "^/admin/projects/[^/]+/edit$": "edit_project",
  "^/admin/projects/(?!add$|categories$|[^/]+?/edit$)([^/]+?)(?:/)?$": "project_details",

  // CATEGORIES PROJET
  "^/admin/projects/categories$": "categoryList",
  "^/admin/projects/categories/add$": "add_category",
  "^/admin/projects/categories/[^/]+/edit$": "edit_category",

  // LOGS
  "^/admin/administration/logs$": "logsList",

  // Configuration & Base de données
  "^/admin/administration/configuration$": "appConfiguration",
  "^/admin/administration/database$": "databaseManagement",

  // Dashboard
  "^/admin$": "dashboard",
  "^/admin/profile$": "myProfil",

  // Paiements admin
  "^/admin/paiements$": "paymentList",
  "^/admin/paiements/[^/]+$": "paymentDetail",

  // Web public
  "^/web$": "custum.header.nav.home",
  "^/web/about$": "custum.header.nav.about",
  "^/web/projects$": "custum.header.nav.projects",
  "^/web/projects/[^/]+$": "project_details",
  "^/web/news$": "custum.header.nav.news",
  "^/web/contact-us$": "custum.header.nav.contact_us",
  "^/web/faq$": "custum.header.nav.faq",
  "^/web/careers$": "custum.header.nav.careers",
  "^/web/partners$": "custum.header.nav.partners",
  "^/web/paiement$": "paymentPage",

  // Publications
  "^/admin/administration/publications$": "publicationList",
  "^/admin/administration/publications/add$": "publicationAdd",
  "^/admin/administration/publications/[^/]+/edit$": "publicationEdit",
  "^/admin/administration/publications/[^/]+$": "publicationView",

  // Categories de publication
  "^/admin/administration/categories$": "categoriesList",
  "^/admin/administration/categories/[^/]+$": "publication_category",
  "^/admin/administration/categories/add$": "categoriesAdd",
  "^/admin/administration/categories/[^/]+/edit$": "categoriesEdit",

  // Notifications (page utilisateur)
  "^/admin/notifications$": "notificationList",

  // Notifications (administration)
  "^/admin/administration/notifications$": "administrationNotifications",

  // Newsletter
  "^/admin/administration/newsletter$": "newsletterList",

  // Messages reçus (contacts)
  "^/admin/administration/contacts$": "contactsList",

  // Appareils connectés
  "^/admin/administration/devices$": "devicesList",

  // Mappings groupes AD
  "^/admin/administration/ad-group-mappings$": "adGroupMappingList",
  "^/admin/administration/ad-group-mappings/add$": "add_ad_group_mapping",
  "^/admin/administration/ad-group-mappings/[^/]+/edit$": "edit_ad_group_mapping",
  "^/admin/administration/ad-group-mappings/(?!add$|[^/]+?/edit$)([^/]+?)(?:/)?$":
    "ad_group_mapping_details",

};
