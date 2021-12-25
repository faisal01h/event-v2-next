import React, { useEffect } from "react"
import Head from "next/head"
import { useAuth } from "../contexts/AuthContext"
import Link from "next/link";
import Router from "next/router";
import { BsChevronLeft, BsGoogle } from "react-icons/bs";

export default function Login() {

    const { user, login, logout } = useAuth();

    useEffect(() => {
        if(user !== null) {
            Router.push("/login-verify")
        }
    }, [user])

    return (
        <div className="bg-gray-200">
            <Head>
                <title>Login ke Pecundang</title>
            </Head>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-200 px-8 text-center">
                <h1 className="text-5xl font-bold">Login ke Pecundang</h1>
                <div className="my-5">
                {
                    user === null ?
                    <button onClick={(_e)=>{login()}} className="px-3 py-1 shadow rounded-lg acrylic flex items-center hover:shadow-xl">
                        <BsGoogle className="mr-2" /> Login with Google
                    </button> : false
                }
                </div>
                <div className="px-3 py-1 rounded-lg text-sm">
                    <Link href="/"><div className="flex items-center cursor-pointer"><BsChevronLeft className="mr-2" /> Kembali ke Pecundang </div></Link>
                </div>
            </div>
            {user!==null?<div>Selamat datang, {user?.displayName}!</div>:false}
            
        </div>
    )
}