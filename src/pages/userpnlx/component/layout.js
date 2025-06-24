// components/Layout.js

import React from 'react';
import { Sidebar } from './sidebar';

const Layout = ({ children }) => {
    return (
        <div >
            <Sidebar/>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
