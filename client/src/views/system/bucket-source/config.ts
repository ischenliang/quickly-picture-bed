import { TableColumnConfig } from '@/typings/interface'
export const config: Array<TableColumnConfig> = [
  {
    align: 'center',
    label: '存储源名称',
    width: '',
    prop: 'name'
  },
  {
    align: 'center',
    label: '类别(唯一)',
    width: '',
    prop: 'type'
  },
  {
    align: 'center',
    label: '状态',
    width: '',
    prop: 'status',
    slot: 'status'
  },
  {
    align: 'center',
    label: '创建时间',
    width: '',
    prop: 'createdAt'
  },
  {
    align: 'center',
    label: '更新时间',
    width: '',
    prop: 'updatedAt'
  }
]
