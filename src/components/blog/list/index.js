import React, { Component } from 'react'
import Datatable from '../../common/datatable'
import { NavLink } from 'react-router-dom'
import { post } from '../../../networking'
import { PAGE_SIZE } from '../../../constants'
import { NotificationManager } from 'react-notifications'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import moment from 'moment';
import $ from 'jquery'
export default class ListBanner extends Component {

    constructor(props) {
        super(props)

        this.state = {
            request: {
                page: 1,
                pageSize: PAGE_SIZE,
                sort: "desc",
                sortBy: "id",
                keyword: "",
                search: ["title"]
            },
            selectedItems: [],
            data: {
                "total": 0,
                "items": []
            },
            isRender: false
        }

    }

    get(param) {
        post('blog/get', param)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(result => {
                            this.setState({
                                data: result
                            })
                        })
                } else {
                    NotificationManager.error("Can't load data")
                }
            })
            .catch(err => {
                NotificationManager.error("Can't connect to server")
            })
    }

    delete() {
        confirmAlert({
            title: 'Delete confirm',
            message: 'Are you sure to delete it(s).',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: () => {
                const ids = this.state.selectedItems
                if (ids.length == 0) {
                    NotificationManager.warning("Please select at lest one item")
                    return
                }
                const param = {
                    ids: ids
                }
                post('blog/delete', param)
                    .then(response => {
                        if (response.status === 200) {
                            NotificationManager.success("Delete success")
                            let param = this.state.request
                            this.get(param)
                        } else {
                            NotificationManager.error("Delete blog fail")
                        }
                    })
                    .catch(err => {
                        NotificationManager.error("Can't connect to server")
                    })
            }
        })
    }

    onChange(datatable) {
        let param = this.state.request

        param.page = datatable.currentPage;
        param.pageSize = datatable.pageSize
        param.keyword = datatable.keyword
        param.sort = datatable.sort
        param.sortBy = datatable.sortBy

        this.get(param)
    }

    onSelectRow(ids) {
        this.setState({
            selectedItems: [...ids]
        })
    }

    componentDidMount() {
        let param = this.state.request
        this.get(param)
    }

    onActiveBlog(newStatus, id) {
        let ids = [];
        ids.push(id);
        let param = {
            "status": newStatus,
            "ids": ids
        }

        let newData = this.state.data;
        newData.items.forEach((item) => {
            if (item.id == id) {
                item.status = newStatus
            }
        })
        post('blog/updateStatus', param)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success("Active blog Success");
                    this.setState({
                        data: newData
                    });
                } else {
                    response.json()
                        .then(result => {
                            NotificationManager.error("Active blog Fail")
                        })
                }
            })
            .catch(err => {
                NotificationManager.error("Can not connect to server")
            })
    }

    render() {
        let {
            total,
            items,
        } = this.state.data

        let {
            page,
            pageSize,
            keyword,
            sort,
            sortBy
        } = this.state.request

        let { selectedItems } = this.state

        let renders = [
            {
                name: "id",
                label: "Id",
                align: "left",
                sorting: true,
            },
            {
                name: "title",
                label: "Title",
                align: "left",
                sorting: true,
                searchable: true
            },
            {
                label: "Status",
                align: "left",
                sorting: false,
                searchable: false,
                render: (value) => (value.status == 2) ? <span className="deactivate" onClick={this.onActiveBlog.bind(this, 1, value.id)}>Deactivate</span> : <span className="activate" onClick={this.onActiveBlog.bind(this, 2, value.id)}>Activate</span>
            },
            {
                name: "publicDate",
                label: "Public Date",
                align: "center",
                sorting: true,
                render: (publicDate) => moment(publicDate).format("MM/DD/YYYY HH:mm")
            },
            {
                name: "id",
                label: "Action",
                align: "left",
                render: (id) => <NavLink to={"/update-blog/" + id}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></NavLink>
            }
        ]

        const datatableOptions = {
            key: "id",
            renders: renders,
            pageSizeList: [10, 20, 50, 100],
            allowViewAll: true,

        }

        const datatableParam = {
            currentPage: page,
            pageSize: pageSize,
            selectedItems: selectedItems,
            keyword: keyword,
            sort: sort,
            sortBy: sortBy
        }

        const dataTableData = {
            total: total,
            rows: items
        }

        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Banners</h3>
                        <div className="pull-right">
                            <NavLink to={"/create-blog"} className="btn btn-primary">Create</NavLink>
                            {
                                (selectedItems.length > 0) ? <button className="btn btn-danger" onClick={() => this.delete()} >Delete</button> : <button className="btn btn-danger" disabled={true} >Delete</button>
                            }
                        </div>
                    </div>
                    <div className="box-body">
                        <Datatable
                            data={dataTableData}
                            param={datatableParam}
                            options={datatableOptions}
                            onChange={this.onChange.bind(this)}
                            onSelectRow={this.onSelectRow.bind(this)}
                        />
                    </div>
                    <div className="box-footer">
                    </div>
                </div>
            </div>
        )
    }
}
