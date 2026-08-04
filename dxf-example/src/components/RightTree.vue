<template>
    <div class="root">
        <div class="row">
            <div class="col">
                <q-input
                ref="filter"
                outlined 
                rounded 
                dense
                v-model="filter"
                label="搜索图层"
                >
                <template v-slot:prepend>
                    <q-icon  name="search" />
                </template>
                </q-input>
            </div>
            <div class="col-auto">
                 <q-btn round color="primary" icon="shopping_cart" @click="_toggleExpanded"/>
            </div>
        </div>
        <q-scroll-area class="root">
            <q-tree ref="leftTree" class="mt-20" :filter="filter" :nodes="_treeData" default-expand-all no-selection-unset :selected.sync="selected"
            node-key="displayName" @update:selected="_changeNode" />
        </q-scroll-area>
    </div>

</template>

<script>

export default {
    name: "RightTree",

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
            console.log("val", val);
        }
    },

    data() {
        return {
            selected: null,
            isExpanded: true,
            filter:'',
            _treeData: []
        }
    },
    created() {
        this._treeData = this.treeData
    },

    methods: {
        _changeNode(node) {
            console.log("node", node);
        },
        _toggleExpanded() {
            this.isExpanded = !this.isExpanded
            if (this.isExpanded) {
                this.$refs.leftTree.expandAll()
            } else {
                this.$refs.leftTree.collapseAll()
            }
        }
    }
}

</script>

<style scoped lang="less">
.root {
    height: calc(100% - 50px);
    max-height: 100%;
    width: 300px;
}
</style>
