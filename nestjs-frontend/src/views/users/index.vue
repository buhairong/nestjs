<template>
  <div>
    <div class="mb-3">
      <button type="button" class="btn btn-primary px-3" @click="openModal('add')">
        <i class="fas fa-plus"></i>新增
      </button>
    </div>
    <table class="table table-bordered table-hover table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">用户名</th>
          <th scope="col">角色</th>
          <th scope="col">性别</th>
          <th scope="col">头像</th>
          <th scope="col">地址</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lists" :key="item.id">
          <th scope="row">1</th>
          <td>{{item.username}}</td>
          <td>{{item.roles.map(o=>o.name).join(',')}}</td>
          <td>{{item.profile && item.profile.gender}}</td>
          <td>{{item.profile && item.profile.photo}}</td>
          <td>{{item.profile && item.profile.address}}</td>
          <td>
            <button type="button" class="btn btn-secondary px-3" @click="openModal('edit', item)">
              <i class="far fa-edit me-2"></i>编辑</button>
            <button type="button" class="btn btn-danger px-3 ms-3" @click="openModal('delete', item)">
              <i class="far fa-trash-alt me-2"></i>删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav>

    <!-- Edit/Add Model -->
    <div class="modal fade" id="EditAndAddModal" tabindex="-1" aria-labelledby="EditAndAddModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="EditAndAddModalLabel">{{msg}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- username input -->
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">用户名</label>
              <input type="username" class="form-control" id="exampleFormControlInput1" placeholder="请输入用户名">
            </div>
            <!-- role checkbox -->
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">角色</label>
              <div class="form-control border-0">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                  <label class="form-check-label" for="flexCheckDefault">
                    普通用户
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                  <label class="form-check-label" for="flexCheckChecked">
                    管理员
                  </label>
                </div>
              </div>
            </div>
            <!-- gender radio -->
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">性别</label>
              <div class="form-control border-0">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked>
                  <label class="form-check-label" for="flexRadioDefault1">
                    男
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                  <label class="form-check-label" for="flexRadioDefault2">
                    女
                  </label>
                </div>
              </div>
            </div>

            <!-- avatar input/upload button -->
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">用户头像</label>
              <input type="username" class="form-control" id="exampleFormControlInput1" placeholder="请粘贴头像路径">
            </div>
            <!-- address input -->
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">地址</label>
              <input type="username" class="form-control" id="exampleFormControlInput1" placeholder="请输入地址">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal fade" id="DeleteModal" tabindex="-1" aria-labelledby="DeleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="DeleteModalLabel">删除</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            确定删除该记录吗？
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from '@/utils/axios'
import * as bootstrap from 'bootstrap'

interface Profile {
  gender: number;
  address: string;
  photo: string;
}

interface RoleItem {
  id: number;
  name: string;
}

interface UserItem {
  id: number;
  username: string;
  password?: string;
  profile: Profile;
  roles: RoleItem[];
}

const lists = ref<UserItem[]>([])
async function getUsers() {
  const res = await axios.get<UserItem[], UserItem[]>('/user')
  if (res && res.length > 0) {
    lists.value = res
  }
}
getUsers()

const deleteModal = ref()
const editAndAddModel = ref()
const msg = ref("新增")

deleteModal.value = new bootstrap.Modal(
  document.getElementById("DeleteModal")!,
  { backdrop: true }
)

editAndAddModel.value = new bootstrap.Modal(
  document.getElementById("EditAndAddModal")!,
  { backdrop: true }
)

const openModal = (type: string, item?: UserItem) => {
  console.log(item)
  if (type === "delete") {
    deleteModal.value.show()
  } else if (type === "edit") {
    msg.value = "编辑"
    editAndAddModel.value.show()
  } else if (type === "add") {
    msg.value = "新增"
    editAndAddModel.value.show()
  }
}
</script>

<style scoped>
</style>