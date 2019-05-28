import React, { Component } from 'react';
import { DatePicker, Select, Input, Button, Icon } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import './App.css';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const Option = Select.Option;
const { TextArea } = Input;

class DespatchView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            despatchDetail: '',
            attachments: '',
            picUrl: '',
            despatchSearchInput: '',
            despatchStatus: 'ALL',
            despatchStartDate: '01/01/2000',
            despatchEndDate: moment().format('DD/MM/YYYY'),
            despatches: '',
            despatchesUpdated: '',
            serviceEntry: this.props.serviceEntry,
            home: this.props.home,
            changeDetail: false,
            orders: ''
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

        //get despatches
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

        if (despatchStatus === 'ALL') {
            if (despatchSearchInput === '' || despatchSearchInput.toString().trim().length === 0) {
                this.setState({
                    despatchesUpdated: despatches.filter(d => {
                        return (
                            moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) >= date1
                            && moment(moment(d.docDate).format('DD/MM/YYYY'), dateFormatList[0]) <= date2
                        )
                    })
                })
            } else {
                this.setState({
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

    handleResetButton() {
        const { home, serviceEntry } = this.state
        //get despatches
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
                    despatches: response,
                    despatchesUpdated: response,
                    despatchSearchInput: '',
                    despatchStatus: 'ALL',
                    despatchStartDate: '01/01/2000',
                    despatchEndDate: moment().format('DD/MM/YYYY')
                }, () => {
                    console.log("despatchSearchInput  " + this.state.despatchSearchInput)
                    console.log("despatchStatus  " + this.state.despatchStatus)
                    console.log("despatchStartDate  " + this.state.despatchStartDate)
                    console.log("despatchEndDate  " + this.state.despatchEndDate)
                })
            })
    }

    getDespatchDetail(recKey) {

        this.setState({
            changeDetail: true
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

    }

    despatchView() {

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
            <div>
                {
                    Object.keys(despatchesUpdated).map(key =>
                        <div key={despatchesUpdated[key].recKey} className="main-order-view-body" style={despatchViewBody} onClick={() => this.getDespatchDetail(despatchesUpdated[key].recKey)}>
                            <div className="main-item-container" style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {despatchesUpdated[key].vslName}
                                </div>
                            </div>
                            <div style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {despatchesUpdated[key].custName}
                                </div>
                            </div>
                            <div style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {despatchesUpdated[key].marking}
                                </div>
                            </div>
                            <div style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {moment(despatchesUpdated[key].docDate).format('DD/MM/YYYY')}
                                </div>
                            </div>
                            <div style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {despatchesUpdated[key].destination}
                                </div>
                            </div>
                            <div style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {despatchesUpdated[key].totalPkgNum}
                                </div>
                            </div>
                            <div style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {despatchesUpdated[key].totalPkgWt}
                                </div>
                            </div>
                            <div style={despatchViewBodyItemContainer}>
                                <div className="main-item" style={despatchViewBodyItem}>
                                    {despatchesUpdated[key].awbNo}
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
                                    {despatchesUpdated[key].statusFlg}
                                </div>
                            </div>
                        </div>)
                }
            </div>
        )
    }

    despatchDetailView() {

        const { despatchDetail, attachments, picUrl } = this.state

        const despatchDetailTitleContainer = {
            width: '40%',
            borderRightStyle: 'solid',
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

        const changeButton = {
            position: 'absolute',
            left: '3px',
            height: '26px',
            width: '120px',
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

        if (despatchDetail === '') {
            return (
                <div className="main-order-detail-view">
                    <div className="main-order-detail-header">
                        <div style={despatchDetailTitleContainer}>
                            <p style={despatchDetailTitle}>Origin Details</p>
                        </div>
                        <div style={{
                            width: '50%',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            flex: '1',
                        }}>
                            <p style={despatchDetailTitle}>More Info</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="main-order-detail-view">
                    <div className="main-order-detail-header">
                        {this.state.changeDetail ?
                            <div style={despatchDetailTitleContainer}>
                                <p style={despatchDetailTitle}>Origin Details</p>
                                <Button
                                    style={changeButton}
                                    onClick={() => this.setState({ changeDetail: !this.state.changeDetail })}
                                    type="primary"
                                    icon="reload">Consignee</Button>
                            </div>
                            :
                            <div style={despatchDetailTitleContainer}>
                                <p style={despatchDetailTitle}>Consignee Details</p>
                                <Button
                                    style={changeButton}
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
                    <div>
                        <div
                            className="main-view3"
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
                            {/* {this.orderDetailView()} */}
                        </div>
                    </div>

                </div>
            )
        }
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
                        // onClick={() => this.getOrderDetail(orders[key].recKey)}
                        >
                            <div className="main-item-container" style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].landedItem === 'LANDED' ? 'OFFLAND: ' : null}{orders[key].vslName}
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
                                    {orders[key].landedItem === 'LANDED' ?
                                        orders[key].custName :
                                        orders[key].suppName}
                                </div>
                            </div>
                            <div style={orderViewBodyItemContainer}>
                                <div className="main-item" style={orderViewBodyItem}>
                                    {orders[key].landedItem === 'LANDED' ?
                                        'LANDED ITEM' :
                                        orders[key].itemRef}
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

    render() {

        const searchInputStyle = {
            fontFamily: 'varela',
            textAlign: 'center',
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
                            <input className="main-search-input"
                                value={this.state.despatchSearchInput}
                                style={searchInputStyle}
                                onChange={this.handleSearchInput}></input>
                            <p className="main-search-sub-title">Status</p>
                            <Select
                                className="main-search-select"
                                onChange={this.handleSelect}
                                value={this.state.despatchStatus}>
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
                                onChange={date => this.handleStartDate(date)} />
                            <p className="main-search-sub-title">End Date</p>
                            <DatePicker
                                className="main-search-date-picker"
                                allowClear={false}
                                style={datePicker}
                                value={moment(this.state.despatchEndDate, dateFormatList[0])}
                                format={dateFormatList}
                                onChange={date => this.handleEndDate(date)} />
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
                        </div>
                    </div>
                </div>
                <div>
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
                        <div>{this.despatchView()}</div>
                    </div>
                    <div>
                        {this.despatchDetailView()}
                    </div>
                </div>
            </div>
        );
    }
}

export default DespatchView;