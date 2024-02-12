'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {auth} from "@/lib/firebase"
import { signInWithEmailAndPassword } from 'firebase/auth';


function page() {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [errors,setErrors]=useState({})
    const [loading,setLoading]=useState(false)
    const router=useRouter();


    const validateForm=()=>{
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors={};

        if(!email.trim() || !emailRegex.test(email)){
            newErrors.email='Email es invalido!'
        }

        if(password.length<6){
            newErrors.password='El password necesita al menos 6 caracteres'
        }


        setErrors(newErrors)
        return Object.keys(newErrors).length===0;

    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true)
        try{
            if(!validateForm()){
                setLoading(false)
                return;
            } 
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;

            if(user){
              router.push('/')
            }

            setErrors({})

        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }

  return (
    <div className='flex items-center flex-col space-y-2 justify-between border border-gray-200 p-2 overflow-y-auto'>
        {/*form*/}
        <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-2x1 shadow-jg p-10'>
        <h1 className='text-xl text-center font-semibold text-[#0b3a65ff]'>WhatNews<span className='font-bold text-[#eeab63ff]'>Chat</span></h1>

        

        {/*email*/}
        <div className="flex justify-center flex-col">
        <label className='text-base label-text'>Tu correo<span/></label>
        <input type="email"
         placeholder="¿Cuál es tu correo?" 
         className="input input-bordered w-full max-w-xs" 
         value={email}
         onChange={(e)=>setEmail(e.target.value)} />
        {errors.email && <span className='text-sm text-red-500'>{errors.email}</span>}
        </div>
        
        {/*Password*/}
        <div className="flex justify-center flex-col">
        <label className='text-base label-text'>Password<span/></label>
        <input type="password"
         placeholder="Ahora que nadie te ve, pon tu password" 
         className="input input-bordered w-full max-w-xs" 
         value={password}
         onChange={(e)=>setPassword(e.target.value)} />
        {errors.password && <span className='text-sm text-red-500'>{errors.password}</span>}
        </div>


        <div>
            <button type='submit' className='btn btn-block bg-[#0b3a65ff] text-white'>
                {
                    loading ? <span className="loading loading-infinity loading-lg"></span> : 'Ingresar'
                }
            </button>
        </div>
        <span> ¿Aún no tienes cuenta? {''}
            <Link href='/register' className='text-blue-600 hover:text-blue-800 hover:underline'>
                Registrarse
            </Link>
        </span>

        </form>
    </div>
  )
}

export default page