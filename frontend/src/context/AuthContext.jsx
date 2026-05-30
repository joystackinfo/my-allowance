import { createContext, useReducer, useEffect } from 'react';

//create context
export const AuthContext = createContext();

//Reducer handles login and logout actions for authentication state
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
        return{ user: action.payload }; // Set user data on login
    case 'LOGOUT':
        return { user: null}; // Clear user data on logout
    default:
        return state; // Don't change state for unrecognized actions
  }
}; 

//AuthContextProvider component provides authentication state and dispatch function to its children
export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
         user: null 

    }); // Initialize state with user as null
    
    //check localstorage when app first loads
    useEffect (() => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const user = localStorage.getItem('user'); // Get user data from localStorage

        if(token && user) {
            dispatch({
                type: 'LOGIN',
                payload: JSON.parse(user) // Parse user data and dispatch login action
            })
        }
        
    }, []); 

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children} {/* Render child components */}
        </AuthContext.Provider>
    )
    }
    