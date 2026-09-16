import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ItemActivityHistory } from "@/components/ItemActivityHistory";

export interface PageDetailProps {
  /**
   * Nom de l'élément affiché (ex: le nom du projet, le nom d'utilisateur).
   * Utilisé pour générer le titre "Détail de [itemName]".
   */
  itemName: string;
  /**
   * Fonction de retour (ex: `navigateBack()`)
   */
  onBack: () => void;
  /**
   * Contenu personnalisé pour la zone des actions (boutons en haut à droite)
   */
  actions?: ReactNode;
  /**
   * Contenu principal de la page de détail (informations)
   */
  children: ReactNode;
  /**
   * (Optionnel) Nom du modèle pour l'historique (ex: "project", "user", "role")
   */
  historyModelName?: string;
  /**
   * (Optionnel) ID de l'objet pour l'historique
   */
  historyObjectId?: string;
  /**
   * (Optionnel) Classes CSS additionnelles pour personnaliser le wrapper
   */
  className?: string;
}

export function PageDetail({
  itemName,
  onBack,
  actions,
  children,
  historyModelName,
  historyObjectId,
  className = "",
}: Readonly<PageDetailProps>) {
  const { t } = useTranslation();

  return (
    <div className={`m-8 flex flex-col gap-8 ${className}`}>
      {/* Header : Bouton retour et Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button variant="outline" className="btn-neutral" onClick={onBack} title={t("back", "Retour")}>
          <ArrowLeft className="h-4 w-4 shrink-0 sm:mr-2" />
          <span className="hidden sm:inline">{t("back", "Retour")}</span>
        </Button>
        {actions && <div>{actions}</div>}
      </div>

      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("detail_of", "Détail de")} {itemName}
        </h1>
      </div>

      {/* Contenu principal (Détails) */}
      <div className="flex flex-col gap-8">
        {children}
      </div>

      {/* Historique */}
      {historyModelName && historyObjectId && (
        <div className="shadow-lg p-4 rounded-lg bg-card">
          <ItemActivityHistory modelName={historyModelName} objectId={historyObjectId} />
        </div>
      )}
    </div>
  );
}
