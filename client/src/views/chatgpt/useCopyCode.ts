import { useCopyText } from '@/hooks/global'
import { onMounted, onUpdated } from 'vue'

export function useCopyCode(ctx) {
  function copyCodeBlock() {
    const codeBlockWrapper = document.querySelectorAll('.code-block-wrapper')
    codeBlockWrapper.forEach((wrapper) => {
      const copyBtn = wrapper.querySelector('.code-block-header__copy')
      const codeBlock = wrapper.querySelector('.code-block-body')
      if (copyBtn && codeBlock) {
        copyBtn.addEventListener('click', () => {
          // if (navigator.clipboard?.writeText) {
          //   navigator.clipboard.writeText(codeBlock.textContent ?? '')
          // } else {
          //   useCopyText(ctx, codeBlock.textContent ?? '')
          // }
          useCopyText(ctx, codeBlock.textContent ?? '')
        })
      }
    })
  }

  onMounted(() => copyCodeBlock())

  onUpdated(() => copyCodeBlock())
}