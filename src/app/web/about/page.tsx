import { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "À propos",
  description: "Qui est FIADEC-COOP-CA",
};

export default function Page() {
  return <AboutPage />;
}
