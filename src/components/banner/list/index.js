import React, { Component } from 'react'
import Datatable from '../../common/datatable'
import { NavLink } from 'react-router-dom'
import { get, post, fDelete } from '../../../networking'
import { PAGE_SIZE } from '../../../constants'
import { NotificationManager } from 'react-notifications'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import './style.css'
export default class ListBanner extends Component {

    constructor(props) {
        super(props)

        this.state = {
            banners: []
        }

    }

    getBanner() {
        get('banner', result => {
            this.setState({
                banners: result
            })
        })
    }



    componentDidMount() {
        let param = this.state.request
        this.getBanner();
    }

    handleDeleteBanner(id) {
        let param = { ids: [id] }
        fDelete('banner', param, result => {
            NotificationManager.success("Delete banner Success");
        });
    }

    render() {

        let {
            banners
        } = this.state;

        console.log(banners)
        return (
            <div id="banner_manager">
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Banners</h3>
                        <div className="pull-right">
                            <NavLink to={"/create-banner"} className="btn btn-primary">Create</NavLink>
                            <button className="btn btn-danger" onClick={() => this.delete()}>Delete</button>
                        </div>
                    </div>
                    <div className="box-body">
                        {
                            banners.map((item, i) => <div className="banner_item" key={i}>
                                <div className="item_detail">
                                    <img src="https://cdn.pixabay.com/photo/2013/04/06/11/50/image-editing-101040_1280.jpg" />
                                    <div className="info">
                                        <div className="info_header">
                                            <span>{item.title}</span>
                                            <i className="fa fa-trash" aria-hidden="true" onClick={() => this.handleDeleteBanner(item.id)}></i>
                                        </div>
                                        <div className="info_detail">
                                            <span>{item.description}</span>
                                        </div>
                                        <div className="info_footer">
                                            <span>Link to: <NavLink to={item.link}>{item.link}</NavLink></span>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                    <div className="box-footer">
                    </div>
                </div>
            </div>
        )
    }
}
