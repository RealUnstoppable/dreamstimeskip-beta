/**
 * Google Ads Customer Match & Enhanced Conversions Export Utility
 * Generates normalized, SHA-256 hashed cohorts for Google Ads Customer Match
 */

import crypto from 'crypto';
import { adminDb } from './firebase-admin.js';

export interface CustomerMatchRecord {
  Email: string;
  Phone: string;
  'First Name': string;
  'Last Name': string;
  Country: string;
  Zip: string;
}

export interface AudienceCohortExport {
  segmentName: string;
  totalRecords: number;
  records: CustomerMatchRecord[];
  csv: string;
  json: string;
}

export function sha256Hex(value: string | null | undefined): string {
  if (!value) return '';
  const normalized = value.trim().toLowerCase();
  if (!normalized) return '';
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  // Remove non-digit characters except leading +
  const trimmed = phone.trim();
  const digitsOnly = trimmed.replace(/[^\d+]/g, '');
  return digitsOnly;
}

export function toCustomerMatchCSV(records: CustomerMatchRecord[]): string {
  const headers = ['Email', 'Phone', 'First Name', 'Last Name', 'Country', 'Zip'];
  const rows = records.map((r) => [
    r.Email || '',
    r.Phone || '',
    r['First Name'] || '',
    r['Last Name'] || '',
    r.Country || '',
    r.Zip || '',
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

export async function getExportableAudienceCohort(segmentName: string): Promise<AudienceCohortExport> {
  const querySnapshot = await adminDb
    .collection('users')
    .where('adsExportEligible', '==', true)
    .where('computedSegments', 'array-contains', segmentName)
    .get();

  const records: CustomerMatchRecord[] = [];

  for (const doc of querySnapshot.docs) {
    const data = doc.data();

    // Use pre-computed SHA-256 or hash normalized raw values
    const hashedEmail = data.hashedEmailSha256 || sha256Hex(data.email);
    const rawPhone = data.phone ? normalizePhone(data.phone) : '';
    const hashedPhone = data.hashedPhoneSha256 || (rawPhone ? sha256Hex(rawPhone) : '');

    const hashedFirstName = sha256Hex(data.firstName || data.displayName?.split(' ')[0]);
    const hashedLastName = sha256Hex(data.lastName || data.displayName?.split(' ').slice(1).join(' '));
    const hashedCountry = sha256Hex(data.country || data.geo?.country);
    const hashedZip = sha256Hex(data.zip || data.postalCode);

    // Only include record if at least email or phone identifier is present
    if (hashedEmail || hashedPhone) {
      records.push({
        Email: hashedEmail,
        Phone: hashedPhone,
        'First Name': hashedFirstName,
        'Last Name': hashedLastName,
        Country: hashedCountry,
        Zip: hashedZip,
      });
    }
  }

  const csv = toCustomerMatchCSV(records);
  const json = JSON.stringify(records, null, 2);

  return {
    segmentName,
    totalRecords: records.length,
    records,
    csv,
    json,
  };
}
