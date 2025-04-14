document.addEventListener("DOMContentLoaded", () => {
    const examNameElem = document.getElementById("examName");
    const messageElem = document.getElementById("message");
    const currentTimeElem = document.getElementById("current-time");
    const currentSubjectElem = document.getElementById("current-subject");
    const examTimingElem = document.getElementById("exam-timing");
    const remainingTimeElem = document.getElementById("remaining-time");
    const statusElem = document.getElementById("status");
    const examTableBodyElem = document.getElementById("exam-table-body");
    const roomElem = document.getElementById("room");
    
    // 获取Cookie函数
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return 0;
    }
    
    let offsetTime = getCookie("offsetTime") || 0;

    // 错误处理系统
    const errorSystem = {
        show: (message) => {
            console.error(message);
            const errorElem = document.createElement('div');
            errorElem.style.color = 'red';
            errorElem.style.padding = '10px';
            errorElem.textContent = message;
            document.body.prepend(errorElem);
        }
    };

    // 格式化时间（去除秒数）
    function formatTimeWithoutSeconds(timeStr) {
        return timeStr.slice(0, 5); // 截取"HH:MM"
    }

    // 格式化倒计时显示（HH:MM:SS 或 MM:SS）
    function formatRemainingTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    function fetchData() {
        // 优先使用本地配置
        const localConfig = localStorage.getItem('localExamConfig');
        if (localConfig) {
            try {
                const data = JSON.parse(localConfig);
                displayExamInfo(data);
                updateCurrentTime();
                updateExamInfo(data);
                setInterval(() => updateCurrentTime(), 1000);
                setInterval(() => updateExamInfo(data), 1000);
                return Promise.resolve();
            } catch (error) {
                localStorage.removeItem('localExamConfig');
                errorSystem.show('本地配置无效，已切换至默认配置');
            }
        }
        
        // 使用默认配置
        return fetch('exam_config.json', { cache: "no-store" })
            .then(response => response.json())
            .then(data => {
                displayExamInfo(data);
                updateCurrentTime();
                updateExamInfo(data);
                setInterval(() => updateCurrentTime(), 1000);
                setInterval(() => updateExamInfo(data), 1000);
            })
            .catch(error => errorSystem.show('获取考试数据失败: ' + error.message));
    }

    function displayExamInfo(data) {
        try {
            const examNameText = data.examName;
            const roomText = roomElem.textContent;
            examNameElem.innerHTML = `${examNameText} <span id="room">${roomText}</span>`;
            messageElem.textContent = data.message;
        } catch (e) {
            errorSystem.show('显示考试信息失败: ' + e.message);
        }
    }

    function updateCurrentTime() {
        try {
            const now = new Date(new Date().getTime() + offsetTime * 1000);
            currentTimeElem.textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
        } catch (e) {
            errorSystem.show('更新时间失败: ' + e.message);
        }
    }

    function updateExamInfo(data) {
        try {
            const now = new Date(new Date().getTime() + offsetTime * 1000);
            let currentExam = null;
            let nextExam = null;
            let lastExam = null;

            data.examInfos.forEach(exam => {
                const start = new Date(exam.start);
                const end = new Date(exam.end);
                if (now >= start && now <= end) {
                    currentExam = exam;
                }
                if (!currentExam && !nextExam && now < start) {
                    nextExam = exam;
                }
                if (now > end && (!lastExam || end > new Date(lastExam.end))) {
                    lastExam = exam;
                }
            });

            if (currentExam) {
                currentSubjectElem.textContent = `当前科目: ${currentExam.name}`;
                examTimingElem.textContent = `起止时间: ${formatTimeWithoutSeconds(new Date(currentExam.start).toLocaleTimeString('zh-CN', { hour12: false }))} ~ ${formatTimeWithoutSeconds(new Date(currentExam.end).toLocaleTimeString('zh-CN', { hour12: false }))}`;
                const remainingTime = (new Date(currentExam.end).getTime() - now.getTime() + 1000) / 1000;
                const remainingTimeText = formatRemainingTime(remainingTime);

                if (remainingTime <= 14 * 60) {
                    remainingTimeElem.textContent = `倒计时: ${remainingTimeText}`;
                    remainingTimeElem.style.color = "red";
                    remainingTimeElem.style.fontWeight = "bold";
                    statusElem.textContent = "状态: 即将结束";
                    statusElem.style.color = "red";
                } else {
                    remainingTimeElem.textContent = `剩余时间: ${remainingTimeText}`;
                    remainingTimeElem.style.color = "#93b4f7";
                    remainingTimeElem.style.fontWeight = "normal";
                    statusElem.textContent = "状态: 进行中";
                    statusElem.style.color = "#5ba838";
                }
            } else if (lastExam && now < new Date(lastExam.end).getTime() + 60000) {
                const timeSinceEnd = (now.getTime() - new Date(lastExam.end).getTime()) / 1000;
                currentSubjectElem.textContent = `上场科目: ${lastExam.name}`;
                examTimingElem.textContent = "";
                remainingTimeElem.textContent = ``;
                statusElem.textContent = "状态: 已结束";
                statusElem.style.color = "red";
            } else if (nextExam) {
                const timeUntilStart = ((new Date(nextExam.start).getTime() - now.getTime()) / 1000) + 1;
                const remainingTimeText = formatRemainingTime(timeUntilStart);

                if (timeUntilStart <= 15 * 60) {
                    currentSubjectElem.textContent = `即将开始: ${nextExam.name}`;
                    remainingTimeElem.textContent = `倒计时: ${remainingTimeText}`;
                    remainingTimeElem.style.color = "orange";
                    remainingTimeElem.style.fontWeight = "bold";
                    statusElem.textContent = "状态: 即将开始";
                    statusElem.style.color = "#DBA014";
                } else {
                    currentSubjectElem.textContent = `下一场科目: ${nextExam.name}`;
                    remainingTimeElem.textContent = "";
                    statusElem.textContent = "状态: 未开始";
                    remainingTimeElem.style.fontWeight = "normal";
                    statusElem.style.color = "#EAEE5B";
                }

                examTimingElem.textContent = `起止时间: ${formatTimeWithoutSeconds(new Date(nextExam.start).toLocaleTimeString('zh-CN', { hour12: false }))} ~ ${formatTimeWithoutSeconds(new Date(nextExam.end).toLocaleTimeString('zh-CN', { hour12: false }))}`;
            } else {
                currentSubjectElem.textContent = "考试已结束";
                currentSubjectElem.style.cssText = `
                    text-align: center;
                    font-size: 3em;
                    color: #888;
                    font-weight: bold;
                    width: 100%;
                    display: block;
                `;
                examTimingElem.textContent = "";
                remainingTimeElem.textContent = "";
                statusElem.textContent = "";
            }

            examTableBodyElem.innerHTML = "";
            
            // 预处理日期和时间段
            const dateGroups = {};
            data.examInfos.forEach(exam => {
                const start = new Date(exam.start);
                const hour = start.getHours();
                const dateStr = `${start.getMonth() + 1}月${start.getDate()}日<br>${hour < 12 ? '上午' : (hour < 18 ? '下午' : '晚上')}`;
                
                if (!dateGroups[dateStr]) {
                    dateGroups[dateStr] = [];
                }
                dateGroups[dateStr].push(exam);
            });

            // 生成表格
            Object.entries(dateGroups).forEach(([dateStr, exams]) => {
                let isFirstRow = true;
                // 计算实际需要的行数（考虑科目名称中的斜杠）
                const totalRows = exams.reduce((acc, exam) => {
                    return acc + (exam.name.includes('/') ? exam.name.split('/').length : 1);
                }, 0);

                exams.forEach(exam => {
                    const start = new Date(exam.start);
                    const end = new Date(exam.end);
                    const now = new Date(new Date().getTime() + offsetTime * 1000);

                    let status = "未开始";
                    if (now < start) {
                        status = now > new Date(start.getTime() - 15 * 60 * 1000) ? "即将开始" : "未开始";
                    } else if (now > end) {
                        status = "已结束";
                    } else {
                        status = "进行中";
                    }

                    // 处理包含斜杠的科目名称
                    const subjects = exam.name.split('/');
                    subjects.forEach((subject, index) => {
                        const row = document.createElement("tr");
                        let cells = '';

                        if (isFirstRow) {
                            cells = `<td rowspan="${totalRows}">${dateStr}</td>`;
                            isFirstRow = false;
                        }

                        // 仅在第一个科目行添加时间和状态
                        if (index === 0) {
                            cells += `
                                <td>${subject.trim()}</td>
                                <td rowspan="${subjects.length}">${formatTimeWithoutSeconds(start.toLocaleTimeString('zh-CN', { hour12: false }))}</td>
                                <td rowspan="${subjects.length}">${formatTimeWithoutSeconds(end.toLocaleTimeString('zh-CN', { hour12: false }))}</td>
                                <td rowspan="${subjects.length}"><span class="exam-status-tag exam-status-${status}">${status}</span></td>
                            `;
                        } else {
                            cells += `<td>${subject.trim()}</td>`;
                        }

                        row.innerHTML = cells;
                        examTableBodyElem.appendChild(row);
                    });
                });
            });
        } catch (e) {
            errorSystem.show('更新考试信息失败: ' + e.message);
        }
    }

    fetchData();
});
