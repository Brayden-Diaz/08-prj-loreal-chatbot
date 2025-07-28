/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// System prompt to guide the chatbot
const systemPrompt = {
  role: "system",
  content:
    "You are a helpful assistant specializing in L’Oréal products, routines, and recommendations. Politely refuse to answer questions unrelated to beauty or L’Oréal.",
};

// Function to display messages in the chat window
function displayMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender);
  msgDiv.textContent = message;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Update the API endpoint to use the Cloudflare Worker URL
const CLOUDFLARE_WORKER_URL = "https://lorealbot.bsdiaz.workers.dev"; // Replace with your actual Cloudflare Worker URL

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Display user message
  displayMessage(userMessage, "user");
  userInput.value = "";

  // Prepare API request
  const messages = [systemPrompt, { role: "user", content: userMessage }];

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    const data = await response.json();
    console.log(data); // Log the response to see its structure
    const aiMessage =
      data.choices[0]?.message?.content || "Sorry, no response received.";

    // Display AI response
    displayMessage(aiMessage, "ai");
  } catch (error) {
    console.error("Error communicating with Cloudflare Worker:", error);
    displayMessage(
      "Sorry, I couldn't process your request. Please try again.",
      "ai"
    );
  }
});
