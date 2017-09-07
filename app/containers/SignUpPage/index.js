/*
 *
 * SignUpPage
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import './style.css';
import './styleM.css';

export default class SignUpPage extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      username:"",
      password:""
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
      if(json.error)
      {
          alert(json.error);
      }
      else if(json.success)
      {
        _this.signIn();
        alert("Signed up successfully");
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
      if(json.error)
      {
          alert(json.error);
      }
      else if(json.token)
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
          <div className="loginBox">

            <input className="buttonSignUp" type="submit" value="Sign Up"/>

            <input type="text" ref="username" className="input1" name="username" placeholder="Username" onChange={this.handleUsername} />

            <input type="text" ref="password" className="input2" name="password" placeholder="Password" onChange={this.handlePassword} />

            <a className="signUpLink" ref="signUp" style={{display:'none'}} href="/SignUpPage">New to FaveChat? Sign Up</a>
            <br/><br/>

            <input type="button" ref="go" className="goButton" name="go" value="GO!" onClick={this.signUp} />
          </div>
        </div>
      </div>
    );
  }
}

SignUpPage.contextTypes = {
  router: React.PropTypes.object
};
