// pages/index.js

import React from 'react';
import { useRouter } from 'next/router';

const Button = ({ title, link }) => {
    const router = useRouter();

    const handleClick = () => {
        if (link) {
            router.push(link);
        }
    };

    return (
        <button className='bg-blue-500 rounded' onClick={handleClick}>
            {title}
        </button>
    );
};

export const Sidebar = () => {
    return (
        <div>
            <div className='flex gap-4'>
                <Button title='Dashboard' link='/userpnlx' />
                <Button title='Policies'  link='/userpnlx/policy'/>
                <Button title='Claims' link='/userpnlx/claim'/>
                <Button title='Profile' link='/userpnlx/profile'/>
            </div>
        </div>
    );
};
