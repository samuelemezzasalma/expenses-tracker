<script>
	import axios from "axios";

	import { onMount } from "svelte";

	import Router, { push } from "svelte-spa-router";
	import { wrap } from "svelte-spa-router/wrap";
	import Loading from "./components/Loading.svelte";
	import Navbar from "./components/Navbar.svelte";
	import Dashboard from "./pages/Dashboard.svelte";
	import Home from "./pages/Home.svelte";
	import Login from "./pages/Login.svelte";
import Profile from "./pages/Profile.svelte";
	import Signup from "./pages/Signup.svelte";
	import { user } from "./stores";

	let loading = true;
	onMount(async () => {
		const { data } = await axios.get("api/auth/user");
		const $user = data.user;
		loading = false;
	});

	const routes = {
		// "/": wrap(Home, { reason: "authenticated" }, () => !$user),
		"/": wrap({
			component: Home,
			userData: { reason: "authenticated" },
			conditions: () => !$user,
		}),
		"/dashboard": wrap({
			component: Dashboard,
			userData: { reason: "unauthenticated" },
			conditions: () => $user,
		}),
		"/signup": wrap({
			component: Signup,
			userData: { reason: "authenticated" },
			conditions: () => !$user,
		}),
		"/login": wrap({
			component: Login,
			userData: { reason: "authenticated" },
			conditions: () => !$user,
		}),
		"/profile": wrap({
			component: Profile,
			userData: { reason: "unauthenticated" },
			conditions: () => $user,
		}),
	};

	function conditionsFailed(event) {
		const { reason } = event.detail.userData;
		switch (reason) {
			case "unauthenticated":
				return push("/login");
			case "authenticated":
				return push("/dashboard");
		}
	}
</script>

{#if loading}
	<div class="loading-container">
		<Loading />
	</div>
{:else}
	<Navbar />
	<Router {routes} on:conditionsFailed={conditionsFailed} />
{/if}

<style>
	.loading-container {
		max-width: 500px;
		display: flex;
		min-height: 100vh;
		align-content: center;
		margin: auto;
	}
</style>
