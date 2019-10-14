import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, InputNumber, Row, Checkbox } from "antd";
import { Input, Select, displayTypeProps, formTypeProps } from '@heytea/heyyo'
import PropsEdit from './propsEdit'

const typeData = Object.keys(displayTypeProps)
@observer
export default class TableConf extends Component<any> {
  change = (v: any, type: string) => {
    const { value = {}, onChange } = this.props
    value[type] = v
    onChange(value)
  }

  render() {
    const { value = {}, dict } = this.props

    return (
      <div style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="dataKey">
              <Input value={value.dataKey} onChange={(v: any) => this.change(v, 'dataKey')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="scrollX">
              <InputNumber value={value.scrollX} onChange={(v: any) => this.change(v, 'scrollX')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="scrollY">
              <InputNumber value={value.scrollY} onChange={(v: any) => this.change(v, 'scrollY')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="rowKey">
              <Input value={value.rowKey} onChange={(v: any) => this.change(v, 'rowKey')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="size">
              <Select value={value.size} data={['default', 'middle', 'small']}
                      onChange={(v) => this.change(v, 'size')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="isRowSelection">
              <Checkbox value={value.isRowSelection}
                        onChange={(e: any) => this.change(e.target.checked, 'isRowSelection')}/>
            </FormC.Item>
          </Col>
          {value.isRowSelection &&
          <Col span={24}>
              <FormC.Item label="rowSelection">
                  <TableRowSelection value={value.rowSelection} onChange={(v: any) => this.change(v, 'rowSelection')}/>
              </FormC.Item>
          </Col>
          }
          <Col span={24}>
            <FormC.Item label="操作列配置">
              <PropsEdit value={value.actionProps} data={displayTypeProps.tableColumn}
                         onChange={(v: any) => this.change(v, 'actionProps')}/>
            </FormC.Item>
          </Col>
          <Col span={24}>
            <FormC.Item label="列">
              <TableColumns value={value.columns} dict={dict} onChange={(v: any) => this.change(v, 'columns')}/>
            </FormC.Item>
          </Col>
        </Row>
      </div>)
  }

}

@observer
class TableColumns extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    value.push({
      field: '',
      title: '',
      align: '',
      type: '',
      dataIndex: '',
      width: '',
      fixed: '',
      props: [],
      // rule: '',
      // expression: ''
    })
    onChange(value)
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
    const { apiDetail, tableDetail } = dict
    const { fields } = apiDetail
    const { fields: fieldsConf } = tableDetail
    let fieldsData: string[] = []
    if (fields) {
      fieldsData = fields.split(',')
    } else {
      fieldsData = fieldsConf ? Object.keys(fieldsConf) : []
    }
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#ddd', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="字段">
              <Select value={item.field} mode={item.type === 'rangeDate' ? 'multiple' : 'tags'} data={fieldsData}
                      onChange={(v) => this.change(v, index, 'field')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="标题">
              <Input value={item.title} onChange={(v: any) => this.change(v, index, 'title')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="index">
              <Input value={item.dataIndex} onChange={(v: any) => this.change(v, index, 'dataIndex')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="align">
              <Select value={item.align} data={['left', 'right', 'center']}
                      onChange={(v) => this.change(v, index, 'align')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="width">
              <InputNumber value={item.width} onChange={(v) => this.change(v, index, 'width')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="fixed">
              <Select value={item.fixed} data={['left', 'right']} onChange={(v) => this.change(v, index, 'fixed')}/>
            </FormC.Item>
          </Col>

          <Col span={16}>
            <FormC.Item label="type">
              <Select value={item.type} data={typeData} onChange={(v) => this.change(v, index, 'type')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
            {index > 0 && <Button onClick={() => this.up(index)} icon="up"/>}
            {index < value.length - 1 && <Button onClick={() => this.down(index)} icon="down"/>}
          </Col>
          {item.type &&
          <Col span={24}>
              <FormC.Item label="props">
                  <PropsEdit value={item.props} data={displayTypeProps[item.type]}
                             onChange={(v: any[]) => this.change(v, index, 'props')}/>
              </FormC.Item>
          </Col>}
          {/*<Col span={8}>*/}
          {/*  <FormC.Item label="rule">*/}
          {/*    <Select value={item.rule} data={['template', 'arithmetic']}*/}
          {/*            onChange={(v) => this.change(v, index, 'rule')}/>*/}
          {/*  </FormC.Item>*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*  <FormC.Item label="expression">*/}
          {/*    <Input value={item.expression} onChange={(v: any) => this.change(v, index, 'expression')}/>*/}
          {/*  </FormC.Item>*/}
          {/*</Col>*/}

        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

@observer
class TableRowSelection extends Component<any> {

  change = (v: any, type: string) => {
    const { value = {}, onChange, } = this.props
    value[type] = v
    onChange(value)
  }

  render() {
    const { value = {} } = this.props
    return (
      <div style={{ width: '100%', background: '#ddd', padding: '10px', marginBottom: '10px', minWidth: '780px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="width">
              <InputNumber value={value.columnWidth} onChange={(v: any) => this.change(v, 'columnWidth')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="title">
              <Input value={value.columnTitle} onChange={(v: any) => this.change(v, 'columnTitle')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="fixed">
              <Checkbox value={value.fixed} onChange={(e: any) => this.change(e.target.checked, 'fixed')}/>
            </FormC.Item>
          </Col>
          <Col span={24}>
            <FormC.Item label="props">
              <PropsEdit value={value.props || []} data={formTypeProps.aCheckbox}
                         onChange={(v: any[]) => this.change(v, 'props')}/>
            </FormC.Item>
          </Col>
        </Row>
      </div>
    )
  }
}
