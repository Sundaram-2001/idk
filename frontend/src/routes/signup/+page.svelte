<script>
  import { goto } from "$app/navigation";
  import { z } from "zod";

  let email = "";
  let password = "";
  let emailError = "";
  let passwordError = "";

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
        const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Form submitted successfully", data);
          if (data.redirect) {
            await goto(data.redirect);
          }
        } else if (response.status == 400) {
          alert("User Exists!");
        } else {
          console.error("Form submission failed", response.statusText);
          // Handle server-side errors here
        }
      } catch (error) {
        console.error("Error submitting form", error);
        // Handle network or other errors here
      }
    }
  };
</script>

<div class="signup-container">
  <h2>Sign Up</h2>
  <form on:submit={handleSubmit}>
    <div class="form-group">
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        on:input={() => (emailError = "")}
      />
      {#if emailError}
        <div class="error-message">{emailError}</div>
      {/if}
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        on:input={() => (passwordError = "")}
      />
      {#if passwordError}
        <div class="error-message">{passwordError}</div>
      {/if}
    </div>

    <button type="submit" class="submit-btn">Sign Up</button>
  </form>
</div>

<style>
  .signup-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .signup-container h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
  }

  .form-group input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .form-group input:focus {
    border-color: #007bff;
    outline: none;
  }

  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
  }

  .submit-btn {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .submit-btn:hover {
    background-color: #0056b3;
  }
</style>
