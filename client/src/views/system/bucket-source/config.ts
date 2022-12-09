import { TableColumnConfig } from '@/typings/interface'
export const config: Array<TableColumnConfig> = [
  {
    align: 'center',
    label: '插件名称',
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
    label: '版本号',
    width: '',
    prop: 'version'
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


export const history_config: Array<TableColumnConfig> = [
  {
    align: 'center',
    label: '新版本',
    width: '',
    prop: 'version',
    slot: 'version'
  },
  {
    align: 'center',
    label: '旧版本',
    width: '',
    prop: 'version_old',
    slot: 'version_old'
  },
  {
    align: 'center',
    label: '更新说明',
    width: '',
    prop: 'remark'
  },
  {
    align: 'center',
    label: '更新时间',
    width: '',
    prop: 'updatedAt'
  }
]