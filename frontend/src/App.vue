<template>
  <v-app>
    <!-- Navigacija -->
    <v-app-bar app flat class="glass-nav">
      <v-toolbar-title>📚 Book Manager</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/authors" text>Authors</v-btn>
      <v-btn to="/books" text>Books</v-btn>

      <!-- Login/Logout -->
      <v-btn v-if="!isLoggedIn" to="/login" text>Login</v-btn>
      <v-btn v-else text @click="handleLogout">Logout</v-btn>
    </v-app-bar>

    <!-- Router ubacuje trenutnu stranicu -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app padless class="glass-nav">
      <v-col class="text-center">© 2025 Book Manager</v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();


const isLoggedIn = computed(() => !!localStorage.getItem("token"));


const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style>
body, .v-application, .v-main {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffcc80, #ff9800, #fb8c00);
  background-attachment: fixed;
  font-family: "Roboto", sans-serif;
  color: white;
}

* {
  color: white !important;
}

.glass-nav {
  background: rgba(40, 40, 40, 0.12) !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.v-card {
  background: rgba(40, 40, 40, 0.1) !important;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
</style>
