 <template>
 <div class="navbar">
     <el-menu
      :router="true"
      :default-active="$router.path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">

      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/teacher">
        <i class="el-icon-s-custom"></i>
        <span slot="title">教师管理</span>
      </el-menu-item>
      <el-menu-item index="/student">
        <i class="el-icon-sugar"></i>
        <span slot="title">学员管理</span>
      </el-menu-item>
    </el-menu>
 </div>
</template>




  <style scoped>
  .el-menu {
  border-right: none;
  } 
  </style>