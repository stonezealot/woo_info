import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { NavBar, ListView } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';
import moment from 'moment';

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

class Point extends Component {

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
            ptsList: '',
            total: ''
        }
    }

    changeState = (list) => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            isLoading: false
        });
    }

    handleSum = (list) => {
        const sum = 0
        for (var i = 0; i < list.length; i++) {
            this.sum += list.totalPts
        }
        this.setState({
            total: sum
        })
    }


    componentDidMount() {


        document.title = '个人信息-会员积分'
        console.log(this.state.vipId)

        let url = this.state.serviceEntry + 'points?vipId=' + this.state.vipId

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
                    ptsList: response
                }, () => {
                    console.log(this.state.ptsList)
                    this.changeState(this.state.ptsList)
                    this.handleSum(this.state.ptsList)
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

        console.log(this.state.ptsList);


        let index = this.state.ptsList.length - 1;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = this.state.ptsList.length - 1;
            }
            const obj = this.state.ptsList[index--];
            return (
                <div key={rowID} style={{ padding: '0 15px' }}>
                    <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                        <div style={{ lineHeight: 1, display: 'flex', flexDirection: 'row' }}>
                            <div style={{}}>
                                <div style={{ fontWeight: 'bolder' }}>会员积分</div>
                                <div style={{ color: 'gray', marginTop: '5px' }}>来源: {obj.docId}</div>
                                <div style={{ color: 'gray', fontSize: '10px', marginTop: '10px' }}>{moment(obj.docDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                            <div style={{
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: 'orange',
                                fontWeight: 'bold',
                                fontSize: '24px',
                                marginLeft: '200px'
                            }}>{obj.totalPts < 0 ? obj.totalPts : '+' + obj.totalPts}</div>
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
                ><div style={{ paddingTop: '5px' }}>积分查询</div></NavBar>
                <div style={{ marginTop: '10px', height: '35px' }}></div>
                <div style={{ backgroundColor: '#DDB100', height: '150px', paddingTop: '90px' }}>
                    <div style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', marginLeft: '30px' }}>{this.state.total}积分</div>
                </div>
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
        );
    }

}

export default withRouter(withCookies(Point));