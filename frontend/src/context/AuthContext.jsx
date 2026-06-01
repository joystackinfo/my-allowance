import { createContext, useReducer, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN': return { user: action.payload };
        case 'LOGOUT': return { user: null };
        default: return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });
    const [loading, setLoading] = useState(true); // blocks UI until auth is checked

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
        }
        setLoading(false); // done checking — now show the app
    }, []);

    if (loading) return null; // wait before rendering anything

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};