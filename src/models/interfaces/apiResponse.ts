import type { Response } from 'express';

interface ApiResponse <T = unknown>{
    message: string;
    data?: T;
}

type wrappedResponse <T=unknown> = Response<ApiResponse<T>>

export type {ApiResponse, wrappedResponse};