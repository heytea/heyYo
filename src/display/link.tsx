import React, { ReactNode, HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

interface IProps {
  href: string,
  children?: ReactNode
}

const HyLink = (props: IProps & HTMLAttributes<HTMLAnchorElement>) => {
  const { href = '', children = null, ...args } = props
  if (/^[./]+/.test(href)) {
    return (<Link {...args} to={href}>{children}</Link>)
  }
  const newProps: { [key: string]: any } = {
    rel: 'noopener noreferrer',
    ...args,
    href,
  }
  if (href.indexOf('http') >= 0) {
    newProps.target = '_blank'
  }
  return <a {...newProps}>{children}</a>
}
export default HyLink