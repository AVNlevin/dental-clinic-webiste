/**
 * AuraDental Studio - Core Interactivity Script
 * Handles: Theme Toggle, Mobile Menu, Symptom Checker, Before/After Slider, Custom Calendar & Booking, Testimonial Loop, FAQs Accordion, and Real-time Office Hours check.
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initSymptomChecker();
    initBeforeAfterSlider();
    initBookingScheduler();
    initTestimonialCarousel();
    initFaqAccordion();
    checkClinicStatus();
    initScrollObserver();
    initAdminPortal();
});

// ==========================================
// 1. Theme Toggle
// ==========================================
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Load saved preference
    const savedTheme = localStorage.getItem('aura-dental-theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    toggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('aura-dental-theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('aura-dental-theme', 'light');
        }
    });
}

// ==========================================
// 2. Mobile Menu
// ==========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==========================================
// 3. Scroll Active Link Observer
// ==========================================
function initScrollObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ==========================================
// 4. Dental Symptom Checker
// ==========================================
const QUIZ_DATA = {
    // Step 2 details based on step 1 concerns
    details: {
        pain: [
            { value: 'sensitivity', title: 'Hot/Cold Sensitivity', desc: 'Sharp pain when drinking hot coffee or ice water.' },
            { value: 'severe-pain', title: 'Severe Throbbing Toothache', desc: 'Constant pain that worsens when lying down or biting.' },
            { value: 'gum-pain', title: 'Sore or Bleeding Gums', desc: 'Redness, swelling, or blood when brushing/flossing.' }
        ],
        aesthetics: [
            { value: 'stains', title: 'Stained or Yellow Teeth', desc: 'Surface discoloration from coffee, tea, or natural aging.' },
            { value: 'crooked', title: 'Crooked or Crowded Teeth', desc: 'Misaligned bite, visible gaps, or overlapping teeth.' },
            { value: 'chipped-cosmetic', title: 'Chipped/Irregular Front Tooth', desc: 'Minor uneven chips or spacing issues on front smile line.' }
        ],
        checkup: [
            { value: 'routine-cleaning', title: 'Routine 6-Month Checkup', desc: 'Regular preventive cleaning, exam, and plaque removal.' },
            { value: 'deep-clean', title: 'Overdue Dental Exam', desc: 'It has been more than 12 months since my last visit.' },
            { value: 'xray-check', title: 'Checkup & X-Rays', desc: 'General screening with 3D digital imaging diagnostic scans.' }
        ],
        broken: [
            { value: 'fracture', title: 'Chipped or Broken Tooth', desc: 'Structural fracture due to trauma, biting hard objects, or decay.' },
            { value: 'lost-restoration', title: 'Lost Filling or Crown', desc: 'An existing dental crown, veneer, or filling has fallen out.' },
            { value: 'missing-gap', title: 'Missing Tooth Gap', desc: 'Wanting to fill a gap left by a extracted or lost tooth.' }
        ]
    },
    // Step 3 recommendations based on step 2 value
    recommendations: {
        'sensitivity': {
            title: 'Fluoride Treatment & Sensitive Care',
            icon: 'fa-shield-halved',
            desc: 'Based on your hot/cold sensitivity, we recommend a sensitive care cleaning session. We apply specialized fluoride varnishes or sealants to re-mineralize enamel, sealing exposed dentin tubules and relieving nerve irritation.',
            duration: '45 Mins',
            specialist: 'Dental Hygienist',
            treatmentId: 'general-checkup',
            dentistId: 'dr-mercer'
        },
        'severe-pain': {
            title: 'Emergency Root Canal Consultation',
            icon: 'fa-notes-medical',
            desc: 'Severe, constant throbbing suggests pulp inflammation or infection. We recommend immediate digital diagnostics to examine root health. A root canal can clean the infection, save the natural tooth, and eliminate your pain.',
            duration: '60 Mins',
            specialist: 'Dr. Marcus Vance (Endodontics)',
            treatmentId: 'emergency',
            dentistId: 'dr-vance'
        },
        'gum-pain': {
            title: 'Deep Periodontal Therapy (Scaling)',
            icon: 'fa-hand-holding-droplet',
            desc: 'Red, swollen, or bleeding gums indicate periodontal disease. We recommend a deep scaling and root planing procedure. This deep cleaning clears out hardened tartar (calculus) and bacterial deposits beneath your gumline.',
            duration: '60 Mins',
            specialist: 'Dental Hygienist',
            treatmentId: 'general-checkup',
            dentistId: 'dr-mercer'
        },
        'stains': {
            title: 'Premium In-Office Zoom Whitening',
            icon: 'fa-wand-magic-sparkles',
            desc: 'To treat staining and yellowing, we recommend our professional Zoom Laser Whitening. Combining cosmetic-grade hydrogen peroxide gel with a customized heating light, we safely lift years of stains, leaving teeth up to 8 shades whiter in 1 visit.',
            duration: '60 Mins',
            specialist: 'Dr. Sarah Mercer (Cosmetic)',
            treatmentId: 'cosmetic',
            dentistId: 'dr-mercer'
        },
        'crooked': {
            title: 'Invisalign® Clear Aligner Assessment',
            icon: 'fa-align-center',
            desc: 'For alignment and bite correction, we recommend clear, removable Invisalign aligners. Using our iTero 3D scanner, we render a virtual model of your teeth to chart your week-by-week tooth movements prior to starting treatment.',
            duration: '45 Mins',
            specialist: 'Dr. Sarah Mercer (Invisalign Provider)',
            treatmentId: 'orthodontics',
            dentistId: 'dr-mercer'
        },
        'chipped-cosmetic': {
            title: 'Handcrafted Porcelain Veneers',
            icon: 'fa-sparkles',
            desc: 'To correct asymmetrical front teeth, minor chips, or gaps, we recommend custom-designed porcelain veneers. These micro-thin ceramic shells are color-matched and permanently bonded over the front teeth, providing a flawless smile makeover.',
            duration: '60 Mins',
            specialist: 'Dr. Sarah Mercer (Cosmetic)',
            treatmentId: 'cosmetic',
            dentistId: 'dr-mercer'
        },
        'routine-cleaning': {
            title: 'Routine Hygiene Check & Polish',
            icon: 'fa-calendar-check',
            desc: 'Great job maintaining preventive care! We recommend our standard dental cleaning: plaque scaling, target stain polishing, and a comprehensive exam to inspect for cavities or structural cracks.',
            duration: '45 Mins',
            specialist: 'Dental Hygienist',
            treatmentId: 'general-checkup',
            dentistId: 'dr-mercer'
        },
        'deep-clean': {
            title: 'Comprehensive Preventive Hygiene & Exam',
            icon: 'fa-shield-halved',
            desc: 'Being overdue for dental cleaning allows soft plaque to calcify into hard tartar, which can’t be brushed off at home. We recommend a full examination, diagnostic digital X-rays, plaque scaling, and gum pockets screening.',
            duration: '60 Mins',
            specialist: 'Dental Hygienist',
            treatmentId: 'general-checkup',
            dentistId: 'dr-mercer'
        },
        'xray-check': {
            title: 'Dental Checkup & X-Ray Diagnostics',
            icon: 'fa-circle-info',
            desc: 'For comprehensive diagnostics, we recommend a clinical consultation. Using 3D cone-beam dental scans, we evaluate bone density, check between-teeth contact points, and check the roots for silent structural issues.',
            duration: '45 Mins',
            specialist: 'Dr. Sarah Mercer',
            treatmentId: 'general-checkup',
            dentistId: 'dr-mercer'
        },
        'fracture': {
            title: 'Restorative Tooth-Colored Bonding',
            icon: 'fa-tooth',
            desc: 'For structurally fractured or chipped teeth, we recommend composite resin bonding. The matching dental resin is applied directly, cured with specialized UV light, and sculpted to perfectly blend with your natural tooth shape.',
            duration: '60 Mins',
            specialist: 'Dr. Sarah Mercer (Restorative)',
            treatmentId: 'cosmetic',
            dentistId: 'dr-mercer'
        },
        'lost-restoration': {
            title: 'Durable Filling/Crown Restoration',
            icon: 'fa-screwdriver',
            desc: 'An open cavity from a lost filling or crown exposes sensitive tooth dentin to bacteria. We recommend disinfecting the tooth cavity and replacing the lost restoration with high-grade composite resin or a custom porcelain crown.',
            duration: '60 Mins',
            specialist: 'Dr. Marcus Vance (Restorative)',
            treatmentId: 'implant-consult', // Redirect to restorative consult
            dentistId: 'dr-vance'
        },
        'missing-gap': {
            title: 'Guided Dental Implant Placement',
            icon: 'fa-screwdriver',
            desc: 'To permanently fill a gap, we recommend a medical-grade titanium dental implant. Rooted securely in the jawbone, it acts as a strong anchor for a custom zirconia crown, restoring 100% chewing function and preventing bone degradation.',
            duration: '60 Mins',
            specialist: 'Dr. Marcus Vance (Implantologist)',
            treatmentId: 'implant-consult',
            dentistId: 'dr-vance'
        }
    }
};

function initSymptomChecker() {
    let currentStep = 1;
    let selectedConcern = '';
    let selectedDetail = '';
    let selectedRecData = null;

    const progressFill = document.getElementById('quiz-progress');
    const stepIndicators = document.querySelectorAll('.progress-step');
    const steps = document.querySelectorAll('.quiz-step');
    
    // Step 1 Options
    const step1Options = document.querySelectorAll('#quiz-step-1 .quiz-option');
    
    // Step 2 Container Elements
    const q2Title = document.getElementById('quiz-q2-title');
    const q2OptionsGrid = document.getElementById('quiz-q2-options');
    const prevBtn = document.getElementById('quiz-prev-btn');
    
    // Step 3 Elements
    const resultTitle = document.getElementById('quiz-result-title');
    const resultDesc = document.getElementById('quiz-result-desc');
    const resultIcon = document.getElementById('result-icon');
    const resultDuration = document.getElementById('quiz-result-duration');
    const resultSpecialist = document.getElementById('quiz-result-specialist');
    const resetBtn = document.getElementById('quiz-reset-btn');
    const bookResultBtn = document.getElementById('quiz-book-result-btn');

    function updateProgress() {
        const percentage = ((currentStep - 1) / 2) * 100;
        progressFill.style.width = `${percentage}%`;

        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < currentStep) {
                indicator.classList.add('completed');
            }
        });
    }

    function showStep(stepNum) {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`quiz-step-${stepNum}`).classList.add('active');
        currentStep = stepNum;
        updateProgress();
    }

    // Step 1: Concern Click
    step1Options.forEach(option => {
        option.addEventListener('click', () => {
            step1Options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedConcern = option.getAttribute('data-value');
            
            // Build dynamic content for Step 2
            buildStep2Options();
            setTimeout(() => {
                showStep(2);
            }, 300);
        });
    });

    // Build Step 2 Questions & Cards
    function buildStep2Options() {
        // Set dynamic titles
        const titles = {
            pain: 'Where or how do you feel the discomfort?',
            aesthetics: 'What is your primary cosmetic goal?',
            checkup: 'When was the last time you saw a dentist?',
            broken: 'Describe the dental issue you are facing:'
        };
        q2Title.textContent = titles[selectedConcern] || 'Tell us a bit more details...';

        // Clear previous options
        q2OptionsGrid.innerHTML = '';

        // Load correct details
        const optionsList = QUIZ_DATA.details[selectedConcern] || [];
        optionsList.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.setAttribute('data-value', opt.value);
            
            // Icons based on values
            let iconHTML = '<i class="fa-solid fa-circle-question"></i>';
            if (opt.value === 'sensitivity') iconHTML = '<i class="fa-solid fa-snowflake"></i>';
            else if (opt.value === 'severe-pain') iconHTML = '<i class="fa-solid fa-fire"></i>';
            else if (opt.value === 'gum-pain') iconHTML = '<i class="fa-solid fa-droplet"></i>';
            else if (opt.value === 'stains') iconHTML = '<i class="fa-solid fa-sun"></i>';
            else if (opt.value === 'crooked') iconHTML = '<i class="fa-solid fa-align-center"></i>';
            else if (opt.value === 'chipped-cosmetic') iconHTML = '<i class="fa-solid fa-sparkles"></i>';
            else if (opt.value === 'routine-cleaning') iconHTML = '<i class="fa-solid fa-shield-heart"></i>';
            else if (opt.value === 'deep-clean') iconHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
            else if (opt.value === 'xray-check') iconHTML = '<i class="fa-solid fa-magnifying-glass-chart"></i>';
            else if (opt.value === 'fracture') iconHTML = '<i class="fa-solid fa-heart-crack"></i>';
            else if (opt.value === 'lost-restoration') iconHTML = '<i class="fa-solid fa-wrench"></i>';
            else if (opt.value === 'missing-gap') iconHTML = '<i class="fa-solid fa-tooth"></i>';

            btn.innerHTML = `
                <span class="option-icon">${iconHTML}</span>
                <span class="option-title">${opt.title}</span>
                <span class="option-desc">${opt.desc}</span>
            `;

            btn.addEventListener('click', () => {
                const step2Buttons = q2OptionsGrid.querySelectorAll('.quiz-option');
                step2Buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedDetail = opt.value;

                // Load and show results
                loadRecommendation();
                setTimeout(() => {
                    showStep(3);
                }, 300);
            });

            q2OptionsGrid.appendChild(btn);
        });
    }

    // Step 3: Load Recommendations
    function loadRecommendation() {
        const rec = QUIZ_DATA.recommendations[selectedDetail];
        if (!rec) return;
        
        selectedRecData = rec;

        resultTitle.textContent = rec.title;
        resultDesc.textContent = rec.desc;
        resultDuration.textContent = rec.duration;
        resultSpecialist.textContent = rec.specialist;

        // Change icon class
        resultIcon.className = `fa-solid ${rec.icon}`;
    }

    // Prev Button
    prevBtn.addEventListener('click', () => {
        showStep(1);
    });

    // Reset Button
    function resetQuiz() {
        selectedConcern = '';
        selectedDetail = '';
        selectedRecData = null;
        step1Options.forEach(opt => opt.classList.remove('selected'));
        showStep(1);
    }
    resetBtn.addEventListener('click', resetQuiz);

    // Book Treatment Button from Quiz
    bookResultBtn.addEventListener('click', () => {
        if (!selectedRecData) return;

        // Populate Booking Form values
        const dentistCard = document.querySelector(`.dentist-card[data-dentist-id="${selectedRecData.dentistId}"]`);
        if (dentistCard) {
            dentistCard.click();
        }

        const treatmentSelect = document.getElementById('treatment-select');
        if (treatmentSelect) {
            treatmentSelect.value = selectedRecData.treatmentId;
            // Trigger change event to ensure sync
            treatmentSelect.dispatchEvent(new Event('change'));
        }

        // Scroll smooth to booking
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
}

// ==========================================
// 5. Before/After Image Slider
// ==========================================
function initBeforeAfterSlider() {
    const sliderInput = document.getElementById('compare-slider');
    const afterOverlay = document.getElementById('img-after-overlay');
    const sliderLine = document.getElementById('slider-line');

    if (!sliderInput || !afterOverlay || !sliderLine) return;

    sliderInput.addEventListener('input', (e) => {
        const value = e.target.value;
        afterOverlay.style.width = `${value}%`;
        sliderLine.style.left = `${value}%`;
    });
}

// ==========================================
// 6. Interactive Booking Scheduler
// ==========================================
function initBookingScheduler() {
    let bookingState = {
        step: 1,
        dentistId: 'dr-mercer', // default active
        date: null,
        timeSlot: null
    };

    // Sidebar Steps
    const stepLinks = document.querySelectorAll('.booking-steps-sidebar .step-link');
    const formSteps = document.querySelectorAll('.booking-form .form-step');

    // Dentist Cards
    const dentistCards = document.querySelectorAll('.dentist-card');

    // Buttons
    const btnNext1 = document.getElementById('btn-next-1');
    const btnPrev2 = document.getElementById('btn-prev-2');
    const btnNext2 = document.getElementById('btn-next-2');
    const btnPrev3 = document.getElementById('btn-prev-3');
    const bookingForm = document.getElementById('booking-form');

    // Date/Time Elements
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    const dateDisplay = document.getElementById('selected-date-display');

    // Summary Elements
    const summaryDentist = document.getElementById('summary-dentist');
    const summaryDatetime = document.getElementById('summary-datetime');

    // Modal elements
    const successModal = document.getElementById('success-modal');
    const modalDentist = document.getElementById('modal-dentist-name');
    const modalTime = document.getElementById('modal-appointment-time');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Date generation variables
    let currentCalDate = new Date(2026, 4, 1); // Starting with May 2026 for consistent demo
    const todayDemo = new Date(2026, 4, 23); // Mocking local system time as Saturday, May 23, 2026

    function showFormStep(stepNum) {
        formSteps.forEach(step => step.classList.remove('active'));
        document.getElementById(`form-step-${stepNum}`).classList.add('active');
        
        stepLinks.forEach((link, idx) => {
            link.classList.remove('active');
            if (idx + 1 === stepNum) {
                link.classList.add('active');
            }
        });
        
        bookingState.step = stepNum;
        if (stepNum === 3) {
            updateBookingSummary();
        }
    }

    // Step 1: Dentist Selection
    dentistCards.forEach(card => {
        card.addEventListener('click', () => {
            dentistCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            bookingState.dentistId = card.getAttribute('data-dentist-id');
            
            // Reset slots if dentist changes
            bookingState.timeSlot = null;
            btnNext2.disabled = true;
            renderTimeSlots();
        });
    });

    btnNext1.addEventListener('click', () => {
        showFormStep(2);
        renderCalendar();
    });

    // Step 2: Date & Time
    btnPrev2.addEventListener('click', () => {
        showFormStep(1);
    });

    btnNext2.addEventListener('click', () => {
        showFormStep(3);
    });

    // Step 3: Information & Summary
    btnPrev3.addEventListener('click', () => {
        showFormStep(2);
    });

    function updateBookingSummary() {
        const dentistName = bookingState.dentistId === 'dr-mercer' ? 'Dr. Sarah Mercer' : 'Dr. Marcus Vance';
        summaryDentist.textContent = dentistName;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = bookingState.date.toLocaleDateString('en-US', options);
        summaryDatetime.textContent = `${formattedDate} at ${bookingState.timeSlot}`;
    }

    // --- Custom Calendar Generation ---
    function renderCalendar() {
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();

        // Month Names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
        calendarDaysGrid.innerHTML = '';

        // First day of the month offset
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create empty day blocks before start of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'cal-day empty';
            calendarDaysGrid.appendChild(emptyDay);
        }

        // Create days
        for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.textContent = dayNum;

            const thisDate = new Date(year, month, dayNum);
            const dayOfWeek = thisDate.getDay();

            // Disable conditions: past dates relative to May 23, 2026, and weekends (Sat/Sun)
            const isPast = thisDate < new Date(todayDemo.getFullYear(), todayDemo.getMonth(), todayDemo.getDate());
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0=Sunday, 6=Saturday

            if (isPast || isWeekend) {
                dayEl.classList.add('disabled');
            } else {
                // Check if today
                if (thisDate.toDateString() === todayDemo.toDateString()) {
                    dayEl.classList.add('today');
                }
                
                // Check if selected
                if (bookingState.date && thisDate.toDateString() === bookingState.date.toDateString()) {
                    dayEl.classList.add('selected');
                }

                dayEl.addEventListener('click', () => {
                    const days = calendarDaysGrid.querySelectorAll('.cal-day');
                    days.forEach(d => d.classList.remove('selected'));
                    dayEl.classList.add('selected');
                    
                    bookingState.date = thisDate;
                    bookingState.timeSlot = null; // Reset slot
                    btnNext2.disabled = true;

                    // Display date format
                    const displayOptions = { month: 'short', day: 'numeric' };
                    dateDisplay.textContent = `(${thisDate.toLocaleDateString('en-US', displayOptions)})`;

                    renderTimeSlots();
                });
            }

            calendarDaysGrid.appendChild(dayEl);
        }
    }

    prevMonthBtn.addEventListener('click', () => {
        // Don't scroll past the mock current month (May 2026) for demo purposes
        if (currentCalDate.getMonth() > 4 || currentCalDate.getFullYear() > 2026) {
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            renderCalendar();
        }
    });

    nextMonthBtn.addEventListener('click', () => {
        // Restrict next scroll to maximum +2 months for cleaner scheduling
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        renderCalendar();
    });

    // --- Custom Time Slots Generation ---
    function renderTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        if (!bookingState.date) {
            timeSlotsGrid.innerHTML = '<div class="empty-state-slots">Please select an available date on the calendar first.</div>';
            return;
        }

        const slots = ["09:00 AM", "10:30 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];
        const daySeed = bookingState.date.getDate(); // Use day number to mock different busy times

        slots.forEach((time, index) => {
            const slotEl = document.createElement('div');
            slotEl.className = 'time-slot';
            slotEl.textContent = time;

            // Mock booked slots based on date math to make it interactive and dynamic
            const isBooked = (daySeed + index) % 3 === 0;

            if (isBooked) {
                slotEl.classList.add('booked');
                slotEl.setAttribute('title', 'Slot Already Booked');
            } else {
                if (bookingState.timeSlot === time) {
                    slotEl.classList.add('selected');
                }

                slotEl.addEventListener('click', () => {
                    const allSlots = timeSlotsGrid.querySelectorAll('.time-slot');
                    allSlots.forEach(s => s.classList.remove('selected'));
                    slotEl.classList.add('selected');
                    
                    bookingState.timeSlot = time;
                    btnNext2.disabled = false; // Enable continue btn
                });
            }

            timeSlotsGrid.appendChild(slotEl);
        });
    }

    // --- Form validation & submit ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const nameInput = document.getElementById('patient-name');
        const emailInput = document.getElementById('patient-email');
        const phoneInput = document.getElementById('patient-phone');

        // Reset previous invalid tags
        nameInput.closest('.input-group').classList.remove('invalid');
        emailInput.closest('.input-group').classList.remove('invalid');
        phoneInput.closest('.input-group').classList.remove('invalid');

        if (!nameInput.value.trim()) {
            nameInput.closest('.input-group').classList.add('invalid');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            emailInput.closest('.input-group').classList.add('invalid');
            isValid = false;
        }

        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value)) {
            phoneInput.closest('.input-group').classList.add('invalid');
            isValid = false;
        }

        if (isValid) {
            const newBooking = {
                id: 'BK-' + Date.now().toString().slice(-6),
                patientName: nameInput.value.trim(),
                patientEmail: emailInput.value.trim(),
                patientPhone: phoneInput.value.trim(),
                treatment: document.getElementById('treatment-select').value,
                notes: document.getElementById('patient-notes').value.trim(),
                dentist: bookingState.dentistId,
                date: bookingState.date.toISOString(),
                timeSlot: bookingState.timeSlot,
                timestamp: new Date().toISOString()
            };

            // Send booking to Node API backend
            fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBooking)
            })
            .then(response => {
                if (response.ok) {
                    triggerSuccessModal();
                } else {
                    alert("Unable to save booking on server. Please try again.");
                }
            })
            .catch(err => {
                console.error("Booking upload failed:", err);
                alert("Could not connect to server to save booking.");
            });
        }
    });

    function triggerSuccessModal() {
        const dentistName = bookingState.dentistId === 'dr-mercer' ? 'Dr. Sarah Mercer' : 'Dr. Marcus Vance';
        modalDentist.textContent = dentistName;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = bookingState.date.toLocaleDateString('en-US', options);
        modalTime.innerHTML = `<i class="fa-solid fa-calendar-day"></i> ${formattedDate} at ${bookingState.timeSlot}`;

        successModal.classList.add('active');
    }

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        bookingForm.reset();
        
        // Reset state
        bookingState = {
            step: 1,
            dentistId: 'dr-mercer',
            date: null,
            timeSlot: null
        };
        
        // Return to first step
        dentistCards.forEach(c => c.classList.remove('active'));
        document.querySelector('.dentist-card[data-dentist-id="dr-mercer"]').classList.add('active');
        dateDisplay.textContent = '(Select a Date)';
        btnNext2.disabled = true;
        
        renderTimeSlots();
        showFormStep(1);
        
        // Scroll to top/hero
        document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    });
}

// ==========================================
// 7. Testimonials Carousel
// ==========================================
function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const track = document.getElementById('testimonials-track');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;

        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === index) {
                slide.classList.add('active');
            }
        });

        indicators.forEach((ind, idx) => {
            ind.classList.remove('active');
            if (idx === index) {
                ind.classList.add('active');
            }
        });
    }

    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const slideIndex = parseInt(indicator.getAttribute('data-slide'));
            goToSlide(slideIndex);
            resetAutoplay();
        });
    });

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Pause autoplay on mouse hover
    const carouselContainer = document.querySelector('.testimonials-slider-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
}

// ==========================================
// 8. FAQs Accordion
// ==========================================
function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question-btn');

    questions.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.nextElementSibling;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Close other items
            questions.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherBtn.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                wrapper.style.maxHeight = null;
            } else {
                btn.setAttribute('aria-expanded', 'true');
                wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
            }
        });
    });
}

// ==========================================
// 9. Real-Time Office Hours Status
// ==========================================
function checkClinicStatus() {
    const badge = document.getElementById('clinic-status-badge');
    if (!badge) return;

    const badgeDot = badge.querySelector('.status-dot');
    const badgeText = badge.querySelector('.status-text');

    // Using user local system time: 2026-05-23T10:37:03+05:30 (Saturday)
    // For realistic runtime check, we extract components:
    const currentDate = new Date(2026, 4, 23, 10, 37); // Simulated local time
    const day = currentDate.getDay(); // 0: Sunday, 1: Mon, ..., 6: Saturday
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const currentTimeInMinutes = hour * 60 + minutes;

    let isOpen = false;

    // Mon - Thu: 8:00 AM - 6:00 PM (480 mins to 1080 mins)
    if (day >= 1 && day <= 4) {
        if (currentTimeInMinutes >= 480 && currentTimeInMinutes <= 1080) {
            isOpen = true;
        }
    }
    // Friday: 8:00 AM - 4:00 PM (480 mins to 960 mins)
    else if (day === 5) {
        if (currentTimeInMinutes >= 480 && currentTimeInMinutes <= 960) {
            isOpen = true;
        }
    }
    // Sat - Sun: Closed
    else {
        isOpen = false;
    }

    if (isOpen) {
        badge.className = 'status-badge open';
        badgeText.textContent = 'Open Now';
    } else {
        badge.className = 'status-badge closed';
        badgeText.textContent = 'Closed Now (Emergency Only)';
    }
}

// ==========================================
// 10. Admin Portal / Booking Dashboard
// ==========================================
function initAdminPortal() {
    const staffLink = document.getElementById('staff-portal-link');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const searchInput = document.getElementById('admin-search-input');
    const exportBtn = document.getElementById('admin-export-btn');
    const clearBtn = document.getElementById('admin-clear-btn');
    const bookingsList = document.getElementById('admin-bookings-list');

    const totalBookingsEl = document.getElementById('admin-total-bookings');
    const drMercerCountEl = document.getElementById('admin-dr-mercer-count');
    const drVanceCountEl = document.getElementById('admin-dr-vance-count');

    if (!staffLink || !adminModal) return;

    let cachedPin = "";
    let loadedBookings = [];

    // Open Admin modal
    staffLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!cachedPin) {
            const pin = prompt("Enter Clinic Staff Passcode (PIN):");
            if (!pin) return; // User cancelled or entered empty string
            
            fetchBookings(pin);
        } else {
            fetchBookings(cachedPin);
        }
    });

    // Close Admin modal
    closeAdminBtn.addEventListener('click', () => {
        adminModal.classList.remove('active');
    });

    // Close admin modal if clicking outside card
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.remove('active');
        }
    });

    // Search filter (filters local cache in memory)
    searchInput.addEventListener('input', () => {
        renderBookingsTable();
    });

    // Clear all bookings
    clearBtn.addEventListener('click', () => {
        if (loadedBookings.length === 0) {
            alert("No records to clear.");
            return;
        }
        if (confirm("Are you sure you want to clear all appointment records? This action cannot be undone.")) {
            fetch('/api/clear', {
                method: 'POST',
                headers: {
                    'x-staff-pin': cachedPin
                }
            })
            .then(res => {
                if (res.ok) {
                    loadedBookings = [];
                    renderBookingsTable();
                    alert("All records successfully cleared.");
                } else {
                    alert("Access Denied: Session expired or invalid PIN.");
                    cachedPin = ""; // Reset cached PIN
                }
            })
            .catch(err => {
                console.error("Clear request failed:", err);
                alert("Could not connect to server to clear bookings.");
            });
        }
    });

    // Export to CSV
    exportBtn.addEventListener('click', () => {
        if (loadedBookings.length === 0) {
            alert("No bookings found to export.");
            return;
        }

        const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
        
        // Header row
        let csvContent = "Appointment ID,Date,Time Slot,Patient Name,Email,Phone,Dentist,Reason for Visit,Special Notes,Booked At\n";

        loadedBookings.forEach(bk => {
            const dentistName = bk.dentist === 'dr-mercer' ? 'Dr. Sarah Mercer' : 'Dr. Marcus Vance';
            
            // Format Date nicely for Excel
            const formattedDate = new Date(bk.date).toLocaleDateString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });

            const row = [
                escapeCsv(bk.id),
                escapeCsv(formattedDate),
                escapeCsv(bk.timeSlot),
                escapeCsv(bk.patientName),
                escapeCsv(bk.patientEmail),
                escapeCsv(bk.patientPhone),
                escapeCsv(dentistName),
                escapeCsv(bk.treatment),
                escapeCsv(bk.notes),
                escapeCsv(new Date(bk.timestamp).toLocaleString())
            ];

            csvContent += row.join(",") + "\n";
        });

        // Trigger Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `auradental_appointments_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Fetch Bookings from Server
    function fetchBookings(pin) {
        bookingsList.innerHTML = `
            <tr>
                <td colspan="6" class="no-records-msg">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; display: block; margin-bottom: 12px;"></i>
                    Retrieving records from clinic database...
                </td>
            </tr>
        `;

        fetch('/api/bookings', {
            method: 'GET',
            headers: {
                'x-staff-pin': pin
            }
        })
        .then(response => {
            if (response.status === 401) {
                alert("Access Denied: Incorrect staff PIN passcode.");
                cachedPin = ""; // clear invalid pin
                renderBookingsTable(); // restores original/blank state
                throw new Error("Unauthorized PIN");
            }
            if (!response.ok) {
                throw new Error("Network response error");
            }
            return response.json();
        })
        .then(data => {
            cachedPin = pin; // cache successful PIN
            loadedBookings = data || [];
            
            renderBookingsTable();
            adminModal.classList.add('active'); // open dashboard modal
        })
        .catch(err => {
            console.error("Fetch bookings failed:", err);
            if (err.message !== "Unauthorized PIN") {
                alert("Unable to fetch bookings. Ensure the server backend is running.");
                renderBookingsTable();
            }
        });
    }

    // Render Table based on in-memory filtered array
    function renderBookingsTable() {
        const query = searchInput.value.toLowerCase().trim();

        // Filter list locally
        const filteredBookings = loadedBookings.filter(bk => {
            return (
                bk.patientName.toLowerCase().includes(query) ||
                bk.patientEmail.toLowerCase().includes(query) ||
                bk.patientPhone.toLowerCase().includes(query) ||
                bk.id.toLowerCase().includes(query)
            );
        });

        // Sort by appointment date-time descending (newest appointments first)
        filteredBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update Stats counters using all bookings (not filtered)
        totalBookingsEl.textContent = loadedBookings.length;
        drMercerCountEl.textContent = loadedBookings.filter(b => b.dentist === 'dr-mercer').length;
        drVanceCountEl.textContent = loadedBookings.filter(b => b.dentist === 'dr-vance').length;

        bookingsList.innerHTML = '';

        if (filteredBookings.length === 0) {
            bookingsList.innerHTML = `
                <tr>
                    <td colspan="6" class="no-records-msg">
                        <i class="fa-solid fa-folder-open" style="font-size: 2rem; display: block; margin-bottom: 12px; opacity: 0.5;"></i>
                        No matching appointments found.
                    </td>
                </tr>
            `;
            return;
        }

        filteredBookings.forEach(bk => {
            const tr = document.createElement('tr');
            
            // Dentist Badge formatting
            const dentistClass = bk.dentist === 'dr-mercer' ? 'mercer' : 'vance';
            const dentistName = bk.dentist === 'dr-mercer' ? 'Dr. Sarah Mercer' : 'Dr. Marcus Vance';

            // Date formatting
            const apptDate = new Date(bk.date);
            const formattedDate = apptDate.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });

            // Treatment display name
            const treatmentNames = {
                'general-checkup': 'Hygiene & Clean',
                'cosmetic': 'Cosmetic Care',
                'orthodontics': 'Invisalign / Ortho',
                'implant-consult': 'Implant Consult',
                'emergency': 'Emergency Relief'
            };
            const treatmentDisplay = treatmentNames[bk.treatment] || bk.treatment;

            tr.innerHTML = `
                <td>
                    <h5>${formattedDate}</h5>
                    <p><i class="fa-regular fa-clock"></i> ${bk.timeSlot}</p>
                </td>
                <td>
                    <strong>${bk.patientName}</strong>
                    <p style="font-size: 0.75rem; color: var(--text-muted)">ID: ${bk.id}</p>
                </td>
                <td>
                    <p><i class="fa-regular fa-envelope"></i> ${bk.patientEmail}</p>
                    <p><i class="fa-solid fa-phone-flip" style="font-size: 0.75rem"></i> ${bk.patientPhone}</p>
                </td>
                <td>
                    <span class="admin-badge ${dentistClass}">${dentistName}</span>
                </td>
                <td>
                    <span class="admin-badge treatment">${treatmentDisplay}</span>
                </td>
                <td>
                    <p style="max-width: 250px; white-space: normal; word-break: break-word;">${bk.notes || '<span class="text-muted">No notes</span>'}</p>
                </td>
            `;

            bookingsList.appendChild(tr);
        });
    }
}
