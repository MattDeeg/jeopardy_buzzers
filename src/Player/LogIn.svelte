<script>
  export let signIn;
  let name;

  const handleSubmit = (e) => {
    e.preventDefault;
    signIn(name);
  };
</script>

<style>
  .wrapper {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sign-in {
    font-family: "korinna_btregular";
    background-color: #0027b7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3vh 5vw;
  }
  .sign-in h1 {
    color: #fff;
  }
  .sign-in label {
    display: block;
    font-size: 1.5em;
    color: #fff;
    text-align: center;
  }
  .sign-in input {
    display: block;
    width: 100%;
    padding: 7px;
    font-size: 1.25em;
    box-sizing: border-box;
  }
  .sign-in button {
    display: block;
    width: 100%;
    padding: 7px;
    font-size: 1.25em;
    margin-top: 1em;
    font-family: "korinna_btregular";
    background-color: #0030e2;
    border-color: #0b268a;
    color: #fff;
  }
</style>

<div class="wrapper">
  <div class="sign-in">
    <form on:submit={handleSubmit} autocomplete="off">
      <h1>CS Jeopardy Buzzer</h1>
      <label for="username">Your Name: </label>
      <input id="username" bind:value={name} />
      <button type="submit">Get Started</button>
    </form>
  </div>
</div>
