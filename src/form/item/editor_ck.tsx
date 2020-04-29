import React, { Component } from 'react';
// @ts-ignore
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
// @ts-ignore
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
// @ts-ignore
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
// @ts-ignore
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
// @ts-ignore
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
// @ts-ignore
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

export interface IProps {
  value: string
  className?: string,
  onChange?: Function
}

export default function Editor(opt: any) {
  return class extends Component<IProps> {
    // @ts-ignore
    change = (event: any, editor: any) => {
      // const tmpKey = []
      // for (let key of this.cke.editor.ui.componentFactory._components.keys()) {
      //   tmpKey.push(key)
      // }
      // console.log(tmpKey);
      const data: string = editor.getData()
      const { onChange } = this.props
      onChange && onChange(data)
    }
    cke: any

    componentDidMount(): void {
    }

    render() {
      const { className = '', value = '', ...args } = this.props
      // Array.from(editor.ui.componentFactory.names())
      return <CKEditor
        ref={(ref: any) => this.cke = ref}
        editor={ClassicEditor}
        config={{
          language: 'zh-cn',
          // extraPlugins: [Underline, Strikethrough, Code, Subscript, Superscript],
          // toolbar: ["undo", "redo", "heading", "bold", "italic", "underline", "strikethrough", "subscript", "superscript", 'alignment:left', 'alignment:center', 'alignment:right', "indent", "outdent", "removeformat", "bulletedList", "numberedList", "imageupload", "link", "unlink", "Image", "media", "code", "preview", "fullscreen"],
          toolbar: ["undo", "redo", "heading", "bold", "italic", 'underline', 'strikethrough', 'code', 'subscript', 'superscript', "blockquote", "link", "numberedlist", "bulletedlist", "inserttable", "imageupload", "mediaembed", "ckfinder", 'Source'],
          image: {
            toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:side']
          }
        }}
        data={value || ''}
        {...args}
        onChange={this.change}
      />
    }
  }
}
