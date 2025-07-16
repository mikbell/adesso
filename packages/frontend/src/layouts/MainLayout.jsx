import React, { Fragment } from 'react'
import Header from "../components/header/Header"
import Footer from "../components/Footer"

const MainLayout = ({ children }) => {
    return (
        <Fragment>
            <Header />
            <main className="p-4 sm:p-6 bg-slate-50">
                <div className='container mx-auto'>
                    {children}
                </div>
            </main>
            <Footer />
        </Fragment>
    )
}

export default MainLayout