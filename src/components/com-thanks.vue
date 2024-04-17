<template>
  <div class="body">
    <pre style="padding: 10px 10px 0 10px;color: brown;font-weight: bolder;">
声明：此项目仅供学习交流，禁止用于一切商业行为，如有不听劝告者，产生的一切后果均与本站及本人无关！！！

声明：此项目仅供学习交流，禁止用于一切商业行为，如有不听劝告者，产生的一切后果均与本站及本人无关！！！

声明：此项目仅供学习交流，禁止用于一切商业行为，如有不听劝告者，产生的一切后果均与本站及本人无关！！！

为了保证浏览效果，建议使用1920*1080及以上分辨率，谷歌或火狐最新版浏览器浏览！</pre>
    <pre style="padding: 10px 10px 0 10px">
作者最近接触刮刮乐，觉得挺有趣的，正值票荒开始，所以有了这个项目。
此项目为纯前端VUE项目，大量使用H5的canvas制作。
制作此项目的目的有两个：
  1、练习VUE和H5的基础知识。
  2、刮瘾犯的时候来两本过过瘾。
在编写过程中发现了票中有巨量的细节，为了尽量还原，处理这些细节花费了巨量的时间和精力，项目预期时间从1周变成了3周。就目前效果来看，还是不错的。
项目从设计开始就打算制作喜相逢全部面值的票，但因为目前精力有限以及不打算花费大量资金来购买实体票收集数据，所以只做了20面值的。
如果大家觉得项目还不错，甚至期待其他面值的玩法，可以在最下方扫描捐赠二维码，请作者喝一杯咖啡，作者努力完成。
为了收集足够量的数据，作者决定在捐赠超1000元制作10元面值，超4000元制作30元面值，超9000元制作50元面值，捐赠额及名单不定期更新在下方。
最后感谢大家的喜爱，如果有什么问题欢迎在</pre>
    <div style="padding-left: 10px;">
      <el-link type="danger" href="">
        <Link style="width: 1em; height: 1em; margin-right: 4px"/>
        GitHub
      </el-link>
      或者
      <el-link type="danger" href="">
        <Link style="width: 1em; height: 1em; margin-right: 4px"/>
        Gitee
      </el-link>
    </div>
    <pre style="padding: 0 10px;">
上提issues，或发邮件到作者邮箱  huuu12345@qq.com</pre>
    <p style="padding-left: 10px;">
      感谢捐赠,捐赠者名单：
    </p>
    <el-scrollbar ref="scrollArea" class="scroll-container" @mouseenter="stopScroll" @mouseleave="startScroll">
      <div class="scroll-content">
        <div class="scroll-item" v-for="(item,index) in donors" :key="index">
          <img :src="require('@/assets/avatar/'+item.avatar)">
          <a style="text-align: center">{{ item.name }}</a>
        </div>
      </div>
    </el-scrollbar>
    <p style="padding-left: 10px;">扫码捐赠，当前累计捐赠额：100元</p>
    <div style="display: flex;padding-left: 10px;">
      <div style="padding-right: 20px; width: 150px;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
        <img :src="require('@/assets/wx.jpg')" style="width: 150px;height: 150px;">
        <p>微信</p>
      </div>
      <div style="width: 150px;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
        <img :src="require('@/assets/zfb.jpg')" style="width: 150px;height: 150px;">
        <p>支付宝</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "com-thanks",
  data() {
    return {
      scrollArea: null,
      timer: null,
      SCROLL_SPEED: 1,
      donors: [
          {avatar: '1.jpg', name: '小煜'},
          {avatar: '2.jpg', name: '含倾筠'},
      ],
    }
  },
  mounted() {
    this.scrollArea = this.$refs.scrollArea;
    this.startScroll();
  },
  unmounted() {
    this.stopScroll();
  },
  methods: {
    startScroll() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        // 获取滚动容器
        let container = this.scrollArea.$el.querySelector('.el-scrollbar__wrap');
        // 判断是否已滚动到底部
        if (container.scrollHeight - (container.scrollTop + container.clientHeight) <= 0) {
          // 滚动到顶部
          container.scrollTop = 0;
        } else {
          // 向下滚动
          container.scrollTop += this.SCROLL_SPEED;
        }
      }, 150); // 根据需要调整滚动间隔
    },
    stopScroll() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  },
}
</script>

<style scoped>
* {
  margin: 0;
}

.body {
  width: 20vw;
  height: 800px;
  margin-top: 20px;
  background-color: cornsilk;
}

/*兼容多个浏览器,超出换行*/
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  *word-wrap: break-word;
  *white-space: normal;
}

.el-link {
  --el-link-font-size: 20px;
}

.scroll-container {
  width: 100%;
  height: 100px;
}

.scroll-content {
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
}

.scroll-item {
  width: 90px;
  height: 25px;
  display: flex;
  align-items: center;
}

.scroll-item img {
  width: 20px;
  height: 20px;
}
</style>
