'use client';

import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { UserProfile } from '@/app/dashboard/chat/interface';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import LeftMessage from './leftMessage';
import RightMessage from './rightMessage';



interface Message {
    created_at: string;
    sender_id: string;
    receiver_id: string;
    message_type: number;
    content: string;
    read: number;
    id: number;
}



const Chat: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedContact, setSelectedContact] = useState<UserProfile | null>(profile);
    const [content, setContent] = useState<string>('');
    const latestMessageRef = useRef<HTMLDivElement>(null); // 创建一个引用指向最后一条消息


    const supabase = createClient();


    async function fetchMessages() {


        await supabase.rpc('get_chat_history', {
            sender_id_param: profile?.profile_user_id,
            receiver_id_param: profile?.sub_account,
        }).then(({ data, error }) => {
            if (error) {
                console.log(error);
            } else {
                // console.log(data);
                setMessages(data);
            }
        })
    }



    async function sendMessage(type: number) {
        const { data, error } = await supabase.from('message').insert([
            {
                sender_id: profile?.sub_account,
                receiver_id: profile?.profile_user_id,
                content: content,
                message_type: type,
            }
        ]);

        if (error) {
            console.log(error);
        } else {
            fetchMessages();
            // console.log(data);
        }


    }


    // 监听回车键，发送消息
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // 发送消息操作
            sendMessage(0)
            setContent('')
        }
    };


    useEffect(() => {

        fetchMessages();
    }, [selectedContact]);


    useEffect(() => {
        // 每次 messages 更新时，滚动到最后一条消息
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({
                behavior: 'smooth', // 平滑滚动
                block: 'end', // 滚动到元素的底部
            });
        }
    }, [messages]);



    // 订阅supabase的message表，实时更新messages
    useEffect(() => {

        const message = supabase.channel('chat-history-update-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'message' },
                (payload) => {
                    console.log('Change received!', payload)
                    fetchMessages();
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(message); // 取消订阅
        };
    }, []);

    return (
        <div className="flex h-full w-full flex-col">
            <div className="grow overflow-y-auto flex-col  " >

                {messages.map((message) => (
                    message.sender_id === profile?.profile_user_id
                        ?
                        <LeftMessage key={message.id} ref={messages.length - 1 === messages.indexOf(message) ? latestMessageRef : null} message={message} profile={profile} />
                        :
                        <RightMessage key={message.id} ref={messages.length - 1 === messages.indexOf(message) ? latestMessageRef : null} message={message} />
                ))}

            </div>

            <div className="   bottom-0 flex flex-row w-full ">
                <div className='w-full h-16'>
                    <input
                        type='text'
                        className='w-full h-full p-2 border rounded'
                        placeholder='输入聊天消息。。。可以直接回车'
                        value={content}

                        onChange={(e) => {
                            setContent(e.target.value)
                        }}

                        onKeyDown={handleKeyDown}
                    />
                </div>
                <button className=' bg-gray-400 w-32 h-16 rounded-xl ml-2' onClick={() => {
                    sendMessage(0)
                    setContent('')
                }}>发送</button>
            </div>
        </div>
    );
}

export default Chat;