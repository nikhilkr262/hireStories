import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Decode user from token or fetch profile
            // For simplicity, just store token and maybe username if available
            const username = localStorage.getItem('username');
            setUser({ username, token });
        }
    }, [token]);

    const login = (data) => {
        // data = { token, username }
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setToken(data.token);
        setUser({ username: data.username, token: data.token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
