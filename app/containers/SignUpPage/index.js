/*
 *
 * SignUpPage
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up';

import './style.css';
import './styleM.css';

export default class SignUpPage extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      username:"",
      password:"",
      showAlertUsernameUnavailable: false,
      showAlertMissingField: false,
      showAlertSignedUp: false,
      showLoginBox: true
    }
  };

  handleUsername=(event)=> {
    this.setState({
      username:event.target.value
    })
  };

  handlePassword=(event)=> {
    this.setState({
      password:event.target.value
    })
  };

  signUp = () => {
    let _this = this;
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);

    fetch("http://localhost:8000/api/signUp", {
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
          showAlertMissingField: true
        })
      }
      else if(json.error === 'Username Unavailable')
      {
        _this.setState({
          showAlertUsernameUnavailable: true
        })
      }
      else if(json.success)
      {
        _this.setState({
          showAlertSignedUp: true
        })
      }
    })
  };

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
      if(json.token)
      {
        sessionStorage.setItem('token', json.token);
        _this.getUser(json.token);
      }
    })
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
      _this.context.router.push("/RoomList");
    })
  }

  renderLoginBox = () => {
    if(this.state.showLoginBox === true)
    {
      return (
        <div className="loginBox">

          <input className="buttonSignUp" type="submit" value="Sign Up"/>

          <input type="text" className="input1" name="username" placeholder="Username" onChange={this.handleUsername} />

          <input type="text" className="input2" name="password" placeholder="Password" onChange={this.handlePassword} />
          <br/><br/><br/>

          <input type="button" ref="go" className="goButton" name="go" value="GO!" onClick={this.signUp} />
        </div>
      )
    }
  }

  renderAlertSignedUp = () => {
    if(this.state.showAlertSignedUp === true)
    {
      this.setState({
        showLoginBox: false
      })
      return (
        <div className="alertBox">
          <br/>
          <span>You have successfully signed up!</span>
          <br/>
          <FaThumbsOUp className="iconThumbs"/>
          <input className="okButton" type="button" value="OK" onClick={this.signIn}/>
        </div>
      )
    }
  }
  renderAlertMissingField = () => {
    if(this.state.showAlertMissingField === true)
    {
      this.setState({
        showLoginBox: false
      })
      return (
        <div className="alertBox">
          <br/>
          <span>Please enter both username and password.</span>
          <br/><br/>
          <FaExclamationTriangle className="iconTriangle"/>
          <input className="okButton" type="button" value="OK" onClick={this.hideAlert}/>
        </div>
      )
    }
  }

  renderAlertUsernameUnavailable = () => {
    if(this.state.showAlertUsernameUnavailable === true)
    {
      this.setState({
        showLoginBox: false
      })
      return (
        <div className="alertBox">
          <br/>
          <span>Sorry, that username is unavailable.</span>
          <br/><br/>
          <FaExclamationTriangle className="iconTriangle"/>
          <input className="okButton" type="button" value="OK" onClick={this.hideAlert}/>
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
      showAlertUsernameUnavailable: false,
      showAlertSignedUp: false,
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
          {this.renderAlertSignedUp()}
          {this.renderAlertMissingField()}
          {this.renderAlertUsernameUnavailable()}

        </div>
      </div>
    );
  }
}

SignUpPage.contextTypes = {
  router: React.PropTypes.object
};
