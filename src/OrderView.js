import React, { Component ,PureComponent} from 'react';
import { DatePicker, Select, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import { exportExcel } from 'xlsx-oc'
import './App.css';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const Option = Select.Option;
const { TextArea } = Input;


class OrderView extends PureComponent {

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
      orders: '',
      ordersUpdated: '',
      serviceEntry: this.props.serviceEntry,
      home: this.props.home,
      showDetail: false
    }
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleStartDate = this.handleStartDate.bind(this)
    this.handleEndDate = this.handleEndDate.bind(this)
    this.handleSearchButton = this.handleSearchButton.bind(this)
    this.handleResetButton = this.handleResetButton.bind(this)
  }

  componentDidMount() {
    const { home, serviceEntry } = this.state
    console.log(home.isadmin)

    if (home.isadmin === 'Y') {
      //get orders
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
      //get orders
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
    const { orderSearchInput, orderStatus, orderStartDate, orderEndDate, orders } = this.state;
    console.log("orderSearchInput  " + orderSearchInput)
    console.log("orderStatus  " + orderStatus)
    console.log("orderStartDate  " + orderStartDate)
    console.log("orderEndDate  " + orderEndDate)

    const date1 = moment(orderStartDate, dateFormatList[0]);
    const date2 = moment(orderEndDate, dateFormatList[0]);
    const text = orderSearchInput.toUpperCase();

    if (orderStatus === 'ALL') {
      if (orderSearchInput === '' || orderSearchInput.toString().trim().length === 0) {
        this.setState({
          ordersUpdated: orders.filter(o => {
            return (
              (moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
              || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
          })
        })
      } else {
        this.setState({
          ordersUpdated: this.state.orders.filter(o => {
            return (
              ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                  && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
              && (
                (o.vslName !== null ? o.vslName.toString().toUpperCase().includes(text) : '')
                || (o.suppName !== null ? o.suppName.toUpperCase().includes(text) : '')
                || (o.itemRef !== null ? o.itemRef.toUpperCase().includes(text) : '')
                || (o.description !== null ? o.description.toUpperCase().includes(text) : '')
                || (o.remark !== null ? o.remark.toUpperCase().includes(text) : '')
                || (o.awbNo !== null ? o.awbNo.toUpperCase().includes(text) : '')
              )
            )
          })
        })
      }
    } else if (orderStatus === 'LANDED ITEMS') {
      if (orderSearchInput === '' || orderSearchInput.toString().trim().length === 0) {
        this.setState({
          ordersUpdated: orders.filter(o => {
            return (
              ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                  && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
              && o.landedItem === 'LANDED')
          })
        })
      } else {
        this.setState({
          ordersUpdated: this.state.orders.filter(o => {
            return (
              ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                  && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
              && (
                (o.vslName !== null ? o.vslName.toString().toUpperCase().includes(text) : '')
                || (o.suppName !== null ? o.suppName.toUpperCase().includes(text) : '')
                || (o.itemRef !== null ? o.itemRef.toUpperCase().includes(text) : '')
                || (o.description !== null ? o.description.toUpperCase().includes(text) : '')
                || (o.remark !== null ? o.remark.toUpperCase().includes(text) : '')
                || (o.awbNo !== null ? o.awbNo.toUpperCase().includes(text) : ''))
              && o.landedItem === 'LANDED')
          })
        })
      }
    } else {
      if (orderSearchInput === '' || orderSearchInput.toString().trim().length === 0) {
        this.setState({
          ordersUpdated: orders.filter(o => {
            return (
              ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                  && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
              && o.statusFlg === orderStatus)
          })
        })
      } else {
        this.setState({
          ordersUpdated: this.state.orders.filter(o => {
            return (
              ((moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                && moment(moment(o.stockDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                || (moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                  && moment(moment(o.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2))
              && (
                (o.vslName !== null ? o.vslName.toString().toUpperCase().includes(text) : '')
                || (o.suppName !== null ? o.suppName.toUpperCase().includes(text) : '')
                || (o.itemRef !== null ? o.itemRef.toUpperCase().includes(text) : '')
                || (o.description !== null ? o.description.toUpperCase().includes(text) : '')
                || (o.remark !== null ? o.remark.toUpperCase().includes(text) : '')
                || (o.awbNo !== null ? o.awbNo.toUpperCase().includes(text) : ''))
              && o.statusFlg === orderStatus)
          })
        })
      }
    }

  }

  handleResetButton() {
    const { home, serviceEntry } = this.state

    if (home.isadmin === 'Y') {
      //get orders admin 
      console.log('get orders')
      let url = serviceEntry + 'api/all-orders/'
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            orders: response,
            ordersUpdated: response,
            orderSearchInput: '',
            orderStatus: 'ALL',
            orderStartDate: '01/01/2000',
            orderEndDate: moment().format('DD/MM/YYYY')
          })
        })
    } else {
      //get orders common
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
            orders: response,
            ordersUpdated: response,
            orderSearchInput: '',
            orderStatus: 'ALL',
            orderStartDate: '01/01/2000',
            orderEndDate: moment().format('DD/MM/YYYY')
          })
        })
    }

  }

  getOrderDetail(recKey) {

    this.setState({
      attachments: '',
      picUrl: '',
      showDetail: true
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

    var ordersUpdated = this.state.ordersUpdated

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
          Object.keys(ordersUpdated).map(key =>
            <div key={ordersUpdated[key].recKey} className="main-order-view-body" style={orderViewBody} onClick={() => this.getOrderDetail(ordersUpdated[key].recKey)}>
              <div className="main-item-container" style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].landedItem === 'LANDED' ? 'OFFLAND: ' : null}{ordersUpdated[key].vslName}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].docId}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {moment(ordersUpdated[key].stockDate).format('DD/MM/YYYY') === ''
                    || moment(ordersUpdated[key].stockDate).format('DD/MM/YYYY').toString().trim().length === 0
                    || ordersUpdated[key].stockDate === null
                    ? 'EXPECTED' :
                    moment(ordersUpdated[key].stockDate).format('DD/MM/YYYY')
                  }
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].landedItem === 'LANDED' ?
                    ordersUpdated[key].custName :
                    ordersUpdated[key].suppName}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].landedItem === 'LANDED' ?
                    'LANDED ITEM' :
                    ordersUpdated[key].itemRef}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].description}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].pkgNum}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].pkgUom}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].pkgWt}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].AwbNo}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].statusFlg}
                </div>
              </div>
              <div style={orderViewBodyItemContainer}>
                <div className="main-item" style={orderViewBodyItem}>
                  {ordersUpdated[key].dimension}
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
                  {ordersUpdated[key].remark}
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
              onClick={() => this.setState({ showDetail: false })}
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
                  var docSrc = "http://58.185.33.162/ep_attach/" + attachments[key].name;

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
                    var imgSrc = "http://58.185.33.162/ep_attach/" + attachments[key].name;

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
      textAlign: 'center',
      width: '154px'
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

    const exportDefaultExcel = () => {
      var _headers = [
        { k: 'vslName', v: 'VESSEL' },
        { k: 'docId', v: 'ASN NUMBER' },
        { k: moment('stockDate').format('DD/MM/YYYY'), v: 'RECEIVE DATE' },
        { k: 'custName', v: 'SUPPLIER' },
        { k: 'itemRef', v: 'PO NUMBER' },
        { k: 'description', v: 'DESCRIPTION' },
        { k: 'pkgNum', v: 'QTY' },
        { k: 'pkgUom', v: 'UOM' },
        { k: 'pkgWt', v: 'WEIGHT' },
        { k: 'AwbNo', v: 'AWB' },
        { k: 'statusFlg', v: 'STATUS' },
        { k: 'dimension', v: 'DIMENSION' },
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
              <p className="main-search-sub-title">Search</p>
              <Input className="main-search-input"
                value={this.state.orderSearchInput}
                style={searchInputStyle}
                onChange={this.handleSearchInput}
                disabled={this.state.showDetail}></Input>
              <p className="main-search-sub-title">Status</p>
              <Select
                className="main-search-select"
                onChange={this.handleSelect}
                value={this.state.orderStatus}
                disabled={this.state.showDetail}>
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
                value={moment(this.state.orderStartDate, dateFormatList[0])}
                format={dateFormatList}
                onChange={date => this.handleStartDate(date)}
                disabled={this.state.showDetail} />
              <p className="main-search-sub-title">End Date</p>
              <DatePicker
                className="main-search-date-picker"
                allowClear={false}
                style={datePicker}
                value={moment(this.state.orderEndDate, dateFormatList[0])}
                format={dateFormatList}
                onChange={date => this.handleEndDate(date)}
                disabled={this.state.showDetail} />
              <Button
                style={{ backgroundColor: 'rgb(70, 154, 209)', marginTop: '50px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                type="primary"
                icon="search"
                onClick={this.handleSearchButton}>Search</Button>
              <Button
                style={{ borderColor: 'rgb(240, 184, 30)', backgroundColor: 'rgb(240, 184, 30)', marginTop: '50px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                type="primary"
                icon="reload"
                onClick={this.handleResetButton}>Reset</Button>
              <Button
                style={{ borderColor: 'rgb(238, 61, 61)', backgroundColor: 'rgb(238, 61, 61)', marginTop: '50px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                type="primary"
                icon="table"
                onClick={() => exportDefaultExcel()}>Export to Excel</Button>
            </div>
          </div>
        </div>
        <div>
          {this.state.showDetail ?

            <div>
              {this.orderDetailView()}
            </div>
            :
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
          }


        </div>
      </div>
    );
  }

}

export default OrderView;