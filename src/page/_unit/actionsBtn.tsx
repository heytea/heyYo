import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {Affix, Button} from 'antd'
import './actionsBtn.less'
import AuthButton from '../AuthButton';

interface IProps {
  target?: any
  actions: Array<{ [key: string]: any }>
  isBack?: boolean
  divider?: boolean
  show?: Function | boolean
  affixRef?: any
}

@observer
class ActionBtn extends Component<IProps & RouteComponentProps> {
  constructor(props: any) {
    super(props);
    this.affixRef = React.createRef();
  }

  affixRef: any = null;
  onClick = (item: { [key: string]: any }) => {
    item.onClick && item.onClick(this.props)
  }
  goBack = () => {
    const {history} = this.props;
    history.goBack();
  };
  updatePosition = (e: any) => {
    this.affixRef.current && this.affixRef.current.updatePosition(e);
  };

  componentDidMount(): void {
    window.addEventListener('scroll', this.updatePosition);
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.updatePosition);
  }

  render() {
    const {actions, isBack = true, target} = this.props
    const affixProps: any = {}
    if (target) {
      affixProps.target = () => target
    } else {
      affixProps.target = () => window.document.getElementsByClassName('b-right-content-wp')[0] || window
    }
    return (
      <Affix offsetBottom={0} {...affixProps} ref={this.affixRef}>
        <div className="m-page-actions">
          <div className="m-page-actions-btn">
            {actions && actions.map && actions.map((item, index) => {
                let {show = true, ...others} = item
                const isShow = typeof show === 'function' ? show() : show
                return isShow ? <AuthButton className='u-detail-Actions-btn' key={index}  {...others} onClick={() => this.onClick(item)}>{item.children || '操作'}</AuthButton> : null
              }
            )}
            {isBack && <Button htmlType="button" onClick={this.goBack}>返回</Button>}
          </div>
        </div>
      </Affix>
    )
  }
}

export default withRouter(ActionBtn)
