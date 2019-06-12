import React, { Component } from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import { List, AutoSizer } from "react-virtualized";
import './App.css';

class InventoryView extends Component {

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
            movementsOut: '',
            Inventories: ''
        }
        this.inventoryView = this.inventoryView.bind(this)
        this.movementView = this.movementView.bind(this)
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
                    })
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

    divScroll() {
        var divscroll = document.getElementById('right-view');
        var scrollTop = divscroll.scrollTop;
        var wholeHeight = divscroll.scrollHeight;
        var divHeight = divscroll.clientHeight;
        console.log(scrollTop + '  ' + wholeHeight + '  ' + divHeight)
        divscroll.scrollBy(0, -scrollTop);
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
                }, console.log('get details'))
            })

        //get movements
        url = serviceEntry + 'api/movements/'
        params = new URLSearchParams();
        params.append('stkId', stkId);
        params.append('storeId', storeId);
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
                    console.log(this.state.movements[0])
                    function leijia(a, b) {
                        return a + b.stkQty;
                    }
                    this.setState({
                        totalIn: this.state.movementsIn.reduce(leijia, 0),
                        totalOut: this.state.movementsOut.reduce(leijia, 0)
                    })
                })
            })
    }

    inventoryView({ index, isScrolling, key, style }) {

        const { changeInventory, activeInventories, depletedInventories } = this.state

        var inventories = changeInventory ? depletedInventories : activeInventories

        console.log(index)

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

        const inventoryViewBody2 = {
            height: '60px',
            width: 'calc(100vw - 150px)',
            backgroundColor: 'rgb(212, 211, 211)',
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
            <div style={style}
                key={inventories[index].recKey}>
                <div
                    className="main-order-view-body"
                    style={index % 2 === 1 ? inventoryViewBody : inventoryViewBody2}
                    onClick={() => this.getInventoryDetail(inventories[index].stkId, inventories[index].storeId)}>
                    <div className="main-item-container" style={inventoryViewBodyItemContainer}>
                        <div className="main-item" style={inventoryViewBodyItem}>
                            {inventories[index].stkId}
                        </div>
                    </div>
                    <div style={inventoryViewBodyItemContainer}>
                        <div className="main-item" style={inventoryViewBodyItem}>
                            {inventories[index].description}
                        </div>
                    </div>
                    <div style={inventoryViewBodyItemContainer}>
                        <div className="main-item" style={inventoryViewBodyItem}>
                            {inventories[index].stkQty}
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
                            {inventories[index].uomId}
                        </div>
                    </div>
                </div>
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
                className="main-view4"
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
                <div>{this.movementView()}</div>
                {/* <AutoSizer style={{ height: 'calc(100vh - 60px)', width: 'calc(100vw)', resize: 'both' }}>
                    {({ height, width }) => (
                        <List
                            className="list"
                            width={width + 400}
                            height={height}
                            rowHeight={60}
                            rowRenderer={this.movementView}
                            rowCount={this.state.movements.length} />
                    )}
                </AutoSizer> */}
            </div>
        )
    }

    // { index, isScrolling, key, style }

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
            // <div
            //     style={style}
            //     key={movements[index].recKey}>
            //     <div className="main-order-view-body"
            //         style={inventoryViewBody}
            //     >
            //         <div className="main-item-container" style={inventoryViewBodyItemContainer}>
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {movements[index].stkId}
            //             </div>
            //         </div>
            //         <div style={inventoryViewBodyItemContainer}>
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {movements[index].description}
            //             </div>
            //         </div>
            //         <div style={inventoryViewBodyItemContainer}>
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {moment(movements[index].docDate).format('DD/MM/YYYY')}
            //             </div>
            //         </div>
            //         <div style={inventoryViewBodyItemContainer}>
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {movements[index].vslName}
            //             </div>
            //         </div>
            //         <div style={inventoryViewBodyItemContainer}>
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {movements[index].marking}
            //             </div>
            //         </div>
            //         <div style={inventoryViewBodyItemContainer}>
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {movements[index].stkQty > 0 ? movements[index].stkQty : null}
            //             </div>
            //         </div>
            //         <div style={inventoryViewBodyItemContainer}>
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {movements[index].stkQty <= 0 ? -movements[index].stkQty : null}
            //             </div>
            //         </div>
            //         <div
            //             style={{
            //                 width: 'calc((100vw - 150px)/8',
            //                 alignItems: 'center',
            //                 display: 'flex',
            //                 justifyContent: 'center',
            //                 flex: '1'
            //             }}
            //         >
            //             <div className="main-item" style={inventoryViewBodyItem}>
            //                 {movements[index].uomId}
            //             </div>
            //         </div>
            //     </div>
            // </div>
            <div className="main-view5">
                {
                    Object.keys(movements).map(key =>
                        <div key={movements[key].recKey} className="main-order-view-body"
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
                        </div>
                    )
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
                            style={{ width: '100vw', left: '0px', maxWidth: 'calc(100vw - 150px)'}}>
                            {
                                this.state.changeInventory ?
                                    <div style={subTitleContainer} className="main-order-detail-header">
                                        <Button
                                            style={backButton}
                                            onClick={() => this.setState({ changeInventory: !this.state.changeInventory }, () => this.divScroll())}
                                            type="primary"
                                            icon="reload">Active</Button>
                                        <p style={subTitle}>Depleted</p>
                                    </div>
                                    :
                                    <div style={subTitleContainer} className="main-order-detail-header">
                                        <Button
                                            style={backButton}
                                            onClick={() => this.setState({ changeInventory: !this.state.changeInventory }, () => this.divScroll())}
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
                            <AutoSizer style={{ height: 'calc(100vh - 198px)', width: 'calc(100vw - 150px)', resize: 'both' }}>
                                {({ height, width }) => (
                                    <List
                                        id="right-view"
                                        className="list"
                                        width={width}
                                        height={height}
                                        rowHeight={60}
                                        rowRenderer={this.inventoryView}
                                        rowCount={this.state.changeInventory ? this.state.depletedInventories.length : this.state.activeInventories.length}
                                    />
                                )}
                            </AutoSizer>
                        </div>
                    }
                </div>
            </div>

        )
    }

}

export default InventoryView;