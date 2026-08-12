const modal = document.querySelector('[data-subscribe-modal]');
const openButton = document.querySelector('[data-open-subscribe]');
const closeButton = document.querySelector('[data-close-subscribe]');
const form = document.querySelector('[data-subscribe-form]');

function openModal() {
    modal.hidden = false;
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

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = 'Nudging Turtle 구독 문의';
    const body = [
        'Nudging Turtle 구독을 문의합니다.',
        '',
        `이메일: ${email}`,
        '',
        '메모:',
        message || '(메모 없음)',
    ].join('\n');

    window.location.href = `mailto:k.sihwan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
