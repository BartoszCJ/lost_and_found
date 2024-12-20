
import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Nazwa użytkownika jest wymagana.",
    "string.min": "Nazwa użytkownika musi mieć co najmniej 3 znaki.",
    "string.max": "Nazwa użytkownika może mieć maksymalnie 50 znaków.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email jest wymagany.",
    "string.email": "Podaj poprawny email.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Hasło jest wymagane.",
    "string.min": "Hasło musi mieć co najmniej 6 znaków.",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email jest wymagany.",
    "string.email": "Podaj poprawny email.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Hasło jest wymagane.",
  }),
});
