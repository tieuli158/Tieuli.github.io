/**
 * LONG NGUYEN SYSTEM - CORE LOGIC
 * File này chứa toàn bộ mã nguồn vận hành.
 * Nó sẽ kiểm tra Key trước khi chạy.
 */

(async function() {
    console.log("🔒 Đang kết nối máy chủ Long Nguyễn...");
    
    // 1. CẤU HÌNH (Bạn thay link file admin_config.json của bạn vào đây)
    const CONFIG_URL = 'https://raw.githubusercontent.com/YOUR_GITHUB_USER/YOUR_REPO/main/admin_config.json';
    
    // Lấy Key từ file HTML khách
    const userKey = window.USER_LICENSE_KEY;

    // Giao diện Loading bảo mật
    const overlay = document.createElement('div');
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#0f0c29;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:sans-serif;";
    overlay.innerHTML = '<div style="width:40px;height:40px;border:4px solid #fff;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div><h3>Đang xác thực bản quyền...</h3><style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';
    document.body.appendChild(overlay);

    try {
        // 2. Tải file cấu hình Admin
        const response = await fetch(CONFIG_URL + '?t=' + new Date().getTime());
        if (!response.ok) throw new Error("Không thể kết nối Server");
        const config = await response.json();

        // 3. Kiểm tra Bảo trì
        if (config.maintenance_mode) {
            overlay.innerHTML = `<h2 style="color:#e74c3c">HỆ THỐNG BẢO TRÌ</h2><p>${config.maintenance_message}</p>`;
            return; // Dừng code
        }

        // 4. Kiểm tra Key
        const userData = config.users[userKey];
        if (!userData || userData.active === false) {
            overlay.innerHTML = `<h2 style="color:#e74c3c">TRUY CẬP BỊ TỪ CHỐI</h2><p>${config.banned_message}</p><p style="color:#777;font-size:0.8em">Mã lỗi: KEY_INVALID_OR_BANNED</p>`;
            return; // Dừng code
        }

        // 5. Kiểm tra thiết bị (Chống dùng chung đơn giản bằng localStorage)
        // Nếu user này chưa có HWID lưu trên máy khách, bỏ qua (hoặc bạn có thể code phức tạp hơn nếu muốn)
        console.log(`✅ Chào mừng ${userData.name}. Bản quyền hợp lệ.`);
        
        // Xóa màn hình loading
        overlay.remove();
        
        // Hiển thị giao diện chính (Mặc định file HTML đang ẩn body)
        document.body.style.display = 'block';

        // ============================================================
        // BẮT ĐẦU CHẠY CODE TOOL GỐC (MD5, LOGIN, BUFF...)
        // ============================================================
        
        startToolLogic();

    } catch (e) {
        console.error(e);
        overlay.innerHTML = `<h3 style="color:orange">LỖI KẾT NỐI</h3><p>Vui lòng kiểm tra internet và tải lại trang.</p>`;
    }

    // --- HÀM CHỨA TOÀN BỘ LOGIC CŨ ---
    function startToolLogic() {
        
        // MD5 implementation
        window.md5 = function(string) {
            function rotateLeft(value, amount) {
                var lbits = value << amount;
                var rbits = value >>> (32 - amount);
                return (lbits | rbits) & 0xFFFFFFFF;
            }
            function addUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) { return (lResult ^ 0x80000000 ^ lX8 ^ lY8); }
                if (lX4 | lY4) { if (lResult & 0x40000000) { return (lResult ^ 0xC0000000 ^ lX8 ^ lY8); } else { return (lResult ^ 0x40000000 ^ lX8 ^ lY8); } } else { return (lResult ^ lX8 ^ lY8); }
            }
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
        };

        // GLOBAL CONFIGURATION VARIABLES
        window.GLOBAL_CONFIG = {
            liveId: 1027295,        
            anchorId: 2026922943    
        };

        window.selectedIdol = null;

        // FUNCTIONS GỐC CỦA BẠN (Đã chuyển vào đây)
        window.resetCustomRequests = function() {
            const input = document.getElementById('customRequests');
            if(input) {
                input.value = 0;
                input.style.transition = 'all 0.1s';
                input.style.transform = 'scale(0.95)';
                setTimeout(() => { input.style.transform = 'scale(1)'; }, 100);
            }
        }

        window.addToCustomView = function(amount) {
            const input = document.getElementById('customRequests');
            if(input) {
                let currentVal = parseInt(input.value) || 0;
                let newVal = currentVal + amount;
                if (newVal > 10000) newVal = 10000; 
                input.value = newVal;
                input.style.transition = 'all 0.1s';
                input.style.transform = 'scale(1.1)';
                input.style.color = '#fff';
                setTimeout(() => {
                    input.style.transform = 'scale(1)';
                    input.style.color = 'var(--accent-color)';
                }, 150);
            }
        }

        // RENDER IDOL LIST
        window.renderIdolList = function() {
            const idolGrid = document.getElementById('idolGrid');
            if (!idolGrid) return;
            if (window.apiIdolsData && window.apiIdolsData.length > 0) {
                renderApiIdolList(window.apiIdolsData);
                return;
            }
            idolGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1; padding: 40px;">Đang tải danh sách idol...<br><small>Vui lòng đăng nhập để xem danh sách idol</small></p>';
        }

        window.selectIdol = function(idol) {
            window.selectedIdol = idol;
            window.GLOBAL_CONFIG.liveId = idol.liveId;
            window.GLOBAL_CONFIG.anchorId = idol.anchorId;
            updateSelectedIdolInfo(idol);
            updateIdolCardSelection();
            updateToolSectionDisplay(idol);
        }

        window.updateToolSectionDisplay = function(idol) {
            const anchorIdElement = document.getElementById('displayAnchorId');
            if (anchorIdElement) {
                anchorIdElement.textContent = idol.anchorId;
                anchorIdElement.style.color = '#28a745';
                anchorIdElement.title = `Anchor ID từ ${idol.nickname}`;
            }
        }

        window.updateSelectedIdolInfo = function(idol) {
            const selectedInfo = document.getElementById('selectedIdolInfo');
            const selectedDetails = document.getElementById('selectedIdolDetails');
            if (selectedInfo && selectedDetails) {
                selectedDetails.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="${idol.avatar}" alt="${idol.nickname}" 
                             style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
                             onerror="this.style.display='none'">
                        <div>
                            <div style="font-weight: 800; font-size: 1.1rem;">${idol.nickname || 'Unknown'}</div>
                            <div style="font-size: 0.85rem; opacity: 0.8;">Live ID: ${idol.liveId}</div>
                        </div>
                    </div>
                    <div style="font-weight: 700; font-family: monospace; background: rgba(255,255,255,0.3); padding: 5px 10px; border-radius: 8px;">
                        ANCHOR: ${idol.anchorId || 'N/A'}
                    </div>
                `;
                selectedInfo.style.display = 'flex';
            }
        }

        window.updateIdolCardSelection = function() {
            const idolCards = document.querySelectorAll('.idol-card');
            idolCards.forEach(card => card.classList.remove('selected'));
            if (window.selectedIdol) {
                idolCards.forEach((card, index) => {
                    const cardIdolId = card.getAttribute('data-idol-id');
                    const matchLoose = cardIdolId == window.selectedIdol.id;
                    const matchStrict = cardIdolId === String(window.selectedIdol.id);
                    if (matchLoose || matchStrict) {
                        card.classList.add('selected');
                    }
                });
            }
        }

        window.getGuid = function() {
            const timestamp = new Date().getTime();
            const random = Math.floor(Math.random() * 10000000000000000);
            const combinedData = `${timestamp}${random}YourDeviceInfoHere`;
            return md5(combinedData).substr(0, 32);
        }

        window.loginAPI = async function(mobile, password) {
            const timestamp = new Date().getTime();
            const uid = getGuid();
            const sign = md5(`${uid}jgyh,kasd${timestamp}`);
            const xSign = md5(`${uid}jgyh,kasd${timestamp}`);

            const loginParams = {
                os: 0, sign: sign, timestamp: timestamp, udid: uid, model: "PC",
                mobile: mobile, password: password, version: "1.0.2", softVersion: "1.0.0"
            };

            try {
                const response = await fetch('https://gateway.mmlive.online/center-client/sys/auth/new/phone/login', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*', 'accept-language': 'VI', 'appid': 'MMLive',
                        'content-type': 'application/json;charset=UTF-8', 'n-l': 'Y', 'origin': 'https://mmlive.online', 'os': '0', 'p-g': 'N',
                        'referer': 'https://mmlive.online/', 'x-appversion': '2.5.0', 'x-language': 'VI', 'x-sign': xSign, 'x-timestamp': timestamp.toString(), 'x-udid': uid
                    },
                    body: JSON.stringify(loginParams)
                });
                let result = await response.json();
                if (response.ok && result.code === 0) {
                    if (!result.data || !result.data.token) return { success: false, error: 'Không nhận được token từ server' };
                    localStorage.setItem('authToken', result.data.token);
                    localStorage.setItem('randomKey', result.data.randomKey || '');
                    localStorage.setItem('randomVector', result.data.randomVector || '');
                    localStorage.setItem('loginTime', new Date().toISOString());
                    localStorage.setItem('udid', uid);
                    return { success: true, data: result.data, message: result.msg || 'Đăng nhập thành công' };
                } else {
                    return { success: false, error: result.msg || result.message || `HTTP ${response.status}` };
                }
            } catch (error) {
                return { success: false, error: error.message || 'Lỗi kết nối mạng' };
            }
        }

        window.isLoggedIn = function() {
            const token = localStorage.getItem('authToken');
            return token && token.length > 0;
        }

        window.getLoginInfo = function() {
            return {
                token: localStorage.getItem('authToken'),
                randomKey: localStorage.getItem('randomKey'),
                randomVector: localStorage.getItem('randomVector'),
                loginTime: localStorage.getItem('loginTime')
            };
        }

        window.logout = function() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('randomKey');
            localStorage.removeItem('randomVector');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('udid');
        }

        window.getTokenData = function() {
            const token = localStorage.getItem('authToken');
            if (!token) return { userId: null, udid: null };
            try {
                const parts = token.split('.');
                if (parts.length !== 3) return { userId: null, udid: null };
                let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                while (payload.length % 4) { payload += '='; }
                const decodedPayload = atob(payload);
                const userData = JSON.parse(decodedPayload);
                const userId = userData.userId || userData.id || userData.sub || userData.user_id || userData.uid;
                const udid = userData.udid || userData.deviceId || userData.device_id || userData.uuid;
                return { userId, udid };
            } catch (error) {
                return { userId: null, udid: null };
            }
        }

        window.getUserInfo = async function() {
            const loginInfo = getLoginInfo();
            if (!loginInfo.token) return null;
            const tokenData = getTokenData();
            const udid = tokenData.udid || localStorage.getItem('udid') || getGuid();
            const timestamp = new Date().getTime();
            const xSign = md5(`${udid}jgyh,kasd${timestamp}`)
            try {
                const response = await fetch('https://gateway.mmlive.online/center-client/sys/user/get/info', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*', 'accept-language': 'VI', 'appid': 'MMLive', 'authorization': `HSBox ${loginInfo.token}`,
                        'content-type': 'application/json;charset=UTF-8', 'n-l': 'Y', 'origin': 'https://mmlive.online', 'os': '0', 'p-g': 'N', 'referer': 'https://mmlive.online/',
                        'x-appversion': '2.5.0', 'x-language': 'VI', 'x-sign': xSign, 'x-timestamp': timestamp.toString(), 'x-udid': udid
                    },
                    body: JSON.stringify({ "os": 0 })
                });
                const result = await response.json();
                if (result.code === 0 && result.data) return result.data;
                else return null;
            } catch (error) { return null; }
        }

        window.updateUserInfoDisplay = function(userDetail = null) {
            const tokenData = getTokenData();
            const userId = tokenData.userId;
            const udid = tokenData.udid;
            const loginTime = localStorage.getItem('loginTime');

            const userIdElement = document.getElementById('displayUserId');
            if (userId) { userIdElement.textContent = userId; userIdElement.style.color = '#667eea'; }
            else { userIdElement.textContent = 'Không tìm thấy'; userIdElement.style.color = '#dc3545'; }

            const udidElement = document.getElementById('displayUdid');
            if (udid) { udidElement.textContent = udid.substring(0, 16) + '...'; udidElement.title = udid; udidElement.style.color = '#17a2b8'; }
            else { const fallbackUdid = localStorage.getItem('udid') || getGuid(); udidElement.textContent = fallbackUdid.substring(0, 16) + '... (local)'; udidElement.title = fallbackUdid; udidElement.style.color = '#ffc107'; }

            const anchorIdElement = document.getElementById('displayAnchorId');
            if (userId) { anchorIdElement.textContent = userId; anchorIdElement.style.color = '#28a745'; }
            else { const fallbackAnchorId = Math.floor(Math.random() * 999999999) + 2000000000; anchorIdElement.textContent = `${fallbackAnchorId} (random)`; anchorIdElement.style.color = '#ffc107'; }

            const loginTimeElement = document.getElementById('displayLoginTime');
            if (loginTime) {
                const d = new Date(loginTime);
                const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true });
                const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                loginTimeElement.textContent = `${timeStr} - ${dateStr}`;
            } else { loginTimeElement.textContent = 'Không xác định'; }

            if (userDetail) updateUserProfileDisplay(userDetail);
        }

        window.updateUserProfileDisplay = function(userDetail) {
            if (userDetail) {
                const avatarElement = document.getElementById('userAvatar');
                if (userDetail.avatar && userDetail.avatar.trim() !== '') {
                    avatarElement.src = userDetail.avatar;
                    avatarElement.onerror = function () { this.src = 'https://ui-avatars.com/api/?name=User&background=random'; };
                } else {
                    avatarElement.src = 'https://ui-avatars.com/api/?name=User&background=random';
                }
                const nicknameElement = document.getElementById('userNickname');
                let nickname = userDetail.nickname || 'Không có tên';
                try { nickname = JSON.parse('"' + nickname.replace(/\\/g, '\\') + '"'); } catch (e) {}
                nicknameElement.textContent = nickname;

                document.getElementById('userFans').textContent = (userDetail.fans || 0).toLocaleString('vi-VN');
                document.getElementById('userFollows').textContent = (userDetail.follows || 0).toLocaleString('vi-VN');
                document.getElementById('userSignature').textContent = userDetail.signature || 'Chưa có chữ ký';
                document.getElementById('userCity').textContent = userDetail.city || 'Chưa cập nhật';
                document.getElementById('userLevel').textContent = `Lv.${userDetail.userLevel || 0}`;
                document.getElementById('userGoldCoin').textContent = (parseFloat(userDetail.goldCoin) || 0).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } 
        }

        window.getIdolList = async function() {
            const loginInfo = getLoginInfo();
            if (!loginInfo.token) return null;
            const tokenData = getTokenData();
            const uid = tokenData.userId;
            const udid = tokenData.udid || localStorage.getItem('udid') || getGuid();
            const timestamp = new Date().getTime();
            const xSign = md5(`${udid}jgyh,kasd${timestamp}`);

            try {
                const response = await fetch('https://gateway.mmlive.online/live-client/live/new/4231/1529/list', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*', 'accept-language': 'VI', 'appid': 'MMLive', 'authorization': `HSBox ${loginInfo.token}`,
                        'content-type': 'application/json;charset=UTF-8', 'n-l': 'Y', 'origin': 'https://mmlive.online', 'os': '0', 'p-g': 'N', 'priority': 'u=1, i',
                        'referer': 'https://mmlive.online/', 'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                        'x-appversion': '2.5.0', 'x-language': 'VI', 'x-sign': xSign, 'x-timestamp': timestamp.toString(), 'x-udid': udid
                    },
                    body: JSON.stringify({ "uid": uid, "type": 1, "os": 0 })
                });
                const result = await response.json();
                if (result.data.length > 0) return result.data;
                else return null;
            } catch (error) { return null; }
        }

        window.renderApiIdolList = function(idols) {
            const idolListContainer = document.getElementById('idolGrid');
            if (!idolListContainer) return;
            if (!idols || !Array.isArray(idols) || idols.length === 0) {
                idolListContainer.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">Không có idol nào</p>';
                return;
            }
            window.apiIdolsData = idols;
            if (window.originalIdolsData.length === 0) window.originalIdolsData = [...idols];

            let html = '';
            idols.forEach((idol, index) => {
                html += `
                    <div class="idol-card" onclick="selectApiIdolByAnchorId('${idol.anchorId}')" data-idol-index="${index}" data-idol-id="${idol.anchorId}">
                        <img src="${idol.avatar}" alt="${idol.nickname || idol.nickName}" class="idol-avatar-img" onerror="this.src='https://ui-avatars.com/api/?name=Idol'">
                        <div class="idol-name">${idol.nickname || idol.nickName}</div>
                        <div class="idol-desc">${idol.signature || 'No description'}</div>
                        <div style="display:flex; justify-content:center; gap:5px; margin-top:5px;">
                            ${idol.liveStatus === 1 ? '<span class="status-pill status-live">🔴 LIVE</span>' : '<span class="status-pill status-offline">⚫ OFF</span>'}
                            <span class="status-pill" style="background:#f1f2f6; color:#555">ID: ${idol.anchorId}</span>
                        </div>
                    </div>
                `;
            });
            idolListContainer.innerHTML = html;
            setupSearchInput();
            if (window.currentSearchTerm) updateSearchResultsCount(idols.length, window.originalIdolsData.length, window.currentSearchTerm);
            else updateSearchResultsCount(idols.length, window.originalIdolsData.length || idols.length);
            setTimeout(() => { updateIdolCardSelection(); }, 100);
            if (!window.selectedIdol && idols.length > 0) {
                const firstIdol = {
                    id: idols[0].anchorId, nickname: idols[0].nickname || idols[0].nickName, signature: idols[0].signature || idols[0].desc || 'Chưa có mô tả',
                    avatar: idols[0].avatar, liveId: idols[0].liveId || idols[0].anchorId, anchorId: idols[0].anchorId, liveStatus: idols[0].liveStatus
                };
                selectIdol(firstIdol);
            }
        }

        window.apiIdolsData = [];
        window.selectApiIdolByAnchorId = function(anchorId) {
            const searchData = window.originalIdolsData.length > 0 ? window.originalIdolsData : window.apiIdolsData;
            const idol = searchData.find(idol => String(idol.anchorId) === String(anchorId));
            if (idol) {
                const idolObj = {
                    id: idol.anchorId, nickname: idol.nickname || idol.nickName, avatar: idol.avatar, liveId: idol.liveId || idol.anchorId,
                    anchorId: idol.anchorId, signature: idol.signature || idol.desc || 'Chưa có mô tả', liveStatus: idol.liveStatus
                };
                selectIdol(idolObj);
                setTimeout(() => { updateIdolCardSelection(); }, 50);
            }
        }

        window.originalIdolsData = [];
        window.currentSearchTerm = '';

        window.searchIdols = function() {
            const searchInput = document.getElementById('idolSearchInput');
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (!window.apiIdolsData || window.apiIdolsData.length === 0) return;
            if (window.originalIdolsData.length === 0) window.originalIdolsData = [...window.apiIdolsData];
            window.currentSearchTerm = searchTerm;
            if (!searchTerm) {
                renderApiIdolList(window.originalIdolsData);
                updateSearchResultsCount(window.originalIdolsData.length, window.originalIdolsData.length);
                return;
            }
            const searchResults = window.originalIdolsData.filter(idol => {
                const nickname = (idol.nickname || idol.nickName || '').toLowerCase();
                const anchorId = String(idol.anchorId || '').toLowerCase();
                const signature = (idol.signature || idol.desc || '').toLowerCase();
                return nickname.includes(searchTerm) || anchorId.includes(searchTerm) || signature.includes(searchTerm);
            });
            renderApiIdolList(searchResults);
            updateSearchResultsCount(searchResults.length, window.originalIdolsData.length, searchTerm);
        }

        window.clearSearch = function() {
            const searchInput = document.getElementById('idolSearchInput');
            searchInput.value = '';
            window.currentSearchTerm = '';
            if (window.originalIdolsData.length > 0) {
                renderApiIdolList(window.originalIdolsData);
                updateSearchResultsCount(window.originalIdolsData.length, window.originalIdolsData.length);
            }
        }

        window.updateSearchResultsCount = function(found, total, searchTerm = '') {
            const countElement = document.getElementById('searchResultsCount');
            if (!countElement) return;
            if (searchTerm && searchTerm !== '') {
                if (found === 0) { countElement.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`; countElement.style.color = '#dc3545'; }
                else { countElement.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả cho "<strong>${searchTerm}</strong>" (từ ${total} idol)`; countElement.style.color = '#28a745'; }
            } else { countElement.innerHTML = `📋 Hiển thị tất cả <strong>${total}</strong> idol`; countElement.style.color = '#6c757d'; }
        }

        window.setupSearchInput = function() {
            const searchInput = document.getElementById('idolSearchInput');
            if (searchInput) {
                searchInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') searchIdols(); });
                let searchTimeout;
                searchInput.addEventListener('input', function (e) {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => { searchIdols(); }, 300);
                });
            }
        }

        window.isRunning = false;
        window.shouldStop = false;

        window.showRunResultsPanel = function() {
            const panel = document.getElementById('runResultsPanel');
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            document.getElementById('stopBtn').style.display = 'inline-block';
            document.getElementById('runResults').innerHTML = '';
        }

        window.updateProgress = function(current, total, message, activeThreads = 0) {
            const percentage = total > 0 ? (current / total) * 100 : 0;
            document.getElementById('progressBar').style.width = percentage + '%';
            const messageWithThreads = activeThreads > 0 ? `${message} [${activeThreads} threads hoạt động]` : message;
            document.getElementById('progressText').textContent = messageWithThreads;
            document.getElementById('progressCount').textContent = `${current}/${total}`;
        }

        window.logResult = function(message, type = 'info') {
            const resultsDiv = document.getElementById('runResults');
            const timestamp = new Date().toLocaleTimeString();
            let color = '#a4b0be';
            if (type === 'success') color = '#55efc4';
            else if (type === 'error') color = '#ff7675';
            else if (type === 'info') color = '#74b9ff';
            const logEntry = document.createElement('div');
            logEntry.style.color = color;
            logEntry.style.marginBottom = '3px';
            logEntry.innerHTML = `<span style="color: #636e72;">[${timestamp}]</span> ${message}`;
            resultsDiv.appendChild(logEntry);
            resultsDiv.scrollTop = resultsDiv.scrollHeight;
        }

        window.stopRunning = function() {
            if (window.isRunning) {
                window.shouldStop = true;
                logResult('🛑 Đang dừng lại...', 'info');
                document.getElementById('stopBtn').style.display = 'none';
            }
        }

        window.clearResults = function() {
            document.getElementById('runResults').innerHTML = '';
            document.getElementById('runResultsPanel').style.display = 'none';
            updateProgress(0, 0, 'Sẵn sàng');
        }

        window.runTurboModeWithInput = async function() {
            const numberOfViews = parseInt(document.getElementById('customRequests').value) || 5000;
            const maxConcurrent = 150;
            await runTurboMode(numberOfViews, maxConcurrent);
        }

        window.runTurboMode = async function(numberOfRequests = 5000, maxConcurrent = 150) {
            if (window.isRunning) { alert('Đang có tiến trình chạy khác!'); return; }
            const confirmed = confirm(`🚀 TURBO MODE\n\n⚡ Sẽ chạy ${numberOfRequests} requests!\nTiếp tục?`);
            if (!confirmed) return;
            const loginInfo = getLoginInfo();
            if (!loginInfo.token) { alert('Cần đăng nhập trước khi chạy!'); return; }
            showRunResultsPanel();
            window.isRunning = true;
            window.shouldStop = false;
            const liveId = window.GLOBAL_CONFIG.liveId;
            const anchorId = window.GLOBAL_CONFIG.anchorId;
            const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
            const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();
            logResult(`🚀 TURBO MODE: ${numberOfRequests} requests với ${maxConcurrent} threads!`, 'info');
            let successCount = 0; let errorCount = 0; let completedCount = 0;
            const startTime = Date.now();
            const pool = [];
            const sendRequest = async (index) => {
                if (window.shouldStop) return { success: false, stopped: true };
                try {
                    const timestamp = new Date().getTime() + index * 5;
                    const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
                    const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/220`, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json, text/plain, */*', 'appid': 'MMLive', 'authorization': `HSBox ${loginInfo.token}`,
                            'content-type': 'application/json;charset=UTF-8', 'n-l': 'Y', 'origin': 'https://mmlive.online', 'os': '0', 'p-g': 'N',
                            'referer': 'https://mmlive.online/', 'x-appversion': '2.5.0', 'x-sign': xSign, 'x-timestamp': timestamp, 'x-udid': udid
                        },
                        body: JSON.stringify({ liveId: liveId, uid: uid, adJumpUrl: "", anchorId: anchorId, isRoomPreview: 0, os: 0 })
                    });
                    completedCount++;
                    if (response.ok) { successCount++; return { success: true, index }; }
                    else { errorCount++; return { success: false, index, status: response.status }; }
                } catch (error) { completedCount++; errorCount++; return { success: false, index, error: error.message }; }
            };
            for (let i = 1; i <= numberOfRequests && !window.shouldStop; i++) {
                const promise = sendRequest(i).then(result => {
                    const index = pool.indexOf(promise);
                    if (index > -1) pool.splice(index, 1);
                    if (completedCount % 100 === 0) {
                        const rate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);
                        updateProgress(completedCount, numberOfRequests, `Turbo Mode: ${rate} req/s`, pool.length);
                    }
                    return result;
                });
                pool.push(promise);
                if (pool.length >= maxConcurrent) await Promise.race(pool);
            }
            if (pool.length > 0) await Promise.all(pool);
            window.isRunning = false;
            updateProgress(numberOfRequests, numberOfRequests, 'TURBO MODE hoàn thành!', 0);
            logResult(`\n🏁 HOÀN THÀNH: ${successCount} Success / ${errorCount} Errors`, 'success');
            document.getElementById('stopBtn').style.display = 'none';
        }

        window.runPhaIdolMode = async function() {
            if (window.isRunning) { alert('Đang có tiến trình chạy khác!'); return; }
            const confirmed = confirm(`💥 CHẾ ĐỘ PHÁ IDOL\n\n🔥 Chạy VÒNG LẶP KHÔNG GIỚI HẠN!\n⚠️ CẢNH BÁO: CHỈ DỪNG KHI BẠN NHẤN NÚT DỪNG!\nTiếp tục?`);
            if (!confirmed) return;
            const loginInfo = getLoginInfo();
            if (!loginInfo.token) { alert('Cần đăng nhập trước khi chạy!'); return; }
            showRunResultsPanel();
            window.isRunning = true;
            window.shouldStop = false;
            const liveId = window.GLOBAL_CONFIG.liveId;
            const anchorId = window.GLOBAL_CONFIG.anchorId;
            const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
            const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();
            logResult(`💥 CHẾ ĐỘ PHÁ IDOL BẮT ĐẦU!`, 'error');
            let totalSuccessCount = 0; let totalErrorCount = 0; let totalCompletedCount = 0; let loopCount = 0;
            const globalStartTime = Date.now();
            while (!window.shouldStop) {
                loopCount++;
                logResult(`\n🔄 === VÒNG ${loopCount} BẮT ĐẦU ===`, 'info');
                const numberOfRequests = 5000; const maxConcurrent = 150;
                let successCount = 0; let errorCount = 0; let completedCount = 0;
                const pool = [];
                const sendRequest = async (index) => {
                    if (window.shouldStop) return { success: false, stopped: true };
                    try {
                        const timestamp = new Date().getTime() + index * 5;
                        const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
                        const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/220`, {
                            method: 'POST',
                            headers: {
                                'accept': 'application/json, text/plain, */*', 'appid': 'MMLive', 'authorization': `HSBox ${loginInfo.token}`,
                                'content-type': 'application/json;charset=UTF-8', 'n-l': 'Y', 'origin': 'https://mmlive.online', 'os': '0', 'p-g': 'N',
                                'referer': 'https://mmlive.online/', 'x-appversion': '2.5.0', 'x-sign': xSign, 'x-timestamp': timestamp, 'x-udid': udid
                            },
                            body: JSON.stringify({ liveId: liveId, uid: uid, adJumpUrl: "", anchorId: anchorId, isRoomPreview: 0, os: 0 })
                        });
                        completedCount++; totalCompletedCount++;
                        if (response.ok) { successCount++; totalSuccessCount++; return { success: true, index }; }
                        else { errorCount++; totalErrorCount++; return { success: false, index, status: response.status }; }
                    } catch (error) { completedCount++; totalCompletedCount++; errorCount++; totalErrorCount++; return { success: false, index, error: error.message }; }
                };
                for (let i = 1; i <= numberOfRequests && !window.shouldStop; i++) {
                    const promise = sendRequest(i).then(result => {
                        const index = pool.indexOf(promise);
                        if (index > -1) pool.splice(index, 1);
                        if (completedCount % 100 === 0) {
                            const rate = (completedCount / (Date.now() - globalStartTime) * 1000 * loopCount).toFixed(0); 
                            updateProgress(completedCount, numberOfRequests, `💥 Phá Idol Vòng ${loopCount}`, pool.length);
                        }
                        return result;
                    });
                    pool.push(promise);
                    if (pool.length >= maxConcurrent) await Promise.race(pool);
                }
                if (pool.length > 0) await Promise.all(pool);
                if (window.shouldStop) break;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            window.isRunning = false;
            updateProgress(totalCompletedCount, totalCompletedCount, 'ĐÃ DỪNG!', 0);
            logResult(`\n💥 KẾT THÚC: ${totalSuccessCount} Success / ${totalErrorCount} Errors`, 'error');
            document.getElementById('stopBtn').style.display = 'none';
        }

        window.togglePassword = function() {
            const passwordInput = document.getElementById('password');
            const passwordToggle = document.querySelector('.password-toggle');
            if (passwordInput.type === 'password') { passwordInput.type = 'text'; passwordToggle.textContent = '🙈'; }
            else { passwordInput.type = 'password'; passwordToggle.textContent = '👁️'; }
        }

        window.validateForm = function() {
            const mobile = document.getElementById('email'); const password = document.getElementById('password');
            const mobileError = document.getElementById('emailError'); const passwordError = document.getElementById('passwordError');
            let isValid = true;
            mobileError.style.display = 'none'; passwordError.style.display = 'none';
            mobile.style.borderColor = '#e1e1e1'; password.style.borderColor = '#e1e1e1';
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            if (!mobile.value.trim() || !phoneRegex.test(mobile.value.trim())) { mobileError.style.display = 'block'; mobile.style.borderColor = '#dc3545'; isValid = false; }
            if (!password.value || password.value.length < 6) { passwordError.style.display = 'block'; password.style.borderColor = '#dc3545'; isValid = false; }
            return isValid;
        }

        // BIND EVENTS
        document.getElementById('loginForm').addEventListener('submit', async function (e) {
            e.preventDefault();
            if (validateForm()) {
                const loginBtn = document.querySelector('.login-btn');
                const originalText = loginBtn.textContent;
                loginBtn.textContent = 'Đang đăng nhập...'; loginBtn.disabled = true;
                const mobile = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const remember = document.getElementById('remember').checked;
                try {
                    const result = await loginAPI(mobile, password);
                    if (result.success === true) {
                        if (remember) { localStorage.setItem('savedMobile', mobile); localStorage.setItem('savedPassword', btoa(password)); localStorage.setItem('isRemembered', 'true'); }
                        else { localStorage.removeItem('savedMobile'); localStorage.removeItem('savedPassword'); localStorage.removeItem('isRemembered'); }
                        updateUserInfoDisplay();
                        const userDetail = await getUserInfo();
                        if (userDetail) updateUserInfoDisplay(userDetail);
                        const idols = await getIdolList();
                        if (idols) renderApiIdolList(idols);
                        document.querySelector('.login-container').style.display = 'none';
                        document.getElementById('sidebarSection').style.display = 'block';
                        document.querySelector('.idol-container').style.display = 'block';
                        renderIdolList();
                    } else { alert(`❌ Đăng nhập thất bại: ${result.error}`); }
                } catch (error) { alert('🚨 Lỗi kết nối!'); }
                finally { loginBtn.textContent = originalText; loginBtn.disabled = false; }
            }
        });

        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function () { this.parentElement.style.transform = 'scale(1.02)'; });
            input.addEventListener('blur', function () { this.parentElement.style.transform = 'scale(1)'; });
        });

        // INIT APP
        function initApp() {
            console.log('🚀 App Initializing via Remote Core...');
            const loginContainer = document.getElementById('loginContainer');
            const sidebar = document.getElementById('sidebarSection');
            const idolContainer = document.querySelector('.idol-container');
            const savedMobile = localStorage.getItem('savedMobile');
            const savedPassword = localStorage.getItem('savedPassword');
            const isRemembered = localStorage.getItem('isRemembered') === 'true';
            
            if (savedMobile && isRemembered) {
                const emailInput = document.getElementById('email');
                const rememberCheckbox = document.getElementById('remember');
                if (emailInput) emailInput.value = savedMobile;
                if (rememberCheckbox) rememberCheckbox.checked = true;
            }
            if (savedPassword && isRemembered) {
                const passInput = document.getElementById('password');
                if (passInput) try { passInput.value = atob(savedPassword); } catch (e) {}
            }

            if (isLoggedIn()) {
                if(loginContainer) loginContainer.style.display = 'none';
                if(sidebar) sidebar.style.display = 'block';
                if(idolContainer) idolContainer.style.display = 'block';
                updateUserInfoDisplay();
                (async () => {
                    const userDetail = await getUserInfo();
                    if (userDetail) updateUserInfoDisplay(userDetail);
                    const idols = await getIdolList();
                    if (idols) renderApiIdolList(idols);
                })();
            } else {
                if(loginContainer) loginContainer.style.display = 'block';
                if(sidebar) sidebar.style.display = 'none';
                if(idolContainer) idolContainer.style.display = 'none';
                renderIdolList();
            }
            setupSearchInput();
        }
        initApp();
    }
})();
