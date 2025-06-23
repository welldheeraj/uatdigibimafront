
import React from 'react';
import Layout from './component/layout';
import {Sidebar,Claim,Pilicies,Profile} from './component/profile';
import Dashboard from './component/dashboard';

const userProfile = () => {
    return (
        <Layout>
            <div >
                <Claim/>
                <Pilicies/>
                <Profile/>
                <Dashboard/>
            </div>
        </Layout>
    );
};

export default userProfile;