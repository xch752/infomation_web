<template>
  <div class="card" @click="choose">
    <div class="user-head c-pointer" :style="{'background-image': 'url('+avatarUrl+')'}"></div>
    <div class="main-content">
      <div class="user-name">
        <div class="c-pointer">{{username}}</div>
      </div>
      <div class="time">
        <div class="detail-link tc-slate">{{createdAt}}</div>
      </div>
      <div class="card-content">
        <div class="post-content">
          <div class="original-card-content">
            <div class="text p-rel description">
              <div class="content">
                <div class="content-full">{{content}}</div>
              </div>
            </div>
            <div class="imagesbox" :class="imgList.length === 1 ?'':'rol-'+Math.ceil(imgList.length/3)">
              <div class="img-content" :class="imgList.length === 1 ? 'only-img':''"
                v-for="(imgItem,imgIndex) in imgList" :key="imgIndex" :style="{'background-image': 'url('+imgItem+')'}">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="button-bar tc-slate">
        <div style="display:inline-flex">
          <div v-if="!isLike" class="like">
          </div>
          <div v-else class="islike">
          </div>
          <span>{{likeCount}}</span>
          <div class="comment">
          </div>
          <span>{{commentCount}}</span>
          <div class="share">
          </div>
        </div>
        <div style="display:inline-flex">
          <div v-if="!isCollect" class="collect">
          </div>
          <div v-else class="iscollect">
          </div>
        </div>
      </div>
    </div>
    <div class="button-area c-pointer">
      <div class="more-button"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MyCard",
    data() {
      return {}
    },
    props: {
      objectId: {
        type: String,
        default: ""
      },
      username: {
        type: String,
        default: ""
      },
      avatarUrl: {
        type: String,
        default: "http://static.xch752.com/mine_background.jpg"
      },
      createdAt: {
        type: String,
        default: ""
      },
      content: {
        type: String,
        default: ""
      },
      imgList: {
        type: Array,
        default: () => {}
      },
      likeCount: {
        type: Number,
        default: 0
      },
      commentCount: {
        type: Number,
        default: 0
      },
      isLike: {
        type: Boolean,
        default: false
      },
      isCollect: {
        type: Boolean,
        default: false

      }
    },
    components: {},
    methods: {
      // 选中
      choose() {
        console.log(this.objectId)
        this.$emit('choose', this.objectId)
      },
      like() {
        this.$emit('like', this.objectId)
      },
      unLike() {
        this.$emit('unLike', this.objectId)
      },
      collect() {
        this.$emit('collect', this.objectId)
      },
      unCollect() {
        this.$emit('unCollect', this.objectId)
      },
      comment() {
        this.$emit('comment', this.objectId)
      }
    }
  }

</script>

<style scoped>
  .card {
    position: relative;
    top: 0;
    margin: 10px 0 10px 0;
    border-radius: 4px;
    /* min-width: 632px; */
    background: #fff;
    -moz-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    -webkit-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    box-shadow: 1px 2px 4px rgb(240, 240, 240);
  }

  .card .user-head {
    display: block;
    position: absolute;
    width: 48px;
    height: 48px;
    top: 24px;
    left: 24px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }

  .c-pointer {
    cursor: pointer;
  }

  a {
    outline: none;
    text-decoration: none;
  }

  .card .main-content {
    width: 85%;
    padding-top: 27px;
    margin-left: 88px;
  }

  .card .main-content .user-name {
    color: #222;
    letter-spacing: 0;
    font-size: 16px;
    display: inline-block;
  }

  .card .main-content .time {
    padding-top: 4px;
    letter-spacing: 0;
    font-size: 16px;
  }

  .card .main-content .time .detail-link {
    -webkit-transition: color 0.3s ease;
    transition: color 0.3s ease;
    font-size: 12px;
  }

  .tc-slate {
    color: #99a2aa;
  }

  .card-content {
    /* width: 532px; */
    margin-top: 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-right: 0;
    /* padding-bottom: 20px; */
  }

  .description {
    width: 85%;
    max-width: 100%;
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 22px;
    word-wrap: break-word;
  }

  .content {
    display: block;
    color: inherit;
    padding-right: 10px;
  }

  .content-full {
    width: 85%;

    word-break: break-word;
    word-wrap: break-word;
  }

  .imagesbox {
    width: 85%;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
  }

  /* .col-3 {
    display: grid;
    grid-template-columns: 10vw 10vw 10vw;
    grid-gap: .5vw;
    grid-auto-flow: row;
  } */

  .rol-1 {
    display: grid;
    grid-template-columns: 10vw 10vw 10vw;
    grid-gap: .5vw;
    grid-auto-flow: row;
    grid-template-rows: 10vw
  }

  .rol-2 {
    display: grid;
    grid-template-columns: 10vw 10vw 10vw;
    grid-gap: .5vw;
    grid-auto-flow: row;
    grid-template-rows: 10vw 10vw
  }

  .rol-3 {
    display: grid;
    grid-template-columns: 10vw 10vw 10vw;
    grid-gap: .5vw;
    grid-auto-flow: row;
    grid-template-rows: 10vw 10vw 10vw;
  }

  .only-img {
    width: 20vw;
    height: 20vw;
  }

  .img-content {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .card .button-area {
    position: absolute;
    top: 30px;
    right: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .more-button {
    background: url('../../static/img/more.png');
    width: 24px;
    height: 24px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .card .main-content .button-bar {
    display: inline-flex;
    width: 85%;
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
  }

  .like {
    background: url('../../static/img/like.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    margin: 10px 0 0 0;
  }

  .comment {
    background: url('../../static/img/comment.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    margin: 10px 0 0 30px;

  }

  .share {
    background: url('../../static/img/share.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    margin: 10px 0 0 30px;

  }

  .collect {
    background: url('../../static/img/collect.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    margin: 10px 0 0 0;
  }

  .islike {
    background: url('../../static/img/islike.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    margin: 10px 0 0 0;
  }

  .iscollect {
    background: url('../../static/img/iscollect.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    margin: 10px 0 0 0;
  }

</style>
