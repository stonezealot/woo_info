import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Button, NavBar } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';


class Point extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.title = '个人信息-会员积分'
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

        return (
            <div style={{ backgroundColor: '#F7F7F7', height: '100vh' }}>
                 <NavBar
                    className="navbar"
                    mode="light"
                    onLeftClick={() => console.log('onLeftClick')}
                ><div style={{ paddingTop: '5px' }}>积分查询</div></NavBar>
                <div style={{ marginTop: '10px', height: '35px' }}></div>
                <div style={{ backgroundColor: '#DDB100', height: '150px', paddingTop: '90px' }}>
                    <div style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', marginLeft: '30px' }}>0积分</div>
                </div>
            </div>
        );
    }

}

export default withRouter(withCookies(Point));