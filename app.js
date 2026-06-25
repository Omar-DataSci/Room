// =========================================================================
// Somewhere Calm - Game Engine v3.0 (Bug-Fixed Clean Version)
// =========================================================================

// ====== 1. DOM ELEMENTS ======
const bgMusic       = document.getElementById('bg-music');
const yourRoom      = document.getElementById('your-room');
const moodRoom      = document.getElementById('mood-room');
const theGarden     = document.getElementById('the-garden');

const boyTarget     = document.getElementById('boy-target');
const boySpeech     = document.getElementById('boy-speech');
const doorToMood    = document.getElementById('door-to-mood');
const windowTarget  = document.getElementById('window-target');
const atlasTarget   = document.getElementById('atlas-target');
const shelfTarget   = document.getElementById('shelf-target');

const backToRoom    = document.getElementById('back-to-room');
const ventInput     = document.getElementById('vent-input');
const ventSubmit    = document.getElementById('vent-submit');
const emergencyBtn  = document.getElementById('emergency-btn');
const backFromGarden = document.getElementById('back-from-garden');
const starCanvas    = document.getElementById('star-canvas-container');
const secretLetter  = document.getElementById('secret-birthday-letter');

const gameOverlay   = document.getElementById('game-overlay');
const overlayText   = document.getElementById('overlay-text');
const closeOverlay  = document.getElementById('close-overlay');

const atlasDashboard = document.getElementById('atlas-dashboard');
const closeDashboard = document.getElementById('close-dashboard');
const capsuleSubmit  = document.getElementById('capsule-submit');

// ====== 2. STATE VARIABLES ======
let musicStarted  = false;
let pullUpCount   = 0;
let starCount     = 0;
let isSleeping    = false;
let sleepClickSpam = 0;
let isStaring     = false;
let speechTimeout;

// ====== 3. AUDIO ======
function startCoreMusic() {
    if (!musicStarted) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => {});
        musicStarted = true;
    }
}

// ====== 4. ROOM NAVIGATION ======
function switchRoom(fromRoom, toRoom) {
    fromRoom.classList.remove('active');
    fromRoom.classList.add('hidden');
    toRoom.classList.remove('hidden');
    toRoom.classList.add('active');
}

doorToMood.addEventListener('click',    () => { startCoreMusic(); switchRoom(yourRoom, moodRoom); });
backToRoom.addEventListener('click',    () => switchRoom(moodRoom, yourRoom));
windowTarget.addEventListener('click',  () => { startCoreMusic(); switchRoom(yourRoom, theGarden); });
backFromGarden.addEventListener('click',() => switchRoom(theGarden, yourRoom));

// ====== 5. OVERLAY (popup messages) ======
function showOverlayMessage(text) {
    overlayText.innerHTML = text;
    gameOverlay.classList.remove('hidden');
}

closeOverlay.addEventListener('click', () => {
    gameOverlay.classList.add('hidden');
});

// ====== 6. ATLAS SERVER DASHBOARD ======
// FIX: Only ONE event listener on atlasTarget — opens the dashboard
atlasTarget.addEventListener('click', () => {
    startCoreMusic();
    atlasDashboard.classList.remove('hidden');
});

closeDashboard.addEventListener('click', () => {
    atlasDashboard.classList.add('hidden');
});

// ====== 7. TIME CAPSULE (now properly defined) ======
function saveTimeCapsule(text) {
    if (!text || text.trim() === '') {
        showOverlayMessage("Write something first before sealing the capsule! ✏️");
        return;
    }
    // Save to localStorage so it persists
    const capsule = {
        message: text.trim(),
        savedOn: new Date().toLocaleDateString(),
        unlocksOn: 'June 30, 2027'
    };
    localStorage.setItem('zoli_time_capsule', JSON.stringify(capsule));
    showOverlayMessage(
        "🔒 <strong>Capsule Sealed!</strong><br><br>" +
        "Your message has been encrypted and locked.<br>" +
        "It will reveal itself on <strong>June 30, 2027</strong>.<br><br>" +
        "<em>~ Omar's server is keeping it safe for you ~</em>"
    );
    document.getElementById('capsule-input').value = '';
}

capsuleSubmit.addEventListener('click', () => {
    const text = document.getElementById('capsule-input').value;
    saveTimeCapsule(text);
});

// ====== 8. SHELF ======
shelfTarget.addEventListener('click', () => {
    startCoreMusic();
    showOverlayMessage(
        "<strong>The Shelf:</strong> You see a Master 1 certificate in Hydraulic Engineering, " +
        "a small pixel Finn figure, and a note that says:<br><br>" +
        "<em>'You didn't walk this far to stop this far.'</em>"
    );
});

// ====== 9. BIOLOGICAL CLOCK ======
function updateBiologicalClock() {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 5) {
        isSleeping = true;
        boyTarget.classList.add('sleeping-mode');
        boySpeech.innerText = "Zzz... (Omar is resting)";
    } else {
        isSleeping = false;
        boyTarget.classList.remove('sleeping-mode');
        boySpeech.innerText = "Bro, don't annoy me.";
    }
}

// ====== 10. DREAM SEQUENCE (now properly defined) ======
function triggerDreamSequence() {
    showOverlayMessage(
        "✨ <strong>A Dream Fragment...</strong> ✨<br><br>" +
        "<em>\"Somewhere, in a small pixel world, two people met.<br>" +
        "One built universes. One kept them alive.<br>" +
        "They called each other stubborn. They were right.\"</em><br><br>" +
        "~ Omar's dream log, encrypted ~"
    );
}

// ====== 11. BOY CHARACTER INTERACTIONS ======
boyTarget.addEventListener('click', () => {
    startCoreMusic();

    // --- SLEEPING MODE (1AM - 5AM) ---
    if (isSleeping) {
        sleepClickSpam++;
        boyTarget.classList.remove('shake-level-1', 'shake-level-2');

        if (sleepClickSpam === 1) {
            boySpeech.innerText = "Zzz... 😴 (Don't wake him up...)";
            boyTarget.classList.add('shake-level-1');
            boySpeech.classList.add('show');
        } else if (sleepClickSpam === 2) {
            boySpeech.innerText = "💥 Zzz... !!! (He is about to wake up!)";
            boyTarget.classList.add('shake-level-2');
            boySpeech.classList.add('show');
        } else if (sleepClickSpam >= 3) {
            boySpeech.innerText = "✨ !!! ✨";
            yourRoom.classList.add('fade-to-dream-flash');
            sleepClickSpam = 0;
            setTimeout(() => {
                yourRoom.classList.remove('fade-to-dream-flash');
                boyTarget.classList.remove('shake-level-1', 'shake-level-2');
                boySpeech.classList.remove('show');
                triggerDreamSequence();
            }, 600);
        }

        clearTimeout(speechTimeout);
        speechTimeout = setTimeout(() => {
            if (isSleeping && sleepClickSpam > 0) {
                sleepClickSpam = 0;
                boyTarget.classList.remove('shake-level-1', 'shake-level-2');
                boySpeech.innerText = "Zzz... (Omar is resting)";
            }
        }, 4000);
        return;
    }

    // --- AWAKE MODE: STARING CONTEST ---
    if (isStaring) return;
    pullUpCount++;

    if (pullUpCount <= 2) {
        isStaring = true;
        boyTarget.classList.add('staring-contest-active');
        boySpeech.innerText = "Hmmmm... Let's see who blinks first! 👁️";
        boySpeech.classList.add('show');

        setTimeout(() => {
            boySpeech.innerText = "You are very stubborn, but... ok, I surrender. You win! 🏳️";
            boyTarget.classList.remove('staring-contest-active');

            setTimeout(() => {
                boySpeech.innerText = "Fine! Watch me work out! 🏋️‍♂️";
                boyTarget.classList.add('doing-pullups');

                setTimeout(() => {
                    boyTarget.classList.remove('doing-pullups');
                    boyTarget.classList.add('flexing-muscles');
                    boySpeech.innerText = "See? Told you I'm strong! 💪";

                    setTimeout(() => {
                        boyTarget.classList.remove('flexing-muscles');
                        boySpeech.classList.remove('show');
                        isStaring = false;
                        pullUpCount = 0; // reset so she can trigger it again
                    }, 2500);
                }, 3000);
            }, 2500);
        }, 5000);

    } else {
        boySpeech.innerText = "No way! My arms are tired, ask me later! 😤";
        boySpeech.classList.add('show');
        boyTarget.classList.add('boy-stubborn');
        clearTimeout(speechTimeout);
        speechTimeout = setTimeout(() => {
            boySpeech.classList.remove('show');
            boyTarget.classList.remove('boy-stubborn');
            pullUpCount = 0;
        }, 3500);
    }
});

// ====== 12. MOOD ROOM ======
ventSubmit.addEventListener('click', () => {
    const text = ventInput.value.trim();
    if (text === "") return;
    ventInput.value = "";
    showOverlayMessage(
        "Your worries have been dissolved into outer space. 🌌<br><br>" +
        "Take a deep breath, Zoli. You are incredibly strong, free, and doing amazing. 🤍"
    );
});

emergencyBtn.addEventListener('click', () => {
    const messages = [
        "Hey, take a deep breath. Today was hard, but it's over now. You're safe here. 🤍",
        "Remember: You are more stubborn than any bad day. Tomorrow is a fresh start. ✨",
        "It's completely okay to feel tired. Rest your mind — you don't have to carry everything alone. 🌙"
    ];
    showOverlayMessage(messages[Math.floor(Math.random() * messages.length)]);
});

// ====== 13. STAR GARDEN + BIRTHDAY SECRET ======
starCanvas.addEventListener('click', (e) => {
    starCount++;
    const star = document.createElement('div');
    star.classList.add('generated-star');
    const rect = starCanvas.getBoundingClientRect();
    star.style.left = `${e.clientX - rect.left}px`;
    star.style.top  = `${e.clientY - rect.top}px`;
    starCanvas.appendChild(star);

    // Update instruction text
    const remaining = 18 - starCount;
    const instructions = starCanvas.querySelector('.garden-instructions');
    if (instructions && remaining > 0) {
        instructions.textContent = `${remaining} more star${remaining !== 1 ? 's' : ''} to go...`;
    }

    if (starCount === 18) {
        const today = new Date();
        if (today.getMonth() + 1 === 6 && today.getDate() >= 30) {
            // It's her birthday — show the letter
            setTimeout(() => {
                secretLetter.classList.remove('hidden');
                secretLetter.classList.add('reveal-letter');
            }, 800);
        } else {
            setTimeout(() => {
                showOverlayMessage(
                    "✨ <strong>Stars Aligned!</strong> ✨<br><br>" +
                    "You created 18 stars in your sky.<br><br>" +
                    "On <strong>June 30th</strong>, this universe will reveal its ultimate secret... 😉"
                );
            }, 500);
        }
    }
});

// ====== 14. INIT ======
window.addEventListener('DOMContentLoaded', () => {
    updateBiologicalClock();
    setInterval(updateBiologicalClock, 60000);
});
