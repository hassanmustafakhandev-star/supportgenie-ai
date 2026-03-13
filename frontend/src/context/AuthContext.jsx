"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
    user: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = () => { };
        
        // Dynamically import only what's needed for initialization
        const initAuth = async () => {
            try {
                const { auth } = await import("@/lib/firebase");
                const { onAuthStateChanged } = await import("firebase/auth");
                const { verifyAuth } = await import("@/lib/api");

                unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                    if (currentUser) {
                        try {
                            const token = await currentUser.getIdToken();
                            // Sync user to backend with token
                            await verifyAuth({
                                name: currentUser.displayName || "User",
                                email: currentUser.email
                            }, token);
                        } catch (error) {
                            console.error("Failed to verify user with backend:", error);
                        }
                    }
                    setUser(currentUser);
                    setLoading(false);
                });
            } catch (err) {
                console.error("Auth initialization error:", err);
                setLoading(false);
            }
        };

        initAuth();
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        const { auth } = await import("@/lib/firebase");
        const { signOut } = await import("firebase/auth");
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
