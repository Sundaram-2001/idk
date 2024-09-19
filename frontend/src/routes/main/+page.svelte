<script>
  // import { handle } from "express/lib/application";
  import { z } from "zod";
  import { goto } from "$app/navigation";
  let email = "";
  const emailSchema = z
    .string()
    .email({ message: "Enter valid email address!" });
  const validate = () => {
    try {
      emailSchema.parse(email);
      return true;
    } catch (error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          alert(err.message);
        });
      }
      return false;
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        console.log("Sending request..."); // Debugging statement
        const response = await fetch("http://localhost:3000/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Send as an object
        });
        if (response.ok) {
          const data = await response.json();
          if (data.redirect) {
            await goto(data.redirect);
          } else {
            console.log("error in form submission!");
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }
  };
</script>

<main>
  <form action="/email" method="post" on:submit={handleSubmit}>
    <input type="text" name="email" bind:value={email} />
    <button type="submit">submit!</button>
  </form>
</main>

<style>
</style>
