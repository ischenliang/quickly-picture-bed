<template>
  <div class="wiki-item">
    <div class="wiki-item-title">是来空间</div>
    <div class="wiki-item-desc">空间是记录信息和知识的页面集合，通过组织页面层级将知识系统化、结构化，在知识管理层面助力企业更快更好的发布产品。</div>
    <div class="wiki-item-git">
      <a href="https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoBranches" target="_blank">仓库地址</a>
    </div>
    <div class="wiki-item-time">
      <span>创建: 2023-09-01</span>
      <span>编辑: 2023-09-01</span>
    </div>
    <div class="wiki-item-status">
      <el-tag effect="dark" type="success" size="small">开放</el-tag>
    </div>
    <div class="wiki-item-action">
      <el-dropdown>
        <div class="wiki-item-action-item"><el-icon><More /></el-icon></div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Edit">编辑</el-dropdown-item>
            <el-dropdown-item icon="DeleteFilled">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss">
.wiki-item {
  width: 100%;
  height: 192px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  padding: 16px;
  background: #fff;
  position: relative;
  &-title {
    font-size: 17px;
    font-weight: 600;
    color: #535353;
    margin-bottom: 10px;
  }
  &-desc {
    font-size: 15px;
    margin-top: 10px;
    color: #777;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  &-git {
    margin-top: 10px;
    a {
      text-decoration: none;
      color: #2d8cf0;
    }
  }
  &-time {
    font-size: 14px;
    margin-top: 10px;
    color: #999;
    span + span {
      margin-left: 8px;
    }
  }
  &-action {
    position: absolute;
    bottom: 16px;
    right: 16px;
    &-item {
      width: 30px;
      height: 20px;
      background: #b8c7e6;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1c3f94;
    }
  }
  &-status {
    position: absolute;
    top: 16px;
    right: 16px;
  }
}
</style>