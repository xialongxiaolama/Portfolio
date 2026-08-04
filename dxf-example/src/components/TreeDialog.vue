<template>
  <q-dialog v-model="visible" persistent transition-show="scale" transition-hide="scale" @hide="onHide"
    :auto-close="false" style="width: max-content;">
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 40vh;"  class="scroll">
        <!-- 可自定义插槽内容 -->
        <q-tree :nodes="_treeData" default-expand-all tick-strategy="leaf-filtered" :ticked.sync="ticked"
          node-key="label" />
      </q-card-section>
      <q-separator />
      <q-card-section >
         <div class="q-gutter-sm row align-center">
            <span style="line-height: 40px;">下载格式：</span>
            <q-checkbox v-model="downloadType" val="dxf" label="dxf" color="teal" />
            <q-checkbox v-model="downloadType" val="pdf" label="pdf" color="teal" />
            <q-checkbox v-model="downloadType" val="png" label="png" color="teal" />
          </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat label="取消" color="primary" @click="onCancel" v-close-popup />
        <q-btn flat label="下载" color="primary" @click="onConfirm" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'TreeDialog',
  props: {
    title: String,
    treeData: {
      /* Expecting array of {name: string, color: number, isVisible: boolean} */
      type: Array,
      default: () => []
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      downloadType:['dxf'],
      ticked: []
    }
  },
  created() {
    this._treeData = this.treeData
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    onConfirm() {
      this.$emit('confirm',this.ticked)
      this.hide()
    },
    onCancel() {
      this.$emit('cancel')
      this.ticked = []
      this.downloadType = ['dxf']
      this.hide()
    },
    onHide() {
      this.$emit('hide')
    }
  }
}
</script>