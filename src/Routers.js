import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import Login from './Login';
import Main from './Main';

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
                        component={Login}
                    />
                    <Route
                        exact
                        path="/login" component={Login} />
                    <Route
                        exact
                        path="/main" component={Main} />
                    <Redirect to="/login" />
                </Switch>

            </Router>
        )
    }
}

export default withCookies(Routers);


