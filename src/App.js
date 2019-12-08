import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from "@material-ui/core/Button";
import ReneSearch from "./ReneSearch";

class App extends React.Component {
  state={
    openPopUp: false,
  }

  handleButtonClick = () => {
    this.setState({openPopUp: !this.state.openPopUp})
  }

  render(){
    return (
      <div>
        <Button onClick={this.handleButtonClick}>Open Pup-up</Button>
        {this.state.openPopUp ? <ReneSearch/>: null}
      </div>
    );
  }
}

export default App;
