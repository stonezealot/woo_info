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

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const Option = Select.Option;

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

    // const { home, serviceEntry } = this.state

    // //get orders
    // console.log('get orders last')
    // let url = serviceEntry + 'api/orders/'
    // let params = new URLSearchParams();
    // params.append('custId', home.custId);
    // url += ('?' + params);
    // fetch(url, {
    //   method: 'GET'
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     this.setState({
    //       orders: response
    //     })
    //   })
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
            <div className="main-search-title-container">
              <p className="main-search-title" >Search Despatches</p>
              <div className="main-search-second-container">
                <p className="main-search-sub-title">Search</p>
                <input className="main-search-input"
                  style={searchInputStyle}
                  onChange={this.handleSearchInput}></input>
                <p className="main-search-sub-title">Status</p>
                <Select
                  className="main-search-select"
                  onChange={this.handleSelect}
                  defaultValue="All">
                  <Option value="All">All</Option>
                  <Option value="Despatch">Despatch</Option>
                  <Option value="History">History</Option>
                </Select>
                <p className="main-search-sub-title">Start Date</p>
                <DatePicker
                  className="main-search-date-picker"
                  allowClear={false}
                  style={datePicker}
                  defaultValue={moment('01/01/2000', dateFormatList[0])}
                  format={dateFormatList}
                  onChange={date => this.handleStartDate(date)} />
                <p className="main-search-sub-title">End Date</p>
                <DatePicker
                  className="main-search-date-picker"
                  allowClear={false}
                  style={datePicker}
                  defaultValue={moment(moment().format('DD/MM/YYYY'), dateFormatList[0])}
                  format={dateFormatList}
                  onChange={date => this.handleEndDate(date)} />
              </div>
            </div>
          </div>
          <div className="main-body-view-container" style={{ "display": isBox3Show }}>
            <OrderView
              orders={this.state.orders}
              home={this.state.home}
              serviceEntry={this.state.serviceEntry} />
          </div>
          <div
            className="main-view"
            style={{ "display": isBox2Show }}>
            Despatches
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