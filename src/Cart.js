import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Empty } from 'antd';
import { NavBar, ListView } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';
import moment from 'moment';


const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

class Cart extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = this.props;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            serviceEntry: cookies.get('serviceEntry'),
            authorization: cookies.get('authorization'),
            dataSource: dataSource.cloneWithRows({}),
            isLoading: true,
            showDetail: false,
            vipId: cookies.get('vipId'),
            saleList: ''
        }
    }

    changeState = (list) => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            isLoading: false
        });
    }

    componentDidMount() {

        document.title = '消费查询'
        console.log(this.state.vipId)

        let url = this.state.serviceEntry + 'sales?vipId=' + this.state.vipId

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.state.authorization
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    saleList: response
                }, () => {
                    console.log(this.state.saleList)
                    this.changeState(this.state.saleList);
                })
            })
    }

    //demo
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            // genData(++pageIndex);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
            });
        }, 1000);
    }

    render() {

        //demo
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );


        console.log(this.state.saleList);

        let index = this.state.saleList.length - 1;

        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = this.state.saleList.length - 1;
            }
            const obj = this.state.saleList[index--];
            return (
                <div key={rowID} style={{ padding: '0 15px' }}>
                    <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                        <div style={{ lineHeight: 1, display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '200px' }}>
                                <div style={{ fontWeight: 'bolder', borderBottom: '1px solid #F6F6F6', }}>{obj.name}</div>
                                <div style={{ color: 'gray', marginTop: '5px' }}>金额: {obj.netPrice}</div>
                                <div style={{ color: 'gray', fontSize: '15px', marginTop: '10px' }}>购买时间: {moment(obj.docDate).format('YYYY-MM-DD')}</div>
                                <div style={{ color: 'gray', fontSize: '10px', marginTop: '10px' }}>购买单号: {obj.docId}</div>
                            </div>
                            <div>
                                <div style={{ color: 'gray', borderBottom: '1px solid #F6F6F6', marginLeft: '120px' }}>数量: {obj.stkQty}</div>
                                <div style={{
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    marginLeft: '70px'
                                }}>总金额: {obj.lineTotalNet + obj.lineTax}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div style={{ backgroundColor: '#F7F7F7', height: '100vh' }}>
                <NavBar
                    className="navbar"
                    mode="light"
                    onLeftClick={() => console.log('onLeftClick')}
                ><div style={{ paddingTop: '5px' }}>消费查询</div></NavBar>
                <div style={{ marginTop: '10px', height: '35px' }}></div>
                {
                    this.state.saleList == '' ?
                        <Empty description='您还没有消费记录哦~~' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        :
                        <div>
                            <div style={{
                                backgroundColor: '#F5F5F9',
                                height: 8,
                                borderTop: '1px solid #ECECED',
                                borderBottom: '1px solid #ECECED',
                            }}></div>
                            <ListView
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource}
                                className="am-list sticky-list"
                                useBodyScroll
                                renderRow={row}
                                renderSeparator={separator}
                                pageSize={4}
                                scrollEventThrottle={200}
                            />
                        </div>
                }
            </div>
        );
    }

}

export default withRouter(withCookies(Cart));