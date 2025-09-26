<template>
  <v-app>
    <v-main>
      <div class="landing-background">
        <!-- centriranje forme u sredinu ekrana -->
        <v-container class="d-flex align-center justify-center fill-height">
          <v-card class="glass-card pa-8 text-center" max-width="600">
            <h1 class="mb-4">📖 Welcome to Book Manager</h1>
            <p>
              Manage your <strong>books</strong> and <strong>authors</strong> with ease.<br />
              Explore CRUD operations, authentication, and a sleek UI design.
            </p>
            <v-btn to="/authors" class="glass-btn mt-4">Get Started</v-btn>
          </v-card>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.landing-background {
  background-image: url("@/assets/kjniznica.jpeg"); /* tvoja slika */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
}


.glass-card {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  color: white !important;
  transition: none !important;
}

/* Dugme */
.glass-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white !important;
  text-transform: uppercase;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 8px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.05);
}
</style>
