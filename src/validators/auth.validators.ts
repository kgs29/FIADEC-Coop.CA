import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const UserValidator = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  first_name: z.string().min(1, "Le prénom de l'utilisateur est requis"),
  email: z.string().min(1, "L'email de l'utilisateur est requis"),
  phone_number: z.string().min(9, "Le numéro est requis"),
  role_ids: z.array(z.string()).min(1, "Au moins un rôle est requis"),
  two_factor_enabled: z.boolean().optional().default(false),
  captcha_enabled: z.boolean().optional().default(false),
  profile_photo: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "L'email de l'utilisateur est requise" }),
});

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

export const resetPasswordConfirmSchema = z
  .object({
    password: z.string().min(1, "Le mot de passe est requis"),
    confirm_password: z
      .string()
      .min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Les deux mots de passe doivent etre identiques",
    path: ["confirm_password"],
  });

export type ResetPasswordConfirmPayload = z.infer<
  typeof resetPasswordConfirmSchema
>;
