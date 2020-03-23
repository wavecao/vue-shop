<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入要搜索的内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号码"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)" circle></el-button>
            <el-tooltip effect="dark" content="权限分配" placement="top" :enterable="false">
              <el-button  type="warning" size="mini" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
            <el-button @click="deleteConfirm(scope.row.id)" type="danger" size="mini" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="resetForm">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="resetEditForm">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { request } from '../../network/request'

  export default {
    name: 'Users',
    data () {
      const checkEmail = (rule, value, callback) => {
        const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (emailReg.test(value)) {
          callback()
        }
        callback(new Error('邮箱不正确'))
      }
      const checkMobile = (rule, value, callback) => {
        const mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (mobileReg.test(value)) {
          callback()
        }
        callback(new Error('手机号不正确'))
      }
      return {
        userList: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        total: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        editForm: {
          id: '',
          username: '',
          email: '',
          mobile: ''
        },
        addFormRules: {
          username: [
            {
              required: true,
              message: '请填写用户名',
              trigger: 'blur'
            },
            {
              min: '3',
              max: '10',
              message: '用户名在3-10位之间',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请填写密码',
              trigger: 'blur'
            },
            {
              min: '6',
              max: '12',
              message: '密码在6-12位之间',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请填写邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请填写手机号码',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      getUserList () {
        request({
          url: '/users',
          params: this.queryInfo
        }).then(({ data: res }) => {
          //console.log(res)
          if (res.meta.status == 200) {
            //console.log(res.data.users)
            this.userList = res.data.users
            this.total = res.data.total
          } else {
            this.$message.error('用户列表获取失败')
          }
        })
      },
      handleSizeChange (pageSize) {
        this.queryInfo.pagesize = pageSize
        this.getUserList()
      },
      handleCurrentChange (newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      changeUserState (userInfo) {
        //console.log(userInfo)
        request({
          url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
          method: 'put'
        }).then(({ data: res }) => {
          //console.log(res)
          if (res.meta.status == 200) {
            this.$message('用户状态更新成功')
          } else {
            userInfo.mg_state = !userInfo.mg_state
            this.$message.error('用户状态更新失败')
          }
        })
      },
      resetForm () {
        this.$refs.addFormRef.resetFields()
      },
      addUser () {
        this.$refs.addFormRef.validate((valid) => {
          if (!valid) {
            this.$message('请完成表单')
            return
          }
          console.log(this.addForm)
          request({
            method: 'post',
            url: '/users',
            data: this.addForm
          }).then(({ data: res }) => {
            console.log(res)
            if (res.meta.status == 201) {
              this.$message('添加成功')
              this.addDialogVisible = false
              this.getUserList()
            } else {
              this.$message.error('添加失败')
            }
          })
        })
      },
      showEditDialog(userInfo){
        //console.log(userInfo)
        this.editDialogVisible = true
        this.editForm.id = userInfo.id
        this.editForm.username = userInfo.username
        this.editForm.email = userInfo.email
        this.editForm.mobile = userInfo.mobile
      },
      resetEditForm(){
        this.$refs.editFormRef.resetFields()
      },
      editUser(){
        this.$refs.editFormRef.validate(vaild => {
          if (!vaild) {
            this.$message('请完成修改表单')
            return
          }
          request({
            method: 'put',
            url: `/users/${this.editForm.id}`,
            data: {
              username: this.editForm.username,
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          }).then(({ data: res }) => {
            console.log(res)
            if (res.meta.status == 200) {
              this.$message('修改成功')
              this.editDialogVisible = false
              this.getUserList()
            } else {
              this.$message.error('修改失败')
            }
          })
        })
      },
      deleteConfirm(userId) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            method: 'delete',
            url: `/users/${userId}`
          }).then(({data: res}) => {
            // console.log(res)
            if(res.meta.status == 200){
              this.$message({
              type: 'success',
              message: '删除成功!'
              });
              this.getUserList()
            }else{
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }
  }
</script>

<style scoped>

</style>
