// ====================================================================================
// ||                      CẤU HÌNH QUẢN LÝ TỪ XA (ADMIN PANEL)                      ||
// ====================================================================================
// Đặt là true để Tool chạy bình thường.
// Đặt là false để khóa toàn bộ Tool của khách (hiện thông báo bảo trì).
const TOOL_STATUS = true; 

// Thông báo hiển thị khi khóa tool
const LOCK_MESSAGE = "HỆ THỐNG ĐANG BẢO TRÌ NÂNG CẤP.\nVui lòng quay lại sau!";

// ====================================================================================
// ||                              KHỞI TẠO HỆ THỐNG                                 ||
// ====================================================================================

// Kiểm tra trạng thái ngay lập tức
if (!TOOL_STATUS) {
    // Xóa toàn bộ giao diện và hiện thông báo khóa
    setTimeout(() => {
        document.body.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#0f0c29; color:white; flex-direction:column; text-align:center; padding:20px;">
                <h1 style="color:#ff4757; font-size:3rem; margin-bottom:20px;">🚫 BẢO TRÌ</h1>
                <p style="font-size:1.2rem; line-height:1.6;">${LOCK_MESSAGE.replace(/\n/g, '<br>')}</p>
                <div style="margin-top:30px; font-size:0.9rem; opacity:0.6;">Admin Control System</div>
            </div>
        `;
    }, 100);
    throw new Error("Tool Disabled by Admin");
}

// Ẩn màn hình loading khi script đã tải xong
window.onload = function() {
    const loader = document.getElementById('scriptLoader');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
}

// ====================================================================================
// ||                               THƯ VIỆN BẢO MẬT (MD5)                           ||
// ====================================================================================
// MD5 implementation
function md5(string) {
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
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }

    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function wordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    x = convertToWordArray(utftext);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// ====================================================================================
// ||                               CORE LOGIC (MMLIVE)                              ||
// ====================================================================================

// NEW FUNCTION: RESET SỐ LƯỢNG VỀ 0
function resetCustomRequests() {
    const input = document.getElementById('customRequests');
    if(input) {
        input.value = 0;
        // Hiệu ứng Visual Feedback
        input.style.transition = 'all 0.1s';
        input.style.transform = 'scale(0.95)';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 100);
    }
}

// NEW FUNCTION: CỘNG DỒN SỐ LƯỢNG VIEW (ADDITIVE)
function addToCustomView(amount) {
    const input = document.getElementById('customRequests');
    if(input) {
        // Lấy giá trị hiện tại, nếu rỗng hoặc NaN thì coi là 0
        let currentVal = parseInt(input.value) || 0;
        
        // Cộng thêm lượng mới
        let newVal = currentVal + amount;
        
        // Giới hạn max 10000 (hoặc có thể bỏ nếu muốn)
        if (newVal > 10000) newVal = 10000; 
        
        input.value = newVal;

        // Hiệu ứng Visual Feedback khi bấm
        input.style.transition = 'all 0.1s';
        input.style.transform = 'scale(1.1)';
        input.style.color = '#fff'; // Flash white text
        
        setTimeout(() => {
            input.style.transform = 'scale(1)';
            input.style.color = 'var(--accent-color)'; // Revert color
        }, 150);
    }
}

// ===== GLOBAL CONFIGURATION VARIABLES =====
const GLOBAL_CONFIG = {
    liveId: 1027295,        // Live stream ID (sẽ được cập nhật khi chọn idol)
    anchorId: 2026922943    // Anchor/Streamer ID (sẽ được cập nhật khi chọn idol)
};

let selectedIdol = null;

// ===== IDOL SELECTION FUNCTIONS =====

// Render danh sách idol từ API
function renderIdolList() {
    const idolGrid = document.getElementById('idolGrid');
    if (!idolGrid) return;

    // Nếu có data từ API, sử dụng renderApiIdolList
    if (apiIdolsData && apiIdolsData.length > 0) {
        console.log('📋 Rendering API idol list');
        renderApiIdolList(apiIdolsData);
        return;
    }

    // Nếu chưa có data từ API, hiển thị placeholder
    console.log('⏳ Waiting for API idol data...');
    idolGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1; padding: 40px;">Đang tải danh sách idol...<br><small>Vui lòng đăng nhập để xem danh sách idol</small></p>';
}

// Chọn idol
function selectIdol(idol) {
    console.log('🎯 selectIdol called with:', idol);
    selectedIdol = idol;

    // Cập nhật GLOBAL_CONFIG
    GLOBAL_CONFIG.liveId = idol.liveId;
    GLOBAL_CONFIG.anchorId = idol.anchorId;

    console.log('🎯 Updated selectedIdol:', selectedIdol);
    console.log('🎯 Updated GLOBAL_CONFIG:', GLOBAL_CONFIG);

    // Cập nhật UI
    updateSelectedIdolInfo(idol);
    updateIdolCardSelection();
    updateToolSectionDisplay(idol);

    console.log(`✅ Đã chọn idol: ${idol.nickname} (Live ID: ${idol.liveId}, Anchor ID: ${idol.anchorId})`);
}

// Cập nhật hiển thị trong tool section
function updateToolSectionDisplay(idol) {
    // Cập nhật Anchor ID display
    const anchorIdElement = document.getElementById('displayAnchorId');
    if (anchorIdElement) {
        anchorIdElement.textContent = idol.anchorId;
        anchorIdElement.style.color = '#28a745';
        anchorIdElement.title = `Anchor ID từ ${idol.nickname}`;
    }

    // Nếu có thêm thông tin live ID cần hiển thị, có thể thêm ở đây
    console.log(`🔄 Đã cập nhật Tool Section với thông tin từ ${idol.nickname}`);
}

// Cập nhật thông tin idol được chọn
function updateSelectedIdolInfo(idol) {
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

// Cập nhật trạng thái selected của các idol card
function updateIdolCardSelection() {
    console.log('🔄 updateIdolCardSelection called, selectedIdol:', selectedIdol);
    const idolCards = document.querySelectorAll('.idol-card');

    // Xóa tất cả selection trước
    idolCards.forEach(card => card.classList.remove('selected'));

    // Thêm selection cho card đúng
    if (selectedIdol) {
        console.log('🔍 selectedIdol.id type:', typeof selectedIdol.id, 'value:', selectedIdol.id);
        idolCards.forEach((card, index) => {
            const cardIdolId = card.getAttribute('data-idol-id');
            console.log(`🔍 Card ${index} data-idol-id type:`, typeof cardIdolId, 'value:', cardIdolId);

            // So sánh cả == và === để test
            const matchLoose = cardIdolId == selectedIdol.id;
            const matchStrict = cardIdolId === String(selectedIdol.id);
            const isSelected = matchLoose || matchStrict;

            console.log(`🔄 Card ${index}: cardId=${cardIdolId}, selectedId=${selectedIdol.id}, loose=${matchLoose}, strict=${matchStrict}, final=${isSelected}`);

            if (isSelected) {
                card.classList.add('selected');
                console.log(`✅ Added 'selected' class to card ${index}`);
            }
        });
    }
}

// Hàm tạo GUID
function getGuid() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000000000000000);
    const deviceInfo = "YourDeviceInfoHere";
    const combinedData = `${timestamp}${random}${deviceInfo}`;
    const deviceID = md5(combinedData).substr(0, 32);
    return deviceID;
}

// Hàm đăng nhập API
async function loginAPI(mobile, password) {
    console.log('=== LoginAPI Started ===');

    const timestamp = new Date().getTime();
    const uid = getGuid(); // Sử dụng GUID làm uid

    console.log('Generated UID:', uid);
    console.log('Timestamp:', timestamp);

    // Tạo sign theo format của API
    const sign = md5(`${uid}jgyh,kasd${timestamp}`);
    const xSign = md5(`${uid}jgyh,kasd${timestamp}`); // Sử dụng cùng format với sign

    console.log('Generated signs:', { sign, xSign });

    const loginParams = {
        os: 0,
        sign: sign,
        timestamp: timestamp,
        udid: uid,
        model: "PC",
        mobile: mobile,
        password: password,
        version: "1.0.2",
        softVersion: "1.0.0"
    };

    console.log('Login Parameters:', loginParams);

    try {
        const response = await fetch('https://gateway.mmlive.online/center-client/sys/auth/new/phone/login', {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'VI',
                'appid': 'MMLive',
                'content-type': 'application/json;charset=UTF-8',
                'n-l': 'Y',
                'origin': 'https://mmlive.online',
                'os': '0',
                'p-g': 'N',
                'referer': 'https://mmlive.online/',
                'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                'x-appversion': '2.5.0',
                'x-language': 'VI',
                'x-sign': xSign,
                'x-timestamp': timestamp.toString(),
                'x-udid': uid
            },
            body: JSON.stringify(loginParams)
        });

        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return { success: false, error: 'Server trả về dữ liệu không hợp lệ' };
        }

        console.log('API Response:', result);

        // Kiểm tra cấu trúc response
        if (!result || typeof result !== 'object') {
            return { success: false, error: 'Response không hợp lệ' };
        }

        console.log('Response status:', response.status, response.ok);
        console.log('Result code:', result.code);

        if (response.ok && result.code === 0) {
            console.log('✅ Login successful:', result);

            // Kiểm tra data có tồn tại không
            if (!result.data || !result.data.token) {
                console.log('❌ No token in response');
                return { success: false, error: 'Không nhận được token từ server' };
            }

            console.log('💾 Saving login data to localStorage');
            // Lưu thông tin đăng nhập vào localStorage
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('randomKey', result.data.randomKey || '');
            localStorage.setItem('randomVector', result.data.randomVector || '');
            localStorage.setItem('loginTime', new Date().toISOString());
            localStorage.setItem('udid', uid); // Lưu udid để sử dụng sau

            const successResult = { success: true, data: result.data, message: result.msg || 'Đăng nhập thành công' };
            console.log('🚀 Returning success result:', successResult);
            return successResult;
        } else {
            console.error('❌ Login failed:', result);
            const errorMsg = result.msg || result.message || `HTTP ${response.status}: ${response.statusText}`;
            const errorResult = { success: false, error: errorMsg };
            console.log('💥 Returning error result:', errorResult);
            return errorResult;
        }
    } catch (error) {
        console.error('🚨 Network/Parse error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);

        // Xử lý các loại lỗi khác nhau
        let errorMessage = 'Lỗi kết nối mạng';
        if (error.name === 'TypeError') {
            errorMessage = 'Lỗi kết nối - Kiểm tra internet';
        } else if (error.name === 'SyntaxError') {
            errorMessage = 'Server trả về dữ liệu không hợp lệ';
        } else if (error.message) {
            errorMessage = error.message;
        }

        const catchResult = { success: false, error: errorMessage };
        console.log('🔄 Returning catch result:', catchResult);
        return catchResult;
    }

    // Fallback return (không bao giờ nên đến đây)
    console.log('⚠️ Reached fallback return - this should not happen');
    return { success: false, error: 'Lỗi không xác định' };
}

// Hàm kiểm tra trạng thái đăng nhập
function isLoggedIn() {
    const token = localStorage.getItem('authToken');
    return token && token.length > 0;
}

// Hàm lấy thông tin đăng nhập đã lưu
function getLoginInfo() {
    return {
        token: localStorage.getItem('authToken'),
        randomKey: localStorage.getItem('randomKey'),
        randomVector: localStorage.getItem('randomVector'),
        loginTime: localStorage.getItem('loginTime')
    };
}

// Hàm đăng xuất (xóa thông tin đã lưu)
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('randomKey');
    localStorage.removeItem('randomVector');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('udid');
    // Remove remembered credentials on explicit logout if desired, 
    // but usually "Remember Me" persists until unchecked.
    // Uncomment below lines if logout should clear remembered data:
    // localStorage.removeItem('savedMobile');
    // localStorage.removeItem('savedPassword');
    // localStorage.removeItem('isRemembered');
    
    console.log('Đã đăng xuất và xóa tất cả thông tin đăng nhập');
}

// Hàm decode JWT token để lấy thông tin
function getTokenData() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('No token found');
        return { userId: null, udid: null };
    }

    try {
        // JWT token có 3 phần được phân tách bởi dấu chấm: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.log('Invalid JWT token format - expecting 3 parts, got:', parts.length);
            return { userId: null, udid: null };
        }

        // Decode phần payload (phần thứ 2) - JWT sử dụng base64url encoding
        let payload = parts[1];

        // Chuyển base64url thành base64 thông thường
        payload = payload.replace(/-/g, '+').replace(/_/g, '/');

        // Thêm padding nếu cần thiết cho base64 decode
        while (payload.length % 4) {
            payload += '=';
        }

        console.log('JWT payload part:', parts[1]);
        console.log('Base64 payload after conversion:', payload);

        const decodedPayload = atob(payload);
        console.log('Decoded payload string:', decodedPayload);

        const userData = JSON.parse(decodedPayload);
        console.log('Parsed JWT payload:', userData);

        // Thử các field phổ biến cho userId
        const userId = userData.userId || userData.id || userData.sub || userData.user_id || userData.uid;

        // Thử các field phổ biến cho udid
        const udid = userData.udid || userData.deviceId || userData.device_id || userData.uuid;

        console.log('Extracted userId:', userId);
        console.log('Extracted udid:', udid);

        return { userId, udid };
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        console.error('Token parts:', token.split('.').length);

        // Log thêm thông tin debug
        if (token.split('.').length === 3) {
            console.error('Payload part:', token.split('.')[1]);
        }

        return { userId: null, udid: null };
    }
}

// Hàm decode JWT token để lấy userId (backward compatibility)
function getUserIdFromToken() {
    return getTokenData().userId;
}

// Hàm decode JWT token để lấy udid
function getUdidFromToken() {
    return getTokenData().udid;
}

// Hàm gọi API để lấy thông tin user chi tiết
async function getUserInfo() {
    const loginInfo = getLoginInfo();
    if (!loginInfo.token) {
        console.error('No token found for getUserInfo');
        return null;
    }

    const tokenData = getTokenData();
    const udid = tokenData.udid || localStorage.getItem('udid') || getGuid();
    const timestamp = new Date().getTime();
    const xSign = md5(`${udid}jgyh,kasd${timestamp}`)

    try {
        console.log('🔍 Fetching user info...');
        const response = await fetch('https://gateway.mmlive.online/center-client/sys/user/get/info', {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'VI',
                'appid': 'MMLive',
                'authorization': `HSBox ${loginInfo.token}`,
                'content-type': 'application/json;charset=UTF-8',
                'n-l': 'Y',
                'origin': 'https://mmlive.online',
                'os': '0',
                'p-g': 'N',
                'referer': 'https://mmlive.online/',
                'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                'x-appversion': '2.5.0',
                'x-language': 'VI',
                'x-sign': xSign,
                'x-timestamp': timestamp.toString(),
                'x-udid': udid
            },
            body: JSON.stringify({ "os": 0 })
        });

        const result = await response.json();
        console.log('👤 User info response:', result);

        if (result.code === 0 && result.data) {
            return result.data;
        } else {
            console.error('Failed to get user info:', result.msg);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}

// Hàm cập nhật thông tin user lên UI
function updateUserInfoDisplay(userDetail = null) {
    const tokenData = getTokenData();
    const userId = tokenData.userId;
    const udid = tokenData.udid;
    const loginTime = localStorage.getItem('loginTime');

    // Hiển thị User ID
    const userIdElement = document.getElementById('displayUserId');
    if (userId) {
        userIdElement.textContent = userId;
        userIdElement.style.color = '#667eea';
    } else {
        userIdElement.textContent = 'Không tìm thấy';
        userIdElement.style.color = '#dc3545';
    }

    // Hiển thị UDID
    const udidElement = document.getElementById('displayUdid');
    if (udid) {
        // Hiển thị 16 ký tự đầu và thêm tooltip
        udidElement.textContent = udid.substring(0, 16) + '...'; 
        udidElement.title = udid; // Full UDID on hover
        udidElement.style.color = '#17a2b8';
    } else {
        const fallbackUdid = localStorage.getItem('udid') || getGuid();
        udidElement.textContent = fallbackUdid.substring(0, 16) + '... (local)';
        udidElement.title = fallbackUdid;
        udidElement.style.color = '#ffc107';
    }

    // Hiển thị Anchor ID (giống User ID)
    const anchorIdElement = document.getElementById('displayAnchorId');
    if (userId) {
        anchorIdElement.textContent = userId;
        anchorIdElement.style.color = '#28a745';
    } else {
        const fallbackAnchorId = Math.floor(Math.random() * 999999999) + 2000000000;
        anchorIdElement.textContent = `${fallbackAnchorId} (random)`;
        anchorIdElement.style.color = '#ffc107';
    }

    // Hiển thị Login Time
    const loginTimeElement = document.getElementById('displayLoginTime');
    if (loginTime) {
        // Format: 12h (SA/CH) - Ngày/Tháng/Năm
        const d = new Date(loginTime);
        const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true }); // e.g. 11:22 CH
        const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); // e.g. 03/02/2026
        loginTimeElement.textContent = `${timeStr} - ${dateStr}`;
    } else {
        loginTimeElement.textContent = 'Không xác định';
    }

    // Hiển thị thông tin chi tiết user nếu có
    if (userDetail) {
        updateUserProfileDisplay(userDetail);
    }

    console.log('✅ Updated user info display - UserID:', userId, 'UDID:', udid);
}

// Hàm cập nhật thông tin profile user
function updateUserProfileDisplay(userDetail) {
    const profileSection = document.getElementById('userInfoSection');

    if (userDetail) {
        // Hiển thị avatar
        const avatarElement = document.getElementById('userAvatar');
        if (userDetail.avatar && userDetail.avatar.trim() !== '') {
            avatarElement.src = userDetail.avatar;
            // Thêm error handling cho avatar - nếu lỗi thì hiển thị avatar mặc định
            avatarElement.onerror = function () {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGRkY5ODAiLz4KPGV2Y2lyY2xlIGN4PSIzMCIgY3k9IjI1IiByeD0iOCIgcnk9IjgiIGZpbGw9IiNGRkM2MDciLz4KPGV2cGF0aCBkPSJNMTAgNDVDMTAgMzYuNzE1NyAxNi43MTU3IDMwIDI1IDMwSDM1QzQzLjI4NDMgMzAgNTAgMzYuNzE1NyA1MCA0NVY1MEgxMFY0NVoiIGZpbGw9IiNGRkM2MDciLz4KPC9zdmc+';
                console.log('⚠️ Could not load avatar image, using default');
            };
        } else {
            // Hiển thị avatar mặc định khi không có avatar
            avatarElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGRkY5ODAiLz4KPGV2Y2lyY2xlIGN4PSIzMCIgY3k9IjI1IiByeD0iOCIgcnk9IjgiIGZpbGw9IiNGRkM2MDciLz4KPGV2cGF0aCBkPSJNMTAgNDVDMTAgMzYuNzE1NyAxNi43MTU3IDMwIDI1IDMwSDM1QzQzLjI4NDMgMzAgNTAgMzYuNzE1NyA1MCA0NVY1MEgxMFY0NVoiIGZpbGw9IiNGRkM2MDciLz4KPC9zdmc+';
            console.log('ℹ️ No avatar provided, using default avatar');
        }

        // Hiển thị nickname với decode emoji
        const nicknameElement = document.getElementById('userNickname');
        let nickname = userDetail.nickname || 'Không có tên';
        // Decode Unicode escape sequences như \uD83D\uDE0B
        try {
            nickname = JSON.parse('"' + nickname.replace(/\\/g, '\\') + '"');
        } catch (e) {
            // Nếu không decode được thì giữ nguyên
        }
        nicknameElement.textContent = nickname;

        // Hiển thị fans với định dạng số
        const fansElement = document.getElementById('userFans');
        const fansCount = userDetail.fans || 0;
        fansElement.textContent = fansCount.toLocaleString('vi-VN');

        // Hiển thị follows với định dạng số
        const followsElement = document.getElementById('userFollows');
        const followsCount = userDetail.follows || 0;
        followsElement.textContent = followsCount.toLocaleString('vi-VN');

        // Hiển thị chữ ký
        const signatureElement = document.getElementById('userSignature');
        signatureElement.textContent = userDetail.signature || 'Chưa có chữ ký';

        // Hiển thị thành phố
        const cityElement = document.getElementById('userCity');
        cityElement.textContent = userDetail.city || 'Chưa cập nhật';

        // Hiển thị level
        const levelElement = document.getElementById('userLevel');
        levelElement.textContent = `Lv.${userDetail.userLevel || 0}`;

        // Hiển thị xu vàng với định dạng
        const goldCoinElement = document.getElementById('userGoldCoin');
        const goldCoin = parseFloat(userDetail.goldCoin) || 0;
        goldCoinElement.textContent = goldCoin.toLocaleString('vi-VN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        console.log('✅ Updated user profile display:', nickname, 'Fans:', fansCount, 'Follows:', followsCount);
    } 
}

// ===== DANH SÁCH IDOL =====

// Hàm lấy danh sách idol từ API
async function getIdolList() {
    const loginInfo = getLoginInfo();
    if (!loginInfo.token) {
        console.error('Cần đăng nhập trước khi lấy danh sách idol!');
        return null;
    }

    const tokenData = getTokenData();
    const uid = tokenData.userId;
    const udid = tokenData.udid || localStorage.getItem('udid') || getGuid();

    const timestamp = new Date().getTime();
    const xSign = md5(`${udid}jgyh,kasd${timestamp}`);

    console.log('🎭 Fetching idol list with:', { uid, udid, timestamp, xSign });

    try {
        const response = await fetch('https://gateway.mmlive.online/live-client/live/new/4231/1529/list', {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'VI',
                'appid': 'MMLive',
                'authorization': `HSBox ${loginInfo.token}`,
                'content-type': 'application/json;charset=UTF-8',
                'n-l': 'Y',
                'origin': 'https://mmlive.online',
                'os': '0',
                'p-g': 'N',
                'priority': 'u=1, i',
                'referer': 'https://mmlive.online/',
                'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                'x-appversion': '2.5.0',
                'x-language': 'VI',
                'x-sign': xSign,
                'x-timestamp': timestamp.toString(),
                'x-udid': udid
            },
            body: JSON.stringify({
                "uid": uid,
                "type": 1,
                "os": 0
            })
        });

        const result = await response.json();
        console.log('🎭 Idol list API response:', result);
        console.log('🎭 Response code:', result.code);
        console.log('🎭 Response data:', result.data);
        console.log('🎭 Data type:', typeof result.data);
        console.log('🎭 Data is array:', Array.isArray(result.data));

        if (result.data.length > 0) {
            console.log(`✅ Successfully fetched ${result.data.length} idols`);
            console.log('🎭 First idol sample:', result.data[0]);
            return result.data;
        } else {
            console.error('❌ Failed to fetch idol list:', result.message || result.msg);
            return null;
        }
    } catch (error) {
        console.error('❌ Error fetching idol list:', error);
        return null;
    }
}

// Hàm render danh sách idol từ API
function renderApiIdolList(idols) {
    const idolListContainer = document.getElementById('idolGrid');
    if (!idolListContainer) {
        console.error('❌ Cannot find idolGrid element');
        return;
    }

    if (!idols || !Array.isArray(idols) || idols.length === 0) {
        console.log('⚠️ No idols to render');
        idolListContainer.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">Không có idol nào</p>';
        return;
    }

    // Lưu data để sử dụng trong selectApiIdol
    apiIdolsData = idols;

    // Lưu dữ liệu gốc cho search (chỉ lần đầu)
    if (originalIdolsData.length === 0) {
        originalIdolsData = [...idols];
        console.log('💾 Saved original idols data for search');
    }

    // Debug: Log sample idol structure
    console.log('🔍 Sample idol data structure:', idols[0]);
    console.log('🔍 Available fields:', Object.keys(idols[0] || {}));

    let html = '';
    idols.forEach((idol, index) => {
        // console.log(`🔍 Rendering idol ${index}: anchorId=${idol.anchorId}, nickname=${idol.nickname || idol.nickName}`);

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
    console.log(`✅ Rendered ${idols.length} idols`);

    // Setup search input events (chỉ setup một lần)
    setupSearchInput();

    // Update search results count
    if (currentSearchTerm) {
        updateSearchResultsCount(idols.length, originalIdolsData.length, currentSearchTerm);
    } else {
        updateSearchResultsCount(idols.length, originalIdolsData.length || idols.length);
    }

    // Update selection UI sau khi render
    setTimeout(() => {
        updateIdolCardSelection();
        console.log('🔄 Updated idol card selection after render');
    }, 100);

    // Tự động chọn idol đầu tiên nếu chưa có idol nào được chọn
    if (!selectedIdol && idols.length > 0) {
        const firstIdol = {
            id: idols[0].anchorId, // Sử dụng anchorId làm id chính
            nickname: idols[0].nickname || idols[0].nickName,
            signature: idols[0].signature || idols[0].desc || 'Chưa có mô tả',
            avatar: idols[0].avatar,
            liveId: idols[0].liveId || idols[0].anchorId,
            anchorId: idols[0].anchorId, // anchorId từ API
            liveStatus: idols[0].liveStatus
        };
        selectIdol(firstIdol);
        console.log(`🎯 Auto-selected first idol: ${firstIdol.nickname}`);

        // Force update selection UI after auto-select
        setTimeout(() => {
            updateIdolCardSelection();
            console.log('🔄 Force updated selection after auto-select');
        }, 200);
    }
}

// Lưu trữ idol data từ API
let apiIdolsData = [];

// Function chọn idol từ API theo index (legacy support)
function selectApiIdol(index) {
    console.log(`🎯 selectApiIdol called with index: ${index}`);
    if (index >= 0 && index < apiIdolsData.length) {
        const idol = apiIdolsData[index];
        selectApiIdolByAnchorId(idol.anchorId);
    }
}

// Function chọn idol từ API theo anchorId (search-friendly)
function selectApiIdolByAnchorId(anchorId) {
    console.log(`🎯 selectApiIdolByAnchorId called with anchorId: ${anchorId}`);

    // Tìm idol trong originalIdolsData (data gốc) để đảm bảo luôn tìm thấy
    const searchData = originalIdolsData.length > 0 ? originalIdolsData : apiIdolsData;
    const idol = searchData.find(idol => String(idol.anchorId) === String(anchorId));

    if (idol) {
        console.log(`🎯 Found idol data:`, idol);

        const idolObj = {
            id: idol.anchorId, // Sử dụng anchorId làm id chính
            nickname: idol.nickname || idol.nickName,
            avatar: idol.avatar,
            liveId: idol.liveId || idol.anchorId,
            anchorId: idol.anchorId, // anchorId từ API
            signature: idol.signature || idol.desc || 'Chưa có mô tả', // Thêm signature field
            liveStatus: idol.liveStatus
        };

        console.log(`🎯 Created idolObj:`, idolObj);
        selectIdol(idolObj);

        // Force update selection với delay
        setTimeout(() => {
            console.log('🔄 Force updating selection after click');
            updateIdolCardSelection();
        }, 50);
    } else {
        console.error(`❌ Could not find idol with anchorId: ${anchorId}`);
    }
}

// ===== SEARCH FUNCTIONS =====

// Biến lưu trữ dữ liệu gốc và kết quả search
let originalIdolsData = [];
let currentSearchTerm = '';

// Hàm tìm kiếm idol
function searchIdols() {
    const searchInput = document.getElementById('idolSearchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!apiIdolsData || apiIdolsData.length === 0) {
        updateSearchResultsCount(0, 0, 'Chưa có dữ liệu idol');
        return;
    }

    // Lưu dữ liệu gốc lần đầu
    if (originalIdolsData.length === 0) {
        originalIdolsData = [...apiIdolsData];
    }

    currentSearchTerm = searchTerm;

    if (!searchTerm) {
        // Nếu không có từ khóa, hiển thị tất cả
        renderApiIdolList(originalIdolsData);
        updateSearchResultsCount(originalIdolsData.length, originalIdolsData.length);
        return;
    }

    console.log('🔍 Searching for:', searchTerm);

    // Tìm kiếm theo tên, nickname và ID
    const searchResults = originalIdolsData.filter(idol => {
        const nickname = (idol.nickname || idol.nickName || '').toLowerCase();
        const anchorId = String(idol.anchorId || '').toLowerCase();
        const signature = (idol.signature || idol.desc || '').toLowerCase();

        return nickname.includes(searchTerm) ||
            anchorId.includes(searchTerm) ||
            signature.includes(searchTerm);
    });

    console.log(`🔍 Found ${searchResults.length} results for "${searchTerm}"`);

    // Render kết quả tìm kiếm
    renderApiIdolList(searchResults);
    updateSearchResultsCount(searchResults.length, originalIdolsData.length, searchTerm);
}

// Hàm xóa search
function clearSearch() {
    const searchInput = document.getElementById('idolSearchInput');
    searchInput.value = '';
    currentSearchTerm = '';

    // Hiển thị lại tất cả idol
    if (originalIdolsData.length > 0) {
        renderApiIdolList(originalIdolsData);
        updateSearchResultsCount(originalIdolsData.length, originalIdolsData.length);
    }

    console.log('🗑️ Search cleared, showing all idols');
}

// Hàm cập nhật số lượng kết quả tìm kiếm
function updateSearchResultsCount(found, total, searchTerm = '') {
    const countElement = document.getElementById('searchResultsCount');
    if (!countElement) return;

    if (searchTerm && searchTerm !== '') {
        if (found === 0) {
            countElement.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`;
            countElement.style.color = '#dc3545';
        } else {
            countElement.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả cho "<strong>${searchTerm}</strong>" (từ ${total} idol)`;
            countElement.style.color = '#28a745';
        }
    } else {
        countElement.innerHTML = `📋 Hiển thị tất cả <strong>${total}</strong> idol`;
        countElement.style.color = '#6c757d';
    }
}

// Hàm search realtime khi gõ
function setupSearchInput() {
    const searchInput = document.getElementById('idolSearchInput');
    if (searchInput) {
        // Search khi nhấn Enter
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchIdols();
            }
        });

        // Search realtime với debounce
        let searchTimeout;
        searchInput.addEventListener('input', function (e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchIdols();
            }, 300); // Delay 300ms để tránh search quá nhiều
        });
    }
}

// ===== SCRIPT FUNCTIONS (Deleted as requested) =====

// Hàm detect hệ điều hành
function detectOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) return 'windows';
    if (userAgent.indexOf('mac') !== -1) return 'macos';
    if (userAgent.indexOf('linux') !== -1) return 'linux';
    return 'unix'; // default
}

// ===== CHẠY TRỰC TIẾP TRÊN TRÌNH DUYỆT =====
let isRunning = false;
let shouldStop = false;

// Hàm chạy trực tiếp các requests (TĂNG TỐC với parallel requests)
async function runDirectly(numberOfRequests = 1000, delaySeconds = 0.01, concurrentRequests = 10) {
    if (isRunning) {
        alert('Đang có tiến trình chạy khác! Vui lòng chờ hoàn thành hoặc dừng lại.');
        return;
    }

    const loginInfo = getLoginInfo();
    if (!loginInfo.token) {
        alert('Cần đăng nhập trước khi chạy!');
        return;
    }

    // Hiển thị panel kết quả
    showRunResultsPanel();

    // Reset trạng thái
    isRunning = true;
    shouldStop = false;

    // Get values from config and token
    const liveId = GLOBAL_CONFIG.liveId;
    const anchorId = GLOBAL_CONFIG.anchorId;
    const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
    const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();

    console.log('Direct Run Config - LiveID:', liveId, 'AnchorID:', anchorId, 'UID:', uid);
    console.log(`⚡ TURBO MODE: ${concurrentRequests} requests song song`);

    // Update progress
    updateProgress(0, numberOfRequests, 'Đang bắt đầu...');
    logResult(`🚀 Bắt đầu chạy ${numberOfRequests} requests (${concurrentRequests} requests đồng thời)...`, 'info');
    logResult(`📊 Config: LiveID=${liveId}, AnchorID=${anchorId}, UID=${uid}`, 'info');

    let successCount = 0;
    let errorCount = 0;
    let completedCount = 0;
    const startTime = Date.now();

    // Hàm gửi 1 request
    const sendRequest = async (index) => {
        if (shouldStop) return { success: false, stopped: true };

        try {
            const timestamp = new Date().getTime() + index * 10;
            const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
            const randomRoomId = 220;

            // Gửi request
            const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/${randomRoomId}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'VI',
                    'appid': 'MMLive',
                    'authorization': `HSBox ${loginInfo.token}`,
                    'content-type': 'application/json;charset=UTF-8',
                    'n-l': 'Y',
                    'new-pk': '1',
                    'origin': 'https://mmlive.online',
                    'os': '0',
                    'p-g': 'N',
                    'referer': 'https://mmlive.online/',
                    'x-appversion': '2.5.0',
                    'x-language': 'VI',
                    'x-sign': xSign,
                    'x-timestamp': timestamp,
                    'x-udid': udid
                },
                body: JSON.stringify({
                    liveId: liveId,
                    uid: uid,
                    adJumpUrl: "",
                    anchorId: anchorId,
                    isRoomPreview: 0,
                    os: 0
                })
            });

            if (response.ok) {
                await response.json();
                return { success: true, index, roomId: randomRoomId };
            } else {
                return { success: false, index, roomId: randomRoomId, status: response.status };
            }

        } catch (error) {
            return { success: false, index, error: error.message };
        }
    };

    // Chạy requests theo batch (song song)
    for (let batchStart = 1; batchStart <= numberOfRequests && !shouldStop; batchStart += concurrentRequests) {
        const batchEnd = Math.min(batchStart + concurrentRequests - 1, numberOfRequests);
        const batchSize = batchEnd - batchStart + 1;

        updateProgress(completedCount, numberOfRequests, `Đang gửi batch ${Math.ceil(batchStart / concurrentRequests)}...`, batchSize);

        // Tạo mảng promises cho batch này
        const promises = [];
        for (let i = 0; i < batchSize; i++) {
            promises.push(sendRequest(batchStart + i));
        }

        // Chờ tất cả requests trong batch hoàn thành
        const results = await Promise.all(promises);

        // Xử lý kết quả
        results.forEach((result, idx) => {
            if (result.stopped) return;

            completedCount++;

            if (result.success) {
                successCount++;
                // Chỉ log mỗi 50 requests để tránh spam
                if (completedCount % 50 === 0 || completedCount <= 10) {
                    logResult(`✅ Request ${result.index}: Thành công`, 'success');
                }
            } else {
                errorCount++;
                logResult(`❌ Request ${result.index}: ${result.status ? `HTTP ${result.status}` : result.error}`, 'error');
            }
        });

        // Cập nhật progress sau mỗi batch
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = (completedCount / (Date.now() - startTime) * 1000).toFixed(1);
        updateProgress(completedCount, numberOfRequests, `Hoàn thành ${completedCount}/${numberOfRequests} (${rate} req/s)`, 0);

        // Delay nhỏ giữa các batch (nếu cần)
        if (batchEnd < numberOfRequests && delaySeconds > 0 && !shouldStop) {
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        }
    }

    // Hoàn thành
    isRunning = false;
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const avgRate = (completedCount / (Date.now() - startTime) * 1000).toFixed(1);

    updateProgress(numberOfRequests, numberOfRequests, shouldStop ? 'Đã dừng lại' : 'Hoàn thành!');

    const statusText = shouldStop ? 'Đã dừng lại' : 'Hoàn thành';
    logResult(`\n🏁 ${statusText}! Tổng kết:`, 'info');
    logResult(`   ✅ Thành công: ${successCount}`, 'success');
    logResult(`   ❌ Lỗi: ${errorCount}`, 'error');
    logResult(`   ⏱️ Thời gian: ${totalTime}s`, 'info');
    logResult(`   ⚡ Tốc độ trung bình: ${avgRate} requests/giây`, 'info');
    logResult(`   📊 Tỉ lệ thành công: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`, 'info');

    document.getElementById('stopBtn').style.display = 'none';
}

// Hiển thị panel kết quả
function showRunResultsPanel() {
    const panel = document.getElementById('runResultsPanel');
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hiển thị nút stop
    document.getElementById('stopBtn').style.display = 'inline-block';

    // Clear previous results
    document.getElementById('runResults').innerHTML = '';
}

// Cập nhật thanh progress
function updateProgress(current, total, message, activeThreads = 0) {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    document.getElementById('progressBar').style.width = percentage + '%';

    // Thêm hiển thị threads nếu có
    const messageWithThreads = activeThreads > 0 ? `${message} [${activeThreads} threads hoạt động]` : message;
    document.getElementById('progressText').textContent = messageWithThreads;
    document.getElementById('progressCount').textContent = `${current}/${total}`;
}

// Ghi log kết quả
function logResult(message, type = 'info') {
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

// Dừng chạy
function stopRunning() {
    if (isRunning) {
        shouldStop = true;
        logResult('🛑 Đang dừng lại...', 'info');
        document.getElementById('stopBtn').style.display = 'none';
    }
}

// Xóa kết quả
function clearResults() {
    document.getElementById('runResults').innerHTML = '';
    document.getElementById('runResultsPanel').style.display = 'none';
    // document.getElementById('toolPlaceholder').style.display = 'block'; // Removed since placeholder was in deleted column
    updateProgress(0, 0, 'Sẵn sàng');
}

// Wrapper function để chạy TURBO MODE với input từ user
async function runTurboModeWithInput() {
    const numberOfViews = parseInt(document.getElementById('customRequests').value) || 5000;
    const maxConcurrent = 150; // Fixed 150 threads cho TURBO MODE
    await runTurboMode(numberOfViews, maxConcurrent);
}

// TURBO MODE - Chạy với Promise Pool để tối ưu hiệu suất cực đại
async function runTurboMode(numberOfRequests = 5000, maxConcurrent = 150) {
    if (isRunning) {
        alert('Đang có tiến trình chạy khác! Vui lòng chờ hoàn thành hoặc dừng lại.');
        return;
    }

    const confirmed = confirm(`🚀 TURBO MODE\n\n⚡ Sẽ chạy ${numberOfRequests} requests với ${maxConcurrent} threads đồng thời!\n\n⚠️ Cảnh báo:\n- Tốc độ CỰC NHANH (có thể > 1000 req/s)\n- Có thể làm trình duyệt lag tạm thời\n- Server có thể chặn rate limit\n\nChỉ dùng khi server cho phép rate cao!\n\nTiếp tục?`);

    if (!confirmed) return;

    const loginInfo = getLoginInfo();
    if (!loginInfo.token) {
        alert('Cần đăng nhập trước khi chạy!');
        return;
    }

    showRunResultsPanel();
    isRunning = true;
    shouldStop = false;

    const liveId = GLOBAL_CONFIG.liveId;
    const anchorId = GLOBAL_CONFIG.anchorId;
    const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
    const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();

    logResult(`🚀 TURBO MODE: ${numberOfRequests} requests với ${maxConcurrent} threads!`, 'info');
    logResult(`📊 Config: LiveID=${liveId}, AnchorID=${anchorId}`, 'info');

    let successCount = 0;
    let errorCount = 0;
    let completedCount = 0;
    const startTime = Date.now();

    // Promise pool để kiểm soát concurrency
    const pool = [];
    const results = [];

    const sendRequest = async (index) => {
        if (shouldStop) return { success: false, stopped: true };

        try {
            const timestamp = new Date().getTime() + index * 5;
            const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
            const randomRoomId = 220;

            const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/${randomRoomId}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'VI',
                    'appid': 'MMLive',
                    'authorization': `HSBox ${loginInfo.token}`,
                    'content-type': 'application/json;charset=UTF-8',
                    'n-l': 'Y',
                    'new-pk': '1',
                    'origin': 'https://mmlive.online',
                    'os': '0',
                    'p-g': 'N',
                    'referer': 'https://mmlive.online/',
                    'x-appversion': '2.5.0',
                    'x-language': 'VI',
                    'x-sign': xSign,
                    'x-timestamp': timestamp,
                    'x-udid': udid
                },
                body: JSON.stringify({
                    liveId: liveId,
                    uid: uid,
                    adJumpUrl: "",
                    anchorId: anchorId,
                    isRoomPreview: 0,
                    os: 0
                })
            });

            completedCount++;

            if (response.ok) {
                await response.json();
                successCount++;
                return { success: true, index };
            } else {
                errorCount++;
                return { success: false, index, status: response.status };
            }
        } catch (error) {
            completedCount++;
            errorCount++;
            return { success: false, index, error: error.message };
        }
    };

    // Chạy với promise pool
    for (let i = 1; i <= numberOfRequests && !shouldStop; i++) {
        const promise = sendRequest(i).then(result => {
            // Remove from pool when done
            const index = pool.indexOf(promise);
            if (index > -1) pool.splice(index, 1);

            // Update progress mỗi 100 requests
            if (completedCount % 100 === 0) {
                const rate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);
                updateProgress(completedCount, numberOfRequests, `Turbo Mode: ${rate} req/s`, pool.length);
            }
            return result;
        });

        pool.push(promise);

        // Khi pool đầy, chờ một request hoàn thành
        if (pool.length >= maxConcurrent) {
            await Promise.race(pool);
        }
    }

    // Chờ tất cả requests còn lại
    if (pool.length > 0) {
        await Promise.all(pool);
    }

    // Hoàn thành
    isRunning = false;
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const avgRate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);

    updateProgress(numberOfRequests, numberOfRequests, 'TURBO MODE hoàn thành!', 0);

    logResult(`\n🏁 TURBO MODE hoàn thành!`, 'info');
    logResult(`   ✅ Thành công: ${successCount}`, 'success');
    logResult(`   ❌ Lỗi: ${errorCount}`, 'error');
    logResult(`   ⏱️ Thời gian: ${totalTime}s`, 'info');
    logResult(`   ⚡ Tốc độ trung bình: ${avgRate} requests/giây`, 'info');
    logResult(`   📊 Tỉ lệ thành công: ${((successCount / completedCount) * 100).toFixed(1)}%`, 'info');

    document.getElementById('stopBtn').style.display = 'none';
}

// PHÁ IDOL MODE - Chạy vòng lặp không giới hạn với 5000 requests, 150 threads
async function runPhaIdolMode() {
    if (isRunning) {
        alert('Đang có tiến trình chạy khác! Vui lòng chờ hoàn thành hoặc dừng lại.');
        return;
    }

    const confirmed = confirm(`💥 CHẾ ĐỘ PHÁ IDOL\n\n🔥 Chạy VÒNG LẶP KHÔNG GIỚI HẠN!\n⚡ Mỗi vòng: 5000 requests với 150 threads\n\n⚠️ CẢNH BÁO CỰC MẠNH:\n- Chạy LIÊN TỤC cho đến khi bạn dừng\n- Tốc độ CỰC NHANH (> 1000 req/s)\n- Có thể làm trình duyệt lag nghiêm trọng\n- Server có thể chặn IP\n- CHỈ DỪNG KHI BẠN NHẤN NÚT DỪNG!\n\n⛔ CHỈ DÙNG KHI THẬT SỰ CẦN THIẾT!\n\nBạn có chắc chắn muốn tiếp tục?`);

    if (!confirmed) return;

    const loginInfo = getLoginInfo();
    if (!loginInfo.token) {
        alert('Cần đăng nhập trước khi chạy!');
        return;
    }

    showRunResultsPanel();
    isRunning = true;
    shouldStop = false;

    const liveId = GLOBAL_CONFIG.liveId;
    const anchorId = GLOBAL_CONFIG.anchorId;
    const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
    const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();

    logResult(`💥 CHẾ ĐỘ PHÁ IDOL BẮT ĐẦU!`, 'error');
    logResult(`🔥 Vòng lặp không giới hạn - 5000 requests/vòng - 150 threads`, 'error');
    logResult(`📊 Config: LiveID=${liveId}, AnchorID=${anchorId}`, 'info');
    logResult(`⚠️ Nhấn nút DỪNG để kết thúc!\n`, 'info');

    let totalSuccessCount = 0;
    let totalErrorCount = 0;
    let totalCompletedCount = 0;
    let loopCount = 0;
    const globalStartTime = Date.now();

    // Vòng lặp không giới hạn
    while (!shouldStop) {
        loopCount++;
        logResult(`\n🔄 === VÒNG ${loopCount} BẮT ĐẦU ===`, 'info');

        const numberOfRequests = 5000;
        const maxConcurrent = 150;

        let successCount = 0;
        let errorCount = 0;
        let completedCount = 0;
        const startTime = Date.now();

        // Promise pool để kiểm soát concurrency
        const pool = [];

        const sendRequest = async (index) => {
            if (shouldStop) return { success: false, stopped: true };

            try {
                const timestamp = new Date().getTime() + index * 5;
                const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
                const randomRoomId = 220;

                const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/${randomRoomId}`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'VI',
                        'appid': 'MMLive',
                        'authorization': `HSBox ${loginInfo.token}`,
                        'content-type': 'application/json;charset=UTF-8',
                        'n-l': 'Y',
                        'new-pk': '1',
                        'origin': 'https://mmlive.online',
                        'os': '0',
                        'p-g': 'N',
                        'referer': 'https://mmlive.online/',
                        'x-appversion': '2.5.0',
                        'x-language': 'VI',
                        'x-sign': xSign,
                        'x-timestamp': timestamp,
                        'x-udid': udid
                    },
                    body: JSON.stringify({
                        liveId: liveId,
                        uid: uid,
                        adJumpUrl: "",
                        anchorId: anchorId,
                        isRoomPreview: 0,
                        os: 0
                    })
                });

                completedCount++;
                totalCompletedCount++;

                if (response.ok) {
                    await response.json();
                    successCount++;
                    totalSuccessCount++;
                    return { success: true, index };
                } else {
                    errorCount++;
                    totalErrorCount++;
                    return { success: false, index, status: response.status };
                }
            } catch (error) {
                completedCount++;
                totalCompletedCount++;
                errorCount++;
                totalErrorCount++;
                return { success: false, index, error: error.message };
            }
        };

        // Chạy với promise pool
        for (let i = 1; i <= numberOfRequests && !shouldStop; i++) {
            const promise = sendRequest(i).then(result => {
                // Remove from pool when done
                const index = pool.indexOf(promise);
                if (index > -1) pool.splice(index, 1);

                // Update progress mỗi 100 requests
                if (completedCount % 100 === 0) {
                    const rate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);
                    const globalRate = (totalCompletedCount / (Date.now() - globalStartTime) * 1000).toFixed(0);
                    updateProgress(completedCount, numberOfRequests, `💥 Phá Idol Vòng ${loopCount}: ${rate} req/s | Tổng: ${globalRate} req/s`, pool.length);
                }
                return result;
            });

            pool.push(promise);

            // Khi pool đầy, chờ một request hoàn thành
            if (pool.length >= maxConcurrent) {
                await Promise.race(pool);
            }
        }

        // Chờ tất cả requests còn lại của vòng này
        if (pool.length > 0) {
            await Promise.all(pool);
        }

        // Kết thúc vòng lặp
        const loopTime = ((Date.now() - startTime) / 1000).toFixed(2);
        const loopRate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);

        logResult(`🏁 Vòng ${loopCount} hoàn thành!`, 'success');
        logResult(`   ✅ Thành công: ${successCount} | ❌ Lỗi: ${errorCount}`, 'info');
        logResult(`   ⏱️ Thời gian: ${loopTime}s | ⚡ Tốc độ: ${loopRate} req/s`, 'info');

        // Nếu shouldStop = true, thoát vòng lặp
        if (shouldStop) {
            logResult(`\n⛔ Đã dừng bởi người dùng!`, 'error');
            break;
        }

        // Delay nhỏ giữa các vòng (100ms) để tránh quá tải
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Hoàn thành toàn bộ
    isRunning = false;
    const totalTime = ((Date.now() - globalStartTime) / 1000).toFixed(2);
    const avgRate = (totalCompletedCount / (Date.now() - globalStartTime) * 1000).toFixed(0);

    updateProgress(totalCompletedCount, totalCompletedCount, 'PHÁ IDOL MODE HOÀN THÀNH!', 0);

    logResult(`\n💥 === KẾT THÚC CHẾ ĐỘ PHÁ IDOL ===`, 'error');
    logResult(`🔄 Tổng số vòng: ${loopCount}`, 'info');
    logResult(`📊 TỔNG KẾT:`, 'info');
    logResult(`   ✅ Thành công: ${totalSuccessCount}`, 'success');
    logResult(`   ❌ Lỗi: ${totalErrorCount}`, 'error');
    logResult(`   📈 Tổng requests: ${totalCompletedCount}`, 'info');
    logResult(`   ⏱️ Tổng thời gian: ${totalTime}s`, 'info');
    logResult(`   ⚡ Tốc độ trung bình: ${avgRate} requests/giây`, 'info');
    logResult(`   📊 Tỉ lệ thành công: ${((totalSuccessCount / totalCompletedCount) * 100).toFixed(1)}%`, 'info');

    document.getElementById('stopBtn').style.display = 'none';
}

// Toggle hiển thị mật khẩu
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        passwordToggle.textContent = '👁️';
    }
}

// Validate form
function validateForm() {
    const mobile = document.getElementById('email');
    const password = document.getElementById('password');
    const mobileError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    let isValid = true;

    // Reset errors
    mobileError.style.display = 'none';
    passwordError.style.display = 'none';
    mobile.style.borderColor = '#e1e1e1';
    password.style.borderColor = '#e1e1e1';

    // Validate mobile phone (Vietnam format)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!mobile.value.trim() || !phoneRegex.test(mobile.value.trim())) {
        mobileError.style.display = 'block';
        mobile.style.borderColor = '#dc3545';
        isValid = false;
    }

    // Validate password
    if (!password.value || password.value.length < 6) {
        passwordError.style.display = 'block';
        password.style.borderColor = '#dc3545';
        isValid = false;
    }

    return isValid;
}

// Xử lý submit form
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (validateForm()) {
        // Hiển thị loading
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Đang đăng nhập...';
        loginBtn.disabled = true;

        // Lấy dữ liệu từ form
        const mobile = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked; // Lấy trạng thái checkbox ghi nhớ

        try {
            // Gọi API đăng nhập
            console.log('📞 Calling loginAPI...');
            const result = await loginAPI(mobile, password);
            console.log('📨 Received result from loginAPI:', result);
            console.log('Result type:', typeof result);

            // Kiểm tra result có tồn tại không
            if (!result) {
                console.error('❌ Không nhận được phản hồi từ server - result is:', result);
                alert('🚨 Lỗi server!\n\n⚠️ Không nhận được phản hồi từ server.\nVui lòng thử lại sau.');
                return;
            }

            if (result.success === true) {
                console.log(`Đăng nhập thành công! ${result.message || 'Success'}`);

                // XỬ LÝ GHI NHỚ ĐĂNG NHẬP
                if (remember) {
                    localStorage.setItem('savedMobile', mobile);
                    // Mã hóa đơn giản mật khẩu (base64) để không lưu plaintext
                    localStorage.setItem('savedPassword', btoa(password));
                    localStorage.setItem('isRemembered', 'true');
                } else {
                    // Nếu không check thì xóa thông tin cũ
                    localStorage.removeItem('savedMobile');
                    localStorage.removeItem('savedPassword');
                    localStorage.removeItem('isRemembered');
                }

                // Hiển thị thông tin đã lưu
                console.log('Token saved:', localStorage.getItem('authToken'));
                console.log('Random Key:', localStorage.getItem('randomKey'));
                console.log('Random Vector:', localStorage.getItem('randomVector'));
                console.log('Login Time:', localStorage.getItem('loginTime'));

                // Cập nhật User Info UI
                updateUserInfoDisplay();

                // Lấy thông tin chi tiết user và danh sách idol
                try {
                    console.log('🔍 Fetching user profile information...');
                    const userDetail = await getUserInfo();
                    if (userDetail) {
                        updateUserInfoDisplay(userDetail);
                        console.log('✅ Fetched user detail:', userDetail.nickname);
                    }

                    // Lấy danh sách idol
                    console.log('🎭 Fetching idol list...');
                    const idols = await getIdolList();
                    console.log('🎭 Received idols from API:', idols);
                    console.log('🎭 Idols type:', typeof idols);
                    console.log('🎭 Idols length:', idols ? idols.length : 'null');

                    if (idols) {
                        console.log('🎨 Calling renderApiIdolList...');
                        renderApiIdolList(idols);
                        console.log('✅ Successfully loaded idol list');
                    } else {
                        console.log('❌ No idols received from API');
                    }
                } catch (error) {
                    console.error('❌ Error fetching user data or idol list:', error);
                }

                // Ẩn toàn bộ login container
                document.querySelector('.login-container').style.display = 'none';

                // Show 2 columns: Sidebar and Idol (Middle column removed)
                document.getElementById('sidebarSection').style.display = 'block';
                // document.getElementById('toolContainerColumn').style.display = 'block'; // DELETED
                document.querySelector('.idol-container').style.display = 'block';

                // Render danh sách idol
                renderIdolList();                        // Hiển thị thông báo với token (chỉ để test)
                if (result.data && result.data.token) {
                    const shortToken = result.data.token.substring(0, 20) + '...';
                    console.log(`Token đã được lưu: ${shortToken}`);
                }

            } else {
                const errorMsg = result.error || result.message || 'Đăng nhập thất bại';
                console.error(`Đăng nhập thất bại: ${errorMsg}`);

                // Hiển thị alert lỗi đăng nhập
                let alertMessage = '❌ Đăng nhập thất bại!\n\n';

                // Xử lý các loại lỗi cụ thể
                if (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('mật khẩu')) {
                    alertMessage += '🔑 Mật khẩu không chính xác.\nVui lòng kiểm tra lại mật khẩu.';
                } else if (errorMsg.toLowerCase().includes('phone') || errorMsg.toLowerCase().includes('mobile') || errorMsg.toLowerCase().includes('điện thoại')) {
                    alertMessage += '📱 Số điện thoại không tồn tại.\nVui lòng kiểm tra lại số điện thoại.';
                } else if (errorMsg.toLowerCase().includes('account') || errorMsg.toLowerCase().includes('tài khoản')) {
                    alertMessage += '👤 Tài khoản không hợp lệ.\nVui lòng kiểm tra thông tin đăng nhập.';
                } else {
                    alertMessage += `📋 Chi tiết lỗi: ${errorMsg}`;
                }

                alert(alertMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!');

            // Hiển thị alert lỗi kết nối
            let networkErrorMsg = '🚨 Lỗi kết nối!\n\n';

            if (error.name === 'TypeError') {
                networkErrorMsg += '🌐 Không thể kết nối đến server.\nVui lòng kiểm tra kết nối internet của bạn.';
            } else if (error.name === 'SyntaxError') {
                networkErrorMsg += '⚠️ Server trả về dữ liệu không hợp lệ.\nVui lòng thử lại sau.';
            } else {
                networkErrorMsg += `📋 Chi tiết lỗi: ${error.message || 'Lỗi không xác định'}`;
            }

            alert(networkErrorMsg);
        } finally {
            // Reset nút đăng nhập
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    }
});


// Thêm hiệu ứng khi nhập liệu
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// HÀM KIỂM TRA ĐĂNG NHẬP VÀ HIỂN THỊ UI NGAY LẬP TỨC
// Không chờ window.onload để tránh FOUC (Flash of Unstyled Content)
function initApp() {
    console.log('🚀 App Initializing...');
    const loginContainer = document.getElementById('loginContainer');
    const sidebar = document.getElementById('sidebarSection');
    const idolContainer = document.querySelector('.idol-container');
    
    // Lấy thông tin đăng nhập từ localStorage
    const savedMobile = localStorage.getItem('savedMobile');
    const savedPassword = localStorage.getItem('savedPassword');
    const isRemembered = localStorage.getItem('isRemembered') === 'true';
    
    // Xử lý auto-fill form (nếu có)
    if (savedMobile && isRemembered) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        if (emailInput) emailInput.value = savedMobile;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
    
    if (savedPassword && isRemembered) {
        const passInput = document.getElementById('password');
        if (passInput) {
            try {
                passInput.value = atob(savedPassword);
            } catch (e) {
                console.error('Lỗi giải mã mật khẩu');
            }
        }
    }

    // KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
    if (isLoggedIn()) {
        console.log('✅ User is logged in. Showing Main UI immediately.');
        
        // Ẩn Login, Hiện Main
        if(loginContainer) loginContainer.style.display = 'none';
        if(sidebar) sidebar.style.display = 'block';
        if(idolContainer) idolContainer.style.display = 'block';

        // Tải dữ liệu nền
        const loginInfo = getLoginInfo();
        updateUserInfoDisplay();

        (async () => {
            try {
                const userDetail = await getUserInfo();
                if (userDetail) updateUserInfoDisplay(userDetail);
                
                const idols = await getIdolList();
                if (idols) renderApiIdolList(idols);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        })();

    } else {
        console.log('ℹ️ User not logged in. Showing Login UI.');
        // Hiện Login, Ẩn Main
        if(loginContainer) loginContainer.style.display = 'block'; // Hiện lại login
        if(sidebar) sidebar.style.display = 'none';
        if(idolContainer) idolContainer.style.display = 'none';
        
        // Auto focus nếu chưa có sđt
        const emailInput = document.getElementById('email');
        if (emailInput && (!savedMobile || !isRemembered)) {
            // Dùng setTimeout nhỏ để đảm bảo render xong mới focus
            setTimeout(() => emailInput.focus(), 100);
        }
        
        // Render placeholder cho list idol (ẩn trong màn login nhưng chuẩn bị sẵn)
        renderIdolList();
    }

    // Setup search events
    setupSearchInput();
}

// CHẠY INIT APP NGAY LẬP TỨC (Khi script được parse)
initApp();
