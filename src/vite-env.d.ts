/// <reference types="vite/client" />

// No custom VITE_* variables — the frontend talks only to /api, which reads
// its own server-only secrets (MONGODB_URI, JWT_SECRET, CLOUDINARY_*)
// directly via process.env, never through import.meta.env.
