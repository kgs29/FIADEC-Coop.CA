import { Metadata } from "next";
import RealisationsPage from "./realisations-page";

export const metadata: Metadata = {
  title: "Projets financés",
  description: "Les projets financés par FIADEC-COOP-CA",
};

export default function Page() {
  return <RealisationsPage />;
}
