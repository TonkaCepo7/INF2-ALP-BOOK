<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center align-center" style="height: 100vh">
        <v-card width="400" class="pa-6">
          <v-card-title class="text-h6 text-center">🔐 Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Username"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>

              <v-btn type="submit" color="primary" block>Login</v-btn>
            </v-form>
          </v-card-text>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
          >
            {{ error }}
          </v-alert>

          <v-alert
            v-if="success"
            type="success"
            variant="tonal"
            class="mt-4"
          >
            {{ success }}
          </v-alert>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";

const router = useRouter();

const username = ref("");
const password = ref("");
const error = ref("");
const success = ref("");

const handleLogin = async () => {
  error.value = "";
  success.value = "";
  try {
    const res = await login({ username: username.value, password: password.value });

    const token = res.data.token;
    const role = res.data.role; 

    // Spremi token i rolu u localStorage
    localStorage.setItem("token", token);
    if (role) {
      localStorage.setItem("role", role);
    }

    success.value = "Login successful!";
    setTimeout(() => {
      router.push("/authors"); // preusmjeri na Authors stranicu
    }, 1000);
  } catch (err) {
    error.value = err.response?.data?.error || "Login failed";
  }
};
</script>
