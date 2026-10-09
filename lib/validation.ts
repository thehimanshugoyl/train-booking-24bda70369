/**
 * Shared validation rules for GADDVYA Railway Portal
 * - Emails allowed: Gmail, Outlook, iCloud, Yahoo only
 * - Phone numbers allowed: 10-digit Indian mobile numbers (starts with 6, 7, 8, 9)
 */

export const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "yahoo.in",
  "yahoo.co.in",
] as const;

export function isAllowedEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  const domainMatch = trimmed.match(/^[^@\s]+@([a-z0-9.-]+\.[a-z]{2,})$/i);
  if (!domainMatch) return false;
  const domain = domainMatch[1].toLowerCase();
  return (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain);
}

export function cleanIndianPhone(phone: string): string {
  if (!phone || typeof phone !== "string") return "";
  const digits = phone.replace(/\D/g, "");
  // If user entered +91 or 91 followed by 10 digits
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  // Return last 10 digits
  return digits.slice(-10);
}

export function isValidIndianPhone(phone: string): boolean {
  const cleaned = cleanIndianPhone(phone);
  if (cleaned.length !== 10) return false;
  return /^[6-9]\d{9}$/.test(cleaned);
}
