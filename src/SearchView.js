import React, { Component } from 'react';
import './App.css';


class SearchView extends Component {
    render() {

        var recKey = this.props.recKey

        
        return (
            <div className="main-search-title-container" >
                <p className="main-search-title">Search {recKey}</p>
                <div className="main-search-second-container">
                    <p className="main-search-sub-title">Search</p>
                    <input className="main-search-input"></input>
                </div>
            </div>
        )
    }

}

export default SearchView;