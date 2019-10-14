// @ts-ignore
import ejs from 'ejs/ejs.min'

export default function analyze(conf: any) {
  const { data = {}, rule, expression = '' } = conf
  if (rule === 'template' && expression) {
    return ejs.render(expression, data)
  }
  return data ? data.v || '' : ''
}
