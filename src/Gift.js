import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Empty } from 'antd';
import { Tabs, Badge, ListView, PullToRefresh, Accordion, NavBar } from 'antd-mobile';
import moment from 'moment';
import 'antd/dist/antd.css';
import './App.css';


const tabs = [
    { title: <Badge>未使用</Badge> },
    { title: <Badge>已使用</Badge> },
    { title: <Badge>已过期</Badge> },
];

const data = [
    {
        price: 800.00,
        priceFill: 10000,
        no: 'Q19111326417454',
    },
    {
        price: 100.00,
        priceFill: 1588,
        no: 'Q19111326417768',
    },
    {
        price: 200.00,
        priceFill: 2988,
        no: 'Q19111326417657',
    },
    {
        price: 300.00,
        priceFill: 4888,
        no: 'Q19111326417575',
    }
]


class Gift extends Component {

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

            serviceEntry: cookies.get('serviceEntry'),
            authorization: cookies.get('authorization'),
            vipId: cookies.get('vipId'),
            dataSource: dataSource.cloneWithRows({}),
            isLoading: true,
            showDetail: false,
            discountList: ''

        }

        this.handleDetailButton = this.handleDetailButton.bind(this);

    }

    changeState = (list) => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            isLoading: false
        });
    }

    componentDidMount() {

        document.title = '个人信息-优惠券'
        console.log(this.state.vipId)

        let url = this.state.serviceEntry + 'discounts?csId=' + this.state.vipId

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
                    discountList: response
                }, () => {
                    console.log(this.state.discountList)
                    this.changeState(this.state.discountList)
                })
            })
    }

    handleDetailButton() {
        this.setState({
            showDetail: !this.state.showDetail
        }, () => { console.log(this.state.showDetail) })

    }

    render() {

        console.log(this.state.discountList);

        let index = this.state.discountList.length - 1;

        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                //没有歌曲
                index = this.state.discountList.length - 1;
            }

            const obj = this.state.discountList[index--];

            return (

                <div key={rowID} style={{
                    paddingTop: '15px',
                    backgroundColor: '#F7F7F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style={{ width: '80%', background: 'white', borderRadius: '8px' }}>
                        <div className="pinkTop" style={{ height: '20px', width: '100%', backgroundColor: '#EE008F' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ color: '#EE008F', flex: 3.5, paddingLeft: '20px', paddingTop: '5px', fontSize: '25px' }}>{obj.svAmt}.00</div>
                            <div style={{ flex: 6.5, paddingTop: '20px' }}>
                                <div style={{ color: '#EE008F', fontSize: '20px' }}>抵用券</div>
                                <div style={{ color: '#EE008F', paddingTop: '-5px' }}>消费满{obj.svAmt}元以上可用</div>
                            </div>
                        </div>
                        <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: '#A2A2A2' }}>优惠券号:  {obj.svId}</div>
                                <div style={{ fontSize: '10px', color: '#A2A2A2' }}>有效时间:  {moment(obj.startDate).format('YYYY-MM-DD')} - {moment(obj.expiryDate).format('YYYY-MM-DD')}</div>
                            </div>
                        </div>
                        <div className="detailTitle">
                            <Accordion className="detailTitle" accordion='false'>
                                <Accordion.Panel className="detailTitle" header={<div style={{ color: '#A2A2A2', fontSize: '15px' }}>详情</div>}>
                                    <div style={{ height: '140px', width: '100%' }}>
                                        <div style={{ height: '50px', margin: '10px', backgroundColor: 'pink' }}>二维码</div>
                                        <div style={{ marginLeft: '5px' }}>
                                            <div>使用规则</div>
                                            <div style={{ fontSize: '12px' }}>嫵WOO期待与您美丽每一天!</div>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div>使用范围</div>
                                                <div style={{ marginLeft: '5px', color: '#EE008F' }}>全部区域</div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Panel>
                            </Accordion>
                        </div>

                    </div>
                </div >


            );
        };

        return (
            <div style={{ backgroundColor: '#F7F7F7', height: '100vh' }}>
                <NavBar
                    className="navbar"
                    mode="light"
                    onLeftClick={() => console.log('onLeftClick')}
                ><div style={{ paddingTop: '5px' }}>优惠券</div></NavBar>
                <div style={{ marginTop: '10px', height: '35px' }}></div>
                <div>
                    <Tabs
                        tabBarUnderlineStyle={{ backgroundColor: '#D71818', height: 2, borderWidth: '0px' }}
                        tabBarActiveTextColor='#D71818'
                        tabs={tabs}
                        swipeable={false}
                        initialPage={1}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }} >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F7F7F7' }}>
                            <ListView
                                key={this.state.useBodyScroll ? '0' : '1'}
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource}
                                renderRow={row}
                                useBodyScroll
                                style={{
                                    height: '100vh',
                                    width: '100%',
                                    backgroundColor: '#F7F7F7',
                                }}
                                onEndReachedThreshold={1000}
                                onEndReached={this.onEndReached}
                                pageSize={5}
                            />

                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#F7F7F7' }}>
                            <Empty description='您还没有电子券哦~~' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#F7F7F7' }}>
                            <Empty description='您还没有电子券哦~~' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                    </Tabs>
                </div>
            </div >
        );
    }

}

export default withRouter(withCookies(Gift));