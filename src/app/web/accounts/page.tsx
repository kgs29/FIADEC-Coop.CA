import { Metadata } from "next";
import AccountsPage from "./accounts-page";

export const metadata: Metadata = {
  title: "Comptes",
  description: "Les comptes proposés par FIADEC-COOP-CA",
};

export default function Page() {
  return <AccountsPage />;
}
