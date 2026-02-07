/**
 * BẢN QUYỀN THUỘC VỀ DEV LONG NGUYỄN
 * CORE LOGIC V5 - FULL STANDARD VERSION
 * Tích hợp: Remote Config (CDN), Anti-Cache, Auto-Init, Bridge UI
 */

// =================================================================
// 1. CẤU HÌNH QUẢN LÝ TỪ XA (REMOTE CONFIG - CDN)
// =================================================================
// Link file cấu hình trên GitHub của bạn (Dùng CDN để cập nhật nhanh)
const CONFIG_URL = "https://tieuli158.github.io/Tieuli/mmlive_core.js";

// Hàm kiểm tra trạng thái (Chạy đầu tiên - Cổng an ninh)
async function checkRemoteStatus() {
    try {
        console.log("📡 Core: Đang kiểm tra trạng thái Server...");
        // Thêm timestamp để ép trình duyệt không dùng Cache cũ, luôn lấy config mới nhất
        const response = await fetch(CONFIG_URL + "?v=" + new Date().getTime());
        
        if (!response.ok) throw new Error("Không thể tải Config từ Server");

        const config = await response.json();
        console.log("📡 Trạng thái Server:", config.status);

        if (config.status !== "ACTIVE") {
            // NẾU OFF -> KÍCH HOẠT MÀN HÌNH KHÓA TRÊN HTML NGAY LẬP TỨC
            
            // 1. Ẩn Loader quay quay
            const loader = document.getElementById('server-loader');
            if(loader) loader.style.display = 'none';

            // 2. Hiện màn hình khóa (Nếu có trong HTML)
            const lockScreen = document.getElementById('lock-screen');
            if(lockScreen) {
                lockScreen.style.display = 'flex';
                // Cập nhật nội dung thông báo từ Config
                const msgEl = document.getElementById('lock-message');
                if(msgEl) msgEl.innerText = config.message || "Hệ thống đang bảo trì.";
                
                const contactEl = document.getElementById('lock-contact');
                if(contactEl) contactEl.innerText = config.contact || "Liên hệ Admin";
            } else {
                // Fallback: Nếu HTML thiếu màn hình khóa thì xóa trắng body và hiện chữ
                document.body.innerHTML = `
                    <div style="background:#0f0c29; color:#ff4757; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:sans-serif; text-align:center; padding:20px;">
                        <div style="font-size:60px; margin-bottom:20px;">🔒</div>
                        <h1 style="margin:0 0 10px 0;">HỆ THỐNG TẠM KHÓA</h1>
                        <p style="color:#ccc; font-size:16px;">${config.message || "Vui lòng quay lại sau."}</p>
                        <button onclick="location.reload()" style="margin-top:30px; padding:12px 30px; background:#3498db; color:white; border:none; border-radius:8px; cursor:pointer;">Thử lại</button>
                    </div>
                `;
            }
            
            // Ném lỗi để dừng toàn bộ code phía sau (Code buff sẽ không bao giờ chạy)
            throw new Error("⛔ Tool suspended by Remote Config!");
        }
        
        // Nếu ACTIVE thì return true để chạy tiếp
        console.log("✅ Server ACTIVE. Khởi động Tool...");
        return true; 

    } catch (error) {
        console.error("Config Error:", error);
        
        // QUAN TRỌNG: Xử lý khi lỗi mạng hoặc không tải được Config
        // Nếu muốn AN TOÀN TUYỆT ĐỐI (Lỗi mạng = Khóa luôn): Hãy bỏ comment dòng 'throw error;'
        // Nếu muốn LINH HOẠT (Lỗi mạng vẫn cho khách dùng): Hãy để nguyên 'return true;'
        
        // throw error; // <--- Bỏ comment dòng này nếu muốn chặn khi mất mạng
        return true; 
    }
}

// =================================================================
// 2. THƯ VIỆN MÃ HÓA MD5 (FULL CODE - KHÔNG ĐƯỢC XÓA)
// =================================================================
function md5(string) {
    function rotateLeft(value, amount) { var lbits = value << amount; var rbits = value >>> (32 - amount); return (lbits | rbits) & 0xFFFFFFFF; }
    function addUnsigned(lX, lY) { var lX4, lY4, lX8, lY8, lResult; lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000); lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000); lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF); if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8); if (lX4 | lY4) { if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8); else return (lResult ^ 0x40000000 ^ lX8 ^ lY8); } else return (lResult ^ lX8 ^ lY8); }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
    function GG(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
    function HH(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
    function II(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
    function convertToWordArray(string) { var lWordCount; var lMessageLength = string.length; var lNumberOfWords_temp1 = lMessageLength + 8; var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64; var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16; var lWordArray = Array(lNumberOfWords - 1); var lBytePosition = 0; var lByteCount = 0; while (lByteCount < lMessageLength) { lWordCount = (lByteCount - (lByteCount % 4)) / 4; lBytePosition = (lByteCount % 4) * 8; lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition)); lByteCount++; } lWordCount = (lByteCount - (lByteCount % 4)) / 4; lBytePosition = (lByteCount % 4) * 8; lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition); lWordArray[lNumberOfWords - 2] = lMessageLength << 3; lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29; return lWordArray; }
    function wordToHex(lValue) { var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount; for (lCount = 0; lCount <= 3; lCount++) { lByte = (lValue >>> (lCount * 8)) & 255; WordToHexValue_temp = "0" + lByte.toString(16); WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2); } return WordToHexValue; }
    var x = Array(); var k, AA, BB, CC, DD, a, b, c, d; var S11 = 7, S12 = 12, S13 = 17, S14 = 22; var S21 = 5, S22 = 9, S23 = 14, S24 = 20; var S31 = 4, S32 = 11, S33 = 16, S34 = 23; var S41 = 6, S42 = 10, S43 = 15, S44 = 21; string = string.replace(/\r\n/g, "\n"); var utftext = ""; for (var n = 0; n < string.length; n++) { var c = string.charCodeAt(n); if (c < 128) { utftext += String.fromCharCode(c); } else if ((c > 127) && (c < 2048)) { utftext += String.fromCharCode((c >> 6) | 192); utftext += String.fromCharCode((c & 63) | 128); } else { utftext += String.fromCharCode((c >> 12) | 224); utftext += String.fromCharCode(((c >> 6) & 63) | 128); utftext += String.fromCharCode((c & 63) | 128); } } x = convertToWordArray(utftext); a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476; for (k = 0; k < x.length; k += 16) { AA = a; BB = b; CC = c; DD = d; a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE); a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A); c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501); a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF); c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE); a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193); c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821); a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340); c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA); a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8); a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6); c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED); a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8); c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A); a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681); c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C); a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9); c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70); a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA); c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05); a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5); c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665); a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97); c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039); a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92); c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1); a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0); c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1); a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82); d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235); c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB); b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391); a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD); } return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// =================================================================
// 3. CÁC HÀM TIỆN ÍCH & API (LOGIN, INFO, IDOL)
// =================================================================

// Hàm tạo GUID (Device ID)
function getGuid() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000000000000000);
    const combinedData = `${timestamp}${random}DevLongVip`; // Salt riêng
    return md5(combinedData).substr(0, 32);
}

// -----------------------------------------------------------
// A. HÀM ĐĂNG NHẬP API (Promise)
// -----------------------------------------------------------
async function loginAPI(mobile, password) {
    const timestamp = new Date().getTime();
    const uid = getGuid();
    const sign = md5(`${uid}jgyh,kasd${timestamp}`);
    const xSign = md5(`${uid}jgyh,kasd${timestamp}`);
    
    try {
        const response = await fetch('https://gateway.mmlive.online/center-client/sys/auth/new/phone/login', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json;charset=UTF-8',
                'appid': 'MMLive',
                'x-appversion': '2.5.0',
                'x-language': 'VI',
                'x-sign': xSign,
                'x-timestamp': timestamp.toString(),
                'x-udid': uid
            },
            body: JSON.stringify({
                os: 0,
                sign: sign,
                timestamp: timestamp,
                udid: uid,
                model: "PC",
                mobile: mobile,
                password: password,
                version: "1.0.2"
            })
        });

        const result = await response.json();
        
        if (response.ok && result.code === 0 && result.data && result.data.token) {
            // Lưu Auth Token & UDID vào localStorage
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('udid', uid);
            return { success: true, data: result.data };
        } else {
            return { success: false, error: result.msg || "Lỗi đăng nhập không xác định" };
        }
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// -----------------------------------------------------------
// B. KIỂM TRA TRẠNG THÁI LOGIN
// -----------------------------------------------------------
function isLoggedIn() {
    const token = localStorage.getItem('authToken');
    return token && token.length > 0;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('udid');
}

// -----------------------------------------------------------
// C. LẤY THÔNG TIN USER (GET USER INFO)
// -----------------------------------------------------------
async function getUserInfo() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
        const udid = localStorage.getItem('udid') || getGuid();
        const timestamp = new Date().getTime();
        const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
        
        const response = await fetch('https://gateway.mmlive.online/center-client/sys/user/get/info', {
            method: 'POST',
            headers: {
                'authorization': `HSBox ${token}`,
                'content-type': 'application/json;charset=UTF-8',
                'appid': 'MMLive',
                'x-sign': xSign,
                'x-timestamp': timestamp.toString(),
                'x-udid': udid
            },
            body: JSON.stringify({ "os": 0 })
        });
        
        const result = await response.json();
        // Trả về data user nếu thành công, null nếu thất bại
        return (result.code === 0) ? result.data : null;
    } catch (e) {
        return null;
    }
}

// -----------------------------------------------------------
// D. LẤY DANH SÁCH IDOL (GET IDOL LIST)
// -----------------------------------------------------------
async function getIdolList() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const udid = localStorage.getItem('udid') || getGuid();
        const timestamp = new Date().getTime();
        const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
        
        const response = await fetch('https://gateway.mmlive.online/live-client/live/new/4231/1529/list', {
            method: 'POST',
            headers: {
                'authorization': `HSBox ${token}`,
                'content-type': 'application/json;charset=UTF-8',
                'appid': 'MMLive',
                'x-sign': xSign,
                'x-timestamp': timestamp.toString(),
                'x-udid': udid
            },
            body: JSON.stringify({ "type": 1, "os": 0 })
        });
        
        const result = await response.json();
        // Trả về mảng idol hoặc mảng rỗng
        return (result.code === 0 && result.data) ? result.data : [];
    } catch (e) {
        return null;
    }
}

// =================================================================
// 4. BUSINESS LOGIC (CHỨA CODE ĐỘT PHÁ CỦA DEV LONG)
// =================================================================

// Biến toàn cục để điều khiển luồng chạy
let isRunning = false;
let shouldStop = false;
let GLOBAL_CONFIG = { liveId: 0, anchorId: 0 }; 

// --- Hàm xử lý khi user chọn Idol ---
function selectApiIdolByAnchorId(anchorId) {
    // 1. Tìm thông tin idol trong data đã tải (nếu có)
    // Lưu ý: window.apiIdolsData được set bởi HTML khi render
    if (window.apiIdolsData) {
        const idol = window.apiIdolsData.find(i => i.anchorId == anchorId);
        if (idol) {
            GLOBAL_CONFIG.liveId = idol.liveId;
            GLOBAL_CONFIG.anchorId = idol.anchorId;
            
            // Cập nhật UI banner idol đang chọn
            const banner = document.getElementById('selectedIdolDetails');
            const bannerContainer = document.getElementById('selectedIdolInfo');
            if (banner && bannerContainer) {
                bannerContainer.style.display = 'block';
                banner.innerHTML = `
                    <div style="display:flex;align-items:center;gap:10px;">
                        <img src="${idol.avatar}" style="width:40px;height:40px;border-radius:50%;border:2px solid white;">
                        <div>
                            <div style="font-weight:bold;color:#006266">${idol.nickname}</div>
                            <div style="font-size:0.7rem;">ID: ${idol.anchorId}</div>
                        </div>
                    </div>
                    <div style="font-weight:bold;color:#e17055;">ĐANG CHỌN</div>
                `;
            }
            
            // Cập nhật vào ô thông tin Anchor
            if(document.getElementById('displayAnchorId')) {
                document.getElementById('displayAnchorId').innerText = idol.anchorId;
                document.getElementById('displayAnchorId').style.color = '#00b894';
            }
        }
    }
}

// --- HÀM DỪNG CHẠY ---
function stopRunning() {
    if (isRunning) {
        shouldStop = true;
        // Cập nhật Log
        const log = document.getElementById('runResults');
        if(log) log.innerHTML += `<div style="color:#ff7675">[STOP] Đã gửi lệnh dừng...</div>`;
    }
}

// --- HÀM XÓA LOG ---
function clearResults() {
    const resDiv = document.getElementById('runResults');
    if(resDiv) resDiv.innerHTML = '';
    const progText = document.getElementById('progressText');
    if(progText) progText.innerText = 'Sẵn sàng...';
    const progBar = document.getElementById('progressBar');
    if(progBar) progBar.style.width = '0%';
}

// =================================================================
// 🔥 KHU VỰC DÁN CODE ĐỘT PHÁ CỦA BẠN 🔥
// =================================================================

// 1. Hàm Buff View (Turbo Mode)
async function runTurboModeWithInput() {
    if (isRunning) { alert("Đang có tiến trình chạy! Vui lòng bấm STOP trước."); return; }
    if (!GLOBAL_CONFIG.anchorId) { alert("Vui lòng chọn 1 Idol trước!"); return; }
    
    // Lấy số lượng từ input
    const countEl = document.getElementById('customRequests');
    const totalReq = countEl ? (parseInt(countEl.value) || 1000) : 1000;
    
    if(!confirm(`🚀 Bắt đầu BUFF ${totalReq} requests cho Idol ${GLOBAL_CONFIG.anchorId}?`)) return;
    
    // --- BẮT ĐẦU LOGIC ĐỘT PHÁ ---
    isRunning = true;
    shouldStop = false;
    
    // Hiển thị panel log
    if(document.getElementById('runResultsPanel')) {
        document.getElementById('runResultsPanel').style.display = 'block';
    }
    
    // DÁN CODE BUFF CỦA BẠN VÀO ĐÂY (Thay thế đoạn demo này)
    // -------------------------------------------------------
    let success = 0;
    const logDiv = document.getElementById('runResults');
    const progBar = document.getElementById('progressBar');
    const progText = document.getElementById('progressText');
    const progCount = document.getElementById('progressCount');
    
    logDiv.innerHTML += `<div style="color:#74b9ff">🚀 Khởi động Turbo Mode...</div>`;
    
    for(let i=1; i<=totalReq; i++) {
        if(shouldStop) {
            logDiv.innerHTML += `<div style="color:#ff7675">⛔ Đã dừng bởi người dùng.</div>`;
            break;
        }
        
        // Giả lập request (Thay bằng fetch thật của bạn)
        // await fetch(...) 
        await new Promise(r => setTimeout(r, 10)); // Delay giả
        
        success++;
        
        // Update UI (đừng update liên tục để tránh lag, update mỗi 10 cái)
        if(i % 10 === 0 || i === totalReq) {
            const percent = (i / totalReq) * 100;
            if(progBar) progBar.style.width = `${percent}%`;
            if(progText) progText.innerText = `Đang gửi: ${i}/${totalReq}`;
            if(progCount) progCount.innerText = `${percent.toFixed(1)}%`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    }
    
    logDiv.innerHTML += `<div style="color:#55efc4">✅ Hoàn tất! Thành công: ${success}</div>`;
    // -------------------------------------------------------
    
    isRunning = false;
}

// 2. Hàm Phá Idol (Spam)
async function runPhaIdolMode() {
    if (isRunning) { alert("Đang chạy rồi!"); return; }
    if (!GLOBAL_CONFIG.anchorId) { alert("Chọn Idol cần phá trước!"); return; }
    
    if(!confirm(`💥 CẢNH BÁO: Chế độ Phá Idol sẽ chạy liên tục cho đến khi bấm STOP.\n\nTiếp tục?`)) return;

    isRunning = true;
    shouldStop = false;
    
    if(document.getElementById('runResultsPanel')) {
        document.getElementById('runResultsPanel').style.display = 'block';
    }
    
    const logDiv = document.getElementById('runResults');
    logDiv.innerHTML += `<div style="color:#ff7675">💥 Bắt đầu chế độ SPAM (Phá Idol)...</div>`;
    
    // DÁN CODE PHÁ IDOL CỦA BẠN VÀO ĐÂY
    // -------------------------------------------------------
    let count = 0;
    while(!shouldStop) {
        count++;
        // Giả lập logic spam
        await new Promise(r => setTimeout(r, 50)); 
        
        if(count % 50 === 0) {
            logDiv.innerHTML += `<div style="color:#a29bfe">⚡ Đã spam ${count} gói tin...</div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    }
    logDiv.innerHTML += `<div style="color:#ff7675">⛔ Đã dừng Spam. Tổng: ${count}</div>`;
    // -------------------------------------------------------
    
    isRunning = false;
}

// =================================================================
// 5. HÀM KHỞI TẠO (INIT APP) - TRÁI TIM CỦA TOOL
// =================================================================

async function initApp() {
    console.log("🚀 Init App from Core...");
    
    // 1. Kiểm tra trạng thái Server (Bắt buộc)
    // Nếu checkRemoteStatus ném lỗi -> Code sẽ dừng ngay tại đây
    try {
        await checkRemoteStatus(); 
    } catch (e) {
        console.error("⛔ App stopped by Remote Config");
        return; // Dừng, không làm gì nữa
    }
    
    // 2. Nếu Server Active -> Tiếp tục Logic App
    if (isLoggedIn()) {
        console.log("✅ User logged in. Fetching data...");
        
        // Tải thông tin User và cập nhật lên HTML
        const user = await getUserInfo();
        if (window.updateUserInfoDisplay) window.updateUserInfoDisplay(user);
        
        // Tải danh sách Idol và render lên HTML
        const idols = await getIdolList();
        if (window.renderApiIdolList && idols) window.renderApiIdolList(idols);
        
    } else {
        console.log("ℹ️ User not logged in.");
    }
}

// =================================================================
// 6. EXPORT GLOBAL (ĐỂ HTML GỌI ĐƯỢC)
// =================================================================
window.loginAPI = loginAPI;
window.isLoggedIn = isLoggedIn;
window.logout = logout;
window.initApp = initApp;
window.runTurboModeWithInput = runTurboModeWithInput;
window.runPhaIdolMode = runPhaIdolMode;
window.stopRunning = stopRunning;
window.clearResults = clearResults;
window.selectApiIdolByAnchorId = selectApiIdolByAnchorId;


