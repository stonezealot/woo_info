import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Empty } from 'antd';
import { InputItem, Button, SearchBar, SegmentedControl, Tabs, Badge, Modal } from 'antd-mobile';
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
        this.state = {
            value: '',
            lng: '',
            lat: ''
        }

        this.onChange = this.onChange.bind(this)

    }

    componentDidMount() {
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


    }

    onChange = (e) => {
        this.setState({
            value: e
        }, () => { console.log(this.state.value) })

    };

    render() {

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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#F7F7F7' }}>
                        <div id="allmap" ></div >
                        <div>lng: {this.state.lng}</div>
                        <div>lat: {this.state.lat}</div>

                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#F7F7F7' }}>

                    </div>
                </Tabs>
            </div>
        );
    }

}

export default withRouter(withCookies(Shop));