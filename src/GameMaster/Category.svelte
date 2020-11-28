<script>
  export let category;
  export let clues;
  export let selected;
  export let selectClue = () => {};
  export let allowBuzzers = () => {};
  export let clearQuestion = () => {};
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");

  .centered {
    text-align: center;
  }
  .category-name {
    font-family: "Anton";
    font-size: 1.75em;
    color: #ffffff;
    background-color: #0027b7;
    text-shadow: 2px 2px 0px #000000;
    text-align: center;
    box-sizing: border-box;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .clue.used {
    position: relative;
  }
  .clue.used:after {
    content: "";
    display: block;
    opacity: 0.5;
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .clue.selected {
    outline: 3px solid #fff;
    outline-offset: -3px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 150px;
    right: 0;
    font-size: 2em;
  }
  .clue {
    background-color: #0027b7;
    display: grid;
    grid-gap: 10px;
    grid-auto-flow: row;
    padding: 10px 2vw;
  }
  .clue-value {
    font-family: "Anton";
    color: #eaa465;
    font-size: 1.5em;
  }
  .clue-text {
    font-family: "korinna_btregular";
    color: #fff;
    font-size: 1.25em;
  }
  .clue-question {
    font-family: "korinna_btregular";
    color: rgb(0, 194, 26);
    font-style: italic;
  }
  .controls {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 10px;
  }
  .controls button {
    font: inherit;
    font-family: "korinna_btregular";
    background-color: #0030e2;
    border-color: #0b268a;
    color: #fff;
  }
</style>

{#if selected}
  {#each clues as clue}
    {#if selected.value === clue.value}
      <div class="clue centered selected">
        <div class="clue-value">${clue.value}</div>
        <div class="clue-text">{clue.clue}</div>
        <div class="clue-question">{clue.question}</div>
        <div class="controls">
          <button type="button" on:click={allowBuzzers}>Allow buzzers</button>
          <button
            type="button"
            on:click={() => clearQuestion(selected.value)}>Close</button>
        </div>
      </div>
    {/if}
  {/each}
{:else if category}
  <div class="category-name centered">
    {category.name}
    <slot />
  </div>
  {#if clues}
    {#each clues as clue}
      <div
        class="clue centered"
        class:used={!category.values.includes(clue.value)}
        on:click={() => selectClue(clue)}>
        <div class="clue-value">${clue.value}</div>
        <div class="clue-text">{clue.clue}</div>
        <div class="clue-question">{clue.question}</div>
      </div>
    {/each}
  {/if}
{/if}
