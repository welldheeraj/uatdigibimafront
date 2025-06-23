// pages/index.js

import React from 'react';
export function Button(props)
{
    return (
        <>
        <button className='bg-blue-500 rounded'>{props.title}</button>
        </>
    )
}
export const Sidebar = () => {
    return (
        <div >
            <div className='flex gap-4'>
                <Button title='Dashboard' link=""/>
                <Button title='Policies'/>
                <Button title='Claims'/>
                <Button title='Profile'/>
            </div>
        </div>
    );
};

export const Pilicies = () => {
    return (
        <div >
            <p>Policies component</p>
        </div>
    );
};

export const Claim = () => {
    return (
        <div >
            <p>Claim</p>
        </div>
    );
};
export const Profile = () => {
    return (
        <div >
            <p class="w-50% border">Personal Details</p>
            

        </div>
    );
};


