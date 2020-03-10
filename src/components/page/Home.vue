<template>
  <div>
    <div class="home">
      <div class="flex-one" v-loading="loading">
        <MyCardList :list="blogList" @choose="choose" @like="like" @unLike="unLike" @collect="collect"
          @unCollect="unCollect" @more="more"></MyCardList>
      </div>
      <div class="flex-two"></div>
    </div>
  </div>
</template>

<script>
  // import MyCard from '../Card'
  import MyCardList from '../CardList.vue'
  import {
    getDateDiff
  } from '../../../util/DateDiff.js'
  export default {
    data() {
      return {
        blogList: [],
        isLazyLoad: true,
        objectId: '',
        pageNum: 1,
        pageSize: 4,
        loading: false,
        commentDialog: true,
        circleUrl: 'http://static.xch752.com/avatarUrl/914621a72f/9d8UcfwC4MKWIWAIx6nY'
      }
    },
    components: {
      MyCardList
    },
    mounted() {
      let p1 = new Promise((resolve, reject) => {
        this.objectId = JSON.parse(sessionStorage.getItem('bmob')).objectId
        resolve(this.objectId)
        reject(this.objectId)
      })
      p1.then(res => {
        this.initBlogList()
        window.addEventListener('scroll', this.handleScroll)
      }).catch(err => {})
    },
    methods: {
      initBlogList() {
        this.pageNum = 1
        var countNumberLike = 0
        var countNumberComment = 0
        var countNumberCollect = 0
        this.loading = true
        var queryAttention = Bmob.Query('Attention')
        queryAttention.equalTo('fans', '===', this.objectId)
        queryAttention.order("-createdAt")
        queryAttention.limit(1000)
        queryAttention.find().then(res_attention => {
          if (res_attention.length != 0) {
            // 查表MicroBlog
            var query = Bmob.Query('MicroBlog')
            // 查询详细creator
            query.include('creator')
            // 条件查询关注的人
            var queryA = new Array()
            res_attention.map((item, index) => {
              queryA[index] = query.equalTo('creator', '===', item.bloger.objectId)
            })
            query.or(...queryA)
            // 按创建时间倒序
            query.order("-createdAt")
            // 一次加载pageSize条
            query.limit(this.pageSize)
            query.find().then(res_blog => {
              if (res_blog.length == 0) {
                this.loading = false
                return
              }
              // 数据处理
              res_blog.map((item_blog, index_blog) => {
                item_blog.isLike = false
                item_blog.isCollect = false
                item_blog.moreShow = false
                item_blog.createdAt = getDateDiff(item_blog.createdAt)
                // 分割imgList
                if (item_blog.imgList) {
                  item_blog.imgList = item_blog.imgList.split(",")
                }
                // 分割tag
                if (item_blog.tag) {
                  item_blog.tag = item_blog.tag.split(",")
                }
                // 查询点赞的关联关系
                let queryLike = Bmob.Query('MicroBlog')
                queryLike.field('likes', item_blog.objectId)
                // 查询点赞的具体的用户信息
                queryLike.relation('Like').then(res_like => {
                  item_blog.likes = res_like
                  // 查询是否点赞这条帖子 方法一
                  for (var i = 0; i < res_like.results.length; i++) {
                    if (res_like.results[i].creator.objectId === this.objectId) {
                      item_blog.isLike = true
                      break
                    }
                  }
                  countNumberLike = countNumberLike + 1
                  if (countNumberLike === res_blog.length && countNumberComment === res_blog.length &&
                    countNumberCollect === res_blog.length) {
                    this.blogList = res_blog
                    this.loading = false
                    console.log('this.blogList', this.blogList)
                  }
                })
                // 查询评论的关联关系
                let queryComment = Bmob.Query('MicroBlog')
                queryComment.field('comments', item_blog.objectId)
                // 查询评论的具体用户信息
                queryComment.relation('Comment').then(res_comment => {
                  item_blog.comments = res_comment
                  countNumberComment = countNumberComment + 1
                  if (countNumberLike === res_blog.length && countNumberComment === res_blog.length &&
                    countNumberCollect === res_blog.length) {

                    this.blogList = res_blog
                    this.loading = false
                    console.log('this.blogList', this.blogList)
                  }
                })
                // 查询收藏的关联关系
                let queryCollect = Bmob.Query('MicroBlog')
                queryCollect.field('collects', item_blog.objectId)
                // 查询收藏的具体的用户信息
                queryCollect.relation('Collect').then(res_collect => {
                  item_blog.collects = res_collect
                  // 查询是否收藏这条帖子 方法一
                  for (var i = 0; i < res_collect.results.length; i++) {
                    if (res_collect.results[i].creator.objectId === this.objectId) {
                      item_blog.isCollect = true
                      break
                    }
                  }
                  countNumberCollect = countNumberCollect + 1
                  if (countNumberLike === res_blog.length && countNumberComment === res_blog.length &&
                    countNumberCollect === res_blog.length) {
                    this.blogList = res_blog
                    this.loading = false
                    console.log('this.blogList', this.blogList)
                  }
                })
              })
            }).catch(err => {
              console.log(err)
              this.loading = false
              this.$notify.error({
                title: '错误',
                message: err.error
              })
            })
          } else {
            this.loading = false
            this.blogList = []
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.$notify.error({
            title: '错误',
            message: err.error
          })
        })
      },
      // 下拉加载
      currentChange() {
        var countNumberLike = 0
        var countNumberComment = 0
        var countNumberCollect = 0
        this.loading = true
        var queryAttention = Bmob.Query('Attention')
        queryAttention.equalTo('fans', '===', this.objectId)
        queryAttention.order("-createdAt")
        queryAttention.limit(1000)
        queryAttention.find().then(res_attention => {
          if (res_attention.length != 0) {
            // 查表MicroBlog
            var query = Bmob.Query('MicroBlog')
            // 查询详细creator
            query.include('creator')
            // 条件查询关注的人
            var queryA = new Array()
            res_attention.map((item, index) => {
              queryA[index] = query.equalTo('creator', '===', item.bloger.objectId)
            })
            query.or(...queryA)
            // 按创建时间倒序
            query.order("-createdAt")
            // 一次加载pageSize条
            query.limit(this.pageSize)
            query.skip(this.pageSize * this.pageNum)
            query.find().then(res_blog => {
              if (res_blog.length == 0) {
                this.loading = false
                this.$notify.info({
                  title: '提示',
                  message: '没有更多了'
                })
                return
              }
              this.pageNum++
              // 数据处理
              res_blog.map((item_blog, index_blog) => {
                item_blog.isLike = false
                item_blog.isCollect = false
                item_blog.moreShow = false
                item_blog.createdAt = getDateDiff(item_blog.createdAt)
                // 分割imgList
                if (item_blog.imgList) {
                  item_blog.imgList = item_blog.imgList.split(",")
                }
                // 分割tag
                if (item_blog.tag) {
                  item_blog.tag = item_blog.tag.split(",")
                }
                // 查询点赞的关联关系
                let queryLike = Bmob.Query('MicroBlog')
                queryLike.field('likes', item_blog.objectId)
                // 查询点赞的具体的用户信息
                queryLike.relation('Like').then(res_like => {
                  item_blog.likes = res_like
                  // 查询是否点赞这条帖子 方法一
                  for (var i = 0; i < res_like.results.length; i++) {
                    if (res_like.results[i].creator.objectId === this.objectId) {
                      item_blog.isLike = true
                      break
                    }
                  }
                  countNumberLike = countNumberLike + 1
                  if (countNumberLike === res_blog.length && countNumberComment === res_blog.length &&
                    countNumberCollect === res_blog.length) {
                    this.blogList = this.blogList.concat(res_blog)
                    this.loading = false
                    console.log('this.blogList', this.blogList)
                  }
                })
                // 查询评论的关联关系
                let queryComment = Bmob.Query('MicroBlog')
                queryComment.field('comments', item_blog.objectId)
                // 查询评论的具体用户信息
                queryComment.relation('Comment').then(res_comment => {
                  item_blog.comments = res_comment
                  countNumberComment = countNumberComment + 1
                  if (countNumberLike === res_blog.length && countNumberComment === res_blog.length &&
                    countNumberCollect === res_blog.length) {
                    this.blogList = this.blogList.concat(res_blog)
                    this.loading = false
                    console.log('this.blogList', this.blogList)
                  }
                })
                // 查询收藏的关联关系
                let queryCollect = Bmob.Query('MicroBlog')
                queryCollect.field('collects', item_blog.objectId)
                // 查询收藏的具体的用户信息
                queryCollect.relation('Collect').then(res_collect => {
                  item_blog.collects = res_collect
                  // 查询是否收藏这条帖子 方法一
                  for (var i = 0; i < res_collect.results.length; i++) {
                    if (res_collect.results[i].creator.objectId === this.objectId) {
                      item_blog.isCollect = true
                      break
                    }
                  }
                  countNumberCollect = countNumberCollect + 1
                  if (countNumberLike === res_blog.length && countNumberComment === res_blog.length &&
                    countNumberCollect === res_blog.length) {
                    this.blogList = this.blogList.concat(res_blog)
                    this.loading = false
                    console.log('this.blogList', this.blogList)
                  }
                })
              })
            }).catch(err => {
              console.log(err)
              this.loading = false
              this.$notify.error({
                title: '错误',
                message: err.error
              })
            })
          } else {
            this.loading = false
            this.blogList = []
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.$notify.error({
            title: '错误',
            message: err.error
          })
        })
      },
      handleScroll() {
        // console.log(Math.ceil(document.documentElement.scrollTop + window.innerHeight), document.body.offsetHeight)
        if (Math.ceil(document.documentElement.scrollTop + window.innerHeight) >= document.body.offsetHeight) {
          // console.log('handleScroll')
          this.currentChange()
        }
      },
      choose(objectId) {
        console.log(objectId)
      },
      like(object) {
        console.log(object)
        // 关联点赞者
        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(this.objectId)
        // 关联被点赞帖子
        const pointer_blog = Bmob.Pointer('MicroBlog')
        const poiID_blog = pointer.set(object.MicroBlogId)
        // 关联被点赞者
        const pointer_creator = Bmob.Pointer('_User')
        const poiID_creator = pointer.set(object.creatorid)
        // 写入数据库Like表 写入点赞记录
        const query = Bmob.Query('Like')
        query.set('creator', poiID)
        query.set('liked_blog', poiID_blog)
        query.set('liked_creator', poiID_creator)
        query.save().then(res => {
          console.log(res)
          const relation = Bmob.Relation('Like') // 需要关联的表
          const relID = relation.add([res.objectId]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
          const query1 = Bmob.Query('MicroBlog')
          query1.get(object.MicroBlogId).then(result => {
            result.set('likes', relID) // 将Relation对象保存到likes字段中，即实现了一对多的关联
            result.save()
            console.log(result)
            this.blogList[object.index].isLike = true
            this.blogList[object.index].likes.count++
            this.$message.success('点赞成功')
          })
        }).catch(err => {
          console.log(err)
          this.$message.error(`点赞失败${err.error}`)
        })
      },
      unLike(object) {
        // 查询符合条件的点赞表的记录
        const query = Bmob.Query('Like')
        query.equalTo("creator", '===', this.objectId)
        query.equalTo("liked_blog", '===', object.MicroBlogId)
        query.find().then(res => {
          console.log(res)
          const query = Bmob.Query('Like')
          query.destroy(res[0].objectId).then(result => {
            console.log(result)
            this.blogList[object.index].isLike = false
            this.blogList[object.index].likes.count--
            this.$message('取消点赞')
          }).catch(err => {
            console.log(err)
          })
        })
      },
      collect(object) {
        // 关联收藏者
        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(this.objectId)
        // 关联被收藏帖子
        const pointer_blog = Bmob.Pointer('MicroBlog')
        const poiID_blog = pointer.set(object.MicroBlogId)
        // 关联被收藏者
        const pointer_creator = Bmob.Pointer('_User')
        const poiID_creator = pointer.set(object.creatorid)
        // 写入数据库Collect表 写入收藏记录
        const query = Bmob.Query('Collect')
        query.set('creator', poiID)
        query.set('collected_blog', poiID_blog)
        query.set('collected_creator', poiID_creator)
        query.save().then(res => {
          console.log(res)
          const relation = Bmob.Relation('Collect') // 需要关联的表
          const relID = relation.add([res.objectId]) //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
          const query1 = Bmob.Query('MicroBlog')
          query1.get(object.MicroBlogId).then(result => {
            result.set('collects', relID) // 将Relation对象保存到likes字段中，即实现了一对多的关联
            result.save()
            console.log(result)
            this.blogList[object.index].isCollect = true
            this.$message.success('收藏成功')

          })
        }).catch(err => {
          console.log(err)
          this.$message.error(`失败${err.error}`)
        })
      },
      unCollect(object) {
        // 查询符合条件的点赞表的记录
        const query = Bmob.Query('Collect')
        query.equalTo("creator", '===', this.objectId)
        query.equalTo("collected_blog", '===', object.MicroBlogId)
        query.find().then(res => {
          console.log(res)
          const query = Bmob.Query('Collect')
          query.destroy(res[0].objectId).then(result => {
            console.log(result)
            this.blogList[object.index].isCollect = false
            this.$message('取消收藏')
          }).catch(err => {
            console.log(err)
            this.$message.error(`失败${err.error}`)
          })
        })
      },
      more(object) {
        const query = Bmob.Query('Attention')
        query.equalTo("bloger", '===', object.creatorid)
        query.equalTo("fans", '===', this.objectId)
        query.find().then(res => {
          // 已关注
          if (res.length != 0) {
            this.blogList[object.index].isAttention = true
            this.blogList[object.index].moreShow = !this.blogList[object.index].moreShow
          } else {
            this.blogList[object.index].isAttention = false
            this.blogList[object.index].moreShow = !this.blogList[object.index].moreShow
          }
        })
      },
    }
  }

</script>

<style scoped>
  .home {
    padding-top: 50px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    width: 60%;
    height: auto;
  }

  .flex-one {
    width: 70%;
  }

  .flex-two {
    position: fixed;
    top: 60px;
    left: 62.5%;
    width: 18%;
    height: 200px;
    border-radius: 6px;
    background: rgb(138, 92, 199);
    -moz-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    -webkit-box-shadow: 1px 2px 4px rgb(240, 240, 240);
    box-shadow: 1px 2px 4px rgb(240, 240, 240);
  }

  .ava-icon {
    height: 32px;
    width: 32px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }

</style>
