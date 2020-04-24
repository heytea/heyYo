import React, { Component, HTMLAttributes } from 'react'
import { ConfigContext } from '../config'

const svgDataMap: { [key: string]: string } = {}
const fnMap: { [key: string]: any } = {}

export default class Svg extends Component<HTMLAttributes<HTMLAnchorElement> & { src: string }> {
  static contextType = ConfigContext

  state = { svgXml: '' }
  setData = (src: string, xml: string) => {
    const { config: { svgMapLength = 20 } } = this.context
    svgDataMap[src] = xml
    const keys = Object.keys(svgDataMap)
    if (keys.length >= svgMapLength) {
      delete svgDataMap[keys[0]]
    }
  }
  fetchData = async (src: string): Promise<string> => {
    const { Http, config: { svgUrl = '', apiFormat: { code = '' }, codeSuccess } } = this.context
    if (svgUrl && src) {
      const data = await Http.httpGet(svgUrl + src + '.svg', {}, false, { responseType: 'text', })
      if (data[code] === codeSuccess) {
        let xml = data.data || ''
        if (typeof xml === 'string') {
          xml = xml.replace(/(<\?xml.*?\?>|<\!--.*?-->[\n\r]*|<!DOCTYPE.*?>)*([\n\r])*/g, '')
          if (xml.indexOf('<svg') === 0) {
            this.setData(src, xml)
            return xml
          }
        }
      }
    }
    return ''
  }

  fetchDataSingle(src: string) {
    const self = this
    return fnMap[src] || (fnMap[src] = new Promise(function (resolve) {
      self.fetchData(src).then((xml: string) => {
        resolve(xml)
        fnMap[src] && delete fnMap[src]
      })
    }))
  }

  setSvgXml = async () => {
    const { src = '' } = this.props
    let svgXml = svgDataMap[src] || ''
    if (!svgXml && process.browser) {
      svgXml = await this.fetchDataSingle(src)
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
    return (<span {...args} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }} />)
  }
}
