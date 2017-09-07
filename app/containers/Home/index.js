/*
 *
 * Home
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import './style.css';
import './styleM.css';

import {Link} from 'react-router';

export default class Home extends React.PureComponent {

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
      if(json.error)
      {
          alert(json.error);
      }
      else if(json.token)
      {
        sessionStorage.setItem('token', json.token);
        _this.getUser(json.token);
        alert("welcome back");

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

            <input className="button" type="submit" value="Sign In"  onClick={this.showInput} />

            <input type="text" className="input1" name="username" placeholder="Username" onChange={this.handleUsername} />

            <input type="text" className="input2" name="password" placeholder="Password" onChange={this.handlePassword} />

            <a className="signUpLink" href="/SignUpPage">New to FaveChat? Sign Up</a>
            <br/><br/>

            <input type="button" ref="go" className="goButton" name="go" value="GO!" onClick={this.signIn} />
          </div>
        </div>
      </div>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object
};
