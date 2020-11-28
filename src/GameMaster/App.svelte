<script>
  import Podiums from "../shared/Podiums.svelte";
  import Category from "./Category.svelte";
  import {
    init,
    currentClues,
    currentCategory,
    setRandomCategory,
    selectedClue,
    setSelectedClue,
    clearBuzzers,
    clearSelectedClue,
    allowBuzz,
  } from "./service";

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
  .load-new {
    background: none;
    border: none;
    color: #fff;
    font-size: 0.75em;
    margin-left: 10px;
  }
  .clear-buzzers {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5em;
  }
</style>

{#if $currentCategory}
  <div class="board">
    <Category
      category={$currentCategory}
      clues={$currentClues}
      selectClue={setSelectedClue}
      allowBuzzers={() => {
        clearBuzzers();
        allowBuzz();
      }}
      clearQuestion={clearSelectedClue}
      selected={$selectedClue}>
      <button class="load-new" on:click={setRandomCategory} type="button"><i
          class="fas fa-sync-alt" /></button>
    </Category>
  </div>
{/if}
<Podiums>
  <button class="clear-buzzers" on:click={clearBuzzers} type="button">
    <i class="far fa-minus-square" />
  </button>
</Podiums>
