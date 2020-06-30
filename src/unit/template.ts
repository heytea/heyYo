const reg = /<%=([\w_-])+%>/g
export const isTemplate = (str: string) => reg.test(str)
const template = (text = '', params: { [key: string]: string | number }) => {
  return text.replace(reg, function (match) {
    const matchKey = (match.slice && match.slice(3, -2) || '').trim()
    return (matchKey ? (typeof params[matchKey] === 'undefined' ? matchKey : params[matchKey]) : '') + ''
  })
}

export default template
