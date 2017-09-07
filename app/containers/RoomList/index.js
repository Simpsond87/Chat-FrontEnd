/*
 *
 * RoomList
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import './style.css';
import './styleM.css';

export default class RoomList extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      user: JSON.parse(sessionStorage.getItem('user'))
    }
  };

  render() {
    return (
      <div className="container">
        <Helmet title="RoomList" meta={[ { name: 'description', content: 'Description of RoomList' }]}/>

        <div className="welcomeBoxUser">
          <h1 className="faveChat">FaveChat<span className="blue">!</span></h1>
          <h2 className="blue">Welcome <span className="green" ref="user">{this.state.user.username}</span></h2>
        </div>

        <div className="roomListBox">
          <div className="roomListHeader"><h1 className="blue">Room List</h1></div>
          <div>
            <a href="/ChatRoom"><h2 className="green">General</h2></a>
            <a href="/ChatRoom"><h2 className="green">Philosophy</h2></a>
            <a href="/ChatRoom"><h2 className="green">Science</h2></a>
            <a href="/ChatRoom"><h2 className="green">Games</h2></a>
            <a href="/ChatRoom"><h2 className="green">Computers</h2></a>
            <a href="/ChatRoom"><h2 className="green">Literature</h2></a>
            <a href="/ChatRoom"><h2 className="green">Health</h2></a>
            <a href="/ChatRoom"><h2 className="green">Students</h2></a>
          </div>
        </div>
      </div>
    );
  }
}

RoomList.contextTypes = {
  router: React.PropTypes.object
};
