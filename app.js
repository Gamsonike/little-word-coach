const words = [
  { word: "sun", sentence: "The sun feels warm on my face.", hint: "It starts with the letter S." },
  { word: "fish", sentence: "A little fish swims in the pond.", hint: "It starts with the letter F." },
  { word: "jump", sentence: "Can you jump over the puddle?", hint: "It starts with the letter J." },
  { word: "ship", sentence: "The ship sails across the sea.", hint: "It starts with the letter S." },
  { word: "plant", sentence: "We water the plant every day.", hint: "It starts with the letter P." },
  { word: "cloud", sentence: "A fluffy cloud floats in the sky.", hint: "It starts with the letter C." },
  { word: "bright", sentence: "The bright star twinkles at night.", hint: "It starts with the letter B." },
  { word: "garden", sentence: "Butterflies dance around the garden.", hint: "It starts with the letter G." },
];

const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer-input");
const feedback = document.querySelector("#answer-feedback");
const checkButton = document.querySelector("#check-button");
const nextButton = document.querySelector("#next-button");
const hintButton = document.querySelector("#hint-button");
const listenButton = document.querySelector("#listen-button");
const sentenceButton = document.querySelector("#sentence-button");
const audioNotice = document.querySelector("#audio-notice");
const wordCounter = document.querySelector("#word-counter");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const progressSparkle = document.querySelector(".progress-sparkle");
const scoreCount = document.querySelector("#score-count");
const scoreDots = [...document.querySelectorAll("#score-dots span")];
const coachQuote = document.querySelector("#coach-quote");
const helpDialog = document.querySelector("#help-dialog");
const howToPlayButton = document.querySelector("#how-to-play");

let currentIndex = 0;
let solved = false;
let score = 0;

function currentWord() {
  return words[currentIndex];
}

function setFeedback(message, isSuccess = false) {
  feedback.textContent = message;
  feedback.classList.toggle("success", isSuccess);
}

function speak(text) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    audioNotice.hidden = false;
    audioNotice.textContent = "Audio isn’t available in this browser. You can still practice with the hints.";
    return;
  }

  audioNotice.hidden = true;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function updateProgress() {
  const completed = currentIndex + (solved ? 1 : 0);
  const percentage = (completed / words.length) * 100;
  progressFill.style.width = `${percentage}%`;
  progressSparkle.style.left = `${percentage}%`;
  progressTrack.setAttribute("aria-valuenow", String(completed));
  scoreCount.textContent = String(score);
  scoreDots.forEach((dot, index) => dot.classList.toggle("filled", index < score));
}

function finishAdventure() {
  document.querySelector("#practice-title").textContent = "You’re a word wizard!";
  document.querySelector(".prompt-description").textContent = `You spelled ${score} words. Look at your brilliant brain go!`;
  document.querySelector(".listen-orb").innerHTML = '<span class="orb-sparkle">✦</span><span class="trophy-icon" aria-hidden="true">🏆</span>';
  document.querySelector(".listen-actions").hidden = true;
  document.querySelector(".answer-form").hidden = true;
  document.querySelector(".lesson-label").innerHTML = '<span class="lesson-dot"></span> ADVENTURE COMPLETE';
  wordCounter.textContent = `${words.length} WORDS`;
  progressFill.style.width = "100%";
  progressSparkle.style.left = "100%";
  progressTrack.setAttribute("aria-valuenow", String(words.length));
  coachQuote.textContent = "“You kept going, and look what you can do!”";
  const restartButton = document.createElement("button");
  restartButton.className = "check-button";
  restartButton.type = "button";
  restartButton.id = "restart-button";
  restartButton.innerHTML = 'Play again <span aria-hidden="true">↻</span>';
  restartButton.addEventListener("click", restartAdventure);
  document.querySelector(".prompt-area").append(restartButton);
  restartButton.focus();
}

function restartAdventure() {
  currentIndex = 0;
  score = 0;
  solved = false;
  document.querySelector("#restart-button")?.remove();
  document.querySelector("#practice-title").textContent = "What’s the word?";
  document.querySelector(".prompt-description").textContent = "Tap to listen, then spell what you hear.";
  document.querySelector(".listen-orb").innerHTML = '<span class="orb-sparkle">✦</span><svg viewBox="0 0 64 64" fill="none"><path d="M12 25v14h11l14 11V14L23 25H12Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M46 23c3 2.3 5 5.3 5 9s-2 6.7-5 9M51 17c5 3.8 8 8.9 8 15s-3 11.2-8 15" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>';
  document.querySelector(".listen-actions").hidden = false;
  document.querySelector(".answer-form").hidden = false;
  document.querySelector(".lesson-label").innerHTML = '<span class="lesson-dot"></span> TODAY’S WORD ADVENTURE';
  wordCounter.innerHTML = `WORD 1 <span>/ ${words.length}</span>`;
  answerInput.disabled = false;
  checkButton.hidden = false;
  nextButton.hidden = true;
  answerInput.value = "";
  setFeedback("");
  coachQuote.textContent = "“Take your time. You can listen as many times as you like!”";
  updateProgress();
  answerInput.focus();
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (solved) return;

  const answer = answerInput.value.trim().toLocaleLowerCase();
  if (!answer) {
    setFeedback("Type your best try first. You can do it!");
    answerInput.focus();
    return;
  }

  if (answer === currentWord().word) {
    solved = true;
    score += 1;
    setFeedback("That’s exactly right! You’re growing your word power!", true);
    answerInput.disabled = true;
    checkButton.hidden = true;
    if (currentIndex === words.length - 1) {
      nextButton.textContent = "Finish adventure";
      nextButton.setAttribute("aria-label", "Finish your word adventure");
    } else {
      nextButton.textContent = "Next word →";
      nextButton.removeAttribute("aria-label");
    }
    nextButton.hidden = false;
    coachQuote.textContent = "“Brilliant spelling! I knew you could do it!”";
    updateProgress();
    nextButton.focus();
    return;
  }

  setFeedback("Not quite yet — listen again and give it another try.");
  answerInput.select();
});

nextButton.addEventListener("click", () => {
  if (currentIndex === words.length - 1) {
    finishAdventure();
    return;
  }

  currentIndex += 1;
  solved = false;
  answerInput.value = "";
  answerInput.disabled = false;
  checkButton.hidden = false;
  nextButton.hidden = true;
  setFeedback("");
  wordCounter.innerHTML = `WORD ${currentIndex + 1} <span>/ ${words.length}</span>`;
  updateProgress();
  answerInput.focus();
});

hintButton.addEventListener("click", () => {
  setFeedback(currentWord().hint);
});

listenButton.addEventListener("click", () => speak(currentWord().word));

sentenceButton.addEventListener("click", () => speak(currentWord().sentence));

howToPlayButton.addEventListener("click", () => helpDialog.showModal());
