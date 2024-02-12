import React from 'react'
import MessageCard from './MessageCard'
import MessageInput from './MessageInput'

function Chatrooms({user}) {
  const message = [
    {
      id:1,
      sender:'katty Perry',
      avatarUrl:'https://i.pinimg.com/474x/68/ce/4e/68ce4e1e79f005f123b82895343a1785.jpg',
      content:'hey, how are you?',
      time:'2h ago'
    },
    {
      id:2,
      sender:'douglas',
      avatarUrl:'https://i.pinimg.com/474x/68/ce/4e/68ce4e1e79f005f123b82895343a1785.jpg',
      content:'I´m fine, by chance',
      time:'2h ago'
    }
  ]
  return (
    <div className='flex flex-col h-screen'>
      <div className='flex-1 overflow-y-auto p-10'>
      {/*card del mensaje*/}
      {
        message?.map((message)=>(
          <MessageCard key={message.id} message={message} user={"douglas"}/>
        ))
      }
      </div>
      {/*Input del mensaje */}
      <MessageInput/>
    </div>
  )
}

export default Chatrooms