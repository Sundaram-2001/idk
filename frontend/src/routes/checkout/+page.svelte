<script>
  import { goto } from "$app/navigation";
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      if (data.redirect) {
        await goto(data.redirect);
      } else {
        alert("error!");
      }
    }
  };
</script>

<main>
  <form action="/logout" method="post" on:submit={handleSubmit}>
    <button> logout </button>
  </form>
</main>

<style>
</style>
