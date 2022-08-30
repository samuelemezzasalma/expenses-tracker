<script lang="ts">
  import axios, { AxiosError } from "axios";
  import { push } from "svelte-spa-router";
  import { User, user } from "../stores";

  let username;
  let password;
  let errorMessage;

  $: if (username || password) {
    errorMessage = null;
  }

  async function login() {
    try {
      const { data } = await axios.post("/api/auth/login", {
        username,
        password,
      });
      $user = data.user;
      push("/dashboard");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response.status === 401) {
          username = "";
          password = "";
          errorMessage = "Invalid credentials";
        }
      }
    }
  }
</script>

<div class="container">
  <section>
    <h1 class="title">Login</h1>
    <hr />
    {#if errorMessage}
      <p class="help is-danger">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={login}>
      <div class="field">
        <label for="username" class="label">Username</label>
        <div class="control">
          <input
            id="username"
            bind:value={username}
            type="text"
            class="input"
            class:is-danger={errorMessage}
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="password" class="label">Password</label>
        <div class="control">
          <input
            id="password"
            bind:value={password}
            type="password"
            class="input"
            class:is-danger={errorMessage}
            required
          />
        </div>
      </div>
      <div class="control">
        <input type="submit" class="button is-info is-light" value="Submit" />
      </div>
    </form>
    <hr>
    <p>
      Do not have an account?
      <a href="#/signup">Sign Up</a>
    </p>
  </section>
</div>
