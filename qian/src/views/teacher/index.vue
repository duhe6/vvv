<template>
  <div>
    <!-- 查询 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
    >
      <!-- 有prop才可以重置 -->
      <el-form-item prop="jobnumber">
        <el-input
          v-model="searchMap.jobnumber"
          placeholder="工号"
          style="width: 200px"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="教师姓名"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select
          v-model="searchMap.role"
          placeholder="教师职务"
          style="width: 110px"
          v-if="!isDialog"
        >
          <!--key 标识， label 下拉显示的文本，vulue 表单值 -->
          <el-option
            v-for="option in roleOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="entrydate">
        <!-- value-format 是指定绑定值的格式 -->
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.entrydate"
          type="date"
          placeholder="入职时间"
          v-if="!isDialog"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchData"
          >查询</el-button
        >
        <el-button
          v-if="!isDialog"
          type="primary"
          icon="el-icon-edit"
          @click="handleAdd"
          >新增</el-button
        >

        <el-button v-if="!isDialog" @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 列表-->
    <!-- :data 绑定渲染的数据；border: 边框; -->
    <el-table
      :high-current-row="isDialog"
      @current-change="clickCurrentChange"
      :data="list"
      height="380"
      border
      style="width: 100%"
    >
      <!--type="index" 获取索引值，从1开始； label 显示的标题; prop 数据字段名； width 列的宽度 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="jobnumber" label="工号"></el-table-column>
      <el-table-column prop="name" label="教师姓名"></el-table-column>
      <el-table-column prop="role" label="教师职务" v-if="!isDialog">
        <template slot-scope="scope">
          <span>{{ scope.row.role | roleFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="entrydate"
        label="入职时间"
        v-if="!isDialog"
      ></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column label="操作" width="150" v-if="!isDialog">
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
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :layout="
        !isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev,next'
      "
      :total="total"
    >
    </el-pagination>
    <!-- 编辑 -->
    <el-dialog
      
      title="教师编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="工号" prop="jobnumber">
          <el-input v-model="pojo.jobnumber" />
        </el-form-item>
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="职务" prop="role">
          <el-select
            v-model="pojo.role"
            class="filter-item"
            placeholder="请点击选择"
          >
            <el-option
              v-for="option in roleOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="entrydate">
          <el-date-picker
            v-model="pojo.entrydate"
            type="date"
            placeholder="请点击选择"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" />
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
import teacherApi from "@/api/teacher";
const roleOptions = [
  { type: "1", name: "教师" },
  { type: "2", name: "班主任" },
];
export default {
  props: {
    isDialog: Boolean,
  },
  data() {
    return {
      rules: {
        jobnumber: [{ required: true, message: "不为空", trigger: "blur" }],
        name: [{ required: true, message: "不为空", trigger: "blur" }],
        role: [{ required: true, message: "不为空", trigger: "blur" }],
      },
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: "",
      },
      pojo: {
        _id: null,
        jobnumber: "",
        name: "",
        role: "",
        entrydate: "",
        phone: "",
      },
      roleOptions: roleOptions,
      dialogFormVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // teacherApi.getList().then((response) => {
      //   const resp = response.data;
      //   this.list = resp.data.rows;
      //   console.log(resp);
      teacherApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          console.log(response);
        });
    },
    clickCurrentChange(currentRow) {
      console.log(currentRow);
      this.$emit("option-teacher", currentRow);
    },
    handleEdit(id) {
      this.handleAdd();
      console.log("编辑", id);
      teacherApi.getById(id).then((response) => {
        const resp = response.data;
        console.log(resp);
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teacherApi.update(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData(); // 刷新列表数据
              this.dialogFormVisible = false; // 关闭窗口
              // this.teacher, (_id = null);
              // this.teacher.jobnumber = "";
              // this.teacher.name = "";
              // this.teacher.entrydate = "";
              // this.teacher.phone = "";
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDele(id) {
      console.log("删除");
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认
          teacherApi.deleteById(id).then((response) => {
            const resp = response.data;
            console.log(resp);
            //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message,
            });
            if (resp.flag) {
              // 删除成功，刷新列表
              this.fetchData(); //刷新
            }
          });
        })
        .catch(() => {
          // 取消删除，不理会
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAdd() {
      this.dialogFormVisible = true;
     this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields()
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teacherApi.add(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  filters: {
    roleFilter(type) {
      const obj = roleOptions.find((item) => {
        return item.type === type;
      });
      return obj.name;
    },
  },
};
</script>