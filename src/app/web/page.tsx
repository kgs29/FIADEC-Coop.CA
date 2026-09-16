import { Metadata } from "next";
import HomePage from "./home-page";

export const metadata: Metadata = {
  title: "Accueil",
  description: "Page d'accueil",
};

export default function Home() {
  return <HomePage />;
}
