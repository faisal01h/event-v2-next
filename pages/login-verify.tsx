import React, { useEffect } from "react"
import {
    addDoc,
    onSnapshot,
    collection,
    query,
    where
} from "firebase/firestore"
import Router from "next/router";
import { useAuth } from "../contexts/AuthContext"
import { firestore } from "../firebase/init";
export default function LoginVerify() {

    let { user } = useAuth();

    function findUserInFirestore( u: any ) {
        if(user != null) {
            const collectionRef = collection(firestore, "users")
            const dataQuery = query(collectionRef, where("uid", "==", user.uid))
            onSnapshot(dataQuery, (e) => {
                e.docs.map((el) => {
                    //user found
                    console.log(el.data())
                    Router.push("/")
                })
                if(e.docs.length === 0) {
                    // User not found in firestore
                    addDoc(collectionRef, {
                        displayName: user?.displayName,
                        email: user?.email,
                        emailVerified: user?.emailVerified,
                        createdAt: user?.metadata.creationTime,
                        lastLoginAt: user?.metadata.lastSignInTime,
                        phoneNumber: user?.phoneNumber,
                        providerId: user?.providerId,
                        providerData: user?.providerData,
                        uid: user?.uid,
                        photoURL: user?.photoURL,
                        eventAttendance: [],
                    })
                    .then((el) => {
                        Router.push("/")
                    })
                    .catch(() => {
                        Router.push("/login")
                    })
                }
            })
        } else return Router.push("/login")
        Router.push("/")
        
    }
    
    useEffect(() => {
        findUserInFirestore(user);
    }, [user])

    return (
        <div>

        </div>
    )
}