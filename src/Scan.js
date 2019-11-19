import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import 'antd/dist/antd.css';
import './App.css';

class Scan extends Component {

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

    }

    onChange = (e) => {
        this.setState({
            value: e
        }, () => { console.log(this.state.value) })

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
                <div style={header}>
                    <div style={{ marginTop: '10px', height: '30px' }}>
                        <p style={headerTitle}>我的二维码</p>
                    </div>
                    <div style={{
                        height: '450px', backgroundColor: 'pink', margin: '10px', padding: '20px'
                    }}>
                        <div style={{ height: '120px', backgroundColor: 'white', borderWidth: '1px', borderColor: '#F7F7F7' }}></div>
                        <div style={{ height: '20px', marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>1573 7971 5086 6</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                            <div style={{ height: '200px', width: '200px', backgroundColor: 'white', }}></div>
                        </div>
                        <div style={{ height: '20px', marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>有效时间</div>

                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(withCookies(Scan));