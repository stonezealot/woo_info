import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Button, DatePicker, List, InputItem, Picker, Toast } from 'antd-mobile';
import moment from 'moment';
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
            serviceEntry: 'https://dev.epbmobile.app:8090/gateway/epod/api/',
            authorization: 'Bearer 2f1515c7-4fcb-4eb3-9d83-2d237a5ac4ec',
            date: now,
            accessToken: '',
            dValue: 0, // date
            sValue: 0, // sex
            home: '',
            location: this.props.location,
            userinfo: '',
            nickname: '',
            headimgurl: '',
            vipName: '',
            vipPhone: '',
            checkCode: '',
            birthday: moment(now).format('YYYY-MM-DD'),
            gender: '',
            hasError: false,
        }
        this.handleSaveButton = this.handleSaveButton.bind(this);
        this.urlValue = this.urlValue.bind(this);
    }

    componentDidMount() {

        const { cookies } = this.props;

        let url = this.state.serviceEntry + 'access-token?code=' + this.urlValue('code')

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.state.authorization
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    home: response
                }, () => {

                    console.log(this.state.home)


                    const body = {
                        wechatId: this.state.home.openid,
                    }

                    //get vip id
                    fetch(this.state.serviceEntry + 'get-vip-id', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.state.authorization
                        },
                        body: JSON.stringify(body),
                    })
                        .then(response => response.json())
                        .then(response => {
                            this.setState({
                                vipIdReturn: response
                            }, () => {
                                if (this.state.vipIdReturn.vipId != null) {

                                    //get userinfo
                                    fetch(this.state.serviceEntry + 'userinfo?accessToken=' + this.state.home.accessToken + '&openid=' + this.state.home.openid + '&lang=zh_CN', {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': this.state.authorization
                                        }
                                    }).then(response => response.json())
                                        .then(response => {
                                            this.setState({
                                                userinfo: response
                                            }, () => {
                                                console.log(this.state.userinfo)
                                                cookies.set('nickname', this.state.userinfo.nickname)
                                                cookies.set('headimgurl', this.state.userinfo.headimgurl)
                                                this.props.history.replace('/main')
                                            })
                                        })
                                }
                            })
                        })
                })
            })

        console.log('current search url:' + window.location.search)
        console.log('current search:' + this.urlValue('code'))

        this.handleVipName = this.handleVipName.bind(this)
        this.handleVipPhone = this.handleVipPhone.bind(this)
        this.handleCheckCode = this.handleCheckCode.bind(this)
        this.handleBirthday = this.handleBirthday.bind(this)
        this.handleGender = this.handleGender.bind(this)

    }

    //获取url中的code值
    urlValue(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    handleVipName = (value) => {

        this.setState({
            vipName: value
        })
    }

    handleVipPhone = (value) => {
        this.setState({
            vipPhone: value
        })
    }

    handleCheckCode = (value) => {
        this.setState({
            checkCode: value
        })
    }

    handleBirthday = (value) => {
        this.setState({
            date: value,
            birthday: moment(value).format('YYYY-MM-DD')
        })
    }

    handleGender = (value) => {
        this.setState({
            gender: value
        })
    }

    // onErrorClick = () => {
    //     if (this.state.hasError) {
    //         Toast.info('姓名不能为空');
    //     }
    // }

    handleSaveButton() {

        const { cookies } = this.props
        const { vipName, vipPhone, checkCode, birthday, gender, home } = this.state
        console.log('save')
        // 
        console.log('vipName: ' + vipName)
        console.log('vipPhone: ' + vipPhone)
        console.log('checkCode: ' + checkCode)
        console.log('birthday: ' + birthday)
        console.log('gender: ' + (gender == 0 ? 'M' : 'F'))
        console.log('wechatId: ' + home.openid)

        const body = {
            vipName: vipName,
            vipPhone: vipPhone,
            checkCode: checkCode,
            birthday: birthday,
            gender: (gender == 0 ? 'M' : 'F'),
            wechatId: home.openid
        }

        if (vipName == '') {
            Toast.info('请输入姓名', 1);
        } else if (vipPhone == '') {
            Toast.info('请输入手机号', 1);
        } else if (checkCode == '') {
            Toast.info('请输入验证码', 1);
        } else {
            fetch(this.state.serviceEntry + 'vip-register', {
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

                    if (response.errCode != 'OK') {
                        Toast.info('注册失败', 1);
                    } else {

                        //get userinfo
                        fetch(this.state.serviceEntry + 'userinfo?accessToken=' + this.state.home.accessToken + '&openid=' + this.state.home.openid + '&lang=zh_CN', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': this.state.authorization
                            }
                        })
                            .then(response => response.json())
                            .then(response => {
                                this.setState({
                                    userinfo: response
                                }, () => {
                                    console.log(this.state.userinfo)
                                    cookies.set('nickname', this.state.userinfo.nickname)
                                    cookies.set('headimgurl', this.state.userinfo.headimgurl)
                                    this.props.history.replace('/main')
                                })
                            })
                    }
                })
        }
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
                                    onChange={this.handleVipName}
                                // onErrorClick={this.onErrorClick}
                                // error={this.state.hasError}
                                >姓名</InputItem>
                                <InputItem
                                    clear
                                    placeholder="手机号"
                                    ref={el => this.autoFocusInst = el}
                                    onChange={this.handleVipPhone}
                                >手机号</InputItem>
                                <Button type="primary" style={getButton}>获取验证码</Button>
                                <InputItem
                                    clear
                                    ref={el => this.autoFocusInst = el}
                                    onChange={this.handleCheckCode}
                                >验证码</InputItem>
                                <div style={{ height: '20px', fontSize: '12px', color: 'red' }}>
                                    <p style={{ marginLeft: '15px', paddingTop: '4px' }}>一经提交,无法修改</p>
                                </div>
                                <DatePicker
                                    mode="date"
                                    title="选择日期"
                                    extra="一经提交,无法修改"
                                    value={this.state.date}
                                    onChange={this.handleBirthday}
                                    minDate={new Date(1930, 1, 1, 0, 0, 0)}
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
                                    onChange={this.handleGender}
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