import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Button, NavBar, InputItem, Toast } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';


class Phone extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = this.props;

        this.state = {
            serviceEntry: cookies.get('serviceEntry'),
            authorization: cookies.get('authorization'),
            vipId: cookies.get('vipId'),
            isLoading: true,
            showDetail: false,
            discountList: '',
            checkCode: '',
            vipPhone: ''
        }

    }

    componentDidMount() {
        document.title = '变更手机号码'
        console.log('vipId:' + this.state.vipId)
    }

    handleSaveButton() {

        const body = {
            vipId: this.state.vipId,
            checkCode: this.state.checkCode,
            vipPhone: this.state.vipPhone
        }

        fetch(this.state.serviceEntry + 'update-vip-phone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.state.authorization
            },
            body: JSON.stringify(body),
        })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if (response.errCode == 'OK') {
                    Toast.info('修改成功', 1);
                }
            })
    }

    changePhone = (value) => {
        this.setState({
            vipPhone: value
        }, () => {
            console.log(this.state.vipPhone)
        })
    }

    render() {

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
                    <InputItem className="input" style={{ height: '50px', width: '100%' }}></InputItem>
                    <div style={{ color: '#CCCCCC', marginTop: '10px' }}>新手机号</div>
                    <InputItem className="input" style={{ height: '50px', width: '100%' }} onChange={this.changePhone}></InputItem>
                    <div style={{ marginTop: '20px' }}>
                        <Button type="primary" style={getButton}>获取验证码</Button>
                    </div>
                    <InputItem className="input" style={{ height: '50px', width: '100%' }} placeholder="验证码"></InputItem>
                    <div>
                        <Button type="primary" style={saveButton} onClick={this.handleSaveButton}>立即修改</Button>
                    </div>

                </div>



            </div>
        );
    }

}

export default withRouter(withCookies(Phone));