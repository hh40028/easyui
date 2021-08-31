<template>
    <input type="text" v-model="filterString" :class="{'c-red':filterString}" onclick="select()"
           class="form-control p-r-40" :placeholder="placeholder">
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: '过滤...'
        }
    },
    name: "app",
    data() {
        return {
            filterString: ''
        }
    },
    created: function () {
    },
    methods: {
        load: function () {
            this.$emit('filterLoad', this.filterString);
        }
    },
    watch: {
        filterString: {
            handler() {
                let vm = this;
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    vm.load();
                }, 500);
            }
        }
    },
}
</script>

<style scoped>

</style>
