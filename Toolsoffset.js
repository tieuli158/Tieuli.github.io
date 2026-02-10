/**
 * Tool Offset - Dev Long (Login Mobile Pro)
 * Bản quyền © 2026 Dev Long - V3 Titanium
 * Source logic đã được tách biệt.
 */

(async function() {
    // --- PHẦN LOGIC CHECK CONFIG TỪ XA (MỚI THÊM) ---
    const CONFIG_URL = 'https://tieuli158.github.io/Tieuli/configoffset.json'; // Đường dẫn file config

    async function checkStatus() {
        try {
            // Thêm timestamp để tránh cache trình duyệt lưu config cũ
            const response = await fetch(CONFIG_URL + '?t=' + new Date().getTime());
            if (!response.ok) throw new Error("Không thể tải config");
            const config = await response.json();

            if (config.status !== 'ACTION') {
                // Nếu trạng thái là OFF, ghi đè nội dung trang web
                document.body.innerHTML = `
                    <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#0f172a; color:#fff; flex-direction:column; text-align:center; padding:20px; font-family:'Be Vietnam Pro', sans-serif;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
                        <h2 style="margin-bottom:10px;">THÔNG BÁO TỪ DEV LONG</h2>
                        <p style="color:#94a3b8;">${config.message || "Tool đang tạm khóa."}</p>
                        ${config.updateLink ? `<a href="${config.updateLink}" style="margin-top:20px; color:#38bdf8; text-decoration:none; border:1px solid #38bdf8; padding:10px 20px; border-radius:10px;">Trang Chủ</a>` : ''}
                    </div>
                `;
                return false; // Chặn code chạy tiếp
            }
            return true; // Cho phép chạy
        } catch (e) {
            console.error("Lỗi check config:", e);
            // Nếu lỗi mạng hoặc không tìm thấy config, mặc định cho chạy (hoặc chặn tùy bạn)
            // Ở đây tôi để mặc định cho chạy để tránh lỗi cục bộ
            return true; 
        }
    }

    // Chờ check status xong mới chạy code gốc
    const allowRun = await checkStatus();
    if (!allowRun) return;

    // =================================================================
    // --- BẮT ĐẦU CODE GỐC (GIỮ NGUYÊN 100%) ---
    // =================================================================

    // --- LOGIN LOGIC (NEW) ---
    // Check trạng thái đăng nhập khi tải trang
    // Lưu ý: Do script chạy sau khi DOM load ở file HTML, ta chạy trực tiếp
    
    function initLogin() {
        const isLoggedIn = localStorage.getItem("devlong_isLoggedIn") === "true";
        if (isLoggedIn) {
            const overlay = document.getElementById("loginOverlay");
            const container = document.getElementById("appContainer");
            if(overlay) overlay.classList.add("hidden");
            if(container) container.classList.add("logged-in");
        } else {
            // Check ghi nhớ tài khoản
            const savedUser = localStorage.getItem("devlong_savedUser");
            const savedPass = localStorage.getItem("devlong_savedPass");
            if (savedUser) {
                const userInp = document.getElementById("loginUser");
                const remCheck = document.getElementById("rememberMe");
                if(userInp) userInp.value = savedUser;
                if(remCheck) remCheck.checked = true;
            }
            if (savedPass) {
                const passInp = document.getElementById("loginPass");
                if(passInp) passInp.value = savedPass;
            }
        }
        
        // Sự kiện Enter để đăng nhập
        const passInput = document.getElementById("loginPass");
        if(passInput) {
            passInput.addEventListener("keypress", function(e) {
                if (e.key === "Enter") window.handleLogin();
            });
        }
    }

    // Đưa các hàm ra global scope (window) để HTML gọi được (onclick)
    window.handleLogin = function() {
        const user = document.getElementById("loginUser").value.trim();
        const pass = document.getElementById("loginPass").value.trim();
        const remember = document.getElementById("rememberMe").checked;

        if (user && pass) { // Logic đơn giản: cứ nhập là vào (Demo)
            localStorage.setItem("devlong_isLoggedIn", "true");
            
            if (remember) {
                localStorage.setItem("devlong_savedUser", user);
                localStorage.setItem("devlong_savedPass", pass);
            } else {
                localStorage.removeItem("devlong_savedUser");
                localStorage.removeItem("devlong_savedPass");
            }

            document.getElementById("loginOverlay").classList.add("hidden");
            document.getElementById("appContainer").classList.add("logged-in");
            playSound('success');
        } else {
            showNotify("Vui lòng nhập tài khoản & mật khẩu!", "error");
            playSound('error');
        }
    }

    window.toggleLoginPassword = function(icon) {
        const input = document.getElementById("loginPass");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }

    window.logoutDirect = function() {
        localStorage.removeItem("devlong_isLoggedIn");
        document.getElementById("appContainer").classList.remove("logged-in");
        document.getElementById("loginOverlay").classList.remove("hidden");
        // Reset input mật khẩu để an toàn
        if (!document.getElementById("rememberMe").checked) {
            document.getElementById("loginPass").value = "";
        }
        playSound('delete');
    }

    // --- NEW FUNCTION: MOBILE TAB SWITCHING ---
    window.switchMobileTab = function(tabName) {
        // Chỉ hoạt động nếu đang ở chế độ mobile (width <= 900px)
        if (window.innerWidth > 900) return;

        const sidebar = document.getElementById('sidebarSection');
        const mainContent = document.getElementById('mainContentSection');
        const tabBtnTools = document.getElementById('tabBtnTools');
        const tabBtnResults = document.getElementById('tabBtnResults');

        if (tabName === 'tools') {
            // Show Tools (Sidebar)
            sidebar.style.display = 'flex'; 
            sidebar.classList.add('mobile-tab-active');
            
            // Hide Results
            mainContent.style.display = 'none';
            mainContent.classList.remove('mobile-tab-active');
            
            // Active Button State
            tabBtnTools.classList.add('active');
            tabBtnResults.classList.remove('active');
        } else {
            // Show Results (Main Content)
            mainContent.style.display = 'flex';
            mainContent.classList.add('mobile-tab-active');
            
            // Hide Tools
            sidebar.style.display = 'none';
            sidebar.classList.remove('mobile-tab-active');
            
            // Active Button State
            tabBtnResults.classList.add('active');
            tabBtnTools.classList.remove('active');
        }
        
        // Play click sound
        if(typeof playSound === 'function') playSound('click');
    }
    
    // Listen for resize to reset styles if user switches to desktop
    window.addEventListener('resize', function() {
         const sidebar = document.getElementById('sidebarSection');
         const mainContent = document.getElementById('mainContentSection');
         
         if (window.innerWidth > 900) {
             // Reset classes on desktop to ensure both columns show
             sidebar.classList.remove('mobile-tab-active');
             mainContent.classList.remove('mobile-tab-active');
             
             // Force display flex for desktop layout
             sidebar.style.display = 'flex';
             mainContent.style.display = 'flex';
         } else {
             // Re-apply current tab logic if switching back to mobile
             // Default to Tools tab if none active
             const tabBtnTools = document.getElementById('tabBtnTools');
             if (tabBtnTools.classList.contains('active')) {
                 window.switchMobileTab('tools');
             } else {
                 window.switchMobileTab('results');
             }
         }
    });

    // --- HỆ THỐNG ÂM THANH MỚI (MECHANICAL UI) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() { 
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    // Hàm phát âm thanh theo loại (success, error, click...)
    window.playSound = function(type) {
        initAudio(); 
        if (!audioCtx) return;
        
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'success') { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1600, t + 0.1);
            gain.gain.setValueAtTime(0.1, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            osc.start(t); osc.stop(t + 0.5);
        } else if (type === 'error') { 
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, t);
            osc.frequency.linearRampToValueAtTime(100, t + 0.2);
            gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.start(t); osc.stop(t + 0.3);
        } else if (type === 'click' || type === 'copy') { 
            osc.type = 'square'; osc.frequency.setValueAtTime(2000, t);
            gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.start(t); osc.stop(t + 0.05);
        } else if (type === 'delete') { 
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(500, t);
            osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
            gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0.001, t + 0.2);
            osc.start(t); osc.stop(t + 0.2);
        }
    }

    // --- HIỆU ỨNG HẠT (PARTICLES) KHI CLICK ---
    function createParticles(x, y) {
        const colors = ['#22d3ee', '#a855f7', '#10b981', '#ffffff'];
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div'); p.classList.add('particle');
            p.style.left = x + 'px'; p.style.top = y + 'px';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const destX = (Math.random() - 0.5) * 100; const destY = (Math.random() - 0.5) * 100;
            p.style.setProperty('--x', destX + 'px'); p.style.setProperty('--y', destY + 'px');
            document.body.appendChild(p); setTimeout(() => p.remove(), 800); 
        }
    }

    // --- HIỆU ỨNG RƠI (HOA MAI/ĐÀO/TIỀN) ---
    function createBlossoms() {
        const container = document.getElementById('falling-container');
        if(!container) return;
        const symbols = [
            { char: '✽', color: '#ffd700' }, // Hoa mai vàng
            { char: '🌸', color: '#ffb7c5' }, // Hoa anh đào
            { char: '💵', color: '#85bb65' }, // Tiền đô
            { char: '🧧', color: '#ff2400' }  // Lì xì
        ];

        for (let i = 0; i < 30; i++) {
            const b = document.createElement('div'); 
            b.classList.add('falling-item');
            const item = symbols[Math.floor(Math.random() * symbols.length)];
            b.innerText = item.char;
            b.style.color = item.color;
            b.style.left = Math.random() * 100 + 'vw';
            b.style.animationDuration = (Math.random() * 5 + 5) + 's'; 
            b.style.animationDelay = (Math.random() * 5) + 's';
            b.style.opacity = Math.random() * 0.5 + 0.5;
            b.style.fontSize = (Math.random() * 15 + 15) + 'px';
            container.appendChild(b);
        }
    }

    // --- BIẾN TOÀN CỤC QUẢN LÝ DỮ LIỆU ---
    window.dumpData = [];          // Dữ liệu thô từ file dump (Chỉ lưu kết quả parse nhẹ)
    window.foundOffsets = [];      // Danh sách kết quả tìm kiếm hiện tại
    window.rawQuickListText = "";  // Chuỗi text kết quả để copy full
    window.selectedProjectName = ""; // Tên dự án đang được chọn
    window.currentNotificationTimeout = null; // Timer để quản lý thông báo (chống spam)
    window.scanDebounceTimer = null; // Timer debounce cho việc gõ phím
    
    // --- WEB WORKER CODE (INLINE) ---
    // Web Worker dùng để xử lý file nặng ở luồng riêng, không làm lag giao diện
    const workerCode = `
        self.onmessage = async function(e) {
            const file = e.data;
            const chunkSize = 10 * 1024 * 1024; // Đọc mỗi lần 10MB (Chunking)
            let offset = 0;
            let currentClass = "";
            let currentClassFullSig = "";
            let pendingMetadata = null;
            let leftover = ""; // Chuỗi dư thừa ở cuối chunk
            const decoder = new TextDecoder();
            
            // Regex tối ưu cho Worker
            const classRegex = /\\s(class|struct)\\s+([a-zA-Z0-9_<>@\\u00A0-\\uFFFF]+)/;
            const rvaRegex = /\\/\\/ RVA: 0x([0-9A-Fa-f]+)\\s+Offset: 0x([0-9A-Fa-f]+)/;
            const methodRegex = /([a-zA-Z0-9_.<>@\\u00A0-\\uFFFF]+)\\s*\\(/;
            // Regex cho Field/Variable (Tìm dòng có // 0x... ở cuối)
            const fieldOffsetRegex = /;\\s*\\/\\/\\s*0x([0-9A-Fa-f]+)/;
            const fieldNameRegex = /([a-zA-Z0-9_]+)\\s*;/;

            const results = [];
            const fileSize = file.size;

            while (offset < fileSize) {
                const slice = file.slice(offset, offset + chunkSize);
                const buffer = await slice.arrayBuffer();
                let text = decoder.decode(buffer, {stream: true});
                
                // Nối phần dư từ chunk trước vào đầu chunk này
                text = leftover + text;
                
                // Tìm vị trí xuống dòng cuối cùng để cắt chunk an toàn
                const lastNewline = text.lastIndexOf('\\n');
                if (lastNewline !== -1 && offset + chunkSize < fileSize) {
                    leftover = text.substring(lastNewline + 1);
                    text = text.substring(0, lastNewline);
                } else {
                    leftover = "";
                }

                const lines = text.split('\\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    if (!line.startsWith('//') && (line.includes('class ') || line.includes('struct '))) {
                        const clsMatch = line.match(classRegex); 
                        if (clsMatch) { currentClass = clsMatch[2]; currentClassFullSig = line.split('//')[0].trim(); }
                    }
                    
                    // Logic tìm METHOD
                    if (line.startsWith('// RVA:')) { 
                        const match = line.match(rvaRegex); 
                        if (match) pendingMetadata = { offset: match[2] }; 
                    } else if (pendingMetadata && !line.startsWith('//')) {
                        const nameMatch = line.match(methodRegex);
                        if (nameMatch) { 
                            results.push({ 
                                cls: currentClass, 
                                classSig: currentClassFullSig, 
                                method: nameMatch[1], 
                                type: 'method',
                                offset: pendingMetadata.offset, 
                                sig: line 
                            }); 
                        }
                        pendingMetadata = null;
                    }

                    // Logic tìm FIELD / VARIABLE (MỚI)
                    // Kiểm tra nếu dòng này có comment Offset ở cuối (vd: // 0x10) nhưng KHÔNG phải là dòng RVA
                    if (currentClass && !line.startsWith('// RVA:')) {
                        const fieldMatch = line.match(fieldOffsetRegex);
                        if (fieldMatch) {
                             // Lấy tên biến (word cuối cùng trước dấu chấm phẩy)
                             // Tách phần code trước comment
                             const codePart = line.split('//')[0].trim();
                             const nameMatch = codePart.match(fieldNameRegex);
                             if (nameMatch) {
                                results.push({
                                    cls: currentClass,
                                    classSig: currentClassFullSig,
                                    method: nameMatch[1], // Dùng field 'method' lưu tên biến để đồng bộ logic tìm kiếm
                                    type: 'field', // Đánh dấu là Field
                                    offset: fieldMatch[1],
                                    sig: line
                                });
                             }
                        }
                    }
                }

                offset += chunkSize;
                // Gửi tiến trình về Main Thread
                const percent = Math.min(100, Math.floor((offset / fileSize) * 100));
                self.postMessage({ type: 'progress', percent: percent });
            }
            
            self.postMessage({ type: 'done', data: results });
        };
    `;

    let workerBlob = new Blob([workerCode], {type: "application/javascript"});
    let workerUrl = URL.createObjectURL(workerBlob);
    let worker = null;

    // --- BIẾN CHO HỘP THOẠI XÁC NHẬN ---
    window.pendingFileObject = null;
    window.pendingProjectName = "";

    // --- KHỞI TẠO ỨNG DỤNG ---
    function initApp() { 
        initLogin(); // Gọi hàm login
        refreshProjectList(); // Tải danh sách dự án
        setupDragDrop();      // Cài đặt kéo thả
        setupEditors();       // Cài đặt editor code
        setupCustomDropdown(); // Cài đặt dropdown
        createBlossoms();     // Tạo hiệu ứng rơi
        setupClearButtons();  // Cài đặt nút xoá input
        
        // Kích hoạt âm thanh khi click lần đầu
        document.body.addEventListener('click', (e) => { initAudio(); });
        
        // Sự kiện Enter cho input
        document.getElementById('newProjectName').addEventListener('keypress', (e) => { if (e.key === 'Enter') window.saveNewProject(); });
        document.getElementById('renameProjectInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') window.confirmRename(); });

        // Phím tắt toàn cục
        document.addEventListener('keydown', function(e) {
            const cmdKey = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? e.metaKey : e.ctrlKey; 
            if (cmdKey && e.key === 'Enter') { e.preventDefault(); window.runPrecisionScanner(); } // Ctrl + Enter để quét
            if (cmdKey && e.key === 's') { e.preventDefault(); window.saveProject(); } // Ctrl + S để lưu
            
            // --- SỬA ĐỔI: Bắt sự kiện Cmd + C (Ctrl + C) ---
            if (cmdKey && (e.key === 'c' || e.key === 'C')) {
                // Kiểm tra xem có đang bôi đen văn bản nào không
                // Nếu KHÔNG có text được chọn -> Thực hiện Copy Full Offset
                if (window.getSelection().toString() === "") {
                    e.preventDefault(); 
                    window.copyQuickList(); // Gọi hàm copy danh sách offset
                }
                // Nếu CÓ text được chọn -> Để trình duyệt copy bình thường
            }
            // ------------------------------------------------

            if (e.key === 'Escape') { e.preventDefault(); window.clearWorkspace(); } // Esc để xoá tất cả
        });

        // Tự động quét khi nhập liệu (Debounce 1s)
        const input1 = document.getElementById('input-1');
        if(input1) {
            input1.addEventListener('input', function() {
                if (scanDebounceTimer) clearTimeout(scanDebounceTimer);
                scanDebounceTimer = setTimeout(() => {
                    if(dumpData.length > 0 && this.value.trim() !== "") { window.runPrecisionScanner(false); }
                }, 1000); 
            });
        }
        
        // MOBILE TAB INITIALIZATION
        if (window.innerWidth <= 900) {
            window.switchMobileTab('tools'); // Mặc định vào tab Công Cụ
        }
    }

    // Chạy Init khi Script load xong
    initApp();

    // Cài đặt nút xoá trong input
    function setupClearButtons() {
        const newInput = document.getElementById('newProjectName');
        const clearBtn = document.getElementById('clearNewProjectBtn');
        if(!newInput || !clearBtn) return;
        newInput.addEventListener('input', function() { clearBtn.style.display = this.value ? 'block' : 'none'; });
        clearBtn.addEventListener('click', function(e) { e.stopPropagation(); newInput.value = ''; clearBtn.style.display = 'none'; newInput.focus(); });
    }

    // Cài đặt Dropdown tuỳ chỉnh
    function setupCustomDropdown() {
        const selected = document.getElementById("customSelectTrigger");
        const items = document.getElementById("customSelectItems");
        if(!selected || !items) return;

        selected.addEventListener("click", function(e) {
            e.stopPropagation(); playSound('click');
            items.classList.toggle("select-hide"); selected.classList.toggle("select-arrow-active");
            if(!items.classList.contains("select-hide")) setTimeout(() => {
                const searchInp = document.getElementById('projectSearchInput');
                if(searchInp) searchInp.focus();
            }, 100);
        });
        document.addEventListener("click", function(e) {
            if (!selected.contains(e.target) && !items.contains(e.target)) { items.classList.add("select-hide"); selected.classList.remove("select-arrow-active"); }
        });
    }

    // Cài đặt trình soạn thảo code (Syntax highlight)
    function setupEditors() {
        const textarea = document.getElementById('input-1'); const highlight = document.getElementById('highlight-1');
        if(!textarea || !highlight) return;
        const update = () => {
            let text = textarea.value; if(text[text.length-1] == "\n") text += " "; 
            highlight.innerHTML = applySyntaxHighlighting(text); syncScroll(textarea, highlight);
        };
        textarea.addEventListener('input', update); textarea.addEventListener('scroll', () => syncScroll(textarea, highlight)); update(); 
    }

    function syncScroll(element, target) { target.scrollTop = element.scrollTop; target.scrollLeft = element.scrollLeft; }

    // Hàm tô màu cú pháp (Syntax Highlight)
    function applySyntaxHighlighting(text) {
        if (!text) return "";
        text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        text = text.replace(/(".*?")/g, '<span class="s">$1</span>'); // Chuỗi
        text = text.replace(/(\/\/.*)/g, '<span class="co">$1</span>'); // Comment
        text = text.replace(/\b(0x[0-9A-Fa-f]+|[0-9]+)\b/g, '<span class="n">$1</span>'); // Số
        
        const keywords = /\b(public|private|protected|static|void|bool|int|float|string|class|struct|namespace|using|import|include|return|const|new|this)\b/g;
        text = text.replace(keywords, '<span class="k">$1</span>'); 
        
        const controls = /\b(if|else|for|while|switch|case|break|continue)\b/g;
        text = text.replace(controls, '<span class="c">$1</span>'); 
        text = text.replace(/\b([A-Z][a-zA-Z0-9_]*)\b(?![^<]*>)/g, '<span class="t">$1</span>'); 
        text = text.replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="f">$1</span>'); 
        return text;
    }

    // Cài đặt kéo thả file
    function setupDragDrop() {
        const dropZone = document.getElementById('dropZone'); const fileInput = document.getElementById('fileInput');
        if(!dropZone || !fileInput) return;
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('dragover'); });
        dropZone.addEventListener('drop', (e) => { 
            e.preventDefault(); dropZone.classList.remove('dragover'); 
            if (e.dataTransfer.files.length) { fileInput.files = e.dataTransfer.files; handleFileSelect(fileInput.files[0]); } 
        });
        fileInput.addEventListener('change', function(e) { if (e.target.files.length) handleFileSelect(e.target.files[0]); });
    }

    // Phân tích tên file để lấy tên game và version
    function parseNameVersion(filename) {
        let clean = filename.replace(/(\.dump)?\.cs$/i, "").replace(/\.txt$/i, "");
        const coreName = clean.replace(/[-_ ]?v?\d+(\.\d+).*$/i, '').trim();
        if (!coreName) return { name: clean, full: clean };
        return { name: coreName, full: clean };
    }

    // Xử lý khi chọn file
    function handleFileSelect(file) {
        if (!file) return;

        const fileInfo = parseNameVersion(file.name);
        const newCoreName = fileInfo.name; 
        const newFullName = fileInfo.full; 
        
        // Kiểm tra tên file generic (chung chung)
        const genericNames = ["dump", "il2cpp", "global-metadata", "metadata", "output", "script", "unknown", "assembly-csharp"];
        const isGeneric = genericNames.includes(newCoreName.toLowerCase());

        if (isGeneric) {
            showNotify(`Đang đọc file thô: ${file.name}`, "success");
            playSound('click');
            readFileProcess(file);
            return;
        }

        const newKey = "offsetPro_" + newFullName;
        let foundOldKey = null;

        // Tìm kiếm dự án cũ trùng tên
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("offsetPro_")) {
                const existingRawName = key.replace("offsetPro_", "");
                const existingInfo = parseNameVersion(existingRawName);
                if (existingInfo.name.toLowerCase() === newCoreName.toLowerCase()) {
                    foundOldKey = key;
                    break;
                }
            }
        }

        if (foundOldKey) {
            if (foundOldKey === newKey) {
                // Trùng khớp hoàn toàn -> Tải dự án
                selectedProjectName = newFullName;
                document.getElementById("customSelectTrigger").textContent = newFullName;
                loadProject();
                showNotify(`Đã tải dự án có sẵn: ${newFullName}`, "success");
            } else {
                // --- FIX QUAN TRỌNG: KHÔNG XOÁ BẢN CŨ NỮA ---
                // Chỉ copy cấu hình cũ sang bản mới, giữ nguyên bản cũ
                const oldData = localStorage.getItem(foundOldKey);
                localStorage.setItem(newKey, oldData); 
                // localStorage.removeItem(foundOldKey); // <--- DÒNG NÀY ĐÃ BỊ XOÁ ĐỂ NGĂN TỰ ĐỘNG XOÁ DỰ ÁN CŨ
                
                selectedProjectName = newFullName;
                document.getElementById("customSelectTrigger").textContent = newFullName;
                refreshProjectList(); 
                updateActiveProjectTitle(newFullName);
                
                try {
                    const data = JSON.parse(oldData);
                    const inputEl = document.getElementById('input-1');
                    inputEl.value = data.searchList || "";
                    inputEl.dispatchEvent(new Event('input')); 
                } catch(e) {}

                showNotify(`Đã tạo bản mới từ: ${newCoreName}`, "success");
                playSound('success');
            }
            readFileProcess(file);
        } else {
            // File mới hoàn toàn -> Hỏi tạo dự án
            pendingFileObject = file;
            pendingProjectName = newFullName;
            
            const statusBox = document.getElementById('statusBox');
            statusBox.innerHTML = `
                <span style="color:var(--accent)"><i class="fa-solid fa-circle-question"></i> Game mới: <b>${newFullName}</b></span>
                <span style="margin-left:10px; font-weight:normal">Tạo dự án?</span>
                <button class="inline-prompt-btn btn-yes" onclick="window.inlineConfirmCreate()" title="Tạo dự án"><i class="fa-solid fa-check"></i></button>
                <button class="inline-prompt-btn btn-no" onclick="window.inlineRejectCreate()" title="Chỉ đọc file"><i class="fa-solid fa-xmark"></i></button>
            `;
            
            playSound('click');
            readFileProcess(file, false); 
        }
    }

    window.inlineConfirmCreate = function() {
        if(!pendingProjectName) return;
        
        const newKey = "offsetPro_" + pendingProjectName;
        const blankData = { searchList: "", createdAt: Date.now(), results: [], quickList: "" };
        localStorage.setItem(newKey, JSON.stringify(blankData));
        
        selectedProjectName = pendingProjectName;
        refreshProjectList(); 
        document.getElementById("customSelectTrigger").textContent = pendingProjectName;
        updateActiveProjectTitle(pendingProjectName);
        document.getElementById('input-1').value = ""; 
        
        showNotify(`Đã tạo dự án mới: ${pendingProjectName}`, "success");
        playSound('success');
        
        setStatus(`Đã tạo dự án & Sẵn sàng!`, 'ready');
        pendingFileObject = null; pendingProjectName = "";
    }

    window.inlineRejectCreate = function() {
        showNotify(`Đã huỷ tạo. Chỉ đọc file!`, "success");
        playSound('click');
        setStatus(`Sẵn sàng quét (Chế độ chỉ đọc)`, 'ready');
        pendingFileObject = null; pendingProjectName = "";
    }

    // --- QUY TRÌNH ĐỌC FILE VỚI WEB WORKER ---
    function readFileProcess(file, updateStatus = true) {
        document.querySelector('#resultTable tbody').innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-dim); padding: 60px 20px;"><div style="display:flex; flex-direction:column; align-items:center; gap:15px; opacity:0.6;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--accent);"></i><span style="font-family: \'Be Vietnam Pro\'; font-size: 0.9rem;">Đang đọc file & giải mã...</span></div></td></tr>';
        document.getElementById('resultCount').innerText = '...';
        foundOffsets = []; 

        document.getElementById('dropZone').classList.add('has-file');
        document.getElementById('dropZoneContent').innerHTML = `<i class="fa-solid fa-file-circle-check drop-zone-icon" style="color:var(--secondary)"></i><div class="drop-zone-text"><h3 style="color:var(--secondary)">${file.name}</h3><p>Đã nạp vào bộ nhớ</p></div>`;
        
        showLoading(true); 
        if(updateStatus) setStatus(`Đang đọc: ${file.name}...`, 'loading');
        
        // Khởi tạo Worker nếu chưa có
        if (worker) worker.terminate();
        worker = new Worker(workerUrl);
        
        worker.onmessage = function(e) {
            const { type, percent, data } = e.data;
            if (type === 'progress') {
                document.getElementById('loadingPercent').innerText = `ĐANG GIẢI MÃ... ${percent}%`; 
                document.getElementById('loadingBar').style.width = `${percent}%`;
                const randomTexts = ["Stream dữ liệu...", "Đọc offset đa luồng...", "Quét Hex...", "Tối ưu RAM...", "Phân tích Class..."];
                if(percent % 5 === 0) document.getElementById('loadingSubtext').innerText = randomTexts[Math.floor(Math.random() * randomTexts.length)];
            } else if (type === 'done') {
                dumpData = data; // Nhận dữ liệu đã parse
                showLoading(false);
                if(updateStatus) {
                    setStatus(`Sẵn sàng! (${dumpData.length} hàm)`, 'ready'); 
                    showNotify("Đã đọc xong file & Tự động tìm kiếm", "success"); 
                    playSound('success');
                } else {
                    showNotify("Đã đọc xong file nền!", "success");
                }
                if(document.getElementById('input-1').value.trim() !== "") { window.runPrecisionScanner(false); }
                worker.terminate(); worker = null; // Giải phóng Worker
            }
        };

        // Gửi file sang Worker để xử lý
        worker.postMessage(file);
    }

    // --- SAO LƯU DỮ LIỆU (BACKUP) - ĐÃ CẬP NHẬT TÊN FILE ---
    window.backupAllData = function() {
        const backupData = {}; let count = 0;
        for (let i = 0; i < localStorage.length; i++) { 
            const key = localStorage.key(i); if (key.startsWith("offsetPro_")) { backupData[key] = localStorage.getItem(key); count++; } 
        }
        if (count === 0) return showNotify("Không có dữ liệu dự án để backup!", "error");
        // Giữ nguyên JSON
        const blob = new Blob([JSON.stringify(backupData, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        
        // --- Cập nhật tên file theo định dạng mới ---
        const now = new Date();
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        
        let h = now.getHours();
        const min = String(now.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12; h = h ? h : 12; // Định dạng 12 giờ
        
        // Tên file: DevLong Sao Lưu Offset dd-mm-yyyy HHh MM AM/PM.json
        const fileName = `DevLong Sao Lưu Offset ${d}-${m}-${y} ${h}h ${min} ${ampm}.json`;
        
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url); showNotify(`Đã backup ${count} dự án thành công!`, "success"); playSound('success');
    }

    // --- KHÔI PHỤC DỮ LIỆU (RESTORE) ---
    window.restoreAllData = function(input) {
        const file = input.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result); let count = 0;
                for (const key in data) { 
                    if (key.startsWith("offsetPro_")) { localStorage.setItem(key, data[key]); count++; } 
                }
                refreshProjectList(); 
                if (selectedProjectName) {
                    const checkKey = "offsetPro_" + selectedProjectName;
                    if (localStorage.getItem(checkKey)) {
                        loadProject(); 
                        showNotify(`Đã nạp lại version mới của: ${selectedProjectName}`, "success");
                    } else {
                        document.getElementById('input-1').value = "";
                        document.querySelector('#resultTable tbody').innerHTML = "";
                        selectedProjectName = "";
                        document.getElementById("customSelectTrigger").textContent = "-- Chọn Dự Án --";
                        showNotify(`Đã Restore ${count} dự án!`, "success");
                    }
                } else {
                    showNotify(`Đã khôi phục ${count} dự án thành công!`, "success");
                }
                playSound('success');
            } catch (err) { showNotify("File backup bị lỗi hoặc không hợp lệ!", "error"); playSound('error'); }
            input.value = '';
        };
        reader.readAsText(file);
    }
    
    // Hàm loại bỏ dấu tiếng Việt để tìm kiếm
    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
        return str;
    }

    // --- LÀM MỚI DANH SÁCH DỰ ÁN (PROJECT LIST) ---
    function refreshProjectList() {
        const items = document.getElementById("customSelectItems"); 
        if(!items) return;
        items.innerHTML = "";
        
        const projects = [];
        for (let i = 0; i < localStorage.length; i++) { 
            const key = localStorage.key(i); 
            if (key.startsWith("offsetPro_")) { 
                let timestamp = 0;
                let offsetCount = 0;
                try {
                    const val = JSON.parse(localStorage.getItem(key));
                    if(val.createdAt) timestamp = val.createdAt;
                    if(val.results && Array.isArray(val.results)) offsetCount = val.results.length;
                } catch(e) {}
                projects.push({ key: key, time: timestamp, count: offsetCount });
            } 
        }
        
        // Sắp xếp dự án mới nhất lên đầu
        projects.sort((a, b) => b.time - a.time); 
        
        const count = projects.length;
        document.querySelector('.label-save').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> 2. Dự Án (Đã Lưu) <span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-size:0.7em; color:var(--accent); margin-left: 5px;">[ ${count} ]</span>`;

        // TẠO SEARCH BOX (PRO SPOTLIGHT STYLE)
        const searchContainer = document.createElement("div"); searchContainer.className = "select-search-box";
        
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "search-wrapper-pro";

        const searchInput = document.createElement("input"); 
        searchInput.type = "text"; searchInput.id = "projectSearchInput"; 
        searchInput.placeholder = "Tìm Kiếm"; searchInput.autocomplete = "off";
        
        // Icon Kính lúp (Trái)
        const searchIcon = document.createElement("i");
        searchIcon.className = "fa-solid fa-magnifying-glass search-icon-left";

        // Icon Xoá (Phải)
        const clearBtn = document.createElement("i");
        clearBtn.className = "fa-solid fa-xmark search-clear-btn";
        
        inputWrapper.appendChild(searchIcon);
        inputWrapper.appendChild(searchInput); 
        inputWrapper.appendChild(clearBtn);
        
        searchContainer.appendChild(inputWrapper); 
        items.appendChild(searchContainer);

        // TẠO CONTAINER RIÊNG CHO DANH SÁCH (ĐỂ SCROLL)
        const scrollContainer = document.createElement("div");
        scrollContainer.className = "select-scroll-content";
        items.appendChild(scrollContainer);

        searchInput.addEventListener("click", function(e) { e.stopPropagation(); });
        
        // Xử lý tìm kiếm dự án
        searchInput.addEventListener("input", function() {
            const filterRaw = this.value;
            const filterNormalized = removeVietnameseTones(filterRaw).toLowerCase();
            clearBtn.style.display = filterRaw ? "flex" : "none"; 
            
            // Tìm trong scrollContainer thay vì items
            const headers = scrollContainer.getElementsByClassName("group-header");
            const rows = scrollContainer.getElementsByClassName("item-row");
            
            let hasVisible = false;
            for (let i = 0; i < rows.length; i++) {
                const txtName = rows[i].getAttribute("data-search-name") || "";
                const txtNormalized = removeVietnameseTones(txtName).toLowerCase();
                if (!filterRaw || txtNormalized.startsWith(filterNormalized)) { 
                    rows[i].style.display = ""; hasVisible = true;
                } else { 
                    rows[i].style.display = "none"; 
                }
            }
            // Ẩn tiêu đề nhóm ngày nếu đang tìm kiếm
            for(let h of headers) { h.style.display = filterRaw ? "none" : ""; }
        });

        clearBtn.addEventListener("click", function(e) {
            e.stopPropagation(); searchInput.value = ""; clearBtn.style.display = "none"; searchInput.focus(); 
            const rows = scrollContainer.getElementsByClassName("item-row"); for (let i = 0; i < rows.length; i++) rows[i].style.display = "";
            const headers = scrollContainer.getElementsByClassName("group-header"); for(let h of headers) h.style.display = "";
        });

        if (count > 0) {
            const today = new Date().setHours(0,0,0,0);
            const yesterday = new Date(today - 86400000).setHours(0,0,0,0);
            
            let currentGroup = "";
            
            projects.forEach((proj, index) => {
                const key = proj.key; 
                const projectName = key.replace("offsetPro_", ""); 
                let dateStr = "";
                let groupLabel = "Cũ Hơn";
                
                if(proj.time) {
                    const date = new Date(proj.time);
                    const checkDate = new Date(proj.time).setHours(0,0,0,0);
                    
                    if(checkDate === today) groupLabel = "Hôm Nay";
                    else if(checkDate === yesterday) groupLabel = "Hôm Qua";
                    
                    let hours = date.getHours(); const ampm = hours >= 12 ? 'PM' : 'AM'; hours = hours % 12; hours = hours ? hours : 12; 
                    const minutes = String(date.getMinutes()).padStart(2, '0'); dateStr = `${hours}:${minutes} ${ampm} - ${date.getDate()}/${date.getMonth()+1}`;
                }

                if(groupLabel !== currentGroup) {
                    currentGroup = groupLabel;
                    const header = document.createElement("div");
                    header.className = "group-header";
                    let icon = "fa-clock-rotate-left";
                    if(groupLabel === "Hôm Nay") icon = "fa-calendar-day";
                    if(groupLabel === "Hôm Qua") icon = "fa-calendar-check";
                    header.innerHTML = `<i class="fa-solid ${icon}"></i> ${groupLabel}`;
                    // Append vào scrollContainer
                    scrollContainer.appendChild(header);
                }
                
                let nameDisplay = projectName; let versionDisplay = "";
                const verMatch = projectName.match(/[-_]?v?(\d+(\.\d+)+.*)$/i);
                
                if(verMatch) {
                    versionDisplay = "v" + verMatch[1]; 
                    nameDisplay = projectName.replace(verMatch[0], "").trim();
                    if(nameDisplay.endsWith('-') || nameDisplay.endsWith('_')) nameDisplay = nameDisplay.slice(0, -1);
                }
                
                const div = document.createElement("div"); div.className = "item-row"; 
                div.setAttribute("data-search-name", nameDisplay); 
                
                let htmlContent = `
                <div class="project-info-group">
                    <div class="project-name-styled">
                        <i class="fa-solid fa-gamepad"></i> ${nameDisplay}
                        ${versionDisplay ? `<span class="version-badge">${versionDisplay}</span>` : ''}
                    </div>
                    <div class="project-meta-row">
                        <span>${dateStr}</span>
                        <span style="color:rgba(255,255,255,0.2)">|</span>
                        <div class="meta-stat" style="color:var(--secondary)"><i class="fa-solid fa-crosshairs"></i> ${proj.count} Offset</div>
                    </div>
                </div>
                
                <div class="item-actions">
                    <div class="mini-action-btn mini-btn-edit" title="Đổi tên" onclick="window.quickRename(event, '${projectName}')"><i class="fa-solid fa-pen"></i></div>
                    <div class="mini-action-btn mini-btn-del" title="Xoá" onclick="window.quickDelete(event, '${projectName}')"><i class="fa-solid fa-trash"></i></div>
                </div>`;
                
                div.innerHTML = htmlContent;
                div.addEventListener("click", function() {
                    playSound('click'); selectedProjectName = projectName; 
                    document.getElementById("customSelectTrigger").textContent = projectName;
                    items.classList.add("select-hide"); document.getElementById("customSelectTrigger").classList.remove("select-arrow-active");
                    loadProject();
                });
                // Append vào scrollContainer
                scrollContainer.appendChild(div);
            });
        } else {
            const div = document.createElement("div"); div.textContent = "(Chưa có dự án)"; div.className = "item-row"; div.style.fontStyle = "italic"; div.style.opacity = "0.5"; 
            scrollContainer.appendChild(div); 
        }
    }
    
    // --- CÁC HÀM XỬ LÝ NHANH (QUICK ACTIONS) ---
    window.quickRename = function(e, name) {
        e.stopPropagation();
        selectedProjectName = name;
        document.getElementById("customSelectTrigger").textContent = name;
        window.toggleRenameMode(true);
        // Ẩn dropdown
        document.getElementById("customSelectItems").classList.add("select-hide");
        document.getElementById("customSelectTrigger").classList.remove("select-arrow-active");
    }
    
    window.quickDelete = function(e, name) {
        e.stopPropagation();
        selectedProjectName = name;
        window.toggleDeleteMode(true);
        // Ẩn dropdown
        document.getElementById("customSelectItems").classList.add("select-hide");
        document.getElementById("customSelectTrigger").classList.remove("select-arrow-active");
    }
    
    window.toggleCreateMode = function(show) {
        playSound('click');
        const trigger = document.querySelector('.custom-select'); const group = document.getElementById('creationGroup'); 
        const btnAdd = document.getElementById('btnAddProject'); const btnDel = document.getElementById('btnDelProject'); const btnRename = document.getElementById('btnRenameProject');
        if (show) {
            trigger.style.display = 'none'; group.style.display = 'flex'; btnAdd.style.display = 'none'; 
            if(btnDel) btnDel.style.display = 'none'; 
            if(btnRename) btnRename.style.display = 'none';
            document.getElementById('newProjectName').value = ''; 
            document.getElementById('clearNewProjectBtn').style.display = 'none'; 
            document.getElementById('newProjectName').focus();
        } else {
            trigger.style.display = 'block'; group.style.display = 'none'; btnAdd.style.display = 'flex'; 
            if(btnDel) btnDel.style.display = 'flex'; 
            if(btnRename) btnRename.style.display = 'flex';
        }
    }
    
    // --- LƯU DỰ ÁN MỚI ---
    window.saveNewProject = function() {
        const name = document.getElementById('newProjectName').value.trim();
        if (!name) return showNotify("Vui lòng nhập tên dự án!", "error");
        
        const safeName = "offsetPro_" + name;
        if (localStorage.getItem(safeName)) return showNotify("(Đã Có Dự Án)", "error");
        
        const currentInput = document.getElementById('input-1').value;
        // Reset bảng kết quả
        document.querySelector('#resultTable tbody').innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-dim); padding: 60px 20px;"><div style="display:flex; flex-direction:column; align-items:center; gap:15px; opacity:0.6;"><i class="fa-solid fa-magnifying-glass-chart" style="font-size: 3rem; color: var(--accent);"></i><span style="font-family: \'Be Vietnam Pro\'; font-size: 0.9rem;">Chưa có dữ liệu. Vui lòng nhập Code để tìm kiếm.</span></div></td></tr>';
        document.getElementById('resultCount').innerText = '0 Tìm thấy';
        document.getElementById('activeProjectTitle').style.display = 'none';
        foundOffsets = []; rawQuickListText = ""; 
        
        const data = { searchList: currentInput, createdAt: Date.now(), results: [], quickList: "" };
        localStorage.setItem(safeName, JSON.stringify(data));
        
        refreshProjectList(); selectedProjectName = name; document.getElementById("customSelectTrigger").textContent = name;
        showNotify(`Đã tạo dự án: ${name}`, "success"); toggleCreateMode(false); playSound('success');
        updateActiveProjectTitle(name);

        if (currentInput.trim() !== "") {
            document.getElementById('highlight-1').innerHTML = applySyntaxHighlighting(currentInput);
            window.runPrecisionScanner(false); 
        }
    }

    // --- LƯU DỰ ÁN HIỆN TẠI ---
    window.saveProject = function(silent = false) {
        if (!selectedProjectName) return showNotify("Vui lòng chọn dự án để lưu!", "error");
        const data = { searchList: document.getElementById('input-1').value, createdAt: Date.now(), results: foundOffsets, quickList: rawQuickListText };
        localStorage.setItem("offsetPro_" + selectedProjectName, JSON.stringify(data)); 
        refreshProjectList(); 
        if(!silent) { showNotify(`Đã lưu dữ liệu: ${selectedProjectName}`, "success"); playSound('success'); }
    }

    // --- TẢI DỰ ÁN ---
    window.loadProject = function() {
        if (!selectedProjectName) { document.getElementById('input-1').value = ""; return; }
        const content = localStorage.getItem("offsetPro_" + selectedProjectName); 
        document.querySelector('#resultTable tbody').innerHTML = ''; document.getElementById('resultCount').innerText = '0 Tìm thấy'; foundOffsets = []; rawQuickListText = "";
        
        updateActiveProjectTitle(selectedProjectName);

        if (content !== null) { 
            try {
                const data = JSON.parse(content); 
                document.getElementById('input-1').value = data.searchList || ""; 
                if (data.results && Array.isArray(data.results) && data.results.length > 0) {
                    foundOffsets = data.results;
                    document.getElementById('resultCount').innerText = `${foundOffsets.length} Tìm thấy`;
                    foundOffsets.forEach(res => renderRow(res));
                    generateQuickListText(); 
                    showNotify(`Đã nạp lại ${foundOffsets.length} offset`, "success"); playSound('success');
                }
            } catch (e) { document.getElementById('input-1').value = content; }
            document.getElementById('input-1').dispatchEvent(new Event('input'));
        }
    }

    window.updateActiveProjectTitle = function(name) {
        const titleDiv = document.getElementById('activeProjectTitle');
        if (name) { 
            let nameDisplay = name; let versionDisplay = "";
            const verMatch = name.match(/[-_]?v?(\d+(\.\d+)+.*)$/i);
            
            if(verMatch) {
                versionDisplay = "v" + verMatch[1]; 
                nameDisplay = name.replace(verMatch[0], "").trim();
                if(nameDisplay.endsWith('-') || nameDisplay.endsWith('_')) nameDisplay = nameDisplay.slice(0, -1);
            }

            titleDiv.innerHTML = `<span class="active-title-text">${nameDisplay}</span> ${versionDisplay ? `<span class="active-version-badge">${versionDisplay}</span>` : ''}`;
            titleDiv.style.display = 'block'; 
        } 
        else { titleDiv.style.display = 'none'; }
    }

    window.toggleDeleteMode = function(show) {
        playSound('click');
        const trigger = document.querySelector('.custom-select'); const group = document.getElementById('deleteGroup');
        const btnAdd = document.getElementById('btnAddProject'); const btnDel = document.getElementById('btnDelProject'); const btnRename = document.getElementById('btnRenameProject');
        if (show) {
            if (!selectedProjectName) return showNotify("Vui lòng chọn dự án để xoá!", "error");
            trigger.style.display = 'none'; group.style.display = 'flex'; btnAdd.style.display = 'none'; 
            if(btnDel) btnDel.style.display = 'none'; 
            if(btnRename) btnRename.style.display = 'none';
            document.getElementById('deleteConfirmText').innerText = `"${selectedProjectName}"?`;
        } else {
            trigger.style.display = 'block'; group.style.display = 'none'; btnAdd.style.display = 'flex'; 
            if(btnDel) btnDel.style.display = 'flex'; 
            if(btnRename) btnRename.style.display = 'flex';
        }
    }
    
    window.confirmDeleteInline = function() { if (selectedProjectName) { localStorage.removeItem("offsetPro_" + selectedProjectName); window.clearWorkspace(false); refreshProjectList(); showNotify("Đã Xoá Dự Án", "delete"); playSound('delete'); } window.toggleDeleteMode(false); }

    window.toggleRenameMode = function(show) { 
        playSound('click');
        const trigger = document.querySelector('.custom-select'); const group = document.getElementById('renameGroup'); const btnAdd = document.getElementById('btnAddProject'); const btnDel = document.getElementById('btnDelProject'); const btnRename = document.getElementById('btnRenameProject'); if (show) { if (!selectedProjectName) return showNotify("Vui lòng chọn dự án để đổi tên!", "error"); trigger.style.display = 'none'; group.style.display = 'flex'; btnAdd.style.display = 'none'; if(btnDel) btnDel.style.display = 'none'; if(btnRename) btnRename.style.display = 'none'; document.getElementById('renameProjectInput').value = selectedProjectName; document.getElementById('renameProjectInput').focus(); } else { trigger.style.display = 'block'; group.style.display = 'none'; btnAdd.style.display = 'flex'; if(btnDel) btnDel.style.display = 'flex'; if(btnRename) btnRename.style.display = 'flex'; } 
    }
    window.confirmRename = function() { const newName = document.getElementById('renameProjectInput').value.trim(); if(!newName) return showNotify("Tên dự án không được để trống!", "error"); if(newName === selectedProjectName) return window.toggleRenameMode(false); const oldKey = "offsetPro_" + selectedProjectName; const newKey = "offsetPro_" + newName; if(localStorage.getItem(newKey)) return showNotify("(Đã Có Dự Án)", "error"); const data = localStorage.getItem(oldKey); localStorage.setItem(newKey, data); localStorage.removeItem(oldKey); selectedProjectName = newName; document.getElementById("customSelectTrigger").textContent = newName; updateActiveProjectTitle(newName); refreshProjectList(); showNotify(`Đã đổi tên thành: ${newName}`, "success"); window.toggleRenameMode(false); playSound('success'); }
    
    // --- XOÁ TOÀN BỘ KHÔNG GIAN LÀM VIỆC ---
    window.clearWorkspace = function(notify = true) {
        document.getElementById('input-1').value = ''; 
        document.getElementById('highlight-1').innerHTML = ''; 
        document.querySelector('#resultTable tbody').innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-dim); padding: 60px 20px;"><div style="display:flex; flex-direction:column; align-items:center; gap:15px; opacity:0.6;"><i class="fa-solid fa-magnifying-glass-chart" style="font-size: 3rem; color: var(--accent);"></i><span style="font-family: \'Be Vietnam Pro\'; font-size: 0.9rem;">Chưa có dữ liệu. Vui lòng nhập Code để tìm kiếm.</span></div></td></tr>'; 
        document.getElementById('resultCount').innerText = '0 Tìm thấy';
        document.getElementById('activeProjectTitle').style.display = 'none';
        rawQuickListText = ""; foundOffsets = []; dumpData = []; 
        const fileIn = document.getElementById('fileInput'); fileIn.value = ''; 
        selectedProjectName = ""; document.getElementById("customSelectTrigger").textContent = "-- Chọn Dự Án --";
        document.getElementById('dropZone').classList.remove('has-file');
        document.getElementById('dropZoneContent').innerHTML = `<i class="fa-solid fa-cloud-arrow-up drop-zone-icon"></i><div class="drop-zone-text"><h3>Kéo file vào đây</h3><p>hoặc chạm để chọn</p></div>`;
        setStatus('Chưa chọn file...', 'waiting'); 
        if(notify) { showNotify("Đã Xoá Tất Cả", "delete"); playSound('delete'); }
    }

    // =================================================================
    // --- 9. CÔNG CỤ QUÉT OFFSET CHÍNH XÁC (CORE LOGIC) - ĐÃ UPDATE FIELD ---
    // =================================================================
    window.runPrecisionScanner = function(playAudio = true) {
        // Kiểm tra điều kiện đầu vào
        if (dumpData.length === 0) { if(playAudio) { showNotify("Vui lòng chọn File Dump trước!", "error"); playSound('error'); } return; }
        const rawInput = document.getElementById('input-1').value; if (!rawInput.trim()) { if(playAudio) { showNotify("Vui lòng nhập Code để tìm!", "error"); playSound('error'); } return; }
        
        const firstLine = rawInput.split('\n')[0].trim();
        const inputLines = rawInput.split('\n'); 
        foundOffsets = []; 
        const uniqueOffsets = new Set();
        document.querySelector('#resultTable tbody').innerHTML = ''; 
        let contextClass = null; 
        
        inputLines.forEach(line => {
            // Bỏ qua các dòng comment hoặc không phải code
            if (line.trim().startsWith("// NAME:")) return; 
            const isLineCode = /^(public|private|protected|class|struct|void|bool|int|float|string|namespace|using|\/\/)/i.test(line.trim());
            if (!isLineCode && (line.trim() === selectedProjectName || line.trim() === firstLine)) return; 

            let customComment = "";
            if (line.includes("//")) { const parts = line.split("//"); line = parts[0]; customComment = parts.slice(1).join("//").trim(); }
            line = line.trim(); if(!line) return;
            
            // Tìm Class Context
            const clsMatch = line.match(/\s(class|struct)\s+([a-zA-Z0-9_<>@\u00A0-\uFFFF]+)/) || line.match(/^public\s+class\s+([a-zA-Z0-9_<>@\u00A0-\uFFFF]+)/);
            if (clsMatch) { contextClass = clsMatch.pop(); return; }
            
            let targetMethod = null;
            let targetArgs = null;
            let targetClass = contextClass;

            const openParen = line.indexOf('(');
            const closeParen = line.lastIndexOf(')');

            if (openParen !== -1 && closeParen !== -1 && closeParen > openParen) {
                // Xử lý logic tìm hàm có tham số
                const beforeParen = line.substring(0, openParen).trim();
                const tokens = beforeParen.split(/[\s\t]+/); 
                if(tokens.length > 0) {
                    targetMethod = tokens[tokens.length - 1]; 
                    if (['if', 'for', 'while', 'switch', 'catch'].includes(targetMethod)) { targetMethod = null; }
                }
                targetArgs = line.substring(openParen + 1, closeParen);
            } else {
                 // Xử lý logic tìm class + hàm đơn giản HOẶC biến đơn giản
                 const parts = line.split(/\s+/); 
                 if (parts.length >= 2) { 
                     // Trường hợp "public int health;" hoặc "int health"
                     // Nếu từ cuối cùng kết thúc bằng ; thì bỏ ;
                     let lastPart = parts[parts.length - 1];
                     if(lastPart.endsWith(';')) lastPart = lastPart.slice(0, -1);
                     targetMethod = lastPart; 
                 } else if (parts.length === 1) {
                     // Chỉ nhập tên biến/hàm
                     targetMethod = parts[0];
                     if(targetMethod.endsWith(';')) targetMethod = targetMethod.slice(0, -1);
                 }
            }
            
            // Bắt đầu so khớp với dữ liệu Dump
            if (targetMethod) {
                let candidates = dumpData.filter(d => { 
                    const matchClass = targetClass ? (d.cls === targetClass) : true; 
                    return matchClass && d.method === targetMethod; 
                });
                
                let finalResults = candidates; 

                // Nếu là Method và có Arguments, lọc kỹ hơn
                if (candidates.length > 0 && targetArgs !== null) {
                    const normalize = (str) => { return str.replace(/\s+/g, '').replace(/=[^,)]+/g, '').toLowerCase(); };
                    const cleanInput = normalize(targetArgs);
                    const exactMatches = candidates.filter(c => { 
                        if (c.type !== 'method') return false; // Variable thì không có arguments
                        const dOpen = c.sig.indexOf('(');
                        const dClose = c.sig.lastIndexOf(')');
                        if (dOpen !== -1 && dClose !== -1) {
                            const dArgs = c.sig.substring(dOpen + 1, dClose);
                            return normalize(dArgs) === cleanInput;
                        }
                        return false; 
                    });
                    if (exactMatches.length > 0) { finalResults = exactMatches; }
                }
                
                if (finalResults.length > 0) {
                    finalResults.forEach(res => { 
                        if (!uniqueOffsets.has(res.offset)) { 
                            uniqueOffsets.add(res.offset); 
                            res.customComment = customComment; 
                            foundOffsets.push(res); 
                            renderRow(res); 
                        } 
                    });
                } else {
                     renderNotFound(targetClass || "???", targetMethod + (targetArgs ? `(...)` : "")); 
                }
            }
        });

        document.getElementById('resultCount').innerText = `${foundOffsets.length} Tìm thấy`;
        generateQuickListText(); 
        if (selectedProjectName && foundOffsets.length > 0) saveProject(true); 
        if(foundOffsets.length > 0) { 
            if(playAudio) { 
                showNotify(`Tìm thấy ${foundOffsets.length} offset!`, "success"); 
                playSound('success'); 
                
                // AUTO SWITCH TO RESULT TAB ON MOBILE IF SUCCESS
                if(window.innerWidth <= 900) {
                    setTimeout(() => window.switchMobileTab('results'), 500); // Delay chút để user thấy hiệu ứng click
                }
            } 
        } 
        else { if(playAudio) { showNotify("Không tìm thấy Offset nào!", "error"); playSound('error'); } }
    }

    function generateQuickListText() {
        if(foundOffsets.length === 0) { rawQuickListText = ""; return; }
        let quickListRaw = ""; let lastClass = ""; 
        
        foundOffsets.forEach((f, index) => { 
            const comment = f.customComment ? f.customComment : "(Không Ghi Chú)"; 
            const fullClass = f.classSig ? f.classSig.split('//')[0].trim() : f.cls; 
            
            // --- SỬA ĐỔI: Loại bỏ comment thừa ở cuối dòng code ---
            let cleanCode = f.sig.trim();
            // Tìm vị trí comment // cuối cùng để cắt bỏ an toàn
            // Tuy nhiên với file dump, comment offset luôn ở cuối.
            // Split theo "//" và lấy phần đầu tiên là an toàn nhất cho dump structure.
            if (cleanCode.includes("//")) {
                cleanCode = cleanCode.split("//")[0].trim();
            }
            const fullMethod = cleanCode; 
            // -----------------------------------------------------
            
            if (fullClass !== lastClass) { 
                if (lastClass !== "") { quickListRaw += "\n"; } 
                quickListRaw += `${fullClass}\n\n`; 
                lastClass = fullClass; 
            } 
            
            quickListRaw += `${comment}\n`; 
            quickListRaw += `//Offset : 0x${f.offset}\n`; 
            quickListRaw += `${fullMethod}\n`; 
            
            if(index < foundOffsets.length - 1) {
                 const nextItem = foundOffsets[index+1];
                 const nextClass = nextItem.classSig ? nextItem.classSig.split('//')[0].trim() : nextItem.cls;
                 if(nextClass === fullClass) {
                     quickListRaw += "\n";
                 }
            }
        });
        rawQuickListText = quickListRaw.trim(); 
    }

    window.copyQuickList = function(e) { 
        if(!rawQuickListText) { showNotify("Chưa có kết quả để Copy!", "error"); playSound('error'); return; } 
        navigator.clipboard.writeText(rawQuickListText).then(() => { showNotify(`Đã copy toàn bộ danh sách!`, "copy"); playSound('copy'); }); 
    }
    
    // --- RENDER DÒNG KẾT QUẢ ---
    function renderRow(item) { 
        const tbody = document.querySelector('#resultTable tbody'); 
        let commentHtml = "";
        if (item.customComment) { commentHtml = `<span class="comment-badge"><i class="fa-solid fa-tag"></i> ${item.customComment}</span>`; }
        const sigHtml = applySyntaxHighlighting(item.sig); 
        
        // Tạo Badge phân loại Method vs Variable (ĐÃ ĐỔI TÊN THÀNH FIELD)
        let typeBadge = '';
        if (item.type === 'field') {
            typeBadge = `<span class="type-badge variable"><i class="fa-solid fa-box-open"></i> FIELD</span>`;
        } else {
            typeBadge = `<span class="type-badge method"><i class="fa-solid fa-code"></i> METHOD</span>`;
        }

        const row = `<tr>
            <td>
                <div class="info-cell">
                    <div class="class-badge"><i class="fa-solid fa-cube"></i> ${item.cls}</div>
                    <div class="method-name-highlight">
                        ${typeBadge}
                        ${item.method} 
                        ${commentHtml}
                    </div>
                    <div class="sig-txt">${sigHtml}</div>
                </div>
            </td>
            <td style="vertical-align: middle;">
                <div class="offset-cell-wrapper">
                    <div class="copy-tag" onclick="window.copyText(this, '0x${item.offset}')">
                        <i class="fa-regular fa-copy"></i> <span style="font-family:'JetBrains Mono'; margin-left:5px;">0x${item.offset}</span>
                    </div>
                </div>
            </td>
        </tr>`; 
        tbody.insertAdjacentHTML('beforeend', row); 
    }
    
    function renderNotFound(cls, method) { 
        document.querySelector('#resultTable tbody').insertAdjacentHTML('beforeend', 
            `<tr>
                <td>
                    <div class="info-cell">
                        <div class="class-badge" style="color:#ef4444; border-color:#ef4444; background:rgba(239, 68, 68, 0.1);">${cls}</div>
                        <div class="method-name-highlight" style="color:#ef4444; text-decoration: line-through;">${method}</div>
                    </div>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                    <span style="color:#ef4444; font-weight:bold; font-size:0.8rem; font-style:italic; display:inline-flex; align-items:center; gap:5px;">
                        <i class="fa-solid fa-triangle-exclamation"></i> KHÔNG TÌM THẤY
                    </span>
                </td>
            </tr>`
        ); 
    }
    
    function setStatus(msg, type) { const box = document.getElementById('statusBox'); let icon = ''; if (type === 'loading') icon = '<i class="fa-solid fa-spinner fa-spin" style="color:var(--accent)"></i> '; else if (type === 'ready') icon = '<i class="fa-solid fa-circle-check" style="color:var(--secondary)"></i> '; else if (type === 'waiting') icon = '<i class="fa-solid fa-circle-info" style="color:var(--warning)"></i> '; box.innerHTML = icon + msg; }
    
    function showLoading(show) { document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none'; }
    
    // =================================================================
    // --- 9. HỆ THỐNG THÔNG BÁO MINI (CHỐNG SPAM - GÓC DƯỚI PHẢI) ---
    // =================================================================
    window.showNotify = function(msg, type='success') { 
        const container = document.getElementById('notification-container'); 
        
        // Anti-Spam: Xoá thông báo cũ ngay lập tức nếu người dùng bấm liên tục
        container.innerHTML = ''; 
        if (currentNotificationTimeout) {
            clearTimeout(currentNotificationTimeout);
            currentNotificationTimeout = null;
        }

        const noti = document.createElement('div'); 
        noti.className = `notification ${type}`; 
        
        let icon = 'fa-circle-check'; 
        let title = 'Thành Công';
        
        if (type === 'error') { icon = 'fa-triangle-exclamation'; title = 'Lỗi'; }
        else if (type === 'delete') { icon = 'fa-trash-can'; title = 'Đã Xoá'; }
        else if (type === 'copy') { icon = 'fa-copy'; title = 'Đã Copy'; }

        noti.innerHTML = `
            <div class="notif-content">
                <div class="notif-icon-box"><i class="fa-solid ${icon}"></i></div>
                <div class="notif-text-col">
                    <div class="notif-title">${title}</div>
                    <div class="notif-desc">${msg}</div>
                </div>
                <div class="notif-close-btn" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-xmark"></i></div>
            </div>
        `;
        
        noti.addEventListener('click', function(e) {
            if(!e.target.closest('.notif-close-btn')) {
                noti.classList.add('hide-anim');
                setTimeout(() => noti.remove(), 400);
            }
        });

        container.appendChild(noti); 
        
        // Tự động xoá sau 3 giây
        currentNotificationTimeout = setTimeout(() => { 
            if(noti.parentElement) {
                noti.classList.add('hide-anim');
                setTimeout(() => { if(noti.parentElement) noti.remove(); }, 400); 
            }
        }, 3000); 
    }
    
    // Hàm copy text khi click vào nút offset
    window.copyText = function(btn, text) { 
        const rect = btn.getBoundingClientRect(); 
        
        navigator.clipboard.writeText(text).then(() => { 
            showNotify(`Đã copy offset: ${text}`, "copy"); 
            playSound('copy'); 
            
            const icon = btn.querySelector('i'); 
            const originalClass = "fa-regular fa-copy"; 
            
            // Hiệu ứng đổi icon tạm thời
            icon.className = "fa-solid fa-check";
            icon.style.color = "#10b981"; 
            
            setTimeout(() => {
                icon.className = originalClass; 
                icon.style.color = ""; 
            }, 1500);
        }); 
    }

})(); // END ASYNC IIFE
