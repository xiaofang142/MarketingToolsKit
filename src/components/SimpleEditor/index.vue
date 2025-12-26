<template>
  <div class="simple-editor">
    <div class="editor-toolbar">
      <button @click="execCommand('bold')" :class="{ active: isCommandActive('bold') }" title="加粗">
        <strong>B</strong>
      </button>
      <button @click="execCommand('italic')" :class="{ active: isCommandActive('italic') }" title="斜体">
        <em>I</em>
      </button>
      <button @click="execCommand('underline')" :class="{ active: isCommandActive('underline') }" title="下划线">
        <u>U</u>
      </button>
      <span class="separator"></span>
      <button @click="execCommand('justifyLeft')" :class="{ active: isCommandActive('justifyLeft') }" title="左对齐">
        ≡
      </button>
      <button @click="execCommand('justifyCenter')" :class="{ active: isCommandActive('justifyCenter') }" title="居中">
        ≡
      </button>
      <button @click="execCommand('justifyRight')" :class="{ active: isCommandActive('justifyRight') }" title="右对齐">
        ≡
      </button>
      <span class="separator"></span>
      <button @click="insertLink" title="插入链接">
        🔗
      </button>
      <button @click="insertImage" title="插入图片">
        🖼️
      </button>
      <span class="separator"></span>
      <button @click="execCommand('undo')" title="撤销">
        ↶
      </button>
      <button @click="execCommand('redo')" title="重做">
        ↷
      </button>
    </div>
    <div 
      ref="editorRef" 
      class="editor-content" 
      contenteditable="true"
      @input="handleInput"
      @keydown="handleKeydown"
      @paste="handlePaste"
      v-html="modelValue"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:modelValue', 'input'])

const editorRef = ref(null)

// 初始化编辑器
onMounted(() => {
  if (props.disabled) {
    editorRef.value.contentEditable = false
  }
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && editorRef.value.innerHTML !== newVal) {
    editorRef.value.innerHTML = newVal
  }
})

// 处理输入
const handleInput = () => {
  const html = editorRef.value.innerHTML
  emits('update:modelValue', html)
  emits('input', html)
}

// 处理键盘事件
const handleKeydown = (e) => {
  // 处理Tab键
  if (e.key === 'Tab') {
    e.preventDefault()
    document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
  }
}

// 处理粘贴事件
const handlePaste = (e) => {
  e.preventDefault()
  const text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

// 执行命令
const execCommand = (command, value = null) => {
  document.execCommand(command, false, value)
  handleInput()
}

// 检查命令是否激活
const isCommandActive = (command) => {
  return document.queryCommandState(command)
}

// 插入链接
const insertLink = () => {
  const url = prompt('请输入链接地址:')
  if (url) {
    execCommand('createLink', url)
  }
}

// 插入图片
const insertImage = () => {
  const url = prompt('请输入图片地址:')
  if (url) {
    execCommand('insertImage', url)
  }
}
</script>

<style scoped>
.simple-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;
}

.editor-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-right: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.editor-toolbar button:hover {
  background-color: #e6e6e6;
}

.editor-toolbar button.active {
  background-color: #d1e7ff;
  border-color: #409eff;
}

.separator {
  display: inline-block;
  width: 1px;
  height: 20px;
  margin: 0 5px;
  background-color: #ccc;
}

.editor-content {
  min-height: 300px;
  padding: 12px;
  overflow-y: auto;
  background-color: #fff;
}

.editor-content:focus {
  outline: none;
}

.editor-content img {
  max-width: 100%;
  height: auto;
}
</style>