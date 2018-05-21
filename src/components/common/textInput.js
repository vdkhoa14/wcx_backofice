import React, { Component } from 'react'
export default class TextInput extends Component {

    constructor(props) {
        super(props)

    }

    onChange(name, label, value) {
        let {
            onChange,
            validations
        } = this.props

        if (validations) {
            let errors = ""
            for (let i = 0; i < validations.length; i++) {
                const validate = validations[i]
                var error = validate(label, value)
                if (error) errors += "\n" + error
            }
            var element = document.getElementById("validator-for-" + name)
            element.innerHTML = errors
        }

        onChange(value)
    }

    render() {

        let {
            name,
            label,
            value,
            hidden
        } = this.props

        return (
            hidden ?
                <input type="text" className="hidden" label={label} id={name} value={value} />
                :
                <div className={"form-group info"}>
                    <label>{label}</label>
                    <input type="text"
                        className="form-control"
                        label={label}
                        id={name}
                        placeholder={(this.props.showPlaceholder) ? label : ""}
                        value={value}
                        onChange={(e) => this.onChange(name, label, e.target.value)} />
                    <span className={"text-danger"} id={"validator-for-" + name}></span>
                </div>
        )
    }
}