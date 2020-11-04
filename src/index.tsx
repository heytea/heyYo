import { ConfigProvider } from 'antd'
import { typeProps } from './display/itemMap'
import { Auth } from './store/auth'
import { UI } from './store/ui'
import { lang } from './lang'
export { isLeapYear,weekday } from './unit/day'
export const DfAuth = Auth
export const DfUI = UI
export const dfLang = lang
export const AntdConfigProvider = ConfigProvider
// display
export const displayTypeProps = typeProps
export { default as Content } from './display/content'
export { default as Currency } from './display/currency'
export { default as Datetime } from './display/datetime'
export { default as IdCardEncrypt } from './display/idCardEncrypt'
export { default as DisplayMap } from './display/itemMap'
export { default as KeyToValue } from './display/keyToValue'
export { default as Lang } from './display/lang'
export { default as Link } from './display/link'
export { default as Loading } from './display/loading'
export { default as PhoneEncrypt } from './display/phoneEncrypt'
export { default as RenderDisplay } from './display/renderDisplay'
export { default as SelectValues } from './display/selectValues'
export { default as Svg } from './display/svg'
// form
export { default as Captcha } from './form/item/captcha'
export { default as Cascader } from './form/item/cascader'
export { default as Checkbox } from './form/item/checkbox'
export { default as ImgCaptcha } from './form/item/imgCaptcha'
export { default as Input } from './form/item/input'
export { default as Password } from './form/item/password'
export { default as Radio } from './form/item/radio'
export { default as RangeDate } from './form/item/rangeDate'
export { default as Select } from './form/item/select'
export { default as SelectRemote } from './form/item/selectRemote'
export { default as SelectTree } from './form/item/selectTree'
export { default as TextArea } from './form/item/textArea'
export { default as Timestamp } from './form/item/timestamp'
export { default as Tree } from './form/item/tree'
export { default as DatePicker } from './form/item/datePicker';
export { default as Calendar } from './form/item/calendar';
export { default as TimePicker } from './form/item/timePicker';

export { default as EditForm } from './form/editForm'
export { default as ItemMap } from './form/itemMap'
export { default as ItemType } from './form/itemType'
export { default as StoreEditForm } from './form/storeEditForm'
export { default as formTypeProps } from './form/typeProps'

export { default as LangContext } from './lang'
// layout
export { default as Footer } from './layout/unit/footer'
export { default as Header } from './layout/unit/header'
export { default as Sider } from './layout/unit/sider'
export { default as Full } from './layout/full'
export { default as LeftSider } from './layout/leftSider'
// page
export { default as DetailContent } from './page/_detail/content'
export { default as DetailGrid } from './page/_detail/grid'

export { default as ListActionsBatch } from './page/_list/actionsBatch'
export { default as ListActionsRow } from './page/_list/actionsRow'
export { default as ListTable } from './page/_list/table'
export { default as ListTitleBtn } from './page/_list/titleBtn'

export { default as PageActionsBtn } from './page/_unit/actionsBtn'
export { default as PageBreadcrumb } from './page/_unit/breadcrumb'
export { default as PageJumpToOne } from './page/_unit/jumpToOne'
export { default as PageTips } from './page/_unit/pageTips'
export { default as SetSite } from './page/_unit/setSite'

export { default as Add } from './page/add'
export { default as AutoPage } from './page/autoPage'
export { default as Detail } from './page/detail'
export { default as Edit } from './page/edit'
export { default as List } from './page/list'
export { default as P404 } from './page/p404'

export { default as RenderRoute } from './route/renderRoute'
export { default as StoreRoute } from './route/storeRoute'

export { default as AuthContext } from './store/auth'
export { default as Store } from './store/store'
export { default as UIContext } from './store/ui'

export { week, datetime } from './unit/date'
export { useUpdateEffect } from './unit/hooks'
export { default as HTTP } from './unit/http'
export { default as template } from './unit/template'
export { isTemplate, templateToBoolean } from './unit/template'
export { default as validators } from './unit/validators'
export { default as day } from './unit/day'

export { default as Config } from './config'
export { ConfigContext } from './config'

export { default as RemoteComponent } from './unit/remoteComponent'
