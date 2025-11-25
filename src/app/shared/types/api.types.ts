export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    unknownFields?: string[];
    transformedAt: Date;
  };
}
