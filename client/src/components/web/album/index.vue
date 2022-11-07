<template>
  <div class="album-item">
    <img class="album-item-cover" :src="album.cover_preview" />
    <div class="album-item__content">
      <div class="album-item-name">{{ album.name }}({{ album.count }})</div>
      <div class="album-item-divider"></div>
      <div class="album-item-desc">{{ album.desc }}</div>
    </div>
    <div class="album-item-action">
      <el-button type="primary" @click="handleClick('edit')">编辑</el-button>
      <el-button type="danger" @click="handleClick('delete')">删除</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AlbumInter } from '@/typings/interface';

interface Props {
  album: AlbumInter
}
withDefaults(defineProps<Props>(), {
  album: () => ({
    id: '',
    name: '',
    desc: '',
    cover: '',
    background: '',
    count: 0
  } as AlbumInter)
})
const emit = defineEmits(['submit'])


const handleClick = (type) => {
  emit('submit', type)
}
</script>

<style lang="scss">
.album-item {
  height: 250px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: #000;
  border-radius: 8px;

  .album-item-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    transition: all 0.35s;
    opacity: 0.8;
  }

  .album-item__content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0%;
    padding: 24px;
    color: #fff;
    display: flex;
    flex-direction: column;

    .album-item-name {
      line-height: 1.5;
      font-size: 20px;
      font-weight: bold;
      position: relative;
      margin: 7px 0;
      overflow: hidden;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .album-item-divider {
      height: 2px;
      background: #fff;
      margin: 5px 0;
      transition: all 0.35s;
      // transform: translate3d(-100%, 0, 0);
      opacity: 0;
      width: 0%;
    }

    .album-item-desc {
      padding: 7px 0 0;
      letter-spacing: 1px;
      font-size: 14px;
      line-height: 1.5;
      -webkit-line-clamp: 4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      transition: all 0.35s;
      transform: translate3d(100%, 0, 0);
      opacity: 0;
    }
  }

  .album-item-action {
    width: 100%;
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: all 0.35s;
    transform: translate3d(0, 100%, 0);
  }

  &:hover {
    .album-item-cover {
      transform: scale(1.2);
      opacity: 0.60;
    }

    .album-item-divider {
      width: 100%;
      opacity: 1;
    }

    
    .album-item-desc,
    .album-item-action {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>