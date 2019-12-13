import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Button, DatePicker, List, InputItem, Picker } from 'antd-mobile';
import '../node_modules/antd-mobile/dist/antd-mobile.min.css';
import './App.css';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const dateStyle = [
    {
        label: '否',
        value: 0,
    },
    {
        label: '是',
        value: 1,
    },
];
const sexStyle = [
    {
        label: '男',
        value: 0,
    },
    {
        label: '女',
        value: 1,
    },
];

class Register extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        console.log('in login screen')
        super(props);
        this.state = {
            serviceEntry: 'http://localhost:8080/',
            username: '',
            password: '',
            home: '',
            log: '',
            showError: false,
            date: now,
            dValue: 0,
            sValue: 0,
            accessToken:''
        }
        this.handleSaveButton = this.handleSaveButton.bind(this);
    }

    componentDidMount() {

        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa355898a104558ea&redirect_uri=http%3A%2F%2Fwww.epbchina.com%2Fwoo&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect'
        
        fetch(url, {
            method: 'GET'
          })
            .then(response => response.json())
            // .then(response => {
            //   this.setState({
            //     accessToken: response
            //   },()=>{console.log(this.state.accessToken.access_token)})
            // })

    }

    handleSaveButton() {
        console.log('save')
        this.props.history.push('/main')
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

        const image = {
            backgroundColor: '#3CC48D',
            height: '180px'
        }

        const formContainer = {
            // height: '395px',
            marginTop: '5px',
            marginLeft: '5px',
            marginRight: '5px',
            backgroundColor: 'white'
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
            <div style={{ backgroundColor: '#F7F7F7' }}>

                <div style={header}>
                    <div style={{ marginTop: '10px', height: '30px' }}>
                        <p style={headerTitle}>会员注册</p>
                    </div>
                </div>
                <div>
                    <div style={image}>{this.state.accessToken.access_token}</div>
                    <div style={{ marginBottom: '5px' }}>
                        <div style={formContainer}>
                            <List>
                                <InputItem
                                    clear
                                    placeholder="姓名"
                                    ref={el => this.autoFocusInst = el}
                                >姓名</InputItem>
                                <InputItem
                                    clear
                                    placeholder="手机号"
                                    ref={el => this.autoFocusInst = el}
                                >手机号</InputItem>
                                <Button type="primary" style={getButton}>获取验证码</Button>
                                <InputItem
                                    clear
                                    ref={el => this.autoFocusInst = el}
                                >验证码</InputItem>
                                <div style={{ height: '20px', fontSize: '12px', color: 'red' }}>
                                    <p style={{ marginLeft: '15px', paddingTop: '4px' }}>一经提交,无法修改</p>
                                </div>
                                <DatePicker
                                    mode="date"
                                    title="选择日期"
                                    extra="一经提交,无法修改"
                                    value={this.state.date}
                                    onChange={date => this.setState({ date })}
                                >
                                    <List.Item arrow="horizontal">生日
                                    </List.Item>
                                </DatePicker>
                                <Picker
                                    data={dateStyle}
                                    cols={1}
                                    value={this.state.dValue}
                                    onChange={dValue => this.setState({ dValue })}
                                    onOk={dValue => this.setState({ dValue })}>
                                    <List.Item arrow="horizontal">是否农历</List.Item>
                                </Picker>
                                <Picker data={sexStyle}
                                    cols={1}
                                    value={this.state.sValue}
                                    onChange={v => this.setState({ sValue: v })}
                                    onOk={v => this.setState({ sValue: v }, () => { console.log(this.state.sValue) })}>
                                    <List.Item arrow="horizontal">性别</List.Item>
                                </Picker>
                            </List>

                        </div>
                    </div>
                    <div style={{ marginLeft: '5px', marginRight: '5px' }}>
                        <Button type="primary" style={saveButton} onClick={this.handleSaveButton}>保存</Button>
                    </div>
                </div>
            </div>

        );
    }
}

export default withRouter(withCookies(Register));