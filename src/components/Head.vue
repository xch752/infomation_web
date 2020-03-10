<template>
  <div>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li>
              <a class="navbar-brand" style="padding:6px">
                <img class="brand" alt="brand">
              </a>
            </li>
            <li><a href="#">InFomation</a></li>
            <li class="active"><a href="#">首页</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                aria-expanded="false">发现<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </li>
          </ul>
          <form class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="">
            </div>
            <el-button class="submit" type="primary" size="medium" circle plain icon="el-icon-search"></el-button>
          </form>
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                aria-expanded="false">消息<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </li>
            <li>
              <a class="navbar-brand" style="padding:6px">
                <img class="user" alt="user">
              </a>
            </li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    components: {},
    // mounted: {},
    methods: {}
  }

</script>

<style scoped>
  .navbar {
    background: #ffffff;
    -moz-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    -webkit-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    box-shadow: 1px 2px 4px rgb(240, 240, 240);
  }

  .container-fluid {
    width: 60%;
    margin: 0 auto;
  }

  .brand {
    content: url("../../static/img/logo_256.png");
    width: 38px;
    height: 38px;
    margin: 0 10px;
  }

  .nav>li>a {
    padding: 15px 25px;
  }

  .navbar-default .navbar-nav>.active>a {
    color: #2a6dfe;
    font-weight: bold;
    background: white;
    font-size: 15px;
  }

  .navbar-default .navbar-nav>li>a {
    font-size: 15px;
  }

  .submit {
    margin-left: 20px;
  }

  .user {
    content: url("../../static/img/logo_256.png");
    width: 38px;
    height: 38px;
    margin: 0 10px;
  }

</style>
