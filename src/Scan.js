import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Button, NavBar } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';

class Scan extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            time: 5
        }

        this.onChange = this.onChange.bind(this)

    }

    componentDidMount() {
        document.title = '我的二维码'
        let timeChange;
        let ti = this.state.time;
        //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
        const clock = () => {
            if (ti > 0) {
                //当ti>0时执行更新方法
                ti = ti - 1;
                this.setState({
                    time: ti
                });
                console.log(ti);
            } else {
                //当ti=0时执行终止循环方法
                clearInterval(timeChange);
                this.setState({
                    time: 0
                });
            }
        };
        //每隔一秒执行一次clock方法
        timeChange = setInterval(clock, 1000);
    }

    onChange = (e) => {
        this.setState({
            value: e
        }, () => { console.log(this.state.value) })

    };





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
                    <NavBar
                        className="navbar"
                        mode="light"
                        onLeftClick={() => console.log('onLeftClick')}
                    ><div style={{ paddingTop: '5px' }}>积分查询</div></NavBar>
                    <div style={{ marginTop: '10px', height: '35px' }}></div>
                    <div style={{
                        height: '450px', backgroundColor: 'pink', margin: '10px', padding: '20px'
                    }}>
                        <div style={{ height: '120px', backgroundColor: 'white', borderWidth: '1px', borderColor: '#F7F7F7' }}></div>
                        <div style={{ height: '20px', marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>1573 7971 5086 6</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                            <div style={{ height: '200px', width: '200px', backgroundColor: 'white', }}></div>
                        </div>
                        {
                            this.state.time == 0 ?
                                <div style={{ height: '20px', marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>已过期</div>
                                :
                                <div style={{ height: '20px', marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>有效时间:{this.state.time}秒</div>
                        }


                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(withCookies(Scan));