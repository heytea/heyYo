const { addBabelPlugins, override, addLessLoader } = require('customize-cra')
const path = require('path');
const webpack = require('webpack');
const fs = require('fs')
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/theme.less'), 'utf8'));

function changeConfig(config) {
  // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  // config.plugins.push(new BundleAnalyzerPlugin())
  // if (!config.externals) {
  //   config.externals = {}
  // }
  // config.externals.react = 'React'
  // config.externals['react-dom'] = 'ReactDOM'
  // config.externals['react-router-dom'] = 'ReactRouterDOM'
  // config.externals['mobx'] = 'mobx'
  // config.externals['mobx-react'] = 'mobxReact'
  // config.externals['axios'] = 'axios'
  config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, 'src/assets/antdIcon.ts')
  config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'node_modules/react-router-dom')
  config.resolve.alias['antd'] = path.resolve(__dirname, 'node_modules/antd')
  config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),)
  config.optimization.splitChunks =
    {
      chunks: "all",
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 8,
      maxInitialRequests: 8,
      name: true,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: 'all', // all, async, and initial
        },
        antd: {
          test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
          name: 'antd',
          chunks: 'initial', // all, async, and initial
        },
        plugin: {
          test: /[\\/]node_modules[\\/](axios|mobx|mobx-react|store|xss)[\\/]/,
          name: 'plugin',
          chunks: 'initial', // all, async, and initial
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: -10,
          chunks: 'initial', // all, async, and initial
        }
      }
    }
  for (let i = 0; i < config.plugins.length; i += 1) {
    const plugin = config.plugins[i]
    if (plugin && plugin.config && plugin.config.precacheManifestFilename) {
      plugin.config.importWorkboxFrom = 'local'
      plugin.config.importsDirectory = 'pwa'
      plugin.config.importScripts.push('/pwa/cdn-precache.js')
      break
    }
  }
  // config.module.rules[2].oneOf[9].exclude.push(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
  //   /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,)
  // config.module.rules[2].oneOf.push(
  //   {
  //     test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
  //     use: ["raw-loader"],
  //   }
  // )
  config.module.rules.push(
    {
      test: require.resolve('react'),
      use: [{ loader: 'expose-loader', options: 'React' }]
    },
    {
      test: require.resolve('react-dom'),
      use: [{ loader: 'expose-loader', options: 'ReactDom' }]
    },
    {
      test: require.resolve('react-router-dom'),
      use: [{ loader: 'expose-loader', options: 'ReactRouterDOM' }]
    },
    {
      test: require.resolve('mobx'),
      use: [{ loader: 'expose-loader', options: 'mobx' }]
    },
    {
      test: require.resolve('mobx-react'),
      use: [{ loader: 'expose-loader', options: 'mobxReact' }]
    },
    {
      test: require.resolve('axios'),
      use: [{ loader: 'expose-loader', options: 'axios' }]
    }
  )
  return config
}

module.exports = override(
  ...addBabelPlugins(
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
  ),
  addLessLoader({
    // strictMath: true,
    // noIeCompat: true,
    javascriptEnabled: true,
    modifyVars: themeVariables,
  }),
  changeConfig,
)
