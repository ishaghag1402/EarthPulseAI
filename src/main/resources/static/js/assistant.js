const chatForm = document.getElementById('chatForm');
const chatLog = document.getElementById('chatLog');

function addBubble(message, who) {
  if (!chatLog) return;
  const node = document.createElement('div');
  node.className = `chat-bubble ${who}`;
  node.textContent = message;
  chatLog.appendChild(node);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.getElementById('chatPrompt');
  const question = input?.value.trim();
  if (!question) return;
  addBubble(question, 'user');
  input.value = '';
  try {
    const data = await window.EarthPulseApi.post('/api/ai/chat', {prompt: question});
    addBubble(`[${data.mode || 'ASSISTANT'}] ${data.answer || 'No response returned.'}`, 'bot');
  } catch (error) {
    addBubble(`Could not complete the request: ${error.message}`, 'bot');
  }
});

document.getElementById('analyseBtn')?.addEventListener('click', async () => {
  const result = document.getElementById('analysisResult');
  const area = document.getElementById('analysisArea')?.value.trim();
  const observations = document.getElementById('analysisNotes')?.value.trim();
  result.hidden = false;
  result.textContent = 'Preparing assessment…';
  try {
    const data = await window.EarthPulseApi.post('/api/ai/analyze', {area, observations});
    result.textContent = `[${data.mode || 'ASSESSMENT'}] ${data.answer || 'No assessment returned.'}`;
  } catch (error) {
    result.textContent = `Unable to complete assessment: ${error.message}`;
  }
});
