import React, { useEffect } from "react"
import Head from "next/head"
import { useAuth } from "../contexts/AuthContext"

export default function Login() {

    const { user, login, logout } = useAuth();

    useEffect(() => {
        if(user === null) {
            window.location.href="/login"
        } else {
            setTimeout(() => {logout();}, 5000)
        }
    }, [new Date()])

    return (
        <div className="bg-gray-200">
            <Head>
                <title>Logout dari Pecundang</title>
            </Head>
            
            <div className="flex flex-col items-center justify-center space-y-3 h-screen text-center px-8">
                <h1 className="text-5xl my-5 font-bold">Logging you out...</h1>
                <div>If you are not being redirected, please click the button below.</div>
                <button onClick={_e=>{logout(); window.location.href="/"}} className="px-3 py-1 acrylic shadow hover:shadow-xl">Logout</button>
            </div>
            
        </div>
    )
}