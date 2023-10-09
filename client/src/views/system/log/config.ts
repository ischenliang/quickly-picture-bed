import { TableColumnConfig } from '@/typings/interface'
export const config: Array<TableColumnConfig> = [
  {
    align: 'center',
    label: '操作id',
    width: '80',
    prop: 'operate_id'
  },
  {
    align: 'center',
    label: '操作人',
    width: '120',
    prop: 'email'
  },
  {
    align: 'center',
    label: '操作类别',
    width: '100',
    prop: 'type',
    slot: 'type'
  },
  {
    align: 'left',
    label: '操作内容',
    width: '200',
    prop: 'operate_cont'
  },
  {
    align: 'center',
    label: '操作时间',
    width: '100',
    prop: 'createdAt'
  },
  {
    align: 'left',
    label: '访问来源',
    width: '100',
    prop: 'client_info',
    slot: 'address'
  },
  {
    align: 'center',
    label: '访问ip',
    width: '100',
    prop: 'client_info',
    slot: 'ip'
  }
]
