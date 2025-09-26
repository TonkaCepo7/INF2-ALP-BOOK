<template>
  <v-card>
    <v-card-title>{{ author ? "Edit Author" : "Add Author" }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="save">
        <v-text-field v-model="form.name" label="Name" required></v-text-field>
        <v-textarea v-model="form.bio" label="Bio"></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary">Save</v-btn>
          <v-btn text @click="$emit('close')">Cancel</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { addAuthor, updateAuthor } from "@/services/api";

const props = defineProps({
  author: Object,
});

const emit = defineEmits(["saved", "close"]);

const form = ref({ name: "", bio: "" });

watch(
  () => props.author,
  (newVal) => {
    form.value = newVal ? { ...newVal } : { name: "", bio: "" };
  },
  { immediate: true }
);

const save = async () => {
  try {
    const token = localStorage.getItem("token");
    if (props.author) {
      await updateAuthor(props.author.id, form.value, token);
    } else {
      await addAuthor(form.value, token);
    }
    emit("saved");
    emit("close");
  } catch (err) {
    alert(err.response?.data?.error || "Error saving author");
  }
};
</script>
