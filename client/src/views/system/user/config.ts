import { TableColumnConfig } from '@/typings/interface'
export const config: Array<TableColumnConfig> = [
  {
    align: 'center',
    label: 'chatgpt',
    width: '',
    prop: 'config',
    slot: 'chatgpt'
  },
  {
    align: 'center',
    label: '用户名',
    width: '',
    prop: 'username'
  },
  {
    align: 'center',
    label: '角色',
    width: '',
    prop: 'role_name'
  },
  {
    align: 'center',
    label: '邮箱 | 账号',
    width: '',
    prop: 'email'
  },
  {
    align: 'center',
    label: '手机号',
    width: '',
    prop: 'phone'
  },
  {
    align: 'center',
    label: '性别',
    width: '',
    prop: 'gender'
  },
  {
    align: 'center',
    label: '职业',
    width: '',
    prop: 'major'
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
