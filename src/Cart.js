import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Empty } from 'antd';
import 'antd/dist/antd.css';
import './App.css';


class Cart extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {

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
                <div style={header}>
                    <div style={{ marginTop: '10px', height: '30px' }}>
                        <p style={headerTitle}>消费查询</p>
                    </div>
                </div>
                    <Empty description='您还没有消费记录哦~~' image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

}

export default withRouter(withCookies(Cart));