<script>
  import { PLAYER_REF, CLUE_REF } from "../shared/firebase";
  import { writable } from "svelte/store";

  const players = writable([]);

  PLAYER_REF.on("value", (snapshot) => {
    if (snapshot && snapshot.val()) {
      const cutoff = Date.now() - 1000 * 60 * 60;
      const values = Object.values(snapshot.val()).filter(
        (player) => player.lastSeen > cutoff
      );
      const firstBuzz = Math.min(
        Infinity,
        ...values.map((p) => p.buzzedAt).filter(Boolean)
      );
      values.forEach((p) => (p.firstBuzz = p.buzzedAt === firstBuzz));
      players.set(values);
    }
  });
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Architects+Daughter&family=Caveat&family=Dancing+Script&family=Indie+Flower&family=Pacifico&family=Patrick+Hand&family=Permanent+Marker&family=Shadows+Into+Light&family=Yellowtail&display=swap");
  .podiums {
    user-select: none;
    position: fixed;
    left: 0;
    bottom: 0;
    display: grid;
    width: 100vw;
    height: 100px;
    grid-gap: 10px;
    grid-auto-flow: column;
  }
  .podium {
    font-size: 2em;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .podium.buzzed {
    background: #0ba747;
  }
  .control {
    position: absolute;
    right: 0;
    bottom: 105px;
  }
</style>

<div class="podiums">
  <div class="control">
    <slot />
  </div>

  {#each $players as player}
    <div
      class="podium"
      class:buzzed={player.firstBuzz}
      style="font-family: '{player.font}'">
      {player.name}
    </div>
  {/each}
</div>
