import Users from '@/types/User'
import forge from 'node-forge'

/**
 * 使用非对称加密来加密密码
 * @param {*} data 
 * @returns 
 */
export function useCrypto (data): Promise<{ data: string; label: string }> {
  const user = new Users()
  return new Promise((resolve) => {
    user.pke().then((res: any) => {
      const { label, public_key } = res
      const publicKey = forge.pki.publicKeyFromPem(public_key)
      const messageBytes = forge.util.createBuffer(data, 'utf8').getBytes()
      const encrypted = publicKey.encrypt(messageBytes, 'RSA-OAEP', {
        md: forge.md.sha256.create()
      })
      const encrypted64 = forge.util.encode64(encrypted)
      resolve({
        data: encrypted64,
        label
      })
    }).catch(error => {

    })
  })
}