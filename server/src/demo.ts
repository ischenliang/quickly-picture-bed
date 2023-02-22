import useSendMail from "./utils/nodemailer";

useSendMail('206948', 'itchenliang@163.com').then(res => {
  console.log(res)
})