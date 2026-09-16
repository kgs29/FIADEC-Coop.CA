"use client";

import { BASE_API_URL, EMAIL_ADDRESS, LOCATION, PHONE } from "@/constants/env";
import { Clock, Mail, MapPin, MessageSquare, Phone as PhoneIcon, Send, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();
  const whatsappLink = `https://wa.me/${PHONE.replace(/\D/g, "")}`;

  const faqs = [
    {
      question: t("web_contact_extra.faq_1_q"),
      answer: t("web_contact_extra.faq_1_r"),
    },
    {
      question: t("web_contact_extra.faq_2_q"),
      answer: t("web_contact_extra.faq_2_r"),
    },
    {
      question: t("web_contact_extra.faq_3_q"),
      answer: t("web_contact_extra.faq_3_r"),
    },
  ];
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error(t("fill_all_fields"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}core/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 201) {
        toast.success(t("contact_success"));
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        const firstError = Object.values(data)?.[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : t("an_error_occurred"));
      }
    } catch {
      toast.error(t("an_error_occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-inter bg-background">
      {/* Hero */}
      <section className="relative bg-muted border-b border-border py-16 md:py-24 px-6 text-center">
        <div className="relative z-10">
          <h1 className="font-poppins text-3xl md:text-5xl font-bold text-foreground mb-6">{t("contact_us")}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            {t("web_contact_extra.hero_subtitle")}
          </p>
        </div>
      </section>

      {/* Infos */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl bg-card border border-border">
            <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-poppins text-xl font-bold mb-2 text-foreground">{t("web_contact_extra.hours_title")}</h3>
            <p className="text-muted-foreground whitespace-pre-line">{t("web_contact_extra.hours_body")}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-poppins text-xl font-bold mb-2 text-foreground">{t("web_contact_extra.team_title")}</h3>
            <p className="text-muted-foreground">{t("web_contact_extra.team_body")}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Send className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-poppins text-xl font-bold mb-2 text-foreground">{t("web_contact_extra.reply_title")}</h3>
            <p className="text-muted-foreground">{t("web_contact_extra.reply_body")}</p>
          </div>
        </div>
      </section>

      {/* Contact principal */}
      <section className="py-16 md:py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-card rounded-2xl shadow-sm p-8 border border-border">
          <h2 className="font-poppins text-2xl font-bold text-foreground mb-6">{t("contact_form_title")}</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-foreground mb-2 font-medium text-sm">
                {t("contact_name")}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder={t("contact_name_placeholder")}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-foreground mb-2 font-medium text-sm">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("contact_email_placeholder")}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-foreground mb-2 font-medium text-sm">
                {t("contact_subject")}
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder={t("contact_subject_placeholder")}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-foreground mb-2 font-medium text-sm">
                {t("contact_message")}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder={t("contact_message_placeholder")}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold transition hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t("send")}
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Coordonnées */}
        <div className="flex flex-col justify-center space-y-8">
          <h2 className="font-poppins text-2xl font-bold text-foreground">{t("contact_coords")}</h2>
          <p className="text-muted-foreground text-lg">{t("web_contact_extra.coords_intro")}</p>

          <div className="space-y-4">
            <a
              href={`tel:${PHONE.replace(/\s+/g, "")}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-accent transition-colors border border-border"
            >
              <div className="p-3 rounded-full bg-accent text-accent-foreground">
                <PhoneIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-foreground font-medium">{t("phone")}</p>
                <p className="text-muted-foreground">{PHONE}</p>
              </div>
            </a>

            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-accent transition-colors border border-border"
            >
              <div className="p-3 rounded-full bg-accent text-accent-foreground">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-foreground font-medium">Email</p>
                <p className="text-muted-foreground">{EMAIL_ADDRESS}</p>
              </div>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-accent transition-colors border border-border"
            >
              <div className="p-3 rounded-full bg-accent text-accent-foreground">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-foreground font-medium">{t("web_contact_extra.whatsapp_label")}</p>
                <p className="text-muted-foreground">{PHONE}</p>
              </div>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-accent transition-colors border border-border"
            >
              <div className="p-3 rounded-full bg-accent text-accent-foreground">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-foreground font-medium">{t("address")}</p>
                <p className="text-muted-foreground">{LOCATION}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Carte */}
      <section className="w-full h-96 relative">
        <iframe
          title="Localisation FIADEC-COOP-CA"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127432.347868078!2d11.446!3d3.848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7b28dfc46f%3A0x300d7f5aeef4000!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2scm!4v000000"
          className="w-full h-full border-0"
          loading="lazy"
        />
        <div className="absolute bottom-4 left-4 bg-card p-4 rounded-lg shadow-md border border-border">
          <h3 className="font-poppins font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t("web_contact_extra.map_caption", { location: LOCATION })}
          </h3>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-muted border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t("web_contact_extra.faq_heading")}
            </h2>
            <p className="text-muted-foreground text-lg">{t("web_contact_extra.faq_subtitle")}</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-poppins font-semibold text-lg text-foreground flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm shrink-0">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
