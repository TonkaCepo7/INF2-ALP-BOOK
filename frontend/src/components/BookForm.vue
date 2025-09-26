<template>
  <v-card>
    <v-card-title>{{ book ? "Edit Book" : "Add Book" }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="save">
        <v-text-field v-model="form.title" label="Title" required></v-text-field>

        <v-select
          v-model="form.author_id"
          :items="authors"
          item-title="name"
          item-value="id"
          label="Author"
          required
        ></v-select>

        <v-text-field
          v-model="form.published_year"
          label="Published Year"
          type="number"
        ></v-text-field>

        <v-text-field
          v-model="form.category"
          label="Category"
        ></v-text-field>

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
import { addBook, updateBook } from "@/services/api";

const props = defineProps({
  book: Object,
  authors: Array,
});

const emit = defineEmits(["saved", "close"]);

const form = ref({
  title: "",
  author_id: null,
  published_year: "",
  category: "",
});

watch(
  () => props.book,
  (newVal) => {
    form.value = newVal
      ? { ...newVal }
      : { title: "", author_id: null, published_year: "", category: "" };
  },
  { immediate: true }
);

const save = async () => {
  try {
    const token = localStorage.getItem("token");
    if (props.book) {
      await updateBook(props.book.id, form.value, token);
    } else {
      await addBook(form.value, token);
    }
    emit("saved");
    emit("close");
  } catch (err) {
    alert(err.response?.data?.error || "Error saving book");
  }
};
</script>
