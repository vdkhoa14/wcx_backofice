import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
import { login } from './action'
class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isVerified: true,
            username: "",
            password: ""
        }
    }

    verifyCallback = () => {
        this.setState({ isVerified: true })
    }

    submit = (e) => {
        e.preventDefault()

        const { isVerified } = this.state
        if (!isVerified)
            return

        let username = this.state.username
        let password = this.state.password

        if (!username || !password)
            return

        this.props.login({
            username,
            password
        }, this.onLoginComplete.bind(this))

    }

    onLoginComplete = (status) => {
        window.localStorage.setItem("username", this.state.username)
        let redirect = "/"
        if (this.props.location.search) {
            redirect = this.props.location.search.replace("?redirect=", "").replace("%2F", "/")
        }
        window.location.href = redirect
    }

    render() {
        return (
            <div className="login-box wrapper">
                <div className="login-logo">
                    <a href="javascript:void(0)"><b>Nail Spa</b> of <b>America</b></a>
                </div>
                <div className="login-box-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    <form onSubmit={e => this.submit(e)}>
                        <div className="form-group has-feedback">
                            <input type="text" className="form-control" placeholder="username" onChange={(e) => this.setState({ username: e.target.value })} />
                            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input type="password" className="form-control" placeholder="Password" onChange={(e) => this.setState({ password: e.target.value })} />
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div className="row" style={{ paddingLeft: "32px", paddingBottom: "10px" }}>
                            {/* <ReCAPTCHA
                                ref="recaptcha"
                                sitekey="6LcH5zkUAAAAAKwdxEDpO-_Xqois9BbK5wPpXotA"
                                onChange={this.verifyCallback}
                            /> */}
                        </div>
                        <div className="row">
                            <div className="col-xs-4 pull-right">
                                <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
                            </div>
                        </div>
                    </form>
                    <a href="#">I forgot my password</a><br />
                </div>
            </div>
        )
    }
}
export default connect(state => ({
    auth: state.auth
}), dispatch => ({
    login: (param, callback) => dispatch(login(param, callback))
}))(Login)