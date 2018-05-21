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
import SelectInput from '../../common/selectInput'
import '../style.css'

const validationData = {
    serviceName: [notEmpty]
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
            serviceName: "",
            id: 0,
            isUpdate: false,
            selectArticle: 1,
            categoryId: 1,
            options: [],
            description: ""
        }

    }


    get(param) {
        post("spaOptions/service/get", param)
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
                post('spaOptions/service/delete', param)
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
        this.getOptions()
    }

    onServiceNameChange(value) {
        this.setState({
            serviceName: value
        })
    }

    onSaveService() {
        let request = this.state.request
        if (!isValid(validationData))
            return
        let param = {
            "name": this.state.serviceName,
            "description": this.state.description,
            "categoryId": this.state.categoryId
        }
        post('spaOptions/service/create', param)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success("Save success")
                    $(".create-popup").fadeOut();
                    this.get(request)
                    this.setState({
                        serviceName: ""
                    })
                } else {
                    NotificationManager.error("Save fail")
                }
            })
            .catch(err => {
                NotificationManager.error("Can't connect to server")
            })
    }
    onUpdateService() {
        let param = {
            "name": this.state.serviceName,
            "description": this.state.description,
            "categoryId": this.state.categoryId,
            "id": this.state.id
        }
        post("spaOptions/service/update", param)
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

    onCategoryChange(value) {
        this.setState({
            categoryId: value
        })
    }

    getOptions() {
        get('spaOptions/serviceCategory/get')
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(result => {
                            this.setState({
                                options: result
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

    onDescriptionChange(e) {
        document.getElementById("description_validation").textContent = "";
        this.setState({
            description: e.target.value
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

        let { selectedItems, serviceName, selectArticle, categoryId, options, description } = this.state

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
                    get("spaOptions/service/get/" + id)
                        .then((response) => {
                            response.json()
                                .then((result) => {
                                    if (result) {
                                        this.setState({
                                            id: result.id,
                                            description: result.description,
                                            serviceName: result.name,
                                            categoryId: result.categoryId,
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
                        <h3 className="box-title">Options / Services</h3>
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
                                        serviceName: "",
                                        id: "",
                                        isUpdate: false,
                                        categoryId: 0
                                    })
                                }}></i>
                            </div>
                            <div className="detail">
                                <div className={"form-group info"}>
                                    <label>Categories</label>
                                    <SelectInput
                                        name="categoriesOptions"
                                        title="Categories Options"
                                        value={categoryId}
                                        options={options}
                                        onChange={(value) => this.onCategoryChange(value)}
                                    />
                                </div>
                                <TextInput
                                    name="serviceName"
                                    label="Service name"
                                    value={serviceName}
                                    showPlaceholder={false}
                                    validations={validationData.serviceName}
                                    onChange={(value) => this.onServiceNameChange(value)}
                                />
                                <div className="form-group info">
                                    <label>Description</label>
                                    <textarea value={description} className="description" onChange={(value) => this.onDescriptionChange(value)}></textarea>
                                    <p id="description_validation" className="text-danger"></p>
                                </div>
                            </div>
                            <div className="footer">
                                <button className="bt_add" onClick={(this.state.isUpdate) ? this.onUpdateService.bind(this) : this.onSaveService.bind(this)}>Save</button>
                                <button className="bt_cancel" onClick={() => {
                                    $(".create-popup").fadeOut();
                                    this.setState({
                                        serviceName: "",
                                        id: "",
                                        isUpdate: false,
                                        categoryId: 0
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
