// ============================================
// DIGITAL LEADERS - SCRIPT PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // GESTION DU PANIER (localStorage)
    // ============================================
    function getCart() {
        const cart = localStorage.getItem('digitalLeadersCart');
        return cart ? JSON.parse(cart) : [];
    }
    
    function saveCart(cart) {
        localStorage.setItem('digitalLeadersCart', JSON.stringify(cart));
    }
    
    function addToCart(productName, productPrice) {
        const cart = getCart();
        cart.push({
            name: productName,
            price: productPrice,
            date: new Date().toISOString()
        });
        saveCart(cart);
        updateCartCount();
        showToast(`${productName} ajouté au panier ! 🛒`);
    }
    
    function updateCartCount() {
        const cart = getCart();
        const countElements = document.querySelectorAll('.cart-count');
        countElements.forEach(el => {
            el.textContent = cart.length;
        });
    }
    
    // ============================================
    // TOAST
    // ============================================
    function showToast(message) {
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `<i class="fas fa-info-circle" style="margin-right: 8px;"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s ease';
                setTimeout(() => { if (toast && toast.parentNode) toast.remove(); }, 300);
            }
        }, 3000);
    }
    
    // ============================================
    // BOUTONS D'OFFRE
    // ============================================
    const btnMainOffer = document.getElementById('btnMainOffer');
    if (btnMainOffer) {
        btnMainOffer.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart('Guide Immigration', '2000 FCFA');
            showToast('🛒 Guide ajouté au panier ! Téléchargement en cours...');
        });
    }
    
    const btnSecondOffer = document.getElementById('btnSecondOffer');
    if (btnSecondOffer) {
        btnSecondOffer.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart('Guide Immigration', '2000 FCFA');
            showToast('🛒 Guide ajouté au panier ! Téléchargement en cours...');
        });
    }
    
    // ============================================
    // LIEN APERÇU
    // ============================================
    const linkPreview = document.getElementById('linkPreview');
    if (linkPreview) {
        linkPreview.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('📖 Chargement de l\'aperçu du guide...');
        });
    }
    
    // ============================================
    // PANIER DANS LA NAVIGATION
    // ============================================
    const navCart = document.getElementById('navCart');
    if (navCart) {
        navCart.addEventListener('click', function(e) {
            e.preventDefault();
            const cart = getCart();
            if (cart.length === 0) {
                showToast('Votre panier est vide 🛒');
            } else {
                const cartSummary = cart.map(item => item.name).join(', ');
                showToast(`📋 Panier : ${cartSummary} (${cart.length} article(s))`);
            }
        });
    }
    
    // ============================================
    // INITIALISATION
    // ============================================
    updateCartCount();
    
    console.log('✅ Digital Leaders - Système prêt');
    console.log('🛒 Panier :', getCart().length, 'article(s)');
    
});
// ============================================
// SYSTÈME DE PAIEMENT ET DÉBLOCAGE PDF
// ============================================

// Ajouter ce code dans le DOMContentLoaded existant

// Codes de déblocage valides (simulation)
const validUnlockCodes = [
    'DL-AUS-2025-FREE',
    'DL-CAN-2025-FREE',
    'DL-ALL-2025-FREE',
    'DL-LUX-2025-FREE',
    'DEMO-CODE-2025'
];

// État du paiement
let paymentState = {
    currentStep: 1,
    selectedMethod: null,
    isPaid: false
};

// ============================================
// GESTION DU MODAL DE PAIEMENT
// ============================================
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'flex';
        resetPaymentSteps();
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function resetPaymentSteps() {
    paymentState.currentStep = 1;
    paymentState.selectedMethod = null;
    paymentState.isPaid = false;
    updateStepDisplay();
    updatePaymentNav();
}

function updateStepDisplay() {
    // Masquer tous les contenus d'étape
    document.querySelectorAll('.payment-step-content').forEach(el => {
        el.style.display = 'none';
    });
    
    // Afficher l'étape courante
    const currentContent = document.getElementById(`step${paymentState.currentStep}Content`);
    if (currentContent) {
        currentContent.style.display = 'block';
    }
    
    // Mettre à jour les indicateurs d'étape
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.classList.remove('active', 'completed');
        if (stepNum < paymentState.currentStep) {
            step.classList.add('completed');
        } else if (stepNum === paymentState.currentStep) {
            step.classList.add('active');
        }
    });
}

function updatePaymentNav() {
    const btnBack = document.getElementById('btnPaymentBack');
    const btnNext = document.getElementById('btnPaymentNext');
    
    if (btnBack) {
        btnBack.style.display = paymentState.currentStep > 1 ? 'flex' : 'none';
    }
    
    if (btnNext) {
        if (paymentState.currentStep === 3) {
            btnNext.style.display = 'none';
        } else {
            btnNext.style.display = 'flex';
            btnNext.innerHTML = paymentState.currentStep === 1 
                ? 'Continuer <i class="fas fa-arrow-right"></i>'
                : 'J\'ai payé <i class="fas fa-check-circle"></i>';
        }
    }
}

function nextStep() {
    if (paymentState.currentStep === 1) {
        if (!paymentState.selectedMethod) {
            showToast('⚠️ Veuillez choisir un mode de paiement');
            return;
        }
        // Afficher les instructions de paiement selon la méthode
        showPaymentInstructions(paymentState.selectedMethod);
    }
    
    if (paymentState.currentStep === 2) {
        // Vérifier si l'utilisateur confirme avoir payé
        if (!confirm('Avez-vous effectué le paiement ? Vous allez recevoir un code de déblocage.')) {
            return;
        }
        paymentState.isPaid = true;
        showToast('✅ Paiement confirmé ! Vérification du code...');
    }
    
    if (paymentState.currentStep < 3) {
        paymentState.currentStep++;
        updateStepDisplay();
        updatePaymentNav();
    }
}

function prevStep() {
    if (paymentState.currentStep > 1) {
        paymentState.currentStep--;
        updateStepDisplay();
        updatePaymentNav();
    }
}

function showPaymentInstructions(method) {
    const instructionsDiv = document.getElementById('paymentInstructions');
    if (!instructionsDiv) return;
    
    const instructions = {
        'orange': `
            <h4><i class="fas fa-mobile-alt"></i> Paiement Orange Money</h4>
            <ol>
                <li>Composez <strong>#150#</strong> sur votre téléphone</li>
                <li>Sélectionnez "Paiement marchand"</li>
                <li>Entrez le numéro marchand : <strong>123456</strong></li>
                <li>Montant : <strong>2 000 FCFA</strong></li>
                <li>Validez avec votre code secret</li>
                <li>Vous recevrez un code de déblocage par SMS</li>
            </ol>
            <p style="margin-top:12px; color:#b45309;">
                <i class="fas fa-clock"></i> Le code arrive sous 2-5 minutes
            </p>
        `,
        'mtn': `
            <h4><i class="fas fa-mobile-alt"></i> Paiement MTN Mobile Money</h4>
            <ol>
                <li>Composez <strong>*126#</strong> sur votre téléphone</li>
                <li>Sélectionnez "Payer un marchand"</li>
                <li>Entrez le code marchand : <strong>789012</strong></li>
                <li>Montant : <strong>2 000 FCFA</strong></li>
                <li>Confirmez avec votre code PIN</li>
                <li>Vous recevrez un code de déblocage par SMS</li>
            </ol>
        `,
        'carte': `
            <h4><i class="fas fa-credit-card"></i> Paiement par Carte Bancaire</h4>
            <ol>
                <li>Cliquez sur le lien de paiement sécurisé</li>
                <li>Entrez vos informations de carte</li>
                <li>Montant : <strong>2 000 FCFA</strong></li>
                <li>Validez le paiement</li>
                <li>Vous recevrez un code par email</li>
            </ol>
            <a href="#" style="display:inline-block;margin-top:12px;background:#1e7e34;color:white;padding:10px 20px;border-radius:40px;text-decoration:none;">
                <i class="fas fa-lock"></i> Payer par carte (simulation)
            </a>
        `
    };
    
    instructionsDiv.innerHTML = instructions[method] || '<p>Mode de paiement non disponible</p>';
}

function verifyUnlockCode() {
    const codeInput = document.getElementById('unlockCode');
    const code = codeInput ? codeInput.value.trim() : '';
    
    if (!code) {
        showToast('⚠️ Veuillez entrer votre code de déblocage');
        return;
    }
    
    // Vérifier si le code est valide
    if (validUnlockCodes.includes(code)) {
        // Débloquer le PDF
        unlockFullPdf();
        closePaymentModal();
        showToast('🎉 Guide débloqué avec succès !');
        
        // Sauvegarder dans le localStorage
        saveUnlockedGuide();
    } else {
        showToast('❌ Code invalide. Vérifiez et réessayez.');
        if (codeInput) {
            codeInput.style.borderColor = '#ef4444';
            setTimeout(() => {
                codeInput.style.borderColor = '#e2e8f0';
            }, 2000);
        }
    }
}

function unlockFullPdf() {
    // Cacher l'aperçu restreint
    const restrictedOverlay = document.getElementById('pdfRestrictedOverlay');
    if (restrictedOverlay) {
        restrictedOverlay.style.display = 'none';
    }
    
    // Afficher le PDF complet
    const pdfFullSection = document.getElementById('pdfFullSection');
    if (pdfFullSection) {
        pdfFullSection.style.display = 'block';
        // Scroller jusqu'au PDF complet
        pdfFullSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function saveUnlockedGuide() {
    const unlockedGuides = JSON.parse(localStorage.getItem('unlockedGuides') || '[]');
    const currentGuide = window.location.pathname;
    
    if (!unlockedGuides.includes(currentGuide)) {
        unlockedGuides.push(currentGuide);
        localStorage.setItem('unlockedGuides', JSON.stringify(unlockedGuides));
    }
}

function checkIfGuideUnlocked() {
    const unlockedGuides = JSON.parse(localStorage.getItem('unlockedGuides') || '[]');
    const currentGuide = window.location.pathname;
    
    if (unlockedGuides.includes(currentGuide)) {
        unlockFullPdf();
    }
}

// ============================================
// ATTACHER LES ÉVÉNEMENTS DU MODAL
// ============================================

// Ouvrir le modal depuis les boutons d'offre
function attachPaymentEvents() {
    // Boutons "Profiter de l'offre"
    const offerButtons = document.querySelectorAll('#btnMainOffer, #btnSecondOffer, #btnUnlockPdf');
    offerButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openPaymentModal();
            });
        }
    });
    
    // Fermer le modal
    const closeBtn = document.getElementById('closePaymentModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }
    
    // Fermer en cliquant en dehors
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    }
    
    // Sélection méthode de paiement
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            paymentState.selectedMethod = this.getAttribute('data-method');
        });
    });
    
    // Navigation
    const btnNext = document.getElementById('btnPaymentNext');
    const btnBack = document.getElementById('btnPaymentBack');
    if (btnNext) btnNext.addEventListener('click', nextStep);
    if (btnBack) btnBack.addEventListener('click', prevStep);
    
    // Vérification code
    const btnVerify = document.getElementById('btnVerifyCode');
    if (btnVerify) btnVerify.addEventListener('click', verifyUnlockCode);
    
    // Touche Entrée pour le code
    const unlockInput = document.getElementById('unlockCode');
    if (unlockInput) {
        unlockInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyUnlockCode();
            }
        });
    }
}

// Vérifier si le guide est déjà débloqué au chargement
checkIfGuideUnlocked();

// Attacher les événements
attachPaymentEvents();