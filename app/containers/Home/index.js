/*
 *
 * Home
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up';

import './style.css';
import './styleM.css';

import {Link} from 'react-router';

export default class Home extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      username:"",
      password:"",
      showAlertMissingField:false,
      showAlertInvalidCredentials: false,
      showLoginBox: true
    }
  };

  handleUsername=(event)=> {
    this.setState({
      username:event.target.value
    })
  }

  handlePassword=(event)=> {
    this.setState({
      password:event.target.value
    })
  }

  signIn=()=> {
    let _this = this;
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);

    fetch("http://localhost:8000/api/signIn", {
      method:"POST",
      body:data
    })
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      if(json.error === 'Missing field')
      {
        _this.setState({
          showAlertMissingField:true
        })
      }
      else if(json.error === 'Invalid Credentials')
      {
        _this.setState({
          showAlertInvalidCredentials:true
        })
      }
      else if(json.token)
      {
        sessionStorage.setItem('token', json.token);
        _this.getUser(json.token);
        _this.setState({
          showAlertSignedIn:true
        })
      }
    })
  }

  goToRoomList = () => {
    this.context.router.push("/RoomList");
  }

  getUser = (token) => {
    let _this = this;
    fetch("http://localhost:8000/api/getUser", {
      method:"GET",
      headers:{'Authorization':'Bearer ' + token}
    })
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      sessionStorage.setItem('user', JSON.stringify(json.user));
    })
  }

  renderAlertMissingField =() => {
    if(this.state.showAlertMissingField === true){
      this.setState({
        showLoginBox: false
      })
      return(
        <div className="alertBox">
          <br/>
          <span>Please enter both your username and password.</span>
          <br/>
          <FaExclamationTriangle className="iconTriangle"/>
          <input className="okButton" type="button" value="OK" onClick={this.hideAlert}/>
        </div>
      )
    }
  }

  renderAlertInvalidCredentials =() => {
    if(this.state.showAlertInvalidCredentials === true){
      this.setState({
        showLoginBox: false
      })
      return(
        <div className="alertBox">
          <br/>
          <span>Please enter a valid username and password.</span>
          <br/>
          <FaExclamationTriangle className="iconTriangle"/>
          <input className="okButton" type="button" value="OK" onClick={this.hideAlert}/>
        </div>
      )
    }
  }

  renderAlertSignedIn =() => {
    if(this.state.showAlertSignedIn === true){
      this.setState({
        showLoginBox: false
      })
      return(
        <div className="alertBox">
          <br/>
          <span>You have successfully signed in!</span>
          <br/>
          <FaThumbsOUp className="iconThumbs"/>
          <input className="okButton" type="button" value="OK" onClick={this.goToRoomList}/>
        </div>
      )
    }
  }

  renderLoginBox =() => {
    if(this.state.showLoginBox === true){
      return(
        <div className="loginBox">

          <input className="button" type="submit" value="Sign In"  onClick={this.showInput} />

          <input type="text" className="input1" name="username" placeholder="Username" onChange={this.handleUsername} />

          <input type="text" className="input2" name="password" placeholder="Password" onChange={this.handlePassword} />

          <a className="signUpLink" href="/SignUpPage">New to FaveChat? Sign Up</a>
          <br/><br/>

          <input type="button" ref="go" className="goButton" name="go" value="GO!" onClick={this.signIn} />
        </div>
      )
    }
  }

  hideAlert = () => {
    this.setState({
      username: "",
      password: "",
      showAlertMissingField:false,
      showAlertInvalidCredentials: false,
      showAlertSignedIn: false,
      showLoginBox: true
    })
  }

  render() {
    return (
      <div className="container">
        <Helmet title="Home" meta={[ { name: 'description', content: 'Description of Home' }]}/>
        <div className="smallContainer">

          <div className="welcomeBox">
            <div className="title"><h2>Welcome to</h2></div>
            <div className="title"><h1>FaveChat<span className="exclamation">!</span></h1></div>
            <div className="title"><h3>Find Your Favorite Chat Room</h3></div><br/>
          </div>

          {this.renderLoginBox()}
          {this.renderAlertMissingField()}
          {this.renderAlertInvalidCredentials()}
          {this.renderAlertSignedIn()}
        </div>
      </div>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object
};
