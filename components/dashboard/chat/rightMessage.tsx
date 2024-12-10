import React, { forwardRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfile } from '@/app/dashboard/chat/interface'

interface Message {
    created_at: string;
    sender_id: string;
    receiver_id: string;
    message_type: number;
    content: string;
    read: number;
    id: number;
}

const  RightMessage = forwardRef<HTMLDivElement, { message: Message }> (({ message},ref) => {
  return (
    <div className='flex flex-col justify-end items-end mt-3 mb-3 mr-5 ' key={message.id} ref={ref} >
    <div className='flex flex-row max-w-full justify-end mb-3 items-center'>
        <div className='flex flex-col justify-end items-end'>
            {/* <div className='text-black text-xl'>{profile?.nickName}</div> */}
            <div className='text-black text-sm'>{
                new Date(message.created_at).toLocaleString('zh-CN', {
                    month: '2-digit', // 月
                    day: '2-digit',   // 日
                    hour: '2-digit',  // 时
                    minute: '2-digit', // 分
                    hour12: false      // 使用 24 小时制
                })
            }</div>
        </div>
        {/* <Avatar className='ml-2 size-14'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
    </div>
    <div className='bg-slate-400 rounded-xl p-2 break-words flex justify-end '>
        <span className='text-black text-wrap'>{message.content}</span>
    </div>
</div>
  )
})

export default RightMessage