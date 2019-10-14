import { Config } from 'heyyo'
import { IConfig } from 'heyyo/dist/config'

const config: IConfig = {
  ...Config,
  svgUrl: 'https://ishuhui.oss-cn-hangzhou.aliyuncs.com/svg/',
  hosts: { api: '' },
}

if (process.env.REACT_APP_API_ENV === 'local') {
  config.hosts = {
    api: 'http://local-admin-api.ickeep.com',
    admin: 'http://local-admin-api.ickeep.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'dev') {
  config.hosts = {
    api: '//test.heytea.com',
    admin: '//test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'test-base') {
  config.hosts = {
    api: 'https://test.heytea.com',
    admin: 'https://test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'test-sale') {
  config.hosts = {
    api: '//test.heytea.com',
    admin: '//test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'test-member') {
  config.hosts = {
    api: '//test.heytea.com',
    admin: '//test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'pre') {
  config.hosts = {
    api: 'https://staging.heytea.com',
    admin: 'https://staging.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'prod') {
  config.hosts = {
    api: 'https://go.heytea.com',
    admin: 'https://go.heytea.com',
  }
} else {
  config.hosts = {
    api: 'http://local-admin-api.ickeep.com',
    admin: 'http://local-admin-api.ickeep.com',
  }
}

export default config
