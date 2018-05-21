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
import FileDropZone from '../../common/fileDropZone'
import $ from 'jquery'
import { urlFormat, notEmpty, isValid } from '../../common/validations'
import '../style.css'

const validationData = {
    featureName: [notEmpty],
    photo: [notEmpty]
}

export default class Features extends Component {

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
            featureName: "",
            photo: "",
            id: 0,
            isUpdate: false,
        }

    }


    get(param) {
        post("spaOptions/feature/get", param)
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
                post('spaOptions/feature/delete', param)
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

    onFeatureNameChange(value) {
        this.setState({
            featureName: value
        })
    }

    onAddPhoto(file) {
        var data = new FormData()
        data.append("file", file[0])
        postFormData('upload/Banners', data)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(result => {
                            this.setState({
                                photo: result
                            })
                        })
                }
            })
            .catch(err => {
            })
    }
    onRemovePhoto() {
        this.setState({
            photo: ""
        })
    }
    onSaveFeature() {
        let request = this.state.request
        if (this.state.photo === "") {
            $("#feature-for-photo").text("Photo must not empty.");
        }
        if (!isValid(validationData) || this.state.photo === "")
            return
        let param = {
            "name": this.state.featureName,
            "photo": this.state.photo,
        }
        post('spaOptions/feature/create', param)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success("Save success")
                    $(".create-popup").fadeOut();
                    this.get(request)
                    this.setState({
                        featureName: "",
                        photo: ""
                    })
                } else {
                    NotificationManager.error("Save fail")
                }
            })
            .catch(err => {
                NotificationManager.error("Can't connect to server")
            })
    }
    onUpdateFeature() {
        let param = {
            "name": this.state.featureName,
            "photo": this.state.photo,
            "id": this.state.id
        }
        post("spaOptions/feature/update", param)
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

        let { selectedItems, featureName, photo } = this.state

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
                    get("spaOptions/feature/get/" + id)
                        .then((response) => {
                            response.json()
                                .then((result) => {
                                    if (result) {
                                        this.setState({
                                            id: result.id,
                                            photo: result.photo,
                                            featureName: result.name,
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
        let photos = []
        if (photo)
            photos.push(photo)

        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Options / Features</h3>
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
                                        featureName: "",
                                        photo: "",
                                        id: "",
                                        isUpdate: false
                                    })
                                }}></i>
                            </div>
                            <div className="detail">
                                <TextInput
                                    name="featureName"
                                    label="Feature name"
                                    value={featureName}
                                    showPlaceholder={false}
                                    validations={validationData.featureName}
                                    onChange={(value) => this.onFeatureNameChange(value)}
                                />
                                <div className="form-group info">
                                    <label>Photo <span className="text-danger">*</span></label>
                                    <FileDropZone
                                        domainUrl={appSettings.apiDomain}
                                        initFiles={photos}
                                        onAdd={this.onAddPhoto.bind(this)}
                                        onRemove={this.onRemovePhoto.bind(this)} />
                                    <span className={"text-danger"} id={"feature-for-photo"}></span>
                                </div>
                            </div>
                            <div className="footer">
                                <button className="bt_add" onClick={(this.state.isUpdate) ? this.onUpdateFeature.bind(this) : this.onSaveFeature.bind(this)}>Save</button>
                                <button className="bt_cancel" onClick={() => {
                                    $(".create-popup").fadeOut();
                                    this.setState({
                                        featureName: "",
                                        photo: "",
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
