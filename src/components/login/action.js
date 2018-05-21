import { post } from '../../networking'
import { appSettings } from '../../constants'
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"

const loginSuccess = (token) => {
    return {
        type: LOGIN_SUCCESS,
        payload: token
    }
}

export const login = (param, callback) => {
    return dispatch => {
        post('auth/token', param)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(result => {
                            dispatch(loginSuccess(result))
                            callback(true)
                        })
                }
            })
            .catch(err => {
                alert()
                callback(false)
            })
    }
}