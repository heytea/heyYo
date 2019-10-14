import React from 'react'
import { observable, action, computed } from 'mobx'
import { Modal, Spin, notification } from 'antd'
import { tree as getTree, add, edit, del, detail, IAdd } from '../../../api/account/admin/privilege'
import { Curd, Form, Tree, EditForm, ItemMapPlus as itemMapPlus } from '@heytea/heyyo'
import IStore, { IAddFormConf, IFormStatus, IDetailShowConf, } from '@heytea/heyyo/dist/store/_i'
import Http from '../../../api/http'
import Config from '../../../config'
import { ICURD } from '@heytea/heyyo/dist/store/curd'
import { IForm } from '@heytea/heyyo/dist/store/form'
import { getMap } from "../../../api/system/dict";

const { codeSuccess, apiFormat: { code, msg } } = Config
const { dfDataArr, dfDataObj } = Http

interface ICurd extends ICURD<any> {

}

@Curd @Form
class Privilege implements IStore {
  self: Privilege & ICurd & IForm

  constructor() {
    this.self = this as unknown as Privilege & ICurd & IForm
  }

  dataFn = { tree: getTree, add, edit, del, detail }
  dict: { [key: string]: any } = { tree: [] }
  @action
  getDict = async () => {
    const data = await getMap('status,privilegeType')
    if (data.code === 0) {
      this.dict = { ...this.dict, ...data.data }
    }
  }
  @observable treeForm = { id: '' }
  @observable treeLoading = false
  @observable treeData = { ...dfDataArr }
  @observable selectPrivilege = { id: '', title: '' }
  @observable isAddPrivilege = false
  @observable isEditPrivilege = false
  treeInitData = () => {
    this.getDict()
  }
  treeRequestAfterFn = ({ data, form }: any) => {
    if (data[code] === codeSuccess) {
      this.dict.tree = [{ id: 0, parentId: 0, name: '顶级节点' }].concat(data.data)
    }

    return { data, form }
  }

  treeSelect = (keys: string[], e: any) => {
    if (e.selected) {
      this.selectPrivilege = { id: keys[0] || '', title: e.selectedNodes[0].props.title || '' }
    } else {
      this.selectPrivilege = { id: '', title: '' }
    }
  }

  @action
  addPrivilege = () => {
    this.self.setForm({ name: 'add', valObj: { parentId: this.selectPrivilege.id || 0 } })
    this.isAddPrivilege = true
  }

  @action
  editPrivilege = async () => {
    if (!this.selectPrivilege.id || parseInt(this.selectPrivilege.id, 10) === 0) {
      notification.error({
        message: '请先选择权限',
      })
    } else {
      this.self.setForm({ name: 'detail', valObj: { id: this.selectPrivilege.id } })
      this.isEditPrivilege = true
      const detailData = await this.self.getDetail()
      if (detailData[code] !== codeSuccess) {
        notification.error({
          message: detailData[code],
          description: detailData[msg]
        })
        this.isEditPrivilege = false
      } else {
        this.self.setForm({ name: 'edit', valObj: detailData.data })
      }
    }
  }

  @action
  delPrivilege = async () => {
    if (!this.selectPrivilege.id || parseInt(this.selectPrivilege.id, 10) === 0) {
      notification.error({
        message: '请先选择权限',
      })
    } else {
      const self = this.self
      Modal.confirm({
        title: `你确定要删除权限: ${this.selectPrivilege.title} ?`,
        onOk: () => new Promise(async (resolve, reject) => {
          const delData = await this.delItem(self.selectPrivilege.id)
          if (delData[code] !== codeSuccess) {
            reject()
          } else {
            self.getDetail({ formName: 'tree' })
            resolve()
          }
        })
      })
    }
  }

  // 添加成功 关闭弹窗
  addRequestAfterFn = ({ data, form }: any) => {
    if (data[code] === codeSuccess) {
      this.isAddPrivilege = false
      this.addForm = { ...this.dfAddForm }
      this.self.getDetail({ formName: 'tree' })
    }
    return { data, form }
  }

  // 编辑成功 关闭弹窗
  editRequestAfterFn = ({ data, form }: any) => {
    if (data[code] === codeSuccess) {
      this.isEditPrivilege = false
      this.self.getDetail({ formName: 'tree' })
    }
    return { data, form }
  }

  treeShowConf: IDetailShowConf = {
    pageTitle: '权限管理',
    fields: [
      {
        span: 12, field: 'tree',
        render: (r: any, data: any[]) => data.length < 1 ? '暂无权限，请先添加' :
          <Tree data={data} onSelect={this.treeSelect} checkable={false} labelKey="name"/>
      },
      { span: 12, field: 'selectTree' },
      {
        span: 24, field: 'model',
        render: () => <div>
          <Modal
            title="添加权限"
            maskClosable={false}
            visible={this.isAddPrivilege}
            okButtonProps={{ loading: this.addStatus.loading, disabled: !this.addStatus.submit }}
            onOk={() => this.self.add()}
            onCancel={() => this.isAddPrivilege = false}
            okText="保存">
            <EditForm itemMap={itemMapPlus} Store={this} name="add" data={this.dict}/>
          </Modal>
          <Modal
            title="编辑权限"
            maskClosable={false}
            visible={this.isEditPrivilege}
            okButtonProps={{ loading: this.editStatus.loading, disabled: !this.editStatus.submit }}
            onOk={() => this.self.edit()}
            onCancel={() => this.isEditPrivilege = false}
            okText="保存">
            <Spin spinning={this.detailLoading} tip="获取详情……">
              <EditForm
                itemMap={itemMapPlus}
                Store={this} name="edit"
                data={this.dict}/>
            </Spin>
          </Modal>
        </div>
      }
    ]
  }

  @computed get treeBtnConf() {
    return {
      isEdit: false,
      actions: [
        { children: '添加', type: 'primary', onClick: this.addPrivilege },
        { children: '编辑', type: 'primary', onClick: this.editPrivilege, disabled: !this.selectPrivilege.id },
        { children: '删除', type: 'danger', onClick: this.delPrivilege, disabled: !this.selectPrivilege.id },
      ]
    }
  }

  dfAddForm: IAdd = {
    parentId: 0,
    name: '',
    icon: '',
    type: '',
    api: '',
    page: '',
    path: '',
    desc: '',
    status: 1,
    order: 0,
  }
  @observable
  addForm = { ...this.dfAddForm }
  @observable
  addErrs = { name: '', icon: '', }
  @observable
  addStatus: IFormStatus = { submit: false, loading: false }
  @observable
  addData = { ...dfDataObj }
  addFormConf: IAddFormConf = {
    props: { layout: 'inline' },
    fields: [
      { title: '菜单名', type: 'input', field: 'name', span: 24, rules: 'required' },
      {
        title: '父节点', type: 'selectTree', field: 'parentId', span: 24, rules: 'required', data: 'tree',
        props: { labelKey: 'name', multiple: false }
      },
      {
        title: 'api地址', type: 'selectRemote', field: 'api', span: 24,
        props: { url: '/admin/system/api/rows', labelKey: 'desc', apiKey: 'descLike' }
      },

      { title: '图标', type: 'input', field: 'icon', span: 24, },
      {
        title: '页面', type: 'selectRemote', field: 'page', span: 24,
        props: { url: '/admin/system/page/rows', labelKey: 'desc', apiKey: 'descLike' }
      },
      { title: '前端路径', type: 'input', field: 'path', span: 24 },
      {
        title: '状态', type: 'select', field: 'status', data: 'status', span: 24,
        props: { isNull: false, allowClear: false }
      },
      {
        title: '类型', type: 'select', field: 'type', data: 'privilegeType', span: 24,
        props: { isNull: false, allowClear: false }
      },
      { title: '排序', type: 'inputNumber', field: 'order', span: 24, props: { min: 0 } },
      { title: '备注', type: 'input', field: 'desc', span: 24 },
    ]
  }

  @observable
  detailForm = { id: '' }
  @observable
  detailLoading = false
  @observable
  detailData = { ...this.addData, data: { tree: [] } }

  dfEditForm = { ...this.dfAddForm, id: '' }
  @observable
  editForm = { ...this.dfEditForm }
  @observable
  editErrs = { ...this.addErrs }
  @observable
  editStatus: IFormStatus = { ...this.addStatus }
  @observable
  editData = { ...this.addData }
  editFormConf: IAddFormConf = { ...this.addFormConf, pageTitle: '编辑系统信息' }

  @action
  delItem = async (id: number | string) => {
    return this.dataFn.del({ id })
  }
}


export default Privilege
