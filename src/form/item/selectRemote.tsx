import React, { useContext, useEffect, useState } from 'react'
import { Spin } from 'antd'
import debounce from 'lodash/debounce'
import Select, { IProps as ISelectProps } from './select'
import { ConfigContext } from '../../config'

export interface IProps extends ISelectProps {
  url: string,
  method?: string,
  apiKey?: string,
  dataKey?: string,
  valInKey?: string,
  onDataItem?: Function,
  reqData?: Record<string, any>,
  nullData?: Array<{ [key: string]: any }>
}

export default function HySelectRemote(props: IProps) {
  const [data, setData]: [Array<{ [key: string]: any }>, Function] = useState([])
  const [idMap, setIdMap]: [{ [key: string]: any }, Function] = useState({})
  const [fetching, setFetching] = useState(false)
  let lastFetchId = 0
  const { valKey = 'id', url, method = 'get', dataKey = 'data', value, valInKey = 'idIn', mode, apiKey, labelKey = 'name', onChange, onDataItem, nullData = [], reqData = {}, ...args } = props
  const context = useContext(ConfigContext)
  const fetchData = async (opt: { [key: string]: any }) => {
    if (url) {
      setData(nullData)
      setFetching(true)
      lastFetchId += 1
      const fetchId = lastFetchId
      const { Http, config } = context
      const { apiFormat, codeSuccess } = config
      // @ts-ignore
      const fn = method ? Http[`http${method}`] || Http.httpGet : Http.httpGet
      const dataData = await fn(url, { ...reqData, ...opt })
      if (fetchId === lastFetchId) {
        if (dataData[apiFormat.code] === codeSuccess) {
          setData([...nullData, ...(dataData[dataKey || apiFormat.data])])
          const idMap: { [key: string]: any } = {}
          data.forEach && data.forEach((item: any) => {
            idMap[item[valKey]] = true
          })
          setIdMap(idMap)
        }
        setFetching(false)
      }
    }
  }
  const initData = () => {
    if (typeof value !== 'undefined' && value !== '') {
      const item = nullData.find((item: any) => (item[valKey] + '') === value + '')
      if (!item) {
        const opt: { [key: string]: any } = {}
        if (mode === 'multiple' || mode === 'tags') {
          opt[valInKey] = value
        } else {
          opt[valKey] = value
        }
        fetchData(opt)
      } else {
        setData(nullData)
      }
    }
  }
  const searchData = debounce(
    async (value: any) => {
      if (value !== '') {
        const opt: { [key: string]: any } = {}
        opt[apiKey || labelKey] = value
        fetchData(opt)
      } else {
        setData(nullData)
      }
    }
    , 300)

  const handleChange = (val: any) => {
    setFetching(false)
    onChange && onChange(val)
    onDataItem && onDataItem(data.find((item: any) => (item[valKey] + '') === val))
  }

  useEffect(() => initData(), [])
  useEffect(() => {
    !idMap[value + ''] && initData()
  }, [value]) // 只能监听 value 值 监听 idMap 会导致死循环

  return (
    <Select
      placeholder="请搜索"
      {...args}
      mode={mode}
      value={value}
      labelKey={labelKey}
      valKey={valKey}
      data={data}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      showSearch={true}
      onSearch={searchData}
      onChange={handleChange}
    >
    </Select>
  );
}
