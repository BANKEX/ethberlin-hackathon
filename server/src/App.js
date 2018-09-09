import React, { Component } from 'react';
import Header from './components/Header';
import { Switch, Route } from 'react-router-dom'

import Feed from './components/Feed'
import Profile from './components/Profile'
import ArticleView from './components/ArticleView'
import Editor from './components/Editor'
import requireAuthentication from './utils/requireAuth'
//import  from './components'

class App extends Component {
    render() {
        const pathname = window.location.pathname
        return ( 
            <div>
            { !pathname.includes('editor') ? <Header /> : '' }
                <Switch>
                
                    <Route exact path="/" component={Feed} />
                </Switch>
            </div>
        );
    }
}

export default App;