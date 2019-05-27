import React, { Component } from 'react';
import { DatePicker, Select, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import './App.css';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const Option = Select.Option;
const { TextArea } = Input;

class OrderView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderDetail: '',
      attachments: '',
      picUrl: '',
      orderSearchInput: '',
      orderStatus: 'ALL',
      orderStartDate: '01/01/2000',
      orderEndDate: moment().format('DD/MM/YYYY'),
      orders: this.props.orders,
      serviceEntry: this.props.serviceEntry,
      home : this.props.home
    }
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleStartDate = this.handleStartDate.bind(this)
    this.handleEndDate = this.handleEndDate.bind(this)
    this.handleSearchButton = this.handleSearchButton.bind(this)
  }


  componentDidMount() {
    const { home, serviceEntry } = this.state

    //get orders
    console.log('get orders')
    let url = serviceEntry + 'api/orders/'
    let params = new URLSearchParams();
    params.append('custId', home.custId);
    url += ('?' + params);
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          orders: response
        })
      })
  }

  handleSearchInput(e) {
    if (e.target.value.length === 0) {
      this.setState({ orderSearchInput: e.target.value });
    } else {
      this.setState({ orderSearchInput: e.target.value });
    }
  }

  handleSelect(value) {
    this.setState({ orderStatus: value })
  }

  handleStartDate(date) {
    this.setState({ orderStartDate: moment(date).format('DD/MM/YYYY') })
  }

  handleEndDate(date) {
    this.setState({ orderEndDate: moment(date).format('DD/MM/YYYY') })
  }

  handleSearchButton() {
    const { orderSearchInput, orderStatus, orderStartDate, orderEndDate} = this.state;
    console.log("orderSearchInput  " + orderSearchInput)
    console.log("orderStatus  " + orderStatus)
    console.log("orderStartDate  " + orderStartDate)
    console.log("orderEndDate  " + orderEndDate)

    console.log(this.state.home.custId)
    console.log(this.state.orders)

    this.setState({
      orders:this.state.orders.filter(o => {
        return o.pkgNum === 3
      })
    })
  }

  getOrderDetail(recKey) {

    this.setState({
      picUrl: ''
    })

    var serviceEntry = this.props.serviceEntry
    //get order detail
    let url = serviceEntry + 'api/orders/' + recKey
    console.log(url)
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          orderDetail: response.mlmasView
        })
      })

    //get attachments
    url = serviceEntry + 'api/attachments/'
    let params = new URLSearchParams();
    params.append('srcRecKey', recKey);
    url += ('?' + params);
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          attachments: response
        })
      })
  }

  orderView() {

    var orders = this.state.orders

    const orderViewBody = {
      height: '60px',
      width: '100vw',
      backgroundColor: 'rgb(236, 236, 236)',
      borderBottomStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgb(204, 202, 202)',
      display: 'flex',
      flexDirection: 'row',
    }

    const orderViewBodyItemContainer = {
      width: '7vw',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      flex: '1',
    }

    const orderViewBodyItem = {
      width: '200px',
      fontSize: '12px',
      fontFamily: 'varela',
      color: 'rgb(66, 66, 68)',
      textAlign: 'center',
      wordWrap: 'break-word',
      verticalAlign: 'middle',
    }

    return (
      <div>
        {
          Object.keys(orders).map(key =>
            <div key={orders[key].recKey} className="main-order-view-body" style={orderViewBody} onClick={() => this.getOrderDetail(orders[key].recKey)}>
              <div className="main-item-container" style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].vslName}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].docId}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {moment(orders[key].stockDate).format('DD/MM/YYYY')}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].custName}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].itemRef}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].description}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].pkgNum}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].pkgUom}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].pkgWt}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].AwbNo}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].statusFlg}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].dimension}
                </div>
              </div>
              <div
                style={{
                  width: '9vw',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  flex: '1'
                }}
              >
                <div className="main-item" style={orderViewBodyItem}>
                  {orders[key].remark}
                </div>
              </div>
            </div>)
        }
      </div>
    )
  }

  orderDetailView() {

    const { orderDetail, attachments, picUrl } = this.state

    const orderDetailTitleContainer = {
      width: '40%',
      borderRightStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'white',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    }

    const orderDetailTitle = {
      width: '200px',
      fontSize: '17px',
      fontFamily: 'varela',
      color: 'white',
      textAlign: 'center',
      margin: '0px'
    }

    const remarkInput = {
      width: '300 px',
      marginLeft: '18px',
      fontFamily: 'varela',
      fontSize: '13px',
      color: 'black',
      backgroundColor: 'white'
    }

    if (orderDetail === '') {
      return (
        <div className="main-order-detail-view">
          <div className="main-order-detail-header">
            <div style={orderDetailTitleContainer}>
              <p style={orderDetailTitle}>Details</p>
            </div>
            <div style={{
              width: '50%',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              flex: '1'
            }}>
              <p style={orderDetailTitle}>More Info</p>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="main-order-detail-view">
          <div className="main-order-detail-header">
            <div style={orderDetailTitleContainer}>
              <p style={orderDetailTitle}>Details</p>
            </div>
            <div style={{
              // width: '50%',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              flex: '1'
            }}>
              <p style={orderDetailTitle}>More Info</p>
            </div>
          </div>
          <div className="main-order-detail-body">
            <div className="main-order-detail-body-left">
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">VESSEL: </p>
                <TextArea
                  value={orderDetail.vslName}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">ASN NUMBER: </p>
                <TextArea
                  value={orderDetail.docId}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container" style={{ marginBottom: '25px' }}>
                <p className="main-order-detail-sub-title">PO NUMBER: </p>
                <TextArea
                  value={orderDetail.itemRef}
                  autosize={{ minRows: 2, maxRows: 2 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">STATUS: </p>
                <TextArea
                  value={orderDetail.statusFlg}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">DATE: </p>
                <TextArea
                  value={moment(orderDetail.stockDate).format('DD/MM/YYYY')}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">SUPPLIER: </p>
                <TextArea
                  value={orderDetail.custName}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">DESCRIPTION: </p>
                <TextArea
                  value={orderDetail.description}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">QTY: </p>
                <TextArea
                  value={orderDetail.pkgNum}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">UOM: </p>
                <TextArea
                  value={orderDetail.pkgUom}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">WEIGHT: </p>
                <TextArea
                  value={orderDetail.pkgWt}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container">
                <p className="main-order-detail-sub-title">AWB: </p>
                <TextArea
                  value={orderDetail.AwbNo}
                  autosize={{ minRows: 1, maxRows: 1 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container" style={{ marginBottom: '25px' }}>
                <p className="main-order-detail-sub-title">DIMENSION: </p>
                <TextArea
                  value={orderDetail.dimension}
                  autosize={{ minRows: 2, maxRows: 2 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
              <div className="main-order-detail-container" style={{ marginBottom: '60px' }}>
                <p className="main-order-detail-sub-title">REMARKS: </p>
                <TextArea
                  value={orderDetail.remark}
                  autosize={{ minRows: 4, maxRows: 4 }}
                  style={remarkInput}
                  disabled={true} />
              </div>
            </div>
            <div className="main-order-detail-body-right">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="main-order-detail-info-smallpic-container">
                  {

                    Object.keys(attachments).map(key => {
                      var imgSrc = "http://58.185.33.162/ep_attach/" + attachments[key].name;
                      return (
                        <div key={attachments[key].recKey}>
                          <img
                            onMouseOver={() => { this.setState({ picUrl: imgSrc }) }}
                            className="small-pic" src={imgSrc} alt={imgSrc} />
                        </div>
                      )
                    }
                    )
                  }
                </div>
                <div className="main-order-detail-info-largepic-container">
                  <img className="large-pic" src={picUrl} alt={picUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>


      )
    }
  }

  render() {

    const searchInputStyle = {
      fontFamily: 'varela',
      textAlign: 'center',
    }

    const orderViewHeader = {
      height: '60px',
      width: '100vw',
      backgroundColor: 'rgb(70, 154, 209)',
      borderBottomStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgb(70, 154, 209)',
      display: 'flex',
      flexDirection: 'row',
    }

    const orderViewHeaderTitleContainer = {
      width: '7vw',
      borderRightStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'white',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      flex: '1'
    }

    const orderViewHeaderTitle = {
      width: '200px',
      fontSize: '12px',
      fontFamily: 'varela',
      color: 'white',
      textAlign: 'center',
      marginTop: '21px',
    }

    const datePicker = {
      fontFamily: 'varela'
    }

    return (
      <div>
        <div className="main-search-view">
          <div className="main-search-title-container">
            <p className="main-search-title" >Search Orders</p>
            <div className="main-search-second-container">
              <p className="main-search-sub-title">Search</p>
              <input className="main-search-input"
                style={searchInputStyle}
                onChange={this.handleSearchInput}></input>
              <p className="main-search-sub-title">Status</p>
              <Select
                className="main-search-select"
                onChange={this.handleSelect}
                defaultValue="ALL">
                <Option value="ALL">ALL</Option>
                <Option value="EXPECTED">EXPECTED</Option>
                <Option value="STOCK">STOCK</Option>
                <Option value="DESPATCH">DESPATCH</Option>
                <Option value="LANDED ITEMS">LANDED ITEMS</Option>
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
              <Button
                style={{ marginTop: '50px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                type="primary"
                icon="search"
                onClick={this.handleSearchButton}>Search</Button>
            </div>
          </div>
        </div>
        <div>
          <div
            className="main-view2"
            style={{ width: '100vw' }}>
            <div className="main-view-header" style={orderViewHeader}>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>VESSEL</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>ASN NUMBER</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>RECEIVE DATE</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>SUPPLIER</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>PO NUMBER</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>DESCRIPTION</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>QTY</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>UOM</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>WEIGHT</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>AWB</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>STATUS</p>
              </div>
              <div style={orderViewHeaderTitleContainer}>
                <p style={orderViewHeaderTitle}>DIMENSION</p>
              </div>
              <div
                style={{
                  width: '9vw',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  flex: '1'
                }}>
                <p style={orderViewHeaderTitle}>REMARKS</p>
              </div>
            </div>
            <div>{this.orderView()}</div>
          </div>
          <div>
            {this.orderDetailView()}
          </div>
        </div>
      </div>
    );
  }

}

export default OrderView;