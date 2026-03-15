// بيانات الطائرات
const planesData = [
    {
        plane: "airplane1",
        bullet: "bullets.png",
        price: 0,
        speed: 150,
        image: "image/Airplane/airplane1.png",
        bulletImage: "image/bullets.png",
        displayPrice: "مجانـي"
    },
    {
        plane: "airplane4",
        bullet: "bullets3.png",
        price: 1000,
        speed: 140,
        image: "image/Airplane/airplane4.png",
        bulletImage: "image/bullets3.png",
        displayPrice: "1,000"
    },
    {
        plane: "airplane3",
        bullet: "bullets2.png",
        price: 2300,
        speed: 130,
        image: "image/Airplane/airplane3.png",
        bulletImage: "image/bullets2.png",
        displayPrice: "2,300"
    },
    {
        plane: "airplane5",
        bullet: "bullets4.png",
        price: 3000,
        speed: 120,
        image: "image/Airplane/airplane5.png",
        bulletImage: "image/bullets4.png",
        displayPrice: "3,000"
    },
    {
        plane: "airplane6",
        bullet: "bullets5.png",
        price: 4750,
        speed: 110,
        image: "image/Airplane/airplane6.png",
        bulletImage: "image/bullets5.png",
        displayPrice: "4,750", 
        bulletOffset: 38
    },
    {
        plane: "airplane7",
        bullet: "bullets6.png",
        price: 6000,
        speed: 100,
        image: "image/Airplane/airplane7.png",
        bulletImage: "image/bullets6.png",
        displayPrice: "6,000"
    },
    {
    plane: "airplane8",
    bullet: "bullets7.png",
    price: 7500,           
    speed: 90,                     
    image: "image/Airplane/airplane8.png",
    bulletImage: "image/bullets7.png",
    displayPrice: "7,500",          
    bulletOffset: 38
    }
];

// بيانات الخلفيات
const backgroundsData = [
    {
        bg: "default",
        price: 0,
        displayPrice: "",
        content: '<span>إفتراضي</span>'
    },
    {
        bg: "bg1",
        price: 1000,
        displayPrice: "1000",
        content: '<img src="image/img1.jpg" alt="">'
    },
    {
        bg: "bg2",
        price: 1000,
        displayPrice: "1000",
        content: '<img src="image/img2.jpg" alt="">'
    },
    {
        bg: "bg3",
        price: 1000,
        displayPrice: "1000",
        content: '<img src="image/img4.jpg" alt="">'
    },
    {
        bg: "bg4",
        price: 1000,
        displayPrice: "1000",
        content: '<img src="image/img5.png" alt="">'
    },
    {
        bg: "bg5",
        price: 1000,
        displayPrice: "1000",
        content: '<img src="image/img6.jpg" alt="">'
    },
    {
        bg: "bg6",
        price: 2000,
        displayPrice: "2,000",
        content: '<img src="image/img7.png" alt="">'
    },
    {
        bg: "bg7",
        price: 3000,
        displayPrice: "3,000",
        content: '<img src="image/img8.jpg" alt="">'
    },
    {
        bg: "bg8",
        price: 4000,
        displayPrice: "4,000",
        content: '<img src="image/img9.jpg" alt="">'
    }
];

// بيانات الهدايا
const giftsData = [
    {
        id: "clock",
        name: "زيادة الوقت",
        image: "image/clock.png",
        description: "تمديد الوقت 20 ثانية",
        effect: function() {
            timeLeft += 20;
            timeDiv.textContent = `${timeLeft} :الوقت`;
            showNotification("تم تمديد الوقت 20 ثانية!");
        },
        price: 0,
        displayPrice: "مجانـي"
    },
    {
        id: "bomb",
        name: "تفجير الأهداف",
        image: "image/Bomb.png",
        description: "تفجير 5 أهداف عشوائية",
        effect: function() {
            destroyRandomEnemies(5);
            showNotification("تم تفجير 5 أهداف!");
        },
        price: 0,
        displayPrice: "مجانـي"
    },
    {
        id: "shield",
        name: "زيادة القلوب",
        image: "image/heart.png",
        description: "الحصول على قلبين",
        effect: function() {
            activateShield(10);
            showNotification("تم تفعيل الحصول على قلبين!");
        },
        price: 4000,
        displayPrice: "4000"
    },
    {
        id: "double_points",
        name: "نقاط مضاعفة",
        image: "image/double.png",
        description: "مضاعفة النقاط لمدة 15 ثانية",
        effect: function() {
            activateDoublePoints(15);
            showNotification("تم تفعيل مضاعفة النقاط لمدة 15 ثانية!");
        },
        price: 4000,
        displayPrice: "4000"
    },
    {
        id: "target",
        name: "تتبع الأهداف",
        image: "image/target.png",
        description: "تتبع الطلقات للأهداف لمدة 7 ثواني",
        effect: function() {
            activateTargetTracking(7);
            showNotification("تم تفعيل تتبع الأهداف لمدة 7 ثانية!");
        },
        price: 4000,
        displayPrice: "4000"
    },
    {
        id: "magnet",
        name: "جذب الأهداف",
        image: "image/magnet.png",
        description: "جذب الأهداف للطلقات لمدة 7 ثواني",
        effect: function() {
            activateMagnet(7);
            showNotification("تم تفعيل جذب الأهداف لمدة 7 ثانية!");
        },
        price: 4000,
        displayPrice: "4000"
    },
    {
        id: "freeze",
        name: "تجميد الأعداء",
        image: "image/freeze.png",
        description: "تجميد جميع الأعداء لمدة 5 ثواني",
        effect: function() {
            freezeEnemies(5);
            showNotification("تم تجميد الأعداء لمدة 5 ثواني!");
        },
        price: 4000,
        displayPrice: "4000"
    }
];



// ------------------------------
window.addEventListener("load", () => {

    const bar = document.getElementById("progress");
    const percent = document.getElementById("percent");
    const loader = document.getElementById("gameLoader");

    if (!bar || !percent || !loader) return;

    const images = [...document.images];
    let loadedImages = 0;
    let totalImages = images.length || 1;

    function updateProgress() {

        loadedImages++;

        let progress = Math.floor((loadedImages / totalImages) * 100);

        bar.style.width = progress + "%";
        percent.textContent = progress + "%";

        // عند اكتمال التحميل
        if (progress >= 100) {

            percent.textContent = "اكتمل التحميل";

            setTimeout(() => {

                loader.style.opacity = "0";
                loader.style.transition = "opacity 0.6s";

                setTimeout(() => {
                    loader.remove();
                }, 600);

            }, 500);

        }
    }

    images.forEach(img => {

        if (img.complete) {
            updateProgress();
        } else {
            img.addEventListener("load", updateProgress);
            img.addEventListener("error", updateProgress);
        }

    });

});
