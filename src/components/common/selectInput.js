import React, { Component } from 'react'
export default class SelectInput extends Component {

    constructor(props) {
        super(props)
    }

    onChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {

        let {
            name,
            label,
            value,
            options,
        } = this.props
        return (
            <div className={"form-group info"}>
                <label>{label}</label>
                <select value={value} className="selection_group" onChange={(e) => this.onChange(e)}>
                    {
                        options.map((option, i) =>
                            <option value={(option.value) ? option.value : option.id} key={i}>{(option.value) ? option.text : option.name}</option>
                        )
                    }
                </select>
                <span className={"text-danger"} id={"validator-for-" + name}></span>
            </div >
        )
    }
}