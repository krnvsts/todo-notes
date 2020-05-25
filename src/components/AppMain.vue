<template>
  <router-view />
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AppMain",
  created() {
    this.ADD_DEFAULT();
  },
  methods: {
    ...mapActions(["ADD_DEFAULT"])
  }
};
</script>
