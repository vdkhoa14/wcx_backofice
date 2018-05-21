import React, { Component } from 'react'
import Datatable from '../../common/datatable'
import { NavLink } from 'react-router-dom'
import { PAGE_SIZE } from '../../../constants'
import { NotificationManager } from 'react-notifications'
import { confirmAlert } from 'react-confirm-alert'
import { appSettings } from '../../../constants'
import 'react-confirm-alert/src/react-confirm-alert.css'
import TextInput from '../../common/textInput'
import { post, postFormData, get } from '../../../networking'
import $ from 'jquery'
import { urlFormat, notEmpty, isValid } from '../../common/validations'
import '../style.css'

const validationData = {
    facilityName: [notEmpty]
}

export default class Service extends Component {

    constructor(props) {
        super(props)

        this.state = {
            request: {
                page: 1,
                pageSize: PAGE_SIZE,
                sort: "desc",
                sortBy: "id",
                keyword: "",
                search: ["name"]
            },
            selectedItems: [],
            data: {
                "total": 0,
                "items": []
            },
            facilityName: "",
            id: 0,
            isUpdate: false,
        }

    }


    get(param) {
        post("spaOptions/facility/get", param)
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
                post('spaOptions/facility/delete', param)
                    .then(response => {
                        if (response.status === 200) {
                            NotificationManager.success("Delete success")
                            this.setState({
                                selectedItems: []
                            })
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

    onFacilityNameChange(value) {
        this.setState({
            facilityName: value
        })
    }

    onSaveFacility() {
        let request = this.state.request
        if (!isValid(validationData))
            return
        let param = {
            "name": this.state.facilityName
        }
        post('spaOptions/facility/create', param)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success("Save success")
                    $(".create-popup").fadeOut();
                    this.get(request)
                    this.setState({
                        facilityName: ""
                    })
                } else {
                    NotificationManager.error("Save fail")
                }
            })
            .catch(err => {
                NotificationManager.error("Can't connect to server")
            })
    }
    onUpdateFacility() {
        let param = {
            "name": this.state.facilityName,
            "id": this.state.id
        }
        post("spaOptions/facility/update", param)
            .then((response) => {
                if (response.status === 200) {
                    NotificationManager.success("Update success")
                    let param = this.state.request
                    this.get(param)
                }
                else {
                    NotificationManager.error("Update fail")
                }
            })
            .catch(err => {
                NotificationManager.error("Can't connect to server")
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

        let { selectedItems, facilityName } = this.state

        let renders = [
            {
                name: "id",
                label: "Id",
                align: "left",
                sorting: true,
            },
            {
                name: "name",
                label: "Name",
                align: "left",
                sorting: true,
                searchable: true
            },
            {
                name: "id",
                label: "Action",
                align: "left",
                render: (id) => <NavLink to={"#"} onClick={() => {
                    get("spaOptions/facility/get/" + id)
                        .then((response) => {
                            response.json()
                                .then((result) => {
                                    if (result) {
                                        this.setState({
                                            id: result.id,
                                            facilityName: result.name,
                                            isUpdate: true
                                        })
                                    }
                                })
                        })
                    $(".create-popup").fadeIn();
                }
                }><i className="fa fa-pencil-square-o" aria-hidden="true"></i></NavLink>
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
                        <h3 className="box-title">Options / Facilities</h3>
                        <div className="pull-right">
                            <NavLink to={"#"} className="btn btn-primary" onClick={() => $(".create-popup").fadeIn()}>Create</NavLink>
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
                    <div className="create-popup" style={{ display: "none" }}>
                        <div className="contain">
                            <div className="header">
                                <span>Create new Freature</span>
                                <i className="fa fa-times" aria-hidden="true" onClick={() => {
                                    $(".create-popup").fadeOut();
                                    this.setState({
                                        facilityName: "",
                                        id: "",
                                        isUpdate: false
                                    })
                                }}></i>
                            </div>
                            <div className="detail">
                                <TextInput
                                    name="facilityName"
                                    label="Service name"
                                    value={facilityName}
                                    showPlaceholder={false}
                                    validations={validationData.facilityName}
                                    onChange={(value) => this.onFacilityNameChange(value)}
                                />
                            </div>
                            <div className="footer">
                                <button className="bt_add" onClick={(this.state.isUpdate) ? this.onUpdateFacility.bind(this) : this.onSaveFacility.bind(this)}>Save</button>
                                <button className="bt_cancel" onClick={() => {
                                    $(".create-popup").fadeOut();
                                    this.setState({
                                        facilityName: "",
                                        id: "",
                                        isUpdate: false
                                    })
                                }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
