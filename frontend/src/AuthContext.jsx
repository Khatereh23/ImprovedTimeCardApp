import { createContext, useEffect, useState, useContext } from "react";
import {supabase} from "./supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);

    //Sign up
    const signUpNewUser = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
      
        if (error) {
          console.error("Error signing up:", error);
          return { success: false, error };
        }
        return { success: true, data };
      };        

    //Sign in
    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            }); 
            if (error) {
                console.error("Error signing in:", error);
                return { success: false, error };
            }
            console.log("Sign-in Success:", data);
            return { success: true, data };
        } catch (error) {
            console.error("Error occurs:", error);
        }
    }
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });
    }   , []);
    
    //Sign Out
    const signOut = () => {
        const {error} = supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
        }
    }    
    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export const userAuth = () => {
    return useContext(AuthContext);
}