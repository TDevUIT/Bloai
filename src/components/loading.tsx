import React from 'react'

const Loading = () => {
  return (
    <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center flex-col gap-4 animate-fade-in'>
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-[#2B463C] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-[#2B463C] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-[#2B463C] rounded-full animate-bounce"></div>
      </div>
      <h1 className='font-bold text-4xl text-[#2B463C] animate-pulse-slow'>
        Bloai
      </h1>
      <p className='text-[#2B463C]/80 mt-2 font-medium animate-fade-in-up'>
        Loading Inspiration...
      </p>
    </div>
  )
}

export default Loading