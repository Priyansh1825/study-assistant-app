let activeAbortController = null;

export const generateFlashcards = async (topic) => {
  // If there's an ongoing request, abort it immediately to prevent stale data overwrites
  if (activeAbortController) {
    activeAbortController.abort();
  }

  // Create a new controller for the current request
  activeAbortController = new AbortController();
  const { signal } = activeAbortController;

  try {
    const response = await fetch('http://localhost:5000/api/generate-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
      signal, // Attach the abort signal here
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Fallback safety check if the structure comes back empty or malformed
    if (!data || !data.cards || !Array.isArray(data.cards)) {
      throw new Error("Received invalid or empty data structure from the server.");
    }

    return data.cards;
  } catch (error) {
    // If the error was an intentional abort, don't bubble it up as a real failure
    if (error.name === 'AbortError') {
      return null; 
    }
    throw error;
  } finally {
    // Clean up if this was the active controller
    if (activeAbortController?.signal === signal) {
      activeAbortController = null;
    }
  }
};