import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import logo from './company_logo.png';
import usernameIcon from './assets/icons/username.png';
import passwordIcon from './assets/icons/password.png';
import './App.css';



class Login extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        console.log('in login screen')
        super(props);
        this.state = {
            serviceEntry: 'http://192.168.1.77:8080/',
            username: '',
            password: '',
            home: ''
        }
        this.handleLoginButton = this.handleLoginButton.bind(this)
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    componentDidMount() {

    }

    handleUsernameChange(e) {
        if (e.target.value.length === 0) {
            this.setState({ username: e.target.value }, () => {
                console.log("username change", this.state.username);
            });
        } else {
            this.setState({ username: e.target.value }, () => {
                console.log("username change", this.state.username);
            });
        }
    }

    handlePasswordChange(e) {
        if (e.target.value.length === 0) {
            this.setState({ password: e.target.value }, () => {
                console.log("password change", this.state.password);
            });
        } else {
            this.setState({ password: e.target.value }, () => {
                console.log("password change", this.state.password);
            });
        }
    }

    handleLoginButton() {

        const { cookies } = this.props;

        console.log(this.state)
        const { username, password, serviceEntry } = this.state

        let url = serviceEntry + 'api/login'

        const body = {
            userId: username,
            pwd: password
        }

        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(body),
        })
            .then(response => {
                console.log('response', response);
                if (!response.ok) {
                    throw response;
                } else {
                    return response.json();
                }
            }).then(response => {
                this.setState({ home: response }, () => {
                    cookies.set('home', this.state.home)
                    cookies.set('serviceEntry', this.state.serviceEntry)
                    cookies.set('username', this.state.username)
                    console.log(cookies.get('home'))
                    this.props.history.push('/main')
                });
            })
    }

    render() {

        const inputStyle = {
            background: 'rgba(255,255,255, 0.9)',
            marginTop: '50px',
            height: '50px',
            lineHeight: '50px',
            textAlign: 'center',
            fontSize: '30px',
            color: 'black',
            border: 'none',
            display: 'block',
            fontFamily: 'varela',
        };

        const iconStyle = {
            height: '30px',
        };

        return (
            <div className="background-pic">
                <div className="background-black">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <div className="input-container">
                            <div className="icon-container">
                                <img src={usernameIcon} className="username-icon" style={iconStyle} alt="username" />
                            </div>
                            <input
                                className="username"
                                style={inputStyle}
                                placeholder="Username"
                                onChange={this.handleUsernameChange}
                            />
                        </div>
                        <div className="input-container">
                            <div className="icon-container">
                                <img src={passwordIcon} className="password-icon" style={iconStyle} alt="password" />
                            </div>
                            <input
                                className="password"
                                style={inputStyle}
                                placeholder="Password"
                                type="password"
                                onChange={this.handlePasswordChange}
                            />
                        </div>
                        <button
                            className="login-button"
                            onClick={this.handleLoginButton}>
                            Login
                        </button>
                    </header>
                </div>
            </div>
        );
    }

}

export default withRouter(withCookies(Login));