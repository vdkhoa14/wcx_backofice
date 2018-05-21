import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import FileDropZone from '../../common/fileDropZone'
import { urlFormat, notEmpty, isValid } from '../../common/validations'
import TextInput from '../../common/textInput'
import { post, postFormData } from '../../../networking'
import { appSettings } from '../../../constants'
import { NotificationManager } from 'react-notifications'
const validationData = {
    title: [notEmpty],
    link: [urlFormat],
    photo: [notEmpty]
}
export default class CreateBanner extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: "",
            link: "",
            description: "",
            photo: ""
        }
    }

    onAddPhoto(file) {
        var data = new FormData()
        data.append("file", file[0])
        postFormData('upload', data)
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

    create() {

        if (!isValid(validationData))
            return

        let param = { ...this.state }

        post('banner/create', param)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success("Create banner Success")
                    this.setState({
                        title: "",
                        link: "",
                        photo: ""
                    })
                } else {
                    response.json()
                        .then(result => {
                            NotificationManager.error("Create banner fail")
                        })
                }
            })
            .catch(err => {
                NotificationManager.error("Can not connect to server")
            })
    }

    render() {

        let {
            title,
            link,
            description,
            photo
        } = this.state

        let photos = []
        if (photo)
            photos.push(photo)

        return (
            <div className="col-md-6">
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Create banner</h3>
                    </div>
                    <div className="box-body">
                        <TextInput
                            name="photo"
                            value={photo}
                            hidden={true}
                        />
                        <TextInput
                            name="title"
                            label="Title"
                            value={title}
                            validations={validationData.title}
                            onChange={(value) => this.setState({
                                title: value
                            })}
                        />
                        <TextInput
                            name="description"
                            label="Description"
                            value={description}
                            validations={validationData.description}
                            onChange={(value) => this.setState({
                                description: value
                            })}
                        />
                        <TextInput
                            name="link"
                            label="Link"
                            value={link}
                            validations={validationData.link}
                            onChange={(value) => this.setState({
                                link: value
                            })}
                        />
                        <div className="form-group info">
                            <label>Photo <span className="text-danger">*</span></label>
                            <FileDropZone
                                domainUrl={appSettings.apiDomain}
                                initFiles={photos}
                                onAdd={this.onAddPhoto.bind(this)}
                                onRemove={this.onRemovePhoto.bind(this)} />
                            <span className={"text-danger"} id={"validator-for-photo"}></span>
                        </div>
                        <div className="box-footer">
                            <button className="btn btn-primary" onClick={() => this.create()} >Save</button>
                            <button className="btn btn-danger" onClick={() => this.props.history.push("/banner")}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
