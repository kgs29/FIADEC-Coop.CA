export function transformImageUrl(originalUrl: string): string {
  if (!originalUrl) {
    throw new Error("Invalid URL: URL cannot be empty");
  }

  const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;

  // Si le domaine n'est pas configuré, on retourne l'URL d'origine telle quelle
  if (!imageDomain || imageDomain === "undefined") {
    return originalUrl;
  }

  // Si c'est une URL complète, on extrait le chemin pour le concaténer au domaine configuré
  const url = new URL(originalUrl); // throws if URL is invalid
  const cleanPath = url.pathname.replace(/^\//, "");
  return `${imageDomain}/${cleanPath}`;
}