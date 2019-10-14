import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row, } from 'antd'
import { Input } from 'heyyo'

@observer
export default class BreadcrumbConf extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    let newValue
    if (typeof value.push !== 'function') {
      newValue = []
    } else {
      newValue = value
    }
    newValue.push({ title: '', url: '', icon: '', })
    onChange(newValue)
  }
  cut = (index: number) => {
    const { value = [], onChange } = this.props
    value.splice(index, 1)
    // values[field] = value
    onChange(value)
  }
  up = (index: number) => {
    if (index > 0) {
      const { value = [], onChange } = this.props
      const tmp = value.splice(index, 1)
      value.splice(index - 1, 0, tmp)
      // values[field] = value
    onChange(value)
    }
  }
  down = (index: number) => {
    const { value = [], onChange } = this.props
    if (index < value.length - 1) {
      const tmp = value.splice(index, 1)
      value.splice(index + 1, 0, tmp)
      // values[field] = value
    onChange(value)
    }
  }
  change = (v: any, i: number, type: string) => {
    const { value = [], onChange } = this.props
    value[i][type] = v
    // values[field] = value
    onChange(value)
  }

  render() {
    const { value = [] } = this.props
    return <div>{value && value.map && value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="标题">
              <Input value={item.title} onChange={(v: string) => this.change(v, index, 'title')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="网址">
              <Input value={item.url} onChange={(v: string) => this.change(v, index, 'url')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="图标">
              <Input value={item.icon} onChange={(v: string) => this.change(v, index, 'icon')}/>
            </FormC.Item>
          </Col>
          <Col span={16}>
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
