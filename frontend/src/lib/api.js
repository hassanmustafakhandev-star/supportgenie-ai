/**
 * SupportGenie AI - Backend API Service Layer
 * 
 * This module handles all communication between the Next.js frontend
 * and the FastAPI backend. All functions return parsed JSON.
 */
import { auth } from "@/lib/firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Helper: get the Firebase ID token for the currently signed-in user.
 * Must be called client-side only.
 */
async function getAuthToken() {
    // If the synchronous auth object already knows the user, use it directly
    if (auth?.currentUser) {
        return auth.currentUser.getIdToken();
    }

    // Otherwise, wait for the auth state to resolve (important for first page load)
    const { onAuthStateChanged } = await import("firebase/auth");
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Clean up listener immediately
            if (user) {
                user.getIdToken().then(resolve).catch(reject);
            } else {
                reject(new Error("Not authenticated (Firebase user is null)"));
            }
        }, reject);
    });
}

/**
 * Helper: make an authenticated request to the backend.
 * @param {string} path 
 * @param {string} token 
 * @param {object} options 
 */
async function authFetch(path, token, options = {}) {
    if (!token) throw new Error("No authentication token provided");
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type for non-FormData bodies
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail || `Request failed: ${res.status}`);
    }

    return res.json();
}

/**
 * Helper: make a public (unauthenticated) request.
 */
async function publicFetch(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail || `Request failed: ${res.status}`);
    }

    return res.json();
}

// ───────────────────────────────────────────────
// AUTH
// ───────────────────────────────────────────────

/**
 * Verify and sync user after Firebase sign-in.
 * @param {{ name: string, email: string }} userData
 * @param {string} token
 */
export async function verifyAuth(userData, token) {
    return authFetch("/api/auth/verify", token, {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

// ───────────────────────────────────────────────
// BOTS
// ───────────────────────────────────────────────

/** Get all bots for the authenticated user. */
export async function getBots(token) {
    return authFetch("/api/bots/", token);
}

/** Get a specific bot. */
export async function getBot(botId, token) {
    return authFetch(`/api/bots/${botId}`, token);
}

/**
 * Create a new bot.
 * @param {{ name: string, businessName: string, tone: string }} botData
 * @param {string} token
 */
export async function createBot(botData, token) {
    return authFetch("/api/bots/", token, {
        method: "POST",
        body: JSON.stringify(botData),
    });
}

/** Delete a bot by ID. */
export async function deleteBot(botId, token) {
    return authFetch(`/api/bots/${botId}`, token, { method: "DELETE" });
}

/** Get documents for a specific bot. */
export async function getBotDocuments(botId, token) {
    return authFetch(`/api/bots/${botId}/documents`, token);
}

// ───────────────────────────────────────────────
// UPLOAD / TRAINING
// ───────────────────────────────────────────────

/**
 * Upload a PDF file for a bot.
 * @param {string} botId
 * @param {File} file
 * @param {string} token
 */
export async function uploadPDF(botId, file, token) {
    const formData = new FormData();
    formData.append("botId", botId);
    formData.append("file", file);

    return authFetch("/api/upload/pdf", token, {
        method: "POST",
        body: formData,
    });
}

/**
 * Submit a website URL for scraping.
 * @param {string} botId
 * @param {string} url
 * @param {string} token
 */
export async function uploadWebsite(botId, url, token) {
    return authFetch(`/api/upload/website?botId=${encodeURIComponent(botId)}`, token, {
        method: "POST",
        body: JSON.stringify({ url }),
    });
}

/**
 * Submit FAQ text directly.
 * @param {string} botId
 * @param {string} text
 * @param {string} token
 */
export async function uploadFAQ(botId, text, token) {
    return authFetch(`/api/upload/faq?botId=${encodeURIComponent(botId)}`, token, {
        method: "POST",
        body: JSON.stringify({ text }),
    });
}

// ───────────────────────────────────────────────
// CHAT (Public endpoints — no auth needed)
// ───────────────────────────────────────────────

/**
 * Send a chat message to a bot (public endpoint).
 * @param {string} botId
 * @param {string} message
 * @param {string|null} chatId - optional, to continue a conversation
 * @returns {{ answer: string, chatId: string }}
 */
export async function sendChatMessage(botId, message, chatId = null) {
    const headers = {};
    if (chatId) {
        headers["x-chat-id"] = chatId;
    }

    return publicFetch("/api/chat/", {
        method: "POST",
        headers,
        body: JSON.stringify({ botId, message }),
    });
}

/**
 * Get chat history for a specific chat session.
 * @param {string} botId
 * @param {string} chatId
 */
export async function getChatHistory(botId, chatId) {
    return publicFetch(`/api/chat/${botId}/history/${chatId}`);
}

// ───────────────────────────────────────────────
// ANALYTICS (Authenticated)
// ───────────────────────────────────────────────

/**
 * Get analytics/usage data for the current user.
 * @param {string} token
 * @returns {{ userId, month, messageCount, tokenUsage, totalBots }}
 */
export async function getAnalytics(token) {
    return authFetch("/api/analytics/", token);
}
