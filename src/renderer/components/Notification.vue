<script setup lang="ts">
import { Notivue, Notification } from "notivue";
import UpdateNotification from "./UpdateNotification.vue";
</script>

<template>
  <Notivue v-slot="item">
    <UpdateNotification
      v-if="item.props.isUpdateDownloaded"
      :item="item"
    ></UpdateNotification>
    <Notification v-else :item="item" />
  </Notivue>
</template>
