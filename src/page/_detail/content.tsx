import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import IStore from '../../store/_i'
import DetailGrid from './grid'
import { AuthContext, UIContext } from "../../index";

export interface IProps {
  store: IStore,
  data: any
}

const DetailContent = observer(({ store, data }: IProps) => {
  const UI = useContext(UIContext)
  const Auth = useContext(AuthContext)
  const { detailPage = {} } = store
  const { PageUI, showConf: { blocks = [], fields = [] } = {} } = detailPage
  if (typeof PageUI === 'function') {
    return <PageUI store={store} data={data} />
  }
  return <>
    {fields?.length > 0 && <DetailGrid store={store} fields={fields} data={data} />}
    {blocks?.length > 0 && blocks.map((block: any, index: number) => {
      const { fields = [], dataKey = '', title = '', describe = '', style = {}, contentStyle = {}, show = true } = block
      const blockData = dataKey && data ? data[dataKey] : data || {}
      const isShow = typeof show === 'function' ? show({ data: blockData, Auth, UI }) : show
      if (!isShow) {
        return null
      }
      return (
        <div key={index} className="m-block" style={style}>
          {title &&
          <h3>{title}
            {describe && <span className="m-block-describe">
              {typeof describe === 'function' ? describe() : describe}
              </span>}
          </h3>}
          <div className="m-block-content" style={contentStyle}>
            <DetailGrid data={blockData} fields={fields} store={store} />
          </div>
        </div>
      )
    })}
  </>
})

export default DetailContent
