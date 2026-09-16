import { Metadata } from "next";
import CareersPage from "./careers-page";

export const metadata: Metadata = {
  title: "Carrières",
  description: "Rejoignez l'équipe FIADEC-COOP-CA",
};

export default function Page() {
  return <CareersPage />;
}
