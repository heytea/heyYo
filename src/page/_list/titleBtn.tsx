import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Row, Col } from 'antd'
import Link from '../../display/link'

const ListTitleBtn = observer(function ({ store }: any) {
  const conf = store.listPage.add
  if (!conf) {
    return null
  }
  let isArray = Object.prototype.toString.call(conf).includes('Array');
  let maps: Array<{ [key: string]: any }> = isArray ? Array.from(conf) : [conf];
  return (
    <div className="add-link">
      <Row>
        {maps.map((listAddConf) => {
          return (
            listAddConf.name &&
            <Col key={listAddConf.name} span={24 / maps.length}>
              <Link
                href={listAddConf.url ? (typeof listAddConf.url === 'function' ? listAddConf.url() : listAddConf.url) : 'javascript:;'}>
                <Button type="primary" {...listAddConf.props}>{listAddConf.name}</Button>
              </Link>
            </Col>
          )
        })}
      </Row>
    </div>)
})

export default ListTitleBtn
