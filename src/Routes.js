import React from "react";
import App from "./App";
import User from "./User";
import {Switch, Route} from "react-router-dom";

class Routes extends React.Component {
    render(){
        return(
            <Switch>
              <Route path={'/user/:id'} component={User}/>
              <Route path={'/'} component={App}/>
            </Switch>
        )
    }
}

export default Routes;