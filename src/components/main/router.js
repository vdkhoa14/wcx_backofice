import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Dashboard from '../dashboard'
import ListBanners from '../banner/list'
import CreateBanner from '../banner/create'
import UpdateBanner from '../banner/update'
import ListBlogs from '../blog/list'
import CreateBlog from '../blog/create'
import UpdateBlog from '../blog/update'
import Categories from '../options/categories';
import Facilities from '../options/facilities';
import Features from '../options/features';
import Services from '../options/services';
import Amenity from '../options/amenities';
class Router extends Component {
    render() {
        return (
            <section className="content">
                <Route exact path="/banner" component={ListBanners} />
                <Route exact path="/create-banner" component={CreateBanner} />
                <Route exact path="/update-banner/:id" component={UpdateBanner} />
                <Route exact path="/blogs" component={ListBlogs} />
                <Route exact path="/create-blog" component={CreateBlog} />
                <Route exact path="/update-blog/:id" component={UpdateBlog} />
                <Route exact path="/options/categories" component={Categories} />
                <Route exact path="/options/facilities" component={Facilities} />
                <Route exact path="/options/features" component={Features} />
                <Route exact path="/options/services" component={Services} />
                <Route exact path="/options/amenities" component={Amenity} />
                <Route exact path="/" component={Dashboard} />
            </section>
        )
    }
}
export default Router