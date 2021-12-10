import React from "react";
import { User, getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import app from "../firebase/init";

interface IAuth {
    user: User | null,
    login: () => void,
    logout: () => void,
}

const auth = getAuth(app)

const AuthContext = React.createContext<IAuth>({
    user: null,
    login: () => {},
    logout: () => {}
});

function AuthProvider(props: { children: any }) {

    const [ user, setUser ] = React.useState<User | null>(null);

    React.useEffect(() => {
        const Unsub = onAuthStateChanged(auth, (user)=> {
            if(user) {
                setUser(user)
            } else setUser(null);
        })

        return Unsub;
    }, [])
    
    const login = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        }
        catch(error) {
            console.error(error)
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <AuthContext.Provider  value={{
            user, login, logout
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    return React.useContext(AuthContext);
}

export { AuthProvider, useAuth }