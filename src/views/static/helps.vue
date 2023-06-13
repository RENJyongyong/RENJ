<template>
    <div>
      <div class="helps-container">
        <div class="helps-categories">
          <h2>帮助分类</h2>
          <ul>
            <li v-for="category in categories" :key="category.id" @click="fetchHelps(category.id)">
              {{ category.name }}
            </li>
          </ul>
        </div>
  
        <div class="helps-info">
          <h2>帮助信息</h2>
          <ul>
            <li v-for="help in filteredHelps" :key="help.id">
              <h3>{{ help.title }}</h3>
              <img :src="help.icon" alt="Icon" v-if="help.icon"  class="help-image"/>
              <p>{{ help.content }}</p>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- 分页组件 -->
      <el-pagination @current-change="handlePageChange" :current-page="pagination.current" :page-size="pagination.size"
        :total="pagination.total"></el-pagination>
    </div>
  </template>
  
<script>
import { categoryPage } from '@/http/cms_help_category.js';
import { getCmsHelpsByCategoryId } from '@/http/cms_help.js';

export default {
    data() {
        return {
            categories: [], // 帮助分类列表
            helps: [], // 帮助信息列表
            pagination: {
                current: 1, // 当前页数
                size: 15, // 每页数量
                page: 0, // 总页数
                total: 0, //总条数
            },
        };
    },

    mounted() {
        this.getCategoryPage();
    },

    methods: {
        // 获取帮助分类
        getCategoryPage() {
            const params = {
                current: 1,
                size: 15,
            };

            categoryPage(params)
                .then(res => {
                    console.log(res)
                    this.categories = res.data.data.page.records.filter(category => category.showStatus === 0);
                    console.log(this.categories);
                    this.pagination.current = res.data.data.page.current;
                    this.pagination.size = res.data.data.page.size;
                    this.pagination.total = res.data.data.page.total;
                    this.pagination.page = res.data.data.page.pages;

                })
                .catch(err => {
                    console.log(err);
                });
        },

        // 获取帮助信息
        fetchHelps(categoryId) {

            console.log("感时花溅泪")
            getCmsHelpsByCategoryId(categoryId)
                .then(res => {
                    console.log(res.data);
                    if (res.data.data) {
                        console.log("最是人间留不住")
                        this.helps = res.data.data.cmsHelps;
                    } else {
                        console.log("朱颜辞镜花辞树")
                        this.helps = [];
                        ElMessage.success('该分类下没有帮助信息');
                        // 在这里显示该分类没有帮助信息的提示
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },




        // 分页改变时触发
        handlePageChange(currentPage) {
            this.pagination.current = currentPage;
            // 调用获取帮助信息的方法，传入当前页数
            this.fetchcategoryByPage(currentPage);
        },

        // 根据当前页数获取分类信息
        fetchcategoryByPage(currentPage) {
            const params = {
                current: currentPage,
                size: this.pagination.size,
            };

            categoryPage(params)
                .then(res => {
                    console.log(res)
                    this.categories = res.data.data.page.records.filter(category => category.showStatus === 0);
                    console.log(this.categories);
                    this.pagination.current = res.data.data.page.current;
                    this.pagination.size = res.data.data.page.size;
                    this.pagination.total = res.data.data.page.total;
                    this.pagination.page = res.data.data.page.pages;

                })
                .catch(err => {
                    console.log(err);
                });
        },
    },

    computed: {
        filteredHelps() {
            return this.helps.filter(help => help.showStatus === 0);
        },
    },
};
</script>
  
<style lang="scss" scoped>
.helps-container {
  display: flex;
}

.helps-categories {
  flex: 1;
  margin-right: 20px;
}

.helps-info {
  flex: 2;
  margin-bottom: 20px;
}
.help-image {
  width: 800px; /* 设置图片的宽度 */
  height: 600px; /* 设置图片的高度 */
  object-fit: cover; /* 控制图片的填充方式 */
}
</style>






