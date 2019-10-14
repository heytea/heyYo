import React, { Component } from 'react'
import { Button } from 'antd'
import { observer } from 'mobx-react'
import { Curd, Form, Input, Link } from 'heyyo'
import IStore, { IFormStatus, IAddFormConf } from 'heyyo/dist/store/_i'
import { observable } from 'mobx'
import Http from '../../api/http'
import { add, detail, edit, list } from '../../api/system/dict'

const { dfDataPage, dfDataObj } = Http
@Curd @Form
export default class Table implements IStore {
  dataFn = { add, detail, edit, list }
  @observable dict = { db: [], name: [], fields: [], service: [], on: ['HAS_ONE', 'HAS_MANY'] }

  @observable listData = { ...dfDataPage, data: { data: [] } }
  @observable listLoading = false
  dfListForm = { nameLike: '', page: 1, pageSize: 20 }
  @observable listForm = { ...this.dfListForm }

  // listInitData = () => this.initDict()
  listAddConf = { name: '添加字典', url: '/system/dict/add' }
  listFormConf = {
    pageTitle: '字典列表',
    fields: [
      { title: '名称', field: 'nameLike', type: 'input', span: 8 },
    ]
  }
  listTable = {
    dataKey: 'data',
    scroll: { x: 1100 },
    columns: [
      {
        title: '名称', dataIndex: 'name', width: 220,
        render: (v: string, r: any) => <Link href={`/system/dict/detail?id=${r.id}`}>{v}</Link>
      },
      { title: '描述', dataIndex: 'desc' },
      // { title: 'values', dataIndex: 'values' },
    ]
  }
  dfAddForm = { name: '', values: [], desc: '' }
  @observable addForm = { ...this.dfAddForm }
  @observable addErrs = { name: '', db: '', service: '' }
  @observable addStatus: IFormStatus = { submit: false, loading: false }
  @observable addData = { ...dfDataObj }
  @observable
  addFormConf: IAddFormConf = {
    pageTitle: '添加字典',
    fields: [
      { title: 'name', field: 'name', type: 'input', span: 12, rules: 'required', },
      { title: 'desc', field: 'desc', type: 'input', span: 12, },
      { title: 'values', field: 'values', span: 24, rules: 'required', render: (item: any) => <RUnique {...item}/> },
    ]
  }

  @observable detailData = { ...dfDataObj }
  @observable detailLoading = false
  @observable detailForm = { id: '' }
  @observable editForm = { ...this.dfAddForm }
  @observable editErrs = { ...this.addErrs }
  @observable editStatus = { ...this.addStatus }
  @observable editData = { ...this.addData }
  @observable editFormConf = { ...this.addFormConf }
}

@observer
class RUnique extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    value.push({ key: '', val: '' })
    // values[field] = value
    onChange(value)
  }
  cut = (index: number) => {
    const { value = [], onChange } = this.props
    value.splice(index, 1)
    // values[field] = value
    onChange(value)
  }
  change = (v: any, index: number, type: string) => {
    const { value = [], onChange } = this.props
    value[index][type] = v
    // values[field] = value
    onChange(value)
  }

  render() {
    const { value = [] } = this.props
    return <div>
      {value && value.map((item: any, index: number) =>
        <div key={index}>
          <div style={{ display: 'inline-block', marginRight: '10px' }}>
            key:
            <div style={{ display: 'inline-block', marginRight: '10px' }}>
              <Input value={value[index].key} onChange={(v: string) => this.change(v, index, 'key')}/>
            </div>
            val:
            <div style={{ display: 'inline-block', marginRight: '10px' }}>
              <Input value={value[index].val} onChange={(v: string) => this.change(v, index, 'val')}/>
            </div>
          </div>
          <Button onClick={() => this.cut(index)} style={{ display: 'inline-block' }}>-</Button>
        </div>
      )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}
