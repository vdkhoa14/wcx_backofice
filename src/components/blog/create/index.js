import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import FileDropZone from '../../common/fileDropZone'
import { urlFormat, notEmpty, isValid } from '../../common/validations'
import TextInput from '../../common/textInput'
import SelectInput from '../../common/selectInput'
import { post, postFormData, get } from '../../../networking'
import { appSettings } from '../../../constants'
import { NotificationManager } from 'react-notifications'
import { createSlug } from '../../../utils'
import TinyMCE from 'react-tinymce';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CheckBoxes from '../../common/checkboxes'
import './style.css'
import 'react-datepicker/dist/react-datepicker.css';

const validationData = {
    title: [notEmpty],
    photo: [notEmpty]
}
export default class CreateBanner extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: "",
            photo: "",
            slug: "",
            content: "",
            selectArticle: 1,
            categoryId: 1,
            publicDate: moment(),
            synopsis: "",
            status: [2],
            options: {
                articles: [],
                categories: []
            }
        }
    }


    getOptions() {
        get('blog/getOptions')
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

    componentDidMount() {
        this.getOptions()
    }


    onAddPhoto(file) {
        var data = new FormData()
        data.append("file", file[0])
        postFormData('upload/BlogPhotos', data)
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

    createBlog() {

        let valid = true

        const content = this.state.content.replace("<div>", "").replace("</div>", "").replace("\n", "").replace("\t", "");
        if (content.trim() === "") {
            valid = false
            document.getElementById("editor_validation").textContent = "Blog content mush not empty";
        }
        else {
            document.getElementById("editor_validation").textContent = "";
        }

        if (this.state.synopsis.trim() === "") {
            valid = false
            document.getElementById("synopsis_validation").textContent = "Synopsis mush not empty";
        }
        else {
            document.getElementById("synopsis_validation").textContent = "";
        }

        if (!isValid(validationData))
            valid = false

        if (valid) {


            let param = {
                "categoryId": this.state.categoryId,
                "slug": this.state.slug,
                "title": this.state.title,
                "photo": this.state.photo,
                "synopsis": this.state.synopsis,
                "content": this.state.content,
                "publicDate": this.state.publicDate,
                "status": this.state.status[0]
            }

            post('blog/create', param)
                .then(response => {
                    if (response.status === 200) {
                        NotificationManager.success("Create blog Success")
                        this.setState({
                            title: "",
                            photo: "",
                            slug: "",
                            content: "",
                            selectArticle: 1,
                            categoryId: 1,
                            publicDate: moment(),
                            synopsis: "",
                        })
                    } else {
                        response.json()
                            .then(result => {
                                NotificationManager.error("Create blog fail")
                            })
                    }
                })
                .catch(err => {
                    NotificationManager.error("Can not connect to server")
                })
        }
    }
    onTitleChange(value) {
        this.setState({
            title: value,
            slug: createSlug(value)
        })
    }
    onContentChange = (e) => {
        document.getElementById("editor_validation").textContent = "";
        var value = e.target.getContent();
        value = value.replace("<!DOCTYPE html>\n", "").replace("<html>\n", "").replace("<head>\n", "").replace("</head>\n", "").replace("<body>", "<div>").replace("</body>", "</div>").replace("</head>", "").replace("</html>", "").replace("<img", "<img style='max-width:100%' ");
        value = value.replace("<head>", "");
        this.setState({
            content: value
        })
    }

    onArticleChange(value) {
        this.setState({
            selectArticle: value
        })
    }

    onCategoryChange(value) {
        this.setState({
            categoryId: value
        })
    }

    onDateChange(date) {
        this.setState({
            publicDate: date
        })
    }
    onSynopsisChange(e) {
        document.getElementById("synopsis_validation").textContent = "";
        this.setState({
            synopsis: e.target.value
        })
    }

    onSelectActive(id) {
        this.setState({
            status: [2]
        })
    }

    onRemoveActive(id) {
        this.setState({
            status: [1]
        })
    }

    render() {
        let {
            title,
            link,
            photo,
            selectArticle,
            categoryId,
            options,
            synopsis,
            status
        } = this.state

        let photos = [];
        if (photo)
            photos.push(photo);

        return (
            <div className="col-md-6">
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Create Blog</h3>
                    </div>
                    <div className="box-body">
                        <TextInput
                            name="photo"
                            value={photo}
                            hidden={true}
                            label="Photo"
                        />
                        <TextInput
                            name="title"
                            label="Title"
                            value={title}
                            validations={validationData.title}
                            onChange={(value) => this.onTitleChange(value)}
                        />
                        <div className="blog_slug">
                            <span>Slug</span>
                            <i> {this.state.slug}</i>
                        </div>
                        <div className="select_options">
                            <div className={"form-group info"}>
                                <label>Articles</label>
                                <SelectInput
                                    name="articlesOptions"
                                    title="Articles Options"
                                    value={selectArticle}
                                    options={options.articles}
                                    onChange={(value) => this.onArticleChange(value)}
                                />
                            </div>
                            <br />
                            <div className={"form-group info"}>
                                <label>Categories</label>
                                <SelectInput
                                    name="categoriesOptions"
                                    title="Categories Options"
                                    value={categoryId}
                                    options={options.categories.filter(item => item.group == selectArticle)}
                                    onChange={(value) => this.onCategoryChange(value)}
                                />
                            </div>
                            <br />
                            <div className={"form-group info"}>
                                <label>Puplic Date</label>
                                <DatePicker
                                    selected={this.state.publicDate}
                                    onChange={(date) => this.onDateChange(date)}
                                    showTimeSelect
                                    dateFormat="LLL" />
                            </div>
                        </div>
                        <div className="form-group info">
                            <label>Photo <span className="text-danger">*</span></label>
                            <FileDropZone
                                domainUrl={appSettings.apiDomain}
                                initFiles={photos}
                                onAdd={this.onAddPhoto.bind(this)}
                                onRemove={this.onRemovePhoto.bind(this)} />
                            <span className={"text-danger"} id={"validator-for-photo"}></span>
                        </div>
                        <div className="form-group info">
                            <label>Synopsis</label>
                            <textarea value={synopsis} className="synopsis" onChange={(value) => this.onSynopsisChange(value)}></textarea>
                            <p id="synopsis_validation" className="text-danger"></p>
                        </div>
                        <div className={"form-group info"}>
                            <label>Content</label>
                            <TinyMCE
                                className="editor"
                                config={{
                                    height: 300,
                                    plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount tinymcespellchecker a11ychecker imagetools mediaembed  linkchecker contextmenu colorpicker textpattern help',
                                    toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | image',
                                    file_picker_callback: function (cb, value, meta) {
                                        var input = document.createElement('input');
                                        input.setAttribute('type', 'file');
                                        input.setAttribute('accept', 'image/*');
                                        input.onchange = function () {
                                            var file = this.files[0];
                                            var data = new FormData()
                                            data.append("file", file)
                                            postFormData('upload/BlogPhotos', data)
                                                .then(response => {
                                                    if (response.status === 200) {
                                                        response.json()
                                                            .then(result => {
                                                                cb(appSettings.apiDomain + result, { title: file.name });
                                                            })
                                                    }
                                                })

                                        };
                                        input.click();
                                    }
                                }}
                                onChange={this.onContentChange}
                            />
                            <p id="editor_validation" className="text-danger"></p>
                        </div>
                        <div className="box-footer">
                            <button className="btn btn-primary" onClick={() => this.createBlog()} >Save</button>
                            <button className="btn btn-danger" onClick={() => this.props.history.push("/banner")}>Cancel</button>
                            <CheckBoxes
                                className="active-when-create"
                                options={[{ id: 2, name: "Activate immediately after creation." }]}
                                selectOptions={this.state.status}
                                onSelect={this.onSelectActive.bind(this)}
                                onRemove={this.onRemoveActive.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
