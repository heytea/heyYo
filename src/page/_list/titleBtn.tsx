import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Row, Col } from 'antd'
import Link from '../../display/link'

const ListTitleBtn = observer(function ({ addConf }: any) {
  if (!addConf) {
    return null
  }
  let isArray = Object.prototype.toString.call(addConf).includes('Array');
  let maps: Array<{ [key: string]: any }> = isArray ? Array.from(addConf) : [addConf];
  return (
    <div className="add-link">
      <Row>
        {maps.map((conf) => {
          const href = conf.url ? (typeof conf.url === 'function' ? conf.url() : conf.url) : ''
          return (
            conf.name &&
            <Col key={conf.name} span={24 / maps.length}>
              {href ? <Link
                href={conf.url ? (typeof conf.url === 'function' ? conf.url() : conf.url) : 'javascript:;'}>
                <Button type="primary" {...conf.props}>{conf.name}</Button>
              </Link> :
                <Button type="primary" {...conf.props}>{conf.name}</Button>
              }
            </Col>
          )
        })}
      </Row>
    </div>)
})

export default ListTitleBtn
