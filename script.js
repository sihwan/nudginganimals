const modal = document.querySelector('[data-subscribe-modal]');
const openButton = document.querySelector('[data-open-subscribe]');
const closeButton = document.querySelector('[data-close-subscribe]');
const form = document.querySelector('[data-subscribe-form]');
const submitButton = form?.querySelector('button[type="submit"]');
const statusMessage = document.querySelector('[data-subscribe-status]');

function setStatus(message, type = 'neutral') {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.dataset.status = type;
}

function openModal() {
    modal.hidden = false;
    setStatus('');
    const emailInput = form.querySelector('input[name="email"]');
    emailInput.focus();
}

function closeModal() {
    modal.hidden = true;
    openButton.focus();
}

openButton?.addEventListener('click', openModal);
closeButton?.addEventListener('click', closeModal);

modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
        closeModal();
    }
});

form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    submitButton.disabled = true;
    setStatus('전송 중입니다...', 'neutral');

    try {
        const response = await fetch('https://turtle.nudginganimals.com/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message }),
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {
            throw new Error(result.message || '전송에 실패했습니다.');
        }

        form.reset();
        setStatus('문의가 전송되었습니다. 고맙습니다!', 'success');
    } catch (error) {
        setStatus(error.message || '전송에 실패했습니다. 잠시 뒤 다시 시도해주세요.', 'error');
    } finally {
        submitButton.disabled = false;
    }
});
