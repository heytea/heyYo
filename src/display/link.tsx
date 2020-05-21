import React, {Component, ReactNode, HTMLAttributes} from 'react'
import {Link} from 'react-router-dom'

interface IProps {
  href: string,
  useiframe?: string,
  children?: ReactNode
}

export default class extends Component<IProps & HTMLAttributes<HTMLAnchorElement>> {

  render() {
    const {props: {href = '', children = null, useiframe}} = this
    if (useiframe) {
      return (<Link {...this.props} to={useiframe}>{children}</Link>)
    } else if (/^[./]+/.test(href)) {
      return (<Link {...this.props} to={href}>{children}</Link>)
    }
    return <a target="_blank" rel="noopener noreferrer" {...this.props} href={href}>{children}</a>

  }
}
