/*
 *
 * ChatRoom
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import Pusher from 'pusher-js';

import './style.css';
import './styleM.css';

export default class ChatRoom extends React.PureComponent {
  render() {
    return (
      <div className="container">
        <Helmet title="FaveChat | General Chat" meta={[ { name: 'description', content: 'Description of ChatRoom' }]}/>

        <div className="title">
          <h1 className="faveChat">FaveChat<span className="blue">!</span></h1>
          <span className="signOut"><h2 className="green">Username <a href="#" className="blue">Sign Out</a></h2></span>
        </div>
        <div className="chatWindow">
          <div className="chatBox">
              <h3><span className="green">User1<span className="orange">:</span></span>chat text</h3>
          </div>
          <div className="users">
            <br/>
            <h2>Users</h2>
            <br/>
            <div><h3 className="green">user1</h3></div>
          </div>
          <div className="input">
            <input type="text" className="text" name="message"/>
            <input type="submit" className="send" name="send" value="Send"/>
          </div>
        </div>
      </div>
    );
  }
}

ChatRoom.contextTypes = {
  router: React.PropTypes.object
};
