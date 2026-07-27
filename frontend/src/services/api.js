let activeAbortController = null;

export const generateFlashcards = async (topic) => {
  if (activeAbortController) {
    activeAbortController.abort();
  }

  activeAbortController = new AbortController();
  const { signal } = activeAbortController;

  try {
    const response = await fetch('http://localhost:5000/api/generate-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
      signal, 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.cards || !Array.isArray(data.cards)) {
      throw new Error("Received invalid or empty data structure from the server.");
    }

    return data.cards;
  } catch (error) {
    if (error.name === 'AbortError') {
      return null; 
    }
    throw error;
  } finally {
    if (activeAbortController?.signal === signal) {
      activeAbortController = null;
    }
  }
};