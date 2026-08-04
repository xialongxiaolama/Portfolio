<template>
  <div class="viewer-page">
    <q-header class="header row no-wrap shadow-2 fixed-top">
      <div class="col-auto q-ml-lg text-h6" style="line-height: 50px;">
        大树下图纸系统
      </div>
      <q-space></q-space>
      <div class="col-auto row">
        <q-file color="white" label-color="white" filled bottom-slots clearable dense :value="inputFile"
          label="点击选择打开的dxf文件" style="max-width: 300px;" accept=".dxf" class="q-ml-xl" dark @input="_OnFileSelected"
          @clear="_OnFileCleared">
          <template v-slot:before>
            <q-icon name="folder_open" color="white" />
          </template>
        </q-file>
      </div>
      <q-space></q-space>
      <div class="col-auto">
        <q-btn dense :ripple="{ center: true }" size="q-btn-sm" color="red q-mr-sm" style="width: 80px;" no-caps
          label="更新" @click="_updateData" />
        <q-btn dense :ripple="{ center: true }" size="q-btn-sm" color="secondary" style="width: 80px;" no-caps
          label="下载" @click="_openDownload" />
      </div>
      <q-space></q-space>
      <div class="col-auto">
        <q-btn flat color="#fff" no-caps style="width: 120px;text-align: center;" label="admin">
          <q-menu v-model="showMenu" min-width="120px">
            <q-list style="min-width: 120px">
              <q-item clickable v-close-popup @click="editPassword = true">
                <q-item-section>
                  <q-item-label style="text-align: center;">修改密码</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="logOut">
                <q-item-section>
                  <q-item-label style="text-align: center;">退出登录</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-header>
    <q-page style="height: calc(100vh - 50px);">
      <q-splitter v-model="splitterModel" unit="px" class="h-full">

        <template v-slot:before>
          <div class="q-pa-sm h-full">
            <div class="fs-20">图纸列表</div>
            <LeftTree :treeData="treeData" ref="leftTree" />
          </div>
        </template>
        <template v-slot:separator>
          <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
        </template>
        <template v-slot:after>
          <div class="row h-full">
            <div class="col relative-position" style="background-color: #f4f3f3;">
              <DxfViewer ref="viewer" :dxfUrl="dxfUrl" :fonts="fonts" @dxf-loaded="_OnLoaded" @dxf-cleared="_OnCleared"
                @dxf-message="_OnMessage" />
            </div>
            <q-btn @click="drawerRight = !drawerRight"
              :icon="drawerRight ? 'keyboard_arrow_right' : 'keyboard_arrow_left'"></q-btn>
            <q-drawer class="relative-position" side="right" v-model="drawerRight" bordered :breakpoint="700">
              <q-scroll-area class="fit">
                <div class="q-pa-sm h-full">
                  <div class="fs-20">图层列表</div>
                  <LayersList :layers="layers" @toggleLayer="_OnToggleLayer" @toggleAll="_OnToggleAll" />
                </div>
              </q-scroll-area>
            </q-drawer>
          </div>
        </template>
      </q-splitter>
    </q-page>
    <TreeDialog title="下载图纸" :treeData="treeData" ref="treeDialog" @confirm="_downloadFile"></TreeDialog>

    <q-dialog v-model="editPassword" persistent transition-show="slide-down" transition-hide="scale">
      <q-card  style="width: 400px;">
        <q-card-section class="row items-center">
          <div class="text-h6">请输入新密码</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="height: 100px;" class="scroll">
          <q-input outlined v-model="password" dense />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="确定" @click="onConfirm" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import TreeDialog from '@/components/TreeDialog'
import DxfViewer from '@/components/DxfViewer'
import { DxfViewer as _DxfViewer } from 'dxf-viewer'
import MicrosoftYahei from '@/assets/fonts/MicrosoftYahei.ttf'
import LayersList from '@/components/LayersList'
import LeftTree from '@/components/LeftTree'
import RightTree from '@/components/RightTree'
import { createBlobFromBase64 } from '@/utils/tools'
export default {
  name: 'ViewerPage',
  components: { LayersList, DxfViewer, LeftTree, RightTree, TreeDialog },
  props: {
    downloadDialog: false
  },
  data() {
    return {
      layers: null,
      dxfUrl: '',
      splitterModel: 250,
      inputFile: null,
      drawerRight: true,
      editPassword: false,
      password:'',
      showMenu: false,
      isLocalFile: false,
      treeData: [
        {
          label: '全部图纸',
          selectable: false,
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          children: [
            {
              label: '图纸列表',
              icon: 'restaurant_menu',
              selectable: false,
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: '装修图纸',
              icon: 'room_service',
              selectable: false,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: '水电图纸',
              icon: 'photo',
              selectable: false,
              children: [
                {
                  label:
                    'Happy atmosphere (with image)Happy atmosphere (with image)',
                  img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
                },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            },
            {
              label: '定制图纸',
              icon: 'photo',
              selectable: false
            }
          ]
        }
      ]
    }
  },
  created() {
    this.fonts = [MicrosoftYahei]
    window.app = this
    !window.sketchup && this.su_setTreeData(this.treeData)
  },
  mounted() {
    // this.splitterModel = this.$refs.leftTree.$el.offsetWidth + 32
  },
  methods: {
    onConfirm(){
      const formData = new URLSearchParams();
      formData.append("new_pass", this.password);
      fetch('/dxf/index/mod_pass.html', {
          method: 'POST',
          body:formData, // 发送JSON数据
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      }).then(response => {
        // ⚠️ 先检查响应状态，再调用 .json()
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // 只调用一次 .json()
      })
      .then(data => {
        console.log(data); // 正确获取数据
         this.$q.notify({
          type: 'info',
          message: data.msg
        })
      })
    },
    logOut() {
      location.href = '/dxf/index/logout.html'
    },
    su_setTreeData(treeData) {
      this._dataConversion(treeData)
      this.treeData = treeData
      console.log('this.treeData', this.treeData)
    },
    su_setDxfData(base64) {
      const blob = createBlobFromBase64(base64)
      this._OnFileSelected(blob)
    },
    _downloadFile(nodes) {
      window.sketchup?.downloadFile(nodes)
    },
    _changeNode(node) {
      window.sketchup?.changeNode(node)
    },
    _dataConversion(nodes, level = 0, label) {
      if (!nodes) return
      // 判断当前层是否是数组
      if (Array.isArray(nodes)) {
        nodes.forEach((node) => {
          if (!label) {
            node._label = node.label
          } else {
            node._label = label + '_' + node.label
          }
          this._dataConversion(node, level, node._label)
        }) // 遍历数组中的每个节点
      } else {
        // 处理单个节点
        if (nodes.children?.length > 0) {
          nodes.selectable = false
          nodes.icon = 'folder'
          level++
          this._dataConversion(nodes.children, level, nodes._label) // 递归子节点（传入数组）
        } else {
          nodes.selectable = true
          nodes.icon = 'text_snippet'
          if (level === 1) {
            nodes.selectable = false
            nodes.icon = 'folder'
          }
          if (!label) {
            nodes._label = nodes.label
          } else {
            nodes._label = label + '_' + nodes.label
          }
        }
      }
    },
    _updateData() {
      window.sketchup?.updateTree()
    },
    _openDownload() {
      this.$refs.treeDialog.show()
    },
    _OnLoaded() {
      const layers = this.$refs.viewer.GetViewer().GetLayers(true)
      layers.forEach((lyr) => this.$set(lyr, 'isVisible', true))
      this.layers = layers
    },

    _OnCleared() {
      this.layers = null
    },
    async _OnFileSelected(file) {
      if (!file) {
        this._OnFileCleared()
        return
      }
      if (this.dxfUrl && this.isLocalFile) {
        URL.revokeObjectURL(this.dxfUrl)
      }
      this.isLocalFile = true
      this.inputFile = file

      this.dxfUrl = URL.createObjectURL(file)
    },

    _OnFileCleared() {
      if (this.inputFile) {
        this.inputFile = null
        URL.revokeObjectURL(this.dxfUrl)
        this.dxfUrl = null
        this.$q.notify({
          type: 'info',
          message: '清除图纸文件!'
        })
      }
    },

    _OnToggleLayer(layer, newState) {
      layer.isVisible = newState
      this.$refs.viewer.GetViewer().ShowLayer(layer.name, newState)
    },

    _OnToggleAll(newState) {
      if (this.layers) {
        for (const layer of this.layers) {
          if (layer.isVisible !== newState) {
            this._OnToggleLayer(layer, newState)
          }
        }
      }
    },

    _OnMessage(e) {
      let type = 'info'
      switch (e.detail.level) {
        case _DxfViewer.MessageLevel.WARN:
          type = 'warning'
          break
        case _DxfViewer.MessageLevel.ERROR:
          type = 'negative'
          break
      }
      this.$q.notify({ type, message: e.detail.message })
    }
  },
  destroyed() {
    if (this.dxfUrl) {
      URL.revokeObjectURL(this.dxfUrl)
    }
  }
}
</script>
<style>
.viewer-page .q-btn__wrapper {
  padding: 4px;
}
</style>
<style scoped lang="less">
.viewer-page {
  .header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #fff;
    z-index: 99;
    background: #03a9f4;
  }


  .layersCol {
    border-left: #dbdbdb solid 1px;
  }

  .icon-draw {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, -50%);
  }
}
</style>
