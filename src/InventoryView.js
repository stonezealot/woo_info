import React, { Component, PureComponent } from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import './App.css';

class InventoryView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            serviceEntry: this.props.serviceEntry,
            home: this.props.home,
            showInventoryDetail: false,
            changeInventory: false,
            activeInventories: '',
            depletedInventories: '',
            inventoryDetails: '',
            totalIn: 0,
            totalOut: 0,
            balance: '',
            movements: '',
            movementsIn: '',
            movementsOut: ''
        }
    }

    componentDidMount() {
        const { home, serviceEntry } = this.state


        if (home.isadmin === 'Y') {
            //get inventories admin
            console.log('get inventories')
            let url = serviceEntry + 'api/all-inventories/'
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        activeInventories: response.filter(r => {
                            return (
                                r.stkQty > 0
                            )
                        }),
                        depletedInventories: response.filter(r => {
                            return (
                                r.stkQty <= 0
                            )
                        })
                    },()=>{console.log('inventory complete')})
                })
        } else {
            //get inventories common
            console.log('get inventories')
            let url = serviceEntry + 'api/inventories/'
            let params = new URLSearchParams();
            params.append('storeId', home.custId);
            url += ('?' + params);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        activeInventories: response.filter(r => {
                            return (
                                r.stkQty > 0
                            )
                        }),
                        depletedInventories: response.filter(r => {
                            return (
                                r.stkQty <= 0
                            )
                        })
                    })
                })
        }


    }

    getInventoryDetail(stkId, storeId) {

        this.setState({
            showInventoryDetail: true
        })

        var serviceEntry = this.props.serviceEntry
        //get inventory detail
        let url = serviceEntry + 'api/inventory-info/'
        let params = new URLSearchParams();
        params.append('stkId', stkId);
        params.append('storeId', storeId);
        url += ('?' + params);
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    inventoryDetails: response[0]
                })
            })

        //get movements
        url = serviceEntry + 'api/movements/'
        params = new URLSearchParams();
        params.append('stkId', 'CONSIGN004');
        params.append('storeId', '0600');
        url += ('?' + params);
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    movements: response,
                    movementsIn: response.filter(r => {
                        return (
                            r.stkQty > 0
                        )
                    }),
                    movementsOut: response.filter(r => {
                        return (
                            r.stkQty <= 0
                        )
                    })
                }, () => {
                    function leijia(a, b) {
                        return a + b.stkQty;
                    }
                    this.setState({
                        totalIn: this.state.movementsIn.reduce(leijia, 0),
                        totalOut: this.state.movementsOut.reduce(leijia, 0)
                    }, () => { console.log(this.state.totalIn + '  ' + this.state.totalOut + '  ' + (this.state.totalIn + this.state.totalOut)) })
                })
            })
    }

    inventoryView() {

        const { changeInventory, activeInventories, depletedInventories } = this.state

        var inventories = changeInventory ? depletedInventories : activeInventories

        const inventoryViewBody = {
            height: '60px',
            width: 'calc(100vw - 150px)',
            backgroundColor: 'rgb(236, 236, 236)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(204, 202, 202)',
            display: 'flex',
            flexDirection: 'row',
        }

        const inventoryViewBodyItemContainer = {
            width: 'calc((100vw - 150px)/4',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1',
        }

        const inventoryViewBodyItem = {
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
                    Object.keys(inventories).map(key =>
                        <div key={inventories[key].recKey}
                            className="main-order-view-body"
                            style={inventoryViewBody}
                            onClick={() => this.getInventoryDetail(inventories[key].stkId, inventories[key].storeId)}
                        >
                            <div className="main-item-container" style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {inventories[key].stkId}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {inventories[key].description}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {inventories[key].stkQty}
                                </div>
                            </div>
                            <div
                                style={{
                                    width: 'calc((100vw - 150px)/4',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flex: '1'
                                }}
                            >
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {inventories[key].uomId}
                                </div>
                            </div>
                        </div>)
                }
            </div>
        )
    }

    inventoryDetailView() {

        const { inventoryDetails } = this.state

        const inventoryViewBody = {
            height: '60px',
            width: 'calc(100vw - 150px)',
            backgroundColor: 'rgb(236, 236, 236)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(204, 202, 202)',
            display: 'flex',
            flexDirection: 'row',
        }

        const inventoryViewBodyItemContainer = {
            width: 'calc((100vw - 150px)/4',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1',
        }

        const inventoryViewBodyItem = {
            width: '200px',
            fontSize: '12px',
            fontFamily: 'varela',
            color: 'rgb(66, 66, 68)',
            textAlign: 'center',
            wordWrap: 'break-word',
            verticalAlign: 'middle',
        }

        const inventoryViewHeader = {
            height: '60px',
            width: 'calc(100vw - 150px)',
            backgroundColor: 'rgb(70, 154, 209)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(70, 154, 209)',
            display: 'flex',
            flexDirection: 'row',
        }

        const inventoryViewHeaderTitleContainer = {
            width: 'calc((100vw - 150px)/4',
            borderRightStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'white',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1'
        }

        const inventoryViewHeaderTitle = {
            width: '200px',
            fontSize: '12px',
            fontFamily: 'varela',
            color: 'white',
            textAlign: 'center',
            marginTop: '21px',
        }

        const inventoryViewHeaderTitleContainer2 = {
            width: 'calc((100vw - 150px)/8',
            borderRightStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'white',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1'
        }

        const inventoryViewHeaderTitle2 = {
            width: '200px',
            fontSize: '12px',
            fontFamily: 'varela',
            color: 'white',
            textAlign: 'center',
            marginTop: '21px',
        }

        const subTitleContainer = {
            width: 'calc(100vw - 150px)',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1',
            backgroundColor: 'rgb(77, 77, 80)',
        }

        const subTitleContainer2 = {
            position: 'absolute',
            right: '200px'
        }

        const subTitle = {
            width: '200px',
            fontSize: '17px',
            fontFamily: 'varela',
            color: 'white',
            textAlign: 'center',
            margin: '0px',
            padding: '0px'
        }

        const subTitle2 = {
            width: '140px',
            fontSize: '10px',
            fontFamily: 'varela',
            color: 'white',
            margin: '0px',
            padding: '0px'
        }

        const subTitle3 = {
            width: '140px',
            fontSize: '10px',
            fontFamily: 'varela',
            color: 'red',
            margin: '0px',
            padding: '0px'
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


        return (
            <div
                className="main-view2"
                style={{ width: '100vw', left: '0px', maxWidth: '100vw' }}>


                <div style={subTitleContainer} className="main-order-detail-header">
                    <Button
                        style={backButton}
                        onClick={() => this.setState({ showInventoryDetail: false })}
                        type="primary"
                        icon="left-circle">Back</Button>
                    <p style={subTitle}>Detail</p>
                </div>

                <div style={inventoryViewHeader}>
                    <div style={inventoryViewHeaderTitleContainer}>
                        <p style={inventoryViewHeaderTitle}>STOCK CODE</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer}>
                        <p style={inventoryViewHeaderTitle}>DESCRIPTION</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer}>
                        <p style={inventoryViewHeaderTitle}>STOCK</p>
                    </div>
                    <div style={{
                        width: 'calc((100vw - 400px)/9',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        flex: '1'
                    }}>
                        <p style={inventoryViewHeaderTitle}>UOM</p>
                    </div>
                </div>
                <div
                    className="main-order-view-body"
                    style={inventoryViewBody}>
                    <div className="main-item-container" style={inventoryViewBodyItemContainer}>
                        <div className="main-item" style={inventoryViewBodyItem}>
                            {inventoryDetails.stkId}
                        </div>
                    </div>
                    <div style={inventoryViewBodyItemContainer}>
                        <div className="main-item" style={inventoryViewBodyItem}>
                            {inventoryDetails.description}
                        </div>
                    </div>
                    <div style={inventoryViewBodyItemContainer}>
                        <div className="main-item" style={inventoryViewBodyItem}>
                            {inventoryDetails.stkQty}
                        </div>
                    </div>
                    <div
                        style={{
                            width: 'calc((100vw - 150px)/4',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            flex: '1'
                        }}
                    >
                        <div className="main-item" style={inventoryViewBodyItem}>
                            {inventoryDetails.uomId}
                        </div>
                    </div>
                </div>
                <div style={subTitleContainer} className="main-order-detail-header">
                    <p style={subTitle}>Movements</p>
                    <div style={subTitleContainer2}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={subTitle2}>TOTAL IN:</p>
                            <p style={subTitle2}> {this.state.totalIn}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={subTitle2}>TOTAL OUT:</p>
                            <p style={subTitle2}> {this.state.totalOut}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={subTitle3}>BALANCE:</p>
                            <p style={subTitle3}> {this.state.totalIn + this.state.totalOut}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.inventoryDetails.uomId}</p>
                        </div>
                    </div>
                </div>
                <div style={inventoryViewHeader}>
                    <div style={inventoryViewHeaderTitleContainer2}>
                        <p style={inventoryViewHeaderTitle2}>STOCK CODE</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer2}>
                        <p style={inventoryViewHeaderTitle2}>DESCRIPTION</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer2}>
                        <p style={inventoryViewHeaderTitle2}>DATE</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer2}>
                        <p style={inventoryViewHeaderTitle2}>VESSEL</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer2}>
                        <p style={inventoryViewHeaderTitle2}>MARKING</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer2}>
                        <p style={inventoryViewHeaderTitle2}>IN</p>
                    </div>
                    <div style={inventoryViewHeaderTitleContainer2}>
                        <p style={inventoryViewHeaderTitle2}>OUT</p>
                    </div>
                    <div style={{
                        width: 'calc((100vw - 400px)/8',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        flex: '1'
                    }}>
                        <p style={inventoryViewHeaderTitle2}>UOM</p>
                    </div>
                </div>
                {this.movementView()}
            </div>
        )
    }

    movementView() {

        const { movements } = this.state;

        const inventoryViewBody = {
            height: '60px',
            width: 'calc(100vw - 150px)',
            backgroundColor: 'rgb(236, 236, 236)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(204, 202, 202)',
            display: 'flex',
            flexDirection: 'row',
        }

        const inventoryViewBodyItemContainer = {
            width: 'calc((100vw - 150px)/8',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1',
        }

        const inventoryViewBodyItem = {
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
                    Object.keys(movements).map(key =>

                        <div key={movements[key].recKey}
                            className="main-order-view-body"
                            style={inventoryViewBody}
                        >
                            <div className="main-item-container" style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {movements[key].stkId}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {movements[key].description}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {moment(movements[key].docDate).format('DD/MM/YYYY')}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {movements[key].vslName}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {movements[key].marking}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {movements[key].stkQty > 0 ? movements[key].stkQty : null}
                                </div>
                            </div>
                            <div style={inventoryViewBodyItemContainer}>
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {movements[key].stkQty <= 0 ? -movements[key].stkQty : null}
                                </div>
                            </div>
                            <div
                                style={{
                                    width: 'calc((100vw - 150px)/8',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flex: '1'
                                }}
                            >
                                <div className="main-item" style={inventoryViewBodyItem}>
                                    {movements[key].uomId}
                                </div>
                            </div>
                        </div>)
                }
            </div>
        )
    }

    render() {

        const inventoryViewHeader = {
            height: '60px',
            width: 'calc(100vw - 150px)',
            backgroundColor: 'rgb(70, 154, 209)',
            borderBottomStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(70, 154, 209)',
            display: 'flex',
            flexDirection: 'row',
        }

        const inventoryViewHeaderTitleContainer = {
            width: 'calc((100vw - 150px)/4',
            borderRightStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'white',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1'
        }

        const inventoryViewHeaderTitle = {
            width: '200px',
            fontSize: '12px',
            fontFamily: 'varela',
            color: 'white',
            textAlign: 'center',
            marginTop: '21px',
        }

        const subTitleContainer = {
            width: 'calc(100vw - 150px)',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '1',
            backgroundColor: 'rgb(77, 77, 80)',
        }

        const subTitle = {
            width: '200px',
            fontSize: '17px',
            fontFamily: 'varela',
            color: 'white',
            textAlign: 'center',
            margin: '0px',
            padding: '0px'
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

        return (
            <div>
                <div>
                    {this.state.showInventoryDetail ?
                        <div>
                            {this.inventoryDetailView()}
                        </div>
                        :
                        <div
                            className="main-view2"
                            style={{ width: '100vw', left: '0px', maxWidth: 'calc(100vw - 150px)' }}>
                            {
                                this.state.changeInventory ?
                                    <div style={subTitleContainer} className="main-order-detail-header">
                                        <Button
                                            style={backButton}
                                            onClick={() => this.setState({ changeInventory: !this.state.changeInventory })}
                                            type="primary"
                                            icon="reload">Active</Button>
                                        <p style={subTitle}>Depleted</p>
                                    </div>
                                    :
                                    <div style={subTitleContainer} className="main-order-detail-header">
                                        <Button
                                            style={backButton}
                                            onClick={() => this.setState({ changeInventory: !this.state.changeInventory })}
                                            type="primary"
                                            icon="reload">Depleted</Button>
                                        <p style={subTitle}>Active</p>
                                    </div>
                            }
                            <div style={inventoryViewHeader}>
                                <div style={inventoryViewHeaderTitleContainer}>
                                    <p style={inventoryViewHeaderTitle}>STOCK CODE</p>
                                </div>
                                <div style={inventoryViewHeaderTitleContainer}>
                                    <p style={inventoryViewHeaderTitle}>DESCRIPTION</p>
                                </div>
                                <div style={inventoryViewHeaderTitleContainer}>
                                    <p style={inventoryViewHeaderTitle}>STOCK</p>
                                </div>
                                <div style={{
                                    width: 'calc((100vw - 400px)/9',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flex: '1'
                                }}>
                                    <p style={inventoryViewHeaderTitle}>UOM</p>
                                </div>
                            </div>
                            {this.inventoryView()}
                        </div>
                    }
                </div>
            </div>

        )
    }

}

export default InventoryView;