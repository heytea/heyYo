import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditFrom from '../../form/editForm'
import { UIContext } from '../../index'

const StoreEditForm = observer(function ({ store, name, onSubmit, children = null }: any) {
  if (!name) {
    return null
  }
  const typeConf = store.getTypeConf(name)
  if (!typeConf) {
    return null
  }
  const { fields } = store
  const { form = {}, page, status } = typeConf
  const [fieldsConf, setFieldsConf]: [any[], Function] = useState([])
  const { isMobile } = useContext(UIContext)
  const { formProps = {} } = page
  const onChange = (valObj: { [key: string]: any }) => store.setForm({ name, valObj })
  useEffect(() => {
    const tmpFieldsConf: any[] = []
    page?.form?.forEach((item: any) => {
      if (typeof item === 'string') {
        fields[item] && tmpFieldsConf.push({ ...fields[item] })
      } else if (item.field) {
        tmpFieldsConf.push({ ...(item.conf ? fields[item.conf] : fields[item.field] || {}), ...item })
      }
    })
    setFieldsConf(tmpFieldsConf)
  }, [fields, page?.form])
  return (
    <EditFrom
      data={store.dict}
      layout={isMobile ? 'vertical' : 'horizontal'}
      {...formProps}
      values={form}
      fields={fieldsConf}
      loading={status.loading}
      onChange={onChange}
      onFinish={onSubmit}
    >
      {children}
    </EditFrom>
  )
})

export default StoreEditForm
