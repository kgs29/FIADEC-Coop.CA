import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { 
  loginSchema, 
  UserValidator, 
  resetPasswordSchema, 
  resetPasswordConfirmSchema,
  ResetPasswordPayload,
  ResetPasswordConfirmPayload 
} from './auth.validators';

describe('loginSchema', () => {
  it('should accept valid login credentials', () => {
    const validLogin = {
      username: 'testuser',
      password: 'password123',
    };

    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validLogin);
    }
  });

  it('should accept login with single character username and password', () => {
    const validLogin = {
      username: 'a',
      password: 'b',
    };

    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });

  it('should reject empty username', () => {
    const invalidLogin = {
      username: '',
      password: 'password123',
    };

    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Le nom d'utilisateur est requis");
    }
  });

  it('should reject empty password', () => {
    const invalidLogin = {
      username: 'testuser',
      password: '',
    };

    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le mot de passe est requis');
    }
  });

  it('should reject missing username', () => {
    const invalidLogin = {
      password: 'password123',
    };

    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const invalidLogin = {
      username: 'testuser',
    };

    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
  });
});

describe('UserValidator', () => {
  const baseUser = {
    username: 'testuser',
    last_name: 'Doe',
    first_name: 'John',
    email: 'john@example.com',
    phone_number: '0123456789',
    role_ids: ['role-1'],
  };

  it('should accept valid user data', () => {
    const result = UserValidator.safeParse(baseUser);
    expect(result.success).toBe(true);
  });

  it('should accept user with phone number exactly 9 characters', () => {
    const result = UserValidator.safeParse({ ...baseUser, phone_number: '012345678' });
    expect(result.success).toBe(true);
  });

  it('should reject empty username', () => {
    const result = UserValidator.safeParse({ ...baseUser, username: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Le nom d'utilisateur est requis");
    }
  });

  it('should reject empty last_name', () => {
    const result = UserValidator.safeParse({ ...baseUser, last_name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le nom est requis');
    }
  });

  it('should reject empty first_name', () => {
    const result = UserValidator.safeParse({ ...baseUser, first_name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Le prénom de l'utilisateur est requis");
    }
  });

  it('should reject empty email', () => {
    const result = UserValidator.safeParse({ ...baseUser, email: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'email de l'utilisateur est requis");
    }
  });

  it('should reject phone number with less than 9 characters', () => {
    const result = UserValidator.safeParse({ ...baseUser, phone_number: '01234' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le numéro est requis');
    }
  });

  it('should reject empty role_ids', () => {
    const result = UserValidator.safeParse({ ...baseUser, role_ids: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Au moins un rôle est requis');
    }
  });

  it('should accept two_factor_enabled as true', () => {
    const result = UserValidator.safeParse({ ...baseUser, two_factor_enabled: true });
    expect(result.success).toBe(true);
  });

  it('should accept two_factor_enabled as false', () => {
    const result = UserValidator.safeParse({ ...baseUser, two_factor_enabled: false });
    expect(result.success).toBe(true);
  });
});

describe('resetPasswordSchema', () => {
  it('should accept valid email format', () => {
    const validResetPassword = {
      email: 'test@example.com',
    };

    const result = resetPasswordSchema.safeParse(validResetPassword);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validResetPassword);
    }
  });

  it('should accept email with subdomain', () => {
    const validResetPassword = {
      email: 'test@mail.example.com',
    };

    const result = resetPasswordSchema.safeParse(validResetPassword);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const invalidResetPassword = {
      email: 'invalid-email',
    };

    const result = resetPasswordSchema.safeParse(invalidResetPassword);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'email de l'utilisateur est requise");
    }
  });

  it('should reject email without domain', () => {
    const invalidResetPassword = {
      email: 'test@',
    };

    const result = resetPasswordSchema.safeParse(invalidResetPassword);
    expect(result.success).toBe(false);
  });

  it('should reject empty email', () => {
    const invalidResetPassword = {
      email: '',
    };

    const result = resetPasswordSchema.safeParse(invalidResetPassword);
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const invalidResetPassword = {};

    const result = resetPasswordSchema.safeParse(invalidResetPassword);
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordConfirmSchema', () => {
  it('should accept matching passwords', () => {
    const validPasswordConfirm = {
      password: 'newPassword123',
      confirm_password: 'newPassword123',
    };

    const result = resetPasswordConfirmSchema.safeParse(validPasswordConfirm);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPasswordConfirm);
    }
  });

  it('should accept single character matching passwords', () => {
    const validPasswordConfirm = {
      password: 'a',
      confirm_password: 'a',
    };

    const result = resetPasswordConfirmSchema.safeParse(validPasswordConfirm);
    expect(result.success).toBe(true);
  });

  it('should reject non-matching passwords', () => {
    const invalidPasswordConfirm = {
      password: 'password123',
      confirm_password: 'different456',
    };

    const result = resetPasswordConfirmSchema.safeParse(invalidPasswordConfirm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Les deux mots de passe doivent etre identiques');
      expect(result.error.issues[0].path).toEqual(['confirm_password']);
    }
  });

  it('should reject empty password', () => {
    const invalidPasswordConfirm = {
      password: '',
      confirm_password: 'password123',
    };

    const result = resetPasswordConfirmSchema.safeParse(invalidPasswordConfirm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le mot de passe est requis');
    }
  });

  it('should reject empty confirm_password', () => {
    const invalidPasswordConfirm = {
      password: 'password123',
      confirm_password: '',
    };

    const result = resetPasswordConfirmSchema.safeParse(invalidPasswordConfirm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Veuillez confirmer votre mot de passe');
    }
  });

  it('should reject both empty passwords', () => {
    const invalidPasswordConfirm = {
      password: '',
      confirm_password: '',
    };

    const result = resetPasswordConfirmSchema.safeParse(invalidPasswordConfirm);
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const invalidPasswordConfirm = {
      confirm_password: 'password123',
    };

    const result = resetPasswordConfirmSchema.safeParse(invalidPasswordConfirm);
    expect(result.success).toBe(false);
  });

  it('should reject missing confirm_password', () => {
    const invalidPasswordConfirm = {
      password: 'password123',
    };

    const result = resetPasswordConfirmSchema.safeParse(invalidPasswordConfirm);
    expect(result.success).toBe(false);
  });

  it('should reject passwords with different case', () => {
    const invalidPasswordConfirm = {
      password: 'Password123',
      confirm_password: 'password123',
    };

    const result = resetPasswordConfirmSchema.safeParse(invalidPasswordConfirm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Les deux mots de passe doivent etre identiques');
    }
  });
});

describe('Type inference', () => {
  it('should properly infer ResetPasswordPayload type', () => {
    const resetPassword: ResetPasswordPayload = {
      email: 'test@example.com',
    };

    expect(resetPassword.email).toBe('test@example.com');
  });

  it('should properly infer ResetPasswordConfirmPayload type', () => {
    const resetPasswordConfirm: ResetPasswordConfirmPayload = {
      password: 'newPassword123',
      confirm_password: 'newPassword123',
    };

    expect(resetPasswordConfirm.password).toBe('newPassword123');
    expect(resetPasswordConfirm.confirm_password).toBe('newPassword123');
  });

  it('should accept loginSchema inference', () => {
    type LoginPayload = z.infer<typeof loginSchema>;
    const login: LoginPayload = {
      username: 'testuser',
      password: 'password123',
    };

    expect(login.username).toBe('testuser');
    expect(login.password).toBe('password123');
  });

  it('should accept UserValidator inference', () => {
    type UserPayload = z.infer<typeof UserValidator>;
    const user: UserPayload = {
      username: 'testuser',
      last_name: 'Doe',
      first_name: 'John',
      email: 'john@example.com',
      phone_number: '0123456789',
      role_ids: ['role-1'],
    };

    expect(user.username).toBe('testuser');
    expect(user.role_ids).toEqual(['role-1']);
  });
});
