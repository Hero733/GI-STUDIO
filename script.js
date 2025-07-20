document.addEventListener('DOMContentLoaded', () => {

    // --- กำหนดข้อมูลโค้ดสำหรับแต่ละแมพ ---
    const allMapData = {
        'bloxfruits': {
            name: "FruitsLand",
            codes: [
                { code: "Dream", reward: "💰 20ล้าน และ x2 Exp 2นาที", status: "Active", type: "new" },
                { code: "UPDBATA", reward: "💰 x2 เงินในเกม 20 นาที", status: "Active", type: "new" },
                { code: "WELCOME", reward: "✨ รีสเตตัสฟรี 1 ครั้ง", status: "Active", type: "new" },
                { code: "GISTUDIO", reward: "⚡ x2 EXP 30 นาที", status: "Active", type: "new" },
                { code: "RESETSTATS", reward: "✨ รีสเตตัสฟรี 1 ครั้ง", status: "Active", type: "new" }
            ]
        },
        'petsimx': {
            name: "GodPiece",
            codes: [
                { code: "UPD2", reward: "💎 1,000,000 Gems", status: "Active", type: "new" },
                { code: "OBITOTV", reward: "💰 10,000,000 Bare", status: "Active", type: "new" },
                { code: "BIGMONEY", reward: "💰 50,000,000 Bare", status: "Expired", type: "old" }
            ]
        },
        'adoptme': {
            name: "OakPiece",
            codes: [
                { code: "UPDBATA", reward: "ผลไม้ปีศาจสุ่ม", status: "Active", type: "new" },
                { code: "NLOOBITO", reward: "สมุดฮาคิ", status: "Expired", type: "old" }
            ]
        }
    };

    // --- ตัวแปร DOM elements ---
    const pageTitle = document.getElementById('pageTitle');
    const mainHeaderTitle = document.getElementById('mainHeaderTitle');
    const navItems = document.querySelectorAll('.nav-item');
    const allPageContents = document.querySelectorAll('.page-content');

    const homePage = document.getElementById('homePage');
    const mapPage = document.getElementById('mapPage');
    const aboutPage = document.getElementById('aboutPage');

    // ส่วนของรูปภาพสไลด์หน้าแรก
    const homeSliderImage = document.getElementById('homeSliderImage');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');

    const sliderImages = [
        'assets/img/Obito.png',
        'assets/img/Sword.png',
        'assets/img/Gojo.png'
    ];
    let currentImageIndex = 0;
    let sliderInterval; // ตัวแปรสำหรับเก็บ setInterval

    let currentMapData = null; // ข้อมูลของแมพที่กำลังแสดงอยู่

    // --- ฟังก์ชันหลักในการแสดงหน้า ---
    function showPage(pageId) {
        // ซ่อนทุกหน้าก่อน
        allPageContents.forEach(page => page.classList.remove('active'));

        // หยุดสไลด์รูปภาพเมื่อออกจากหน้า Home
        clearInterval(sliderInterval); 

        // Reset visibility for mapPage and aboutPage
        mapPage.style.display = 'none';
        aboutPage.style.display = 'none';
        homePage.style.display = 'none';


        // แสดงหน้าตาม pageId
        if (pageId === 'home') {
            homePage.style.display = 'block';
            homePage.classList.add('active');
            mainHeaderTitle.textContent = 'หน้าแรก';
            pageTitle.textContent = 'Roblox Hub - หน้าแรก';
            // เริ่มสไลด์รูปภาพเมื่ออยู่หน้า Home
            startImageSlider();
            updateSliderDisplay(); // อัปเดตรูปภาพและจุดเมื่อเข้าหน้า Home
        } else if (pageId === 'about') {
            aboutPage.style.display = 'block';
            aboutPage.classList.add('active');
            mainHeaderTitle.textContent = 'เกี่ยวกับ';
            pageTitle.textContent = 'Roblox Hub - เกี่ยวกับ';
        } else {
            // นี่คือหน้าโค้ดของแมพ
            mapPage.style.display = 'block';
            mapPage.classList.add('active');

            currentMapData = allMapData[pageId];
            if (currentMapData) {
                mainHeaderTitle.textContent = currentMapData.name;
                pageTitle.textContent = `โค้ดฟรีสำหรับ ${currentMapData.name}! - Roblox Hub`;
                displayCodes(currentMapData.codes);
            } else {
                console.warn(`Map ID "${pageId}" ไม่ถูกต้อง หรือไม่พบข้อมูล`);
                history.replaceState(null, '', '#home'); // เปลี่ยน URL เป็น #home
                showPage('home'); // Redirect ไปหน้า Home
                return;
            }
        }

        // อัปเดตสถานะ Active ของ Nav Item
        navItems.forEach(item => item.classList.remove('active'));
        const activeNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        // เลื่อนไปด้านบนของหน้า (เหมือนโหลดหน้าใหม่)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- ฟังก์ชันสำหรับสไลด์รูปภาพบนหน้าแรก ---
    function updateSliderDisplay() {
        if (!homeSliderImage || sliderImages.length === 0) return;

        homeSliderImage.style.opacity = '0'; // เริ่ม fade out
        setTimeout(() => {
            homeSliderImage.src = sliderImages[currentImageIndex];
            homeSliderImage.style.opacity = '1'; // Fade in รูปใหม่
        }, 300); // รอ 300ms ก่อนเปลี่ยน src และ fade in

        // อัปเดตจุดบอกตำแหน่ง
        if (sliderDotsContainer) {
            sliderDotsContainer.innerHTML = ''; // ล้างจุดเก่า
            sliderImages.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === currentImageIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    clearInterval(sliderInterval); // หยุด auto-slide
                    currentImageIndex = index;
                    updateSliderDisplay();
                    startImageSlider(); // เริ่ม auto-slide ใหม่
                });
                sliderDotsContainer.appendChild(dot);
            });
        }
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
        updateSliderDisplay();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + sliderImages.length) % sliderImages.length;
        updateSliderDisplay();
    }

    function startImageSlider() {
        // เคลียร์ interval เก่าก่อนเริ่มใหม่ เพื่อป้องกันการซ้อนทับ
        clearInterval(sliderInterval); 
        sliderInterval = setInterval(showNextImage, 4000); // เปลี่ยนรูปทุก 4 วินาที
    }

    // เพิ่ม Event Listener ให้ปุ่ม Prev/Next
    if (sliderPrevBtn) {
        sliderPrevBtn.addEventListener('click', () => {
            clearInterval(sliderInterval); // หยุด auto-slide
            showPrevImage();
            startImageSlider(); // เริ่ม auto-slide ใหม่
        });
    }
    if (sliderNextBtn) {
        sliderNextBtn.addEventListener('click', () => {
            clearInterval(sliderInterval); // หยุด auto-slide
            showNextImage();
            startImageSlider(); // เริ่ม auto-slide ใหม่
        });
    }

    // --- ฟังก์ชันแสดงโค้ดของแมพ (เหมือนเดิม) ---
    const newCodeListDiv = document.getElementById('newCodeList');
    const oldCodeListDiv = document.getElementById('oldCodeList');

    function displayCodes(codesToDisplay) {
        newCodeListDiv.innerHTML = '';
        oldCodeListDiv.innerHTML = '';

        const newActiveCodes = codesToDisplay.filter(item => item.type === 'new' && item.status === 'Active');
        const oldActiveCodes = codesToDisplay.filter(item => item.type === 'old' && item.status === 'Active');
        const expiredCodes = codesToDisplay.filter(item => item.status === 'Expired');

        if (newActiveCodes.length > 0) {
            newActiveCodes.forEach(item => {
                const codeItemDiv = createCodeItemElement(item);
                newCodeListDiv.appendChild(codeItemDiv);
            });
        } else {
            newCodeListDiv.innerHTML = '<p class="info-message" style="background-color: #f0f0f0; border: 1px solid #ccc; color: #666;">ยังไม่มีโค้ดใหม่ในขณะนี้!</p>';
        }

        const allOldCodes = [...oldActiveCodes, ...expiredCodes];
        if (allOldCodes.length > 0) {
            allOldCodes.forEach(item => {
                const codeItemDiv = createCodeItemElement(item);
                oldCodeListDiv.appendChild(codeItemDiv);
            });
        } else {
            oldCodeListDiv.innerHTML = '<p class="info-message" style="background-color: #f0f0f0; border: 1px solid #ccc; color: #666;">ยังไม่มีโค้ดเก่าในขณะนี้!</p>';
        }

        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const codeToCopy = event.target.dataset.code;
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    event.target.textContent = 'คัดลอกแล้ว!';
                    setTimeout(() => {
                        event.target.textContent = 'คัดลอก';
                    }, 2000);
                }).catch(err => {
                    console.error('ไม่สามารถคัดลอกโค้ดได้:', err);
                    alert('ไม่สามารถคัดลอกโค้ดได้ กรุณาลองคัดลอกเอง: ' + codeToCopy);
                });
            });
        });
    }

    // ฟังก์ชันช่วยสร้าง element ของโค้ด (เหมือนเดิม)
    function createCodeItemElement(item) {
        const codeItemDiv = document.createElement('div');
        codeItemDiv.classList.add('code-item');
        if (item.status === 'Expired') {
            codeItemDiv.style.opacity = '0.6';
            codeItemDiv.style.backgroundColor = '#f0f0f0';
        }

        codeItemDiv.innerHTML = `
            <strong>${item.code}</strong>
            <p>รางวัล: ${item.reward}</p>
            <p style="font-size: 12px; color: ${item.status === 'Active' ? 'green' : 'red'};">สถานะ: ${item.status}</p>
            <button class="copy-button" data-code="${item.code}">คัดลอก</button>
        `;
        return codeItemDiv;
    }

    // --- ฟังก์ชันสำหรับตรวจสอบโค้ด (เหมือนเดิม) ---
    const checkCodeInput = document.getElementById('checkCodeInput');
    const checkCodeButton = document.getElementById('checkCodeButton');
    const checkMessageDisplay = document.getElementById('checkMessage');

    checkCodeButton.addEventListener('click', () => {
        const inputCode = checkCodeInput.value.trim();
        if (inputCode === "") {
            checkMessageDisplay.textContent = "กรุณาใส่โค้ดที่ต้องการตรวจสอบ!";
            checkMessageDisplay.style.color = "orange";
            checkMessageDisplay.style.backgroundColor = '#fffacd';
            checkMessageDisplay.style.border = '1px solid #ff8c00';
            return;
        }

        if (!currentMapData) {
            checkMessageDisplay.textContent = "กรุณาเลือกแมพจากเมนูด้านซ้ายก่อนทำการตรวจสอบโค้ด!";
            checkMessageDisplay.style.color = "red";
            checkMessageDisplay.style.backgroundColor = '#ffe6e6';
            checkMessageDisplay.style.border = '1px solid #cc0000';
            return;
        }

        const foundCode = currentMapData.codes.find(item => item.code.toLowerCase() === inputCode.toLowerCase());

        if (foundCode) {
            checkMessageDisplay.innerHTML = `
                โค้ด: <strong>${foundCode.code}</strong><br>
                รางวัล: ${foundCode.reward}<br>
                สถานะ: <span style="color: ${foundCode.status === 'Active' ? 'green' : 'red'}; font-weight: bold;">${foundCode.status}</span>
            `;
            checkMessageDisplay.style.color = "initial";
            checkMessageDisplay.style.backgroundColor = foundCode.status === 'Active' ? '#e6ffe6' : '#ffe6e6';
            checkMessageDisplay.style.border = foundCode.status === 'Active' ? '1px solid #00cc00' : '1px solid #cc0000';
        } else {
            checkMessageDisplay.textContent = `ไม่พบโค้ด "${inputCode}" นี้ในระบบของ ${currentMapData.name}`;
            checkMessageDisplay.style.color = "red";
            checkMessageDisplay.style.backgroundColor = '#ffe6e6';
            checkMessageDisplay.style.border = '1px solid #cc0000';
        }
        checkCodeInput.value = '';
    });

    // --- จัดการการนำทาง (Navigation) ---
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = item.dataset.page;
            
            if (window.location.hash.substring(1) !== pageId) {
                history.pushState(null, '', `#${pageId}`);
                showPage(pageId);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // ตรวจสอบ URL เมื่อโหลดหน้าครั้งแรก (รองรับการ Refresh หรือ Bookmark)
    window.addEventListener('popstate', () => {
        const initialPage = window.location.hash.substring(1) || 'home';
        showPage(initialPage);
    });

    // โหลดหน้าเริ่มต้น
    const initialPage = window.location.hash.substring(1) || 'home';
    showPage(initialPage);
});
