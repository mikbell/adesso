import React, { Fragment } from 'react'
import Header from '../components/layout/header/Header'
import Footer from '../components/layout/Footer'

const MainLayout = ({ children }) => {
    return (
        <Fragment>
            <Header />
            <main className="bg-slate-100 py-12">
                {children}
            </main>
            <Footer />
        </Fragment>
    )
}

export default MainLayout