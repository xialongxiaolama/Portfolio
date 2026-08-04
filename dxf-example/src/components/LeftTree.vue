<template>
    <div class="left-tree">
        <div class="row aligns-center">
            <div class="col q-mr-sm">
                <q-select outlined v-model="selectType" size="sm" :options="options" :dense="true" :options-dense="denseOpts">
                </q-select>
            </div>
            <div class="col-auto row items-center">
                <q-btn size="sm" round color="primary" icon="format_line_spacing" @click="_toggleExpanded" />
            </div>
        </div>
        <q-scroll-area style="height: calc(100% - 35px);">
            <q-tree ref="leftTree" class="mt-20" :nodes="_treeData" default-expand-all no-selection-unset
                :expanded.sync="expandedKeys"
                :selected.sync="selected" :filter="selectType" :filter-method="_myFilterMethod" node-key="label"
                @update:selected="_changeNode" />
        </q-scroll-area>
    </div>

</template>

<script>

export default {
    name: "LeftTree",

    props: {
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

    watch: {
        treeData(val) {
            console.log("接收到的树状图数据", val);
        }
    },

    data() {
        return {
            selected: null,
            expandedKeys:[],
            isExpanded: true,
            selectType: '全部图纸',
            options: [
                '全部图纸', '图纸列表', '装修列表', '水电图纸', '定制图纸'
            ],
            dense: false,
            denseOpts: false,
            _treeData: []
        }
    },
    created() {
        this._treeData = this.treeData
    },

    methods: {
        _changeNode(node) {
            this.$emit("changeNode", node)
        },
        _toggleExpanded() {
            this.isExpanded = !this.isExpanded
            if (this.isExpanded) {
                this.$refs.leftTree.expandAll()
            } else {
                this.$refs.leftTree.collapseAll()
            }
            this.$emit("toggleExpanded", this.isExpanded)
        },
        _ToggleLayer(layer, newState) {
            this.$emit("toggleLayer", layer, newState)
            this.showAll = null
        },

        _ToggleAll(newState) {
            this.showAll = newState
            this.$emit("toggleAll", newState)
        },
        _myFilterMethod(node, filter){
            return node._label.indexOf(filter) > -1
        }
    }
}

</script>

<style scoped lang="less">
.left-tree {
    height: calc(100% - 30px);
}
</style>
