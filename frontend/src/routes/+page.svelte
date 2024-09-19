<script>
  import { onMount } from "svelte";

  let h2Text = "Hey coders,Sign up for leetcode consistency below:";
  let displayedText = "";
  let index = 0;

  function typeText() {
    if (index < h2Text.length) {
      displayedText += h2Text[index];
      index++;
      setTimeout(typeText, 50);
    }
  }

  function handleSignup() {
    window.location.href = "/signup";
  }

  function handleLogin() {
    window.location.href = "/login";
  }

  onMount(() => {
    typeText();
  });
</script>

<main>
  <h2>{displayedText}</h2>
  <button class="signup" on:click={handleSignup}>Signup</button>
  <button class="login" on:click={handleLogin}>Login</button>
</main>

<style>
  :global(body) {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);
    color: white;
  }

  main {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    animation: fadeIn 0.5s ease-out;
  }

  main:hover {
    transform: scale(1.05);
  }

  h2 {
    margin-bottom: 2rem;
  }

  button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  .login {
    background-color: #008cba;
  }

  .login:hover {
    background-color: #007b9a;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
