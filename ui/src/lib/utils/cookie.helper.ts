'use client'

export function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") {
        // No access to `document` on the server
        return undefined;
    }

    const match = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`));

    return match?.split('=')[1];
}

export function setCookie(name: string, value: string, days: number, options: { path: string, httpOnly: boolean }) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Set expiration time
    const expiresString = `expires=${expires.toUTCString()}`;

    const path = options.path || '/';
    const secure = process.env.NODE_ENV === 'production' ? ';secure' : '';
    const httpOnly = options.httpOnly ? ';HttpOnly' : '';

    document.cookie = `${name}=${value};${expiresString};path=${path}${secure}${httpOnly}`;
}