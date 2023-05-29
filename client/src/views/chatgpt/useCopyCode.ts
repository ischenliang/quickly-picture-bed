import { useCopyText } from '@/hooks/global'
import { onMounted, onUpdated } from 'vue'

export function useCopyCode(ctx) {
  function copyCodeBlock() {
    const codeBlockWrapper = document.querySelectorAll('.code-block-wrapper')
    codeBlockWrapper.forEach((wrapper) => {
      const copyBtns = wrapper.querySelectorAll('.code-block-header__copy')
      const codeBlocks = wrapper.querySelectorAll('.code-block-body')
      copyBtns.forEach((copyBtn: HTMLElement, index) => {
        if (copyBtn && codeBlocks[index]) {
          copyBtn.onclick = () => {
            useCopyText(ctx, codeBlocks[index].textContent ?? '')
          }
          // 不能使用 addEventListener 事件注册的方式，因为重复注册不会覆盖
          // copyBtn.addEventListener('click', (e) => {
          //   console.log(e)
          //   // if (navigator.clipboard?.writeText) {
          //   //   navigator.clipboard.writeText(codeBlock.textContent ?? '')
          //   // } else {
          //   //   useCopyText(ctx, codeBlock.textContent ?? '')
          //   // }
          //   useCopyText(ctx, codeBlocks[index].textContent ?? '')
          // })
        }
      })
    })
  }

  onMounted(() => copyCodeBlock())

  onUpdated(() => copyCodeBlock())
}