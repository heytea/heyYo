import React, { ReactNode } from 'react'
import { Button, Divider, Progress, Tooltip, Avatar, Tag } from 'antd'
import Datetime from './datetime';
import DetailGrid from '../page/_unit/detailGrid'
import PhoneEncrypt from './phoneEncrypt'
import IdCardEncrypt from './idCardEncrypt'
import Currency from './currency'
import Link from '../display/link'
import Tree from '../form/item/tree'
import KeyToValue from '../display/keyToValue'
import SelectValues from '../display/selectValues'

function ADC(C: ReactNode, opt: { valProp?: string, dataProp?: string } = {}) {
  const { valProp = 'children', dataProp = '' } = opt
  return (props: any) => {
    const { value, data, ...oldProps } = props
    const newProps: { [key: string]: any } = {}
    newProps[valProp || 'children'] = value
    if (dataProp) {
      newProps[dataProp] = data
    }
    // @ts-ignore
    return <C  {...oldProps} {...newProps} />
  }

}

const itemMap: { [key: string]: any } = {
  button: ADC(Button),
  avatar: ADC(Avatar, { valProp: 'src' }),
  tooltip: ADC(Tooltip),
  tag: ADC(Tag),
  progress: ADC(Progress, { valProp: 'percent' }),
  divider: ADC(Divider),
  link: ADC(Link),
  datetime: Datetime,
  keyToValue: KeyToValue,
  detailGrid: DetailGrid,
  phoneEncrypt: PhoneEncrypt,
  idCardEncrypt: IdCardEncrypt,
  currency: Currency,
  tree: Tree,
  selectValues: SelectValues,
}
export default itemMap
export const typeProps: { [key: string]: any } = {
  button: {
    type: 'primary|dashed|danger|link',
    size: 'small|large',
    disabled: 'boolean',
    ghost: 'boolean',
    href: 'string',
    htmlType: 'string',
    icon: 'string',
    loading: 'boolean',
    shape: 'circle|round',
    target: 'string',
    block: 'boolean',
  },
  avatar: {
    icon: 'string',
    shape: 'circle|square',
    size: 'large|small|default',
    value: 'string',
    srcSet: 'string',
    alt: 'string',
  },
  tooltip: {
    arrowPointAtCenter: 'boolean',
    autoAdjustOverflow: 'boolean',
    defaultVisible: 'boolean',
    mouseEnterDelay: 'number',
    mouseLeaveDelay: 'number',
    overlayClassName: 'string',
    overlayStyle: 'object',
    placement: 'string',
    trigger: 'string',
    visible: 'boolean',
    value: 'string'
  },
  tab: {
    closable: 'boolean',
    color: 'string',
    visible: 'boolean',
    value: 'string',
  },
  progress: {
    type: 'line|circle|dashboard',
    percent: 'number',
    showInfo: 'boolean',
    status: 'success|exception|normal|active',
    strokeLinecap: 'round|square',
    strokeColor: 'string',
    successPercent: 'number',
  },
  divider: {
    value: 'string',
    dashed: 'boolean',
    orientation: 'left|right',
    type: 'horizontal|vertical',
  },
  link: {
    href: 'string',
    value: 'string',
    children: 'string'
  },
  currency: {
    sign: 'string',
    fixed: 'number',
    value: 'string',
  },
  datetime: {
    format: 'string',
    value: 'string',
    accurate: 'second|millisecond',
  },
  idCardEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
    value: 'string',
  },
  keyToValue: {
    data: 'string',
    color: 'string',
    colors: 'string',
    isTag: 'boolean',
    value: 'string|number',
  },
  phoneEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
    value: 'string',
  },
  svg: { src: 'string' },
  tableColumn: {
    align: 'left|right|center',
    className: 'string',
    colSpan: 'number',
    dataIndex: 'string',
    defaultSortOrder: 'ascend|descend',
    filterDropdownVisible: 'boolean',
    filtered: 'boolean',
    filterMultiple: 'boolean',
    fixed: 'boolean',
    key: 'string',
    sortOrder: 'string',
    width: 'number',
  },
  selectValues: {
    value: 'string',
    data: 'string',
    vToString: 'boolean',
    splitKey: 'string',
    labelKey: 'string',
    valKey: 'string',
  },
  tree: {
    value: 'string|array',
    data: 'string',
    valKey: 'string',
    labelKey: 'string',
    childKey: 'string',
    isRemoveParentKey: 'boolean',
    checkable: 'boolean',
    autoExpandParent: 'boolean',
    blockNode: 'boolean',
    checkStrictly: 'boolean',
    defaultExpandAll: 'boolean',
    defaultExpandParent: 'bool',
    disabled: 'bool',
    draggable: 'boolean',
    multiple: 'boolean',
    showIcon: 'boolean',
    showLine: 'boolean',
    showOnlySelected: 'boolean',
  }
}

