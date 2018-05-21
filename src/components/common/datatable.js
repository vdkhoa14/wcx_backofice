import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from './pagination/index'
import { NavLink } from 'react-router-dom'
export default class Datatable extends Component {

    constructor(props) {
        super(props)

    }

    handleSelect(id) {

        let {
            selectedItems
        } = this.props.param

        let {
            rows,
        } = this.props.data

        const { onSelectRow } = this.props

        if (!selectedItems)
            selectedItems = []

        if (id) {
            if (selectedItems.indexOf(id) >= 0) {
                selectedItems.splice(selectedItems.indexOf(id), 1);
            }
            else
                selectedItems.push(id)
        } else {
            var selectAll = rows.length == selectedItems.length
            if (!selectAll) {
                selectedItems = []
                for (let i = 0; i < rows.length; i++)
                    selectedItems.push(rows[i]["id"])
            } else {
                selectedItems = []

            }

        }

        onSelectRow(selectedItems)
    }

    handlePageChange(currentPage) {
        this.handleChange("currentPage", currentPage)
    }

    handleSearch(keyword) {
        this.handleChange("keyword", keyword)
    }

    handlePageSizeChange(pageSize) {
        this.handleChange("pageSize", pageSize)
    }

    handleSortChange(sortBy, sort) {
        let param = this.props.param

        param.sortBy = sortBy
        param.sort = sort

        let { renders } = this.props.options
        param.search = []
        for (let i = 0; i < renders.length; i++) {
            if (renders[i].searchable) {
                param.search.push(renders[i].name)
            }
        }

        this.props.onChange(param)
    }

    handleChange(key, value) {
        let param = this.props.param

        param[key] = value

        let { renders } = this.props.options
        param.search = []
        for (let i = 0; i < renders.length; i++) {
            if (renders[i].searchable) {
                param.search.push(renders[i].nam)
            }
        }
        this.props.onChange(param)
    }

    render() {

        let {
            pageSize,
            currentPage,
            selectedItems,
            sort,
            sortBy
        } = this.props.param

        let {
            total,
            rows
        } = this.props.data
        let {
            key,
            renders,
            pageSizeList,
            allowViewAll
        } = this.props.options

        let allowSearch = false

        for (let i = 0; i < renders.length; i++) {
            if (renders[i].searchable) {
                allowSearch = true
                break
            }
        }

        //Init param
        if (!pageSizeList) {
            pageSizeList = [10, 20, 50, 100]
        }
        //End Init param

        var selectAll = selectedItems && rows && rows.length == selectedItems.length

        let empty = []
        if (rows)
            for (let i = rows.length; i < pageSize; i++)
                empty.push(i)

        return (
            <div className="datatable-container">
                <div className="datatable_header">
                    <div className="header_col">
                        <div className="page_size">
                            <span>Records: </span>
                            <select onChange={(e) => this.handlePageSizeChange(e.target.value)} value={pageSize}>
                                {pageSizeList.map((value, i) =>
                                    <option value={value} key={i}>{value}</option>
                                )}
                                {allowViewAll && <option value={total}>{"All"}</option>}
                            </select>
                        </div>
                    </div>
                    <div className="header_col header_search">
                        <div className="search">
                            {
                                allowSearch &&
                                <input type="text" onChange={(e) => this.handleSearch(e.target.value)} />
                            }
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <table>
                    < tbody >
                        <tr>
                            {total > 0 ?
                                (selectAll &&
                                    <th className="check-column"><i className="fa fa-check-square-o" aria-hidden="true" onClick={() => this.handleSelect()}></i></th>
                                    ||
                                    <th className="check-column"><i className="fa fa-square-o" aria-hidden="true" onClick={() => this.handleSelect()}></i></th>)
                                :
                                <th className="check-column"></th>
                            }
                            {renders.map((item, i) =>
                                <th key={i} className={(item.sorting) ? "allow_sort" : ""} style={{ textAlign: item.align, minWidth: (item.sorting ? 60 : 0) + item.label.length * 5 + "px" }}>
                                    {item.label}
                                    {item.sorting &&
                                        (sortBy == item.name ?
                                            sort == "asc" ?
                                                <i className="fa fa-sort-amount-asc" aria-hidden="true" onClick={() => this.handleSortChange(item.name, "desc")}></i>
                                                :
                                                <i className="fa fa-sort-amount-desc" aria-hidden="true" onClick={() => this.handleSortChange(item.name, "asc")}></i>
                                            : <i className="fa fa-sort button_sort" aria-hidden="true" onClick={() => this.handleSortChange(item.name, "asc")}></i>)}
                                    {/* {normal: "fa-sort"}, {desc: "fa-sort-amount-desc"}, {asc: "fa-sort-amount-asc"} */}
                                </th>
                            )}
                        </tr>
                        {
                            total ?
                                selectedItems ?
                                    rows.map((row, i) =>
                                        <tr key={i}>
                                            {selectedItems.indexOf(row[key]) >= 0 &&
                                                <td className="check-column"><i className="fa fa-check-square-o" aria-hidden="true" onClick={() => this.handleSelect(row[key])}></i></td>
                                                ||
                                                <td className="check-column"><i className="fa fa-square-o" aria-hidden="true" onClick={() => this.handleSelect(row[key])}></i></td>
                                            }
                                            {renders.map((column, j) => {
                                                if (column.render) {
                                                    if (!column.name) {
                                                        return <td key={j} style={{ textAlign: column.align }} > {column.render(row)}</td>
                                                    } else {
                                                        return <td key={j} style={{ textAlign: column.align }} > {column.render(row[column.name])}</td>
                                                    }

                                                } else {
                                                    return <td key={j} style={{ textAlign: column.align }} > {row[column.name]}</td>
                                                }
                                            }
                                            )}
                                        </tr>
                                    )
                                    :
                                    rows.map((row, i) =>
                                        <tr key={i}>
                                            <td className="check-column"><i className="fa fa-square-o" aria-hidden="true" onClick={() => this.handleSelect(row[key])}></i></td>
                                            {renders.map((column, j) => {
                                                if (column.render) {
                                                    if (!column.name) {
                                                        return <td key={j} style={{ textAlign: column.align }} > {column.render(row)}</td>
                                                    } else {
                                                        return <td key={j} style={{ textAlign: column.align }} > {column.render(row[column.name])}</td>
                                                    }

                                                } else {
                                                    return <td key={j} style={{ textAlign: column.align }} > {row[column.name]}</td>
                                                }
                                            }
                                            )}
                                        </tr>
                                    )
                                :
                                <tr>
                                    <td colSpan={renders.length + 1} style={{ textAlign: "center", fontSize: "15px", fontWeight: "bold", color: "#aaa", padding: "40px" }} ><span>No data found</span></td>
                                </tr>
                        }
                    </tbody>
                </table>
                {total > 0 && <Pagination
                    total={total}
                    pageSize={pageSize}
                    paginationSize={5}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange.bind(this)}
                />}
            </div >)
    }
}