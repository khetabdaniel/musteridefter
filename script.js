// إعداد Firebase
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PROJECT_ID.firebaseio.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);

// تحقق من حالة تسجيل الدخول عند تحميل الصفحة
firebase.auth().onAuthStateChanged((user) => {
    const currentPage = window.location.pathname;

    if (user) {
        if (currentPage.includes('index.html')) {
            // إذا كان المستخدم مسجل دخولاً بالفعل انقله إلى صفحة العملاء
            window.location.href = 'customers.html';
        }
    } else {
        if (currentPage.includes('customers.html')) {
            // إذا لم يكن المستخدم مسجل دخول انقله إلى صفحة تسجيل الدخول
            window.location.href = 'index.html';
        }
    }
});

// تسجيل الدخول
if (document.getElementById('loginBtn')) {
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = 'customers.html';
            })
            .catch((error) => {
                document.getElementById('loginError').textContent = "خطأ: " + error.message;
            });
    });
}

// تسجيل الخروج
if (document.getElementById('logoutBtn')) {
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            window.location.href = 'index.html';
        });
    });
}

// إضافة عميل
if (document.getElementById('addCustomerBtn')) {
    addCustomerBtn.addEventListener('click', () => {
        const customerName = document.getElementById('customerName').value;
        const customerDebt = document.getElementById('customerDebt').value;

        if (customerName && customerDebt) {
            const userId = firebase.auth().currentUser.uid;
            firebase.database().ref('customers/' + userId).push({
                name: customerName,
                debt: customerDebt
            });

            fetchCustomers(); // تحديث القائمة
        }
    });
}

// جلب قائمة العملاء
function fetchCustomers() {
    const userId = firebase.auth().currentUser.uid;
    const customersList = document.getElementById('customersList');

    if (customersList) {
        customersList.innerHTML = '';
        firebase.database().ref('customers/' + userId).once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const customer = childSnapshot.val();
                const li = document.createElement('li');
                li.textContent = `الاسم: ${customer.name} - المديونية: ${customer.debt}`;
                customersList.appendChild(li);
            });
        });
    }
}
// تسجيل الدخول
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            loginPage.style.display = 'none';
            appPage.style.display = 'block';
            fetchCustomers();
        })
        .catch((error) => {
            loginError.textContent = "خطأ: " + error.message;
        });
});

// تسجيل الخروج
logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        appPage.style.display = 'none';
        loginPage.style.display = 'block';
    });
});

// إضافة عميل
addCustomerBtn.addEventListener('click', () => {
    const customerName = customerNameInput.value;
    const customerDebt = customerDebtInput.value;

    if (customerName && customerDebt) {
        const userId = firebase.auth().currentUser.uid; // معرف المستخدم
        firebase.database().ref('customers/' + userId).push({
            name: customerName,
            debt: customerDebt
        });
        customerNameInput.value = '';
        customerDebtInput.value = '';
        fetchCustomers();
    }
});

// جلب العملاء الخاصين بالمستخدم الحالي
function fetchCustomers() {
    const userId = firebase.auth().currentUser.uid; // معرف المستخدم
    customersList.innerHTML = ''; // مسح القائمة قبل إعادة العرض
    firebase.database().ref('customers/' + userId).once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const customer = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = `الاسم: ${customer.name} - المديونية: ${customer.debt}`;
            customersList.appendChild(li);
        });
    });
}

