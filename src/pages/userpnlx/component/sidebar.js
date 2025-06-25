// pages/index.js

import React from 'react';
import { useRouter } from 'next/router';
import constant from '@/env';
const Button = ({ title, link }) => {
    const router = useRouter();
    return (
        <button className='bg-blue-500 rounded' onClick={()=>router.push(link)}>
            {title}
        </button>
    );
};
export const Sidebar = () => {
    return (
        <div>
            <div className='flex gap-4'>
                <Button title='Dashboard' link= {constant.ROUTES.USER.INDEX} />
                <Button title='Policies'  link={constant.ROUTES.USER.POLICY}/>
                <Button title='Claims' link={constant.ROUTES.USER.CLAIM}/>
                <Button title='Profile' link={constant.ROUTES.USER.PROFILE}/>
            </div>
        </div>
    );
};
