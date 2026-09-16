import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export type CaptchaStatus = "idle" | "success" | "error";

interface TextCaptchaProps {
  onVerify?: (isVerified: boolean) => void;
  handleOpen: () => void;
  externalStatus?: CaptchaStatus;
  setExternalStatus?: React.Dispatch<React.SetStateAction<CaptchaStatus>>;
  difficulty?: number;
}

const secureRandom = (): number => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
};

const generateRandomText = (length: number): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(secureRandom() * chars.length));
  }
  return result;
};

const TextCaptcha: React.FC<TextCaptchaProps> = ({
  onVerify,
  externalStatus,
  handleOpen,
  setExternalStatus,
  difficulty = 6,
}) => {
  const [expectedText, setExpectedText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [internalStatus, setInternalStatus] = useState<CaptchaStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const status = externalStatus ?? internalStatus;
  const setStatus = setExternalStatus ?? setInternalStatus;

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("verifying")}
        </>
      );
    }
    if (status === "success") {
      return (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" />
          {t("verified-successfully")}
        </>
      );
    }
    return t("verifyNow");
  };

  const buttonContent = getButtonContent();

  useEffect(() => {
    refreshCaptcha();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) {
      toast.error(t("captachText"), {
        icon: "✏️",
        style: {
          borderRadius: "12px",
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isVerified = userInput === expectedText;
      setStatus(isVerified ? "success" : "error");

      if (isVerified) {
        toast.success(t("captachSuccess"), {
          icon: "✅",
          style: {
            borderRadius: "12px",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        });
        onVerify?.(true);
      } else {
        toast.error(t("captachIncorrect"), {
          icon: "❌",
          style: {
            borderRadius: "12px",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        });
        onVerify?.(false);
      }

      setIsLoading(false);
    }, 500);
  };

  const refreshCaptcha = () => {
    setExpectedText(generateRandomText(difficulty));
    setUserInput("");
    setStatus("idle");
  };

  const closeRecaptcha = () => {
    setExpectedText(generateRandomText(difficulty));
    setUserInput("");
    setStatus("idle");
    handleOpen();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md border-0 shadow-xl bg-gradient-to-br from-white/90 to-gray-50 dark:from-gray-900/90 dark:to-gray-800/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-primary/5 to-transparent opacity-20" />

        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary" strokeWidth={2} />
              <h2 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                {t("security-check")}
              </h2>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshCaptcha}
                className="rounded-full p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={closeRecaptcha}
                className="rounded-full p-2 hover:bg-red-600 dark:hover:bg-gray-700/50"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pl-9">
            {t("verify-human-text")}
          </p>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              key={expectedText}
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <canvas
                className="w-full"
                ref={(canvas) => {
                  if (!canvas || !expectedText) return;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;

                  canvas.height = 100;

                  const gradient = ctx.createLinearGradient(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                  );
                  gradient.addColorStop(
                    0,
                    `hsl(${secureRandom() * 360}, 30%, 90%)`,
                  );
                  gradient.addColorStop(
                    1,
                    `hsl(${secureRandom() * 360}, 30%, 85%)`,
                  );
                  ctx.fillStyle = gradient;
                  ctx.fillRect(0, 0, canvas.width, canvas.height);

                  for (let i = 0; i < 800; i++) {
                    ctx.fillStyle = `rgba(${secureRandom() * 255}, ${secureRandom() * 255
                      }, ${secureRandom() * 255}, ${secureRandom() * 0.2})`;
                    ctx.fillRect(
                      secureRandom() * canvas.width,
                      secureRandom() * canvas.height,
                      secureRandom() * 2,
                      secureRandom() * 2,
                    );
                  }

                  ctx.strokeStyle = `rgba(100, 100, 100, 0.3)`;
                  ctx.lineWidth = 0.5;
                  for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    const startY = secureRandom() * canvas.height;
                    ctx.moveTo(0, startY);
                    for (let x = 0; x <= canvas.width; x += 10) {
                      const distortion = Math.sin(x * 0.05 + i * 2) * 15;
                      ctx.lineTo(x, startY + distortion);
                    }
                    ctx.stroke();
                  }

                  const chars = expectedText.split("");
                  chars.forEach((char, i) => {
                    ctx.save();

                    const xOffset = i * 30 + (secureRandom() * 10 - 5);
                    const yOffset = secureRandom() * 8 - 4;

                    const rotation = (secureRandom() - 0.5) * 0.4;
                    const scale = 0.9 + secureRandom() * 0.3;

                    const hue = Math.floor(secureRandom() * 30) + 200;
                    const saturation = 50 + secureRandom() * 30;
                    const lightness = 30 + secureRandom() * 40;
                    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

                    const fontSize = 28 + Math.floor(secureRandom() * 6);
                    const fontFamily = ["monospace", "sans-serif", "serif"][
                      Math.floor(secureRandom() * 3)
                    ];
                    ctx.font = `${fontSize}px ${fontFamily}`;

                    ctx.translate(
                      canvas.width / 2 - (chars.length * 30) / 2 + xOffset,
                      canvas.height / 2 + yOffset,
                    );
                    ctx.rotate(rotation);
                    ctx.scale(scale, scale);

                    ctx.fillText(char, 0, 0);

                    if (secureRandom() > 0.7) {
                      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                      ctx.shadowBlur = 1 + secureRandom() * 2;
                      ctx.fillText(char, 0, 0);
                      ctx.shadowBlur = 0;
                    }

                    ctx.restore();
                  });

                  for (let i = 0; i < 10; i++) {
                    ctx.save();
                    const fakeChar = String.fromCharCode(
                      65 + Math.floor(secureRandom() * 26),
                    ); // A-Z
                    const fakeX = secureRandom() * canvas.width;
                    const fakeY = secureRandom() * canvas.height;
                    ctx.globalAlpha = 0.2 + secureRandom() * 0.3;
                    ctx.font = `${20 + secureRandom() * 15}px monospace`;
                    ctx.fillStyle = `rgba(${secureRandom() * 255}, ${secureRandom() * 255
                      }, ${secureRandom() * 255}, 0.3)`;
                    ctx.fillText(fakeChar, fakeX, fakeY);
                    ctx.restore();
                  }

                  ctx.globalCompositeOperation = "lighter";
                  ctx.transform(
                    1 + secureRandom() * 0.1,
                    secureRandom() * 0.05,
                    secureRandom() * 0.05,
                    1 + secureRandom() * 0.1,
                    0,
                    0,
                  );
                }}
              />
            </motion.div>

            <div className="space-y-2">
              <Input
                type="text"
                value={userInput}
                onChange={handleChange}
                placeholder={t("enterTextabove")}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                disabled={status === "success"}
                className="h-10 text-base focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary"
              />
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
                >
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{t("text-not-match")}</span>
                </motion.div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={status === "success" || isLoading}
              className="w-full h-10 text-base font-medium rounded-lg transition-all"
            >
              {buttonContent}
            </Button>
          </form>
        </CardContent>

        {status === "success" && (
          <CardFooter className="relative z-10 pt-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-success/10 text-success-foreground rounded-lg p-3 flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium"> {t("Verification complete")} </p>
                <p className="text-sm opacity-80">{t("You may now proceed")}</p>
              </div>
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default TextCaptcha;
