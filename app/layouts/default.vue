<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="container nav-content">
        <NuxtLink to="/" class="logo">
          <h1>SignLent</h1>
        </NuxtLink>
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/app" class="nav-link btn btn-primary">Launch App</NuxtLink>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <slot />
    </main>
    
    <footer class="footer">
      <div class="container text-center">
        <p>&copy; 2025 SignLent. Bridging communication through technology.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: var(--color-slate);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: var(--color-cream);
}

.logo h1 {
  font-size: 1.75rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: var(--color-cream);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:not(.btn):hover {
  color: var(--color-white);
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background-color: var(--color-slate);
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer p {
  color: var(--color-slate-light);
}
</style>
