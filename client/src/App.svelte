<script lang="ts">
	import { transactions, sortedTransactions, balance, income, expenses, addTrans, fetchTransactions, deleteTransaction } from "./stores";
	import axios from "axios";
	import { onMount } from "svelte";
	import Loading from "./components/Loading.svelte";
	import SummaryCard from "./components/SummaryCard.svelte";
	import Transaction from "./components/Transaction.svelte";

	let input = 0;
	let typeOfTRansaction = "+";
	let loading = false;

	$: disabled = !input;

	onMount(async () => {
		loading = true;
		const isFinished = fetchTransactions()
		loading = !isFinished;
	});

	async function addTransaction() {
		const transaction = {
			date: new Date().getTime(),
			value: typeOfTRansaction === "+" ? input : input * -1,
		};
		
		if (addTrans(transaction)) {
			input = 0;
		}
	}

</script>

<div class="app container">
	<div class="field has-addons">
		<p class="control">
			<span class="select">
				<select bind:value={typeOfTRansaction}>
					<option value="+">+</option>
					<option value="-">-</option>
				</select>
			</span>
		</p>
		<p class="control">
			<input
				class="input"
				type="number"
				min="0"
				bind:value={input}
				placeholder="Amount of money"
			/>
		</p>
		<p class="control">
			<button on:click={addTransaction} class="button" {disabled}>
				Save
			</button>
		</p>
	</div>

	<hr />

	{#if loading}
		<Loading />
	{/if}

	{#if $transactions.length > 0}
		<SummaryCard value={$balance} mode="balance" />

		<div class="columns">
			<div class="column">
				<SummaryCard value={$income} mode="income" />
			</div>
			<div class="column">
				<SummaryCard value={$expenses} mode="expenses" />
			</div>
		</div>
	{:else if !loading}
		<div class="notification">Add your firt transaction</div>
	{/if}

	<hr />
	{#each $sortedTransactions as transaction (transaction._id)}
		<Transaction {transaction} {deleteTransaction} />
	{/each}
</div>

<style>
	.app.container {
		margin: 40px auto;
		max-width: 500px;
	}
</style>
