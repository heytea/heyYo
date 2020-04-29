import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react'
import { IProps as IEditProps } from '@tinymce/tinymce-react/lib/es2015/main/ts/components/Editor'

export interface IProps extends IEditProps {
  value: string
  onChange?: Function
}

export default function ({ apiKey = '', plugins = "code media powerpaste imagetools advlist autolink table link image lists charmap print preview fullscreen", init = {} }) {
  const dfApiKey = apiKey
  const dfPlugins = plugins
  const dfInit = {
    language: 'zh_CN',
    language_url: '/zh_CN.js',
    toolbar: "undo redo formatselect bold italic underline strikethrough subscript superscript alignleft aligncenter alignright indent outdent removeformat bullist numlist  link unlink image media code preview fullscreen",
    ...init
  }

  return class extends Component<IProps> {
    // editor = React.createRef();
    change = (content: string) => {
      const { onChange } = this.props
      onChange && onChange(content)
    }

    render() {
      const { value, onChange, init = {}, ...args } = this.props
      const newInit = { ...dfInit, ...init }
      return <Editor
        // ref={(ref: any) => this.editor = ref}
        apiKey={dfApiKey}
        plugins={dfPlugins}
        init={newInit}
        {...args}
        value={value}
        onEditorChange={this.change}
      />
    }
  }
}
