import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row } from 'antd'
import { Input } from '@heytea/heyyo'
import DetailFieldConf from './detailFieldConf'

@observer
export default class FormConf extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    let newValue
    if (!value || typeof value.push !== 'function') {
      newValue = []
    } else {
      newValue = value
    }
    newValue.push({ title: '', fields: [] })
    onChange(newValue)
  }
  cut = (index: number) => {
    const { value = [], onChange } = this.props
    value.splice(index, 1)
    onChange(value)
  }
  up = (index: number) => {
    if (index > 0) {
      const { value = [], onChange } = this.props
      const tmp = value.splice(index, 1)
      value.splice(index - 1, 0, tmp[0])
      onChange(value)
    }
  }
  down = (index: number) => {
    const { value = [], onChange } = this.props
    if (index < value.length - 1) {
      const tmp = value.splice(index, 1)
      value.splice(index + 1, 0, tmp[0])
      onChange(value)
    }
  }
  change = (v: any, i: number, type: string) => {
    const { value = [], onChange, dict } = this.props
    const { tableDetail } = dict
    const { fieldMap } = tableDetail
    value[i][type] = v
    if (type === 'type') {
      value[i].props = []
      value[i].dfVal = ''
    }
    if (type === 'field' && v && fieldMap[v]) {
      value[i].title = fieldMap[v].desc
    }
    onChange(value)
  }

  render() {
    const { value = [], dict } = this.props
    return <div>{value && value.map && value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="标题">
              <Input value={item.title} onChange={(v: string) => this.change(v, index, 'title')}/>
            </FormC.Item>
          </Col>
          <Col span={24}>
            <FormC.Item label="字段">
              <DetailFieldConf dict={dict} value={item.fields}
                               onChange={(v: string) => this.change(v, index, 'fields')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
            {index > 0 && <Button onClick={() => this.up(index)} icon="up"/>}
            {index < value.length - 1 && <Button onClick={() => this.down(index)} icon="down"/>}
          </Col>
        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}
