import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import Header from './header'
import Footer from './footer'
import LeftNavigation from './leftNavigation'
import { NotificationContainer } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
class Main extends Component {

    render() {

        return (
            <BrowserRouter>
                <div className="wrapper">
                    <Header />
                    <LeftNavigation />
                    <div className="content-wrapper">
                        <Router />
                    </div>
                    <Footer />
                    <NotificationContainer />
                </div>
            </BrowserRouter>
        )
    }
}

export default Main