import { z } from "zod";

export const SignupFormSchema = z
  .object({
    name: z.string().min(1, { message: "Por favor, insira seu nome." }).trim(),
    email: z.email({ message: "Por favor, insira um e-mail válido." }).trim(),
    password: z
      .string()
      .min(8, { message: "Pelo menos 8 caracteres." })
      .regex(/(?:\d|[^a-zA-Z0-9])/, {
        message: "Pelo menos um número ou símbolo.",
      })
      .trim(),
    repeat: z
      .string()
      .min(8, { message: "Pelo menos 8 caracteres." })
      .regex(/(?:\d|[^a-zA-Z0-9])/, {
        message: "Pelo menos um número ou símbolo.",
      })
      .trim(),
  })
  .refine((data) => data.password === data.repeat, {
    error: "As senhas devem ser iguais.",
    path: ["password"],
  });

export const SigninFormSchema = z.object({
  email: z.email({ message: "Por favor, insira seu e-mail" }).trim(),
  password: z
    .string()
    .min(1, { message: "Por favor, insira sua senha" })
    .trim(),
});

export const AddContactFormSchema = z.object({
  name: z.string().min(1, { message: "Por favor, insira o nome." }).trim(),
  phone: z
    .string()
    .max(20, { message: "Máximo 20 caracteres." })
    .trim()
    .optional(),
  email: z
    .email({ message: "Por favor, insira um e-mail válido." })
    .trim()
    .or(z.literal(""))
    .optional(),
});

export const EditContactFormSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, { message: "Por favor, insira o nome." }).trim(),
  phone: z
    .string()
    .max(20, { message: "Máximo 20 caracteres." })
    .trim()
    .optional(),
  email: z
    .email({ message: "Por favor, insira um e-mail válido." })
    .trim()
    .or(z.literal(""))
    .optional(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        repeat?: string[];
        phone?: string[];
        avatar?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
