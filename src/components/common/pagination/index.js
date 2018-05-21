import React, { Component } from 'react'
import { connect } from 'react-redux'
import './style.css'
const PAGINATION_SIZE = 5
const PAGE_SIZE = 5
export default class Pagination extends Component {

    constructor(props) {
        super(props)

    }
    onPageChange(page) {

        let {
            total,
            pageSize,
            currentPage
        } = this.props

        const numOfPage = parseInt(total % pageSize == 0 ? total / pageSize : total / pageSize + 1)
        page = page < 1 ? 1 : page > numOfPage ? numOfPage : page

        if (page === currentPage)
            return

        this.props.onPageChange(page)
    }

    calculatePages(numOfPage, paginationSize, currentPage) {
        let pages = []

        if (numOfPage <= paginationSize) {
            for (let i = 1; i <= numOfPage; i++)
                pages.push(i)
            return pages
        }

        let delta = parseInt(paginationSize / 2)
        let leftLimit = currentPage - delta
        if (leftLimit < 1)
            leftLimit = 1
        let rightLimit = leftLimit + paginationSize
        if (rightLimit > numOfPage) {
            rightLimit = numOfPage + 1
            leftLimit = rightLimit - paginationSize
        }
        for (let i = leftLimit; i < rightLimit; i++)
            pages.push(i)
        return pages
    }
    render() {

        let {
            total,
            pageSize,
            paginationSize,
            currentPage
        } = this.props

        if (!pageSize)
            pageSize = PAGE_SIZE
        if (!paginationSize)
            paginationSize = PAGINATION_SIZE
        if (!currentPage)
            currentPage = 1


        const numOfPage = parseInt(total % pageSize == 0 ? total / pageSize : total / pageSize + 1)

        const pages = this.calculatePages(numOfPage, paginationSize, currentPage)

        return (
            <div className="pagination">
                <label>{"Total: " + total + " - " + currentPage + " / " + numOfPage}</label>
                <ul>
                    <li className="page_first" onClick={() => this.onPageChange(1)}><i className='fa fa-angle-double-left' aria-hidden='true'></i></li>
                    <li className="page_previous" onClick={() => this.onPageChange(currentPage - 1)}><i className="fa fa-angle-left" aria-hidden="true"></i></li>
                    {pages.map((page, i) => {
                        if (page === currentPage)
                            return <li key={i} className="active" onClick={() => this.onPageChange(page)}>{page}</li>
                        return <li key={i} onClick={() => this.onPageChange(page)}>{page}</li>
                    }

                    )}
                    <li className="page_next" onClick={() => this.onPageChange(currentPage + 1)}><i className="fa fa-angle-right" aria-hidden="true"></i></li>
                    <li className="page_last" onClick={() => this.onPageChange(numOfPage)}><i className="fa fa-angle-double-right" aria-hidden="true"></i></li>
                </ul>
            </div>
        )
    }
}