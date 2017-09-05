require('./style.scss');

import { render } from 'react-dom';


import React, { Component } from 'react';


export default class Display extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;
    return (
      <div className="display">
        <img className="logo" src="/alibi_logo.png" />
        <h3>My ID is: <code>{props.id}</code></h3>
        <h3>Devices I See</h3>
        <ul>
          {
            props.visibleBeacons.map((deviceUuid, index) => (
              <li className="device" key={index}><code>{deviceUuid}</code></li>
            ))
          }
        </ul>
      </div>
    );
  }
}

const fetchAndRender = function () {
  fetch('/devices').then(res => res.json()).then((res) => {
    console.log(res);
    console.log(res.visibleBeacons);
    console.log(Object.keys(res.visibleBeacons));
    render(<Display id={res.id} visibleBeacons={res.visibleBeacons} />, document.getElementById('target'));
  });
};

fetchAndRender();

setInterval(() => {
  fetchAndRender();
}, 1000);
