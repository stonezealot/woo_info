import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import Register from './Register';
import Main from './Main';
import Phone from './Phone';
import Cart from './Cart';
import Point from './Point';
import Gift from './Gift';
import Shop from './Shop';
import Scan from './Scan';


class Routers extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        console.log('app constructed');

        // init
        this.state = {
            //   serviceEntry: window.formAppConfig.serviceEntry,
            home: {
                name: 'Guest'
            },
        };
    }


    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                        component={Register}
                    />
                    <Route
                        exact
                        path="/register" component={Register} />
                    <Route
                        exact
                        path="/main" component={Main} />
                    <Route
                        exact
                        path="/phone" component={Phone} />
                    <Route
                        exact
                        path="/cart" component={Cart} />
                    <Route
                        exact
                        path="/point" component={Point} />
                    <Route
                        exact
                        path="/gift" component={Gift} />
                    <Route
                        exact
                        path="/shop" component={Shop} />
                        <Route
                        exact
                        path="/scan" component={Scan} />
                    <Redirect to="/register" />
                </Switch>

            </Router>
        )
    }
}

export default withCookies(Routers);


