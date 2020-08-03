import React, {Component, Fragment, useEffect, useMemo, useState} from 'react';
import {Button} from 'antd';
import {ButtonProps} from 'antd/lib/button';
import {flatMap, isEqual} from 'lodash';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import EventBus from './plugins/eventBus';
import {observer, inject} from 'mobx-react';

export interface AuthButtonWrapProps extends ButtonProps {
  onClick?: (...args: any) => any
  title?: string
}

export interface AuthButtonProps extends RouteComponentProps {
  action?: string //真正的地址
  buttonProps: AuthButtonWrapProps
}

let _myMenu: Array<any> = [];
// @ts-ignore
const AuthButton = withRouter(function (props: AuthButtonProps) {
  const {action} = props
  const [myMenu, setMenu] = useState([]);
  const pathname = useMemo(() => {
    const {location} = props;
    return location.pathname;
  }, [props.location]);
  const flatMapMenus = useMemo(() => {
    return myMenu.map((menu: any) => {
      const {navList, ...rest} = menu;
      const children = flatMap(navList, (item) => {
        return item && item.children ? item.children : item;
      });
      return {...rest, children}
    });
  }, [myMenu]);
  const hasWebUrl = useMemo(() => {
    const system = pathname.split('/').slice(0, 2).join('/');
    const hasSystem = flatMapMenus.find((menu: any) => menu.path === system);
    if (hasSystem) {
      return hasSystem.children.find((item: any) => String(item.privType) === '1' && item.webUrl === pathname);
    }
    return false;
  }, [pathname, flatMapMenus]);
  const hasActions = useMemo(() => {
    const system = pathname.split('/').slice(0, 2).join('/');
    const hasSystem = flatMapMenus.find((menu: any) => menu.path === system);
    if (hasSystem) {
      return hasSystem.children.find((item: any) => String(item.privType) === '0' && item.webUrl === action);
    }
  }, [pathname, action, flatMapMenus]);
  const hasPermission = useMemo(() => {
    if (!hasWebUrl) return false;
    // console.log(hasActions,'hasActions')
    return hasActions;
  }, [props, hasWebUrl, hasActions]);
  useEffect(() => {
    setMenu(_myMenu as any);
    EventBus.on('myMenu', (data: any) => {
      if (isEqual(data, _myMenu)) return;
      _myMenu = data;
      setMenu(data);
    });
  });
  const {buttonProps} = props;
  const {children, ...rest} = buttonProps;
  return <Fragment>{!hasPermission ? <Button {...rest}>{children}</Button> : null}</Fragment>
});


@inject('UI') @observer
export default class extends Component<AuthButtonWrapProps> {
  render() {
    const buttonProps: any = this.props;
    // @ts-ignore
    const {UI = {}, title, ...butProps} = this.props
    const {apiPrivMap = {}, pageTitle} = UI
    const currentTitle = (title || pageTitle || '').trim();
    let action = (`${currentTitle}-${buttonProps.children}` || '').trim();
    if (Object.prototype.toString.call(buttonProps.children) === '[object Object]') {
      action = (`${title || pageTitle}-${buttonProps.children.props.children}` || '').trim();
    }
    const Env = process.env.REACT_APP_API_ENV
    const Render = buttonProps.render
    if (Env === 'dev' || apiPrivMap[action]) {
      return Render ? <Render {...butProps}/> : <Button {...butProps}/>
    }
    return null;
  }
}
