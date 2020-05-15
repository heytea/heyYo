import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditFrom from './editForm'
import { Form } from 'antd'
import { UIContext } from '../index'

const StoreEditForm = observer(function ({ store, name, onSubmit, children = null }: any) {
  const [formInstance] = Form.useForm()
  if (!name) {
    return null
  }
  const typeConf = store?.getTypeConf(name)
  if (!typeConf) {
    return null
  }
  const { fields } = store
  const { form = {}, page, status, errs } = typeConf
  const [fieldsConf, setFieldsConf]: [any[], Function] = useState([])
  const { isMobile } = useContext(UIContext)
  const { formProps = {} } = page
  const onChange = (valObj: { [key: string]: any }) => {
    store.setForm({ name, valObj })
  }
  const fieldsChange = (fields: any) => {
    const errsObj: { [key: string]: string[] | string } = {}
    fields?.forEach((field: any) => {
      const { name, errors } = field
      name?.forEach((key: string) => {
        errsObj[key] = errors
      })
    })
    store.setErrs({ name, errs: errsObj })
  }
  useEffect(() => {
    const tmpFieldsConf: any[] = []
    page?.form?.forEach((item: any) => {
      if (typeof item === 'string') {
        fields[item] && tmpFieldsConf.push({ field: item, ...fields[item] })
      } else if (item.field) {
        tmpFieldsConf.push({ ...(item.conf ? fields[item.conf] : fields[item.field] || {}), ...item })
      }
    })
    setFieldsConf(tmpFieldsConf)
  }, [fields, page?.form])
  return (
    <EditFrom
      onFieldsChange={fieldsChange}
      onValuesChange={() => console.log('onValuesChange')}
      form={formInstance}
      data={store.dict}
      layout={isMobile ? 'vertical' : 'horizontal'}
      {...formProps}
      values={form}
      errs={errs}
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
