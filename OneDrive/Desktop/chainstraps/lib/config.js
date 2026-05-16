// lib/config.js

// Using Next.js rewrites for client-side fetches to avoid Mixed Content errors.
// Server-side components can hit the IP directly.
export const API_BASE = typeof window === "undefined"
  ? "http://137.184.102.82:5000/api"
  : "/backend-api";
