"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useLogoutMutation } from "@/store/apis/auth/authentication.api";
import i18n from "@/locale/i18n";
import { t } from "i18next";
import { Check, ChevronDown, Globe, Loader2, Menu, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language ?? "fr");
  const pathname: string = usePathname();
  const isHomePage = pathname === "/web";
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

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
    <header
      className={`${
        isHomePage ? (isScrolled ? "fixed" : "absolute") : "sticky"
      } top-0 left-0 z-50 w-full border-b transition-all duration-300 ${
        isTransparent
          ? "border-transparent bg-transparent shadow-none"
          : "border-border bg-card/95 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/90"
      }`}
    >
      <div className="px-4 md:px-8 lg:px-16 xl:px-20 mx-auto w-full">
        <div className="flex items-center justify-between py-2">
          <Link href="/web" className="flex items-center gap-3 shrink-0">
            <Image
              src={logo}
              alt="FIADEC-COOP-CA"
              width={56}
              height={56}
              className="h-12 w-12 md:h-14 md:w-14 object-contain rounded-md hover:opacity-90 transition-opacity"
              priority
            />
            <span
              className={`font-poppins font-bold text-lg md:text-xl hidden sm:block tracking-tight ${
                isTransparent ? "text-white" : "text-primary"
              }`}
            >
              FIADEC-COOP CA
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
                      : isTransparent
                        ? "text-white hover:text-white hover:bg-white/15"
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
                          : isTransparent
                            ? "text-white hover:text-white hover:bg-white/15"
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
            <LangSwitcher currentLang={currentLang} onChange={handleLangChange} light={isTransparent} />
            <ThemeToggle />
            <Link
              href="/web/login"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                isTransparent
                  ? "bg-white text-primary hover:bg-white/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <UserRound size={15} />
              {t("custum.header.client_space")}
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LangSwitcher currentLang={currentLang} onChange={handleLangChange} light={isTransparent} />
            <ThemeToggle />
            <button
              className={`p-1.5 rounded-lg transition-colors ${
                isTransparent ? "text-white hover:bg-white/15" : "text-foreground hover:bg-muted"
              }`}
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
            <Link
              href="/web/login"
              className="flex items-center justify-center gap-2 mx-2 mt-3 py-2 px-4 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserRound size={16} />
              {t("custum.header.client_space")}
            </Link>
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
  light = false,
}: Readonly<{
  currentLang: string;
  onChange: (lang: string) => void;
  light?: boolean;
}>) {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center p-1 rounded-md cursor-pointer ${
            light ? "text-white hover:bg-white/15" : "text-foreground hover:bg-muted"
          }`}
        >
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
