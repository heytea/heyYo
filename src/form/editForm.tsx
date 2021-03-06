import React, { useContext, useEffect, useState } from 'react'
import { Form, Row, Col, } from 'antd'
import { observer } from 'mobx-react-lite'
import ItemType from './itemType'
import { FormProps } from 'antd/lib/form/Form'
import LangContext from '../lang'
import { UIContext } from "../index";

const FormItem = Form.Item

interface IProps {
  loading?: boolean,
  isGrid?: boolean,
  values?: object,
  errs?: object,
  fields?: Array<{ type?: string, span?: number, title?: string }>,
  data?: object,
  onSubmit?: Function,
}

const EditFrom = observer(function (props: IProps & FormProps) {
    const { onSubmit, fields = [], onChange = () => '', values = {}, data, errs, loading, children, isGrid = true, ...args } = props
    const [rowArr, setRowArr] = useState([[]])
    const [lengthMap, setLengthMap]: [{ [key: string]: any }, Function] = useState({})
    const lang = useContext(LangContext)
    const { isMobile } = useContext(UIContext)
    const itemProps: { [key: string]: any } = { values, data, loading }
    useEffect(() => {
      const rowArr: Array<any> = [[]]
      if (isGrid) {
        const lengthMap: { [key: string]: number } = {}
        let lengthMapKey = 0
        let spanLength = 0
        for (let i = 0; i < fields.length; i += 1) {
          const item = fields[i]
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
    }, [fields, isGrid])
    return (
      <Form className="m-edit-form" {...args} validateMessages={lang.validateMessages}>
        {isGrid && !isMobile ? rowArr.map((row, index) => (
          <Row key={index} gutter={20}>
            {row.map((item: any, cI: number) => (
              <Col key={item.field} span={item.span || 12}>
                <HyFormItem errs={errs} labelLen={lengthMap[cI + 1]} item={item} itemProps={itemProps}
                            onFieldChange={onChange} />
              </Col>
            ))}
          </Row>
        )) : fields.map((item: any) => item.type && item.type !== 'none' ?
          <HyFormItem key={item.field} errs={errs} item={item} itemProps={itemProps} onFieldChange={onChange} /> : null)}
        {children}
      </Form>
    )
  }
)
export default EditFrom

const HyFormItem = observer(function ({ item, labelLen, errs, itemProps, onFieldChange }: { item: any, labelLen?: number, errs?: object, itemProps: any, onFieldChange: Function }) {
  const help = errs && errs[item.field] && (typeof errs[item.field] === 'string' ? errs[item.field] : (errs[item.field].length > 0 ? errs[item.field][0] : '')) || ''
  const { field, title = '', rules, dependencies = [] } = item
  const props: { [key: string]: any } = { name: field, label: title, rules, dependencies }
  if (help) {
    props.help = help
    props.validateStatus = 'error'
  }
  if (labelLen && !(typeof title === 'undefined' || title === '')) {
    props.label = <ItemLabel label={title} length={labelLen} />
  }

  return (
    <FormItem
      {...props}
      colon={item.hasOwnProperty('colon') ? item.colon : true}
    >
      <ItemType conf={item} {...itemProps} onFieldChange={onFieldChange} />
    </FormItem>
  )
})

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
