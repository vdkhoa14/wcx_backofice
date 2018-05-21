import { appSettings } from '../constants'
import { logout, ACCESS_TOKEN_KEY } from '../app/auth'
import { NotificationManager } from 'react-notifications'
import { confirmAlert } from 'react-confirm-alert'
const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "bearer " + window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function post(api, body, callback) {
    const response = fetch(appSettings.baseApi + api, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(body)
    })

    handleResponse(response, callback)

    return response
}
export function postFormData(api, data) {

    const response = fetch(appSettings.baseApi + api, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Authorization": "bearer " + window.localStorage.getItem(ACCESS_TOKEN_KEY)
        },
        body: data
    })

    response.then(r => {
        if (r.status === 401) {
            logout()
        }
    })

    return response
}

export function get(api, callback) {

    let url = appSettings.baseApi + api

    const response = fetch(url, {
        method: 'GET',
        headers: defaultHeaders,
    })

    handleResponse(response, callback)

    return response
}

export function fDelete(api, body, callback) {

    let url = appSettings.baseApi + api

    const response = fetch(url, {
        method: 'DELETE',
        headers: defaultHeaders,
    })

    handleResponse(response, callback)

    return response
}

const handleResponse = (response, callback) => {
    response.then(r => {
        r.json().then(result => {
            if (r.status === 400) {
                NotificationManager.error(result.errors.join("\n"))
            } else if (r.status === 200) {
                callback(result)
            }
        }).catch(() => {
            NotificationManager.error("Application error")
        })
    }).catch(err => {
        response.then(r => {
            if (r.status === 401) {
                logout()
            } else {
                NotificationManager.error("Network fail")
            }
        })

    })
}