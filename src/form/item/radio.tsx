import React, {Component, ReactComponentElement, ReactElement, ReactNode, FunctionComponent, CSSProperties} from 'react'
import {Radio} from 'antd'

const OptionComponents = {
  radio: Radio,
  button: Radio.Button
}

interface IProps {
  value: string | number,
  isAll?: boolean,
  data?: Object | Array<any>,
  type?: string,
  valKey?: string,
  labelKey?: string,
  onChange?: Function,
  radioStyle?: CSSProperties,
  wrapStyle?: CSSProperties,
  childStyle?: CSSProperties,
  afterChildren?: FunctionComponent | Component | any
  labelAfter?: FunctionComponent | Component | any
}

// data 支持
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'
export default class ReRadio extends Component<IProps> {
  getLabel = (label: any) => {
    const {labelAfter} = this.props;
    return this.props.labelAfter ? <div>
      {label}
      {labelAfter}
    </div> : label;
  };

  render() {
    const {value, data = [], isAll = false, onChange = () => '', type = 'radio', valKey = 'id', labelKey = 'name', radioStyle = {}, wrapStyle, childStyle, ...restProps} = this.props
    const _OptionComponent = OptionComponents[type] || Radio
    const OptionAfterChildComponent = (props: any) => {
      const {afterChildren: AfterChildren} = this.props;
      if (AfterChildren && AfterChildren.$$typeof === Symbol.for('react.element')) {
        return (() => AfterChildren)(); //你可以传入React Element
      } else {//或者可以传入React Component
        return AfterChildren ? <AfterChildren {...props} /> : null;
      }
    };
    const OptionComponent = (props: any) => {
      return this.props.afterChildren ? <div className="ant-radio-group-has-after-child" style={childStyle}>
        <_OptionComponent {...props} style={radioStyle}/>
        <OptionAfterChildComponent {...props}/>
      </div> : <_OptionComponent {...props} style={radioStyle}/>
    };
    const OptionChildComponent = (props: any) => {
      const {label, children: Child, value} = props;
      return Child ? <Child label={label} value={value}/> : label;
    };
    return (
      <Radio.Group {...restProps} value={value + ''} size="default" onChange={(e) => onChange(e.target.value)}
                   className={this.props.afterChildren && 'ant-radio-group-has-after-child-wrap'} style={wrapStyle}>
        {isAll && <OptionComponent key={''} value="">全部</OptionComponent>}
        {(data && typeof data === 'object') && (data instanceof Array ?
          data.map((item) => { // 数组
            const value = item[valKey || 'id']
            const label = item[labelKey]
            return (<OptionComponent key={value} value={value + ''} disabled={item.disabled}>{<OptionChildComponent
              children={this.props.children} label={this.getLabel(label)} value={value + ''}/>}</OptionComponent>)
          }) :
          Object.keys(data).map((key) => { // 对像
            if (typeof data[key] !== 'object') {
              return (<OptionComponent key={key} value={key}>{<OptionChildComponent
                children={this.props.children} label={data[key]} value={key}/>}</OptionComponent>)
            } else {
              const obj = data[key]
              const value = valKey ? obj[valKey] : key
              const label = obj[labelKey]
              return (<OptionComponent key={value} value={value + ''}>{<OptionChildComponent
                children={this.props.children} label={this.getLabel(label)} value={value + ''}/>}</OptionComponent>)
            }
          }))
        }
      </Radio.Group>
    )
  }
}
