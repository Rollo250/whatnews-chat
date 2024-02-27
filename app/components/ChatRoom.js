import React, { useState, useEffect, useRef } from 'react';
import MessageCard from './MessageCard';
import MessageInput from './MessageInput';
import { addDoc, collection, doc, serverTimestamp, onSnapshot, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import alertSound from './alert.mp3';

function ChatRoom({ user, selectedChatroom }) {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;
  console.log(chatRoomId, 'selected', selectedChatroom);

  const [message, setMessage] = useState('');
  const [images, setImages] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  const audioRef = useRef(null); // Ref para controlar el elemento de audio

  useEffect(() => {
    // Inicializamos el elemento de audio
    audioRef.current = new Audio(alertSound);
  }, []);

  useEffect(() => {
    // Escuchar nuevos mensajes
    if (!chatRoomId) return;
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'messages'), where("chatRoomId", "==", chatRoomId), orderBy('time', 'asc')),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Reproduce el sonido de alerta al recibir un nuevo mensaje
        playAlertSound();
        setMessages(messages);
      }
    );

    return unsubscribe;
  }, [chatRoomId]);

  function playAlertSound() {
    if (audioRef.current) {
      audioRef.current.play();
      console.log(playAlertSound)
    }
  }

  //get messages 
  useEffect(() => {
    if (!chatRoomId) return;
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'messages'), where("chatRoomId", "==", chatRoomId), orderBy('time', 'asc')),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      }
    );

    return unsubscribe;
  }, [chatRoomId]);

  //put messages in db
  const sendMessage = async () => {
    const messagesCollection = collection(firestore, 'messages');
    
    if (message === '' && images === null) {
      return;
    }

    try {
      const newMessage = {
        chatRoomId: chatRoomId,
        sender: me.id,
        content: message,
        time: serverTimestamp(),
        image: images,
      };

      await addDoc(messagesCollection, newMessage);
      setMessage('');
      setImages(null);

      const chatroomRef = doc(firestore, 'chatrooms', chatRoomId);
      await updateDoc(chatroomRef, { lastMessage: message ? message : "Image" });

    } catch (error) {
      console.error('Error sending message:', error.message);
    }

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    
  }

  return (
    <div className="flex flex-col h-screen">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-10">
        {messages?.map((message) => (
          <MessageCard key={message.id} message={message} me={me} other={other} />
        ))}
      </div>

      <MessageInput
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
        images={images}
        setImages={setImages}
      />
    </div>
  );
}

export default ChatRoom;
