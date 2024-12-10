'use client';

import React, { use, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import "./interface"
import { UserProfile } from './interface';
import Chat from '@/components/dashboard/chat/chat';
import { Skeleton } from "@/components/ui/skeleton"



function ChatPage() {

  const [selectedContact, setSelectedContact] = useState<UserProfile | null>(null);
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);


  const supabase = createClient();

  async function fetchContacts() {

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase.rpc('get_administrator_sub_account', { admin_id: user?.id });
    if (error) {
      console.error('Error fetching contacts:', error.message);
    } else {
      await setContacts(data);
    }
  }


  async function fetchMyProfile(contact: UserProfile) {
    const { data, error } = await supabase.from('profile').select('*').eq('user_id', contact?.sub_account);
    if (error) {
      console.error('Error fetching my profile:', contact?.profile_user_id);
    } else {
      setMyProfile(data[0]);
      console.log('我的资料是：：', data[0]);
    }
  }



  useEffect(() => {
    fetchContacts();

  }, []);

  return (
    <div className='flex h-screen flex-row'>
      {/* Contact List */}
      <div className='flex h-full flex-col w-1/4 p-4 border-r  overflow-y-auto'>
        {contacts.map(contact => (
          <div
            key={contact.profile_user_id}
            className={`flex items-center p-2 cursor-pointer ${selectedContact?.profile_user_id === contact.profile_user_id ? 'bg-gray-200' : ''}`}
            onClick={() => {
              setSelectedContact(contact);

              fetchMyProfile(contact);

            }}
          >
            <img src={contact.photos[0] || undefined} alt={contact.nickname} className='w-10 h-10 rounded-full mr-2' />
            <div className=' ml-2'>{contact.nickname}</div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className='flex h-full flex-col w-1/2 p-4'>
        {/* <div className='flex-grow overflow-y-auto'> */}

        {selectedContact && <Chat key={selectedContact?.profile_user_id} profile={selectedContact} />}






        {/* </div> */}

      </div>

      {/* Contact Details */}
      <div className='flex h-full flex-col w-1/4  border-l justify-start items-center mt-9  '>


        {selectedContact &&
          <>
            <h6 className=' mb-5 text-xl font-bold'>客户资料</h6>
            <img src={selectedContact?.photos[0] || undefined} alt={selectedContact?.nickname} className='w-80 h-80 rounded-full mb-4' />
            <div className=' mt-3'><strong>Name:</strong> {selectedContact?.nickname}</div>
            <div className=' mt-3'><strong>Gender:</strong> {selectedContact?.sex === 0 ? "女的" : "男的"}</div>
            <div className=' mt-3'><strong>Age:</strong> {selectedContact?.age}</div>
            <div className=' mt-3'><strong>City:</strong> {selectedContact?.city}</div>
          </>
        }


        {selectedContact &&
          <>
            <h6 className=' mb-5 text-xl font-bold mt-6'>我使用的账号</h6>
            <img src={myProfile?.photos[0] || undefined} alt={myProfile?.nickname} className='w-80 h-80 rounded-full mb-4' />
            <div className=' mt-3'><strong>Name:</strong> {myProfile?.nickname}</div>
            <div className=' mt-3'><strong>Gender:</strong> {myProfile?.sex === 0 ? "女的" : "男的"}</div>
            <div className=' mt-3'><strong>Age:</strong> {myProfile?.age}</div>
            <div className=' mt-3'><strong>City:</strong> {myProfile?.city}</div>
          </>
        }


      </div>
    </div>
  );
}

export default ChatPage;