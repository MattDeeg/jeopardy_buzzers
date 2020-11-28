<script>
  import Podiums from "../shared/Podiums.svelte";
  import BuzzIndicator from "./BuzzIndicator.svelte";
  import Category from "./Category.svelte";
  import LogIn from "./LogIn.svelte";
  import {
    init,
    currentCategory,
    selectedClue,
    username,
    setUsername,
    buzz,
  } from "./service";

  let allowBuzz = false;
  selectedClue.subscribe((value) => {
    allowBuzz = Boolean(value && value.allowBuzz);
  });

  const buzzIn = () => {
    if (allowBuzz) {
      buzz();
    }
  };

  init();
</script>

<style>
  :global(body) {
    background: #00003a;
  }
  .board {
    user-select: none;
    display: grid;
    grid-gap: 5px;
    grid-auto-flow: row;
  }
</style>

<svelte:window on:click={buzzIn} on:keydown={buzzIn} />
{#if !$username}
  <LogIn signIn={setUsername} />
{:else if $currentCategory}
  <div class="board">
    <Category category={$currentCategory} selected={$selectedClue} />
  </div>
  <Podiums>
    <BuzzIndicator />
  </Podiums>
{/if}
