import { TableColumnConfig } from '@/typings/interface'
export const config: Array<TableColumnConfig> = [
  {
    align: 'center',
    label: '操作id',
    width: '',
    prop: 'operate_id'
  },
  {
    align: 'center',
    label: '操作类别',
    width: '',
    prop: 'type',
    slot: 'type'
  },
  {
    align: 'center',
    label: '操作记录',
    width: '',
    prop: 'operate_cont'
  },
  {
    align: 'center',
    label: '操作内容',
    width: '',
    prop: 'content'
  },
  {
    align: 'center',
    label: '操作时间',
    width: '',
    prop: 'createdAt'
  }
]
