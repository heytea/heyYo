import React, { useEffect, useState } from 'react'
import { Form, Row, Col } from 'antd'
import { observer } from 'mobx-react-lite'
import ItemType from './itemType'
import { FormProps } from 'antd/lib/form/Form'

const FormItem = Form.Item

interface IProps {
  loading?: boolean,
  isGrid?: boolean,
  values?: object,
  fields?: Array<{ type?: string, span?: number, title?: string }>,
  data?: object,
  onSubmit?: Function,
}

const EditFrom = observer(function (props: IProps & FormProps) {
    const { onSubmit, fields = [], onChange = () => '', values = {}, data, loading, children, isGrid = false, ...args } = props
    const [rowArr, setRowArr] = useState([[]])
    const [lengthMap, setLengthMap]: [{ [key: string]: any }, Function] = useState({})
    let formFields: string | any[] = []
    if (fields && fields.length > 0) { // 字段可自定义
      formFields = fields
    }
    const itemProps: { [key: string]: any } = { values, data, loading }

    useEffect(() => {
      const rowArr: Array<any> = [[]]
      if (isGrid) {
        const lengthMap: { [key: string]: any } = {}
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
        setRowArr(rowArr)
        setLengthMap(lengthMap)
      }
    }, [formFields, isGrid])
    return (
      <Form className="m-edit-form" {...args}>
        {isGrid ? rowArr.map((row, index) => (
          <Row key={index} gutter={20}>
            {row.map((item: any, cI: number) => (
              <Col key={item.field} span={item.span || 12}>
                <HyFormItem item={item} itemProps={itemProps} onFieldChange={onChange} />
              </Col>
            ))}
          </Row>
        )) : formFields.map((item: any) => item.type && item.type !== 'none' ?
          <HyFormItem key={item.field} item={item} itemProps={itemProps} onFieldChange={onChange} /> : null)}
        {children}
      </Form>
    )
  }
)
export default EditFrom

function HyFormItem({ item, itemProps, onFieldChange }: { item: any, itemProps: any, onFieldChange: Function }) {
  return (
    <FormItem
      name={item.field}
      label={item.title || ''}
      rules={item.rules}
      dependencies={item.dependencies || []}
      colon={item.hasOwnProperty('colon') ? item.colon : true}
    >
      <ItemType conf={item} {...itemProps} onFieldChange={onFieldChange} />
    </FormItem>
  )
}

interface IItemProps {
  length: number,
  label: string
}

function ItemLabel(props: IItemProps) {
  const { length = 0, label } = props
  if (!label) {
    return null
  }
  return <span style={{ width: 14 * length, display: 'inline-block' }}>{label}</span>
}
