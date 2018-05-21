import React, { Component } from 'react'

class Header extends Component {
    render() {
        return (
            <header className="main-header">
                <a href="/" className="logo">
                    <span className="logo-mini"><b>S</b>F</span>
                    <span className="logo-lg"><b>Spa</b>Finder</span>
                </a>
                <nav className="navbar navbar-static-top">
                    <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li className="dropdown user user-menu">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png" className="user-image" />
                                    <span className="hidden-xs">{window.localStorage.getItem("username")}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}
export default Header