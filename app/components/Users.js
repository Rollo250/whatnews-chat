"use client"
import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { firestore, app } from "@/lib/firebase";
import {collection,onSnapshot,query,addDoc,serverTimestamp,where,getDocs} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Users({ userData }) {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const auth = getAuth(app);
  const router = useRouter();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //Tener a todos los usuarios
  useEffect(() => {
    console.log('users11', users)
    setLoading2(true);
    const tastQuery = query(collection(firestore, "users"));

    const unsubscribe = onSnapshot(tastQuery, (querySnapshot) => {
      console.log('docs', querySnapshot)
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(users);
      setLoading2(false);
    });
    console.log('users22', users)
    return unsubscribe;

  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout existoso");
        router.push("/login");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

//lanzar salas de chats para usuarios
useEffect(()=>{
  setLoading2(true);
  if(!userData){
    return;
  }
  const chatroomsQuery = query(collection(firestore,'chatrooms'),where(users,'array-contains',userData.id));

  const unsubscribe = onSnapshot(chatroomsQuery, (querySnapshot) => {
    const chatrooms = querSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserChatrooms(chatrooms);
    setLoading2(false);
  } )

},[])

  const createChat=async(user)=>{
    //checkear su el chatroom existe para estos usuarios
    const existingChatroom = query(collection(firestore,'chatrooms'),where('users','==',[user.id,userData.id]));

    try{
      const existingChatroomSnapshot = await getDocs(existingChatroom);

      if(existingChatroomSnapshot.docs.length > 0){
        toast.error('Chatroom alredy exists');
        return;
      }

      //crear nuevo chatroom, si no hay uno
      const usersData = {
        [userData.id]:userData,
        [user.id]:user,
    }

    const chatroomData = {
      users:[user.id,userData.id],
      usersData,
      timestamp:serverTimestamp(),
      lastMessage:null,
    }

    const chatroomRef= await addDoc(collection(firestore,'chatrooms'),chatroomData);
    console.log('chatroom creado con id', chatroomRef.id);
    setActiveTab("chatrooms")
  }catch(err){
      toast.error(err.message);
    };
  }


  return (
    <div className="shadow-lg h-screen overflow-auto mt-20">
      <div className="flex justify-between p-4">
        <div className="flex">
          <button
            onClick={() => handleTabClick("users")}
            className={`btn btn-outline ${
              activeTab === "users" ? "btn-primary" : ""
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleTabClick("Chatrooms")}
            className={`btn btn-outline ${
              activeTab === "Chatrooms" ? "btn-primary" : ""
            }`}
          >
            Chatrooms
          </button>
          <button onClick={handleLogout} className={`btn btn-outline `}>
            Logout
          </button>
        </div>
      </div>

      <div>
        {activeTab === "Chatrooms" && (
          <>
            <h1 className="px-4 text-base font flex-col semi-bold">
              ChatRooms
            </h1>
            <UserCard
              name="katy Perry"
              avatarUrl="https://i.pinimg.com/474x/68/ce/4e/68ce4e1e79f005f123b82895343a1785.jpg"
              latestMessageText="hey, how are you?"
              time="2hs atras"
              type={"chat"}
            />
            <UserCard
              name="katy Perry"
              avatarUrl="https://i.pinimg.com/474x/68/ce/4e/68ce4e1e79f005f123b82895343a1785.jpg"
              latestMessageText="hey, how are you?"
              time="2hs atras"
              type={"chat"}
            />
          </>
        )}
      </div>

      <div>
        {activeTab === "users" && (
          <>
            <h1 className="mt-4 px-4 text-base font-semibold">Users</h1>
            {
              loading ? <p>Loading... </p> : users.map((user)=>(user.id !== userData?.id && <div key={user.id} onClick={()=>{createChat(user)}}>
                    <UserCard
                      key={user.id}
                      name={user.name}
                      avatarUrl={user.avatarUrl}
                      time="2hs atrás"
                      type={"users"}
                    />
                    </div>
                  )
              )
            }
          </>
        )}
      </div>
    </div>
  );
          }

export default Users;
