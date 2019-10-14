import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Col, Form as FormC, Row } from "antd";
import { Input, displayTypeProps as typeProps } from 'heyyo'
import PropsEdit from './propsEdit'

@observer
export default class TableConf extends Component<any> {
  change = (v: any, type: string) => {
    const { value = {}, onChange } = this.props
    const newValue = typeof value === 'object' ? value : {}
    newValue[type] = v
    onChange(newValue)
  }

  render() {
    const { value = {} } = this.props

    return (
      <div style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={16}>
            <FormC.Item label="按钮名">
              <Input value={value.name} onChange={(v: any) => this.change(v, 'name')}/>
            </FormC.Item>
          </Col>

          <Col span={16}>
            <FormC.Item label="网址">
              <Input value={value.url} onChange={(v: any) => this.change(v, 'url')}/>
            </FormC.Item>
          </Col>
          <Col span={24}>
            <FormC.Item label="props">
              <PropsEdit value={value.props} data={typeProps.button}
                         onChange={(v: any[]) => this.change(v, 'props')}/>
            </FormC.Item>
          </Col>

        </Row>
      </div>)
  }
}
