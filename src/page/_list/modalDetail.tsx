import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, Table } from 'antd';
import IStore from '../../store/_i';
import RenderDisplay from '../../display/renderDisplay'
import DetailContent from '../_detail/content'

export interface IProps {
  store: IStore
}

const ModalDetail = observer((props: IProps) => {
  const { store } = props;
  const { modalDetail, listData, modelDetailVisible, setModelDetailVisible, modelDetailIndex, } = store;
  const { type = 'table', modalProps = {}, } = modalDetail || {}
  const data = (listData?.data?.data && listData.data.data[modelDetailIndex]) || {};

  return <Modal
    title='详情'
    width={800}
    visible={modelDetailVisible}
    cancelButtonProps={{ style: { display: 'none' } }}
    onOk={() => setModelDetailVisible(false)}
    onCancel={() => setModelDetailVisible(false)}
    {...modalProps}
  >
    {type === 'table' ?
      <RenderTable store={store} data={data} /> :
      <DetailContent store={store} data={data} />
    }

  </Modal>;
});

const RenderTable = observer((props: { data: any, store: any }) => {
  const { store, data } = props;
  const { modalDetail, fieldsConf } = store;
  const { attrColumn = {}, valueColumn = {}, tableProps = {}, keys } = modalDetail || {}
  const dataArr: any[] = [];
  const valueRender = (v: any, r: any, i: number) => {
    const { out, dictData, outProps } = r
    if (out) {
      return <RenderDisplay type={out} data={dictData} props={outProps} store={store} val={v} record={data} index={i} />
    }
    return v
  }
  const columns = [
    { title: '属性', dataIndex: 'attr', key: 'attr', ...attrColumn },
    { title: '值', dataIndex: 'value', key: 'value', render: valueRender, ...valueColumn },
  ];

  const dataKeys = keys && keys.length > 0 ? keys : Object.keys(data)
  dataKeys.forEach((key: string, index: number) => {
    const conf = fieldsConf && fieldsConf[key] || {}
    const { title = '', data: dictData = '', out = '', outProps = {} } = conf || {}
    const item: { [key: string]: any } = { attr: title || key, value: data[key], index, dictData, out, outProps }
    dataArr.push(item);
  });
  return <Table
    size="small"
    rowKey="attr"
    dataSource={dataArr}
    columns={columns}
    pagination={false}
    {...tableProps}
  />
})

export default ModalDetail;
