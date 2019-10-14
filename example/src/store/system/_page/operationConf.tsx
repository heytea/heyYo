import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row, Checkbox } from 'antd'
import { Input, Select, displayTypeProps as typeProps } from '@heytea/heyyo'
import PropsEdit from './propsEdit'

@observer
export default class OperationConf extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    let newValue
    if (typeof value.push !== 'function') {
      newValue = []
    } else {
      newValue = value
    }
    newValue.push({
      name: '',
      isShow: '',
      isShowRow: '',
      isBatch: '',
      props: [],
      action: '',
      actionApi: '',
      whom: '',
      isConfirm: '',
      urlExpression: ''
    })
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
      value.splice(index - 1, 0, tmp)
      onChange(value)
    }
  }
  down = (index: number) => {
    const { value = [], onChange } = this.props
    if (index < value.length - 1) {
      const tmp = value.splice(index, 1)
      value.splice(index + 1, 0, tmp)
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
    const { apiDetail, tableDetail, actionApi } = dict
    const { optFields } = apiDetail
    const { fields: fieldsConf } = tableDetail
    let fieldsData: string[] = []
    if (optFields) {
      fieldsData = optFields.split(',')
    } else {
      fieldsData = fieldsConf ? Object.keys(fieldsConf) : []
    }
    return <div>{value.map && value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="名字">
              <Input value={item.name} onChange={(v: string) => this.change(v, index, 'name')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="显示条件">
              <Input value={item.isShow} onChange={(v: string) => this.change(v, index, 'isShow')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="是否行显示">
              <Checkbox checked={!!item.isShowRow}
                        onChange={(e: any) => this.change(e.target.checked, index, 'isShowRow')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="是否批量">
              <Checkbox checked={!!item.isBatch}
                        onChange={(e: any) => this.change(e.target.checked, index, 'isBatch')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="是否确认">
              <Checkbox checked={!!item.isConfirm}
                        onChange={(e: any) => this.change(e.target.checked, index, 'isConfirm')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="操作方法">
              <Select value={item.action} data={['freeze', 'unfreeze', 'del', 'operate']} valKey="url" labelKey="desc"
                      onChange={(v: any) => this.change(v, index, 'action')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="操作接口">
              <Select value={item.actionApi} data={actionApi} valKey="url" labelKey="desc"
                      onChange={(v: any) => this.change(v, index, 'actionApi')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="操作参数">
              <Select value={item.actionOpt} data={fieldsData}
                      onChange={(v: any) => this.change(v, index, 'actionOpt')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="对象下标">
              <Input value={item.whom} onChange={(v: string) => this.change(v, index, 'whom')}/>
            </FormC.Item>
          </Col>
          <Col span={16}>
            <FormC.Item label="跳转URL">
              <Input value={item.urlExpression} onChange={(v: string) => this.change(v, index, 'urlExpression')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
            {index > 0 && <Button onClick={() => this.up(index)} icon="up"/>}
            {index < value.length - 1 && <Button onClick={() => this.down(index)} icon="down"/>}
          </Col>
          <Col span={24}>
            <FormC.Item label="props">
              <PropsEdit value={item.props} data={typeProps.button}
                         onChange={(v: any[]) => this.change(v, index, 'props')}/>
            </FormC.Item>
          </Col>
        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

