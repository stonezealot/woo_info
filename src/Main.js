import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { DatePicker, Select } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import logo from './company_logo.png';
import './App.css';
import URLSearchParams from 'url-search-params';
import OrderView from './OrderView';
import DespatchView from './DespatchView';

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
      orders: '',
      orderRecKey: '',
      orderDetail: '',
      tabs: [
        { tabName: "Orders", id: 1 },
        { tabName: "Despatches", id: 2 },
        { tabName: "Inventory", id: 3 },
      ],
      currentIndex: 1,
    }
    console.log('custId:  ' + this.state.home.custId)
    this.handleLogOutButton = this.handleLogOutButton.bind(this)
  }

  componentDidMount() {

  }

  tabChoiced = (id) => {
    this.setState({
      currentIndex: id
    });
  }

  handleLogOutButton() {
    const { cookies } = this.props;
    cookies.set('username', '')
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

    const searchInputStyle = {
      fontFamily: 'varela',
      textAlign: 'center',
    }

    const datePicker = {
      fontFamily: 'varela'
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
          <button
            className="log-out-button"
            onClick={this.handleLogOutButton}>
            Log out
            </button>
        </header>
        <div style={bodyContainer}>
          <div style={mainLeftTabStyle}>
            <ul style={mainLeftTabItemStyle}>
              {tabList}
            </ul>
          </div>
          <div className="main-body-view-container" style={{ "display": isBox1Show }}>
            <OrderView
              orders={this.state.orders}
              home={this.state.home}
              serviceEntry={this.state.serviceEntry} />
          </div>
          <div className="main-body-view-container" style={{ "display": isBox2Show }}>
            <DespatchView
              orders={this.state.orders}
              home={this.state.home}
              serviceEntry={this.state.serviceEntry} />
          </div>
          <div className="main-body-view-container" style={{ "display": isBox3Show }}>
            <OrderView
              orders={this.state.orders}
              home={this.state.home}
              serviceEntry={this.state.serviceEntry} />
          </div>
          {/* <div
            className="main-view"
            style={{ "display": isBox3Show }}>
            Inventory
          </div> */}
        </div>


      </div >
    );
  }

}

export default withRouter(withCookies(Main));