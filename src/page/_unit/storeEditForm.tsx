import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditFrom from "../../form/editForm";
import { UIContext } from "../../index";
import { Row, Col } from 'antd';

const StoreEditForm = observer(function ({ store, name, children = null }: any) {
  const typeConf = store.getTypeConf(name)
  if (!typeConf) {
    return null
  }
  const { fields } = store
  const { form = {}, page } = typeConf
  const [fieldsConf, setFieldsConf]: [any[], Function] = useState([])
  const { layout: { clientWidth } } = useContext(UIContext)

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
    <EditFrom conf={{ layout: clientWidth > 768 ? 'horizontal' : 'vertical' }} values={form} fields={fieldsConf}>
      {children}
    </EditFrom>
  )
})

export default StoreEditForm
