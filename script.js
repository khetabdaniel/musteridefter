// إعداد Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd4bYLi11feBNqqc9KmBQAB_KIuN71lWU",
  authDomain: "musteridefter.firebaseapp.com",
  databaseURL: "https://musteridefter-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "musteridefter",
  storageBucket: "musteridefter.firebasestorage.app",
  messagingSenderId: "335722692919",
  appId: "1:335722692919:web:93d7c6e0656ae18d019ab2",
  measurementId: "G-3Z4Q457BD6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);

// تسجيل الدخول
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("تم تسجيل الدخول بنجاح!");
            window.location.href = "customers.html"; // انتقال لصفحة العملاء
        })
        .catch(error => alert("خطأ: " + error.message));
}

// إضافة عميل
function addCustomer() {
    const name = document.getElementById("customerName").value;
    const debt = document.getElementById("customerDebt").value;

    firebase.database().ref("customers").push({
        name: name,
        debt: debt
    });
}

// جلب العملاء من Firebase
firebase.database().ref("customers").on("value", snapshot => {
    const list = document.getElementById("customerList");
    if (list) {
        list.innerHTML = ""; // تفريغ القائمة
        snapshot.forEach(child => {
            const item = document.createElement("li");
            item.textContent = `${child.val().name}: ${child.val().debt}`;
            list.appendChild(item);
        });
    }
});