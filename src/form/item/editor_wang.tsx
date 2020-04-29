import React, {Component, Fragment} from "react";
// @ts-ignore
import Editor from 'wangeditor'
import {merge, uniqueId} from 'lodash'
import {observer} from "mobx-react";
import XSS from 'xss'

const xss = new XSS.FilterXSS();

export interface IProps {
  type: 'html' | 'text' //html or 字符串
  customConfig: { [key: string]: any }
  value: string
  field: string
  onChange: Function,
  style: StyleSheet
}

@observer
export default class Editor_wang extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.editorElem = React.createRef();
  }

  editorElem: any = null;
  editor: any = null;
  defaultStyle = {
    maxWidth: '100%'
  };
  initEditor = () => { //初始化之后的回调
    const {value} = this.props;
    if (value !== null && value !== undefined) {
      this.editor.txt.html(xss.process(value || ''));
    }
  };

  componentDidMount() {
    const elem = this.editorElem;
    const bgContent: HTMLElement | null = document.querySelector(`.b-right-content`);
    if (bgContent && document.querySelector(`.b-right-content #${elem.current.id}`)) {
      this.defaultStyle.maxWidth = `${bgContent.offsetWidth}px`;
    }
    const {type = 'html', customConfig = {}, onChange, field} = this.props;
    this.editor = new Editor(elem.current);
    this.editor.customConfig = merge({
      onchangeTimeout: 50,
      zIndex: 10,
      onchange: (html: any) => {
        let v = html;
        if (type === 'text') {
          v = xss.process(this.editor.txt.text());
        }
        if (this.editor.txt.text() === '') {
          onChange({[field]: v});
        } else {
          onChange({[field]: v});
        }
      }
    }, customConfig);
    this.editor.create();
    setTimeout(() => {
      this.initEditor();
    }, 0);
  }

  render() {
    return <Fragment>
      <div id={uniqueId('editorWang')} ref={this.editorElem}
           style={merge({}, this.defaultStyle, this.props.style || {})}/>
    </Fragment>;
  }
}
