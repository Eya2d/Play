function customAlert(message){

    // الخلفية
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.paddingTop = "20px";
    overlay.style.top = "0px";
    overlay.style.left = "0px";
    overlay.style.width = "100%";
    overlay.style.bottom = "0";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "baseline";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "999999";

    // صندوق الرسالة
    const box = document.createElement("div");
    box.style.background = "rgb(66 71 84)";
    box.style.boxShadow = "0px 2px 25px #1d1e22";
    box.style.fontFamily = "system-ui";
    box.style.padding = "20px";
    box.style.borderRadius = "10px";
    box.style.minWidth = "360px";
    box.style.maxWidth = "100%";
    box.style.textAlign = "right";
    box.style.color = "#fff";

    // النص
    const text = document.createElement("div");
    text.innerText = message;
    text.style.marginBottom = "15px";

    // الزر
    const btn = document.createElement("button");
    btn.className = "Wave-cloud";
    btn.innerText = "موافق";
    btn.style.padding = "8px 18px";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.style.background = "#3b82f6";
    btn.style.color = "#fff";

    btn.onclick = ()=>{
        document.body.removeChild(overlay);
    };

    box.appendChild(text);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

// استبدال alert الافتراضي
window.alert = customAlert;
