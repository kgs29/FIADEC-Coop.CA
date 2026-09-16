import { Metadata } from "next";
import FaqPage from "./faq-page";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur FIADEC-COOP-CA",
};

export default function Page() {
  return <FaqPage />;
}
