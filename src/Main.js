import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import 'antd/dist/antd.css';
import './App.css';
import { Button, NavBar } from 'antd-mobile';

class Main extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = this.props;
    this.state = {

      nickname: cookies.get('nickname'),
      headimgurl: cookies.get('headimgurl'),

      // headimgUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erfbmp9anj1jZCgvSaOwcUR3ArOFF6vXWzMAssLqjHlgSBUBasT4kOMllvLrOLYM1bDaazFhwTevA/132'

    }
    this.handlePhoneButton = this.handlePhoneButton.bind(this);
    this.handleCartButton = this.handleCartButton.bind(this);
    this.handlePointButton = this.handlePointButton.bind(this);
    this.handleGiftButton = this.handleGiftButton.bind(this);
    this.handleShopButton = this.handleShopButton.bind(this);
    this.handleScanButton = this.handleScanButton.bind(this);
  }

  componentDidMount() {
    document.title = '个人信息-我的信息'
  }

  handlePhoneButton() {
    console.log('phone')
    this.props.history.push('/phone')
  }

  handleCartButton() {
    console.log('cart')
    this.props.history.push('/cart')
  }

  handlePointButton() {
    console.log('point')
    this.props.history.push('/point')
  }

  handleGiftButton() {
    console.log('gift')
    this.props.history.push('/gift')
  }

  handleShopButton() {
    console.log('shop')
    this.props.history.push('/shop')
  }

  handleScanButton() {
    console.log('scan')
    this.props.history.push('/scan')
  }

  render() {

    const header = {
      // textAlign: 'center',
      // fontSize: '20px',
      // fontFamily: 'varela',
      backgroundColor: '#F7F7F7',
      color: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      // marginTop:'35px'
    };

    const image = {
      backgroundColor: '#3CC48D',
      height: '180px',
      width: '100%',
      backgroundSize: 'cover'
    }

    const squareButton = {

      background: '#F7F7F7',
      width: '33vw',
      height: '33vw',
      margin: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '15px',
      flexDirection: 'column'
    }

    const icon = {

    }

    return (
      <div style={{ marginTop: '-10px' }}>
        <NavBar
          className="navbar"
          mode="light"
          onLeftClick={() => console.log('onLeftClick')}
        ><div style={{ paddingTop: '5px' }}>会员中心</div></NavBar>
        <div style={{ marginTop: '10px', height: '35px' }}></div>
        <div>
          <img style={image} className='woopic' alt={require("./woopic.png")} src={require("./woopic.png")} />
        </div>
        <div style={{ backgroundColor: 'white', marginTop: '5px', height: '60px', padding: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'row' }}>
          <img style={{ height: '45px', width: '45px' }} src={this.state.headimgurl}/>
          <div style={{ marginLeft: '10px', color: '#3CC48D', fontSize: '15px' }}>{this.state.nickname}</div>
        </div>
        <div style={{ backgroundColor: '#3CC48D', marginTop: '5px', height: '60px', display: 'flex', flexDirection: 'row' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ color: 'yellow', fontWeight: 'bold' }}>0</div>
            <div style={{ color: 'white', fontSize: '10px' }}>我的积分</div>
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ color: 'yellow', fontWeight: 'bold' }}>4</div>
            <div style={{ color: 'white', fontSize: '10px' }}>我的优惠券</div>
          </div>
        </div>
        <div style={{ marginTop: '1px', backgroundColor: 'white' }}>
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            <div style={squareButton} onClick={this.handlePhoneButton}>
              <img alt={require("./phone.png")} src={require("./phone.png")} style={icon}></img>
              修改电话
            </div>
            <div style={squareButton} onClick={this.handleCartButton}>
              <img alt={require("./cart.png")} src={require("./cart.png")} style={icon}></img>
              消费查询</div>
            <div style={squareButton} onClick={this.handlePointButton}>
              <img alt={require("./ask.png")} src={require("./ask.png")} style={icon}></img>
              积分查询</div>
          </div>
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            <div style={squareButton} onClick={this.handleGiftButton}>
              <img alt={require("./gift.png")} src={require("./gift.png")} style={icon}></img>
              会员福利</div>
            <div style={squareButton} onClick={this.handleShopButton}>
              <img alt={require("./shop.png")} src={require("./shop.png")} style={icon}></img>
              门店查询</div>
            <div style={squareButton} onClick={this.handleScanButton}>
              <img alt={require("./scan.png")} src={require("./scan.png")} style={icon}></img>
              扫码消费</div>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(withCookies(Main));