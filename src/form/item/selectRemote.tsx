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
}

export default function HySelectRemote(props: IProps) {
  const [data, setData] = useState([])
  // const [idMap, setIdMap] = useState({})
  const [fetching, setFetching] = useState({})
  let lastFetchId = 0
  const { valKey = 'id', url, method = 'get', dataKey = 'data', value, valInKey = 'idIn', mode, apiKey, labelKey = 'name', onChange } = props
  const context = useContext(ConfigContext)
  const fetchData = async (opt: { [key: string]: any }) => {
    if (url) {
      setData([])
      setFetching(true)
      lastFetchId += 1
      const fetchId = lastFetchId
      const { Http, config } = context
      const { apiFormat, codeSuccess } = config
      // @ts-ignore
      const fn = method ? Http[`http${method}`] || Http.httpGet : Http.httpGet
      const dataData = await fn(url, opt)
      if (fetchId === lastFetchId) {
        if (dataData[apiFormat.code] === codeSuccess) {
          setData(dataData[dataKey || apiFormat.data])
          // const idMap: { [key: string]: any } = {}
          // data.forEach && data.forEach((item: any) => {
          //   idMap[item[valKey]] = true
          // })
          // setIdMap(idMap)
        }
        setFetching(false)
      }
    }
  }
  const initData = () => {
    if (typeof value !== 'undefined' && value !== '') {
      const opt: { [key: string]: any } = {}
      if (mode === 'multiple' || mode === 'tags') {
        opt[valInKey] = value
      } else {
        opt[valKey] = value
      }
      fetchData(opt)
    }
  }
  const searchData = debounce(
    async (value: any) => {
      const opt: { [key: string]: any } = {}
      opt[apiKey || labelKey] = value
      fetchData(opt)
    }
    , 300)

  const handleChange = (val: any) => {
    setFetching(false)
    onChange && onChange(val)
  }

  useEffect(() => initData(), [])
  return (
    <Select
      {...props}
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

// class SelectRemote extends Component<IProps> {
//   static contextType = ConfigContext;
//   static defaultProps = {
//     value: '',
//     method: 'get',
//     labelKey: 'name',
//     dataKey: 'data',
//     valKey: 'id',
//     valInKey: 'idIn'
//   }
//   lastFetchId: number
//
//   constructor(props: IProps) {
//     super(props);
//     this.lastFetchId = 0;
//     this.searchData = debounce(this.searchData, 300);
//   }
//
//   state = {
//     data: [],
//     idMap: {},
//     fetching: false,
//   };
//   fetchData = async (opt: { [key: string]: any }) => {
//     const { valKey = 'id', url, method = 'get', dataKey } = this.props
//     if (url) {
//       this.setState({ data: [], fetching: true })
//       this.lastFetchId += 1
//       const fetchId = this.lastFetchId
//       const { Http, config } = this.context
//       const { apiFormat, codeSuccess } = config
//       const fn = method ? Http[`http${method}`] || Http.httpGet : Http.httpGet
//       const dataData = await fn(url, opt)
//       if (fetchId === this.lastFetchId && dataData[apiFormat.code] === codeSuccess) {
//         const data = dataData[dataKey || apiFormat.data]
//         const idMap: { [key: string]: any } = {}
//         data.forEach && data.forEach((item: any) => {
//           idMap[item[valKey]] = true
//         })
//         this.setState({ data, idMap, fetching: false });
//       }
//     }
//   }
//
//
//   initData = () => {
//     const { valKey = 'id', value, valInKey = 'idIn', mode } = this.props
//     if (typeof value !== 'undefined' && value !== '') {
//       const opt: { [key: string]: any } = {}
//       if (mode === 'multiple' || mode === 'tags') {
//         opt[valInKey] = value
//       } else {
//         opt[valKey] = value
//       }
//       this.fetchData(opt)
//     }
//   }
//
//   searchData = async (value: any) => {
//     const { apiKey, labelKey = 'name' } = this.props
//     const opt: { [key: string]: any } = {}
//     opt[apiKey || labelKey] = value
//     this.fetchData(opt)
//   }
//
//
//   handleChange = (val: any) => {
//     this.setState({ fetching: false, })
//     const { onChange } = this.props
//     if (onChange) {
//       onChange(val)
//     }
//   };
//
//   componentDidMount() {
//     this.initData()
//   }
//
//   componentDidUpdate(prevProps: IProps) {
//     const { value } = this.props
//     const { data, idMap } = this.state;
//     if (value !== prevProps.value) {
//       // @ts-ignore
//       if (value !== '' && ((!data || data.length < 1) || !idMap[value])) {
//         this.initData()
//       }
//     }
//   }
//
//   render() {
//     const { fetching, data } = this.state;
//     return (
//       <Select
//         {...this.props}
//         data={data}
//         notFoundContent={fetching ? <Spin size="small" /> : null}
//         filterOption={false}
//         showSearch={true}
//         onSearch={this.searchData}
//         onChange={this.handleChange}
//       >
//       </Select>
//     );
//   }
// }
