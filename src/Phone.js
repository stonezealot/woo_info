import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Button, NavBar } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';


class Phone extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.title = '变更手机号码'
    }

    render() {

        const header = {
            // textAlign: 'center',
            fontSize: '20px',
            fontFamily: 'varela',
            backgroundColor: 'white',
            color: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            height: '35px'
        };

        const headerTitle = {
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontWeight: '800'
        }

        const getButton = {
            marginTop: '5px',
            marginBottom: '5px',
            width: '100%',
            backgroundColor: '#DDB100',
            height: '50px',
            borderColor: '#DDB100',
            fontSize: '20px',
        }

        const saveButton = {
            marginTop: '5px',
            marginBottom: '5px',
            width: '100%',
            backgroundColor: '#3CC48D',
            height: '50px',
            borderColor: '#3CC48D',
            fontSize: '20px'
        }

        return (
            <div style={{ backgroundColor: '#F7F7F7', height: '100vh' }}>

                {/* <div style={header}>
                    <div style={{ marginTop: '10px', height: '30px' }}>
                        <p style={headerTitle}>修改手机号</p>
                    </div>
                </div> */}
                <NavBar
                    className="navbar"
                    mode="light"
                    onLeftClick={() => console.log('onLeftClick')}
                ><div style={{ paddingTop: '5px' }}>修改手机号</div></NavBar>
                {/* <div style={header}> */}
                <div style={{ marginTop: '10px', height: '35px' }}>
                </div>
                <div style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    marginRight: '10px',
                }}>
                    <div style={{ color: '#CCCCCC' }}>原手机号:</div>
                    <input className="input" style={{ height: '50px', width: '100%' }}></input>
                    <div style={{ color: '#CCCCCC', marginTop: '10px' }}>新手机号</div>
                    <input className="input" style={{ height: '50px', width: '100%' }}></input>
                    <div style={{ marginTop: '20px' }}>
                        <Button type="primary" style={getButton} onClick={this.handleSaveButton}>获取验证码</Button>
                    </div>
                    <input className="input" style={{ height: '50px', width: '100%' }} placeholder="验证码"></input>
                    <div>
                        <Button type="primary" style={saveButton} onClick={this.handleSaveButton}>立即修改</Button>
                    </div>

                </div>



            </div>
        );
    }

}

export default withRouter(withCookies(Phone));