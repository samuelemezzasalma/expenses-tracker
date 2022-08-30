<script lang="ts">
  import axios from "axios";
  import { push } from "svelte-spa-router";
  import { transactions, user } from "../stores";

  let isActive = false;

  async function logout() {
    await axios.post("/api/auth/logout");
    $user = null;
    $transactions = [];
    push("/");
  }
</script>

<nav class="navbar is-info">
  <div class="container">
    <div class="navbar-brand">
      <a href="#/" class="navbar-item title">
        <span class="title">💸</span>
      </a>
      <span
        class="navbar-burger burger"
        class:is-active={isActive}
        on:click={() => (isActive = !isActive)}
      >
        <span aria-expanded="false" aria-label="menu" aria-hidden="true" />
        <span aria-expanded="false" aria-label="menu" aria-hidden="true" />
        <span aria-expanded="false" aria-label="menu" aria-hidden="true" />
      </span>
    </div>
    <div class="navbar-menu" class:is-active={isActive}>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            {#if $user}
              <a class="button is-primary is-light" href="#/profile"
                >👤 {$user.username}</a
              >
              <button class="button" on:click={logout}>Logout</button>
            {:else}
              <a class="button" href="#/login">Login</a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
