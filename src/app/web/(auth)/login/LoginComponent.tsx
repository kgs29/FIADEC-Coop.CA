"use client";
import { IMAGES } from "@/assets/images";
import {
  useLoginMutation,
  useVerifyOTPMutation,
} from "@/store/apis/auth/authentication.api";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import { loginSuccess } from "@/store/slices/authslice";
import { hashPassword } from "@/lib/hashPassword";
import { LoginPayload } from "@/types/auth.types";
import { loginSchema } from "@/validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const STEP_CREDENTIALS = "credentials";
const STEP_CAPTCHA = "captcha";
const STEP_OTP = "otp";
type Step = typeof STEP_CREDENTIALS | typeof STEP_CAPTCHA | typeof STEP_OTP;

const otpSchema = z.object({
  otp_code: z.string().length(6, "Le code OTP doit contenir 6 caractères"),
});
type OtpForm = z.infer<typeof otpSchema>;

/* ── Decorative animated background ─────────────────────────── */
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full animate-spin-slow" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-400/20 rounded-full animate-spin-reverse" />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-teal-300/15 rounded-full animate-spin-slow"
      style={{ animationDuration: "25s" }}
    />
    <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow" />
    <div
      className="absolute bottom-10 right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl animate-pulse-slow"
      style={{ animationDelay: "1s" }}
    />
    <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-green-300/15 rounded-full blur-2xl animate-float" />
    <div
      className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-emerald-300/15 rounded-full blur-2xl animate-float"
      style={{ animationDelay: "2s" }}
    />
    <div className="absolute top-20 right-20 w-1 h-1 bg-emerald-300 rounded-full animate-ping" />
    <div
      className="absolute bottom-32 left-32 w-1 h-1 bg-teal-300 rounded-full animate-ping"
      style={{ animationDelay: "0.5s" }}
    />
    <div
      className="absolute top-1/3 left-20 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"
      style={{ animationDelay: "1s" }}
    />
  </div>
);

/* ── Left branding panel ─────────────────────────────────────── */
type BrandingPanelProps = Readonly<{ t: (k: string) => string }>;

const BRANDING_FEATURES: { id: string; labelKey: string; icon: React.ReactNode }[] = [
  { id: "security",  labelKey: "login.featureSecurity",  icon: <ShieldCheck className="w-5 h-5" /> },
  { id: "mfa",       labelKey: "login.featureMFA",       icon: <Lock        className="w-5 h-5" /> },
  { id: "access",    labelKey: "login.featureAccess",    icon: <User        className="w-5 h-5" /> },
  { id: "tracking",  labelKey: "login.featureTracking",  icon: <RefreshCw   className="w-5 h-5" /> },
];

const BrandingPanel = ({ t }: BrandingPanelProps) => (
  <div className="hidden lg:flex flex-col flex-1 text-white animate-slide-up">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 flex items-center justify-center">
        <Image src={IMAGES.logo} alt="Logo" className="w-full h-full object-contain" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{t("login.brandSlogan")}</h1>
        <p className="text-sm text-emerald-200/70 uppercase tracking-wider">{t("login.platformSubtitle")}</p>
      </div>
    </div>
    <h2 className="text-3xl font-bold leading-tight mb-4">
      {t("login.brandTitle")}
      <span className="block text-emerald-300">{t("login.brandTitleHighlight")}</span>
    </h2>
    <p className="text-base text-white/60 mb-8 max-w-md">{t("login_description")}</p>
    <div className="grid grid-cols-2 gap-3">
      {BRANDING_FEATURES.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
        >
          <div className="text-emerald-300">{f.icon}</div>
          <span className="text-sm font-medium text-white/80">{t(f.labelKey)}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Shared error alert ────────────────────────────────────── */
type ErrorAlertProps = Readonly<{ error: string | null }>;
function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;
  return (
    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-4">
      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <p className="text-sm font-medium text-red-300">{error}</p>
    </div>
  );
}

/* ── Language switcher ─────────────────────────────────────── */
type LangSwitcherProps = Readonly<{ t: (k: string) => string }>;
function LangSwitcher({ t }: LangSwitcherProps) {
  const { i18n } = useTranslation();
  return (
    <>
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 uppercase tracking-wider">{t("login.languageLabel")}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <div className="flex items-center justify-center gap-3">
        {["fr", "en"].map((code) => (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition-all ${
              i18n.language === code
                ? "text-white bg-white/10 border border-white/20"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {code === "fr" ? "Français" : "English"}
          </button>
        ))}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
const LoginComponent = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<Step>(STEP_CREDENTIALS);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Credentials stored while waiting for captcha / OTP ──── */
  const pendingCredentials = useRef<LoginPayload | null>(null);

  /* ── CAPTCHA state (returned by API, not user-toggled) ───── */
  const [captchaKey, setCaptchaKey] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  /* ── OTP state ───────────────────────────────────────────── */
  const [otpSession, setOtpSession] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(120);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp_code: "" },
  });

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  const startCountdown = () => {
    setOtpCountdown(120);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const refreshCaptcha = async () => {
    if (!pendingCredentials.current) return;
    setCaptchaLoading(true);
    setCaptchaError(false);
    try {
      const res = await login(pendingCredentials.current);
      if (res.data && "requires_captcha" in res.data) {
        setCaptchaKey((res.data as any).captcha_key);
        setCaptchaQuestion((res.data as any).captcha_question);
        setCaptchaAnswer("");
      }
    } finally {
      setCaptchaLoading(false);
    }
  };

  /* ── Step 1 : credentials ──────────────────────────────────── */
  async function onSubmitCredentials(values: LoginPayload) {
    setError(null);
    const payload: LoginPayload = { ...values, password: await hashPassword(values.password) };
    pendingCredentials.current = payload;
    const res = await login(payload);

    if (!res.data) {
      const err: any = res.error;
      if (err?.status === 401) setError(t("login.errorInvalidCredentials"));
      else if (err?.status === 403) setError(err?.data?.error?.message ?? t("login.errorAccountDisabled"));
      else setError(t("server_error"));
      return;
    }

    const data = res.data as any;

    if (data.requires_captcha) {
      setCaptchaKey(data.captcha_key);
      setCaptchaQuestion(data.captcha_question);
      setCaptchaAnswer("");
      setStep(STEP_CAPTCHA);
      return;
    }

    if (data.requires_otp) {
      setOtpSession(data.otp_session);
      setMaskedEmail(data.email);
      startCountdown();
      setStep(STEP_OTP);
      toast.success(t("login.otpCodeSent"));
      return;
    }

    finalizeLogin(data);
  }

  /* ── Step 2 : captcha validation ───────────────────────────── */
  async function onSubmitCaptcha() {
    if (!captchaAnswer.trim()) {
      setCaptchaError(true);
      return;
    }
    setError(null);
    setCaptchaError(false);

    const payload: LoginPayload = {
      ...pendingCredentials.current!,
      captcha_key: captchaKey,
      captcha_answer: captchaAnswer,
    };

    const res = await login(payload);

    if (!res.data) {
      const err: any = res.error;
      if (err?.status === 400) {
        setError(t("login.captchaInvalid"));
        await refreshCaptcha();
      } else {
        setError(t("server_error"));
      }
      return;
    }

    const data = res.data as any;

    if (data.requires_otp) {
      setOtpSession(data.otp_session);
      setMaskedEmail(data.email);
      startCountdown();
      setStep(STEP_OTP);
      toast.success(t("login.otpCodeSent"));
      return;
    }

    finalizeLogin(data);
  }

  /* ── Step 3 : OTP validation ───────────────────────────────── */
  async function onSubmitOTP(values: OtpForm) {
    if (otpCountdown === 0) {
      setError(t("login.otpExpiredError"));
      setStep(STEP_CREDENTIALS);
      return;
    }
    const res = await verifyOTP({ otp_session: otpSession, otp_code: values.otp_code });
    if (!res.data) {
      const err: any = res.error;
      setError(err?.data?.error?.message ?? t("login.otpInvalidError"));
      return;
    }
    finalizeLogin(res.data as any);
  }

  function finalizeLogin(data: any) {
    const token = data.token ?? data;
    toast.success(t("login.successMessage"));
    dispatch(loginSuccess({ isLoggedIn: true, user: token.user }));
    localStorage.setItem("access", JSON.stringify(token.access));
    localStorage.setItem("refresh", JSON.stringify(token.refresh));
    redirect(token.user.is_editor ? "/editors" : "/admin");
  }

  /* ──────────────────────────────────────────────────────────── */
  let stepTitle: string;
  if (step === STEP_CAPTCHA) stepTitle = t("login.captchaTitle");
  else if (step === STEP_OTP) stepTitle = t("login.twoFactorTitle");
  else stepTitle = t("login.title");

  let stepSubtitle: string;
  if (step === STEP_CAPTCHA) stepSubtitle = t("login.captchaSubtitle");
  else if (step === STEP_OTP) stepSubtitle = `${t("login.otpSentTo")} ${maskedEmail}`;
  else stepSubtitle = t("login_description");

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center relative login-page-root" style={{ background: "linear-gradient(135deg, var(--login-bg-from, #064E3B), var(--login-bg-to, #134E4A))" }}>
      <AnimatedBackground />

      {/* Bouton retour à l'accueil */}
      <Link
        href="/web"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all backdrop-blur-sm border border-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Accueil
      </Link>

      <div className="relative z-10 flex items-center gap-16 px-8 max-w-6xl w-full">
        <BrandingPanel t={t} />

        {/* ── Card ────────────────────────────────────────────── */}
        <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20" style={{ backgroundColor: "color-mix(in srgb, var(--login-card-bg, #FFFFFF) 10%, transparent)" }}>

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <Image src={IMAGES.logo} alt="Logo" className="h-10 w-auto" />
            </div>

            {/* Icon + title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: "linear-gradient(135deg, var(--login-accent, #10B981), color-mix(in srgb, var(--login-accent, #10B981) 70%, #134E4A))" }}>
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stepTitle}</h3>
              <p className="text-sm text-white/50">{stepSubtitle}</p>
            </div>

            <ErrorAlert error={error} />

            {/* ══ STEP 1 : credentials ══════════════════════════ */}
            {step === STEP_CREDENTIALS && (
              <form onSubmit={form.handleSubmit(onSubmitCredentials)} className="space-y-5" noValidate>
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("login.usernameLabel")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      {...form.register("username")}
                      type="text"
                      autoComplete="username"
                      placeholder={t("login.usernamePlaceholder")}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-base text-white placeholder-white/30 outline-none transition-all login-input"
                      onPaste={(e) => e.preventDefault()}
                    />
                  </div>
                  {form.formState.errors.username && (
                    <p className="text-xs text-red-400 mt-1">{form.formState.errors.username.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("login.passwordLabel")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      {...form.register("password")}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t("login.passwordPlaceholder")}
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-base text-white placeholder-white/30 outline-none transition-all login-input"
                      onPaste={(e) => e.preventDefault()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-400 mt-1">{form.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end -mt-1">
                  <Link
                    href="/web/reset-password"
                    className="text-xs font-medium transition-colors" style={{ color: "var(--login-accent, #10B981)" }}
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-white text-base font-semibold rounded-xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2" style={{ background: "linear-gradient(90deg, var(--login-accent, #10B981), color-mix(in srgb, var(--login-accent, #10B981) 60%, #0F172A))" }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{t("login.adminButton")} <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}

            {/* ══ STEP 2 : CAPTCHA ══════════════════════════════ */}
            {step === STEP_CAPTCHA && (
              <div className="space-y-5">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-white/60 mb-3">{t("login.captchaSecurityQuestion")}</p>
                  <p className="text-xl font-bold text-white mb-1">{captchaQuestion}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">{t("login.captchaAnswerLabel")}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={captchaAnswer}
                    onChange={(e) => { setCaptchaAnswer(e.target.value); setCaptchaError(false); }}
                    placeholder="= ?"
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl text-center text-2xl font-bold text-white placeholder-white/30 outline-none transition-all ${
                      captchaError
                        ? "border-red-400/50 focus:ring-2 focus:ring-red-400/20"
                        : "border-white/10 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                    }`}
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && onSubmitCaptcha()}
                  />
                  {captchaError && <p className="text-xs text-red-400 mt-1">{t("login.captchaRequired")}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    disabled={captchaLoading}
                    className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-xl transition-all text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${captchaLoading ? "animate-spin" : ""}`} />
                    {t("login.captchaNew")}
                  </button>
                  <button
                    type="button"
                    onClick={onSubmitCaptcha}
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>{t("login.captchaValidate")} <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setStep(STEP_CREDENTIALS); setError(null); }}
                  className="w-full text-sm text-white/40 hover:text-white/70 text-center transition-colors"
                >
                  {t("login.backToLoginArrow")}
                </button>
              </div>
            )}

            {/* ══ STEP 3 : OTP ══════════════════════════════════ */}
            {step === STEP_OTP && (
              <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-5" noValidate>
                <div className="text-center">
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      otpCountdown > 0
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {otpCountdown > 0
                      ? t("login.otpTimer", { seconds: otpCountdown })
                      : t("login.otpExpiredBadge")}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t("login.otpStepLabel")}
                  </label>
                  <div className="flex flex-col items-center justify-center">
                    <InputOTP
                      className="bg-transparent"
                      maxLength={6}
                      value={otpForm.watch("otp_code")}
                      onChange={(value) => otpForm.setValue("otp_code", value.toUpperCase(), { shouldValidate: true })}
                      disabled={isVerifying || otpCountdown === 0}
                      autoFocus
                    >
                      <InputOTPGroup className="gap-3 sm:gap-4 bg-transparent">
                        <InputOTPSlot index={0} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl bg-transparent border border-white/20 text-white shadow-sm data-[active=true]:border-emerald-400 data-[active=true]:bg-white/5 data-[active=true]:ring-2 data-[active=true]:ring-emerald-400/30 transition-all" />
                        <InputOTPSlot index={1} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl bg-transparent border border-white/20 text-white shadow-sm data-[active=true]:border-emerald-400 data-[active=true]:bg-white/5 data-[active=true]:ring-2 data-[active=true]:ring-emerald-400/30 transition-all" />
                        <InputOTPSlot index={2} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl bg-transparent border border-white/20 text-white shadow-sm data-[active=true]:border-emerald-400 data-[active=true]:bg-white/5 data-[active=true]:ring-2 data-[active=true]:ring-emerald-400/30 transition-all" />
                        <InputOTPSlot index={3} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl bg-transparent border border-white/20 text-white shadow-sm data-[active=true]:border-emerald-400 data-[active=true]:bg-white/5 data-[active=true]:ring-2 data-[active=true]:ring-emerald-400/30 transition-all" />
                        <InputOTPSlot index={4} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl bg-transparent border border-white/20 text-white shadow-sm data-[active=true]:border-emerald-400 data-[active=true]:bg-white/5 data-[active=true]:ring-2 data-[active=true]:ring-emerald-400/30 transition-all" />
                        <InputOTPSlot index={5} className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl bg-transparent border border-white/20 text-white shadow-sm data-[active=true]:border-emerald-400 data-[active=true]:bg-white/5 data-[active=true]:ring-2 data-[active=true]:ring-emerald-400/30 transition-all" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {otpForm.formState.errors.otp_code && (
                    <p className="text-xs text-red-400 mt-1">{otpForm.formState.errors.otp_code.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpCountdown === 0}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{t("login.verifyOtp")} <ShieldCheck className="w-5 h-5" /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(STEP_CREDENTIALS);
                    otpForm.reset(); 
                    if (countdownRef.current) {
                      clearInterval(countdownRef.current);
                    }
                    setError(null); 
                  }}
                  className="w-full text-sm text-white/40 hover:text-white/70 text-center transition-colors"
                >
                  {t("login.backToLoginArrow")}
                </button>
              </form>
            )}

            <LangSwitcher t={t} />
          </div>
        </div>
      </div>

      {/* Back to site */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <Link href="/web" className="text-xs text-white/30 hover:text-white/60 transition-colors">
          ← {t("login.back_to_home")}
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;
