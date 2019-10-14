import React, { Component, HTMLAttributes } from 'react'
import svgXmlObj from '../assets/svgIcon'
import { ConfigContext } from '../config'
// TODO 请求单例
// TODO map 长度限制
const svgDataMap = {}
export default class Svg extends Component<HTMLAttributes<HTMLAnchorElement> & { src: string }> {
  static contextType = ConfigContext

  state = { svgXml: '' }
  fetchData = async (): Promise<string> => {
    const { Http, config: { svgUrl = '', apiFormat: { code = '' }, codeSuccess } } = this.context
    const { src = '' } = this.props
    if (svgUrl && src) {
      const data = await Http.httpGet(svgUrl + src + '.svg', {}, false, { responseType: 'text', })
      if (data[code] === codeSuccess) {
        let xml = data.data || ''
        if (typeof xml === 'string') {
          xml = xml.replace(/(<\?xml.*?\?>|<\!--.*?-->[\n\r]*|<!DOCTYPE.*?>)*([\n\r])*/g, '')
          if (xml.indexOf('<svg') === 0) {
            svgDataMap[src] = xml
            return xml
          }
        }
      }
    }
    return ''
  }

  setSvgXml = async () => {
    const { src = '' } = this.props
    let svgXml = svgXmlObj[src] || svgDataMap[src] || ''
    if (!svgXml) {
      svgXml = await this.fetchData()
    }
    this.setState({ svgXml })
  }

  componentDidMount(): void {
    this.setSvgXml()
  }

  componentDidUpdate(prevProps: any) {
    const { src } = this.props
    const { src: prevSrc } = prevProps
    src && src !== prevSrc && this.setSvgXml()
  }

  render() {
    if (!process.browser) {
      return null
    }
    const { src = '', className = '', ...args } = this.props
    const { svgXml } = this.state
    return (<span {...args} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }}/>)
  }
}
