document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.getElementById("settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettingsBtn = document.getElementById("close-settings-btn");
    const saveSettingsBtn = document.getElementById("save-settings-btn");
    const offsetTimeInput = document.getElementById("offset-time");
    const roomInput = document.getElementById("room-input");
    const roomElem = document.getElementById("room");
    const zoomInput = document.getElementById("zoom-input");
    const themeToggle = document.getElementById("theme-toggle");
    const themeLink = document.getElementById("theme-link");
    const configFileInput = document.getElementById("config-file");
    const clearConfigBtn = document.getElementById("clear-config-btn");

    let offsetTime = getCookie("offsetTime") || 0;
    let room = getCookie("room") || "";
    let zoomLevel = getCookie("zoomLevel") || 1;
    let theme = getCookie("theme") || "dark";

    offsetTime = parseInt(offsetTime);
    roomElem.textContent = room;

    if (theme === "light") {
        themeLink.href = "styles/light.css";
        themeToggle.checked = true;
    } else {
        themeLink.href = "styles/dark.css";
        themeToggle.checked = false;
    }

    settingsBtn.addEventListener("click", () => {
        try {
            offsetTimeInput.value = offsetTime;
            roomInput.value = room;
            zoomInput.value = zoomLevel;
            settingsModal.style.display = "block";
        } catch (e) {
            errorSystem.show('打开设置失败: ' + e.message);
        }
    });

    closeSettingsBtn.addEventListener("click", () => {
        try {
            settingsModal.classList.add("fade-out");
            setTimeout(() => {
                settingsModal.style.display = "none";
                settingsModal.classList.remove("fade-out");
            }, 300);
        } catch (e) {
            errorSystem.show('关闭设置失败: ' + e.message);
        }
    });

    saveSettingsBtn.addEventListener("click", () => {
        try {
            offsetTime = parseInt(offsetTimeInput.value);
            room = roomInput.value;
            zoomLevel = parseFloat(zoomInput.value);
            theme = themeToggle.checked ? "light" : "dark";
            setCookie("offsetTime", offsetTime, 365);
            setCookie("room", room, 365);
            setCookie("zoomLevel", zoomLevel, 365);
            setCookie("theme", theme, 365);
            roomElem.textContent = room;
            document.body.style.zoom = zoomLevel;
            themeLink.href = theme === "light" ? "styles/light.css" : "styles/dark.css";
            settingsModal.classList.add("fade-out");
            setTimeout(() => {
                settingsModal.style.display = "none";
                settingsModal.classList.remove("fade-out");
            }, 300);
            // 立即生效时间偏移
            location.reload();
        } catch (e) {
            errorSystem.show('保存设置失败: ' + e.message);
        }
    });

    themeToggle.addEventListener("change", () => {
        const theme = themeToggle.checked ? "light" : "dark";
        themeLink.href = theme === "light" ? "styles/light.css" : "styles/dark.css";
    });

    configFileInput.addEventListener("change", (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    
                    // 验证配置文件格式
                    if (!config.examInfos || !Array.isArray(config.examInfos)) {
                        throw new Error("无效的配置文件格式");
                    }
                    
                    // 验证每个考试信息
                    config.examInfos.forEach(exam => {
                        if (!exam.name || !exam.start || !exam.end) {
                            throw new Error("考试信息不完整");
                        }
                        // 验证日期格式
                        if (isNaN(new Date(exam.start).getTime()) || isNaN(new Date(exam.end).getTime())) {
                            throw new Error("无效的日期格式");
                        }
                    });
                    
                    // 保存配置到本地存储
                    localStorage.setItem('localExamConfig', JSON.stringify(config));
                    errorSystem.show('配置文件已加载，将在下次启动时生效');
                    
                } catch (error) {
                    errorSystem.show('配置文件格式错误: ' + error.message);
                }
            };
            reader.readAsText(file);
        } catch (e) {
            errorSystem.show('读取文件失败: ' + e.message);
        }
    });

    clearConfigBtn.addEventListener("click", () => {
        try {
            if (confirm("确定要清除本地配置吗？这将恢复使用默认配置文件。")) {
                localStorage.removeItem('localExamConfig');
                configFileInput.value = ''; // 清空文件选择
                errorSystem.show('本地配置已清除，将在下次启动时生效');
            }
        } catch (e) {
            errorSystem.show('清除配置失败: ' + e.message);
        }
    });

    try {
        document.body.style.zoom = zoomLevel;
    } catch (e) {
        errorSystem.show('初始化缩放失败: ' + e.message);
    }
});
