import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, Table } from 'antd';
import IStore from '../../store/_i';

export interface IProps {
  store: IStore
}

const ModalDetail = observer((props: IProps) => {
  const { store } = props;
  const { modalDetail, listData, modelDetailVisible, setModelDetailVisible, modelDetailIndex, fieldsConf } = store;
  const { attrColumn = {}, valueColumn = {}, modalProps = {}, tableProps = {} } = modalDetail || {}
  const data = (listData?.data?.data && listData.data.data[modelDetailIndex]) || {};
  const dataArr: any[] = [];
  const columns = [
    { title: '属性', dataIndex: 'attr', key: 'attr', ...attrColumn },
    { title: '值', dataIndex: 'value', key: 'value', ...valueColumn },
  ];
  Object.keys(data).forEach((key: string, index: number) => {
    dataArr.push({ attr: fieldsConf && fieldsConf[key].title || '', value: data[key], index });
  });
  return <Modal
    title='详情'
    width={800}
    visible={modelDetailVisible}
    cancelButtonProps={{ style: { display: 'none' } }}
    onOk={() => setModelDetailVisible(false)}
    onCancel={() => setModelDetailVisible(false)}
    {...modalProps}
  >
    <Table
      size="small"
      rowKey="attr"
      dataSource={dataArr}
      columns={columns}
      pagination={false}
      {...tableProps}
    />
  </Modal>;
});

export default ModalDetail;
