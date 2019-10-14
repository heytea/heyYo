import React, { Component } from "react";
import { observer } from 'mobx-react'
import { Row, Col } from 'antd'
import DetailRender from './detailRender'

type IFields = Array<{ title?: string, type?: string, field?: string, span?: number, style?: any, render?: Function }>

function getRowArr(fields: IFields) {
  const rowArr: Array<any> = [[]]
  let spanLength = 0
  for (let i = 0; i < fields.length; i += 1) {
    const item = fields[i]
    if (item.type === 'none') {
      continue
    }
    spanLength = spanLength + (item.span || 12)
    if (spanLength > 24) {
      spanLength = item.span || 12
      rowArr.push([item])
    } else {
      const endNum = rowArr.length - 1
      if (!rowArr[endNum]) {
        rowArr[endNum] = []
      }
      rowArr[endNum].push(item)
    }
  }
  return rowArr
}

interface IProps {
  isMobile: boolean,
  fields: Array<{ title?: string, field?: string, span?: number, style?: any, render?: Function }>
  data: { [key: string]: any },
  Store: any,
  scroll?: { [key: string]: any }
}

interface IState {
  rowArr: Array<Array<object>>
}

@observer
export default class DetailGrid extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const { fields = [] } = props
    this.state = { rowArr: getRowArr(fields) }
  }

  render() {
    const { isMobile, data = {}, Store, scroll = {} } = this.props
    const { rowArr } = this.state
    return (
      <div className="m-detail-grid">
        {rowArr.map((row, index) => (
          <Row key={index}>
            {row.map((item: any, colIndex) => {
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
                      <DetailRender data={data} item={item} value={value} Store={Store} scroll={scroll}/>
                    }
                  </div>
                </Col>
              )
            })}
          </Row>
        ))}
      </div>
    )
  }
}
