/**
 * Backend Telemetry & Consent Ingestion Pipeline
 * Endpoints: POST /api/v1/telemetry and POST /api/v1/consent
 */
/// <reference types="node" resolution-mode="require"/>
import type { IncomingMessage, ServerResponse } from 'http';
export interface IngestRequest extends IncomingMessage {
    body?: unknown;
    headers: IncomingMessage['headers'] & {
        'sec-gpc'?: string;
        'cf-connecting-ip'?: string;
        'cf-ipcountry'?: string;
        'cf-region'?: string;
        'cf-ipcity'?: string;
        'cf-asn'?: string;
        'x-real-ip'?: string;
        'x-forwarded-for'?: string;
        'x-vercel-ip-country'?: string;
        'x-vercel-ip-country-region'?: string;
        'x-vercel-ip-city'?: string;
        'x-appengine-country'?: string;
    };
}
export interface IngestResponse extends ServerResponse {
    status?: (code: number) => IngestResponse;
    json?: (data: unknown) => void;
    setHeader: (name: string, value: string | string[]) => this;
}
export interface ClientGeoInfo {
    country: string | null;
    region: string | null;
    city: string | null;
    asn: string | null;
}
export declare function extractClientIp(req: IngestRequest): string;
export declare function extractClientGeo(req: IngestRequest): ClientGeoInfo;
export declare function issueUidCookie(res: IngestResponse, uid: string): void;
export declare function deriveSegments(events: Array<{
    type: string;
    payload?: Record<string, unknown>;
}>): string[];
export declare function handleTelemetryIngest(req: IngestRequest, res: IngestResponse): Promise<void>;
export declare function handleConsentRecord(req: IngestRequest, res: IngestResponse): Promise<void>;
