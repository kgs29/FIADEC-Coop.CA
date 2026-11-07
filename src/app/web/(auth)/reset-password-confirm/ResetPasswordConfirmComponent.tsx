"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IMAGES } from "@/assets/images";
import Link from "next/link";
import { hashPassword } from "@/lib/hashPassword";
import { useResetPasswordMutation } from "@/store/apis/auth/authentication.api";
import {
  ResetPasswordConfirmPayload,
  resetPasswordConfirmSchema,
} from "@/validators/auth.validators";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

type ResetPasswordPageProps = Readonly<{
  uid: string;
  token: string;
}>;

const ResetPasswordConfirmComponent = ({
  uid,
  token,
}: ResetPasswordPageProps) => {
  const { t } = useTranslation();
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<ResetPasswordConfirmPayload>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: ResetPasswordConfirmPayload) {
    const data = {
      uidb64: uid,
      token: token,
      body: {
        password: await hashPassword(values.password),
        confirm_password: await hashPassword(values.confirm_password),
      },
    };

    try {
      const response = await resetPassword(data);

      if (response.error) {
        toast.error(t("confirmPassword.reset_password_failed"));
        return;
      }

      const status = (response.data as { status?: string })?.status ?? t("confirmPassword.reset_password_success");
      toast.success(status);
      form.reset();
      router.push("/web/login");
    } catch {
      toast.error(t("error_occurred"));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center mb-12">
        <Link href={"/web"}>
          <Image alt="Logo FIADEC-COOP-CA" src={IMAGES.logo} />
        </Link>
      </div>

      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-14">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">
              {t("confirmPassword.title")}
            </CardTitle>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">{t("login.passwordLabel")}</Label>

                    <div className="relative">
                      <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("login.passwordPlaceholder")}
                          {...field}
                        />
                      </FormControl>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirm_password">
                      {t("confirmPassword.confirmPasswordLabel")}
                    </Label>

                    <div className="relative">
                      <FormControl>
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t(
                            "confirmPassword.confirmPasswordPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-teal-800 hover:bg-teal-900 text-white font-semibold h-12"
                aria-label={t("confirmPassword.confirm")}
              >
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  t("confirmPassword.confirm")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordConfirmComponent;
