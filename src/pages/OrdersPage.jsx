import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { OrdersList } from '../components/OrdersPageComponents';

const OrdersPage = () => {
    return (
        <div className="page-wrapper">
            <Navbar />
            <main className="main-content">
                <OrdersList />
            </main>
            <Footer />
        </div>
    );
};

export default OrdersPage;
