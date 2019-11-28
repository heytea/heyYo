import React, { Component } from 'react'
import { ConfigContext } from "../../config";

export default class Footer extends Component {
  static contextType = ConfigContext;

  render() {
    const { config: { footerText } } = this.context
    return <div id="b-footer">{footerText}</div>
  }
}
