import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'

export const ACCESS_TOKEN_KEY = "access_token"
const ADMIN_ROLE = "admin_role"

export const getAccessToken = () => window.localStorage.getItem(ACCESS_TOKEN_KEY)

export const isAdmin = () => window.localStorage.getItem(ADMIN_ROLE) != null

export const login = (accessToken, role) => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    window.localStorage.setItem(ADMIN_ROLE, role)
}

export const logout = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    window.localStorage.removeItem(ADMIN_ROLE)
    window.history.go(0)
}

const staffIsAuthenticatedDefaults = {
    authenticatedSelector: state => window.localStorage.getItem(ACCESS_TOKEN_KEY) != null,
    wrapperDisplayName: 'UserIsAuthenticated'
}

const adminIsAuthenticatedDefaults = {
    authenticatedSelector: state => window.localStorage.getItem(ACCESS_TOKEN_KEY) != null && window.localStorage.getItem(ADMIN_ROLE) != null,
    wrapperDisplayName: 'UserIsAuthenticated'
}

export const staffIsAuthenticatedRedir = connectedRouterRedirect({
    ...staffIsAuthenticatedDefaults,
    redirectPath: '/login'
})
export const adminIsAuthenticatedRedir = connectedRouterRedirect({
    ...adminIsAuthenticatedDefaults,
    redirectPath: '/login'
})
