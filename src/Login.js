import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Input, Alert, Icon } from 'antd';
import logo from './company_logo.png';
import './App.css';



class Login extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        console.log('in login screen')
        super(props);
        this.state = {
            // Amos-test
            // serviceEntry: 'http://172.16.10.14:8085/',
            // Amos-live
            // serviceEntry: 'http://172.16.10.4:8085/',
            // serviceEntry: 'https://logistics.amosgroup.com:8090/ws/',
            // serviceEntry: 'http://58.185.33.170:8085/',
            // Sinwa
            // serviceEntry: 'http://192.168.10.16:8085/',
            // Ryan
            serviceEntry: 'http://localhost:8080/',
            username: '',
            password: '',
            home: '',
            log: '',
            showError: false
        }
        this.handleLoginButton = this.handleLoginButton.bind(this)
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    componentDidMount() {

    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value }, () => {
            console.log("username change", this.state.username);
        })
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value }, () => {
            console.log("password change", this.state.password);
        })
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
            }).catch(error => {
                if (error) {
                    console.log('no success', error)
                }

                this.setState({
                    showError: true,
                    log: 'invalid user id and password combination',
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            showError: false
                        })
                    }, 3000);
                });
            })
    }

    render() {

        const inputStyle2 = {
            marginTop: '50px',
            width: '300px',
            height: '50px',
            textAlign: 'center',
            fontSize: '20px',
            color: 'black',
            fontFamily: 'varela',
        };

        return (
            <div className="background-pic">
                <div className="background-black">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <div className="input-container">
                            <Input
                                size="large"
                                className="username"
                                style={inputStyle2}
                                placeholder="Enter your username"
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                onChange={this.handleUsernameChange}
                            />
                        </div>
                        <div className="input-container">
                            <Input.Password
                                size="large"
                                className="password"
                                style={inputStyle2}
                                placeholder="Password"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                onChange={this.handlePasswordChange} />

                        </div>
                        <button
                            className="login-button"
                            onClick={this.handleLoginButton}>
                            Login
                        </button>
                        {
                            this.state.showError ?
                                <Alert style={{ marginTop: '20px' }} message={this.state.log} type="error" showIcon /> :
                                null
                        }
                        <div style={{
                            width: '100px', height: '30px', position: 'absolute', bottom: '0px', alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <p className="version-text">v1.0.0</p>
                        </div>
                    </header>
                </div>
            </div>
        );
    }
}

export default withRouter(withCookies(Login));