<template>
  <div>
    <div class="card" v-for="(item,index) in list" :key="index" @click="choose(item)">
      <div class="user-head c-pointer" @click="toUser(item)"
        :style="{'background-image': 'url('+item.creator.avatarUrl+')'}"></div>
      <div class="main-content">
        <div class="user-name">
          <div class="c-pointer" @click="toUser(item)">{{item.creator.nickname}}</div>
        </div>
        <div class="time">
          <div class="detail-link tc-slate">{{item.createdAt}}</div>
        </div>
        <div class="card-content">
          <div class="post-content">
            <div class="original-card-content">
              <div class="text p-rel description">
                <div class="content">
                  <div class="content-full">{{item.content}}</div>
                </div>
              </div>
              <div class="imagesbox" :class="item.imgList.length === 1 ?'':'rol-'+Math.ceil(item.imgList.length/3)">
                <!-- <div class="img-content" :class="item.imgList.length === 1 ? 'only-img':''"
                  v-for="(imgItem,imgIndex) in item.imgList" :key="imgIndex"
                  :style="{'background-image': 'url('+imgItem+')'}">
                </div> -->
                <el-image :src="imgItem" class="img-content" :class="item.imgList.length === 1 ? 'only-img':''"
                  v-for="(imgItem,imgIndex) in item.imgList" :key="imgIndex" :preview-src-list="item.imgList"
                  fit="cover"></el-image>
              </div>
            </div>
          </div>
        </div>
        <div class="button-bar tc-slate">
          <div style="display:inline-flex">
            <div v-if="!item.isLike" class="like c-pointer" @click.stop="like(index,item)">
            </div>
            <div v-else class="islike c-pointer" @click.stop="unLike(index,item)">
            </div>
            <span>{{item.likes.count}}</span>
            <div class="comment c-pointer" @click.stop="commented(item)">
            </div>
            <span>{{item.comments.count}}</span>
            <div class="share c-pointer">
            </div>
          </div>
          <div style="display:inline-flex">
            <div v-if="!item.isCollect" class="collect c-pointer" @click.stop="collect(index,item)">
            </div>
            <div v-else class="iscollect c-pointer" @click.stop="unCollect(index,item)">
            </div>
          </div>
        </div>
      </div>
      <div class="button-area c-pointer" v-show="!(objectId === item.creator.objectId)">
        <div class="more-button" @click.stop="more(index,item)"></div>
      </div>
      <div class="more-panel fs-14 ls-0" v-show="item.moreShow">
        <p class="child-button c-pointer" v-if="item.isAttention" @click="unAttention(item)">取消关注</p>
        <p class="child-button c-pointer" v-if="!item.isAttention" @click="attention(item)">关注</p>
        <p class="child-button c-pointer">举报</p>
      </div>
    </div>
    <!-- 评论 -->
    <el-dialog title="评论" :visible.sync="comment.dialogVisable" width="30%" v-loading="comment.loading">
      <div>
        <el-form label-position="top">
          <!-- 发送消息 -->
          <el-form-item>
            <el-input type="textarea" :rows="4" placeholder="喜欢就评论告诉TA" v-model="comment.bodyValue">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="float:right" type="primary" plain :disabled="comment.bodyValue?false:true"
              @click="commentedSend">评论</el-button>
          </el-form-item>
        </el-form>
        <el-timeline style="padding-left:10px">
          <el-timeline-item v-for="(commentItem,commentIndex) in commentsList" :key="commentIndex"
            :timestamp="commentItem.createdAt" placement="top">
            <el-card>
              <div class="myAvatar" :style="{'background-image': 'url('+commentItem.creator.avatarUrl+')'}"></div>
              <p class="comment-p"><span v-if="commentItem.replyUser" style="font-weight:bold">回复
                  {{commentItem.replyUser.nickname}}:</span>{{commentItem.review}}</p>
              <p class="comment-name">{{commentItem.creator.nickname}}</p>
              <el-button type="text" style="position: absolute;bottom: 0;right: 15px;" @click="reply(commentItem)">回复
              </el-button>
            </el-card>
          </el-timeline-item>
          <el-card v-if="commentsList.length === 0">
            <p class="comment-p">还没有评论</p>
          </el-card>
        </el-timeline>
        <el-button v-if="commentsList.length != 0" type="text" @click="commentedCur">加载更多</el-button>
      </div>
    </el-dialog>
    <!-- 回复评论 -->
    <el-dialog title="回复评论" :visible.sync="replyValue.dialogVisable" width="30%">
      <el-form label-position="top">
        <!-- 发送消息 -->
        <el-form-item>
          <el-input type="textarea" :rows="4" :placeholder="replyValue.placeholderValue" v-model="replyValue.bodyValue">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-refresh" @click="replyValue.dialogVisable = false;replyValue.bodyValue = ''">取消
        </el-button>
        <el-button icon="el-icon-circle-check" type="primary" :disabled="replyValue.bodyValue?false:true"
          @click="replySend">确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDateDiff
  } from '../../util/DateDiff.js'
  export default {
    name: "MyCardList",
    data() {
      return {
        objectId: '',
        comment: {
          dialogVisable: false,
          pageSize: 10,
          pageNum: 1,
          loading: false,
          // 回复内容
          bodyValue: ''
        },
        // 评论列表
        commentsList: [],
        // 中间变量
        item: {},
        replyValue: {
          // 回复内容
          bodyValue: '',
          // 回复用户提示
          placeholderValue: '喜欢就评论告诉TA',
          // 回复窗口
          dialogVisable: false,
          // 回复用户
          replyUser: {},
        }
      }
    },
    props: {
      list: {
        type: Array,
        default: () => {}
      }
    },
    components: {},
    mounted() {
      this.objectId = JSON.parse(sessionStorage.getItem('bmob')).objectId
    },
    methods: {
      // 选中
      choose(item) {
        this.$emit('choose', item.objectId)
      },
      toUser(item) {
        this.$emit('toUser', item.creator.objectId)
      },
      like(index, item) {
        this.$emit('like', {
          MicroBlogId: item.objectId,
          index: index,
          creatorid: item.creator.objectId
        })
      },
      unLike(index, item) {
        this.$emit('unLike', {
          MicroBlogId: item.objectId,
          index: index
        })
      },
      collect(index, item) {
        this.$emit('collect', {
          MicroBlogId: item.objectId,
          index: index,
          creatorid: item.creator.objectId
        })
      },
      unCollect(index, item) {
        this.$emit('unCollect', {
          MicroBlogId: item.objectId,
          index: index
        })
      },
      commented(item) {
        this.comment.loading = true
        this.comment.dialogVisable = true
        this.item = item
        this.comment.pageNum = 1
        const query = Bmob.Query("MicroBlog")
        query.equalTo("objectId", "===", item.objectId)
        query.find().then(res_blog => {
          this.microBlogCreaotrId = res_blog[0].creator.objectId
          let queryComment = Bmob.Query('MicroBlog')
          queryComment.field('comments', res_blog[0].objectId)
          queryComment.order("-createdAt")
          queryComment.limit(this.comment.pageSize)
          queryComment.include('creator', 'replyUser')
          // 查询评论的具体用户信息
          queryComment.relation('Comment').then(res_comment => {
            res_comment.results.map(res_comment_item => {
              res_comment_item.createdAt = getDateDiff(res_comment_item.createdAt)
            })
            this.comment.loading = false
            this.commentsList = res_comment.results
          }).catch((err) => {
            this.$message.error(`加载失败${err.error}`)
          })
        }).catch(err => {
          this.$message.error(`加载失败${err.error}`)
        })
      },
      // 评论加载
      commentedCur() {
        let item = this.item
        this.comment.loading = true
        this.comment.dialogVisable = true
        const query = Bmob.Query("MicroBlog")
        query.equalTo("objectId", "===", item.objectId)
        query.find().then(res_blog => {
          this.microBlogCreaotrId = res_blog[0].creator.objectId
          let queryComment = Bmob.Query('MicroBlog')
          queryComment.field('comments', res_blog[0].objectId)
          queryComment.order("-createdAt")
          queryComment.limit(this.comment.pageSize)
          queryComment.skip(this.comment.pageSize * this.comment.pageNum)
          queryComment.include('creator', 'replyUser')
          // 查询评论的具体用户信息
          queryComment.relation('Comment').then(res_comment => {
            if (res_comment.results.length === 0) {
              this.$message('没有更多了')
              this.comment.loading = false
              return
            }
            this.comment.pageNum++
            res_comment.results.map(res_comment_item => {
              res_comment_item.createdAt = getDateDiff(res_comment_item.createdAt)
            })
            this.comment.loading = false
            this.commentsList = this.commentsList.concat(res_comment.results)
          }).catch((err) => {
            this.$message.error(`加载失败${err.error}`)
          })
        }).catch(err => {
          this.$message.error(`加载失败${err.error}`)
        })
      },
      commentedSend() {
        console.log(this.item)
        console.log(this.comment)
        if (!this.comment.bodyValue)
          return
        // 关联评论者
        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(this.objectId)
        // 关联被评论帖子
        const pointer_blog = Bmob.Pointer('MicroBlog')
        const poiID_blog = pointer.set(this.item.objectId)
        // 关联被评论者
        const pointer_creator = Bmob.Pointer('_User')
        const poiID_creator = pointer.set(this.item.creator.objectId)
        // 写入数据库Comment表 写入评论记录
        const query = Bmob.Query('Comment')
        query.set('creator', poiID)
        query.set('commented_blog', poiID_blog)
        query.set('commented_creator', poiID_creator)
        query.set('review', this.comment.bodyValue)
        // 写入数据库Comment表 写入评论记录
        console.log('query', query)
        query.save().then(res => {
          console.log(res)
          const relation = Bmob.Relation('Comment') // 需要关联的表
          const relID = relation.add([res.objectId]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
          const query1 = Bmob.Query('MicroBlog')
          query1.get(this.item.objectId).then(result => {
            result.set('comments', relID) // 将Relation对象保存到comments字段中，即实现了一对多的关联
            result.save()
            console.log(result)
            this.comment.bodyValue = ''
            this.commented(this.item)
            this.$message.success('评论成功')
          })
        }).catch(err => {
          console.log(err)
          this.$message.error(`失败${err.error}`)
        })
      },
      reply(item) {
        this.replyValue.dialogVisable = true
        this.replyValue.replyUser = item.creator
        this.replyValue.placeholderValue = `回复 ${item.creator.nickname}`
        console.log(this.replyValue)
      },
      replySend() {
        console.log(this.item)
        console.log(this.replyValue)
        if (!this.replyValue.bodyValue)
          return
        // 关联评论者
        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(this.objectId)
        // 关联被评论帖子
        const pointer_blog = Bmob.Pointer('MicroBlog')
        const poiID_blog = pointer.set(this.item.objectId)
        // 关联被评论者
        const pointer_creator = Bmob.Pointer('_User')
        const poiID_creator = pointer.set(this.item.creator.objectId)
        // 关联被回复者
        if (this.replyValue.replyUser.objectId) {
          var pointer_reply = this.Bmob.Pointer('_User')
          var poiID_reply = pointer_reply.set(this.replyValue.replyUser.objectId)
        }
        // 写入数据库Comment表 写入评论记录
        const query = Bmob.Query('Comment')
        query.set('creator', poiID)
        query.set('commented_blog', poiID_blog)
        query.set('commented_creator', poiID_creator)
        query.set('review', this.replyValue.bodyValue)
        if (this.replyValue.replyUser.objectId) {
          query.set('replyUser', poiID_reply)
          console.log('poiID_reply', poiID_reply)
        }
        // 写入数据库Comment表 写入评论记录
        console.log('query', query)
        query.save().then(res => {
          console.log(res)
          const relation = Bmob.Relation('Comment') // 需要关联的表
          const relID = relation.add([res.objectId]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
          const query1 = Bmob.Query('MicroBlog')
          query1.get(this.item.objectId).then(result => {
            result.set('comments', relID) // 将Relation对象保存到comments字段中，即实现了一对多的关联
            result.save()
            console.log(result)
            this.replyValue.bodyValue = ''
            this.replyValue.dialogVisable = false
            this.commented(this.item)
            this.$message.success('评论成功')
          })
        }).catch(err => {
          console.log(err)
          this.$message.error(`失败${err.error}`)
        })
      },
      more(index, item) {
        this.$emit('more', {
          MicroBlogId: item.objectId,
          creatorid: item.creator.objectId,
          index: index
        })
      },
      attention(item) {
        // 关联自己
        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(this.objectId)
        // 关联被博主
        const pointer_bloger = Bmob.Pointer('_User')
        const poiID_bloger = pointer.set(item.creator.objectId)
        // 写入数据库Attention表 写入收藏记录
        const query = Bmob.Query('Attention')
        query.set('fans', poiID)
        query.set('bloger', poiID_bloger)
        query.save().then(res => {
          this.$message.success('关注成功')
          item.moreShow = false
        })
      },
      unAttention(item) {
        const query = Bmob.Query('Attention')
        query.equalTo("bloger", '===', item.creator.objectId)
        query.equalTo("fans", '===', this.objectId)
        query.find().then(res => {
          query.destroy(res[0].objectId).then(result => {
            this.$message('取关成功')
            item.moreShow = false
          })
        })
      },
      report() {

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
    -moz-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    -webkit-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    box-shadow: 1px 2px 4px rgb(240, 240, 240);
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
    float: left;
  }

  .img-content {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    /* cursor: zoom-in; */
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

  .card .more-panel {
    position: absolute;
    width: 94px;
    text-align: center;
    top: 58px;
    right: 20px;
    background: #fff;
    border: 1px solid #e5e9ef;
    -webkit-box-shadow: 0 11px 12px 0 rgba(106, 115, 133, 0.12);
    box-shadow: 0 11px 12px 0 rgba(106, 115, 133, 0.12);
    border-radius: 8px;
    color: #222;
    z-index: 10;
  }

  .card .more-panel .child-button:first-child {
    padding-top: 18px;
  }

  .card .more-panel .child-button {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  p {
    margin: 0;
    padding: 0;
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

  .comment-p {
    margin: 10px 0 0 60px;
  }

  .comment-name {
    position: absolute;
    top: 55px;
    left: 110px;
    font-weight: bold;
    font-size: 16px;
  }

</style>
