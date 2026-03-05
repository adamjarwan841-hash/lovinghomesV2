// تطبيق الحجم عند تحميل أي صفحة
document.addEventListener("DOMContentLoaded", function() {
    const savedSize = localStorage.getItem('globalFontSize');
    if (savedSize) {
        applyFontSize(savedSize);
        const slider = document.getElementById('fontSizeSlider');
        const label = document.getElementById('fontSizeLabel');
        if (slider) slider.value = savedSize;
        if (label) label.innerText = "حجم الخط: " + savedSize + "px";
    }
    
    // تطبيق الوضع الليلي المحفوظ
    applySavedTheme();
    
    // تفعيل زر الحجز
    setupBookingButton();
    
    // تفعيل الأسئلة الشائعة (FAQ)
    setupFAQ();
    
    // إضافة تأثيرات للأزرار
    setupButtonEffects();
});

// ===== دوال الوضع الليلي =====
function toggleNightMode() {
    document.body.classList.toggle('night-mode');
    
    // حفظ الاختيار
    if (document.body.classList.contains('night-mode')) {
        localStorage.setItem('theme', 'night');
        showNotification('🌙 تم تفعيل الوضع الليلي', 'info');
    } else {
        localStorage.setItem('theme', 'day');
        showNotification('☀️ تم تفعيل الوضع النهاري', 'info');
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
        document.body.classList.add('night-mode');
    }
}

// ===== دوال الإشعارات =====
function showNotification(message, type = 'success') {
    // إزالة أي إشعار سابق
    const oldNotification = document.querySelector('.notification-toast');
    if (oldNotification) oldNotification.remove();
    
    // إنشاء الإشعار الجديد
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    
    let icon = '✅';
    if (type === 'info') icon = 'ℹ️';
    if (type === 'warning') icon = '⚠️';
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        </div>
        <div class="notification-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== رسالة الشكر البسيطة =====
function showThankYouMessage() {
    // رسالة تأكيد بسيطة
    alert("✅ شكراً لك! تم إرسال طلب الحجز بنجاح");
    
    // التوجيه إلى الصفحة الرئيسية بعد ثانية واحدة
    setTimeout(function() {
        window.location.href = 'home.html';
    }, 1000);
}
// ===== دوال الإعدادات =====
function openSettings() {
    document.getElementById('settingsModal').style.display = "flex";
    
    // إضافة زر الوضع الليلي للإعدادات إذا لم يكن موجوداً
    const modalContent = document.querySelector('.modal-content');
    if (!document.getElementById('nightModeBtn')) {
        const nightModeBtn = document.createElement('button');
        nightModeBtn.id = 'nightModeBtn';
        nightModeBtn.className = 'night-mode-btn';
        nightModeBtn.innerHTML = document.body.classList.contains('night-mode') ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        nightModeBtn.onclick = function() {
            toggleNightMode();
            this.innerHTML = document.body.classList.contains('night-mode') ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        };
        
        // إضافة قبل زر الإغلاق
        const closeBtn = modalContent.querySelector('.close-red-btn');
        modalContent.insertBefore(nightModeBtn, closeBtn);
    }
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = "none";
}

function changeFontSize(size) {
    applyFontSize(size);
    localStorage.setItem('globalFontSize', size);
    document.getElementById('fontSizeLabel').innerText = "حجم الخط: " + size + "px";
}

function applyFontSize(size) {
    document.documentElement.style.fontSize = size + "px";
    
    const elements = document.querySelectorAll('body, p, h1, h2, h3, a, li, label, button, input, textarea');
    elements.forEach(el => {
        el.style.fontSize = size + "px";
    });
}

// إغلاق عند النقر خارج الصندوق
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target == modal) {
        closeSettings();
    }
}

// ===== دوال الأسئلة الشائعة (FAQ) =====
function setupFAQ() {
    const faqBlocks = document.querySelectorAll('.faq-block');
    
    faqBlocks.forEach((block, index) => {
        // الحصول على السؤال والجواب
        const question = block.querySelector('h3');
        const answer = block.querySelector('p');
        
        if (question && answer) {
            // إنشاء هيكل جديد للـ FAQ
            const questionText = question.textContent;
            const answerText = answer.innerHTML;
            
            block.innerHTML = `
                <div class="faq-question" data-index="${index}">
                    <span>${questionText}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${answerText}</p>
                </div>
            `;
            
            // إضافة حدث النقر
            const newQuestion = block.querySelector('.faq-question');
            const answerDiv = block.querySelector('.faq-answer');
            
            newQuestion.addEventListener('click', function() {
                // إغلاق البقية
                document.querySelectorAll('.faq-question').forEach(q => {
                    if (q !== this) {
                        q.classList.remove('active');
                        q.nextElementSibling.classList.remove('show');
                    }
                });
                
                // فتح/غلق الحالي
                this.classList.toggle('active');
                answerDiv.classList.toggle('show');
            });
        }
    });
}

// ===== دوال زر الحجز =====
// ===== دوال زر الحجز مع التحقق والرسائل =====
function setupBookingButton() {
    const termsCheckbox = document.getElementById('terms');
    const bookingBtn = document.getElementById('bookingBtn');
    const bookingForm = document.querySelector('.booking-form');
    
    if (termsCheckbox && bookingBtn && bookingForm) {
        // الحقول المطلوبة
        const requiredFields = bookingForm.querySelectorAll('input[required]:not([type="checkbox"])');
        
        // إضافة رسائل خطأ لكل حقل
        requiredFields.forEach(field => {
            // إنشاء عنصر رسالة الخطأ
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> هذا الحقل مطلوب';
            
            // إضافة رسالة الخطأ بعد الحقل
            field.parentElement.appendChild(errorDiv);
        });
        
        function checkFormValidity() {
            let allFilled = true;
            
            requiredFields.forEach(field => {
                const parentRow = field.parentElement;
                const errorMsg = parentRow.querySelector('.error-message');
                
                if (field.value.trim() === '') {
                    allFilled = false;
                    parentRow.classList.add('error');
                    if (errorMsg) errorMsg.classList.add('show');
                } else {
                    parentRow.classList.remove('error');
                    if (errorMsg) errorMsg.classList.remove('show');
                }
            });
            
            bookingBtn.disabled = !(allFilled && termsCheckbox.checked);
            
            // تحسين مظهر الزر
            if (!bookingBtn.disabled) {
                bookingBtn.style.background = 'linear-gradient(135deg, #ff8c00, #ff6b00)';
                bookingBtn.style.transform = 'scale(1.02)';
            } else {
                bookingBtn.style.background = '#ccc';
                bookingBtn.style.transform = 'scale(1)';
            }
        }
        
        // التحقق عند التغيير
        requiredFields.forEach(field => {
            field.addEventListener('input', checkFormValidity);
            field.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.boxShadow = '0 5px 20px rgba(255,140,0,0.2)';
            });
            field.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
                this.parentElement.style.boxShadow = 'none';
            });
        });
        
        termsCheckbox.addEventListener('change', checkFormValidity);
        
        // التحقق الأولي
        checkFormValidity();
        
        // عند الضغط على الزر
        bookingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // التحقق مرة أخيرة قبل الإرسال
            let allFilled = true;
            requiredFields.forEach(field => {
                if (field.value.trim() === '') {
                    allFilled = false;
                }
            });
            
            if (!allFilled || !termsCheckbox.checked) {
                alert('❌ الرجاء تعبئة جميع الحقول المطلوبة والموافقة على الشروط');
                return;
            }
            
            if (!this.disabled) {
                // رسالة شكر بسيطة
                alert("✅ شكراً لك! تم إرسال طلب الحجز بنجاح");
                
                // التوجيه إلى الصفحة الرئيسية بعد ثانية واحدة
                setTimeout(function() {
                    window.location.href = 'home.html';
                }, 1000);
            }
        });
    }
}

// حفظ بيانات الحجز
function saveBookingData() {
    const form = document.querySelector('.booking-form');
    if (!form) return;
    
    const bookingData = {
        package: document.querySelector('.form-title')?.textContent || 
                 document.querySelector('.form-title-classic')?.textContent ||
                 document.querySelector('.form-title-day')?.textContent ||
                 'حزمة',
        date: new Date().toLocaleString('ar-SA'),
        ownerName: form.querySelector('input[name="owner-name"]')?.value || '',
        phone: form.querySelector('input[name="phone"]')?.value || ''
    };
    
    localStorage.setItem('lastBooking', JSON.stringify(bookingData));
}

// ===== تأثيرات الأزرار المحسنة =====
function setupButtonEffects() {
    // جميع الأزرار
    const buttons = document.querySelectorAll('button, .btn-orange, .booking-btn, .submit-btn, nav ul li a');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // تأثيرات إضافية لبطاقات الحزم
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== تأثيرات التمرير =====
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // إظهار/إخفاء زر العودة للأعلى (إذا كان موجوداً)
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (scrollPosition > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    }
});
