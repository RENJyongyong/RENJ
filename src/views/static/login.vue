<template>
  <div class="login-wrap">
    <div class="login-links">
        <div class="logbtn" @click="changelog">用户/管理员登录</div>
      </div>
    <el-form ref="ruleFormRef" :model="userForm" status-icon :rules="rules" class="demo-ruleForm login-container">
      <h3 class="title" v-if="showTitle === 1">用户登录</h3>
      <h3 class="title" v-else>管理员登录</h3>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email" autocomplete="off" placeholder="请输入你的邮箱" suffix-icon="Message" />
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input type="password" v-model="userForm.password" autocomplete="off" placeholder="请输入你的密码"
          suffix-icon="Lock" />
      </el-form-item>
      <el-form-item style="width: 100%; display: flex; justify-content: center; margin-top: 50px; margin-left: 30px;">
        <el-button type="primary" style="width: 40%;" :loading="logining" @click="btnLogin" v-if="showTitle === 1">用户登录</el-button>
        <el-button type="primary" style="width: 40%;" :loading="logining" @click="btnLogin1"  v-else>管理员登录</el-button>
        <el-button style="width: 40%;" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    {{ this.rou }}
  </div>
</template>
    
<script>
import { defineComponent } from 'vue';
import { userLogin } from '@/http/school.js';
import { mapActions, storeToRefs } from 'pinia';
import { useUserStore } from '../../store/user';
export default defineComponent({
  setup() {

  },
  data() {
    return {
      showTitle:"",
      userForm: {
        email: '',
        password: '',
        rou: "",
      },
      rules: {
        email: [
          { required: true, message: '请输入正确的电子邮箱', tirgger: 'blur' },
          { type: 'email', message: '电子邮箱格式错误', tirgger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确的用户密码', tirgger: 'blur' },
          { min: 8, message: '密码长度不得小于8', tirgger: 'blur' }
        ],
      },
    }
  },
  methods: {
    changelog() {
      this.showTitle = this.showTitle === 1 ? 0 : 1;
  },
    // 选项式
    getToken() {
      const userStore = useUserStore();
      return userStore.getToken;
    },

    ...mapActions(useUserStore, ['setToken', 'fillUserinfo']),
    btnLogin() {
      const that = this;
      const formEl = that.$refs.ruleFormRef//取ref对象
      // console.log(formEl);
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          const res = userLogin(this.userForm)

          res.then(result => {

            //用户的状态 用户信息，用户是否登录的标志token='anc' isLogin：true
            //settoken
            //保存登录用户的信息
            //filluserinfo
            //调用状态pinia的辅助函数 mapActions
            //pinia 下次解决
            //跳转页面
            if (result.success) {
              const userinfo = result.data.userinfo;
              const userStore = useUserStore();
              console.log(that);
              that.getToken(userinfo.token)
              that.fillUserinfo(userinfo);
              this.rou = userStore.token;
              this.$router.push('/helps');
            }
            else {
              //      return false;
            }
          }).catch(err => {
            console.log(err)

          })
        }
        else {
          console.log(' error.submit')
          return false;
        }
      })

    },
    btnLogin1() {
      const that = this;
      const formEl = that.$refs.ruleFormRef//取ref对象
      // console.log(formEl);
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          const res = userLogin(this.userForm)

          res.then(result => {

            //用户的状态 用户信息，用户是否登录的标志token='anc' isLogin：true
            //settoken
            //保存登录用户的信息
            //filluserinfo
            //调用状态pinia的辅助函数 mapActions
            //pinia 下次解决
            //跳转页面
            if (result.success) {
              const userinfo = result.data.userinfo;
              const userStore = useUserStore();
              console.log(that);
              that.getToken(userinfo.token)
              that.fillUserinfo(userinfo);
              this.rou = userStore.token;
              this.$router.push('/help');
            }
            else {
              //      return false;
            }
          }).catch(err => {
            console.log(err)

          })
        }
        else {
          console.log(' error.submit')
          return false;
        }
      })

    },
    resetForm() {
      const formEl = this.$refs.ruleFormRef //取ref对象
      formEl.resetFields()
    },
  }
});
</script>
    
<style lang="scss" scoped>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding-top: 10%;
  background-image:url(../../assets/loginbg.jpeg);
  /* background-color: #112346; */
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
  margin-bottom: 20px;
  /* 为登录表单腾出空间 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.logbtn {
  text-decoration: none;
  color: black;
  margin-left: 30px;
  cursor: default;

}
.login-links {
  display: flex;
  margin-left: 260px;
  padding-right: 30px;
  margin-bottom: 20px;
  font-weight: bold; /* 调整字体粗细 */
  border: 6px solid #fffffffc;
  border-radius: 10px;

}
</style>
