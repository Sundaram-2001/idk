<script>
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { z } from "zod";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let emailError = "";
  let passwordError = "";
  let isPopupOpen = false;
  let popupEmail = "";
  let isSubmitted = false;

  const emailSchema = z.string().email({ message: "Invalid email address" });
  const passwordSchema = z
    .string()
    .min(6, { message: "Password must be at least 6 characters" });

  const validate = () => {
    emailError = "";
    passwordError = "";

    try {
      emailSchema.parse(email);
    } catch (err) {
      emailError = err.errors[0].message;
    }

    try {
      passwordSchema.parse(password);
    } catch (err) {
      passwordError = err.errors[0].message;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    validate();

    if (!emailError && !passwordError) {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Ensure cookies are sent
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful", data);
          if (data.redirect) {
            await goto(data.redirect);
          } else {
            console.error("Redirect URL not provided");
          }
        } else {
          const errorData = await response.json();
          console.error("Login failed:", errorData.message);
          alert(errorData.message);
        }
      } catch (error) {
        console.error("Error submitting form", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login clicked");
  };

  const openPopup = () => {
    isPopupOpen = true;
  };

  const closePopup = () => {
    isPopupOpen = false;
    isSubmitted = false;
    popupEmail = "";
  };

  const submitPopup = () => {
    // Implement password reset logic here
    console.log("Password reset requested for:", popupEmail);
    isSubmitted = true;
  };
</script>

<div class="container">
  <div class="card">
    <h2>Login</h2>
    <form
      on:submit={handleSubmit}
      method="post"
      action="http://localhost:3000/login"
    >
      <input type="text" bind:value={email} placeholder="Email" required />
      {#if emailError}
        <span class="error">{emailError}</span>
      {/if}
      <input
        type="password"
        bind:value={password}
        placeholder="Password"
        required
      />
      {#if passwordError}
        <span class="error">{passwordError}</span>
      {/if}
      <button type="submit">Login</button>
      <a href="javascript:void(0);" on:click={openPopup}>Forgot Password?</a>
    </form>
    <div class="divider">
      <span>OR</span>
    </div>
    <button class="google-btn" on:click={handleGoogleLogin}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="18px"
        height="18px"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
      Login with Google
    </button>
  </div>
</div>

{#if isPopupOpen}
  <div class="popup-overlay" on:click={closePopup} transition:fade>
    <div
      class="popup"
      on:click|stopPropagation
      transition:fly={{ y: -50, duration: 300, easing: quintOut }}
    >
      <h3>Reset Password</h3>
      {#if !isSubmitted}
        <input
          type="email"
          bind:value={popupEmail}
          placeholder="Enter your email"
          required
        />
        <button on:click={submitPopup} class="popup-button">Send Link</button>
      {:else}
        <div class="success-animation">
          <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              class="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              class="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
              stroke="#4bb71b"
              stroke-width="4"
            />
          </svg>
        </div>
        <p>Email sent successfully!</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
    font-family: Arial, sans-serif;
  }

  .card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  h2 {
    text-align: center;
    color: #1a73e8;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  input,
  button {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
  }

  button {
    background-color: #1a73e8;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #1557b0;
  }

  a {
    color: #1a73e8;
    text-decoration: none;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    text-align: center;
    width: 100%;
  }

  a:hover {
    text-decoration: underline;
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1rem 0;
    font-size: 0.9rem;
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ccc;
  }

  .divider span {
    padding: 0 0.5rem;
    color: #777;
  }

  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: white;
    color: #757575;
    border: 1px solid #ccc;
  }

  .google-btn:hover {
    background-color: #f1f3f4;
  }

  .google-btn svg {
    width: 18px;
    height: 18px;
  }

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
  }

  .popup input {
    margin-bottom: 1rem;
  }

  .success-animation {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    margin-bottom: 1rem;
  }

  .checkmark {
    width: 56px;
    height: 56px;
  }

  .checkmark__circle {
    stroke: #4bb71b;
    stroke-width: 4;
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.15s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  .error {
    color: red;
    font-size: 0.8rem;
  }
</style>
