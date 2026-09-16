"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import {
  ResetPasswordPayload,
  resetPasswordSchema,
} from "@/validators/auth.validators";
import toast from "react-hot-toast";
import CancelButton from "@/components/CancelButton";
import { LoadingButton } from "@/components/ui/loading-btn";
import { useResetPasswordGetTokenMutation } from "@/store/apis/auth/authentication.api";

const ResetPasswordGetTokenComponent = () => {
  const { t } = useTranslation();
  const [resetPasswordGetToken, { isLoading }] =
    useResetPasswordGetTokenMutation();

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ResetPasswordPayload) {
    try {
      const response = await resetPasswordGetToken(data);

      if (response.error) {
        toast.error(t("reset_password.invalid_email_or_another_error"));
        return;
      }

      toast.success(t("reset_password.token_successfully"),  { duration: 5000 });
      form.reset();
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
              {t("reset_password.title")}
            </CardTitle>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">
                      {t("reset_password.emailLabel")}
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder={t("reset_password.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-x-4 items-center mt-6">
                <CancelButton path="/web" />
                <LoadingButton loading={isLoading} aria-label={t("send")}>{t("send")}</LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordGetTokenComponent;
