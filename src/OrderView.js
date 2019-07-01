import React, { Component } from 'react';
import { DatePicker, Select, Input, Button, Alert, Modal, Tooltip, Spin } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import { exportExcel } from 'xlsx-oc';
import { List, AutoSizer } from "react-virtualized";
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
      supplierInput: '',
      vesselInput: '',
      awbNoInput: '',
      orderStatus: 'ALL',
      orderStartDate: '01/01/2000',
      orderEndDate: moment().format('DD/MM/YYYY'),
      orders: '',
      ordersUpdated: '',
      serviceEntry: this.props.serviceEntry,
      home: this.props.home,
      showOrderDetail: false,
      showError: false,
      showSupplierModal: false,
      showVesselModal: false,
      showAwbNoModal: false,
      suppliers: '',
      suppliersUpdate: '',
      vessels: '',
      vesselsUpdate: '',
      despatchDetail: '',
      a: false,
      loading: false
    }
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.handleSupplierInput = this.handleSupplierInput.bind(this)
    this.handleVesselInput = this.handleVesselInput.bind(this)
    this.handleAwbNoInput = this.handleAwbNoInput.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleStartDate = this.handleStartDate.bind(this)
    this.handleEndDate = this.handleEndDate.bind(this)
    this.handleSearchButton = this.handleSearchButton.bind(this)
    this.handleResetButton = this.handleResetButton.bind(this)
    this.handleToDespatch = this.handleToDespatch.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.orderView = this.orderView.bind(this)
    this.suppliersView = this.suppliersView.bind(this)
    this.vesselsView = this.vesselsView.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showOrderDetail === true) {
      this.setState({
        showOrderDetail: true,
        orderDetail: nextProps.orderDetail
      })
    }
  }

  // componentDidUpdate() {
  //   // this.setState({loading:false},console.log('loading complete'))
  //   if (this.state.loading === true) {
  //     this.setState({ loading: false }, () => { console.log('loading complete' + this.state.loading) })
  //   } else {
  //     //do something else
  //   }
  // }

  componentDidMount() {
    const { home, serviceEntry } = this.state
    console.log(home.isadmin)

    if (home.isadmin === 'Y') {
      //get orders Admin
      console.log('get orders Admin')
      let url = serviceEntry + 'api/all-orders/'
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            ordersUpdated: response,
            orders: response
          })
        })
    } else {
      //get orders common
      console.log('get orders common')
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
            ordersUpdated: response,
            orders: response
          })
        })
    }

    if (home.isadmin === 'Y') {
      // get suppliers Admin
      console.log('get suppliers Admin')
      let url = serviceEntry + 'api/search-all-suppliers/'
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            suppliers: response,
            suppliersUpdate: response
          })
        })
    } else {
      // get suppliers
      console.log('get suppliers')
      let url = serviceEntry + 'api/search-suppliers/'
      let params = new URLSearchParams();
      params.append('custId', home.custId);
      url += ('?' + params);
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            suppliers: response,
            suppliersUpdate: response
          })
        })
    }


    //get vessels
    console.log('get vessels')
    let url = serviceEntry + 'api/search-vessels'
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          vessels: response,
          vesselsUpdate: response
        })
      })
  }

  handleSearchInput(e) {
    this.setState({ orderSearchInput: e.target.value });
  }

  handleAwbNoInput(e) {
    this.setState({ awbNoInput: e.target.value });
  }

  handleSupplierInput(e) {

    console.log(this.state.suppliers)

    this.setState({
      supplierInput: e.target.value
    }, () => {
      this.setState({
        suppliersUpdate: this.state.suppliers.filter(s => {
          if (s != null) {
            return (
              (s.suppName !== null ? s.suppName.toUpperCase().includes(this.state.supplierInput.toUpperCase()) : '')
              || (s.suppId !== null ? s.suppId.toUpperCase().includes(this.state.supplierInput.toUpperCase()) : ''))
          }

        })
      })
    });
  }

  handleVesselInput(e) {

    console.log(this.state.vessels)
    this.setState({
      vesselInput: e.target.value
    }, () => {
      this.setState({
        vesselsUpdate: this.state.vessels.filter(v => {
          return (
            (v.vslId !== null ? v.vslId.toUpperCase().includes(this.state.vesselInput.toUpperCase()) : '')
            || (v.name !== null ? v.name.toUpperCase().includes(this.state.vesselInput.toUpperCase()) : ''))
        })
      })
    });
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
    const { orderSearchInput, supplierInput, vesselInput, awbNoInput, orderStatus, orderStartDate, orderEndDate, orders } = this.state;
    // console.log("orderSearchInput  " + orderSearchInput)
    // console.log("supplierInput  " + supplierInput)
    // console.log("vesselInput  " + vesselInput)
    // console.log("awbNoInput  " + awbNoInput)
    // console.log("orderStatus  " + orderStatus)
    // console.log("orderStartDate  " + orderStartDate)
    // console.log("orderEndDate  " + orderEndDate)

    const date1 = moment(orderStartDate, dateFormatList[0]);
    const date2 = moment(orderEndDate, dateFormatList[0]);
    const text = orderSearchInput.toUpperCase();
    const supplier = supplierInput.toUpperCase();
    const vessel = vesselInput.toUpperCase();
    const awbNo = awbNoInput.toUpperCase();


    if (date1 > date2) {
      this.setState({
        showError: true
      })
    } else {
      this.setState({
        loading: true
      }, () => {
        console.log('loading', this.state.loading)
        if (orderStatus === 'ALL') {
          if (orderSearchInput === '' || orderSearchInput.toString().trim().length === 0) {
            this.setState({
              showError: false,
              ordersUpdated: orders.filter(o => {
                return (
                  ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                    && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                    || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                      && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
                  && (o.suppName !== null ? o.suppName.toUpperCase().includes(supplier) : o.recKey !== null)
                  && (o.vslId !== null ? o.vslId.toUpperCase().includes(vessel) : o.recKey !== null)
                  && (o.awbNo !== null ? o.awbNo.toUpperCase().includes(awbNo) : o.recKey !== null)
                )
              })
            })
          } else {
            this.setState({
              showError: false,
              ordersUpdated: this.state.orders.filter(o => {
                return (
                  ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                    && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                    || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                      && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
                  && (
                    (o.vslName !== null ? o.vslName.toString().toUpperCase().includes(text) : o.recKey !== null)
                    || (o.suppName !== null ? o.suppName.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.itemRef !== null ? o.itemRef.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.description !== null ? o.description.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.remark !== null ? o.remark.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.awbNo !== null ? o.awbNo.toUpperCase().includes(text) : o.recKey !== null)
                  )
                  && (o.suppName !== null ? o.suppName.toUpperCase().includes(supplier) : o.recKey !== null)
                  && (o.vslId !== null ? o.vslId.toUpperCase().includes(vessel) : o.recKey !== null)
                  && (o.awbNo !== null ? o.awbNo.toUpperCase().includes(awbNo) : o.recKey !== null)
                )
              })
            })
          }
        } else if (orderStatus === 'LANDED ITEMS') {
          if (orderSearchInput === '' || orderSearchInput.toString().trim().length === 0) {
            this.setState({
              showError: false,
              ordersUpdated: orders.filter(o => {
                return (
                  ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                    && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                    || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                      && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
                  && o.landedItem === 'LANDED'
                  && (o.suppName !== null ? o.suppName.toUpperCase().includes(supplier) : o.recKey !== null)
                  && (o.vslId !== null ? o.vslId.toUpperCase().includes(vessel) : o.recKey !== null)
                  && (o.awbNo !== null ? o.awbNo.toUpperCase().includes(awbNo) : o.recKey !== null)
                )
              })
            })
          } else {
            this.setState({
              showError: false,
              ordersUpdated: this.state.orders.filter(o => {
                return (
                  ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                    && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                    || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                      && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
                  && (
                    (o.vslName !== null ? o.vslName.toString().toUpperCase().includes(text) : o.recKey !== null)
                    || (o.suppName !== null ? o.suppName.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.itemRef !== null ? o.itemRef.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.description !== null ? o.description.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.remark !== null ? o.remark.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.awbNo !== null ? o.awbNo.toUpperCase().includes(text) : o.recKey !== null))
                  && o.landedItem === 'LANDED'
                  && (o.suppName !== null ? o.suppName.toUpperCase().includes(supplier) : o.recKey !== null)
                  && (o.vslId !== null ? o.vslId.toUpperCase().includes(vessel) : o.recKey !== null)
                  && (o.awbNo !== null ? o.awbNo.toUpperCase().includes(awbNo) : o.recKey !== null))
              })
            })
          }
        } else {
          if (orderSearchInput === '' || orderSearchInput.toString().trim().length === 0) {
            this.setState({
              showError: false,
              ordersUpdated: orders.filter(o => {
                return (
                  ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                    && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                    || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                      && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
                  && o.statusFlg === orderStatus
                  && (o.suppName !== null ? o.suppName.toUpperCase().includes(supplier) : o.recKey !== null)
                  && (o.vslId !== null ? o.vslId.toUpperCase().includes(vessel) : o.recKey !== null)
                  && (o.awbNo !== null ? o.awbNo.toUpperCase().includes(awbNo) : o.recKey !== null))
              })
            })
          } else {
            this.setState({
              showError: false,
              ordersUpdated: this.state.orders.filter(o => {
                return (
                  ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                    && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                    || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                      && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
                  && (
                    (o.vslName !== null ? o.vslName.toString().toUpperCase().includes(text) : o.recKey !== null)
                    || (o.suppName !== null ? o.suppName.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.itemRef !== null ? o.itemRef.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.description !== null ? o.description.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.remark !== null ? o.remark.toUpperCase().includes(text) : o.recKey !== null)
                    || (o.awbNo !== null ? o.awbNo.toUpperCase().includes(text) : o.recKey !== null))
                  && o.statusFlg === orderStatus
                  && (o.suppName !== null ? o.suppName.toUpperCase().includes(supplier) : o.recKey !== null)
                  && (o.vslId !== null ? o.vslId.toUpperCase().includes(vessel) : o.recKey !== null)
                  && (o.awbNo !== null ? o.awbNo.toUpperCase().includes(awbNo) : o.recKey !== null))
              })
            })
          }
        }
      })
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 2000);
    }
  }

  handleResetButton() {
    this.setState({
      loading: true,
      showError: false,
      ordersUpdated: this.state.orders,
      orderSearchInput: '',
      supplierInput: '',
      vesselInput: '',
      awbNoInput: '',
      orderStatus: 'ALL',
      orderStartDate: '01/01/2000',
      orderEndDate: moment().format('DD/MM/YYYY')
    }, () => {
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 2000);
    })

  }

  handleToDespatch(id) {

    console.log('id:  ' + id)
    const serviceEntry = this.state.serviceEntry
    // get despatch detail
    let url = serviceEntry + 'api/despatches/' + id
    console.log(url)
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          despatchDetail: response.mldmasView
        }, () => {
          this.props.parent({ currentIndex: 2 })
          this.props.parent({ showDespatchDetail: true })
          console.log(this.state.despatchDetail)
          this.props.parent({ despatchDetail: this.state.despatchDetail })
        })
      })
  }

  handleBackButton() {
    this.setState({ showOrderDetail: false })
    if (this.props.showOrderDetail === true) {
      this.props.parent({ showOrderDetail: false })
      this.props.parent({ currentIndex: 2 })
    }
  }


  getOrderDetail(recKey, mlbarcodeRecKey) {

    console.log('mlbarcodeRecKey: ', mlbarcodeRecKey);

    this.setState({
      attachments: '',
      picUrl: '',
      showOrderDetail: true
    })

    var serviceEntry = this.props.serviceEntry
    //get order detail
    if (mlbarcodeRecKey == null) {
      let url = serviceEntry + 'api/orders/' + recKey
      console.log(url)
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            orderDetail: response[0]
          })
        })
    } else {
      let url = serviceEntry + 'api/orders-ml/'
      let params = new URLSearchParams();
      params.append('recKey', recKey);
      params.append('mlbarcodeRecKey', mlbarcodeRecKey);
      url += ('?' + params);
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            orderDetail: response[0]
          })
        })
    }


    //get attachments
    let url = serviceEntry + 'api/attachments/'
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

  suppliersView({ index, isScrolling, key, style }) {

    const orderViewHeaderTitleContainer2 = {
      display: 'flex',
      flex: '1',
      paddingLeft: '5px',
    }

    const orderViewHeaderTitle2 = {
      height: '30px',
      fontFamily: 'varela',
      color: 'black',
      textAlign: 'center',
      paddingTop: '5px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }

    let suppliers = this.state.suppliersUpdate

    if (suppliers[index] != null) {
      return (
        <div style={style}
          key={suppliers[index].suppName}>
          <div className="modal-item"
            style={{
              height: '30px',
              cursor: 'point',
              display: 'flex',
              flexDirection: 'row',
              borderBottomStyle: 'solid',
              borderWidth: '1px',
              borderColor: 'rgb(223, 219, 219)',
            }}
            onClick={() => { this.setState({ supplierInput: suppliers[index].suppName, showSupplierModal: false }) }}
          >
            <div style={orderViewHeaderTitleContainer2}>
              <p style={orderViewHeaderTitle2}>{suppliers[index].suppId}</p>
            </div>
            <div style={{
              width: '7vw',
              display: 'flex',
              flex: '3',
              paddingLeft: '5px',
            }}>
              <p style={orderViewHeaderTitle2}>{suppliers[index].suppName}</p>
            </div>
          </div>
        </div>
      )
    }
  }


  vesselsView({ index, isScrolling, key, style }) {

    const orderViewHeaderTitleContainer2 = {
      paddingLeft: '5px',
      display: 'flex',
      flex: '1',
    }

    const orderViewHeaderTitle2 = {
      height: '30px',
      fontFamily: 'varela',
      color: 'black',
      textAlign: 'center',
      paddingTop: '5px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }

    let vessels = this.state.vesselsUpdate

    if (vessels[index] != null) {
      return (
        <div style={style}
          key={vessels[index].vslId}>
          <div className="modal-item"
            style={{
              height: '30px',
              cursor: 'point',
              display: 'flex',
              flexDirection: 'row',
              borderBottomStyle: 'solid',
              borderWidth: '1px',
              borderColor: 'rgb(223, 219, 219)',
            }}
            onClick={() => { this.setState({ vesselInput: vessels[index].vslId, showVesselModal: false }) }}
          >
            <div style={orderViewHeaderTitleContainer2}>
              <p style={orderViewHeaderTitle2}>{vessels[index].vslId}</p>
            </div>
            <div style={{
              width: '7vw',
              display: 'flex',
              flex: '3',
              paddingLeft: '5px',
            }}>
              <p style={orderViewHeaderTitle2}>{vessels[index].name}</p>
            </div>
          </div>
        </div>
      )
    }
  }

  orderView({ index, isScrolling, key, style }) {

    var ordersUpdated = this.state.ordersUpdated

    const orderViewBody = {
      height: '60px',
      width: 'calc(100vw)',
      backgroundColor: 'rgb(236, 236, 236)',
      borderBottomStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgb(204, 202, 202)',
      display: 'flex',
      flexDirection: 'row',
    }

    const orderViewBody2 = {
      height: '60px',
      width: 'calc(100vw)',
      backgroundColor: 'rgb(212, 211, 211)',
      borderBottomStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgb(204, 202, 202)',
      display: 'flex',
      flexDirection: 'row',
    }

    const orderViewBodyItemContainer = {
      width: '6.5vw',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      // flex: '1',
    }

    const orderViewBodyItemContainerVessel = {
      width: '10vw',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      // flex: '1',
    }

    const orderViewBodyItemContainerLast = {
      width: '18.5vw',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      // flex: '1'
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
      <div
        style={style}
        key={index}>
        <div className="main-order-view-body" style={index % 2 === 1 ? orderViewBody : orderViewBody2} onClick={() => this.getOrderDetail(ordersUpdated[index].recKey, ordersUpdated[index].mlbarcodeRecKey)}>
          <div className="main-item-container" style={orderViewBodyItemContainerVessel}>
            <Tooltip placement="right" title={ordersUpdated[index].vslName}>
              <div className="main-item-vessel" style={orderViewBodyItem}>
                {ordersUpdated[index].landedItem === 'LANDED' ? 'OFFLAND: ' : null}{ordersUpdated[index].vslName}
              </div>
            </Tooltip>
          </div>
          <div style={orderViewBodyItemContainer}>
            <Tooltip placement="right" title={ordersUpdated[index].docId}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].docId}
              </div>
            </Tooltip>
          </div>
          <div style={orderViewBodyItemContainer}>
            <div className="main-item" style={orderViewBodyItem}>
              {moment(ordersUpdated[index].stockDate).format('DD/MM/YYYY') === ''
                || moment(ordersUpdated[index].stockDate).format('DD/MM/YYYY').toString().trim().length === 0
                || ordersUpdated[index].stockDate === null
                ? 'EXPECTED' :
                moment(ordersUpdated[index].stockDate).format('DD/MM/YYYY')
              }
            </div>
          </div>
          <div style={orderViewBodyItemContainer}>
            <Tooltip placement="right" title={ordersUpdated[index].mlbarcodeRef3}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].mlbarcodeRef3}
              </div>
            </Tooltip>
          </div>
          <div style={orderViewBodyItemContainer}>
            <Tooltip placement="right" title={ordersUpdated[index].mlbarcodeRef2}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].mlbarcodeRef2}
              </div>
            </Tooltip>
          </div>
          <div style={orderViewBodyItemContainer}>
            <div className="main-item" style={orderViewBodyItem}>
              {/* {ordersUpdated[index].pkgNum} */}
              1
            </div>
          </div>
          <div style={orderViewBodyItemContainer}>
            <div className="main-item" style={orderViewBodyItem}>
              {ordersUpdated[index].pkgUom}
            </div>
          </div>
          <div style={orderViewBodyItemContainer}>
            <div className="main-item" style={orderViewBodyItem}>
              {ordersUpdated[index].pkgWt}
            </div>
          </div>
          <div style={orderViewBodyItemContainer}>
            <Tooltip placement="right" title={ordersUpdated[index].awbNo}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].awbNo}
              </div>
            </Tooltip>
          </div>
          {/* <div style={orderViewBodyItemContainer}>
            <div className="main-item" style={orderViewBodyItem}>
              {ordersUpdated[index].statusFlg}
            </div>
          </div> */}
          <div style={orderViewBodyItemContainer}>
            <Tooltip placement="right" title={ordersUpdated[index].dimension}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].dimension}
              </div>
            </Tooltip>
          </div>
          <div style={orderViewBodyItemContainer}>
            <Tooltip placement="right" title={ordersUpdated[index].mlbarcodeRef1}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].mlbarcodeRef1}
              </div>
            </Tooltip>
          </div>
          <div style={orderViewBodyItemContainer}>
            <Tooltip placement="right" title={ordersUpdated[index].mlbarcodeRef4}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].mlbarcodeRef4}
              </div>
            </Tooltip>
          </div>
          <div style={orderViewBodyItemContainerLast}>
            <Tooltip placement="top" title={ordersUpdated[index].remark}>
              <div className="main-item" style={orderViewBodyItem}>
                {ordersUpdated[index].remark}
              </div>
            </Tooltip>
          </div>
        </div>

      </div>
    )
  }

  orderDetailView() {

    const { orderDetail, attachments, picUrl } = this.state

    const orderDetailTitleContainer = {
      width: '40%',
      // borderRightStyle: 'solid',
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

    const backButton = {
      position: 'absolute',
      left: '10px',
      height: '40px',
      width: '100px',
      backgroundColor: 'rgb(66, 66, 68)',
      borderColor: 'white',
      fontFamily: 'varela',
      paddingTop: '1px',
      paddingLeft: '9px'
    }

    const rightSubTitleContainer = {
      padding: '0px',
      height: '30px',
      width: '200px',
      borderBottomStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgb(204, 202, 202)',
      marginTop: '20px',
      marginBottom: '20px',
    }

    const rightSubTitle = {
      marginLeft: '20px',
      marginBottom: '10px',
      height: '30px',
      width: '200px',
      fontFamily: 'varela',
    }

    const docContainer = {
      margin: '20px',
      padding: '0px',
      height: '40px'
    }

    const doc = {
      marginLeft: '10px',
      marginTop: '10px',
      fontFamily: 'varela',
      fontSize: '14px'
    }


    return (
      <div className="main-despatch-detail-view">
        <div className="main-order-detail-header">
          <div style={orderDetailTitleContainer}>
            <Button
              style={backButton}
              onClick={this.handleBackButton}
              type="primary"
              icon="left-circle">Back</Button>
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
            <div className="main-order-detail-container">
              <p className="main-order-detail-sub-title">STATUS: </p>
              {
                orderDetail.statusFlg === 'DESPATCH' ?
                  <Button
                    style={{ backgroundColor: 'rgb(70, 154, 209)', height: '32px', fontFamily: 'varela', paddingTop: '2px' }}
                    type="primary"
                    onClick={() => this.handleToDespatch(orderDetail.mldRecKey)}
                  >
                    See Despatch
                  </Button>
                  :
                  <TextArea
                    value={orderDetail.statusFlg}
                    autosize={{ minRows: 1, maxRows: 1 }}
                    style={remarkInput}
                    disabled={true} />
              }
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
            <div className="main-order-detail-container" style={{ marginBottom: '25px' }}>
              <p className="main-order-detail-sub-title">DESCRIPTION: </p>
              <TextArea
                value={orderDetail.description}
                autosize={{ minRows: 2, maxRows: 2 }}
                style={remarkInput}
                disabled={true} />
            </div>
            <div className="main-order-detail-container">
              <p className="main-order-detail-sub-title">QTY: </p>
              <TextArea
                value={1}
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
                value={orderDetail.pkgWt + 'kg'}
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
            <div className="main-order-detail-container" style={{ marginBottom: '25px' }}>
              <p className="main-order-detail-sub-title">ITEM PO: </p>
              <TextArea
                value={orderDetail.mlbarcodeRef1}
                autosize={{ minRows: 2, maxRows: 2 }}
                style={remarkInput}
                disabled={true} />
            </div>
            <div className="main-order-detail-container" style={{ marginBottom: '200px' }}>
              <p className="main-order-detail-sub-title">REMARKS: </p>
              <TextArea
                value={orderDetail.remark}
                autosize={{ minRows: 4, maxRows: 4 }}
                style={remarkInput}
                disabled={true} />
            </div>
          </div>
          <div className="main-order-detail-body-right">
            <div style={rightSubTitleContainer}>
              <p style={rightSubTitle}>Import Documents</p>
            </div>
            <div>
              {

                Object.keys(attachments).map(key => {
                  // var docSrc = "http://58.185.33.162/ep_attach/" + attachments[key].name;
                  var docSrc = "http://localhost:8080/EPB_TRANS_TESTAMOS/FTP_FILE/" + attachments[key].ftpFileName;
                  //handle
                  let dotIndex = attachments[key].name.indexOf('.');
                  let length = attachments[key].name.length;
                  let suffix = attachments[key].name.substring(dotIndex + 1, length)

                  if (suffix === 'pdf' || suffix === 'PDF'
                    || suffix === 'xlsx' || suffix === 'XLSX'
                    || suffix === 'xls' || suffix === 'XLS'
                    || suffix === 'doc' || suffix === 'DOC'
                    || suffix === 'docx' || suffix === 'DOCX'
                    || suffix === 'txt' || suffix === 'TXT') {

                    return (
                      <div style={docContainer} key={attachments[key].recKey} onClick={() => { window.open(docSrc) }}>
                        <p className="doc" style={doc}>{attachments[key].name}</p>
                      </div>
                    )
                  }

                  return null
                }
                )
              }
            </div>
            <div style={rightSubTitleContainer}>
              <p style={rightSubTitle}>Pictures</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div className="main-order-detail-info-smallpic-container">
                {

                  Object.keys(attachments).map(key => {
                    // var imgSrc = "http://58.185.33.162/ep_attach/" + attachments[key].name;
                    var imgSrc = "http://localhost:8080/EPB_TRANS_TESTAMOS/FTP_FILE/" + attachments[key].ftpFileName;
                    //handle
                    let dotIndex = attachments[key].name.indexOf('.');
                    let length = attachments[key].name.length;
                    let suffix = attachments[key].name.substring(dotIndex + 1, length)

                    if (suffix === 'jpg' || suffix === 'JPG'
                      || suffix === 'jpeg' || suffix === 'JPEG'
                      || suffix === 'gif' || suffix === 'GIF'
                      || suffix === 'png' || suffix === 'PNG'
                      || suffix === 'tif' || suffix === 'TIF') {

                      return (
                        <div key={attachments[key].recKey}>
                          <img
                            onMouseOver={() => { this.setState({ picUrl: imgSrc }) }}
                            className="small-pic" src={imgSrc} alt={imgSrc} />
                        </div>
                      )
                    }

                    return null
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

  render() {

    const searchInputStyle = {
      fontFamily: 'varela',
      width: '200px',
      marginTop: '15px'
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
      width: '6.5vw',
      borderRightStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'white',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      // flex: '1'
    }

    const orderViewHeaderTitleContainerVessel = {
      width: '10vw',
      borderRightStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'white',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      // flex: '1'
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
      fontFamily: 'varela',
      marginTop: '15px'
    }

    const orderViewHeader2 = {
      height: '30px',
      width: '100%',
      backgroundColor: 'rgb(70, 154, 209)',
      borderBottomStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgb(70, 154, 209)',
      display: 'flex',
      flexDirection: 'row',
      marginTop: '10px'
    }

    const orderViewHeaderTitleContainer2 = {
      borderRightStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'white',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      flex: '1'
    }

    const orderViewHeaderTitle2 = {
      fontSize: '13px',
      fontFamily: 'varela',
      color: 'white',
      textAlign: 'center',
      marginTop: '15px',
    }

    const exportDefaultExcel = () => {
      var _headers = [
        { k: 'vslName', v: 'VESSEL' },
        { k: 'docId', v: 'ASN NUMBER' },
        { k: moment('stockDate').format('DD/MM/YYYY'), v: 'RECEIVE DATE' },
        { k: 'custName', v: 'SUPPLIER' },
        { k: 'description', v: 'DESCRIPTION' },
        { k: 'pkgNum', v: 'QTY' },
        { k: 'pkgUom', v: 'UOM' },
        { k: 'pkgWt', v: 'WEIGHT' },
        { k: 'AwbNo', v: 'AWB' },
        { k: 'dimension', v: 'DIMENSION' },
        { k: 'mlbarcodeRef1', v: 'ITEM PO' },
        { k: 'remark', v: 'REMARKS' },
      ]
      exportExcel(_headers, this.state.ordersUpdated);
    }

    return (
      <div>

        <div className="main-search-view">
          <div className="main-search-title-container">
            <p className="main-search-title" >Search Orders</p>
            <div className="main-search-second-container">
              {/* <p className="main-search-sub-title2">Search</p> */}
              <Input className="main-search-input"
                addonBefore={<div style={{ width: '50px' }}>Search</div>}
                value={this.state.orderSearchInput}
                style={searchInputStyle}
                onChange={this.handleSearchInput}
                disabled={this.state.showOrderDetail}></Input>
              {/* <p className="main-search-sub-title2">Supplier</p> */}
              <Input.Search className="main-search-input2"
                addonBefore={<div style={{ width: '50px' }}>Supplier</div>}
                value={this.state.supplierInput}
                style={searchInputStyle}
                onChange={this.handleSupplierInput}
                disabled={this.state.showOrderDetail}
                onSearch={() => this.setState({ showSupplierModal: true })}></Input.Search>
              {/* <p className="main-search-sub-title2">Vessel</p> */}
              <Input.Search className="main-search-input2"
                addonBefore={<div style={{ width: '50px' }}>Vessel</div>}
                value={this.state.vesselInput}
                style={searchInputStyle}
                onChange={this.handleVesselInput}
                disabled={this.state.showOrderDetail}
                onSearch={() => this.setState({ showVesselModal: true })}></Input.Search>
              {/* <p className="main-search-sub-title2">AWB NO</p> */}
              <Input className="main-search-input"
                addonBefore={<div style={{ width: '50px' }}>Awb No</div>}
                value={this.state.awbNoInput}
                style={searchInputStyle}
                onChange={this.handleAwbNoInput}
                disabled={this.state.showOrderDetail}></Input>
              {/* <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}> */}
              {/* <p className="main-search-sub-title2">Status</p> */}
              <Tooltip placement="right" title="Status">
                <Select
                  className="main-search-select"
                  onChange={this.handleSelect}
                  value={this.state.orderStatus}
                  placeholder="Select Status"
                  style={{ marginTop: '15px', width: '200px' }}
                  disabled={this.state.showOrderDetail}>
                  <Option value="ALL">ALL</Option>
                  <Option value="EXPECTED">EXPECTED</Option>
                  <Option value="STOCK">STOCK</Option>
                  <Option value="DESPATCH">DESPATCH</Option>
                  <Option value="LANDED ITEMS">LANDED ITEMS</Option>
                </Select>
              </Tooltip>
              {/* </div> */}
              {/* <p className="main-search-sub-title2">Start Date</p> */}
              <Tooltip placement="right" title="Start Date">
                <DatePicker
                  className="main-search-date-picker"
                  allowClear={false}
                  style={datePicker}
                  value={moment(this.state.orderStartDate, dateFormatList[0])}
                  placeholder={'Start'}
                  format={dateFormatList}
                  onChange={date => this.handleStartDate(date)}
                  disabled={this.state.showOrderDetail} />
              </Tooltip>
              {/* <p className="main-search-sub-title2">End Date</p> */}
              <Tooltip placement="right" title="End Date">
                <DatePicker
                  className="main-search-date-picker"
                  allowClear={false}
                  style={datePicker}
                  value={moment(this.state.orderEndDate, dateFormatList[0])}
                  format={dateFormatList}
                  onChange={date => this.handleEndDate(date)}
                  disabled={this.state.showOrderDetail} />
              </Tooltip>

              {
                this.state.showError ?
                  <Alert style={{ marginTop: '20px' }} message="Wrong Date Range" type="error" showIcon /> :
                  null
              }
              <Button
                style={{ backgroundColor: 'rgb(70, 154, 209)', marginTop: '16px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                type="primary"
                icon="search"
                disabled={this.state.showOrderDetail}
                onClick={this.handleSearchButton}>Search</Button>
              <Button
                style={{ borderColor: 'rgb(240, 184, 30)', backgroundColor: 'rgb(240, 184, 30)', marginTop: '16px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                type="primary"
                icon="reload"
                disabled={this.state.showOrderDetail}
                onClick={this.handleResetButton}>Reset</Button>
              <Button
                style={{ borderColor: 'rgb(238, 61, 61)', backgroundColor: 'rgb(238, 61, 61)', marginTop: '16px', marginBottom: '50px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                type="primary"
                icon="table"
                disabled={this.state.showOrderDetail}
                onClick={() => exportDefaultExcel()}>Export to Excel</Button>
              <Spin spinning={this.state.loading}></Spin>
            </div>
          </div>
        </div>
        <div>
          {this.state.showOrderDetail ?

            <div>
              {this.orderDetailView()}
            </div>
            :
            <div
              className="main-view2"
              style={{ width: '100vw', maxWidth: 'calc(100vw - 400px)' }}>
              <div className="main-view-header" style={orderViewHeader}>
                <div style={orderViewHeaderTitleContainerVessel}>
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
                  <p style={orderViewHeaderTitle}>DIMENSION</p>
                </div>
                <div style={orderViewHeaderTitleContainer}>
                  <p style={orderViewHeaderTitle}>ITEM PO</p>
                </div>
                <div style={orderViewHeaderTitleContainer}>
                  <p style={orderViewHeaderTitle}>PRIORITY</p>
                </div>
                <div
                  style={{
                    width: '18.5vw',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    // flex: '1'
                  }}>
                  <p style={orderViewHeaderTitle}>REMARKS</p>
                </div>
              </div>
              <AutoSizer style={{ height: 'calc(100vh - 60px)', width: 'calc(100vw)', resize: 'both' }}>
                {({ height, width }) => (
                  <List
                    className="list"
                    width={width + 400}
                    height={height}
                    rowHeight={60}
                    rowRenderer={this.orderView}
                    rowCount={this.state.ordersUpdated.length} />
                )}
              </AutoSizer>
            </div>
          }


        </div>
        <Modal
          visible={this.state.showSupplierModal}
          style={{ fontFamily: 'varela' }}
          title="Supplier"
          onOk={() => this.setState({ showSupplierModal: false })}
          onCancel={() => this.setState({ showSupplierModal: false })}
        >
          <Input.Search
            className="main-search-input2"
            onChange={this.handleSupplierInput}
          >
          </Input.Search>
          <div style={orderViewHeader2}>
            <div style={orderViewHeaderTitleContainer2}>
              <p style={orderViewHeaderTitle2}>Supplier Id</p>
            </div>
            <div style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              flex: '3'
            }}>
              <p style={orderViewHeaderTitle2}>Name</p>
            </div>
          </div>
          <div>
            <AutoSizer style={{ height: 'calc(50vh)', width: 'calc(50vw)', resize: 'both' }}>
              {({ height, width }) => (
                <List
                  className="list"
                  width={width}
                  height={height}
                  rowHeight={30}
                  rowRenderer={this.suppliersView}
                  rowCount={this.state.suppliersUpdate.length} />
              )}
            </AutoSizer>
          </div>
        </Modal>
        <Modal
          visible={this.state.showVesselModal}
          style={{ fontFamily: 'varela' }}
          title="Vessel"
          onOk={() => this.setState({ showVesselModal: false })}
          onCancel={() => this.setState({ showVesselModal: false })}
        >
          <Input.Search
            className="main-search-input2"
            onChange={this.handleVesselInput}
          >
          </Input.Search>
          <div style={orderViewHeader2}>
            <div style={orderViewHeaderTitleContainer2}>
              <p style={orderViewHeaderTitle2}>Vessel Id</p>
            </div>
            <div style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              flex: '3'
            }}>
              <p style={orderViewHeaderTitle2}>Name</p>
            </div>
          </div>
          <div>
            <AutoSizer style={{ height: 'calc(50vh)', width: 'calc(50vw)', resize: 'both' }}>
              {({ height, width }) => (
                <List
                  className="list"
                  width={width}
                  height={height}
                  rowHeight={30}
                  rowRenderer={this.vesselsView}
                  rowCount={this.state.vesselsUpdate.length} />
              )}
            </AutoSizer>
          </div>
        </Modal>
      </div>
    );
  }

}

export default OrderView;