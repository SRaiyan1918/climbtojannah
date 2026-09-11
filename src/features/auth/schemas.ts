import { z } from 'zod';
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(8,'Use at least 8 characters.')});
export const registrationSchema=z.object({displayName:z.string().trim().min(2,'Enter your name.'),email:z.string().email(),password:z.string().min(8,'Use at least 8 characters.'),confirmPassword:z.string()}).refine(value=>value.password===value.confirmPassword,{path:['confirmPassword'],message:'Passwords do not match.'});
