<script lang="ts">
  import axios, { AxiosError } from "axios";
  import { push } from "svelte-spa-router";
  import { User, user } from "../stores";

  let username;
  let password;
  let errorMessage;

  $: if (username) {
    errorMessage = null
  }

  async function signup() {
    try {
      const { data } = await axios.post("/api/auth/sign-up", {
        username,
        password,
      });
      $user = data.user;
      push("/dashboard");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response.data.message === "UserExistsError") {
          username = "";
          password = "";
          errorMessage = "Username is already taken";
        }
      }
    }
  }
</script>

<div class="container">
  <section>
    <h1 class="title">Sign up</h1>
    <hr />
    <form on:submit|preventDefault="{signup}">
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
          {#if errorMessage}
            <p class="help is-danger">{errorMessage}</p>
          {/if}
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
      Do you have an account?
      <a href="#/signup">Log in here</a>
    </p>
  </section>
</div>
