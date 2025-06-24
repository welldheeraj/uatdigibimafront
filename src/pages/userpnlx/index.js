
import React from 'react';
import Layout from './component/layout';
import {Sidebar,Claim,Pilicies,Profile} from './component/sidebar';
import Dashboard from './component/dashboard';

const userProfile = () => {
    return (
        <Layout>
            <div >
                <Dashboard/>
            </div>
        </Layout>
    );
};

export default userProfile;