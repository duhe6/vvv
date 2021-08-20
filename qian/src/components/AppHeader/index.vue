<template>
  <div class="header">
    <!-- 头部左侧Logo和标题 -->
    <a href="#/">
      <img class="logo" src="../../assets/tu.jpg" width="25px" />
      <span class="company">DH管理系统</span>
    </a>
    <!-- 头部右侧下拉菜单 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-sunrise-1" command="a"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-moon-night" command="b"
          >退出系统</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        style="width: 400px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { logout } from "../../api/login";
import passwordApi from"../../api/password"
export default {
  data() {
    //校验原密码
    const validateOldPass = (rule, value, callback) => {
        passwordApi.checkPwd(this.user.id, value).then(response => {
            const resp = response.data
            if (resp.flag) {
                callback()
            } else {
                callback(new Error(resp.message))
            }
        })
    }
    // rule 当前校验表单对象
    const validatePass = (rule, value, callback) => {
        if (value != this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback()
        }
    } 
    // 注意是在 return 上面
    return {
     
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      user: JSON.parse(localStorage.getItem('sms-user')),
        rules: {
            oldPass: [
                { required: true, message: '旧密码不能为空', trigger: 'blur' },
                { validator: validateOldPass, trigger: 'blur' }
            ],
            pass: [
                { required: true, message: '新密码不能为空', trigger: 'blur' }
            ],
            checkPass: [
                { required: true, message: '确认密码不能为空', trigger: 'blur' },
                { validator: validatePass, trigger: 'change' }
            ],
        }
    }
  },

  methods: {
    submitForm(formName) {
    this.$refs[formName].validate(valid => {
        if (valid) {
            // 验证通过，提交添加
            passwordApi.updatePwd(this.user.id, this.ruleForm.checkPass)
                .then(response => {
                    const resp = response.data
                    this.$message({
                        message: resp.message,
                        type: resp.flag ? 'success' : 'warning'
                    })
                    if (resp.flag) {
                        this.handleLogout()
                        this.dialogFormVisible = false
                    }
                })
        } else {
            // 验证不通过
            return false;
        }
    })
},
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();

          break;
        default:
          break;
      }
    },
    handleLogout() {
      logout(localStorage.getItem("sms-token")).then((response) => {
        if (response.data.flag) {
          localStorage.removeItem("b337sms-token");
          localStorage.removeItem("b337sms-user");
          this.$router.push("/login");
        } else {
          this.$message.error(respose.data.message);
        }
      });
    },
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
   
  },
};
</script>

<style scoped>
.logo {
  width: 30px;
  vertical-align: middle;
  /* 上 右 下 左 */
  padding: 0 10px 0 40px;
}
.company {
  position: absolute;
  color: white;
}
/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
</style> 