<script>
  import { CLUE_REF } from "../shared/firebase";
  import { writable } from "svelte/store";

  const BUZZER_STATUS = {
    OFF: 0,
    READING: 1,
    READY: 2,
  };

  const buzzer = writable(BUZZER_STATUS.OFF);

  CLUE_REF.on("value", (snapshot) => {
    if (snapshot) {
      const hasClue = snapshot.val();
      if (!hasClue) {
        buzzer.set(BUZZER_STATUS.OFF);
      } else if (hasClue && !hasClue.allowBuzz) {
        buzzer.set(BUZZER_STATUS.READING);
      } else {
        buzzer.set(BUZZER_STATUS.READY);
      }
    }
  });
</script>

<style>
  .buzzer {
    height: 20px;
    width: 100vw;
  }
  .buzzer.off {
    background-color: #666;
  }
  .buzzer.reading {
    background-color: #e5e74e;
  }
  .buzzer.ready {
    background-color: #31a71a;
  }
</style>

<div
  class="buzzer"
  class:off={$buzzer === BUZZER_STATUS.OFF}
  class:reading={$buzzer === BUZZER_STATUS.READING}
  class:ready={$buzzer === BUZZER_STATUS.READY} />
