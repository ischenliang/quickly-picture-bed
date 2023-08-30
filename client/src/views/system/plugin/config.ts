import { TableColumnConfig } from '@/typings/interface'
export const config: Array<TableColumnConfig> = [
  {
    align: 'center',
    label: '插件logo',
    width: '90',
    prop: 'logo',
    slot: 'logo'
  },
  {
    align: 'center',
    label: '插件名称',
    width: '200',
    prop: 'name'
  },
  {
    align: 'center',
    label: '插件别名',
    width: '100',
    prop: 'title'
  },
  {
    align: 'center',
    label: '版本号',
    width: '70',
    prop: 'version'
  },
  {
    align: 'center',
    label: '类别',
    width: '90',
    prop: 'category'
  },
  {
    align: 'center',
    label: '运行平台',
    width: '100',
    prop: 'platform'
  },
  {
    align: 'center',
    label: '安装次数',
    width: '100',
    prop: 'downloadCounts'
  },
  {
    align: 'center',
    label: '是否付费',
    width: '100',
    prop: 'payment',
    slot: 'payment'
  },
  {
    align: 'center',
    label: '状态',
    width: '90',
    prop: 'status',
    slot: 'status'
  },
  {
    align: 'center',
    label: '更新时间',
    width: '100',
    prop: 'updatedAt',
    slot: 'updatedAt'
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