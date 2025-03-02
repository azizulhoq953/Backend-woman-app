// src/utils/validators.ts
import validator from 'validator';

export const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const isStrongPassword = (password: string): boolean => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
};