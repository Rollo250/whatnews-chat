import React from 'react'

function MessageCard({message,user}) {
  const isMessageFromMe = message.sender === user;
  return (
    <div key={message.id} className={`flex mb-4 ${isMessageFromMe?'justify-end':'justify-start'}`}>
    {/*avatar a la izquierda*/}
    <div className={`w-10 h-10 ${isMessageFromMe ? 'ml-2 mr-2' : 'mr-2'}`}>
        <img
        src={message.avatarUrl}
        alt="avatar"
        className='w-full h-full rounded-full object-cover'
        />
        {/*burbuja de mensaje a la derecha o a la izquierda depende del usuario*/}
        <div className={` text-white p-2 w-60 rounded-full ${isMessageFromMe ? 'bg-blue-500 self-end' : 'bg-[#19D39E] self-start'} inline-block`}>
        {
          message.image && <img src={message.image} className='max-h-60 w-60 mb-4' />
        }
        <p>{message.content}</p>
        <div className='text-xs text-gray-300'>{message.time}</div>
        </div>
    </div >
    </div>
  )
}

export default MessageCard