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
