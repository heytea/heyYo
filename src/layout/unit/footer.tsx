import React, { useContext } from 'react'
import { ConfigContext } from '../../config'
import { observer } from 'mobx-react-lite'

const Footer = observer(function () {
  const { config: { footerText } } = useContext(ConfigContext)
  return <div id="b-footer">{footerText}</div>
})
export default Footer
