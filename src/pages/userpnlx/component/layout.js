// components/Layout.js

import React from 'react';
import { Sidebar } from './profile';

const Layout = ({ children }) => {
    return (
        <div >
            <Sidebar/>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
