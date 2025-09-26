<template>
  <v-alert
    v-if="message"
    :type="type"
    variant="tonal"
    class="mt-4"
    closable
    @click:close="clear"
  >
    {{ message }}
  </v-alert>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success",
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(["cleared"]);
const visible = ref(true);

watch(
  () => props.message,
  (newVal) => {
    if (newVal) {
      visible.value = true;
      setTimeout(() => clear(), props.duration);
    }
  }
);

function clear() {
  visible.value = false;
  emit("cleared");
}
</script>
