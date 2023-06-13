<template>
    <div>
      <div class="">
        <el-button @click="rein">
          <refresh style="width: 1em; height: 1em; margin-right: 8px;" />刷新
        </el-button>
        <el-button style="float: right;margin-left: 50px" @click="addStudent"><circle-plus
            style="width: 1em; height: 1em; margin-right: 8px;" />添加</el-button>
        <el-input v-model="search" type="text" placeholder="输入学号搜索" style="width:500px;margin-left: 50px;"
          @input="onInputNumber" />
        <el-button @click="searchStudentByNo(search)">
          <search style="width: 1em; height: 1em; margin-right: 8px;" />搜索
        </el-button><el-button @click="resetting">重置</el-button>
        <el-select v-model="selectedClass" placeholder="选择班级" style="margin-left: 8px;">
          <el-option v-for="(item, index) in classinfoList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="allinfo">
        <el-table :data="allinfo">
          <el-table-column prop="id" label="id" align="center"></el-table-column>
          <el-table-column prop="classinfo" label="班级" width="150px" align="center"></el-table-column>
          <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="studentNo" label="学号" align="center" width="120px"></el-table-column>
          <el-table-column prop="depart" label="部门" align="center"></el-table-column>
          <el-table-column prop="school" label="学校" show-overflow-tooltip align="center" width="200px"></el-table-column>
          <el-table-column prop="major" label="专业" align="center"></el-table-column>
          <el-table-column width="250px" label="操作">
            <template v-slot="{ row }">
              <el-button @click="editStudent(row)" type="primary">
                <edit style="width: 1em; height: 1em; margin-right: 8px;" />修改
              </el-button>
              <el-button @click="deleteStudent(row.id)" type="danger">
                <delete style="width: 1em; height: 1em; margin-right: 8px;" />删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <el-pagination v-if="page.total>0" background layout="prev, pager, next" :page-size="page.size" :total="page.total"
          :current-page="page.current" @current-change="currentchange"></el-pagination>
      </div>
    </div>
  
  
    <el-dialog v-model="dialogFormVisible" title="学生编辑">
      <el-form :model="allinfos">
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="allinfos.studentNo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="allinfos.studentName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="allinfos.classinfo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input v-model="allinfos.depart" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学校" :label-width="formLabelWidth">
          <el-input v-model="allinfos.school" autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="allinfos.major" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="save">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import { defineComponent } from "vue"
  import axios from "axios";
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { cloneDeep } from 'lodash-es'
  import { getallinfo, studentAdd, studentEdit, studentdel, getStudentsByNo, getall, getwant } from '@/http/student.js'
  
  
  export default defineComponent({
    props: {
      page: {
        type: Object,
        default: () => ({
          current: 1,
          school: "泉州信息工程学院",
          size: 15
        })
      }
    },
    //adCates=allinfo adCate=allinfos
    data() {
      return {
        allinfo: [], // 初始化数据数组
        all: [],
        dialogFormVisible: false, //窗口显示标记
        formLabelWidth: '80px', //长度
        search: "",//输入框内容
        total: 0,
        selectedClass: '', //选中的班级信息
        classinfoList: [], //所有班级信息
        allinfos: {
          "classinfo": "",
          "createTime": "",
          "depart": "",
          "id": "",
          "major": "",
          "school": "",
          "studentName": "",
          "studentNo": "",
          "updateTime": "",
          "userId": 0,
        },
      }
    },
    mounted() {
      this.getAllInfo(1);
      this.getAll()
      this.getWant()
    },
    methods: {
      getWant() {
        const params = {
          colums: 1,
          classinfo: "2020软件工程1班",
        }
        getwant(params).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      getAll() {
        getall().then(res => {
          console.log(res)
          const renj = res.data;
          this.all = renj.students;
          this.classinfoList = Array.from(new Set(this.all.map((item) => item.classinfo)));
          console.log(this.classinfoList);
          this.filterBySelectedClass();
        }).catch(err => {
          console.log(err);
        })
        this.allinfo = this.filteredInfo;
      },
      getAllInfo(current) {
        const params = {
          current: current,
          school: "泉州信息工程学院",
          size: 15,
        }
        getallinfo(params).then(res => {
          console.log(res);
          const page = res.data.page;
          this.allinfo = page.records; // 将数据记录数组赋值给 allinfo 变量
          this.page.total = page.total;
          console.log(this.page.size)
  
        }).catch(err => {
          console.log(err);
        })
      },
      rein() {
        location.reload()
      },
      currentchange(current) {
        // console.log(current);
        this.getAllInfo(current);
        this.page.current = current; //数据更新目前显示的页面
      },
      onInputNumber() {
        this.search = this.search.replace(/[^0-9]/g, '');
      },
      addStudent() {
        this.allinfos = {
          "classinfo": "",
          "createTime": "",
          "depart": "",
          "id": "",
          "major": "",
          "school": "",
          "studentName": "",
          "studentNo": "",
          "updateTime": "",
          "userId": 0,
        }
        this.dialogFormVisible = true;
      },
      editStudent(allinfos) {
        console.log(allinfos);
        this.dialogFormVisible = true;
        this.allinfos = cloneDeep(allinfos);
      },
      save() {
        const allinfos = this.allinfos;
        if (allinfos.id == 0) {
          studentAdd(allinfos).then(res => {
            if (res.success) {
              //刷新页面
              this.dialogFormVisible = false;
              console.log(this.page.current),
                this.getAllInfo(this.page.current)
              ElMessage(res.msg)
            }
            else {
              ElMessage(res.msg)
              return false
            }
          }).catch(err => {
            ElMessage('网络错误联系管理员')
          })
        }
        else {
          studentEdit(allinfos).then(res => {
            if (res.success) {
              //刷新页面
              this.dialogFormVisible = false;
              this.getAllInfo(this.page.current)
              ElMessage(res.msg)
            }
            else {
              ElMessage(res.msg)
              return false
            }
          }).catch(err => {
            ElMessage('网络错误联系管理员')
          })
        }
  
      },
      deleteStudent(id) {
        ElMessageBox.confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          console.log(id)
          const params = {
            id: id
          }
          studentdel(params).then(res => {
            if (res.success) {
              this.getAllInfo(this.page.current)
  
            }
            else {
              console.log(res.msg)
              return false
            }
  
  
          }).catch(err => {
            console.log(err)
          })
        }).catch((e) => {
  
        });
  
      },
      searchStudentByNo(search) {
        if (this.search !== "" && this.search !== null) {
          this.searchStudentnoData(search);
        }
      },
      searchStudentnoData(search) {
        const params = {
          studentNo: search,
        };
        getStudentsByNo(params)
          .then(res => {
            console.log(res.data); // 确认返回数据格式是否正确
            let datas = res.data;
            this.allinfo = [];
            //RENJ 2003010133 zxy
            if (Array.isArray(datas?.student)) {
              datas.student = [datas.student];
            }
            this.allinfo = this.allinfo.concat(datas.student);
            // 如果搜索结果为空数组，重置 allinfo 为一个空数组
            if (this.allinfo.length == 0) {
              this.page.total = 0;
            }
            // 手动更新分页组件的当前页码和总记录数
            this.page.current = 1;
            this.page.total = this.allinfo.length;
          })
          .catch(err => {
            console.log(err);
            ElMessage('未找到该学生');
            this.resetting();
            this.page.total = 0;
            this.page.current = 0;
            console.log(this.page.total)
          });
      },
  
      resetting() {
        this.search = "";
      },
      filterBySelectedClass() {
        if (!this.selectedClass) {
          this.filteredInfo = [];
          return;
        }
        this.filteredInfo = this.all.filter((item) => item.classinfo === this.selectedClass);
      },
   
  
      watch: {
        selectedClass(value) {
          this.filterBySelectedClass();
        }
      },
  
    }
  })
  
  </script>
  
  <style lang="scss" scoped></style>