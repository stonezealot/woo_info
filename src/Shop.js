import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import { Empty } from 'antd';
import { InputItem, Button, SearchBar ,SegmentedControl,Tabs,Badge,Modal} from 'antd-mobile';
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
            value: ''
        }

        this.onChange = this.onChange.bind(this)

    }

    componentDidMount() {
        document.title = '门店列表'
    }

    onChange = (e) => {
        this.setState({
           value:e 
        },()=>{console.log(this.state.value)})
        
    };

    



    render() {

        const header = {
            // textAlign: 'center',
            fontSize: '20px',
            fontFamily: 'varela',
            backgroundColor: 'white',
            color: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            height: '35px'
        };

        const headerTitle = {
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontWeight: '800'
        }

        

        return (
            <div style={{ backgroundColor: '#F7F7F7', height: '100vh' }}>
                <SearchBar placeholder="输入地区、省、市" maxLength={16} onChange={this.onChange}/>
                <Tabs
                        tabBarUnderlineStyle={{ backgroundColor: '#D71818', height: 2, borderWidth: '0px' }}
                        tabBarActiveTextColor='#D71818'
                        tabs={tabs}
                        initialPage={1}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }} >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#F7F7F7' }}>
                            
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#F7F7F7' }}>
                            
                        </div>
                            </Tabs>
            </div>
        );
    }

}

export default withRouter(withCookies(Shop));