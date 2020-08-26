import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import IStore from '../../store/_i'
import { Row, Col } from 'antd'
import { UIContext } from '../../index'
import RenderDisplay from '../../display/renderDisplay'

export interface IProps {
  store: IStore,
  data: any,
  fields: any[]
}

const DetailGrid = observer(({ store, fields, data }: IProps) => {
  const { isMobile } = useContext(UIContext)
  const [rows, setRows]: [any[], Function] = useState([])
  const { fieldsConf = {} } = store
  const getFieldConf = (field: string) => {
    const { title = '', out = '', data = '', outProps, outSpan } = fieldsConf && fieldsConf[field] || {}
    return { field, title, type: out, data, props: outProps, span: outSpan }
  }
  useEffect(() => {
    const rowArr: Array<any> = [[]]
    let spanLength = 0
    for (let i = 0; i < fields.length; i += 1) {
      const item = fields[i]
      let fieldItem: { [key: string]: any } = {}
      if (typeof item === 'string') {
        fieldsConf[item] && (fieldItem = getFieldConf(item))
      } else if (item.field) {
        fieldItem = { ...(item.conf ? getFieldConf(item.conf) : getFieldConf(item.field) || {}), ...item }
      }
      if (fieldItem.type === 'none') {
        continue
      }
      spanLength = spanLength + (fieldItem.span || 12)
      if (spanLength > 24) {
        spanLength = fieldItem.span || 12
        rowArr.push([fieldItem])
      } else {
        const endNum = rowArr.length - 1
        if (!rowArr[endNum]) {
          rowArr[endNum] = []
        }
        rowArr[endNum].push(fieldItem)
      }
    }
    setRows(rowArr)
  }, [fields, fieldsConf])
  return (
    <div className="m-detail-grid">
      {rows.map((row, index) => (
        <Row key={index}>
          {row.map((item: any, colIndex: number) => {
            let fieldsArr = []
            if (typeof item.field === 'undefined') {
              console.error(`${JSON.stringify(item)} 字段 field 不存在`)
            } else {
              fieldsArr = item.field.split('.')
            }
            let tmpData: any = Object.assign({}, data)
            for (let i = 0; i < fieldsArr.length; i += 1) {
              const tmpField = fieldsArr[i]
              if (typeof tmpData !== 'object') {
                console.error(`详情页取值错误 field:${item.field}`)
                break
              }
              tmpData = tmpData[tmpField]
            }
            const value = tmpData
            return (
              <Col key={colIndex} span={isMobile ? 24 : item.span || 12}>
                <div className="u-col-content" style={item.style}>
                  {item.title && <span className="u-col-title">{item.title}:</span>}
                  {typeof item.render === 'function' ? item.render(value, data, index) :
                    <RenderDisplay type={item.type} record={data} props={item.props} data={item.data} val={value}
                                   store={store} />
                  }
                </div>
              </Col>
            )
          })}
        </Row>
      ))}
    </div>
  )
})

export default DetailGrid
