import { Metadata } from "next";
import ServicesPage from "./services-page";

export const metadata: Metadata = {
  title: "Produits & Services",
  description: "Nos produits et services financiers",
};

export default function Page() {
  return <ServicesPage />;
}
