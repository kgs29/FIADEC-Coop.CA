import { breadcrumbConfig } from "@/data/breakcrumbdatas";

type Breadcrumb = {
  title: string;
  path: string;
};

export const generateBreadcrumbs = (location: string | null): Breadcrumb[] => {
  const breadcrumbs: Breadcrumb[] = [];

  // Vérifiez si breadcrumbConfig est défini
  if (!breadcrumbConfig || !location) {
    console.error("breadcrumbConfig is undefined or null");
    return breadcrumbs;
  }

  let currentPath = ""; // Chemin cumulatif pour les segments

  // Diviser l'URL en segments
  const locationSegments = location.split("/").filter((segment) => segment);

  // Parcourir les segments de l'URL
  locationSegments.forEach((segment) => {
    currentPath += `/${segment}`; // Concaténer le segment au chemin actuel
    // Vérifier si le chemin actuel correspond à un modèle dans breadcrumbConfig
    Object.entries(breadcrumbConfig).forEach(([pathPattern, title]) => {
      const pathRegex = new RegExp(
        `^${pathPattern.replace(/:\w+/g, "[^/]+")}$`
      ); // Convertir les paramètres dynamiques

      if (pathRegex.test(currentPath)) {
        // Si correspondance trouvée, ajouter le breadcrumb
        breadcrumbs.push({
          title: title,
          path: currentPath,
        });
      }
    });
  });

  // Si aucun breadcrumb n'est trouvé, journaliser un avertissement
  if (breadcrumbs.length === 0) {
    console.warn("No breadcrumbs matched the location:", location);
  }

  return breadcrumbs;
};
