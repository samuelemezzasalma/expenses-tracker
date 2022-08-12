<script lang="ts">
  export let value = 0;
  export let mode = "balance";
  $: label = mode.toUpperCase();
  $: cssClass = getCssClass(mode)

  function getCssClass(mode: string) {
    switch (mode) {
      case "balance":
        return "is-info";
      case "income":
        return "is-success";
      case "expenses":
        return "is-danger";
      default:
        break;
    }
  }
</script>

<div class="notification is-light {cssClass} has-text-centered">
  {label}: <strong>{value}</strong>
</div>
