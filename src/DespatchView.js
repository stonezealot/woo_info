import React, { Component } from 'react';
import { DatePicker, Select, Input, Button, Alert } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import { List, AutoSizer } from "react-virtualized";
import './App.css';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const Option = Select.Option;
const { TextArea } = Input;

class DespatchView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            despatchDetail: '',
            orderAttachments: '',
            attachments: '',
            picUrl: '',
            orderPicUrl: '',
            despatchSearchInput: '',
            despatchStatus: 'ALL',
            despatchStartDate: '01/01/2000',
            despatchEndDate: moment().format('DD/MM/YYYY'),
            despatches: '',
            despatchesUpdated: '',
            serviceEntry: this.props.serviceEntry,
            home: this.props.home,
            changeDetail: false,
            orders: '',
            orderDetail: '',
            showDespatchDetail: this.props.showDespatchDetail,
            showOrderDetail: false,
            showError: false,
        }
        this.handleSearchInput = this.handleSearchInput.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleStartDate = this.handleStartDate.bind(this)
        this.handleEndDate = this.handleEndDate.bind(this)
        this.handleSearchButton = this.handleSearchButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.despatchView = this.despatchView.bind(this)
        this.handleBackButton = this.handleBackButton.bind(this)
        this.handleToOrder = this.handleToOrder.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showDespatchDetail === true) {
            this.setState({
                showDespatchDetail: true,
                despatchDetail: nextProps.despatchDetail
            })
        }
    }

    componentDidMount() {
        console.log('现在是： DespatchView componentDidMount')
        const { home, serviceEntry } = this.state

        if (home.isadmin === 'Y') {
            //get despatches admin
            console.log('get despatches')
            let url = serviceEntry + 'api/all-despatches/'
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        despatchesUpdated: response,
                        despatches: response
                    }, () => { console.log('despatches complete') })
                })
        } else {
            //get despatches common
            console.log('get despatches')
            let url = serviceEntry + 'api/despatches/'
            let params = new URLSearchParams();
            params.append('custId', home.custId);
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        despatchesUpdated: response,
                        despatches: response
                    })
                })
        }

    }

    handleSearchInput(e) {
        if (e.target.value.length === 0) {
            this.setState({ despatchSearchInput: e.target.value });
        } else {
            this.setState({ despatchSearchInput: e.target.value });
        }
    }

    handleSelect(value) {
        this.setState({ despatchStatus: value })
    }

    handleStartDate(date) {
        this.setState({ despatchStartDate: moment(date).format('DD/MM/YYYY') })
    }

    handleEndDate(date) {
        this.setState({ despatchEndDate: moment(date).format('DD/MM/YYYY') })
    }

    handleSearchButton() {
        const { despatchSearchInput, despatchStatus, despatchStartDate, despatchEndDate, despatches } = this.state;
        console.log("despatchSearchInput  " + despatchSearchInput)
        console.log("despatchStatus  " + despatchStatus)
        console.log("despatchStartDate  " + despatchStartDate)
        console.log("despatchEndDate  " + despatchEndDate)

        const date1 = moment(despatchStartDate, dateFormatList[0]);
        const date2 = moment(despatchEndDate, dateFormatList[0]);
        const text = despatchSearchInput.toUpperCase();

        if (date1 > date2) {
            this.setState({
                showError: true
            })
        } else {
            if (despatchStatus === 'ALL') {
                if (despatchSearchInput === '' || despatchSearchInput.toString().trim().length === 0) {
                    this.setState({
                        showError: false,
                        despatchesUpdated: despatches.filter(d => {
                            return (
                                moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                                && moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2
                            )
                        })
                    })
                } else {
                    this.setState({
                        showError: false,
                        despatchesUpdated: despatches.filter(d => {
                            return (
                                (moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                                    && moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                                && (
                                    (d.vslName !== null ? d.vslName.toString().toUpperCase().includes(text) : '')
                                    || (d.shipName !== null ? d.shipName.toString().toUpperCase().includes(text) : '')
                                    || (d.marking !== null ? d.marking.toString().toUpperCase().includes(text) : '')
                                    || (d.custName !== null ? d.custName.toString().toUpperCase().includes(text) : '')
                                    || (d.consName !== null ? d.consName.toString().toUpperCase().includes(text) : '')
                                    || (d.permitNo !== null ? d.permitNo.toString().toUpperCase().includes(text) : '')
                                    || (d.carrier !== null ? d.carrier.toString().toUpperCase().includes(text) : '')
                                    || (d.awbNo !== null ? d.awbNo.toString().toUpperCase().includes(text) : '')
                                    || (d.destination !== null ? d.destination.toString().toUpperCase().includes(text) : '')
                                )
                            )
                        })
                    })
                }
            } else {
                if (despatchSearchInput === '' || despatchSearchInput.toString().trim().length === 0) {
                    this.setState({
                        showError: false,
                        despatchesUpdated: despatches.filter(d => {
                            return (
                                (moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                                    && moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                                && d.statusFlg === despatchStatus
                            )
                        })
                    })
                } else {
                    this.setState({
                        showError: false,
                        despatchesUpdated: despatches.filter(d => {
                            return (
                                (moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                                    && moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2)
                                && (
                                    (d.vslName !== null ? d.vslName.toString().toUpperCase().includes(text) : '')
                                    || (d.shipName !== null ? d.shipName.toString().toUpperCase().includes(text) : '')
                                    || (d.marking !== null ? d.marking.toString().toUpperCase().includes(text) : '')
                                    || (d.custName !== null ? d.custName.toString().toUpperCase().includes(text) : '')
                                    || (d.consName !== null ? d.consName.toString().toUpperCase().includes(text) : '')
                                    || (d.permitNo !== null ? d.permitNo.toString().toUpperCase().includes(text) : '')
                                    || (d.carrier !== null ? d.carrier.toString().toUpperCase().includes(text) : '')
                                    || (d.awbNo !== null ? d.awbNo.toString().toUpperCase().includes(text) : '')
                                    || (d.destination !== null ? d.destination.toString().toUpperCase().includes(text) : '')
                                )
                                && d.statusFlg === despatchStatus
                            )
                        })
                    })
                }
            }
        }

    }

    handleResetButton() {

        this.setState({
            showError: false,
            despatchesUpdated: this.state.despatches,
            despatchSearchInput: '',
            despatchStatus: 'ALL',
            despatchStartDate: '01/01/2000',
            despatchEndDate: moment().format('DD/MM/YYYY')
        })
    }

    handleBackButton() {

        this.setState({ showDespatchDetail: false })
        if (this.props.showDespatchDetail === true) {
            this.props.parent({ showDespatchDetail: false })
            this.props.parent({ currentIndex: 1 })
        }
    }

    handleToOrder(recKey) {
        console.log('recKey:  ' + recKey)
        const serviceEntry = this.state.serviceEntry
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
                }, () => {
                    this.props.parent({ currentIndex: 1 })
                    this.props.parent({ showOrderDetail: true })
                    console.log(this.state.orderDetail)
                    this.props.parent({ orderDetail: this.state.orderDetail })
                })
            })

    }

    getDespatchDetail(recKey) {

        this.setState({
            changeDetail: true,
            showDespatchDetail: true,
            picUrl: '',
            attachments: '',
        })

        var serviceEntry = this.props.serviceEntry
        //get despatch detail
        let url = serviceEntry + 'api/despatches/' + recKey
        console.log(url)
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    despatchDetail: response.mldmasView
                })
            })

        //get orders by despatch id
        url = serviceEntry + 'api/orders-by-despatch-id/'
        let params = new URLSearchParams();
        params.append('despatchId', recKey);
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

        //get attachments
        url = serviceEntry + 'api/attachments/'
        params = new URLSearchParams();
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

    // divScroll() {
    //     var divscroll = document.getElementById('right-view');
    //     var scrollTop = divscroll.scrollTop;
    //     var wholeHeight = divscroll.scrollHeight;
    //     var divHeight = divscroll.clientHeight;
    //     console.log(scrollTop + '  ' + wholeHeight + '  ' + divHeight)
    //     divscroll.scrollBy(0, -scrollTop);
    // }

    // getOrderDetail(recKey) {

    //     this.divScroll()

    //     this.setState({
    //         orderPicUrl: '',
    //         showOrderDetail: true
    //     })

    //     var serviceEntry = this.props.serviceEntry
    //     //get order detail
    //     let url = serviceEntry + 'api/orders/' + recKey
    //     console.log(url)
    //     fetch(url, {
    //         method: 'GET'
    //     })
    //         .then(response => response.json())
    //         .then(response => {
    //             this.setState({
    //                 orderDetail: response.mlmasView
    //             })
    //         })

    //     //get attachments
    //     url = serviceEntry + 'api/attachments/'
    //     let params = new URLSearchParams();
    //     params.append('srcRecKey', recKey);
    //     url += ('?' + params);
    //     fetch(url, {
    //         method: 'GET'
    //     })
    //         .then(response => response.json())
    //         .then(response => {
    //             this.setState({
    //                 orderAttachments: response
    //             })
    //         })
    // }

    despatchView({ index, isScrolling, key, style }) {

        var despatchesUpdated = this.state.despatchesUpdated

        const despatchViewBody = {
            height: '60px',
            width: 'calc(100vw - 400px)',
            backgroundColor: 'rgb(236, 236, 236)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(204, 202, 202)',
            display: 'flex',
            flexDirection: 'row',
        }

        const despatchViewBody2 = {
            height: '60px',
            width: 'calc(100vw - 400px)',
            backgroundColor: 'rgb(212, 211, 211)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(204, 202, 202)',
            display: 'flex',
            flexDirection: 'row',
        }

        const despatchViewBodyItemContainer = {
            width: 'calc((100vw - 400px)/9',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1',
        }

        const despatchViewBodyItem = {
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
                key={despatchesUpdated[index].recKey}>
                <div className="main-order-view-body" style={index % 2 === 1 ? despatchViewBody : despatchViewBody2} onClick={() => this.getDespatchDetail(despatchesUpdated[index].recKey)}>
                    <div className="main-item-container" style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].vslName}
                        </div>
                    </div>
                    <div style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].custName}
                        </div>
                    </div>
                    <div style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].marking}
                        </div>
                    </div>
                    <div style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {moment(despatchesUpdated[index].docDate).format('DD/MM/YYYY')}
                        </div>
                    </div>
                    <div style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].destination}
                        </div>
                    </div>
                    <div style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].totalPkgNum}
                        </div>
                    </div>
                    <div style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].totalPkgWt}
                        </div>
                    </div>
                    <div style={despatchViewBodyItemContainer}>
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].awbNo}
                        </div>
                    </div>
                    <div
                        style={{
                            width: 'calc((100vw - 400px)/9',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            flex: '1'
                        }}
                    >
                        <div className="main-item" style={despatchViewBodyItem}>
                            {despatchesUpdated[index].statusFlg}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    despatchDetailView() {

        console.log(this.state.despatchDetail)

        const { despatchDetail, attachments, picUrl } = this.state

        const despatchDetailTitleContainer = {
            width: '40%',
            // borderRightStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'white',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
        }

        const despatchDetailTitle = {
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

        const changeDetailButton = {
            position: 'absolute',
            left: 'calc(40% - 120px)',
            height: '40px',
            width: '120px',
            backgroundColor: 'rgb(66, 66, 68)',
            borderColor: 'white',
            fontFamily: 'varela',
            paddingTop: '1px',
            paddingLeft: '9px'
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
            <div id="right-view" className="main-despatch-detail-view">
                <div className="main-order-detail-header">
                    {this.state.changeDetail ?
                        <div style={despatchDetailTitleContainer}>
                            <Button
                                style={backButton}
                                onClick={this.handleBackButton}
                                type="primary"
                                icon="left-circle">Back</Button>
                            <p style={despatchDetailTitle}>Origin Details</p>
                            <Button
                                style={changeDetailButton}
                                onClick={() => this.setState({ changeDetail: !this.state.changeDetail })}
                                type="primary"
                                icon="reload">Consignee</Button>
                        </div>
                        :
                        <div style={despatchDetailTitleContainer}>
                            <Button
                                style={backButton}
                                onClick={this.handleBackButton}
                                type="primary"
                                icon="left-circle">Back</Button>
                            <p style={despatchDetailTitle}>Consignee Details</p>
                            <Button
                                style={changeDetailButton}
                                onClick={() => this.setState({ changeDetail: !this.state.changeDetail })}
                                type="primary"
                                icon="reload">Origin</Button>
                        </div>
                    }
                    <div style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        flex: '1'
                    }}>
                        <p style={despatchDetailTitle}>More Info</p>
                    </div>
                </div>
                {this.state.changeDetail ?
                    <div className="main-order-detail-body">
                        <div className="main-order-detail-body-left">
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">VESSEL: </p>
                                <TextArea
                                    value={despatchDetail.vslName}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">MARKING: </p>
                                <TextArea
                                    value={despatchDetail.marking}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">WEIGHT: </p>
                                <TextArea
                                    value={despatchDetail.totalPkgWt}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">DATE: </p>
                                <TextArea
                                    value={moment(despatchDetail.docDate).format('DD/MM/YYYY')}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">DESTINATION: </p>
                                <TextArea
                                    value={despatchDetail.destination}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">ETA: </p>
                                <TextArea
                                    value={despatchDetail.eta !== null ? moment(despatchDetail.eta).format('DD/MM/YYYY') : ''}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">ETD: </p>
                                <TextArea
                                    value={despatchDetail.etd !== null ? moment(despatchDetail.etd).format('DD/MM/YYYY') : ''}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">QTY: </p>
                                <TextArea
                                    value={despatchDetail.totalPkgNum}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">PACKED AS: </p>
                                <TextArea
                                    value={despatchDetail.packAs}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">CARRIER: </p>
                                <TextArea
                                    value={despatchDetail.carrier}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">AWB: </p>
                                <TextArea
                                    value={despatchDetail.awbNo}
                                    autosize={{ minRows: 1, maxRows: 1 }}
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
                    :
                    <div className="main-order-detail-body">
                        <div className="main-order-detail-body-left">
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">VESSEL: </p>
                                <TextArea
                                    value={despatchDetail.vslName}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">MARKING: </p>
                                <TextArea
                                    value={despatchDetail.marking}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">CONSIGNEE: </p>
                                <TextArea
                                    value={despatchDetail.consName}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">ADDRESS 1: </p>
                                <TextArea
                                    value={despatchDetail.consAddress1}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">ADDRESS 2: </p>
                                <TextArea
                                    value={despatchDetail.consAddress2}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">ADDRESS 3: </p>
                                <TextArea
                                    value={despatchDetail.consAddress3}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">ADDRESS 4: </p>
                                <TextArea
                                    value={despatchDetail.consAddress4}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">CITY: </p>
                                <TextArea
                                    value={despatchDetail.consCityId}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">STATE: </p>
                                <TextArea
                                    value={despatchDetail.consStateId}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">COUNTRY: </p>
                                <TextArea
                                    value={despatchDetail.consCountryId}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">PHONE: </p>
                                <TextArea
                                    value={despatchDetail.consPhone}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">FAX: </p>
                                <TextArea
                                    value={despatchDetail.consFax}
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    style={remarkInput}
                                    disabled={true} />
                            </div>
                            <div className="main-order-detail-container">
                                <p className="main-order-detail-sub-title">EMAIL: </p>
                                <TextArea
                                    value={despatchDetail.consEmailAddr}
                                    autosize={{ minRows: 1, maxRows: 1 }}
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
                }
                <div className="main-order-detail-header">
                    <div style={{
                        width: '100%',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        flex: '1',
                    }}>
                        <p style={despatchDetailTitle}>Orders in Despatch</p>
                    </div>
                </div>
                <div className="main-view3"
                    style={{ width: '100vw', maxWidth: 'calc(100vw - 400px)' }}>
                    <div>
                        <div className="main-view-header" style={orderViewHeader}>
                            <div style={orderViewHeaderTitleContainer}>
                                <p style={orderViewHeaderTitle}>VESSEL NAME</p>
                            </div>
                            <div style={orderViewHeaderTitleContainer}>
                                <p style={orderViewHeaderTitle}>CUSTOMER</p>
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
                                <p style={orderViewHeaderTitle}>ITEM PO</p>
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
                </div>
            </div>
        )

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
                        <div key={orders[key].recKey} className="main-order-view-body" style={orderViewBody}
                            onClick={() => this.handleToOrder(orders[key].recKey)}
                        >
                            <div className="main-item-container" style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].vslName}
                                </div>
                            </div>
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].custName}
                                </div>
                            </div>
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].docId}
                                </div>
                            </div>
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {moment(orders[key].stockDate).format('DD/MM/YYYY') === ''
                                        || moment(orders[key].stockDate).format('DD/MM/YYYY').toString().trim().length === 0
                                        || orders[key].stockDate === null
                                        ? 'EXPECTED' :
                                        moment(orders[key].stockDate).format('DD/MM/YYYY')
                                    }
                                </div>
                            </div>
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].suppName}
                                </div>
                            </div>
                            {/* <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].landedItem === 'LANDED' ?
                                        'LANDED ITEM' :
                                        orders[key].itemRef}
                                </div>
                            </div> */}
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].mlbarcodeRef1}
                                </div>
                            </div>
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].description}
                                </div>
                            </div>
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    1
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

    render() {

        console.log('show detail:  ' + this.state.showDespatchDetail)

        const searchInputStyle = {
            fontFamily: 'varela',
            textAlign: 'center',
            width: '154px'
        }

        const despatchViewHeader = {
            height: '60px',
            width: 'calc(100vw - 400px)',
            backgroundColor: 'rgb(70, 154, 209)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(70, 154, 209)',
            display: 'flex',
            flexDirection: 'row',
        }

        const despatchViewHeaderTitleContainer = {
            width: 'calc((100vw - 400px)/9',
            borderRightStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'white',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1'
        }

        const despatchViewHeaderTitle = {
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
                        <p className="main-search-title" >Search Despatches</p>
                        <div className="main-search-second-container">
                            <p className="main-search-sub-title">Search</p>
                            <Input className="main-search-input"
                                value={this.state.despatchSearchInput}
                                style={searchInputStyle}
                                onChange={this.handleSearchInput}
                                disabled={this.state.showDespatchDetail}></Input>
                            <p className="main-search-sub-title">Status</p>
                            <Select
                                className="main-search-select"
                                onChange={this.handleSelect}
                                value={this.state.despatchStatus}
                                disabled={this.state.showDespatchDetail}>
                                <Option value="ALL">ALL</Option>
                                <Option value="DESPATCH">DESPATCH</Option>
                                <Option value="HISTORY">HISTORY</Option>
                            </Select>
                            <p className="main-search-sub-title">Start Date</p>
                            <DatePicker
                                className="main-search-date-picker"
                                allowClear={false}
                                style={datePicker}
                                value={moment(this.state.despatchStartDate, dateFormatList[0])}
                                format={dateFormatList}
                                onChange={date => this.handleStartDate(date)}
                                disabled={this.state.showDespatchDetail} />
                            <p className="main-search-sub-title">End Date</p>
                            <DatePicker
                                className="main-search-date-picker"
                                allowClear={false}
                                style={datePicker}
                                value={moment(this.state.despatchEndDate, dateFormatList[0])}
                                format={dateFormatList}
                                onChange={date => this.handleEndDate(date)}
                                disabled={this.state.showDespatchDetail} />
                            {
                                this.state.showError ?
                                    <Alert style={{ marginTop: '20px' }} message="Wrong Date Range" type="error" showIcon /> :
                                    null
                            }
                            <Button
                                style={{ backgroundColor: 'rgb(70, 154, 209)', marginTop: '50px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                                type="primary"
                                icon="search"
                                disabled={this.state.showDespatchDetail}
                                onClick={this.handleSearchButton}>Search</Button>
                            <Button
                                style={{ borderColor: 'rgb(240, 184, 30)', backgroundColor: 'rgb(240, 184, 30)', marginTop: '50px', height: '32px', width: '150px', fontFamily: 'varela', paddingTop: '2px' }}
                                type="primary"
                                icon="reload"
                                disabled={this.state.showDespatchDetail}
                                onClick={this.handleResetButton}>Reset</Button>
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.showDespatchDetail ?

                        <div>
                            {this.despatchDetailView()}
                        </div>
                        :
                        <div
                            className="main-view2"
                            style={{ width: '100vw' }}>
                            <div className="main-view-header" style={despatchViewHeader}>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>VESSEL</p>
                                </div>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>CUSTOMER</p>
                                </div>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>MARKING</p>
                                </div>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>EXPORT DATE</p>
                                </div>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>DESTINATION</p>
                                </div>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>QTY</p>
                                </div>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>WEIGHT</p>
                                </div>
                                <div style={despatchViewHeaderTitleContainer}>
                                    <p style={despatchViewHeaderTitle}>AWB</p>
                                </div>
                                <div style={{
                                    width: '7vw',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flex: '1'
                                }}>
                                    <p style={despatchViewHeaderTitle}>STATUS</p>
                                </div>
                            </div>
                            <AutoSizer style={{ height: 'calc(100vh - 198px)', width: 'calc(100vw - 400px)', resize: 'both' }}>
                                {({ height, width }) => (
                                    <List
                                        className="list"
                                        width={width}
                                        height={height}
                                        rowHeight={60}
                                        rowRenderer={this.despatchView}
                                        rowCount={this.state.despatchesUpdated.length}
                                    />
                                )}
                            </AutoSizer>
                        </div>
                    }


                </div>
            </div>
        );
    }
}

export default DespatchView;