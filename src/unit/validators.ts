import { FormInstance } from 'antd/lib/form'

export default {
  equals: (form: FormInstance, rule: { [key: string]: any }) => {
    return {
      validator: async (r: any, v: any,) => {
        console.log(rule);
        if (typeof form.getFieldValue(rule.field) !== 'undefined' && form.getFieldValue(rule.field) !== v) {
          throw new Error('Something wrong!')
        }
      }
    }
  }
}