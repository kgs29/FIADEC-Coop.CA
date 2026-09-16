import { Metadata } from "next";
import PartnersPage from "./partners-page";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Nos partenaires technologiques, académiques et institutionnels",
};

export default function Page() {
  return <PartnersPage />;
}
