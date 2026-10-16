/**
 * Google Ads Customer Match & Enhanced Conversions Export Utility
 * Generates normalized, SHA-256 hashed cohorts for Google Ads Customer Match
 */
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
export declare function sha256Hex(value: string | null | undefined): string;
export declare function normalizePhone(phone: string | null | undefined): string;
export declare function toCustomerMatchCSV(records: CustomerMatchRecord[]): string;
export declare function getExportableAudienceCohort(segmentName: string): Promise<AudienceCohortExport>;
