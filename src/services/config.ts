/**
 * AgriConnect Service Configuration
 * 
 * Toggle USE_MOCK to true to run the full application with the in-memory/localStorage mock service layer.
 * Toggle to false when running against the live Express + MongoDB backend.
 */
export const USE_MOCK = true;

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
