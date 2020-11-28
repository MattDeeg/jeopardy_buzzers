<script>
  export let category;
  export let selected;
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
  .clue {
    background-color: #0027b7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 2vw;
    transition: all;
  }
  .clue.selected {
    outline: 3px solid #fff;
    outline-offset: -3px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 150px;
    right: 0;
  }
  .clue-value {
    font-family: "Anton";
    color: #eaa465;
    font-size: 2.5em;
  }
  .clue-text {
    font-family: "korinna_btregular";
    color: #fff;
    font-size: 5em;
  }
</style>

{#if selected}
  <div class="clue centered selected">
    <div class="clue-text">{selected.clue}</div>
  </div>
{:else if category}
  <div class="category-name centered">{category.name}</div>
  {#each category.values as clue}
    <div class="clue centered">
      <div class="clue-value">
        {#if clue}${clue}{:else}&nbsp;{/if}
      </div>
    </div>
  {/each}
{/if}
