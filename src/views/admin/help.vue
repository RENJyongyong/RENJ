<template>
  <div>
    <el-button type="primary" @click="addCategory">添加分类</el-button>
    <!-- 分类列表 -->
    <el-table :data="categories" border>
      <el-table-column prop="sort" label="序号" width="80px"></el-table-column>
      <el-table-column prop="id" label="ID" width="150px"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>

      <el-table-column label="显示状态">
        <template #default="scope">
          <el-switch v-model="scope.row.showStatus" @change="updateCategory(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editCategory(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteCategory(scope.row)">删除</el-button>
          <el-button size="small" @click="viewCategory(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange"
      :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" :total="total"
      :layout="'prev, pager, next'"></el-pagination>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑分类" v-model="editCategoryDialogVisible" @close="cancelEditCategory">
      <!-- 编辑表单 -->
      <el-form :model="editedCategory" label-width="80px">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="editedCategory.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="editedCategory.id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" :label-width="formLabelWidth">
          <el-input v-model="editedCategory.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专题数量表" :label-width="formLabelWidth">
          <el-input v-model="editedCategory.helpCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="editedCategory.sort" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <!-- 其他分类属性的表单项 -->
        <!-- ... -->
      </el-form>
      <!-- 保存和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <div class="dialog-footer__right">
          <el-button @click="cancelEditCategory">取消</el-button>
          <el-button type="primary" @click="saveEditedCategory">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 添加对话框 -->
    <el-dialog title="添加分类" v-model="addCategoryDialogVisible" @close="cancelAddCategory">
      <!-- 添加表单 -->
      <el-form :model="newCategory">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="newCategory.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="newCategory.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" :label-width="formLabelWidth">
          <el-input v-model="newCategory.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专题数量表" :label-width="formLabelWidth">
          <el-input v-model="newCategory.helpCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="editedCategory.sort" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <!-- 保存和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <div class="dialog-footer__right">
          <el-button @click="cancelAddCategory">取消</el-button>
          <el-button type="primary" @click="saveNewCategory">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="该分类下的帮助内容：" v-model="viewCategoryDialogVisible" @close="cancelViewCategory" :width="1200"
      :height="600">
      <el-button class="addhelpbtn" type="primary" size="small" @click="addHelp()">添加</el-button>
      <el-table :data="categoryHelps" border>
        <!-- 定义帮助信息的列 -->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column label="显示状态">
          <template #default="scope">
            <el-switch v-model="scope.row.showStatus" @change="updatehelp(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="icon" label="帮助图标"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editHelp(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteHelp(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-button #default="scope" class="addhelpbtn" type="primary" size="small" @click="addHelp()">添加</el-button> -->
      </el-table>
    </el-dialog>

    <el-dialog title="添加帮助信息" v-model="addhelpDialogVisible" @close="cancelAddCategory">
      <!-- 添加表单 -->
      <el-form :model="newhelp">
        <el-form-item label="categoryId" :label-width="formLabelWidth">
          <el-input v-model="newhelp.categoryId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="帮助标题" :label-width="formLabelWidth">
          <el-input v-model="newhelp.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="newhelp.id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="帮助图标" :label-width="formLabelWidth">
          <el-input v-model="newhelp.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="帮助内容" :label-width="formLabelWidth">
          <el-input v-model="newhelp.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- <el-table-column label="显示状态">
        <template #default="scope">
          <el-switch v-model="scope.row.showStatus" @change="updateCategory(scope.row)"></el-switch>
        </template>
        </el-table-column> -->
      <!-- 保存和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <div class="dialog-footer__right">
          <el-button @click="cancelAddhelp">取消</el-button>
          <el-button type="primary" @click="saveNewhelp">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="编辑帮助信息" v-model="edithelpDialogVisible" @close="cancelAddCategory">
      <!-- 添加表单 -->
      <el-form :model="selectedHelp">
        <el-form-item label="categoryId" :label-width="formLabelWidth">
          <el-input v-model="selectedHelp.categoryId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="帮助标题" :label-width="formLabelWidth">
          <el-input v-model="selectedHelp.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="selectedHelp.id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="帮助图标" :label-width="formLabelWidth">
          <el-input v-model="selectedHelp.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="帮助内容" :label-width="formLabelWidth">
          <el-input v-model="selectedHelp.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- <el-table-column label="显示状态">
        <template #default="scope">
          <el-switch v-model="scope.row.showStatus" @change="updateCategory(scope.row)"></el-switch>
        </template>
        </el-table-column> -->
      <!-- 保存和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <div class="dialog-footer__right">
          <el-button @click="canceledithelp">取消</el-button>
          <el-button type="primary" @click="saveedithelp">保存</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getCmsHelpsByCategoryId, Add, Del, Edit, Page, } from '@/http/cms_help.js';
import { categoryPage, categoryEdit, categoryAdd, categoryDel } from '@/http/cms_help_category.js';
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      categories: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      editCategoryDialogVisible: false, // 控制编辑对话框的显示与隐藏
      addCategoryDialogVisible: false, // 控制添加对话框的显示与隐藏
      viewCategoryDialogVisible: false, // 控制查看分类对话框的显示与隐藏
      addhelpDialogVisible: false,//控制添加帮助对话框的显示与隐藏
      edithelpDialogVisible: false,//控制编辑帮助对话框的显示与隐藏
      categoryHelps: [], // 存储选定分类的帮助信息
      categoriesHelps: [],
      formLabelWidth: '120px', //长度
      editedCategory: {
        "helpCount": 0,
        "icon": "",
        "id": 0,
        "name": "",
        "showStatus": 0,
        "sort": 0
      }, // 存储编辑后的分类信息
      newCategory: {
        "helpCount": 0,
        "icon": "",
        "id": 0,
        "name": "",
        "showStatus": 0,
        "sort": 0
      }, // 存储新分类的信息
      selectedHelp: {
        "categoryId": 0,
        "content": "",
        "createTime": "",
        "icon": "",
        "id": 0,
        "readCount": 0,
        "showStatus": 0,
        "title": ""
      },// 用于存储选定的帮助项
      helpDialogVisible: false,//用于控制添加/编辑对话框的显示与隐藏
      newhelp: {

      },
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      const params = {
        current: this.currentPage,
        size: this.pageSize
      };

      categoryPage(params)
        .then(response => {
          const { data } = response;
          console.log(data);
          this.categories = data.data.page.records.map(category => ({
            ...category,
            showStatus: category.showStatus === 0 // 将0转换为true，1转换为false
          }));
          console.log(this.categories);
          this.total = data.data.page.total;
        })
        .catch(error => {
          console.error(error);
        });
    },
    updatehelp(updatedhelp) {
      const help = { ...updatedhelp };
      const updatedhStatus = help.showStatus ? 0 : 1; // 反转状态值
      console.log(updatedhStatus);
      help.showStatus = updatedhStatus;
      console.log(help);
      Edit(help).then(() => {
        console.log('更新成功');
        // 更新成功后更新本地数据
        const index = this.categoryHelps.findIndex(cat => cat.id === help.id);
        if (index !== -1) {
          this.categoryHelps[index].showStatus = help.showStatus;
          // 使用 $nextTick 方法确保更新后的值在下一次 Vue 响应周期中正确反映在开关组件上
          this.$nextTick(() => {
            this.categoryHelps[index].showStatus = !help.showStatus;
          });
        }
      }).catch(error => {
        console.error(error);
        // 更新失败时恢复原始状态
        const index = this.categoryHelps.findIndex(cat => cat.id === help.id);
        if (index !== -1) {
          this.categoryHelps[index].showStatus = !help.showStatus;
        }
      });
    },
    updateCategory(updatedCategory) {
      const category = { ...updatedCategory }; // 创建副本以避免直接修改原始数据
      const updatedStatus = category.showStatus ? 0 : 1; // 反转状态值
      console.log(updatedStatus);
      // 更新分类项的showStatus属性
      category.showStatus = updatedStatus;
      console.log(category);
      // 调用接口更新数据库中的数据
      categoryEdit(category)
        .then(() => {
          console.log('更新成功');
          // 更新成功后更新本地数据
          const index = this.categories.findIndex(cat => cat.id === category.id);
          if (index !== -1) {
            this.categories[index].showStatus = category.showStatus;
            // 使用 $nextTick 方法确保更新后的值在下一次 Vue 响应周期中正确反映在开关组件上
            this.$nextTick(() => {
              this.categories[index].showStatus = !category.showStatus;
            });
          }
        })
        .catch(error => {
          console.error(error);
          // 更新失败时恢复原始状态
          const index = this.categories.findIndex(cat => cat.id === category.id);
          if (index !== -1) {
            this.categories[index].showStatus = !category.showStatus;
          }
        });
    },

    editCategory(category) {
      console.log(category);
      console.log("彼时南面隔春风");
      this.editedCategory = { ...category }; // 创建副本以避免直接修改原始数据
      console.log(this.editedCategory);
      this.editCategoryDialogVisible = true; // 显示编辑对话框
    },

    saveEditedCategory() {
      const editedCategory = { ...this.editedCategory };
      editedCategory.showStatus = editedCategory.showStatus ? 0 : 1;
      console.log(editedCategory);
      categoryEdit(editedCategory).then(() => {
        // 更新成功后更新本地数据
        this.fetchCategories();
        this.editCategoryDialogVisible = false; // 隐藏编辑对话框
      })
        .catch(error => {
          console.error(error);
        });
    },

    cancelEditCategory() {

      this.editCategoryDialogVisible = false; // 隐藏编辑对话框
    },

    addCategory() {
      console.log("彼时南面隔春风");
      this.newCategory = {
        "helpCount": 0,
        "icon": "",
        "id": 0,
        "name": "",
        "showStatus": 0,
        "sort": 0
      }
      this.addCategoryDialogVisible = true; // 显示添加对话框
      console.log("123");
      console.log(this.newCategory)
    },

    saveNewCategory() {
      console.log(this.newCategory);

      categoryAdd(this.newCategory)
        .then(response => {
          const { data } = response;
          this.categories.push(data); // 将新分类添加到 categories 数组的末尾
          this.addCategoryDialogVisible = false; // 隐藏添加分类对话框
          this.newCategory = { // 重置 newCategory 对象
            helpCount: 0,
            icon: "",
            id: 0,
            name: "",
            showStatus: 0,
            sort: 0
          };
          this.fetchCategories();
        })
        .catch(error => {
          console.error(error);
        });

    },


    cancelAddCategory() {
      this.addCategoryDialogVisible = false; // 隐藏添加对话框
    },

    deleteCategory(category) {
      // 执行删除操作，你可以根据实际需求进行删除操作，比如弹出确认对话框等
      console.log('删除分类:', category);
      categoryDel(category.id)
        .then(() => {
          console.log('删除成功');
          // 删除成功后更新本地数据
          const index = this.categories.findIndex(cat => cat.id === category.id);
          if (index !== -1) {
            this.categories.splice(index, 1);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    cancelViewCategory() {
      this.viewCategoryDialogVisible = false; // 隐藏查看分类对话框
      this.categoryHelps = []; // 清空存储的帮助信息
    },

    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
      this.fetchCategories();
    },

    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.fetchCategories();
    },
    viewCategory(category) {
      console.log(category.id);
      getCmsHelpsByCategoryId(category.id)
        .then(response => {
          const { data } = response;
          console.log(data)
          if (data && data.data && data.data.cmsHelps) {
          this.categoryHelps = data.data.cmsHelps; // 存储获取的帮助信息
          this.viewCategoryDialogVisible = true; // 显示查看分类对话框
        } else {
          ElMessage.success('该分类下没有帮助信息');
        this.viewCategoryDialogVisible = true; // 显示查看分类对话框
      }
        })
        .catch(error => {
          this.categoryHelps ={

          },
          console.error(error);
        });
      this.categoriesHelps = {
        id: category.id
      }

    },
    addHelp() {
      console.log(this.categoriesHelps)
      // 重置选定的帮助项，并显示添加/编辑对话框
      this.newhelp = {
        "categoryId": this.categoriesHelps.id,
        "content": "",
        "createTime": "",
        "icon": "",
        "id": 0,
        "readCount": 0,
        "showStatus": 0,
        "title": "",
      };
      this.addhelpDialogVisible = true;
      // console.log(this.selectedHelp)

    },
    cancelAddhelp() {
      this.addhelpDialogVisible = false;
    },
    saveNewhelp() {
      console.log(this.newhelp)
      console.log(this.categoriesHelps.id);
      Add(this.newhelp).then(response => {
        const { data } = response;
        this.categoryHelps.push(data); // 将新分类添加到 newhelp 数组的末尾
        this.addhelpDialogVisible = false; // 隐藏添加分类对话框
        this.newhelp = { // 重置 selectedHelp 对象
          "categoryId": this.categoriesHelps.id,
          "content": "",
          "createTime": "",
          "icon": "",
          "id": 0,
          "readCount": 0,
          "showStatus": 0,
          "title": "",
        };
        this.viewCategory(this.categoriesHelps);
      })
        .catch(error => {
          console.error(error);
        });
    },
    editHelp(categoryHelps) {
      this.selectedHelp = { ...categoryHelps };
      this.edithelpDialogVisible = true;
    },
    canceledithelp() {
      this.edithelpDialogVisible = false;
    },
    saveedithelp() {
      const showStatus = this.selectedHelp.showStatus ? 0 : 1;
      this.selectedHelp.showStatus = showStatus;

      console.log(this.selectedHelp);
      Edit(this.selectedHelp).then(() => {
        this.viewCategory(this.categoriesHelps);
        this.edithelpDialogVisible = false;
      }).catch(error => {
        console.error(error);
      })
    },

    deleteHelp(categoryHelps) {
      // 在删除帮助项前显示确认对话框
      ElMessageBox.confirm('确定要删除此帮助信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Del(categoryHelps.id).then(() => {

            this.viewCategory(this.categoriesHelps);
            ElMessage.success('删除成功');

          }).catch(error => {
            console.error(error);
          })
        })
        .catch(() => {
          // 取消删除
        });
    },

  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
}

.dialog-footer__right {
  margin-left: auto;
}

.addhelpbtn {
  width: 60px;
  height: 40px;
  margin-left: 1000px;
  margin-bottom: 20px;
}
</style>

