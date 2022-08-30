<script lang="ts">
  import axios, { AxiosError } from "axios";
  import { push } from "svelte-spa-router";
  import { User, user } from "../stores";

  let oldPassword;
  let newPassword;
  let errorMessage;
  let successMessage;

  $: if (oldPassword) {
    errorMessage = null;
  }

  async function changePassword() {
    try {
      const { data } = await axios.post("/api/auth/update-password", {
        oldPassword,
        newPassword,
      });
      oldPassword = "";
      newPassword = "";
      successMessage = "Password was updated correctly";
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response.data.message === "IncorrectPasswordError") {
          oldPassword = "";
          newPassword = "";
          errorMessage = "Wrong all password";
        }
      }
    }
  }
</script>

<div class="container">
  <section>
    <h2 class="title">Change password</h2>
    <hr />
    {#if successMessage}
      <p class="help is-success">{successMessage}</p>
    {/if}
    <form on:submit|preventDefault={changePassword}>
      <div class="field">
        <label for="username" class="label">Old Password</label>
        <div class="control">
          <input
            id="username"
            bind:value={oldPassword}
            type="password"
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
        <label for="password" class="label">New password</label>
        <div class="control">
          <input
            id="password"
            bind:value={newPassword}
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
  </section>
</div>
