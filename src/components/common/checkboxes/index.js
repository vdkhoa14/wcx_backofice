import React, { Component } from 'react'
import $ from 'jquery'

const validationData = {
}

export default class GeneralSetting extends Component {

    isCheckedOption(id) {
        if (this.props.selectOptions.find((exitedID) => { return exitedID === id }))
            return true
        return false
    }

    render() {
        let {
            options,
            selectOptions
        } = this.props
        return (
            <div className={this.props.className + " option-select"}>
                <div className="option-select-header">
                </div>
                <div className="option-select-detail">
                    {
                        options.map((item, i) =>
                            <div className="option-item" key={i}>
                                {
                                    (!this.isCheckedOption(item.id)) ?
                                        <i className="fa fa-square-o" aria-hidden="true" onClick={() => this.props.onSelect(item.id)}></i>
                                        : <i className="fa fa-check-square-o" aria-hidden="true" onClick={() => this.props.onRemove(item.id)}></i>
                                }
                                <span>{item.name}</span>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}