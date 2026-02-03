'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Favorite } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    favorites: Favorite[];
    login: (userData: User, token: string) => void;
    logout: () => void;
    isFavorite: (type: string, id: string) => boolean;
    toggleFavorite: (type: string, id: string) => Promise<void>;
    refreshFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        const savedToken = localStorage.getItem('sw_token');
        const savedUser = localStorage.getItem('sw_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (token) {
            refreshFavorites();
        } else {
            setFavorites([]);
        }
    }, [token]);

    const login = (userData: User, newToken: string) => {
        setUser(userData);
        console.log(userData);
        setToken(newToken);
        localStorage.setItem('sw_token', newToken);
        localStorage.setItem('sw_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setFavorites([]);
        localStorage.removeItem('sw_token');
        localStorage.removeItem('sw_user');
    };

    const refreshFavorites = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/favorites/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error('Failed to fetch favorites', error);
        }
    };

    const isFavorite = (type: string, id: string) => {
        return favorites.some(f => f.entity_type === type && f.entity_id === id);
    };

    const toggleFavorite = async (type: string, id: string) => {
        if (!token) return;

        const existing = favorites.find(f => f.entity_type === type && f.entity_id === id);

        try {
            if (existing) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/favorites/${existing.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) await refreshFavorites();
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/favorites/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ entity_type: type, entity_id: id })
                });
                if (res.ok) await refreshFavorites();
            }
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, favorites, login, logout, isFavorite, toggleFavorite, refreshFavorites }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
