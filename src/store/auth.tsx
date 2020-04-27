import { observable, action } from 'mobx'
import React from "react";
import HTTP, { IResult } from "../unit/http";
import Config from "../config";

interface IUser {
  id: number,
  name: string
}

export interface IAuth {
  dfUser: IUser,
  user: IUser,
  referrer: string,

  setUser(user?: IUser): void,

  setReferrer(url: string): void,

  logout?: Function,
}

class Auth implements IAuth {
  dfUser = { id: 0, name: '' }
  @observable user: IUser = { ...this.dfUser, }
  @observable referrer: string = ''

  @action
  setUser = (userObj: IUser = this.dfUser) => {
    this.user = { ...this.user, ...userObj }
  }

  @action
  setReferrer = (url: string): void => {
    this.referrer = url
  }

  // @action
  // logout = async () => {
  //   this.setUser(this.dfUser)
  // }
}

export default React.createContext(new Auth() as { [key: string]: any });
