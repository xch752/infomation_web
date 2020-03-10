<!-- 登陆 -->
<template>
  <div class="full">
    <el-row>
      <el-col :xs="4" :sm="7" :md="7" :lg="7" :xl="7">
        <div class="blank"></div>
      </el-col>
      <!-- 登陆界面 -->
      <el-col :xs="16" :sm="10" :md="10" :lg="10" :xl="10">
        <div class="card">
          <div class="login-img">
          </div>
          <div class="login-form">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="登录" name="Login">
                <!-- logo -->
                <img class="icon">
                <!-- 账号输入框 -->
                <el-input class="username" placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="login.username"
                  clearable>
                </el-input>
                <!-- 密码输入框 -->
                <el-input class="password" placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="login.password"
                  show-password>
                </el-input>
                <!-- 登陆按钮 -->
                <el-button @click="loginEvent()" :loading="login.loading" class="btn" type="primary">
                  登录
                </el-button>
              </el-tab-pane>
              <el-tab-pane label="注册" name="Register">
                <!-- logo -->
                <img class="icon">
                <!-- 账号输入框 -->
                <el-input class="username" placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="register.username"
                  clearable>
                </el-input>
                <!-- 验证码 -->
                <el-input class="password" placeholder="请输入验证码" prefix-icon="el-icon-view"
                  v-model="register.verificationCode" maxlength="6">
                  <el-button slot="append" class="ver-btn" style="color:white" @click="verificationCodeRegister"
                    :disabled="register.btnDisable">
                    {{register.cooldownTime}}</el-button>
                </el-input>
                <!-- 密码输入框 -->
                <el-input class="password" placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="register.password"
                  show-password>
                </el-input>
                <!-- 密码输入框 -->
                <el-input class="password" placeholder="请输入密码" prefix-icon="el-icon-lock"
                  v-model="register.passwordSecond" show-password>
                </el-input>
                <!-- 注册按钮 -->
                <el-button @click="registerEvent()" :loading="login.loading" class="btn" type="primary">
                  注册
                </el-button>
              </el-tab-pane>
              <el-tab-pane label="验证码登录" name="LoginByMobile">
                <!-- logo -->
                <img class="icon">
                <!-- 账号输入框 -->
                <el-input class="username" placeholder="请输入用户名" prefix-icon="el-icon-user"
                  v-model="loginByMobile.username" clearable>
                </el-input>
                <!-- 验证码 -->
                <el-input class="password" placeholder="请输入验证码" prefix-icon="el-icon-view"
                  v-model="loginByMobile.verificationCode" maxlength="6">
                  <el-button slot="append" class="ver-btn" style="color:white" @click="verificationCodeLogin"
                    :disabled="loginByMobile.btnDisable">
                    {{loginByMobile.cooldownTime}}</el-button>
                </el-input>
                <!-- 登陆按钮 -->
                <el-button @click="loginByMobileEvent()" :loading="loginByMobile.loading" class="btn" type="primary">
                  一键登录
                </el-button>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <el-col :xs="4" :sm="7" :md="7" :lg="7" :xl="7">
        <div class="blank"></div>
      </el-col>
    </el-row>
    <div class="footer">
      <span style="text-algin:center">学习项目 非商用</span>
      <span class="pull-left">备案号:<a href="http://beian.miit.gov.cn" target="_blank">浙ICP备20004524号-1</a></span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'Login',
        // 登录
        login: {
          username: '',
          password: '',
          loading: false
        },
        // 注册
        register: {
          username: '',
          verificationCode: '',
          cooldownTime: '获取验证码',
          second: '',
          password: '',
          passwordSecond: '',
          loading: false,
          btnDisable: false
        },
        // 验证码登录
        loginByMobile: {
          username: '',
          verificationCode: '',
          cooldownTime: '获取验证码',
          second: '',
          loading: false,
          btnDisable: false
        }
      }
    },
    mounted() {
      this.onKeyEnter()
    },
    methods: {
      // 监听回车事件
      onKeyEnter() {
        document.onkeydown = (e) => {
          if (e.keyCode === 13 && window.location.pathname === '/login') {
            switch (this.activeName) {
              case 'Login':
                this.loginEvent()
                break
              case 'Register':
                this.registerEvent()
                break
              case 'LoginByMobile':
                this.loginByMobileEvent()
                break
              default:
                break
            }
          }
        }
      },
      // 选项卡事件
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 登录
      loginEvent() {
        if (!this.login.username || !this.login.password) {
          this.$notify.warning({
            title: '警告',
            message: '请输入账号密码'
          })
        } else {
          this.login.loading = true
          Bmob.User.login(this.login.username, this.login.password).then(res => {
            console.log(res)
            sessionStorage.setItem('bmob', JSON.stringify(res))
            console.log(JSON.parse(sessionStorage.getItem('bmob')))
            this.login.loading = false
            this.$router.push({
              path: '/'
            })
            this.$notify.success({
              title: '成功',
              message: '登陆成功'
            })
          }).catch(err => {
            this.login.loading = false
            this.$notify.error({
              title: '错误',
              message: `${err.error}`
            })
          })
        }
      },
      // 发送验证码函数 注册
      verificationCodeRegister() {
        let value = this.register
        // 手机号正则判断
        if ((/^1[3456789]\d{9}$/.test(value.username))) {
          const query = Bmob.Query("_User")
          query.equalTo("username", "===", value.username)
          query.find().then(res => {
            // 手机号已注册
            if (res.length >= 1) {
              this.$notify.info({
                title: '信息',
                message: '手机号已注册'
              })
            }
            // 手机号未注册
            else {
              // 发送验证码
              let params = {
                mobilePhoneNumber: value.username
              }
              Bmob.requestSmsCode(params).then(response => {
                console.log(response)
                this.$notify.info({
                  title: '信息',
                  message: '验证码已发送'
                })
                //倒计时函数
                value.second = 's'
                value.cooldownTime = 60
                value.btnDisable = true
                var verTime = setInterval(() => {
                  value.cooldownTime = value.cooldownTime - 1
                  if (value.cooldownTime === -1) {
                    value.btnDisable = false
                    value.cooldownTime = '获取验证码'
                    value.second = ''
                    clearInterval(verTime)
                  }
                }, 1000)
              }).catch(function (error) {
                this.$notify.error({
                  title: '错误',
                  message: `${err.error}`
                })
              })
            }
          })
        }
        // 手机号正则判断失败
        else {
          this.$notify.warning({
            title: '警告',
            message: '请输入正确的手机号'
          })
        }
      },
      // 注册
      registerEvent() {
        if (!this.register.username) {
          this.$notify.warning({
            title: '警告',
            message: '请输入手机号'
          })
        } else if (!(this.register.password === this.register.passwordSecond)) {
          this.$notify.warning({
            title: '警告',
            message: '两次输入密码不一致'
          })
        }
        // 验证码验证
        else {
          // 需要number类型
          let smsCode = this.register.verificationCode
          let data = {
            mobilePhoneNumber: this.register.username
          }
          this.Bmob.verifySmsCode(smsCode, data).then(res => {
            console.log(res)
            // 验证成功
            // 注册
            let params = {
              username: this.register.username,
              password: this.register.password,
              mobilePhoneNumber: this.register.username,
              nickname: '用户' + this.randomWord(true, 5, 10),
              // 默认头像
              avatarUrl: 'http://static.xch752.com/defaultAvatar.jpg'
            }
            Bmob.User.register(params).then(res => {
              // 注册成功
              this.$notify.success({
                title: '成功',
                message: '注册成功'
              })
              this.login.username = this.register.username
              this.login.password = this.register.password
              this.loginEvent()
            }).catch(err => {
              // 注册失败
              this.$notify.error({
                title: '错误',
                message: err.error
              })
            })
          }).catch(err => {
            // 验证失败
            this.$notify.error({
              title: '错误',
              message: err.error
            })
          })
        }
      },
      // 发送验证码函数 一键登录
      verificationCodeLogin() {
        let value = this.loginByMobile
        // 手机号正则判断
        if ((/^1[3456789]\d{9}$/.test(value.username))) {
          const query = Bmob.Query("_User")
          query.equalTo("username", "===", value.username)
          query.find().then(res => {
            console.log(res)
            if (res.length === 0) {
              this.$notify.info({
                title: '信息',
                message: '手机号未注册'
              })
            }
            // 手机号已注册
            else {
              // 发送验证码
              let params = {
                mobilePhoneNumber: value.username
              }
              Bmob.requestSmsCode(params).then(response => {
                console.log(response)
                this.$notify.info({
                  title: '信息',
                  message: '验证码已发送'
                })
                //倒计时函数
                value.second = 's'
                value.cooldownTime = 60
                value.btnDisable = true
                var verTime = setInterval(() => {
                  value.cooldownTime = value.cooldownTime - 1
                  if (value.cooldownTime === -1) {
                    value.btnDisable = false
                    value.cooldownTime = '获取验证码'
                    value.second = ''
                    clearInterval(verTime)
                  }
                }, 1000)
              }).catch((error) => {
                this.$notify.error({
                  title: '错误',
                  message: `${error.error}`
                })
              })
            }
          })
        }
        // 手机号正则判断失败
        else {
          this.$notify.warning({
            title: '警告',
            message: '请输入正确的手机号'
          })
        }
      },
      // 登录
      loginByMobileEvent() {
        if (!this.loginByMobile.username) {
          this.$notify.warning({
            title: '警告',
            message: '请输入手机号'
          })
        } else if (!this.loginByMobile.verificationCode) {
          this.$notify.warning({
            title: '警告',
            message: '请输入验证码'
          })
        }
        // 验证码验证
        else {
          this.loginByMobile.loading = true
          let phone = parseInt(this.loginByMobile.username)
          let smsCode = parseInt(this.loginByMobile.verificationCode)
          Bmob.User.signOrLoginByMobilePhone(phone, smsCode).then(res => {
            console.log(res)
            sessionStorage.setItem('bmob', JSON.stringify(res))
            console.log(JSON.parse(sessionStorage.getItem('bmob')))
            this.loginByMobile.loading = false
            this.$notify.success({
              title: '成功',
              message: '登录成功'
            })
          }).catch(err => {
            this.loginByMobile.loading = false
            this.$notify.error({
              title: '错误',
              message: err.error
            })
          })
        }
      },
      // 随机姓名
      randomWord(randomFlag, min, max) {
        var str = "",
          range = min,
          arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
            'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
          ];

        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
          var pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
        }
        return str;
      }
    }
  }

</script>

<style scoped>
  .full {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: fixed;
    text-align: center;
    background: url('../../static/img/bg_login.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .el-row {
    position: absolute;
    bottom: 50%;
    width: 100%;
    transform: translate(-0%, 40%);
  }

  .el-col {
    border-radius: 4px;
  }

  .blank {
    border-radius: 4px;
    min-height: 36px;
  }

  .card {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 0px;
    -moz-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    -webkit-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    box-shadow: 1px 2px 4px rgb(240, 240, 240);
  }

  .login-img {
    width: 55%;
    background: url('../../static/img/login_img.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .login-form {
    width: 45%;
    padding: 10px 20px 20px 20px;
  }

  .icon {
    content: url("../../static/img/logo_256.png");
    width: 50px;
    height: 50px;
  }

  .username {
    margin-top: 25px;
  }

  .password {
    margin-top: 25px;
  }

  .btn {
    width: 80%;
    margin-top: 25px;
    border-radius: 999px;
    background-image: linear-gradient(105deg, #2a6dfe, #33a9f8);
    -moz-box-shadow: 1px 1px 3px #aaaaaa;
    -webkit-box-shadow: 1px 1px 3px #aaaaaa;
    box-shadow: 1px 1px 3px #aaaaaa;
  }

  .ver-btn {
    background-image: linear-gradient(105deg, #2a6dfe, #33a9f8);
  }

  .footer {
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 10px;
    width: 190px;
    /* height: 20px; */
    text-align: center;
    color: white;
  }

  .footer a {
    text-decoration: none;
    color: white;
  }

</style>
