import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Empty } from 'antd';
import { Button, NavBar } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';


const data = [
    {
        price: 800.00,
        priceFill: 10000,
        no: 'Q19111326417454',
    },
    {
        price: 100.00,
        priceFill: 1588,
        no: 'Q19111326417768',
    },
    {
        price: 200.00,
        priceFill: 2988,
        no: 'Q19111326417657',
    },
    {
        price: 300.00,
        priceFill: 4888,
        no: 'Q19111326417575',
    }
]

class Cart extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.title = '消费查询'
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
                ><div style={{ paddingTop: '5px' }}>消费查询</div></NavBar>
                <div style={{ marginTop: '10px', height: '35px' }}></div>
                <Empty description='您还没有消费记录哦~~' image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

}

export default withRouter(withCookies(Cart));