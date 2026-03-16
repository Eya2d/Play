// ===============================
// 🔄 نظام الهدايا الجديد (مُعدل)
// ===============================
// متغيرات جديدة لتتبع الهدايا المشتراة والجاهزة للتفعيل العشوائي
let availableGifts = []; // الهدايا التي تم شراؤها وجاهزة للتفعيل العشوائي
let giftActiveInGame = false; // هل هناك هدية نشطة حالياً في اللعبة؟

// دالة لإنشاء عناصر الطائرات مع تأخير
async function createPlanesSection() {
    const planesSection = document.getElementById("planesSection");
    planesSection.innerHTML = '';
    planesSection.style.display = "flex";
    
    for (let index = 0; index < planesData.length; index++) {
        const planeData = planesData[index];
        const planeDiv = document.createElement("div");
        planeDiv.className = "Wave-cloud";
        if (index === 0) planeDiv.classList.add("check");
        
        planeDiv.setAttribute("data-plane", planeData.plane);
        planeDiv.setAttribute("data-bullet", planeData.bullet);
        planeDiv.setAttribute("data-price", planeData.price);
        planeDiv.setAttribute("data-speed", planeData.speed);
        
        planeDiv.innerHTML = `
            <img class="sde" src="${planeData.bulletImage}" alt="">
            <img src="${planeData.image}" alt="">
            <span>${planeData.displayPrice}</span>
            ${index === 0 ? '<div class="owned">مفتوح</div>' : ''}
        `;
        
        planesSection.appendChild(planeDiv);
        await new Promise(resolve => setTimeout(resolve, 1)); // تأخير 1 ملي ثانية
    }
    
    addPlaneEventListeners();
    updateStoreDisplay();
}

// دالة لإنشاء عناصر الخلفيات مع تأخير
async function createBackgroundsSection() {
    const backgroundsSection = document.getElementById("backgroundsSection");
    backgroundsSection.innerHTML = '';
    backgroundsSection.style.display = "flex";
    
    for (let index = 0; index < backgroundsData.length; index++) {
        const bgData = backgroundsData[index];
        const bgDiv = document.createElement("div");
        bgDiv.className = "Wave-cloud";
        if (index === 0) {
            bgDiv.classList.add("flex", "check");
            bgDiv.style.justifyContent = "center";
        }
        
        bgDiv.setAttribute("data-bg", bgData.bg);
        bgDiv.setAttribute("data-price", bgData.price);
        
        bgDiv.innerHTML = `
            ${bgData.content}
            <span>${bgData.displayPrice}</span>
            ${index === 0 ? '<div class="owned">مفتوح</div>' : ''}
        `;
        
        backgroundsSection.appendChild(bgDiv);
        await new Promise(resolve => setTimeout(resolve, 1)); // تأخير 1 ملي ثانية
    }
    
    addBackgroundEventListeners();
    updateBackgroundDisplay();
}

// دالة لإنشاء عناصر الهدايا مع تأخير
async function createGiftsSection() {
    const giftsSection = document.getElementById("giftsSection");
    giftsSection.innerHTML = '';
    giftsSection.style.display = "flex";
    
    for (let index = 0; index < giftsData.length; index++) {
        const giftData = giftsData[index];
        const giftDiv = document.createElement("div");
        giftDiv.className = "Wave-cloud";
        
        giftDiv.setAttribute("data-gift", giftData.id);
        giftDiv.setAttribute("data-price", giftData.price);
        
        giftDiv.innerHTML = `
            <img src="${giftData.image}" alt="">
            <span>${giftData.displayPrice}</span>
            <div class="owned">مفتوح</div>
        `;
        
        giftsSection.appendChild(giftDiv);
        await new Promise(resolve => setTimeout(resolve, 1)); // تأخير 1 ملي ثانية
    }
    
    addGiftEventListeners();
    updateGiftsDisplay();
}

// دالة تحديث عرض الهدايا في المتجر
function updateGiftsDisplay() {
    const giftItems = document.querySelectorAll("#giftsSection .Wave-cloud");
    giftItems.forEach((item, index) => {
        const giftData = giftsData[index];
        const price = parseInt(item.getAttribute("data-price"));
        const spanElement = item.querySelector("span");
       
        // إذا كانت الهدية مملوكة
        if (ownedGifts[giftData.id]) {
            spanElement.textContent = "مفتوح";
            const ownedBadge = item.querySelector(".owned");
            if (ownedBadge) {
                // ownedBadge.style.display = "block";
            }
        } else if (price === 0) {
            spanElement.textContent = "مجانـي";
        }
    });
}

// دالة شراء/تفعيل الهدية في المتجر (مُعدلة)
function addGiftEventListeners() {
    const giftItems = document.querySelectorAll("#giftsSection .Wave-cloud");
    giftItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            const giftData = giftsData[index];
            const price = parseInt(item.getAttribute("data-price"));
            const giftType = giftData.id;
           
            // إذا كانت اللعبة قيد التشغيل، نوقفها مؤقتاً
            if (!paused) {
                paused = true;
                pauseBtn.textContent = "▶ استئناف";
            }
            
            // إذا كانت الهدية مملوكة بالفعل
            if (ownedGifts[giftType]) {
                alert("هذه الهدية مملوكة بالفعل وستظهر عشوائياً أثناء اللعبة!");
            }
            // إذا كانت الهدية مجانية أو لديه عملات كافية
            else if (price === 0 || coins >= price) {

                // إذا لم تكن مجانية، نخصم السعر
                if (price > 0) {
                    coins -= price;
                    updateCoinsDisplay();
                    saveGameData(); // ✅ حفظ العملات فوراً بعد الخصم
                }
            
                // إضافة الهدية إلى الهدايا المملوكة
                ownedGifts[giftType] = true;

                // إضافة الهدية إلى قائمة الهدايا المتاحة للتفعيل العشوائي (إذا لم تكن موجودة)
                if (!availableGifts.includes(giftType)) {
                    availableGifts.push(giftType);
                }
            
                // تحديث التحديد في المتجر
                updateGiftsDisplay();
            
                // حفظ البيانات
                saveGameData();

                alert("✅ تم شراء الهدية! ستظهر عشوائياً أثناء اللعبة.");
                console.log("الهدايا المتاحة الآن:", availableGifts); // للتأكد
            } else {
                alert("❌ لا تملك عملات كافية لشراء هذه الهدية!");
            }
        });
    });
}

// دالة إنشاء الهدية في اللعبة (مُعدلة)
function spawnGift() {
    // التحقق من وجود هدايا متاحة واللعبة ليست متوقفة
    if (paused || giftSpawned || giftActiveInGame || availableGifts.length === 0) {
        console.log("لا يمكن ظهور الهدية:", {paused, giftSpawned, giftActiveInGame, availableGifts: availableGifts.length});
        return;
    }
    
    console.log("✨ ظهور هدية جديدة!");
    gift = document.createElement("img");
    gift.src = "image/Gift2.png";
    gift.className = "gift";
    gift.style.top = "0px";
    gift.style.left = Math.random() * (window.innerWidth - 60) + "px";
    game.appendChild(gift);
    giftSpawned = true;
    giftActiveInGame = true;
}

// دالة تفعيل تأثير الهدية العشوائية (مُعدلة)
function activateRandomGiftEffect() {
    if (!giftActiveInGame || availableGifts.length === 0) {
        console.log("لا يمكن تفعيل الهدية");
        return;
    }
    
    // إزالة الهدية
    if (gift) {
        gift.remove();
        gift = null;
    }
    giftSpawned = false;
    giftActiveInGame = false;
    
    // اختيار هدية عشوائية من الهدايا المتاحة
    const randomIndex = Math.floor(Math.random() * availableGifts.length);
    const randomGiftType = availableGifts[randomIndex];
    const giftData = giftsData.find(gift => gift.id === randomGiftType);
    
    if (!giftData) return;
    
    console.log("🎁 تفعيل هدية:", giftData.name);
    
    // استخدام دالة التأثير
    activateGiftEffect(giftData);
}

// دالة تفعيل تأثير الهدية
function activateGiftEffect(giftData) {
    const effect = document.createElement("img");
    effect.src = giftData.image;
    effect.className = "effect";
    effect.style.left = "50%";
    effect.style.top = "50%";
    effect.style.transform = "translate(-50%, -50%)";
    game.appendChild(effect);
    
    // ظهور التأثير ببطء
    setTimeout(() => {
        effect.style.opacity = "1";
    }, 100);
    
    // اختفاء التأثير ببطء بعد 2 ثانية
    setTimeout(() => {
        effect.style.opacity = "0";
        
        // تطبيق التأثير بعد الاختفاء
        setTimeout(() => {
            effect.remove();
            
            // تفعيل تأثير الهدية
            if (typeof giftData.effect === 'function') {
                giftData.effect();
            }
        }, 2000);
    }, 2000);
}

// دالة تجميد الأعداء
function freezeEnemies(duration) {
    showNotification("❄️ تم تجميد الأعداء!");
    enemies.forEach(enemy => {
        enemy.classList.add('frozen');
    });
    
    setTimeout(() => {
        enemies.forEach(enemy => {
            enemy.classList.remove('frozen');
        });
        showNotification("انتهى تأثير التجميد");
    }, duration * 1000);
}

// دالة تفعيل الدرع
function activateShield(duration) {
    showNotification("🛡️ تم تفعيل الدرع!");
    plane.classList.add('shielded');
    setTimeout(() => {
        plane.classList.remove('shielded');
        showNotification("انتهى تأثير الدرع");
    }, duration * 1000);
}

// دالة مضاعفة النقاط
let doublePointsActive = false;
function activateDoublePoints(duration) {
    showNotification("⭐ مضاعفة النقاط مفعلة!");
    doublePointsActive = true;
    setTimeout(() => {
        doublePointsActive = false;
        showNotification("انتهى تأثير مضاعفة النقاط");
    }, duration * 1000);
}

// دالة تفعيل تتبع الأهداف
function activateTargetTracking(duration) {
    showNotification("🎯 تم تفعيل تتبع الأهداف!");
}

// دالة تفعيل جذب الأهداف (مُعدلة)
let magnetActive = false;
function activateMagnet(duration) {
    showNotification("🧲 تم تفعيل جذب الأهداف!");
    magnetActive = true;
    setTimeout(() => {
        magnetActive = false;
        showNotification("انتهى تأثير جذب الأهداف");
    }, duration * 1000);
}

// دالة لتدمير أهداف عشوائية (مُعدلة - تفجر أول 5 أهداف)
function destroyRandomEnemies(count) {
    showNotification(`💥 تفجير ${count} أهداف!`);
    let destroyed = 0;
    
    // إنشاء نسخة من مصفوفة الأعداء (أول 5 أهداف فقط)
    const enemiesToDestroy = [];
    for (let i = 0; i < Math.min(count, enemies.length); i++) {
        if (enemies[i] && enemies[i].parentNode) {
            enemiesToDestroy.push(enemies[i]);
        }
    }
    
    enemiesToDestroy.forEach(enemy => {
        if (enemy && enemy.parentNode) {
            // تفجير الهدف
            const rect = enemy.getBoundingClientRect();
            explode(rect.left, rect.top);
            
            // زيادة النتيجة والعملات
            score++;
            addCoins(10);
            scoreDiv.textContent = "النتيجة: " + score;
            
            // إزالة الهدف من المصفوفة الأصلية
            const indexInEnemies = enemies.indexOf(enemy);
            if (indexInEnemies !== -1) {
                enemies.splice(indexInEnemies, 1);
            }
            
            // إزالة العنصر من DOM
            enemy.remove();
            
            destroyed++;
        }
    });
    
    showNotification(`تم تدمير ${destroyed} أهداف!`);
}

// دالة لعرض إشعار
function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "absolute";
    notification.style.top = "50%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.background = "rgba(0, 0, 0, 0.8)";
    notification.style.color = "#fff";
    notification.style.padding = "15px 30px";
    notification.style.borderRadius = "10px";
    notification.style.zIndex = "10000";
    notification.style.fontSize = "24px";
    notification.style.fontWeight = "bold";
    notification.style.border = "2px solid gold";
    notification.style.boxShadow = "0 0 20px gold";
    game.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// استدعاء الدوال لإنشاء الأقسام - معدل: لا يتم تحميل أي محتوى في البداية
document.addEventListener('DOMContentLoaded', function() {
    // إخفاء جميع الأقسام في البداية
    if (planesSection) planesSection.style.display = "none";
    if (backgroundsSection) backgroundsSection.style.display = "none";
    if (giftsSection) giftsSection.style.display = "none";
    
    // التأكد من أن اللعبة متوقفة في البداية
    paused = true;
    pauseBtn.textContent = "▶ استئناف";
});

const game = document.getElementById("game");
const plane = document.getElementById("plane");
const heartsDiv = document.getElementById("hearts");
const scoreDiv = document.getElementById("score");
const timeDiv = document.getElementById("time");
const resultScreen = document.getElementById("resultScreen");
const finalScore = document.getElementById("finalScore");
const finalHearts = document.getElementById("finalHearts");
const restartBtn = document.getElementById("restartBtn");
const storeScreen = document.getElementById("storeScreen");
const storeBtn = document.getElementById("Store");
const closeStoreBtn = document.getElementById("closeStoreBtn");
const coinsDisplay = document.getElementById("coinsDisplay");
const settingsScreen = document.getElementById("settingsScreen");
const settingsBtn = document.getElementById("Setting");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const autoShootCheckbox = document.getElementById("autoShootCheckbox");
const verticalMovementCheckbox = document.getElementById("verticalMovementCheckbox");
const planeRotationCheckbox = document.getElementById("planeRotationCheckbox");
const resetDataBtn = document.getElementById("resetDataBtn");
const copyRestoreLinkBtn = document.getElementById("copyRestoreLinkBtn");
const restoreDataBtn = document.getElementById("restoreDataBtn");
const restoreLinkInput = document.getElementById("restoreLinkInput");
const notification = document.getElementById("notification");
const backgroundVolume = document.getElementById("backgroundVolume");
const backgroundVolumeValue = document.getElementById("backgroundVolumeValue");
const effectsVolume = document.getElementById("effectsVolume");
const effectsVolumeValue = document.getElementById("effectsVolumeValue");
const shootVolume = document.getElementById("shootVolume");
const shootVolumeValue = document.getElementById("shootVolumeValue");
const giftsTab = document.getElementById("giftsTab");
const planesTab = document.getElementById("planesTab");
const backgroundsTab = document.getElementById("backgroundsTab");
const planesSection = document.getElementById("planesSection");
const backgroundsSection = document.getElementById("backgroundsSection");
const giftsSection = document.getElementById("giftsSection");

// ✅ زر الإيقاف المؤقت
const pauseBtn = document.createElement("button");
pauseBtn.id = "pauseBtn";
pauseBtn.className = "pauseBtn";
pauseBtn.textContent = "▶ استئناف"; // معدل: يبدأ متوقفاً
document.getElementById("hud").appendChild(pauseBtn);

// ✅ زر إعادة الدور
const refreshBtn = document.getElementById("refreshBtn");

// ❤️ عدد القلوب
let hearts = 7;
// 🟢 عدد النقاط
let score = 0;
// عداد الأهداف التي ظهرت
let spawnedCount = 0;
// حالة اللعبة (معدل: تبدأ متوقفة)
let paused = true;
// الوقت بالثواني
let timeLeft = 150;
// العملات
let coins = 0;
// الطائرة الحالية
let currentPlane = "airplane1";
let currentBullet = "bullets.png";
// سرعة الطلقة الحالية
let currentShootSpeed = 150;
// الإطلاق التلقائي
let autoShootEnabled = true;
// حركة الأسهم العمودية
let verticalMovementEnabled = true;
// دوران الطائرة
let planeRotationEnabled = true;
// متغير لتتبع الضغط على زر المسافة
let spacePressed = false;
// تخزين الطائرات المملوكة
let ownedPlanes = {
    "airplane1": true // الطائرة الأولى مجانية ومملوكة
};
// تخزين الخلفيات المملوكة
let ownedBackgrounds = {
    "default": true // الخلفية الافتراضية مجانية ومملوكة
};
// تخزين الهدايا المملوكة
let ownedGifts = {
    "clock": true,
    "bomb": true,
    "shield": false,
    "double_points": false,
    "target": false,
    "magnet": false,
    "freeze": false
};
// الخلفية الحالية
let currentBackground = "default";

// إضافة متغيرات لحركة الطائرة العمودية
let planeX = window.innerWidth / 2;
let planeY = 20; // الموضع العمودي الابتدائي للطائرة
const minPlaneY = 20; // الحد الأدنى للحركة العمودية
const maxPlaneY = 400; // الحد الأقصى للحركة العمودية (400px من الأسفل)

// إعدادات الصوت
let backgroundVolumeLevel = 50;
let effectsVolumeLevel = 70;
let shootVolumeLevel = 80;

// ===============================
// 🔄 متغيرات جديدة للعودة للوضع الطبيعي
// ===============================
let currentPlaneRotation = 0;
let isReturningToBottom = false;
let isReturningToStraight = false;
const returnSpeed = 3; // سرعة العودة للوضع الطبيعي

// ===============================
// 🎁 نظام الهدايا الجديد
// ===============================
let giftSpawned = false;
let gift = null;

// ===============================
// 🗑️ متغيرات نافذة حذف الذاكرة
// ===============================
const deleteMemoryScreen = document.getElementById("deleteMemoryScreen");
const closeDeleteMemoryBtn = document.getElementById("closeDeleteMemoryBtn");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");
const deleteCoinsCheckbox = document.getElementById("deleteCoins");
const deletePlanesCheckbox = document.getElementById("deletePlanes");
const deleteBackgroundsCheckbox = document.getElementById("deleteBackgrounds");
const deleteGiftsCheckbox = document.getElementById("deleteGifts");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// ===============================
// 🔄 نظام إدارة الشاشات (جديد)
// ===============================
function hideAllScreens() {
    storeScreen.style.display = "none";
    settingsScreen.style.display = "none";
    deleteMemoryScreen.style.display = "none";
    resultScreen.style.display = "none";
}

// تحميل البيانات المحفوظة (مُعدل)
// تحميل البيانات المحفوظة (معدل لدعم GIF)
function loadGameData() {
    const savedData = localStorage.getItem('airplaneGameData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.coins !== undefined) {
            coins = data.coins;
        }
        ownedPlanes = data.ownedPlanes || ownedPlanes;
        currentPlane = data.currentPlane || currentPlane;
        currentBullet = data.currentBullet || currentBullet;
        currentShootSpeed = data.currentShootSpeed || currentShootSpeed;
        autoShootEnabled = data.autoShootEnabled !== undefined ? data.autoShootEnabled : true;
        verticalMovementEnabled = data.verticalMovementEnabled !== undefined ? data.verticalMovementEnabled : true;
        planeRotationEnabled = data.planeRotationEnabled !== undefined ? data.planeRotationEnabled : true;
        ownedBackgrounds = data.ownedBackgrounds || ownedBackgrounds;
        currentBackground = data.currentBackground || currentBackground;
        ownedGifts = data.ownedGifts || ownedGifts;
        backgroundVolumeLevel = data.backgroundVolumeLevel || backgroundVolumeLevel;
        effectsVolumeLevel = data.effectsVolumeLevel || effectsVolumeLevel;
        shootVolumeLevel = data.shootVolumeLevel || shootVolumeLevel;
        
        // البحث عن بيانات الطائرة الحالية
        const currentPlaneData = planesData.find(p => p.plane === currentPlane);
        
        // تحديث الطائرة الحالية مع دعم GIF
        if (currentPlaneData && currentPlaneData.image.endsWith('.gif')) {
            plane.src = currentPlaneData.image;
        } else {
            plane.src = "image/Airplane/" + currentPlane + ".png";
        }
        
        // تحديث قائمة الهدايا المتاحة بناءً على الهدايا المملوكة
        availableGifts = [];
        for (let giftType in ownedGifts) {
            if (ownedGifts[giftType]) {
                availableGifts.push(giftType);
            }
        }
        
        console.log("الهدايا المتاحة بعد التحميل:", availableGifts);
        
        // تحديث العملات فقط - لا نقوم بتحديث الأقسام لأنها لم تظهر بعد
        updateCoinsDisplay();
        
        // تحديث الإعدادات
        autoShootCheckbox.checked = autoShootEnabled;
        verticalMovementCheckbox.checked = verticalMovementEnabled;
        planeRotationCheckbox.checked = planeRotationEnabled;
        
        // تحديث عناصر التحكم في الصوت
        backgroundVolume.value = backgroundVolumeLevel;
        backgroundVolumeValue.textContent = backgroundVolumeLevel + "%";
        effectsVolume.value = effectsVolumeLevel;
        effectsVolumeValue.textContent = effectsVolumeLevel + "%";
        shootVolume.value = shootVolumeLevel;
        shootVolumeValue.textContent = shootVolumeLevel + "%";
        
        // تطبيق الخلفية الحالية
        applyBackground(currentBackground);
    }
}

// حفظ البيانات (مُعدل)
function saveGameData() {
    const gameData = {
        coins: coins,
        ownedPlanes: ownedPlanes,
        currentPlane: currentPlane,
        currentBullet: currentBullet,
        currentShootSpeed: currentShootSpeed,
        autoShootEnabled: autoShootEnabled,
        verticalMovementEnabled: verticalMovementEnabled,
        planeRotationEnabled: planeRotationEnabled,
        ownedBackgrounds: ownedBackgrounds,
        currentBackground: currentBackground,
        ownedGifts: ownedGifts,
        backgroundVolumeLevel: backgroundVolumeLevel,
        effectsVolumeLevel: effectsVolumeLevel,
        shootVolumeLevel: shootVolumeLevel
    };
    localStorage.setItem('airplaneGameData', JSON.stringify(gameData));
}

// عرض القلوب
function updateHearts() {
    heartsDiv.innerHTML = "";
    const totalHearts = 7;
    for (let i = 0; i < totalHearts; i++) {
        const h = document.createElement("img");
        h.src = "image/heart.png";
        if (i >= hearts) h.style.filter = "contrast(0.4)";
        heartsDiv.appendChild(h);
    }
}
updateHearts();

let bullets = [];
let enemies = [];
let heartsOnScreen = [];
let keys = {};
document.addEventListener("keydown", e => {
    keys[e.key] = true;
    // التحقق من ضغط زر المسافة
    if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault(); // منع التمرير في الصفحة
        spacePressed = true;
    }
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
    // التحقق من تحرير زر المسافة
    if (e.key === " " || e.key === "Spacebar") {
        spacePressed = false;
    }
});
let canShoot = true;
function autoShoot() {
    if (!paused && canShoot) {
        // الإطلاق التلقائي إذا كان مفعلاً
        if (autoShootEnabled) {
            shoot();
            canShoot = false;
            setTimeout(() => canShoot = true, currentShootSpeed);
        }
        // الإطلاق اليدوي عند الضغط على زر المسافة
        else if (spacePressed) {
            shoot();
            canShoot = false;
            setTimeout(() => canShoot = true, currentShootSpeed);
        }
    }
}
function shoot() {
    const rect = plane.getBoundingClientRect();
    
    // البحث عن بيانات الطائرة الحالية
    const currentPlaneData = planesData.find(p => p.plane === currentPlane);
    
    // تحديد offset الرصاصة (الارتفاع من الأسفل)
    // إذا كانت الطائرة تحتوي على خاصية bulletOffset نستخدمها، وإلا نستخدم القيمة الافتراضية 70
    const bulletBottomOffset = currentPlaneData && currentPlaneData.bulletOffset ? currentPlaneData.bulletOffset : 70;
    
    const leftBullet = document.createElement("img");
    leftBullet.src = "image/" + currentBullet;
    leftBullet.className = "bullet";
    leftBullet.style.left = (rect.left + 10) + "px";
    leftBullet.style.bottom = (planeY + bulletBottomOffset) + "px"; // استخدام offset مخصص
    
    const rightBullet = document.createElement("img");
    rightBullet.src = "image/" + currentBullet;
    rightBullet.className = "bullet";
    rightBullet.style.left = (rect.right - 24) + "px";
    rightBullet.style.bottom = (planeY + bulletBottomOffset) + "px"; // استخدام offset مخصص
    
    game.appendChild(leftBullet);
    game.appendChild(rightBullet);
    bullets.push(leftBullet, rightBullet);
}

function spawnEnemy() {
    if (paused) return;
    const enemy = document.createElement("img");
    enemy.src = "image/Goals.png";
    enemy.className = "enemy";
    enemy.style.top = "0px";
    enemy.style.left = Math.random() * (window.innerWidth - 60) + "px";
    game.appendChild(enemy);
    enemies.push(enemy);
    spawnedCount++;
    
    // التحقق من ظهور الهدية (50 هدف) مع وجود هدايا متاحة
    if (spawnedCount === 50 && timeLeft > 50 && !giftSpawned && availableGifts.length > 0) {
        spawnGift();
    }
    
    if (spawnedCount % 15 === 0) {
        const heart = document.createElement("img");
        heart.src = "image/heart.png";
        heart.className = "heart";
        heart.style.top = "0px";
        heart.style.left = Math.random() * (window.innerWidth - 60) + "px";
        game.appendChild(heart);
        heartsOnScreen.push(heart);
    }
}
function explode(x, y) {
    const boom = document.createElement("img");
    boom.src = "image/explosion2.gif?rand=" + Math.random();
    boom.className = "explosion";
    boom.style.left = x + "px";
    boom.style.top = y + "px";
    game.appendChild(boom);
    setTimeout(() => boom.remove(), 300);
}
// 🔹 إيقاف اللعبة وعرض النتيجة على أساس عدد الأهداف
function endGame() {
    paused = true;
    finalScore.textContent = `النتيجة: ${score} / 100`;
    let rankText = "";
    if (score >= 90) rankText = "متمكن";
    else if (score >= 70) rankText = "ممتاز";
    else if (score >= 40) rankText = "جيد جداً";
    else rankText = "مبتدئ";
    finalHearts.innerHTML = `القلوب المتبقية: ${hearts} <span>${rankText}</span>`;
    resultScreen.style.display = "flex";
}
function resetGame() {
    hearts = 7;
    score = 0;
    spawnedCount = 0;
    timeLeft = 150;
    scoreDiv.textContent = "النتيجة: 0";
    updateHearts();
    enemies.forEach(e => e.remove());
    heartsOnScreen.forEach(h => h.remove());
    bullets.forEach(b => b.remove());
    enemies = [];
    heartsOnScreen = [];
    bullets = [];
    paused = false;
    pauseBtn.textContent = "⏸ إيقاف";
    planeX = window.innerWidth / 2;
    planeY = 20;
    currentPlaneRotation = 0;
    isReturningToBottom = false;
    isReturningToStraight = false;
    plane.style.left = planeX + "px";
    plane.style.bottom = planeY + "px";
    plane.style.transform = "translateX(-50%) rotate(0deg)";
    resultScreen.style.display = "none";
    
    // إعادة تعيين الهدية
    if (gift) {
        gift.remove();
        gift = null;
    }
    giftSpawned = false;
    giftActiveInGame = false;
}
// 🔹 زر الإيقاف المؤقت
pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "▶ استئناف" : "⏸ إيقاف";
});
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        paused = true;
        pauseBtn.textContent = "▶ استئناف";
    }
});
document.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        paused = !paused;
        pauseBtn.textContent = paused ? "▶ استئناف" : "⏸ إيقاف";
    }
});

// ===============================
// 🔵 نظام التحكم بالدائرة (للأجهزة المحمولة) - مع دوران الطائرة
// ===============================
// إنشاء عناصر دائرة التحكم
function createControlCircle() {
    // التحقق من عدم وجود الدائرة مسبقاً
    if (document.getElementById('controlCircleContainer')) return;
    
    const circleContainer = document.createElement('div');
    circleContainer.className = 'control-circle-container';
    circleContainer.id = 'controlCircleContainer';
    
    circleContainer.innerHTML = `
        <div class="control-circle-outer">
            <div class="direction-dot up"></div>
            <div class="direction-dot down"></div>
            <div class="direction-dot left"></div>
            <div class="direction-dot right"></div>
            <div class="control-circle-inner" id="controlCircle">
                <span class="drag-hint">اسحب للتحريك</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(circleContainer);
}

// تفعيل دائرة التحكم فقط للأجهزة المحمولة
if (window.innerWidth <= 1000) {
    // إنشاء الدائرة
    createControlCircle();
    
    const controlCircle = document.getElementById('controlCircle');
    const circleContainer = document.getElementById('controlCircleContainer');
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame = null;
    const maxDistance = 30; // أقصى مسافة يمكن سحب الدائرة
    
    // دالة الأنميشن السلس
    function smoothMove() {
        if (!isDragging && currentX === 0 && currentY === 0) {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            return;
        }
        
        // تحريك الدائرة بسلاسة
        currentX += (targetX - currentX) * 0.2;
        currentY += (targetY - currentY) * 0.2;
        
        controlCircle.style.left = `calc(50% + ${currentX}px)`;
        controlCircle.style.top = `calc(50% + ${currentY}px)`;
        controlCircle.style.transform = 'translate(-50%, -50%)';
        
        // تحريك الطائرة بسلاسة إذا كانت اللعبة تعمل
        if (!paused) {
            if (isDragging) {
                // تحريك الطائرة بسرعة متوسطة (0.6 بدلاً من 0.3)
                planeX += (targetX * 0.6 - (targetX - currentX) * 0.1);
                
                // تطبيق الحركة العمودية مع حد أقصى 50 بكسل
                let newPlaneY = planeY - (targetY * 0.6 - (targetY - currentY) * 0.1);
                
                // تحديد الحد الأقصى للحركة العمودية (50 بكسل من الأسفل)
                const maxPlaneYMobile = 150; // الحد الأقصى للحركة للأعلى على الهاتف
                if (newPlaneY < minPlaneY) {
                    planeY = minPlaneY;
                } else if (newPlaneY > maxPlaneYMobile) {
                    planeY = maxPlaneYMobile;
                } else {
                    planeY = newPlaneY;
                }
                
                // تطبيق الحدود الأفقية
                if (planeX < 0) planeX = 0;
                if (planeX > window.innerWidth - 70) planeX = window.innerWidth - 70;
                
                // تطبيق الموضع الجديد للطائرة
                plane.style.left = planeX + 'px';
                plane.style.bottom = planeY + 'px';
            }
            
            // ===============================
            // ✈️ تدوير الطائرة بناءً على اتجاه السحب
            // ===============================
            if (planeRotationEnabled) {
                if (isDragging && Math.abs(targetX) > 1) {
                    // حساب زاوية الدوران بناءً على مقدار السحب الأفقي
                    const maxRotation = 20; // أقصى زاوية دوران (درجة)
                    const rotationFactor = (targetX / maxDistance) * maxRotation;
                    currentPlaneRotation = -rotationFactor; // سالب لجعل الدوران طبيعياً
                } else {
                    // عند عدم السحب أو السحب قليل جداً، عد تدريجياً إلى 0
                    if (currentPlaneRotation > 0) {
                        currentPlaneRotation = Math.max(0, currentPlaneRotation - returnSpeed);
                    } else if (currentPlaneRotation < 0) {
                        currentPlaneRotation = Math.min(0, currentPlaneRotation + returnSpeed);
                    }
                }
                
                // تطبيق الدوران على الطائرة
                plane.style.transform = `translateX(-50%) rotate(${currentPlaneRotation}deg)`;
            }
        }
        
        animationFrame = requestAnimationFrame(smoothMove);
    }
    
    // أحداث اللمس للدائرة
    controlCircle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        
        isDragging = true;
        controlCircle.classList.add('dragging');
        
        // تسجيل نقطة البداية
        startX = touch.clientX;
        startY = touch.clientY;
        
        // إعادة تعيين الموضع إذا لم يكن محدداً
        if (!controlCircle.style.left) {
            controlCircle.style.left = '50%';
            controlCircle.style.top = '50%';
            controlCircle.style.transform = 'translate(-50%, -50%)';
        }
        
        // بدء الأنميشن
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(smoothMove);
        }
    });
    
    controlCircle.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        
        // حساب المسافة التي تم سحبها
        let deltaX = touch.clientX - startX;
        let deltaY = touch.clientY - startY;
        
        // تحديد اتجاه السحب وتحديد المسافة القصوى
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }
        
        // تحديث الهدف
        targetX = deltaX;
        targetY = deltaY;
    });
    
    controlCircle.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        isDragging = false;
        controlCircle.classList.remove('dragging');
        
        // إعادة الهدف إلى المركز
        targetX = 0;
        targetY = 0;
    });
    
    // منع التداخل مع السحب العادي للصفحة
    controlCircle.addEventListener('touchcancel', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        isDragging = false;
        controlCircle.classList.remove('dragging');
        targetX = 0;
        targetY = 0;
    });
    
    // إضافة دعم للفأرة للتجربة على الكمبيوتر
    controlCircle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        
        isDragging = true;
        controlCircle.classList.add('dragging');
        
        startX = e.clientX;
        startY = e.clientY;
        
        if (!controlCircle.style.left) {
            controlCircle.style.left = '50%';
            controlCircle.style.top = '50%';
            controlCircle.style.transform = 'translate(-50%, -50%)';
        }
        
        // بدء الأنميشن
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(smoothMove);
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }
        
        targetX = deltaX;
        targetY = deltaY;
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        controlCircle.classList.remove('dragging');
        targetX = 0;
        targetY = 0;
    });
}

// ===============================
// 🛒 وظائف المتجر (معدلة بالكامل)
// ===============================

// دالة مساعدة لإخفاء جميع الأقسام
function hideAllStoreSections() {
    planesSection.style.display = "none";
    backgroundsSection.style.display = "none";
    giftsSection.style.display = "none";
}

// دالة مساعدة لإفراغ جميع الأقسام
function clearAllStoreSections() {
    planesSection.innerHTML = '';
    backgroundsSection.innerHTML = '';
    giftsSection.innerHTML = '';
}

// تحديث عرض المتجر
function updateStoreDisplay() {
    const planeItems = document.querySelectorAll("#planesSection .Wave-cloud");
    planeItems.forEach(item => {
        const planeType = item.getAttribute("data-plane");
        const price = parseInt(item.getAttribute("data-price"));
        const spanElement = item.querySelector("span");
       
        // إذا كانت الطائرة مملوكة
        if (ownedPlanes[planeType]) {
            // إزالة السعر وإضافة "مفتوح"
            spanElement.textContent = "مفتوح";
            // إضافة علامة مفتوح
            const ownedBadge = item.querySelector(".owned");
            if (ownedBadge) {
                ownedBadge.style.display = "none";
            } else {
                const newOwnedBadge = document.createElement("div");
                newOwnedBadge.className = "owned";
                newOwnedBadge.textContent = "مفتوح";
                item.appendChild(newOwnedBadge);
            }
        } else if (price === 0) {
            spanElement.textContent = "مجانـي";
        }
       
        // تحديث التحديد للطائرة الحالية
        if (planeType === currentPlane) {
            item.classList.add("check");
        } else {
            item.classList.remove("check");
        }
    });
}

// تحديث عرض الخلفيات
function updateBackgroundDisplay() {
    const bgItems = document.querySelectorAll("#backgroundsSection .Wave-cloud");
    bgItems.forEach(item => {
        const bgType = item.getAttribute("data-bg");
        const price = parseInt(item.getAttribute("data-price"));
        const spanElement = item.querySelector("span");
       
        // إذا كانت الخلفية مملوكة
        if (ownedBackgrounds[bgType]) {
            // إزالة السعر وإضافة "مفتوح"
            spanElement.textContent = "مفتوح";
            // إضافة علامة مفتوح
            const ownedBadge = item.querySelector(".owned");
            if (ownedBadge) {
                ownedBadge.style.display = "none";
            } else {
                const newOwnedBadge = document.createElement("div");
                newOwnedBadge.className = "owned";
                newOwnedBadge.textContent = "مفتوح";
                item.appendChild(newOwnedBadge);
            }
        } else if (price === 0) {
            spanElement.textContent = "مجانـي";
        }
       
        // تحديث التحديد للخلفية الحالية
        if (bgType === currentBackground) {
            item.classList.add("check");
        } else {
            item.classList.remove("check");
        }
    });
}

// تطبيق الخلفية
function applyBackground(bgName) {
    if (bgName === "default") {
        game.style.background = "#122759";
        game.style.boxShadow = "0px 16px 33px #1f469f inset";
        game.style.backgroundImage = "none";
    } else if (bgName === "bg1") {
        game.style.backgroundImage = "url('image/img1.jpg')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    } else if (bgName === "bg2") {
        game.style.backgroundImage = "url('image/img2.jpg')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    } else if (bgName === "bg3") {
        game.style.backgroundImage = "url('image/img4.jpg')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    } else if (bgName === "bg4") {
        game.style.backgroundImage = "url('image/img5.png')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    } else if (bgName === "bg5") {
        game.style.backgroundImage = "url('image/img6.jpg')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    } else if (bgName === "bg6") {
        game.style.backgroundImage = "url('image/img7.png')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    } else if (bgName === "bg7") {
        game.style.backgroundImage = "url('image/img8.jpg')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    } else if (bgName === "bg8") {
        game.style.backgroundImage = "url('image/img9.jpg')";
        game.style.backgroundSize = "cover";
        game.style.boxShadow = "none";
    }
}

// فتح المتجر (معدل) - مع تحميل المحتوى من جديد
storeBtn.addEventListener("click", async () => {
    hideAllScreens();
    storeScreen.style.display = "flex";
    paused = true;
    pauseBtn.textContent = "▶ استئناف";
    updateCoinsDisplay();
    
    // إفراغ وإخفاء جميع الأقسام أولاً
    clearAllStoreSections();
    hideAllStoreSections();
    
    // عرض قسم الطائرات افتراضياً
    planesTab.classList.add("checked");
    backgroundsTab.classList.remove("checked");
    giftsTab.classList.remove("checked");
    
    // تحميل قسم الطائرات من جديد
    await createPlanesSection();
});

// إغلاق المتجر - مع إفراغ جميع الأقسام
closeStoreBtn.addEventListener("click", () => {
    storeScreen.style.display = "none";
    clearAllStoreSections(); // إفراغ جميع الأقسام عند إغلاق المتجر
    hideAllStoreSections();
    // لا نقوم بتغيير حالة paused هنا، يبقى على المستخدم النقر على زر الإيقاف
});

// تحديث عرض العملات
function updateCoinsDisplay() {
    coinsDisplay.textContent = coins;
}

// شراء طائرة جديدة (معدلة لدعم GIF)
function addPlaneEventListeners() {
    const planeItems = document.querySelectorAll("#planesSection .Wave-cloud");
    planeItems.forEach(item => {
        item.addEventListener("click", () => {
            const price = parseInt(item.getAttribute("data-price"));
            const planeType = item.getAttribute("data-plane");
            const bulletType = item.getAttribute("data-bullet");
            const shootSpeed = parseInt(item.getAttribute("data-speed"));
            
            // البحث عن بيانات الطائرة في المصفوفة للحصول على مسار الصورة الصحيح
            const planeData = planesData.find(p => p.plane === planeType);
            
            // إذا كانت الطائرة مملوكة بالفعل
            if (ownedPlanes[planeType]) {
                // تحديث الطائرة الحالية
                currentPlane = planeType;
                currentBullet = bulletType;
                currentShootSpeed = shootSpeed;
                
                // تحديد ما إذا كانت الصورة GIF أو PNG
                if (planeData && planeData.image.endsWith('.gif')) {
                    plane.src = planeData.image;
                } else {
                    plane.src = "image/Airplane/" + planeType + ".png";
                }
                
                // تحديث التحديد في المتجر
                updateStoreDisplay();
                
                // حفظ البيانات
                saveGameData();
            }
            // إذا كانت الطائرة مجانية أو لديه عملات كافية
            else if (price === 0 || coins >= price) {
                // إذا لم تكن مجانية، نخصم السعر
                if (price > 0) {
                    coins -= price;
                    updateCoinsDisplay();
                }
                
                // إضافة الطائرة إلى الطائرات المملوكة
                ownedPlanes[planeType] = true;
                
                // تحديث الطائرة الحالية
                currentPlane = planeType;
                currentBullet = bulletType;
                currentShootSpeed = shootSpeed;
                
                // تحديد ما إذا كانت الصورة GIF أو PNG
                if (planeData && planeData.image.endsWith('.gif')) {
                    plane.src = planeData.image;
                } else {
                    plane.src = "image/Airplane/" + planeType + ".png";
                }
                
                // تحديث التحديد في المتجر
                updateStoreDisplay();
                
                // حفظ البيانات
                saveGameData();
            } else {
                alert("لا تملك عملات كافية لشراء هذه الطائرة!");
            }
        });
    });
}

// شراء خلفية جديدة
function addBackgroundEventListeners() {
    const bgItems = document.querySelectorAll("#backgroundsSection .Wave-cloud");
    bgItems.forEach(item => {
        item.addEventListener("click", () => {
            const price = parseInt(item.getAttribute("data-price"));
            const bgType = item.getAttribute("data-bg");
           
            // إذا كانت الخلفية مملوكة بالفعل
            if (ownedBackgrounds[bgType]) {
                // تحديث الخلفية الحالية
                currentBackground = bgType;
                applyBackground(currentBackground);
               
                // تحديث التحديد في المتجر
                updateBackgroundDisplay();
               
                // حفظ البيانات
                saveGameData();
            }
            // إذا كانت الخلفية مجانية أو لديه عملات كافية
            else if (price === 0 || coins >= price) {
                // إذا لم تكن مجانية، نخصم السعر
                if (price > 0) {
                    coins -= price;
                    updateCoinsDisplay();
                }
               
                // إضافة الخلفية إلى الخلفيات المملوكة
                ownedBackgrounds[bgType] = true;
               
                // تحديث الخلفية الحالية
                currentBackground = bgType;
                applyBackground(currentBackground);
               
                // تحديث التحديد في المتجر
                updateBackgroundDisplay();
               
                // حفظ البيانات
                saveGameData();
            } else {
                alert("لا تملك عملات كافية لشراء هذه الخلفية!");
            }
        });
    });
}

// التبديل بين قسم الطائرات والخلفيات والهدايا - مع تحميل المحتوى من جديد في كل مرة
planesTab.addEventListener("click", async () => {
    // إخفاء الأقسام الأخرى
    backgroundsSection.style.display = "none";
    giftsSection.style.display = "none";
    
    // تحديث حالة التبويبات
    planesTab.classList.add("checked");
    backgroundsTab.classList.remove("checked");
    giftsTab.classList.remove("checked");
    
    // إفراغ وإعادة تحميل قسم الطائرات من جديد
    planesSection.innerHTML = '';
    await createPlanesSection();
});

backgroundsTab.addEventListener("click", async () => {
    // إخفاء الأقسام الأخرى
    planesSection.style.display = "none";
    giftsSection.style.display = "none";
    
    // تحديث حالة التبويبات
    planesTab.classList.remove("checked");
    backgroundsTab.classList.add("checked");
    giftsTab.classList.remove("checked");
    
    // إفراغ وإعادة تحميل قسم الخلفيات من جديد
    backgroundsSection.innerHTML = '';
    await createBackgroundsSection();
});

giftsTab.addEventListener("click", async () => {
    // إخفاء الأقسام الأخرى
    planesSection.style.display = "none";
    backgroundsSection.style.display = "none";
    
    // تحديث حالة التبويبات
    planesTab.classList.remove("checked");
    backgroundsTab.classList.remove("checked");
    giftsTab.classList.add("checked");
    
    // إفراغ وإعادة تحميل قسم الهدايا من جديد
    giftsSection.innerHTML = '';
    await createGiftsSection();
});

// زيادة العملات عند إصابة الهدف
function addCoins(amount) {
    coins += amount;
    updateCoinsDisplay();
    saveGameData(); // حفظ البيانات بعد كل زيادة في العملات
}

// ===============================
// ⚙️ وظائف الإعدادات الجديدة
// ===============================
// فتح شاشة الإعدادات (معدل)
settingsBtn.addEventListener("click", () => {
    hideAllScreens();
    settingsScreen.style.display = "flex";
    paused = true;
    pauseBtn.textContent = "▶ استئناف";
});
// إغلاق شاشة الإعدادات - لا يتم استئناف اللعبة تلقائيًا
closeSettingsBtn.addEventListener("click", () => {
    settingsScreen.style.display = "none";
    // لا نقوم بتغيير حالة paused هنا، يبقى على المستخدم النقر على زر الإيقاف
});
// التحكم في الإطلاق التلقائي
autoShootCheckbox.addEventListener("change", function() {
    autoShootEnabled = this.checked;
    saveGameData(); // حفظ الإعدادات
});
// التحكم في حركة الأسهم العمودية
verticalMovementCheckbox.addEventListener("change", function() {
    verticalMovementEnabled = this.checked;
    saveGameData(); // حفظ الإعدادات
    
    // إذا تم إيقاف الحركة العمودية والطائرة في الأعلى، نبدأ عملية العودة للأسفل
    if (!verticalMovementEnabled && planeY > minPlaneY) {
        isReturningToBottom = true;
    }
});
// التحكم في دوران الطائرة
planeRotationCheckbox.addEventListener("change", function() {
    planeRotationEnabled = this.checked;
    saveGameData(); // حفظ الإعدادات
    
    // إذا تم إيقاف الدوران، نبدأ عملية العودة للوضع المستقيم
    if (!planeRotationEnabled && currentPlaneRotation !== 0) {
        isReturningToStraight = true;
    }
});
// ===============================
// 🗑️ وظائف نافذة حذف الذاكرة (مُعدلة)
// ===============================
// فتح نافذة حذف الذاكرة (معدل)
resetDataBtn.addEventListener("click", () => {
    hideAllScreens();
    deleteMemoryScreen.style.display = "flex";
    paused = true;
    pauseBtn.textContent = "▶ استئناف";
    
    // إعادة تعيين خيارات الحذف إلى الوضع الافتراضي (غير محددة)
    selectAllCheckbox.checked = false;
    deleteCoinsCheckbox.checked = false;
    deletePlanesCheckbox.checked = false;
    deleteBackgroundsCheckbox.checked = false;
    deleteGiftsCheckbox.checked = false;
});

// إغلاق نافذة حذف الذاكرة
closeDeleteMemoryBtn.addEventListener("click", () => {
    deleteMemoryScreen.style.display = "none";
});

// وظيفة تحديد/إلغاء تحديد الكل
selectAllCheckbox.addEventListener("change", function() {
    const isChecked = this.checked;
    deleteCoinsCheckbox.checked = isChecked;
    deletePlanesCheckbox.checked = isChecked;
    deleteBackgroundsCheckbox.checked = isChecked;
    deleteGiftsCheckbox.checked = isChecked;
});

// وظيفة التحقق من تحديد الخيارات الفردية
const deleteOptions = document.querySelectorAll(".deleteOption");
deleteOptions.forEach(option => {
    option.addEventListener("change", function() {
        // إذا تم إلغاء تحديد أحد الخيارات، قم بإلغاء تحديد "تحديد الكل"
        if (!this.checked) {
            selectAllCheckbox.checked = false;
        }
        // إذا تم تحديد جميع الخيارات، قم بتحديد "تحديد الكل"
        else if (Array.from(deleteOptions).every(opt => opt.checked)) {
            selectAllCheckbox.checked = true;
        }
    });
});

// تأكيد حذف الذاكرة
confirmDeleteBtn.addEventListener("click", () => {
    // التحقق مما إذا تم تحديد أي خيار
    const deleteCoins = deleteCoinsCheckbox.checked;
    const deletePlanes = deletePlanesCheckbox.checked;
    const deleteBackgrounds = deleteBackgroundsCheckbox.checked;
    const deleteGifts = deleteGiftsCheckbox.checked;
    
    if (!deleteCoins && !deletePlanes && !deleteBackgrounds && !deleteGifts) {
        alert("يرجى تحديد ما تريد حذفه على الأقل!");
        return;
    }
    
    if (confirm("هل أنت متأكد من حذف البيانات المحددة؟ هذا الإجراء لا يمكن التراجع عنه.")) {
        // استرجاع البيانات الحالية من localStorage
        const savedData = localStorage.getItem('airplaneGameData');
        let gameData = savedData ? JSON.parse(savedData) : {};
        
        // حذف البيانات المحددة
        if (deleteCoins) {
            gameData.coins = 1700; // إعادة تعيين العملات إلى القيمة الافتراضية
        }
        
        if (deletePlanes) {
            gameData.ownedPlanes = { "airplane1": true }; // إعادة تعيين الطائرات المملوكة
            gameData.currentPlane = "airplane1"; // إعادة تعيين الطائرة الحالية
            gameData.currentBullet = "bullets.png"; // إعادة تعيين الرصاصات الحالية
            gameData.currentShootSpeed = 150; // إعادة تعيين سرعة الطلقة
        }
        
        if (deleteBackgrounds) {
            gameData.ownedBackgrounds = { "default": true }; // إعادة تعيين الخلفيات المملوكة
            gameData.currentBackground = "default"; // إعادة تعيين الخلفية الحالية
        }
        
        if (deleteGifts) {
            gameData.ownedGifts = {
                "clock": true,
                "bomb": true,
                "shield": false,
                "double_points": false,
                "target": false,
                "magnet": false,
                "freeze": false
            }; // إعادة تعيين الهدايا المملوكة
        }
        
        // حفظ البيانات المحدثة
        localStorage.setItem('airplaneGameData', JSON.stringify(gameData));
        
        // إعادة تحميل الصفحة لتطبيق التغييرات
        location.reload();
    }
});

// ===============================
// 🔗 نظام ربط الاستعادة المبسط
// ===============================

// دالة إنشاء رابط الاستعادة
function generateRestoreLink() {
    const gameData = {
        coins: coins,
        ownedPlanes: ownedPlanes,
        currentPlane: currentPlane,
        currentBullet: currentBullet,
        currentShootSpeed: currentShootSpeed,
        autoShootEnabled: autoShootEnabled,
        verticalMovementEnabled: verticalMovementEnabled,
        planeRotationEnabled: planeRotationEnabled,
        ownedBackgrounds: ownedBackgrounds,
        currentBackground: currentBackground,
        ownedGifts: ownedGifts,
        bgVolume: backgroundVolumeLevel,
        fxVolume: effectsVolumeLevel,
        shVolume: shootVolumeLevel
    };
    
    // تحويل → نص → تشفير
    const json = JSON.stringify(gameData);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    
    // إرجاع الرابط الكامل
    return `${window.location.href.split('?')[0]}?restore=${encoded}`;
}

// دالة نسخ النص
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // طريقة بديلة
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        return true;
    }
}

// دالة استعادة البيانات من الرابط
function restoreFromLink(link) {
    try {
        const url = new URL(link);
        const encoded = url.searchParams.get('restore');
        if (!encoded) throw new Error('لا توجد بيانات');
        
        // فك التشفير
        const json = decodeURIComponent(escape(atob(encoded)));
        const data = JSON.parse(json);
        
        // تطبيق البيانات
        coins = data.coins ?? coins;
        ownedPlanes = data.ownedPlanes ?? ownedPlanes;
        currentPlane = data.currentPlane ?? currentPlane;
        currentBullet = data.currentBullet ?? currentBullet;
        currentShootSpeed = data.currentShootSpeed ?? currentShootSpeed;
        autoShootEnabled = data.autoShootEnabled ?? autoShootEnabled;
        verticalMovementEnabled = data.verticalMovementEnabled ?? verticalMovementEnabled;
        planeRotationEnabled = data.planeRotationEnabled ?? planeRotationEnabled;
        ownedBackgrounds = data.ownedBackgrounds ?? ownedBackgrounds;
        currentBackground = data.currentBackground ?? currentBackground;
        ownedGifts = data.ownedGifts ?? ownedGifts;
        backgroundVolumeLevel = data.bgVolume ?? backgroundVolumeLevel;
        effectsVolumeLevel = data.fxVolume ?? effectsVolumeLevel;
        shootVolumeLevel = data.shVolume ?? shootVolumeLevel;
        
        // تحديث قائمة الهدايا المتاحة
        availableGifts = Object.keys(ownedGifts).filter(g => ownedGifts[g]);
        
        // تحديث الواجهة
        const planeData = planesData.find(p => p.plane === currentPlane);
        plane.src = planeData?.image || `image/Airplane/${currentPlane}.png`;
        
        // تحديث العملات فقط - الأقسام سيتم تحميلها عند ظهورها
        updateCoinsDisplay();
        applyBackground(currentBackground);
        
        // تحديث الإعدادات
        autoShootCheckbox.checked = autoShootEnabled;
        verticalMovementCheckbox.checked = verticalMovementEnabled;
        planeRotationCheckbox.checked = planeRotationEnabled;
        
        backgroundVolume.value = backgroundVolumeLevel;
        backgroundVolumeValue.textContent = backgroundVolumeLevel + '%';
        effectsVolume.value = effectsVolumeLevel;
        effectsVolumeValue.textContent = effectsVolumeLevel + '%';
        shootVolume.value = shootVolumeLevel;
        shootVolumeValue.textContent = shootVolumeLevel + '%';
        
        // حفظ في localStorage
        saveGameData();
        
        return true;
    } catch (error) {
        console.error('خطأ في الاستعادة:', error);
        return false;
    }
}

// إظهار إشعار
function showMessage(msg) {
    notification.textContent = msg;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 2000);
}

// ===============================
// 🎯 أحداث الأزرار
// ===============================

// نسخ رابط الاستعادة
copyRestoreLinkBtn.addEventListener('click', async () => {
    const link = generateRestoreLink();
    const copied = await copyText(link);
    showMessage(copied ? '✅ تم نسخ الرابط' : '❌ فشل النسخ');
});

// استعادة البيانات من الرابط
restoreDataBtn.addEventListener('click', () => {
    const link = restoreLinkInput.value.trim();
    if (!link) return alert('📋 الصق الرابط أولاً');
    
    if (restoreFromLink(link)) {
        alert('✅ تم استعادة البيانات بنجاح');
        restoreLinkInput.value = '';
    } else {
        alert('❌ رابط غير صالح');
    }
});

// زر المشاركة
const sharingBtn = document.getElementById("sharing");
if (sharingBtn) {
    sharingBtn.addEventListener('click', async () => {
        const link = generateRestoreLink();
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'لعبة الطائرات',
                    text: 'رابط استعادة تقدمك في اللعبة',
                    url: link
                });
            } catch {
                await copyText(link);
                showMessage('📋 تم نسخ الرابط');
            }
        } else {
            await copyText(link);
            showMessage('📋 تم نسخ الرابط');
        }
    });
}

// استعادة تلقائية عند فتح الرابط
window.addEventListener('load', () => {
    const params = new URLSearchParams(location.search);
    const restoreData = params.get('restore');
    
    if (restoreData) {
        if (restoreFromLink(location.href)) {
            history.replaceState({}, '', location.pathname);
            setTimeout(() => alert('✅ تم استعادة بياناتك'), 500);
        }
    }
});

// التحكم في مستوى صوت الخلفية
backgroundVolume.addEventListener("input", function() {
    backgroundVolumeLevel = this.value;
    backgroundVolumeValue.textContent = backgroundVolumeLevel + "%";
    saveGameData();
});
// التحكم في مستوى صوت التأثيرات
effectsVolume.addEventListener("input", function() {
    effectsVolumeLevel = this.value;
    effectsVolumeValue.textContent = effectsVolumeLevel + "%";
    saveGameData();
});
// التحكم في مستوى صوت الطلقات
shootVolume.addEventListener("input", function() {
    shootVolumeLevel = this.value;
    shootVolumeValue.textContent = shootVolumeLevel + "%";
    saveGameData();
});

// ===============================
// 🔄 زر إعادة الدور
// ===============================
refreshBtn.addEventListener("click", () => {
    // حفظ العملات الحالية
    const currentCoins = coins;
    
    // إعادة تعيين اللعبة
    resetGame();
    
    // استعادة العملات
    coins = currentCoins;
    updateCoinsDisplay();
    
    // إعادة تعيين المؤقت
    clearInterval(timer);
    timeLeft = 150;
    timeDiv.textContent = `${timeLeft} :الوقت`;
    
    // بدء مؤقت جديد
    timer = setInterval(() => {
        if (!paused) {
            timeLeft--;
            timeDiv.textContent = `${timeLeft} :الوقت`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }
    }, 1000);
    
    // حفظ البيانات بعد إعادة الدور
    saveGameData();
});

// ===============================
// 🔄 تعديل دالة gameLoop الرئيسية (مع إضافة تأثير المغناطيس)
// ===============================
function gameLoop() {
    if (!paused) {
        // التحكم في الحركة الأفقية
        if (keys["ArrowLeft"]) planeX -= 7;
        if (keys["ArrowRight"]) planeX += 7;
        
        // التحكم في الحركة العمودية (للأعلى والأسفل)
        if (verticalMovementEnabled) {
            if (keys["ArrowUp"]) planeY += 7;
            if (keys["ArrowDown"]) planeY -= 7;
            
            // إذا كانت الحركة العمودية مفعلة، نوقف أي عودة للأسفل
            isReturningToBottom = false;
        } else {
            // إذا تم إيقاف الحركة العمودية والطائرة في الأعلى، نعيدها للأسفل
            if (planeY > minPlaneY) {
                isReturningToBottom = true;
                planeY -= returnSpeed;
                
                // التأكد من عدم تجاوز الحد الأدنى
                if (planeY < minPlaneY) {
                    planeY = minPlaneY;
                    isReturningToBottom = false;
                }
            }
        }
        
        // تطبيق دوران الطائرة إذا كان مفعلاً
        if (planeRotationEnabled) {
            if (keys["ArrowLeft"]) {
                currentPlaneRotation = -15;
                isReturningToStraight = false;
            } else if (keys["ArrowRight"]) {
                currentPlaneRotation = 15;
                isReturningToStraight = false;
            } else {
                // إذا لم يتم الضغط على أي زر، نعيد الطائرة للوضع المستقيم تدريجياً
                if (currentPlaneRotation !== 0) {
                    isReturningToStraight = true;
                    if (currentPlaneRotation > 0) {
                        currentPlaneRotation -= returnSpeed;
                        if (currentPlaneRotation < 0) currentPlaneRotation = 0;
                    } else {
                        currentPlaneRotation += returnSpeed;
                        if (currentPlaneRotation > 0) currentPlaneRotation = 0;
                    }
                }
            }
        } else {
            // إذا تم إيقاف خيار الدوران، نعيد الطائرة للوضع المستقيم تدريجياً
            if (currentPlaneRotation !== 0) {
                isReturningToStraight = true;
                if (currentPlaneRotation > 0) {
                    currentPlaneRotation -= returnSpeed;
                    if (currentPlaneRotation < 0) currentPlaneRotation = 0;
                } else {
                    currentPlaneRotation += returnSpeed;
                    if (currentPlaneRotation > 0) currentPlaneRotation = 0;
                }
            }
        }
        
        // تحديد حدود الحركة الأفقية
        if (planeX < 0) planeX = 0;
        if (planeX > window.innerWidth - 70) planeX = window.innerWidth - 70;
        
        // تحديد حدود الحركة العمودية (400px من الأسفل)
        if (planeY < minPlaneY) planeY = minPlaneY;
        if (planeY > maxPlaneY) planeY = maxPlaneY;
        
        // تطبيق الموضع الجديد للطائرة
        plane.style.left = planeX + "px";
        plane.style.bottom = planeY + "px";
        
        // تطبيق دوران الطائرة
        plane.style.transform = `translateX(-50%) rotate(${currentPlaneRotation}deg)`;
        
        // استدعاء دالة الإطلاق للتحقق من الإطلاق التلقائي أو اليدوي
        autoShoot();
        
        // تحريك الطلقات
        bullets.forEach((b, i) => {
            b.style.bottom = parseInt(b.style.bottom) + 12 + "px";
            if (parseInt(b.style.bottom) > window.innerHeight) {
                b.remove();
                bullets.splice(i, 1);
            }
        });
        
        // تحريك الأعداء والتحقق من الاصطدام (مع تأثير المغناطيس)
        enemies.forEach((e, i) => {
            // الحركة الأساسية
            let step = magnetActive ? 5 : 3; // زيادة السرعة عند تفعيل المغناطيس
            e.style.top = parseInt(e.style.top) + step + "px";
            
            // إذا كان المغناطيس نشطاً، اسحب الهدف أفقياً نحو الطائرة
            if (magnetActive && !e.classList.contains('frozen')) {
                let enemyLeft = parseFloat(e.style.left);
                let dx = planeX - enemyLeft;
                // حركة أفقية بنسبة 5% من المسافة (تجنب الخروج السريع)
                e.style.left = enemyLeft + dx * 0.05 + "px";
                
                // منع الخروج الجانبي
                if (parseFloat(e.style.left) < 0) e.style.left = "0px";
                if (parseFloat(e.style.left) > window.innerWidth - 60) e.style.left = (window.innerWidth - 60) + "px";
            }
            
            if (parseInt(e.style.top) > window.innerHeight) {
                e.remove();
                enemies.splice(i, 1);
                hearts--;
                updateHearts();
                if (hearts <= 0) endGame();
            }
            bullets.forEach((b, j) => {
                const bRect = b.getBoundingClientRect();
                const eRect = e.getBoundingClientRect();
                if (bRect.left < eRect.right && bRect.right > eRect.left &&
                    bRect.top < eRect.bottom && bRect.bottom > eRect.top) {
                    explode(eRect.left, eRect.top);
                    // مضاعفة النقاط إذا كانت الهدية مفعلة
                    const pointsToAdd = doublePointsActive ? 2 : 1;
                    score += pointsToAdd;
                    addCoins(10 * pointsToAdd);
                    scoreDiv.textContent = "النتيجة: " + score;
                    e.remove();
                    b.remove();
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                }
            });
        });
        
        // تحريك القلوب والتحقق من الاصطدام
        heartsOnScreen.forEach((h, k) => {
            h.style.top = parseInt(h.style.top) + 3 + "px";
            if (parseInt(h.style.top) > window.innerHeight) {
                h.remove();
                heartsOnScreen.splice(k, 1);
            }
            bullets.forEach((b, j) => {
                const bRect = b.getBoundingClientRect();
                const hRect = h.getBoundingClientRect();
                if (bRect.left < hRect.right && bRect.right > hRect.left &&
                    bRect.top < hRect.bottom && bRect.bottom > hRect.top) {
                    if (hearts < 7) hearts++;
                    updateHearts();
                    h.remove();
                    b.remove();
                    heartsOnScreen.splice(k, 1);
                    bullets.splice(j, 1);
                }
            });
        });
        
        // تحريك الهدية والتحقق من الاصطدام
        if (gift && giftActiveInGame && gift.parentNode) {
            gift.style.top = parseInt(gift.style.top) + 3 + "px";
            if (parseInt(gift.style.top) > window.innerHeight) {
                gift.remove();
                gift = null;
                giftSpawned = false;
                giftActiveInGame = false;
            }
            
            bullets.forEach((b, j) => {
                // التحقق من وجود الرصاصة والهدية
                if (!b.parentNode || !gift || !gift.parentNode) return;
                
                try {
                    const bRect = b.getBoundingClientRect();
                    const gRect = gift.getBoundingClientRect();
                    
                    if (bRect.left < gRect.right && bRect.right > gRect.left &&
                        bRect.top < gRect.bottom && bRect.bottom > gRect.top) {
                        // تفعيل تأثير الهدية العشوائية
                        activateRandomGiftEffect();
                        
                        // إزالة الرصاصة
                        b.remove();
                        bullets.splice(j, 1);
                    }
                } catch (error) {
                    console.log("خطأ في التحقق من اصطدام الهدية:", error);
                }
            });
        }
    }
    requestAnimationFrame(gameLoop);
}

// العد التنازلي للوقت
let timer = setInterval(() => {
    if (!paused) {
        timeLeft--;
        timeDiv.textContent = `${timeLeft} :الوقت`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }
}, 1000);

restartBtn.addEventListener("click", () => {
    hideAllScreens(); // إخفاء جميع الشاشات عند إعادة التشغيل
    resetGame();
    clearInterval(timer);
    timeLeft = 150;
    timer = setInterval(() => {
        if (!paused) {
            timeLeft--;
            timeDiv.textContent = `${timeLeft} :الوقت`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }
    }, 1000);
});

// تحميل البيانات عند بدء اللعبة
loadGameData();

// بدء اللعبة
setInterval(spawnEnemy, 1500);
gameLoop();

// التأكيد على أن اللعبة متوقفة في البداية
setTimeout(() => {
    paused = true;
    pauseBtn.textContent = "▶ استئناف";
    console.log("اللعبة متوقفة في البداية");
}, 100);
