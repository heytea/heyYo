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
  return <a target="_blank" rel="noopener noreferrer" {...args} href={href}>{children}</a>
}
export default HyLink