"use client";

import {
  BASE_API_URL,
  EMAIL_ADDRESS,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  LINKEDIN_LINK,
  LOCATION,
  PHONE,
  TWITTER_LINK,
} from "@/constants/env";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo_fiadec.jpg";
import ngtiLogo from "../../assets/logo_ngti.png";

const FacebookSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TwitterSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const LinkedinSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const WhatsappSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.11c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.37.27-.29.58-.36.77-.36s.39 0 .56.01c.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.7-.17 1.38Z" />
  </svg>
);

interface SocialProps { href?: string; label: string; children: React.ReactNode; }
const Social: React.FC<SocialProps> = ({ href = "#", label, children }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-125 inline-flex"
  >
    {children}
  </a>
);

const NewsletterForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim().includes("@") || !email.trim().includes(".")) {
      setStatus("error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}core/newsletter/subscribe/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 201 || res.status === 200) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder={t("custum.footer.newsletter.placeholder")}
          className="flex-grow px-3 py-2 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background border border-border text-sm placeholder-muted-foreground"
          required
        />
        <button
          type="submit"
          disabled={loading}
          aria-label={t("custum.footer.newsletter.subscribe")}
          className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg sm:rounded-l-none transition-all hover:shadow-lg font-medium text-sm whitespace-nowrap disabled:opacity-60"
        >
          {loading
            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Send className="w-3.5 h-3.5" />}
          {t("custum.footer.newsletter.subscribe")}
        </button>
      </form>
      {status === "success" && (
        <p className="text-primary text-xs animate-pulse">
          {t("custum.footer.newsletter.success")}
        </p>
      )}
      {status === "error" && (
        <p className="text-destructive text-xs">{t("custum.footer.newsletter.error")}</p>
      )}
    </div>
  );
};

export default function Footer(): React.ReactElement {
  const { t } = useTranslation();
  const whatsappLink = `https://wa.me/${PHONE.replace(/\D/g, "")}`;
  const mapsQuery = encodeURIComponent(LOCATION);

  const usefulLinks = [
    { href: "/web", label: t("custum.header.nav.home") },
    { href: "/web/accounts", label: t("custum.header.nav.accounts") },
    { href: "/web/services", label: t("custum.header.nav.services") },
    { href: "/web/contact-us", label: t("custum.header.nav.contact_us") },
  ];

  const companyLinks = [
    { href: "/web/about", label: t("custum.header.nav.about") },
    { href: "/web/faq", label: t("custum.header.nav.faq") },
    { href: "/web/careers", label: t("custum.header.nav.careers") },
    { href: "/web/partners", label: t("custum.header.nav.partners") },
  ];

  return (
    <footer className="bg-muted text-foreground py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-10">

          {/* FIADEC - prend plus de largeur */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="inline-flex items-center gap-3 bg-card rounded-lg px-3 py-2 shadow-sm mb-3">
                <Image src={logo} alt="FIADEC-COOP-CA" width={52} height={52} className="h-13 w-13 object-contain rounded-md" priority />
                <span className="font-poppins font-bold text-primary">FIADEC-COOP-CA</span>
              </div>
              <p className="text-primary text-xs font-semibold italic mb-2">{t("custum.footer.slogan")}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("footerText")}</p>
            </div>
            <div className="space-y-3 text-sm">
              <a
                href={`https://maps.google.com/?q=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start hover:text-primary transition-colors group"
              >
                <MapPin size={16} className="mr-3 mt-0.5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{LOCATION}</span>
              </a>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="flex items-start hover:text-primary transition-colors group"
              >
                <Mail size={16} className="mr-3 mt-0.5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{EMAIL_ADDRESS}</span>
              </a>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="flex items-start hover:text-primary transition-colors group"
              >
                <Phone size={16} className="mr-3 mt-0.5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{PHONE}</span>
              </a>
            </div>
            <div className="pt-4">
              <Link
                href="/web/accounts"
                className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all hover:shadow-lg text-sm font-medium"
              >
                {t("custum.footer.open_account")}
              </Link>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-foreground pb-2 border-b-2 border-primary inline-block">
              {t("custum.footer.useful_links_title")}
            </h6>
            <ul className="space-y-2.5">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-foreground pb-2 border-b-2 border-secondary inline-block">
              {t("custum.footer.company_title")}
            </h6>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions de transfert */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-foreground pb-2 border-b-2 border-primary inline-block">
              {t("custum.footer.transfer_title")}
            </h6>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "MTN Mobile Money", image: "/web-site/Mtn.jpg" },
                { name: "Orange Money", image: "/web-site/orangejpg.jpg" },
                { name: "Western Union", image: "/web-site/western.jpg" },
              ].map(({ name, image }) => (
                <div
                  key={name}
                  className="flex items-center justify-center bg-card border border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-all duration-200"
                >
                  <Image
                    src={image}
                    alt={name}
                    width={96}
                    height={48}
                    className="w-full h-12 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Nous suivre */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-foreground pb-2 border-b-2 border-primary inline-block">
              {t("custum.footer.follow_us_title")}
            </h6>
            <div className="flex gap-4">
              <Social href={FACEBOOK_LINK} label="Facebook"><FacebookSvg /></Social>
              <Social href={TWITTER_LINK} label="Twitter (X)"><TwitterSvg /></Social>
              <Social href={INSTAGRAM_LINK} label="Instagram"><InstagramSvg /></Social>
              <Social href={LINKEDIN_LINK} label="LinkedIn"><LinkedinSvg /></Social>
              <Social href={whatsappLink} label="WhatsApp"><WhatsappSvg /></Social>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-foreground mb-3">
                {t("custum.footer.newsletter.title")}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <p className="text-muted-foreground text-sm text-center md:text-left order-2 md:order-1">
              {t("custum.footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="text-muted-foreground text-xs text-center order-1 md:order-2">
              {t("custum.footer.tagline")}
            </p>
            <div className="flex items-center justify-center md:justify-end gap-1.5 order-3">
              <span className="text-muted-foreground text-xs">{t("custum.footer.developed_by")}</span>
              <span className="flex items-center gap-1.5">
                <Image src={ngtiLogo} alt="NG-Tech-In" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                <span className="text-xs font-semibold text-foreground">NG-Tech-In</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
