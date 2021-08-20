
<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="search"
      style="margin-top: 20px"
    >
      <el-form-item prop="stunum">
        <el-input
          v-model="search.stunum"
          placeholder="学号"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="search.name"
          placeholder="学生姓名"
          style="width: 200px"
        ></el-input>
      </el-form-item>

      <el-form-item prop="teacher">
        <el-input
          readonly
          @click.native="dialogTeacherVisible = true"
          v-model="search.teacher"
          placeholder="授课教师"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="class">
        <el-input
          v-model="search.class"
          placeholder="所在班级"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchData"
          >查询</el-button
        >
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd"
          >新增</el-button
        >
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      :data="list"
      height="380"
      border
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="stunum" label="学号" width="100"></el-table-column>
      <el-table-column
        prop="name"
        label="学生姓名"
        width="100"
      ></el-table-column>
      <el-table-column prop="admissiondate" label="入学时间"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column
        prop="teacher"
        label="授课教师"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="class"
        label="所在班级"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="job"
        label="工作单位"
        width="500"
      ></el-table-column>
      <el-table-column
        prop="money"
        label="薪资待遇"
        width="100"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDele(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      title="选择教师"
      :visible.sync="dialogTeacherVisible"
      width="500px"
    >
      <teacher :isDialog="true" @option-teacher="optionTeacher"></teacher>
    </el-dialog>
    <el-dialog title="学员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item label="学号" prop="stunum">
          <el-input v-model="pojo.stunum" />
        </el-form-item>
        <el-form-item label="学员姓名" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="入学时间" prop="admissiondate">
          <el-date-picker
            v-model="pojo.admissiondate"
            type="date"
            placeholder="请点击选择"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" />
        </el-form-item>

        <el-form-item label="授课教师" prop="teacherId">
          <el-input
            readonly
            @click.native="editOptionTeacher"
            v-model="pojo.teacher"
            placeholder="选择授课教师"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在班级" prop="class">
          <el-input v-model="pojo.class" />
        </el-form-item>
        <el-form-item label="工作单位" prop="job">
          <el-input v-model="pojo.job" />
        </el-form-item>
        <el-form-item label="薪资待遇" prop="money">
          <el-input v-model="pojo.money" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            pojo._id === null ? addData('pojoForm') : updateData('pojoForm')
          ">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import studentApi from "../../api/student.js";
import Teacher from "@/views/teacher";
//import Teacher from "../teacher/index.vue"
export default {
  data() {
    return {
      pojo: {
        _id: null,
        stunum: "",
        name: "",
        admissiondate: "",
        phone: "",
        teacher: "",
        teacherId: "",
        class: "",
        job: "",
        money: "",
      },
      isEdit: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      search: {
        stunum: "",
        name: "",
        teacher: "",
        class: "",
        teacher: "",
      },
      dialogTeacherVisible: false,
      dialogFormVisible: false,
      rules: {
        stunum: [{ required: true, message: "学号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "学员姓名不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  components: { Teacher },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      studentApi
        .search(this.currentPage, this.pageSize, this.search)
        .then((response) => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.rows;
          console.log(resp);
        });
    },
    optionTeacher(currentRow) {
      this.search.teacher = currentRow.name;
      this.search.teacherId = currentRow._id;
      this.dialogTeacherVisible = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
   // 打开编辑窗口
handleEdit(id) {
      this.handleAdd();
      studentApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    updateData(formName){
this.$refs[formName].validate((valid)=>{
  if(valid){
    //this.pojo.admissiondate=this.formatDate(this.pojo.admissiondate);
    studentApi.update(this.pojo).then((response)=>{
      const resp=response.data;
      if(resp.flag){
        this.fetchData();
        this.dialogFormVisible=false;
        this.$message({
          message:resp.message,
          type:"success",
        });
      }else{
        this.$message({
          message:resp.message,
          type:"waring",
        });
      }
    });
  }else{
    return false;
  }
})
    },
    handleDele(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认
          studentApi.deleteById(id).then((response) => {
            const resp = response.data;
            //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message,
            });
            if (resp.flag) {
              // 删除成功，刷新列表
              this.fetchData();
            }
          });
        })
        .catch(() => {
          // 取消删除，不理会
        });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
       // this.pojo.admissiondate=this.formatDate(this.pojo.admissiondate);
        studentApi.add(this.pojo).then((response)=>{
          const resp=response.data;
          if(resp){
            this.fetchData();
            this.dialogFormVisible=false;

          }else{
            this$.message({
              message:resp.message,
              type:"waring",
            });
          }

        })
        } else {
          return false;
        }
      });
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    editOptionTeacher() {
      this.isEdit = true;
      this.dialogTeacherVisible = true;
    },
    optionTeacher(currentRow) {
      if (this.isEdit) {
        this.pojo.teacher = currentRow.name;
        this.pojo.teacherId = currentRow._id;
      } else {
        this.search.teacher = currentRow.name;
        this.search.teacherId = currentRow._id;
      }
      this.isEdit = false;
      this.dialogTeacherVisible = false;
    },

  },
};
</script>