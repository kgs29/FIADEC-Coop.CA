"use client";
import ChatWidget from "@/components/custum/ChatWidget";
import Footer from "@/components/custum/Footer";
import Header from "@/components/custum/Header";
import ScrollDirectionButton from "@/components/custum/ScrollDirectionButton";
import { usePathname } from "next/navigation";
import { Inter, Montserrat } from "next/font/google";

// Police d'affichage FIADEC (Montserrat), exposée sous la même variable CSS
// --font-poppins pour que les classes utilitaires `font-poppins` déjà utilisées
// dans tout le site public rendent automatiquement en Montserrat.
const poppins = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.includes("/web/login") || pathname.includes("/web/reset-password");

  return (
    <div className={`${poppins.variable} ${inter.variable}`}>
      {!isAuthPage && <Header />}
      {children}
      {!isAuthPage && <Footer />}
      {!isAuthPage && <ScrollDirectionButton />}
      {!isAuthPage && <ChatWidget />}
    </div>
  );
}
