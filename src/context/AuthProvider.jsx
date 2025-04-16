import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword,  signOut } from 'firebase/auth';
import  { createContext, useEffect, useState } from 'react';
import app from '../config/firebase.config';

// import analytics from '../config/firebase.config';

export const Authcontext = createContext(null)

const auth = getAuth(app)
const AuthProvider = ({children}) => {
    const [users, setUser] = useState(null)
    const [loading,setLoading] = useState(true)
    
    const createUser = (email,password) =>{
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signIn = (email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    // signIn with google 

    const logout = ()=>{
        setLoading(true)
        return signOut(auth)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            setUser(user)
            setLoading(false)
        })
        return ()=>{
            unsubscribe()
        }
    },[])
    
    

    const authInfo = {
        createUser,
        signIn,
        loading,
        users,
        logout
    }

    return (
        <Authcontext.Provider value = {authInfo}>
            {children}
        </Authcontext.Provider >
    );
};

export default AuthProvider;