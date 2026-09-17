"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useLogoutMutation } from "@/store/apis/auth/authentication.api";
import i18n from "@/locale/i18n";
import { t } from "i18next";
import { Check, ChevronDown, Globe, Loader2, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo_fiadec.jpg";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type SimpleLink = { href: string; label: string; isActive: boolean };
type NavEntry =
  | { type: "link"; href: string; label: string; isActive: boolean }
  | { type: "group"; label: string; isActive: boolean; items: SimpleLink[] };

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language ?? "fr");
  const pathname: string = usePathname();

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  const aboutLinks: SimpleLink[] = [
    { href: "/web/about", label: t("custum.header.nav.about"), isActive: pathname === "/web/about" },
    { href: "/web/faq", label: t("custum.header.nav.faq"), isActive: pathname === "/web/faq" },
    { href: "/web/careers", label: t("custum.header.nav.careers"), isActive: pathname === "/web/careers" },
    { href: "/web/partners", label: t("custum.header.nav.partners"), isActive: pathname === "/web/partners" },
  ];

  const navEntries: NavEntry[] = [
    { type: "link", href: "/web", label: t("custum.header.nav.home"), isActive: pathname === "/web" },
    {
      type: "link",
      href: "/web/accounts",
      label: t("custum.header.nav.accounts"),
      isActive: pathname === "/web/accounts",
    },
    {
      type: "link",
      href: "/web/services",
      label: t("custum.header.nav.services"),
      isActive: pathname === "/web/services",
    },
    {
      type: "group",
      label: t("custum.header.nav.company"),
      isActive: aboutLinks.some((item) => item.isActive),
      items: aboutLinks,
    },
    {
      type: "link",
      href: "/web/contact-us",
      label: t("custum.header.nav.contact_us"),
      isActive: pathname === "/web/contact-us",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 border-b border-border shadow-sm">
      <div className="px-4 md:px-8 lg:px-16 xl:px-20 mx-auto w-full">
        <div className="flex items-center justify-between py-2">
          <Link href="/web" className="flex items-center gap-3 shrink-0">
            <Image
              src={logo}
              alt="FIADEC-COOP-CA"
              width={48}
              height={48}
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full hover:opacity-90 transition-opacity"
              priority
            />
            <span className="font-poppins font-bold text-lg md:text-xl text-primary hidden sm:block tracking-tight">
              FIADEC
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navEntries.map((entry) =>
              entry.type === "link" ? (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={`${
                    entry.isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 pointer-events-none"
                      : "hover:text-primary text-foreground hover:bg-primary/10"
                  } px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200`}
                >
                  {entry.label}
                </Link>
              ) : (
                <DropdownMenu key={entry.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-1 px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                        entry.isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                          : "hover:text-primary text-foreground hover:bg-primary/10"
                      }`}
                    >
                      {entry.label}
                      <ChevronDown size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {entry.items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                        <Link href={item.href} className={item.isActive ? "text-primary font-semibold" : ""}>
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <LangSwitcher currentLang={currentLang} onChange={handleLangChange} />
            <ThemeToggle />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LangSwitcher currentLang={currentLang} onChange={handleLangChange} />
            <ThemeToggle />
            <button
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={t("menu")}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-border pb-4 pt-2 space-y-1 bg-card/95 backdrop-blur-xl rounded-b-2xl">
            {navEntries.map((entry) =>
              entry.type === "link" ? (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={`${
                    entry.isActive
                      ? "text-primary-foreground font-bold bg-primary shadow-md shadow-primary/30"
                      : "text-foreground hover:bg-muted"
                  } block py-2 px-4 mx-2 text-sm rounded-xl transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {entry.label}
                </Link>
              ) : (
                <div key={entry.label}>
                  <button
                    className={`w-full flex items-center justify-between py-2 px-4 mx-2 text-sm rounded-xl transition-colors ${
                      entry.isActive ? "text-primary font-bold bg-primary/10" : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setOpenMobileGroup(openMobileGroup === entry.label ? null : entry.label)}
                  >
                    {entry.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openMobileGroup === entry.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openMobileGroup === entry.label && (
                    <div className="ml-4 mt-1 space-y-1">
                      {entry.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`${
                            item.isActive ? "text-primary font-semibold" : "text-foreground/80 hover:bg-muted"
                          } block py-1.5 px-4 mx-2 text-sm rounded-lg transition-colors`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenMobileGroup(null);
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <LogoutModal isDialogOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </header>
  );
}

export function LangSwitcher({
  currentLang,
  onChange,
}: Readonly<{
  currentLang: string;
  onChange: (lang: string) => void;
}>) {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center hover:bg-muted text-foreground p-1 rounded-md cursor-pointer">
          <Globe className="h-7 w-7 p-1" />
          <p className="text-sm">{currentLang === "fr" ? "FR" : "EN"}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-20 p-2">
        <DropdownMenuRadioGroup value={currentLang} onValueChange={onChange}>
          <DropdownMenuRadioItem value="fr" className="cursor-pointer pl-2 pr-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇫🇷</span>
                <span className="text-sm">{t("User.lang.fr")}</span>
              </div>
              {currentLang === "fr" && <Check className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en" className="cursor-pointer pl-2 pr-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇬🇧</span>
                <span className="text-sm">{t("User.lang.en")}</span>
              </div>
              {currentLang === "en" && <Check className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const LogoutModal = ({
  isDialogOpen,
  onClose,
}: {
  isDialogOpen: boolean;
  onClose: () => void;
}) => {
  const [_logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const raw = localStorage.getItem("refresh");
      const refresh_token = raw ? JSON.parse(raw) : raw;
      if (refresh_token) {
        await _logout({ data: { refresh_token } }).unwrap();
      }
    } catch {
      // On continue même si l'appel API échoue
    } finally {
      localStorage.clear();
      globalThis.location.href = "/web/login";
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogTitle>{t("logout")}</DialogTitle>
        <DialogDescription>{t("logoutText")}</DialogDescription>
        <div className="flex justify-center gap-x-4">
          <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
          <Button onClick={handleLogout} variant="destructive">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("yes")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
