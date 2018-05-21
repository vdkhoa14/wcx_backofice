import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './style.css'
class LeftNavigation extends Component {
    render() {
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <div className="user-panel">
                        <div className="pull-left image">
                            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png" className="img-circle" alt="User Image" />
                        </div>
                        <div className="pull-left info">
                            <p>{window.localStorage.getItem("username")}</p>
                            <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                        </div>
                    </div>
                    <ul className="sidebar-menu" data-widget="tree">
                        <li className="header">NAVIGATION</li>
                        <li className="treeview">
                            <a href="javascript:void(0)">
                                <i className="fa fa-cogs"></i>
                                <span>Web Settings</span>
                            </a>
                            <ul className="treeview-menu">
                                <li><NavLink to="/banner"><i className="fa fa-picture-o"></i> Banner </NavLink></li>
                                <li><NavLink to="/about-us"><i className="fa fa-address-card"></i> About us </NavLink></li>
                                <li><NavLink to="/help"><i className="fa fa-medkit"></i> Help </NavLink></li>
                                <li><NavLink to="/terms-and-conditions"><i className="fa fa-gavel"></i> Terms And Conditions </NavLink></li>
                                <li><NavLink to="/faqs"><i className="fa fa-leanpub"></i> FAQs </NavLink></li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="javascript:void(0)">
                                <i className="fa fa-newspaper-o" aria-hidden="true"></i>
                                <span>Blogs</span>
                            </a>
                            <ul className="treeview-menu">
                                <li><NavLink to="/create-blog"><i className="fa fa-file-o" aria-hidden="true"></i> Create </NavLink></li>
                                <li><NavLink to="/blogs"><i className="fa fa-list-alt" aria-hidden="true"></i> List </NavLink></li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="javascript:void(0)">
                                <i className="fa fa-filter" aria-hidden="true"></i>
                                <span>Options</span>
                            </a>
                            <ul className="treeview-menu">
                                <li><NavLink to="/options/categories"><i className="fa fa-tags" aria-hidden="true"></i> Categories </NavLink></li>
                                <li><NavLink to="/options/features"><i className="fa fa-tachometer" aria-hidden="true"></i> Features </NavLink></li>
                                {/* <li><NavLink to="/options/services"><i className="fa fa-cog" aria-hidden="true"></i> Services </NavLink></li> */}
                                <li><NavLink to="/options/facilities"><i className="fa fa-building-o" aria-hidden="true"></i> Facilities </NavLink></li>
                                <li><NavLink to="/options/amenities"><i className="fa fa-braille" aria-hidden="true"></i> Amenities </NavLink></li>
                                <li><NavLink to="/options/foodoptions"><i className="fa fa-wrench" aria-hidden="true"></i> FoodOptions </NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </section>
            </aside >
        )
    }
}
export default LeftNavigation