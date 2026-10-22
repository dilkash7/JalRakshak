import { customAlphabet } from "nanoid";

// Unambiguous alphabet: excludes 0, O, 1, I, l to avoid human confusion on physical receipts & SMS
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const nanoid = customAlphabet(ALPHABET, 10);

/**
 * Generates an unguessable, human-readable report ID
 * Format: JR-XXXXXXXXXX (e.g., JR-7K9M3X8P2W)
 * Over 33^10 (~1.5 x 10^15) combinations
 */
export function generateReportId(): string {
  return `JR-${nanoid()}`;
}

/**
 * Validates report ID format
 */
export function isValidReportId(id: string): boolean {
  return /^JR-[2-9A-HJ-NP-Z]{10}$/.test(id);
}
