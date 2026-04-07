// Полностью рабочий JS для обработки формы с имитацией отправки и валидацией
// Данные сохраняются в localStorage (демонстрация), плюс приятный UI-фидбек

(function() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('feedbackStatus');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');

    // Функция показа уведомления (успех/ошибка)
    function showStatus(message, isError = false) {
        statusDiv.textContent = message;
        statusDiv.classList.add('show');
        statusDiv.style.backgroundColor = isError ? '#ffe6e5' : '#e0f2e9';
        statusDiv.style.color = isError ? '#b13e3e' : '#166534';
        // Автоматически скрыть через 5 секунд
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }

    // Простейшая валидация
    function validateForm() {
        const nameVal = nameInput.value.trim();
        const msgVal = messageInput.value.trim();
        if (!nameVal) {
            showStatus('Пожалуйста, укажите ваше имя', true);
            nameInput.focus();
            return false;
        }
        if (!msgVal) {
            showStatus('Напишите сообщение или вопрос — это поможет диалогу', true);
            messageInput.focus();
            return false;
        }
        if (msgVal.length < 5) {
            showStatus('Сообщение должно содержать хотя бы 5 символов', true);
            return false;
        }
        // опционально проверка email (если заполнен, то валидный формат)
        const emailVal = emailInput.value.trim();
        if (emailVal !== '') {
            const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            if (!emailPattern.test(emailVal)) {
                showStatus('Введите корректный email или оставьте поле пустым', true);
                emailInput.focus();
                return false;
            }
        }
        return true;
    }

    // Функция сохранения отзыва в localStorage и имитация отправки
    function saveFeedbackToStorage(data) {
        try {
            let feedbacks = [];
            const existing = localStorage.getItem('cyber_feedback_data');
            if (existing) {
                feedbacks = JSON.parse(existing);
            }
            // добавляем временную метку
            const newEntry = {
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                name: data.name,
                email: data.email || 'не указан',
                message: data.message
            };
            feedbacks.push(newEntry);
            // храним последние 20 записей, чтобы не переполнять localStorage
            if (feedbacks.length > 20) feedbacks.shift();
            localStorage.setItem('cyber_feedback_data', JSON.stringify(feedbacks));
            return true;
        } catch(e) {
            console.warn('localStorage error', e);
            return false;
        }
    }

    // обработчик отправки
    function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Сохраняем данные
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        // Небольшая имитация задержки отправки (реалистичность)
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Отправка...';

        // Искусственная задержка (чтобы показать процесс, без реального бэкенда)
        setTimeout(() => {
            const saved = saveFeedbackToStorage(formData);
            if (saved) {
                showStatus(`Спасибо, ${formData.name}! Ваше сообщение получено. Мы ценим вашу осознанность.`, false);
                // Очистить форму после успеха
                form.reset();
                // дополнительно - сбросим поле email (очистится формой)
            } else {
                showStatus('Произошла техническая ошибка. Пожалуйста, попробуйте позже.', true);
            }
            submitBtn.disabled = false;
            submitBtn.textContent = '📨 Отправить отзыв';
        }, 600);
    }

    form.addEventListener('submit', handleSubmit);

    // Дополнительная фишка: при клике на навигацию плавный скролл (улучшение UX)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // убираем #
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Также небольшая метрика: если пользователь уже оставлял отзыв ранее (просто дружеское напоминание)
    const hasSentBefore = localStorage.getItem('cyber_feedback_data');
    if (hasSentBefore && JSON.parse(hasSentBefore).length > 0) {
        // не навязчиво, просто выведем в консоль, можно убрать, но пусть будет тихо
        console.log('Благодарим за ранее оставленный отзыв о кибераддикции');
    }
})();