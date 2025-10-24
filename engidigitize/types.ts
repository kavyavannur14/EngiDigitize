export type AppStatus = 'idle' | 'processing' | 'success' | 'error';

export interface ProcessedData {
  structuredData: string;
  vectorDrawing: string;
}
