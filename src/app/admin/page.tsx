import { Metadata } from "next";
import UrlGuard from "@/lib/UrlGuard";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function AdminDashboard() {
  return (
    <UrlGuard permission="add_logentry">
      <DashboardContent />
    </UrlGuard>
  );
}
