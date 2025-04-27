// lib/csrf.ts

import csrf from 'csrf';
import { forbidden } from 'next/navigation';

const csrfProtection = new csrf();

// Secret key for signing tokens; in production, this should be a securely stored secret
// const secret = process.env.CSRF_SECRET || 'your-secret-key';

// Generate a CSRF token
export const generateCsrfToken = (secret: string): string => {
    return csrfProtection.create(secret);
};

// Validate a CSRF token
export const validateCsrfToken = (token: string, secret: string): boolean => {
    return csrfProtection.verify(secret, token);
}

export const validateCsrfTokenWithEx = (token: string, secret: string): boolean => {
    if (!csrfProtection.verify(secret, token))
        forbidden()
    return true
}
