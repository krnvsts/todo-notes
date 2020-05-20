<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "MainWrapper",
  created() {
    this.ADD_DEFAULT();
  },
  methods: {
    ...mapActions(["ADD_DEFAULT"])
  }
};
</script>
