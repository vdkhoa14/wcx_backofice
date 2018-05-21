import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import FileDropZone from '../../common/fileDropZone'
import { get, post, postFormData } from '../../../networking'
import { appSettings } from '../../../constants'
import { NotificationManager } from 'react-notifications';
import { urlFormat, notEmpty, isValid } from '../../common/validations'
import TextInput from '../../common/textInput'
const validationData = {
    title: [notEmpty],
    link: [urlFormat],
    photo: [notEmpty]
}
export default class BannerDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: 0,
            title: "",
            link: "",
            photo: ""
        }
    }

    get(id) {
        get('banner/get/' + id)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(result => {
                            this.setState({
                                ...result
                            })
                        })
                }
            })
            .catch(err => {
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
                } else {
                }
            })
            .catch(err => {
            })
    }

    onRemovePhoto(relativePath) {
        this.setState({
            photo: ""
        })
    }

    update() {

        if (!isValid(validationData))
            return

        let param = { ...this.state }

        post('banner/update', param)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(result => {
                            NotificationManager.success("Update banner Success");
                        })
                } else {
                    response.json()
                        .then(result => {
                            NotificationManager.error("Update banner fail")
                        })
                }
            })
            .catch(err => {
                NotificationManager.error("Can not connect to server")
            })
    }

    componentDidMount() {
        const id = this.props.match.params.id
        this.get(id)
    }

    render() {
        let {
            id,
            title,
            link,
            photo
        } = this.state

        if (!title)
            title = ""
        if (!link)
            link = ""
        let photos = []
        if (photo)
            photos.push(photo)

        return (
            <div className="col-md-6">
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Update banner</h3>
                    </div>
                    <div className="box-body">
                        <TextInput
                            hidden={true}
                            name="photo"
                            label="Photo"
                            value={photo}
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
                            <button type="submit" className="btn btn-primary" onClick={() => this.update()} >Save</button>
                            <button type="submit" className="btn btn-danger" onClick={() => this.props.history.push("/banner")}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
