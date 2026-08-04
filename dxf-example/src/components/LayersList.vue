<template>
    <q-scroll-area class="right-layer">
        <div class="col">
            <q-input
            outlined 
            rounded 
            size="sm"
            dense
            v-model="filterStr"
            label="搜索图层"
            >
            <template v-slot:prepend>
                <q-icon name="search" class="text-primary" />
            </template>
            </q-input>
        </div>
        <q-list dense>
            <q-item v-if="layers !== null" tag="label">
                <q-item-section side top>
                    <q-checkbox :value="showAll" @input="_ToggleAll" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-italic">所有图层</q-item-label>
                </q-item-section>
            </q-item>
            <q-item v-if="layers !== null" v-for="layer in ShowLayers" :key="layer.name" tag="label">
                <q-item-section side class="q-pa-none">
                    <q-icon name="label" :style="{ color: _GetCssColor(layer.color) }" />
                </q-item-section>
                <q-item-section side top>
                    <q-checkbox :value="layer.isVisible" @input="e => _ToggleLayer(layer, e)" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ layer.displayName }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-scroll-area>

</template>

<script>

export default {
    name: "LayersList",

    props: {
        layers: {
            /* Expecting array of {name: string, color: number, isVisible: boolean} */
            type: Array,
            default: null
        }
    },

    watch: {
        layers() {
            this.showAll = null
            if (this.layers) {
                this.ShowLayers = this.layers.filter(item=>{
                    console.log(item,this.filterStr,item.displayName.indexOf(this.filterStr));

                    return item.displayName.indexOf(this.filterStr)>-1 || this.filterStr === ''
                })
            }else {
                this.ShowLayers = []
            }
        },
        filterStr(val){
            if (this.layers) {
                this.ShowLayers = this.layers.filter(item=>{
                    console.log(item,val,item.displayName.indexOf(val));
                    return item.displayName.indexOf(val)>-1 || val === ''
                })
            }else {
                this.ShowLayers = []
            }
        }
    },

    data() {
        return {
            ShowLayers:[],
            showAll: null,
            filterStr:''
        }
    },

    methods: {
        _ToggleLayer(layer, newState) {
            this.$emit("toggleLayer", layer, newState)
            this.showAll = null
        },

        _ToggleAll(newState) {
            this.showAll = newState
            this.$emit("toggleAll", newState)
        },

        _GetCssColor(value) {
            let s = value.toString(16)
            while (s.length < 6) {
                s = "0" + s
            }
            return "#" + s
        }
    }
}

</script>

<style scoped lang="less">
.right-layer{
    height: calc(100vh - 100px);
}
</style>
