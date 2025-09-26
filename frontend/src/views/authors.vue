<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-center my-6">📖 Authors</h1>

        <!-- Search i Add button -->
        <v-row class="mb-4">
          <v-col cols="8">
            <v-text-field
              v-model="search"
              label="Search authors"
              clearable
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="4" class="d-flex justify-end align-center" v-if="isAdmin">
            <v-btn class="glass-btn" @click="openForm()">Add Author</v-btn>
          </v-col>
        </v-row>

        <!-- Authors table -->
        <v-data-table
          :headers="headers"
          :items="filteredAuthors"
          :items-per-page="5"
          class="glass-card"
        >
          <template v-slot:item.actions="{ item }">
            <div v-if="isAdmin">
              <v-btn class="glass-btn me-2" @click="openForm(item)">EDIT</v-btn>
              <v-btn class="glass-btn" @click="removeAuthor(item.id)">DELETE</v-btn>
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>

        <!-- Author form (dialog) -->
        <v-dialog v-model="dialog" max-width="500">
          <AuthorForm
            class="glass-card"
            :author="selectedAuthor"
            @saved="fetchAuthors"
            @close="dialog = false"
          />
        </v-dialog>

        <!-- Alerts -->
        <AlertMessage
          :message="success"
          type="success"
          @cleared="success = ''"
        />
        <AlertMessage
          :message="error"
          type="error"
          @cleared="error = ''"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAuthors, deleteAuthor } from "../services/api";
import AuthorForm from "@/components/AuthorForm.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import Swal from "sweetalert2";


const authors = ref([]);
const search = ref("");
const success = ref("");
const error = ref("");
const dialog = ref(false);
const selectedAuthor = ref(null);


const token = localStorage.getItem("token");
let user = null;
if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    user = payload;
  } catch (e) {
    console.error("Invalid token");
  }
}
const isAdmin = user?.role === "admin";

const headers = [
  { title: "ID", key: "id" },
  { title: "Name", key: "name" },
  { title: "Bio", key: "bio" },
  { title: "Actions", key: "actions", sortable: false },
];


const fetchAuthors = async () => {
  try {
    const res = await getAuthors();
    authors.value = res.data;
  } catch (err) {
    error.value = "Failed to fetch authors";
  }
};

const filteredAuthors = computed(() => {
  return authors.value.filter((a) =>
    a.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const openForm = (author = null) => {
  selectedAuthor.value = author;
  dialog.value = true;
};


const removeAuthor = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This author will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("token");
      await deleteAuthor(id, token);
      success.value = "Author deleted successfully";
      fetchAuthors();
      Swal.fire("Deleted!", "Author has been removed.", "success");
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete author";
    }
  }
};

onMounted(fetchAuthors);
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  color: white !important;
  padding: 10px;
}


.glass-btn {
  background: rgba(255, 165, 0, 0.25) !important;
  border: 1px solid rgba(255, 165, 0, 0.4);
  color: white !important;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 8px;
  padding: 6px 16px;
  transition: all 0.2s ease;
}

.glass-btn:hover {
  background: rgba(255, 165, 0, 0.35) !important;
  transform: scale(1.05);
}
</style>
