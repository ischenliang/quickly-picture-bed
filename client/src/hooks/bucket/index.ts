import leancloud from '@/hooks/bucket/leancloud'
import gitee from '@/hooks/bucket/gitee';
import github from '@/hooks/bucket/github';
import local from '@/hooks/bucket/local';
import qiniu from '@/hooks/bucket/qiniu';


export default {
  leancloud,
  gitee,
  github,
  local,
  qiniu
}