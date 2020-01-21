import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { SearchBar, Tabs, Badge, ListView } from 'antd-mobile';
import 'antd/dist/antd.css';
import './App.css';


const tabs = [
    { title: <Badge>查询附近门店</Badge> },
    { title: <Badge>查询</Badge> },
];


class Shop extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = this.props;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })

        this.state = {
            value: '',
            lng: '',
            lat: '',
            serviceEntry: cookies.get('serviceEntry'),
            authorization: cookies.get('authorization'),
            dataSource: dataSource,
            // .cloneWithRows({}),
            addressList: ''
        }

        this.onChange = this.onChange.bind(this)
        this.stopScroll = this.stopScroll.bind(this)

    }

    changeState = (list) => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            isLoading: false
        });


    }

    stopScroll(e) {

        e.preventDefault()

    }

    componentDidMount() {
        document.body.addEventListener('touchmove', this.stopScroll, false);
        document.title = '门店列表'
        const BMap = window.BMap;
        const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS;

        var map = new BMap.Map("allmap");
        var point = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(point, 12);

        var geolocation = new BMap.Geolocation();
        var that = this;
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
                that.setState({
                    lng: r.point.lng,
                    lat: r.point.lat
                })
            }
            else {
                console.log('failed' + this.getStatus());
            }
        }, { enableHighAccuracy: true })

        let url = this.state.serviceEntry + 'addresses?longitude=' + this.state.lng + '&latitude=' + this.state.lat
        console.log(url)

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
                    addressList: response
                }, () => {
                    console.log(this.state.addressList)
                    this.changeState(this.state.addressList)
                })
            })

    }

    onChange = (e) => {
        this.setState({
            value: e
        }, () => { console.log(this.state.value) })

    };

    render() {

        console.log(this.state.addressList);

        let index = this.state.addressList.length - 1;

        const rowB = (rowData, sectionID, rowID) => {
            if (index < 0) {
                //没有歌曲
                index = this.state.addressList.length - 1;
            }

            const obj = this.state.addressList[index--];

            return (
                <div key={rowID} style={{
                    // paddingTop: '15px',
                    backgroundColor: '#F7F7F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                    <div style={{ width: '80%', background: 'white', borderRadius: '8px', marginBottom: '15px', height: '60px' }}>
                        {/* <div style={{ display: 'flex', flexDirection: 'row' }}> */}
                        <div style={{ flex: 3.5, paddingLeft: '20px', paddingTop: '5px', fontSize: '10px' }}>{obj.address}</div>
                        {/* </div> */}
                    </div>
                </div >
            );
        };

        return (
            <div style={{ backgroundColor: '#F7F7F7', height: '100vh' }}>
                <SearchBar placeholder="输入地区、省、市" maxLength={16} onChange={this.onChange} />
                <Tabs
                    tabBarUnderlineStyle={{ backgroundColor: '#D71818', height: 2, borderWidth: '0px' }}
                    tabBarActiveTextColor='#D71818'
                    tabs={tabs}
                    swipeable={false}
                    initialPage={1}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }} >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F7F7F7' }}>
                        <div id="allmap" ></div >
                        <ListView
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderRow={rowB}
                            // useBodyScroll
                            style={{
                                height: '100vh',
                                width: '100%',
                                backgroundColor: '#F7F7F7',
                                paddingBottom: '50px'
                            }}
                            onEndReachedThreshold={1000}
                            onEndReached={this.onEndReached}
                            pageSize={5}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#F7F7F7' }}>

                    </div>
                </Tabs>
            </div>
        );
    }

}

export default withRouter(withCookies(Shop));