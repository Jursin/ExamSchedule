function updateDisplay() {
    try {
        var now = new Date(),
            timeDisplay = document.getElementById('timeDisplay'),
            statusLabel = document.getElementById('statusLabel'),
            timeDesc = document.getElementById('timeDescription');
        if (currentCourse) {
            var endTime = parseTime(currentCourse.end),
                remain = endTime - now;
            statusLabel.textContent = currentCourse.name + ' 进行中';
            timeDisplay.textContent = formatTime(remain);
            timeDesc.textContent = '剩余时间';
        } else {
            statusLabel.textContent = '休息中';
            var nextCourse = getNextCourse();
            if (nextCourse) {
                var startTime = parseTime(nextCourse.start),
                    remain = startTime - now;
                timeDisplay.textContent = formatTime(remain);
                timeDesc.textContent = '距离 ' + nextCourse.name;
            } else {
                timeDisplay.textContent = '00:00:00';
                timeDesc.textContent = '今日课程已结束';
            }
        }
        updateScheduleTable();
    } catch (e) {
        errorSystem.show('界面更新失败: ' + e.message, 'error');
    }
}

function formatTime(ms) {
    try {
        if (ms < 0) return '00:00:00';
        var totalSeconds = Math.floor(ms / 1000),
            hours = Math.floor(totalSeconds / 3600),
            minutes = Math.floor((totalSeconds % 3600) / 60),
            seconds = totalSeconds % 60;
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    } catch (e) {
        return '--:--:--';
    }
}

function formatDateTime(dateTimeStr) {
    var date = new Date(dateTimeStr);
    return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
