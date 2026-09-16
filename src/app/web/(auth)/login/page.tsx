import { Metadata } from "next";
import LoginComponent from "./LoginComponent";

export const metadata: Metadata = {
  title: "Connexion - FIADEC-COOP-CA",
  description: "Page d'authentification pour la plateforme FIADEC-COOP-CA",
};
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white w-full p-10">
      <LoginComponent />
    </div>
  );
};

export default LoginPage;
