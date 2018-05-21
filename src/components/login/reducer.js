import { LOGIN_SUCCESS, LOGIN_FAIL } from './action'
import { login } from '../../app/auth'
const initialState = {
    token: {}
}
export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            login(action.payload.access_token, "admin")
            return {
                token: action.payload
            }
        default: return { ...state }
    }
}