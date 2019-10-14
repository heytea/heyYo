import React, { Component } from 'react'
import { Form, Row, Col } from 'antd'
import { observer } from 'mobx-react'
import ItemType from './itemType'
import { FormProps } from 'antd/lib/form/Form'

const FormItem = Form.Item

interface IProps {
  Store?: { [key: string]: any },
  name?: string,
  loading?: boolean,
  values?: object,
  fields?: Array<{ type?: string, span?: number, title?: string }>,
  errs?: object,
  conf?: FormProps,
  data?: object,
  onChange?: Function,
  onSubmit?: Function,
  itemMap?: object,
  inlineChild?: boolean
}

@observer
export default class EditForm extends Component<IProps> {

  submit = (e: React.FormEvent<any>) => {
    const { onSubmit } = this.props
    e.preventDefault()
    e.stopPropagation()
    onSubmit && onSubmit(e)
  }
  getRowArr = () => {
    const { Store, name, fields = [] } = this.props
    let formConf: { [key: string]: any } = {}
    let formFields = []
    if (Store && name) {
      formConf = Store[`${name}FormConf`]
      formConf && (formFields = formConf.fields || [])
    }
    if (fields && fields.length > 0) { // 字段可自定义
      formFields = fields
    }
    const rowArr: Array<any> = [[]]
    const lengthMap = {}
    let lengthMapKey = 0
    let spanLength = 0
    for (let i = 0; i < formFields.length; i += 1) {
      const item = formFields[i]
      if (item.type === 'none') {
        continue
      }
      spanLength = spanLength + (item.span || 12)
      if (spanLength > 24) {
        spanLength = item.span || 12
        lengthMapKey = 1
        rowArr.push([item])
      } else {
        lengthMapKey += 1
        const endNum = rowArr.length - 1
        if (!rowArr[endNum]) {
          rowArr[endNum] = []
        }
        rowArr[endNum].push(item)
      }
      const tmpLen = (item.title && item.title.length) || 0
      if (tmpLen > (lengthMap[lengthMapKey] || 0)) {
        lengthMap[lengthMapKey] = tmpLen
      }
    }
    return { rowArr, lengthMap }
  }

  change = (valObj: any) => {
    const { onChange, Store, name } = this.props
    if (Store && name) {
      const { setForm } = Store
      typeof setForm === 'function' && setForm({ name, valObj })
    }
    onChange && onChange(valObj)
  }

  render() {
    const { values = {}, errs = {}, data, loading, inlineChild = false, children, itemMap, Store, name, conf } = this.props
    let formErrs = {}
    let formValues = {}
    let formConf: { [key: string]: any } = {} = {}
    if (Store && name) {
      formErrs = Store[`${name}Errs`]
      formValues = Store[`${name}Form`]
      formConf = Store[`${name}FormConf`]
    } else {
      formErrs = errs
      formValues = values
    }

    const formProps = formConf && formConf.props || conf || {}
    const { layout = 'horizontal' } = formProps
    this.getRowArr();
    const { rowArr, lengthMap } = this.getRowArr()
    const itemProps: { [key: string]: any } = { values: formValues, data: data || Store && Store.dict, loading }
    if (itemMap) {
      itemProps.itemMap = itemMap
    }
    return (
      <Form className="m-edit-form" {...formProps} onSubmit={this.submit}>
        {rowArr.map((row, index) => (
          <Row key={index} style={{ paddingBottom: layout === 'inline' ? '10px' : 0 }}>
            {row.map((item: any, cI: number) => (
              <Col key={item.field} span={item.span || 12}>
                <FormItem
                  help={formErrs ? formErrs[item.field] || null : null}
                  validateStatus={formErrs && formErrs[item.field] ? 'error' : ''}
                  label={item.title ? <ItemLabel length={lengthMap[cI + 1]} label={item.title}/> : ''}
                  required={item.rules && ((typeof item.rules === 'string' && item.rules.indexOf('required') >= 0) || (typeof item.rules === 'object' && item.rules.hasOwnProperty('required')))}
                  colon={item.hasOwnProperty('colon') ? item.colon : true}
                >
                  <ItemType conf={item} {...itemProps} onChange={this.change}/>
                </FormItem>
              </Col>
            ))}
            {index === rowArr.length - 1 && inlineChild && children}
          </Row>
        ))}
        {!inlineChild && children}
      </Form>
    )
  }
}

interface IItemProps {
  length: number,
  label: string
}

class ItemLabel extends Component<IItemProps> {
  render() {
    const { length = 0, label } = this.props
    if (!label) {
      return null
    }
    return <span style={{ width: 14 * length, display: 'inline-block' }}>{label}</span>
  }
}
