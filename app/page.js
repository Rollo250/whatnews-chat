'use client'

import React, {useState,useEffect} from 'react';
import {app,firestore} from "@/lib/firebase";
import {getAuth,onAuthStateChanged} from 'firebase/auth'
import {doc,getDoc} from 'firebase/firestore'
import {useRouter} from 'next/navigation'
import Users from './components/Users';
import Chatrooms from './components/Chatrooms';

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router=useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const userData = ({id: userSnap.id, ...userSnap.data()});
        setUser(userData);
      } else {
        setUser(null);
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }
  , [auth,router]);



  return (
    <div className='flex h-screen'>
      {/* Left section */}
      <div className='flex-shrink-0 w-full md:w-3/12'>
        <Users userData={user}/>
      </div>
  
      {/* Right section */}
      <div className='flex-grow w-full md:w-7/12'>
        <Chatrooms user={user}/>
      </div>
    </div>
  );
}