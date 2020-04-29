import {observer} from 'mobx-react'
import React, {Component, Fragment, FunctionComponent, ComponentClass} from "react";
import {Button, Icon, notification, Upload} from 'antd';
import {UploadProps} from 'antd/lib/upload'
import {UploadFile, UploadChangeParam} from 'antd/lib/upload/interface'
import Config from "../../../config/config";
import Store from "store";
import './upload.less';
import {toJS} from "mobx";

const {hosts} = Config;

function handleTips(tips: string, result: any = {}, type: string = 'error') {
  if (String(result.code) === '0') {
    notification.success({
      message: result.msg || tips
    });
  } else {
    notification[type]({
      message: result.msg || tips
    });
  }
}

export interface _UploadProps extends UploadProps {
  onSuccess?: (response: any, file: UploadFile) => void,
  onError?: (error: Error, response: any, file: UploadFile) => void,
  showErr?: boolean
}

export interface IProps {
  uploadProps?: _UploadProps,
  buttonProps?: {
    [key: string]: any
  },
  iconProps?: {
    type: string
  },
  isShowUpload?: boolean
  afterNode?: JSX.Element | FunctionComponent | ComponentClass,
  insertNode?: JSX.Element | FunctionComponent | ComponentClass,
  style?: { [key: string]: any }
}

@observer
export default class extends Component<IProps> {
  state = {
    fileList: []
  };
  getReallyAction = () => {
    let {uploadProps = {}} = this.props;
    let {action = ''} = uploadProps;
    const url = typeof action === 'function' ? '' : action;
    return url.replace(/^\/([\w\d]+)\//, (a1, a2) => a2 && hosts[a2] ? `${hosts[a2]}/` : a1);
  };
  getHeaders = () => {
    let {headers = {}} = this.props.uploadProps || {};
    const token = Store.get('token');
    return {
      Authorization: `Bearer ${token}`,
      ...headers
    }
  };
  getUploadProps = () => {
    let {uploadProps = {}} = this.props;
    const {onSuccess, onError, ...others} = uploadProps;
    const action = this.getReallyAction();
    const headers = this.getHeaders();
    const {onChange} = this;
    return {...others, action, headers, onChange};
  };
  getBtnProps = (): { [key: string]: any } => {
    const {buttonProps = {htmlType: 'button'}} = this.props;
    const {style = {}} = buttonProps;
    return {...buttonProps, style: toJS(style)};
  };
  onSuccess = (response: any, file: UploadFile) => { // 接口完成（200）
    let {uploadProps = {}} = this.props;
    let {onSuccess, showErr = false} = uploadProps;
    showErr && handleTips('上传成功', response);
    typeof onSuccess === 'function' && onSuccess(response, file);
  };
  onError = (error: Error, response: any, file: UploadFile) => { // 接口请求错误（非200） 及其他异常情况
    let {uploadProps = {}} = this.props;
    let {onError, showErr = true} = uploadProps;
    showErr && handleTips('上传失败', {}, 'error');
    typeof onError === 'function' && onError(error, response, file);
  };
  onChange = ({file, fileList, event}: UploadChangeParam) => {
    let {uploadProps = {}} = this.props;
    let {onChange} = uploadProps;
    if (file.status === 'done') {
      this.onSuccess(file.response, file);
    } else if (file.status === 'error') {
      this.onError(file.error, file.response, file);
    }
    typeof onChange === 'function' && onChange({file, fileList, event});
  };

  render() {
    const {iconProps = {}, afterNode: AfterNode, insertNode: InsertNode, style, isShowUpload = true} = this.props;
    const uploadProps = this.getUploadProps();
    const buttonProps = this.getBtnProps();
    const UploadButton = buttonProps.hasOwnProperty('render') ? buttonProps.render : null;
    return <Fragment>
      <div className="clearfix m-upload" style={{display: 'flex', ...style}}>
        <Upload {...uploadProps}>
          {isShowUpload ? (
            UploadButton ? <UploadButton/> : <Button disabled={uploadProps.disabled} {...buttonProps} >
              <Icon type="upload" {...iconProps}/>{buttonProps.children}
            </Button>
          ) : null}
        </Upload>
        {typeof AfterNode === "function" ? <AfterNode/> : AfterNode}
      </div>
      {typeof InsertNode === "function" ? <InsertNode/> : InsertNode}
    </Fragment>
  }
}
