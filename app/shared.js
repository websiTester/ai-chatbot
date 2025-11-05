
document.addEventListener('DOMContentLoaded', function() {

    // === CÁC HẰNG SỐ VÀ ELEMENT CHÍNH ===
    const chatHistory = document.getElementById('chat-history');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    // Elements cho Instruction
    const saveInstructionsBtn = document.getElementById('save-instructions-btn');
    const saveInstructionsStatus = document.getElementById('save-instructions-status');
    const instructionToggles = document.querySelectorAll('.instruction-toggle');

    // Elements cho Format
    const formatPairsContainer = document.getElementById('format-pairs-container');
    const addFormatPairBtn = document.getElementById('add-format-pair-btn');
    const saveFormatBtn = document.getElementById('save-format-btn');
    const saveFormatStatus = document.getElementById('save-format-status');
    const formatLimitError = document.getElementById('format-limit-error');
    const currentFormatNameInput = document.getElementById('current-format-name');
    const MAX_FORMAT_PAIRS = 10;

    // Elements cho Preset (Modal)
    const PRESET_STORAGE_KEY = 'aiChatbotPresets'; // Key cho localStorage
    const viewAllFormatsBtn = document.getElementById('view-all-formats-btn');
    const modalFormatList = document.getElementById('modal-format-list');
    const formatModal = new bootstrap.Modal(document.getElementById('formatsModal'));

    // === ELEMENT MỚI CHO SIDEBAR ===
    // const hideSidebarBtn = document.getElementById('hide-sidebar-btn'); // Cũ
    // const showSidebarBtn = document.getElementById('show-sidebar-btn'); // Cũ
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn'); // Nút mới
    const mainLayout = document.querySelector('.main-layout');

    
    // Dữ liệu mặc định
    const DEFAULT_INSTRUCTIONS = {
        1: "Bạn là một trợ lý AI hữu ích. Hãy trả lời các câu hỏi của người dùng.",
        2: "Bạn là một chuyên gia phân tích. Hãy đưa ra các phân tích chuyên sâu.",
        3: "Bạn là một nhà sáng tạo. Hãy đưa ra các ý tưởng mới lạ.",
        4: "Bạn là một người kiểm duyệt. Hãy đảm bảo câu trả lời an toàn và lịch sự."
    };
    
    const DEFAULT_FORMAT = [
        { header: "## Tóm tắt", content: "[CONTENT]" },
        { header: "---", content: "Đây là câu trả lời do AI tạo ra." }
    ];


    // === LOGIC MỚI CHO THU GỌN SIDEBAR ===
    toggleSidebarBtn.addEventListener('click', () => {
        mainLayout.classList.toggle('sidebar-collapsed');
        
        // Cập nhật icon và title cho nút
        const isCollapsed = mainLayout.classList.contains('sidebar-collapsed');
        // const icon = toggleSidebarBtn.querySelector('i'); // Đã xóa logic thay đổi icon
        
        if (isCollapsed) {
            // Chuyển sang icon "Mở"
            // icon.classList.remove('bi-chevron-bar-left'); // Đã xóa
            // icon.classList.add('bi-chevron-bar-right'); // Đã xóa
            toggleSidebarBtn.title = 'Mở sidebar';
        } else {
            // Chuyển sang icon "Đóng"
            // icon.classList.remove('bi-chevron-bar-right'); // Đã xóa
            // icon.classList.add('bi-chevron-bar-left'); // Đã xóa
            toggleSidebarBtn.title = 'Thu gọn sidebar';
        }
    });

    // === LOGIC XỬ LÝ INSTRUCTION ===

    /**
     * Ẩn/hiện textarea dựa trên lựa chọn radio
     */
    function toggleInstructionTextarea(agentId, mode) {
        const textarea = document.getElementById(`instruction-agent-${agentId}`);
        if (mode === 'default') {
            textarea.style.display = 'none';
        } else { // custom
            textarea.style.display = 'block';
        }
    }

    // Gán sự kiện cho tất cả radio button
    instructionToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const agentId = e.target.dataset.agent;
            const mode = e.target.value;
            toggleInstructionTextarea(agentId, mode);
        });
        
        // Khởi tạo trạng thái ban đầu (custom)
        if (toggle.value === 'custom' && toggle.checked) {
            toggleInstructionTextarea(toggle.dataset.agent, 'custom');
        } else if (toggle.value === 'default' && toggle.checked) {
            toggleInstructionTextarea(toggle.dataset.agent, 'default');
        }
    });

    /**
     * Xử lý lưu Instructions (mô phỏng)
     */
    function handleSaveInstructions(e) {
        e.preventDefault();
        saveInstructionsBtn.disabled = true;
        saveInstructionsBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Đang lưu...';

        const instructions = {};
        for (let i = 1; i <= 4; i++) {
            const mode = document.querySelector(`input[name="agent${i}-toggle"]:checked`).value;
            let instructionValue;
            if (mode === 'default') {
                instructionValue = 'DEFAULT';
            } else {
                instructionValue = document.getElementById(`instruction-agent-${i}`).value;
            }

            // Lấy các header được check
            const toggles = document.querySelectorAll(`#agent-${i}-format-toggles input[type="checkbox"]:checked`);
            const checkedHeaders = Array.from(toggles).map(cb => cb.value);

            instructions[`agent${i}`] = {
                instruction: instructionValue,
                headers: checkedHeaders
            };
        }
        
        console.log("Đang lưu instructions (mô phỏng):", instructions);

        // Mô phỏng gọi API
        setTimeout(() => {
            saveInstructionsBtn.disabled = false;
            saveInstructionsBtn.innerHTML = '<i class="bi bi-cloud-arrow-up-fill"></i> Lưu Instructions';
            saveInstructionsStatus.textContent = 'Đã lưu thành công!';
            saveInstructionsStatus.className = 'form-text text-success mt-2';
            setTimeout(() => saveInstructionsStatus.textContent = '', 3000);
        }, 1000);
    }


    // === LOGIC XỬ LÝ FORMAT ===

    /**
     * Thêm một cặp Header/Content mới vào UI
     * @param {string} headerVal - Giá trị cho ô header (mặc định là rỗng)
     * @param {string} contentVal - Giá trị cho ô content (mặc định là rỗng)
     */
    function addFormatPair(headerVal = '', contentVal = '') {
        const currentPairs = formatPairsContainer.children.length;
        if (currentPairs >= MAX_FORMAT_PAIRS) {
            formatLimitError.textContent = `Lỗi: Chỉ có thể thêm tối đa ${MAX_FORMAT_PAIRS} cặp.`;
            setTimeout(() => formatLimitError.textContent = '', 3000);
            return;
        }

        const pairDiv = document.createElement('div');
        pairDiv.className = 'format-pair';
        
        pairDiv.innerHTML = `
            <div class="inputs">
                <input type="text" class="form-control form-control-sm format-header" placeholder="Header (ví dụ: ## Tiêu đề)" value="${escapeHTML(headerVal)}">
                <textarea class="form-control form-control-sm format-content" rows="2" placeholder="Content (ví dụ: [CONTENT] hoặc nội dung cố định)">${escapeHTML(contentVal)}</textarea>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger remove-format-pair-btn">
                <i class="bi bi-trash-fill"></i>
            </button>
        `;

        formatPairsContainer.appendChild(pairDiv);
        
        // Gán sự kiện xóa cho nút vừa tạo
        pairDiv.querySelector('.remove-format-pair-btn').addEventListener('click', () => {
            removeFormatPair(pairDiv);
        });

        // Cập nhật checkbox cho agents
        updateAllAgentFormatToggles();
    }

    /**
     * Xóa một cặp Header/Content
     * @param {HTMLElement} pairDiv - Element div.format-pair cần xóa
     */
    function removeFormatPair(pairDiv) {
        formatPairsContainer.removeChild(pairDiv);
        // Xóa thông báo lỗi nếu có
        if (formatLimitError.textContent) {
            formatLimitError.textContent = '';
        }
        // Cập nhật checkbox cho agents
        updateAllAgentFormatToggles();
    }

    /**
     * Xử lý lưu Format (Lưu vào localStorage làm preset)
     */
    function handleSaveFormat(e) {
        e.preventDefault();

        const formatName = currentFormatNameInput.value.trim();
        if (!formatName) {
            saveFormatStatus.textContent = 'Lỗi: Vui lòng nhập Tên Format để lưu.';
            saveFormatStatus.className = 'form-text text-danger mt-2';
            setTimeout(() => saveFormatStatus.textContent = '', 3000);
            return;
        }

        saveFormatBtn.disabled = true;
        saveFormatBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Đang lưu...';
        
        const formatData = collectCurrentFormatPairs();
        
        // Lưu vào localStorage
        try {
            const presets = getPresets();
            presets[formatName] = formatData; // Thêm hoặc ghi đè
            localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));

            // Hiển thị thông báo thành công
            setTimeout(() => {
                saveFormatBtn.disabled = false;
                saveFormatBtn.innerHTML = '<i class="bi bi-cloud-arrow-up-fill"></i> Lưu Format';
                saveFormatStatus.textContent = `Đã lưu preset "${formatName}"!`;
                saveFormatStatus.className = 'form-text text-success mt-2';
                setTimeout(() => saveFormatStatus.textContent = '', 3000);
            }, 500);

        } catch (error) {
            console.error("Lỗi lưu localStorage:", error);
            saveFormatStatus.textContent = 'Lỗi: Không thể lưu vào bộ nhớ trình duyệt.';
            saveFormatStatus.className = 'form-text text-danger mt-2';
            saveFormatBtn.disabled = false;
            saveFormatBtn.innerHTML = '<i class="bi bi-cloud-arrow-up-fill"></i> Lưu Format';
        }
    }

    /**
     * Thu thập tất cả các cặp Header/Content từ UI
     * @returns {Array<object>} Mảng các đối tượng {header, content}
     */
    function collectCurrentFormatPairs() {
        const pairs = [];
        const pairElements = formatPairsContainer.querySelectorAll('.format-pair');
        pairElements.forEach(pair => {
            const header = pair.querySelector('.format-header').value;
            const content = pair.querySelector('.format-content').value;
            pairs.push({ header, content });
        });
        return pairs;
    }

    // === LOGIC XỬ LÝ AGENT FORMAT TOGGLES (Checkbox) ===

    /**
     * Cập nhật danh sách checkbox header cho tất cả agents
     */
    function updateAllAgentFormatToggles() {
        // 1. Lấy tất cả các header hiện tại
        const headers = Array.from(formatPairsContainer.querySelectorAll('.format-header'))
                                .map(input => input.value.trim())
                                .filter(header => header.length > 0); // Chỉ lấy header có nội dung

        // 2. Lặp qua 4 agent để cập nhật
        for (let i = 1; i <= 4; i++) {
            const container = document.getElementById(`agent-${i}-format-toggles`);
            if (!container) continue;

            // 3. Lưu trạng thái check hiện tại
            const checkedState = {};
            container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                checkedState[cb.value] = cb.checked;
            });

            // 4. Xóa và tạo lại
            container.innerHTML = ''; // Xóa checkbox cũ

            if (headers.length === 0) {
                container.innerHTML = '<span class="text-muted">Chưa có header nào trong Format.</span>';
                continue;
            }

            headers.forEach((header, index) => {
                const checkboxId = `agent-${i}-header-${index}`;
                const isChecked = checkedState[header] ? 'checked' : ''; // Khôi phục trạng thái
                
                const wrapper = document.createElement('div');
                wrapper.className = 'form-check form-check-inline';
                wrapper.innerHTML = `
                    <input class="form-check-input" type="checkbox" id="${checkboxId}" value="${escapeHTML(header)}" ${isChecked}>
                    <label class="form-check-label" for="${checkboxId}">${escapeHTML(header)}</label>
                `;
                container.appendChild(wrapper);
            });
        }
    }

    // Thêm sự kiện 'input' cho container để cập nhật checkbox khi gõ
    formatPairsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('format-header')) {
            // Dùng debounce để tránh cập nhật quá nhiều lần
            debounce(updateAllAgentFormatToggles, 300)();
        }
    });

    // Hàm debounce
    let debounceTimer;
    function debounce(func, delay) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }


    // === LOGIC XỬ LÝ PRESET (MODAL VÀ LOCALSTORAGE) ===

    /**
     * Lấy tất cả preset từ localStorage
     * @returns {object} Đối tượng preset
     */
    function getPresets() {
        try {
            const presets = localStorage.getItem(PRESET_STORAGE_KEY);
            return presets ? JSON.parse(presets) : {};
        } catch (error) {
            console.error("Lỗi đọc localStorage:", error);
            return {};
        }
    }

    /**
     * Tải format từ một mảng các cặp {header, content}
     * @param {Array<object>} formatPairs Mảng các cặp {header, content}
     */
    function loadFormat(formatPairs) {
        // Xóa tất cả các cặp hiện tại
        formatPairsContainer.innerHTML = '';
        formatLimitError.textContent = ''; // Xóa lỗi (nếu có)
        
        // Thêm các cặp từ preset
        if (formatPairs && formatPairs.length > 0) {
            formatPairs.forEach(pair => {
                addFormatPair(pair.header, pair.content);
            });
        }
        
        // Cập nhật checkbox (QUAN TRỌNG)
        updateAllAgentFormatToggles();
    }

    /**
     * Xử lý khi mở Modal "Xem tất cả"
     */
    function handleViewAllFormats() {
        modalFormatList.innerHTML = ''; // Xóa danh sách cũ
        const presets = getPresets();

        // 1. Thêm Format Mặc Định
        const defaultItem = document.createElement('li');
        defaultItem.className = 'list-group-item list-group-item-action list-group-item-info d-flex justify-content-between align-items-center';
        defaultItem.innerHTML = '<span><i class="bi bi-star-fill"></i> Format Mặc Định (Hệ thống)</span>';
        
        defaultItem.onclick = (e) => {
            // Chỉ tải nếu click vào text, không phải nút xóa
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                loadFormat(DEFAULT_FORMAT);
                currentFormatNameInput.value = 'Format Mặc Định (Hệ thống)'; // Cập nhật tên
                formatModal.hide();
            }
        };
        modalFormatList.appendChild(defaultItem);

        // 2. Thêm các preset đã lưu
        if (Object.keys(presets).length === 0) {
                const infoItem = document.createElement('li');
            infoItem.className = 'list-group-item text-muted';
            infoItem.textContent = 'Chưa có preset nào được lưu. Hãy đặt tên và nhấn "Lưu Format" để tạo preset mới.';
            modalFormatList.appendChild(infoItem);
        } else {
            for (const name in presets) {
                const presetItem = document.createElement('li');
                presetItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
                
                // Tên preset
                const nameSpan = document.createElement('span');
                nameSpan.textContent = name;
                
                // Nút xóa
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-sm btn-outline-danger delete-preset-btn';
                deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
                deleteBtn.title = `Xóa preset "${name}"`;
                
                // Sự kiện Xóa
                deleteBtn.onclick = (e) => {
                    e.stopPropagation(); // Ngăn không cho sự kiện click tải preset
                    if (confirm(`Bạn có chắc muốn xóa preset "${name}" không?`)) {
                        delete presets[name];
                        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
                        handleViewAllFormats(); // Tải lại danh sách modal
                    }
                };
                
                presetItem.appendChild(nameSpan);
                presetItem.appendChild(deleteBtn);

                // Sự kiện Tải
                presetItem.onclick = (e) => {
                    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                        loadFormat(presets[name]); // Tải data của preset đó
                        currentFormatNameInput.value = name; // Cập nhật tên
                        formatModal.hide();
                    }
                };
                
                modalFormatList.appendChild(presetItem);
            }
        }
    }


    // === LOGIC XỬ LÝ CHAT CHÍNH ===

    /**
     * Xử lý gửi tin nhắn
     */
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMessage = chatInput.value.trim();

        if (userMessage) {
            // Hiển thị tin nhắn người dùng
            displayMessage(userMessage, 'user');
            chatInput.value = '';
            
            // Tắt nút gửi khi chờ bot trả lời
            sendButton.disabled = true;
            chatInput.disabled = true;

            // Mô phỏng bot trả lời sau 1 giây
            setTimeout(() => {
                generateBotResponse(userMessage);
                sendButton.disabled = false;
                chatInput.disabled = false;
                chatInput.focus();
            }, 1000);
        }
    });

    /**
     * Hiển thị tin nhắn lên màn hình
     * @param {string} message - Nội dung tin nhắn
     * @param {string} sender - 'user' hoặc 'bot'
     */
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        if (sender === 'bot') {
            // Nếu là bot, dùng innerHTML để render Markdown đã được parse
            messageElement.innerHTML = message;
        } else {
            // Nếu là user, dùng textContent để tránh XSS
            messageElement.textContent = message;
        }

        chatHistory.appendChild(messageElement);
        // Tự động cuộn xuống tin nhắn mới nhất
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    /**
     * Mô phỏng AI tạo câu trả lời
     * @param {string} userMessage - Tin nhắn của người dùng
     */
    function generateBotResponse(userMessage) {
        // 1. Lấy Instruction (chỉ lấy agent 1 làm ví dụ)
        const agent1Mode = document.querySelector('input[name="agent1-toggle"]:checked').value;
        let instruction;
        if (agent1Mode === 'default') {
            instruction = DEFAULT_INSTRUCTIONS[1];
        } else {
            instruction = document.getElementById('instruction-agent-1').value.trim();
        }

        // Lấy các header được Agent 1 check
        const agent1Toggles = document.querySelectorAll('#agent-1-format-toggles input[type="checkbox"]:checked');
        const agent1CheckedHeaders = Array.from(agent1Toggles).map(cb => cb.value);

        // 2. Lấy Format
        const formatPairs = collectCurrentFormatPairs();

        // 3. Mô phỏng câu trả lời thô (raw answer)
        let rawAnswer = `Đây là câu trả lời mô phỏng cho câu hỏi: "${userMessage}".`;
        
        // 4. Kiểm tra instruction (ví dụ đơn giản)
        if (instruction.includes("ngắn gọn")) {
            rawAnswer = `Trả lời ngắn: "${userMessage}".`;
        } else if (instruction.includes("chuyên gia")) {
            rawAnswer = `Theo phân tích của chuyên gia, câu trả lời cho "${userMessage}" là... bla bla.`;
        }

        // Thêm thông tin về header (nếu có)
        if (agent1CheckedHeaders.length > 0) {
            rawAnswer += `\n\n(Agent 1 đã phân tích các header: ${agent1CheckedHeaders.join(', ')})`;
        }

        // 5. Xây dựng câu trả lời cuối cùng dựa trên Format
        let finalMarkdownResponse = "";
        
        if (formatPairs.length > 0) {
            formatPairs.forEach(pair => {
                // Nối header
                if (pair.header) {
                    finalMarkdownResponse += pair.header + "\n\n";
                }
                // Nối content, thay thế [CONTENT]
                if (pair.content) {
                    finalMarkdownResponse += pair.content.replace(/\[CONTENT\]/g, rawAnswer) + "\n\n";
                }
            });
        } else {
            // Nếu không có format nào, dùng format mặc định
            DEFAULT_FORMAT.forEach(pair => {
                finalMarkdownResponse += pair.header + "\n\n";
                finalMarkdownResponse += pair.content.replace(/\[CONTENT\]/g, rawAnswer) + "\n\n";
            });
        }

        // 6. Parse Markdown sang HTML
        // Sử dụng 'gfm: true' để kích hoạt GitHub Flavored Markdown (cho bảng, gạch ngang chữ, v.v.)
        // Sử dụng 'breaks: true' để tự động biến \n thành <br>
        const htmlResponse = marked.parse(finalMarkdownResponse, { gfm: true, breaks: true });

        // 7. Hiển thị câu trả lời của bot
        displayMessage(htmlResponse, 'bot');
    }

    /**
     * Hàm tiện ích để thoát HTML (tránh XSS khi chèn vào value của input)
     */
    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
    }


    // === KHỞI TẠO KHI TẢI TRANG ===
    
    // Khởi tạo trạng thái cho các instruction radio
    instructionToggles.forEach(toggle => {
        const agentId = toggle.dataset.agent;
        const mode = toggle.value;
        if (toggle.checked) {
            toggleInstructionTextarea(agentId, mode);
        }
    });
    
    // Tải format mặc định lên UI khi khởi động
    loadFormat(DEFAULT_FORMAT);
    currentFormatNameInput.value = "Format Mặc Định";

    // Khởi tạo checkbox cho agents (sau khi format mặc định đã tải)
    updateAllAgentFormatToggles();

    // Gán sự kiện cho các nút
    saveInstructionsBtn.addEventListener('click', handleSaveInstructions);
    addFormatPairBtn.addEventListener('click', () => addFormatPair()); // Nút thêm cặp
    saveFormatBtn.addEventListener('click', handleSaveFormat);
    
    // Gán sự kiện cho modal (để tải lại danh sách mỗi khi mở)
    viewAllFormatsBtn.addEventListener('click', handleViewAllFormats);

});
