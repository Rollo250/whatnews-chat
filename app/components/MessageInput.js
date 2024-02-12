import React from 'react';
import { AttachFile,Send } from '@mui/icons-material';

function MessageInput() {
  return (
    <div className='flex items p-4 border-t border-grey-200' >
      {/*adjuntar archivo */}
      <AttachFile className='text-gray-500 mr-2 cursor-pointer' />

      {/*input*/}
      <input type='text' placeholder='Mensaje' className='flex-1 border-none p-2 outline-none' />

      {/*enviar mensaje*/}
      <Send className='text-gray-500 ml-2 cursor-pointer' />
    </div>
  )
}

export default MessageInput