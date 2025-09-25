// Character sets 
const CHAR_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// DOM elements
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const passwordOutput = document.getElementById("passwordOutput");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

// State
let currentOptions = {
  lowercase: true,
  uppercase: false,
  numbers: false,
  symbols: false,
  length: 12,
};

// Initialize
init();

function init() {
  setupEventListeners();
  updateStrengthIndicator();
}

function setupEventListeners() {
  generateBtn.addEventListener("click", generatePassword);
  copyBtn.addEventListener("click", copyPassword);
  lengthSlider.addEventListener("input", updateLength);

  // Toggle listeners
  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      const option = e.target.dataset.toggle;
      toggleOption(option);
    });
  });

  // Option item listeners
  document.querySelectorAll(".option-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (!e.target.classList.contains("toggle")) {
        const option = item.dataset.option;
        toggleOption(option);
      }
    });
  });
}

function updateLength() {
  currentOptions.length = parseInt(lengthSlider.value);
  lengthValue.textContent = currentOptions.length;
  updateStrengthIndicator();
}

function toggleOption(option) {
  currentOptions[option] = !currentOptions[option];

  const optionItem = document.querySelector(`[data-option="${option}"]`);
  const toggle = document.querySelector(`[data-toggle="${option}"]`);

  if (currentOptions[option]) {
    optionItem.classList.add("active");
    toggle.classList.add("active");
  } else {
    optionItem.classList.remove("active");
    toggle.classList.remove("active");
  }

  updateStrengthIndicator();
}

function generatePassword() {
  const activeCharSets = Object.keys(currentOptions)
    .filter((key) => key !== "length" && currentOptions[key])
    .map((key) => CHAR_SETS[key]);

  if (activeCharSets.length === 0) {
    passwordOutput.textContent = "⚠️ Please select at least one character type";
    passwordOutput.style.color = "#ef4444";
    copyBtn.style.display = "none";
    return;
  }

  // Animation
  generateBtn.classList.add("generating");
  document.querySelector(".password-display").classList.add("animate");

  setTimeout(() => {
    const allChars = activeCharSets.join("");
    let password = "";

    // Ensure at least one character from each selected set
    activeCharSets.forEach((charSet) => {
      password += charSet[Math.floor(Math.random() * charSet.length)];
    });

    // Fill the rest randomly
    for (let i = password.length; i < currentOptions.length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    passwordOutput.textContent = password;
    passwordOutput.style.color = "#e2e8f0";
    copyBtn.style.display = "flex";

    generateBtn.classList.remove("generating");
    setTimeout(() => {
      document.querySelector(".password-display").classList.remove("animate");
    }, 500);
  }, 300);
}

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(passwordOutput.textContent);
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = "✅ Copied!";
    copyBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy password:", err);
    copyBtn.innerHTML = "❌ Failed";
    setTimeout(() => {
      copyBtn.innerHTML = "📋 Copy";
    }, 2000);
  }
}

function updateStrengthIndicator() {
  const activeOptions = Object.keys(currentOptions).filter(
    (key) => key !== "length" && currentOptions[key]
  ).length;

  let strength = 0;
  let strengthLabel = "";
  let strengthColor = "";

  if (activeOptions === 0) {
    strength = 0;
    strengthLabel = "Select character types";
    strengthColor = "#e2e8f0";
  } else {
    // Calculate strength based on length and character variety
    const lengthScore = Math.min(currentOptions.length / 16, 1) * 40;
    const varietyScore = (activeOptions / 4) * 60;
    strength = lengthScore + varietyScore;

    if (strength < 40) {
      strengthLabel = "Weak";
      strengthColor = "#ef4444";
    } else if (strength < 70) {
      strengthLabel = "Medium";
      strengthColor = "#f59e0b";
    } else {
      strengthLabel = "Strong";
      strengthColor = "#10b981";
    }
  }

  strengthFill.style.width = `${strength}%`;
  strengthFill.style.background = strengthColor;
  strengthText.textContent = strengthLabel;
  strengthText.style.color = strengthColor;
}

// Generate initial password
setTimeout(generatePassword, 500);
