import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear' // 导入插件
import weekday from "dayjs/plugin/weekday"
import 'dayjs/locale/zh-cn' // 导入本地化语言
dayjs.locale('zh-cn') // 使用本地化语言
dayjs.extend(weekday)
dayjs.extend(isLeapYear) // 使用插件
export default dayjs
export { isLeapYear, weekday }