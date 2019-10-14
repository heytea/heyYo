import React, { Component } from 'react'
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

export default class SelectRemote extends Component<IProps> {
  static contextType = ConfigContext;
  static defaultProps = {
    value: '',
    method: 'get',
    labelKey: 'name',
    dataKey: 'data',
    valKey: 'id',
    valInKey: 'idIn'
  }
  lastFetchId: number

  constructor(props: IProps) {
    super(props);
    this.lastFetchId = 0;
    this.searchData = debounce(this.searchData, 300);
  }

  state = {
    data: [],
    idMap: {},
    fetching: false,
  };
  fetchData = async (opt: { [key: string]: any }) => {
    const { valKey = 'id', url, method = 'get', dataKey } = this.props
    if (url) {
      this.setState({ data: [], fetching: true })
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      const { Http, config } = this.context
      const { apiFormat, codeSuccess } = config
      const fn = method ? Http[`http${method}`] || Http.httpGet : Http.httpGet
      const dataData = await fn(url, opt)
      if (fetchId === this.lastFetchId && dataData[apiFormat.code] === codeSuccess) {
        const data = dataData[dataKey || apiFormat.data]
        const idMap = {}
        data.forEach && data.forEach((item: any) => {
          idMap[item[valKey]] = true
        })
        this.setState({ data, idMap, fetching: false });
      }
    }
  }

  initData = () => {
    const { valKey = 'id', value, valInKey = 'idIn', mode } = this.props
    if (typeof value !== 'undefined' && value !== '') {
      const opt: { [key: string]: any } = {}
      if (mode === 'multiple' || mode === 'tags') {
        opt[valInKey] = value
      } else {
        opt[valKey] = value
      }
      this.fetchData(opt)
    }
  }

  searchData = async (value: any) => {
    const { apiKey, labelKey = 'name' } = this.props
    const opt = {}
    opt[apiKey || labelKey] = value
    this.fetchData(opt)
  }


  handleChange = (val: any) => {
    this.setState({ fetching: false, })
    const { onChange } = this.props
    if (onChange) {
      onChange(val)
    }
  };

  componentDidMount() {
    this.initData()
  }

  componentDidUpdate(prevProps: IProps) {
    const { value } = this.props
    const { data, idMap } = this.state;
    if (value !== prevProps.value) {
      // @ts-ignore
      if (value !== '' && ((!data || data.length < 1) || !idMap[value])) {
        this.initData()
      }
    }
  }

  render() {
    const { fetching, data } = this.state;
    return (
      <Select
        {...this.props}
        data={data}
        notFoundContent={fetching ? <Spin size="small"/> : null}
        filterOption={false}
        showSearch={true}
        onSearch={this.searchData}
        onChange={this.handleChange}
      >
      </Select>
    );
  }
}
