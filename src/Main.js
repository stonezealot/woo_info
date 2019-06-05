import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import logo from './company_logo.png';
import './App.css';
import OrderView from './OrderView';
import DespatchView from './DespatchView';
import InventoryView from './InventoryView';

class Main extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const { cookies } = this.props;
    this.state = {
      serviceEntry: cookies.get('serviceEntry'),
      home: cookies.get('home'),
      username: cookies.get('username'),
      orders: '',
      orderRecKey: '',
      orderDetail: '',
      tabs: [
        { tabName: "Orders/Spares", id: 1 },
        { tabName: "Despatches", id: 2 },
        { tabName: "Inventory", id: 3 },
      ],
      currentIndex: 1,
    }
    console.log('custId:  ' + this.state.home.custId)
    console.log('name:  ' + this.state.home.name)
    this.handleLogOutButton = this.handleLogOutButton.bind(this)
  }

  componentDidMount() {
    const { home } = this.state
    console.log(home)
    if (home === '') {
      this.props.history.push('/login')
    }
  }

  tabChoiced = (id) => {
    this.setState({
      currentIndex: id
    });
  }

  handleLogOutButton() {
    const { cookies } = this.props;
    cookies.set('home', '')
    this.props.history.push('/login')
  }

  render() {

    const mainLeftTabStyle = {
      color: '#8c8c8c',
      position: 'absolute',
      top: '70px',
      height: '100%',
      backgroundColor: 'rgb(66, 66, 68)',
      width: '150px'
    }

    const mainLeftTabItemStyle = {
      listStyle: 'none',
    }

    const text = {
      fontSize: '16px',
      paddingTop: '20px'
    }

    const bodyContainer = {
      flexDirection: 'row'
    }

    const logOutButton = {
      position: 'absolute',
      right: '15px',
      top: '15px',
      height: '40px',
      width: '120px',
      backgroundColor: 'rgb(70, 154, 209)',
      borderColor: 'rgb(70, 154, 209)',
      fontFamily: 'varela',
      paddingTop: '1px',
      paddingLeft: '9px'
    }

    var _this = this;
    var isBox1Show = this.state.currentIndex === 1 ? 'block' : 'none';
    var isBox2Show = this.state.currentIndex === 2 ? 'block' : 'none';
    var isBox3Show = this.state.currentIndex === 3 ? 'block' : 'none';

    var tabList = this.state.tabs.map(function (res, index) {
      var tabStyle = res.id === this.state.currentIndex ? 'subCtrl-active' : 'subCtrl';

      return (
        <li
          data-value={res.id}
          key={index}
          onClick={this.tabChoiced.bind(_this, res.id)}
          className={tabStyle}>
          <p style={text}>{res.tabName}</p>
        </li>
      )

    }.bind(_this));

    return (
      <div className="main-background">
        <header className="main-header">
          <img src={logo} className="main-logo" alt="logo" />
          <div style={{ flexDirection: 'row' }}>
            <p className="user-text">User:</p>
            <p className="username-text">{this.state.home.userName}</p>
          </div>
          <Button
            // className="log-out-button"
            style={logOutButton}
            type="primary"
            icon="logout"
            onClick={this.handleLogOutButton}>
            Log out
            </Button>
        </header>
        <div style={bodyContainer}>
          <div style={mainLeftTabStyle}>
            <ul style={mainLeftTabItemStyle}>
              {tabList}
            </ul>
          </div>
          <div className="main-body-view-container" style={{ "display": isBox1Show }}>
            <OrderView
              home={this.state.home}
              serviceEntry={this.state.serviceEntry} />
          </div>
          <div className="main-body-view-container" style={{ "display": isBox2Show }}>
            <DespatchView
              home={this.state.home}
              serviceEntry={this.state.serviceEntry} />
          </div>
          <div className="main-body-view-container" style={{ "display": isBox3Show }}>
            <InventoryView
              home={this.state.home}
              serviceEntry={this.state.serviceEntry} />
          </div>
        </div>
      </div >
    );
  }

}

export default withRouter(withCookies(Main));