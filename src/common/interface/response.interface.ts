export interface APIResponseDTO<T> {
    success: boolean;
    statusCode: number;
    data: T;
}