export const email_config = {
  host: 'smtp.qq.com',
  port: '587',
  secure: false
}

// 问题的定时任务的cron表达式：每个一分钟执行: 'second */1 * * * *'
export const schedule_question_cron = '00 * * * * *'
// 发布者的定时任务的cron表达式：：每个一分钟执行: 'second */1 * * * *'
export const schedule_publisher_cron = '20 */2 * * * *'
// 答主的定时任务的cron表达式：每个一分钟执行:'second */1 * * * *'
export const schedule_answer_cron = '40 * * * * *'
export const cookie_config_Url = 'https://itchenliang.club/cookie.json'