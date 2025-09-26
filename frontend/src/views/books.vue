<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-center my-6">📚 Books</h1>

        <v-row class="mb-4">
          <!-- Search po naslovu -->
          <v-col cols="6">
            <v-text-field
              v-model="search"
              label="Search books by title"
              clearable
            ></v-text-field>
          </v-col>

          <!-- Filter po kategoriji -->
          <v-col cols="4">
            <v-select
              v-model="selectedCategory"
              :items="categories"
              label="Filter by category"
              clearable
            ></v-select>
          </v-col>

          <!-- Dodavanje knjige samo za admina -->
          <v-col cols="2" class="d-flex justify-end align-center" v-if="isAdmin">
            <v-btn class="glass-btn" @click="openForm()">Add Book</v-btn>
          </v-col>
        </v-row>

        <!-- Tabela knjiga -->
        <v-data-table
          :headers="headers"
          :items="filteredBooks"
          :items-per-page="5"
          class="glass-card"
        >
          <template v-slot:item.actions="{ item }">
            <div v-if="isAdmin">
              <v-btn class="glass-btn me-2" @click="openForm(item)">EDIT</v-btn>
              <v-btn class="glass-btn" @click="removeBook(item.id)">DELETE</v-btn>
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>

        <!-- Forma -->
        <v-dialog v-model="dialog" max-width="600">
          <BookForm
            :book="selectedBook"
            :authors="authors"
            @saved="fetchBooks"
            @close="dialog = false"
          />
        </v-dialog>

        <!-- Poruke -->
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
import { getBooks, deleteBook, getAuthors } from "@/services/api";
import BookForm from "@/components/BookForm.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import Swal from "sweetalert2";

const books = ref([]);
const authors = ref([]);
const search = ref("");
const selectedCategory = ref("");
const categories = ref([]);

const success = ref("");
const error = ref("");
const dialog = ref(false);
const selectedBook = ref(null);


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
  { title: "Title", key: "title" },
  { title: "Author", key: "author_id" },
  { title: "Year", key: "published_year" },
  { title: "Category", key: "category" },
  { title: "Actions", key: "actions", sortable: false },
];

const fetchBooks = async () => {
  try {
    const res = await getBooks();
    books.value = res.data;

    // Popuni kategorije
    categories.value = [
      ...new Set(res.data.map((book) => book.category).filter(Boolean)),
    ];
  } catch (err) {
    error.value = "Failed to fetch books";
  }
};

const fetchAuthors = async () => {
  try {
    const res = await getAuthors();
    authors.value = res.data;
  } catch (err) {
    error.value = "Failed to fetch authors";
  }
};

const filteredBooks = computed(() => {
  return books.value.filter((b) => {
    const matchesTitle = b.title
      .toLowerCase()
      .includes(search.value.toLowerCase());
    const matchesCategory = selectedCategory.value
      ? b.category === selectedCategory.value
      : true;
    return matchesTitle && matchesCategory;
  });
});

const openForm = (book = null) => {
  selectedBook.value = book;
  dialog.value = true;
};

const removeBook = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This book will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("token");
      await deleteBook(id, token);
      success.value = "Book deleted successfully";
      fetchBooks();
      Swal.fire("Deleted!", "Book has been removed.", "success");
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete book";
    }
  }
};

onMounted(() => {
  fetchBooks();
  fetchAuthors();
});
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


<style>
.v-select .v-field__input {
  color: orange !important;
  font-weight: bold;
}
.v-list-item-title {
  color: orange !important;
  font-weight: bold;
}
</style>
