import React, { HTMLAttributes, useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../config'

const svgDataMap: { [key: string]: string } = {}
const fnMap: { [key: string]: any } = {}

export default function Svg(props: HTMLAttributes<HTMLAnchorElement> & { src: string }) {
  if (!process.browser) {
    return null
  }
  const context = useContext(ConfigContext)
  const [svgXml, setSvgXml] = useState('')
  const { src = '', className = '', ...args } = props
  useEffect(() => {
    let isUnmount = false
    if (svgDataMap[src]) {
      setSvgXml(svgDataMap[src])
    } else {
      const { Http, config: { svgMapLength = 20, svgUrl = '', apiFormat: { code = '' }, codeSuccess } } = context
      const fn = fnMap[src] || (fnMap[src] = new Promise(async function (resolve) {
        if (svgUrl && src) {
          const data = await Http.httpGet(svgUrl + src + '.svg', {}, false, { responseType: 'text', })
          if (data[code] === codeSuccess) {
            let xml = data.data || ''
            if (typeof xml === 'string') {
              xml = xml.replace(/(<\?xml.*?\?>|<\!--.*?-->[\n\r]*|<!DOCTYPE.*?>)*([\n\r])*/g, '')
              if (xml.indexOf('<svg') === 0) {
                resolve(xml)
              }
            }
          }
        }
        resolve('')
      }))
      fn.then((xml: string) => {
        !isUnmount && setSvgXml(xml)
        fnMap[src] && delete fnMap[src]
        svgDataMap[src] = xml

        const keys = Object.keys(svgDataMap)
        if (keys.length >= svgMapLength) {
          delete svgDataMap[keys[0]]
        }
      })
    }
    return () => {
      isUnmount = true
    }
  }, [src])
  return (<span {...args} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }} />)
}

// class Svg1 extends Component<HTMLAttributes<HTMLAnchorElement> & { src: string }> {
//   static contextType = ConfigContext
//
//   state = { svgXml: '' }
//   setData = (src: string, xml: string) => {
//     const { config: { svgMapLength = 20 } } = this.context
//     svgDataMap[src] = xml
//     const keys = Object.keys(svgDataMap)
//     if (keys.length >= svgMapLength) {
//       delete svgDataMap[keys[0]]
//     }
//   }
//   fetchData = async (src: string): Promise<string> => {
//     const { Http, config: { svgUrl = '', apiFormat: { code = '' }, codeSuccess } } = this.context
//     if (svgUrl && src) {
//       const data = await Http.httpGet(svgUrl + src + '.svg', {}, false, { responseType: 'text', })
//       if (data[code] === codeSuccess) {
//         let xml = data.data || ''
//         if (typeof xml === 'string') {
//           xml = xml.replace(/(<\?xml.*?\?>|<\!--.*?-->[\n\r]*|<!DOCTYPE.*?>)*([\n\r])*/g, '')
//           if (xml.indexOf('<svg') === 0) {
//             this.setData(src, xml)
//             return xml
//           }
//         }
//       }
//     }
//     return ''
//   }
//
//   fetchDataSingle(src: string) {
//     const self = this
//     return fnMap[src] || (fnMap[src] = new Promise(function (resolve) {
//       self.fetchData(src).then((xml: string) => {
//         resolve(xml)
//         fnMap[src] && delete fnMap[src]
//       })
//     }))
//   }
//
//   setSvgXml = async () => {
//     const { src = '' } = this.props
//     let svgXml = svgDataMap[src] || ''
//     if (!svgXml && process.browser) {
//       svgXml = await this.fetchDataSingle(src)
//     }
//     this.setState({ svgXml })
//   }
//
//   componentDidMount(): void {
//     this.setSvgXml()
//   }
//
//   componentDidUpdate(prevProps: any) {
//     const { src } = this.props
//     const { src: prevSrc } = prevProps
//     src && src !== prevSrc && this.setSvgXml()
//   }
//
//   render() {
//     if (!process.browser) {
//       return null
//     }
//     const { src = '', className = '', ...args } = this.props
//     const { svgXml } = this.state
//     return (<span {...args} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }} />)
//   }
// }
