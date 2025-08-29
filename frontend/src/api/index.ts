import ky from "ky";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const api = ky.create({
    prefixUrl: BASE_API_URL,
    retry: 0,
});
