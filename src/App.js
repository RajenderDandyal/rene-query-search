import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from "@material-ui/core/Button";
import ReneSearch from "./ReneSearch";
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import {withStyles} from "@material-ui/core"


const styles = theme => ({
  dropDown:{
  position: 'absolute',
  zIndex: '120000', 
  maxHeight: '300px', 
  overflowY: 'auto',
  //border: '1px solid #eee'
},
dropDownListItem:{
  padding: '5px',
  cursor: 'pointer',
  "&:hover":{
    backgroundColor: '#eee',
  }
}
})

class App extends React.Component {
  state={
    openPopUp: false,
    search: '',
    res: [],
    inputCords : null,
  }

  componentDidMount(){
    let search  = document.getElementById("search")
    if(search){
      let cords  = search.getBoundingClientRect();
      this.setState({inputCords: cords})
    }
   document.addEventListener("click", this.clearRes )
  }
  clearRes = ()=>{
    this.setState({res:[]})
  }
  handleButtonClick = () => {
    this.setState({openPopUp: !this.state.openPopUp})
  }
  handleChange = (e) => {
    this.setState({search: e.target.value}, ()=>{
      this.loadData(this.state.search);
    })
  }
  loadData = (value) =>{
      axios.get(`https://api.gulaq.com/funds/search/${value}`)
      .then(res =>{
        console.log(res)
        this.setState({res: res.data})
      })
  }
  handleListClick = (mf, event)=>{
    if(mf){
      this.props.history.push(`/user/${mf}`);
    } else if(event){
      this.setState({res:[]}, ()=>{
        this.props.history.push(`/user/${mf}`);
      })
    }
    
    console.log("handleListClick")

    // this.setState({res:[]}, ()=>{
    // })
  }
  renderDropDown = (data, classes)=>{
    if(Array.isArray(data) && !isEmpty(data)){
      return (<div>
        {data.map(item=>{
          return(<div onClick={()=>this.handleListClick(item.mfName)} className={classes.dropDownListItem} key={item.mfName  + new Date()}>
            <p align="left" >{item.mfName}</p>
          </div>)
        })}
      </div>)
    }
    return null;
  }
  getCords = (elementId)=>{
    let search = document.getElementById(elementId);
    let cords = search.getBoundingClientRect();
    return cords
  }
  render(){
    console.log(this.state);
    let {classes} = this.props;
    return (
      <div>
        <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', position: "relative"}}>
        <FormControl>
          <Input
            style={{width: `${window.innerWidth/1.5}px`}}
            id="search"
            autoComplete="off"
            onFocus={()=>this.loadData(this.state.search)}
            value={this.state.search}
            onChange={(e)=>this.handleChange(e)}
            //onBlur={(e)=>this.handleListClick(false, e)}
            //endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
            //aria-describedby="standard-weight-helper-text"
          />
        </FormControl>
        
      {this.state.search.length > 0 ? (<div className={classes.dropDown} style={{
        top:'40px', left: `${this.state.inputCords.left}px`, 
        width: `${this.state.inputCords.width}px`,}}>
        {
          this.renderDropDown(this.state.res, classes) 
        }
    </div>): null}
    </div>
    <div>
        <Button onClick={this.handleButtonClick}>Open Pup-up</Button>
        {this.state.openPopUp ? <ReneSearch/>: null}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
