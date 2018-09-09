import React, { Component } from 'react';
import { connect } from 'react-redux'

class Header extends Component {
    render() {
        return ( 
            <div>
    <div data-react-className="UserOverlay" data-react-props="{}">
        <div className="overlay overlay-hugeinc " data-reactroot=""><button className="overlay-close"><span className="glyphicon glyphicon-remove"></span></button>
            <nav className="users-overlay">
                <h2 className="grayed-heading center"></h2>
                <ul>
                    <li className="pagination-button-group"></li>
                </ul>
            </nav>
        </div>
    </div>

    <div data-behavior="progress-bar" className="progress-bar"></div>

    <nav data-behavior="animated-navbar" className="navbar navbar-default navbar-fixed-top is-inView">
        <div className="container-fluid col-md-10 col-md-offset-1">
            <div className="navbar-header">
                <a className="navbar-brand" id="logo" href="/">
                    <img alt="Stories" src="/assets/img/stories-logo.svg" height="40"/>
                </a>
            </div>
        </div>
    </nav>
</div>
            );
    }
}
const mr1cs_ppzksnark_generatorapStateToProps = state => {
    return {
        user: state.authUser.user,
        isAuth: state.authUser.isAuth
    }    
}
const mapDispatchToProps = dispatch => {
    return {
        openSignInWith: ()=> { dispatch({type: 'TOGGLE_MODAL', modalMode: true}) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);