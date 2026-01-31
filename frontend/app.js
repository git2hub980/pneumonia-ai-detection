function goToStep2() {
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
}

function goToStep3() {
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");
}

function startFlashTest() {
    alert("Place your finger on camera & flash.");
    // Later: camera + PPG logic
}

function startIMUTest() {
    alert("Place phone on stomach for 30 seconds.");
    // Later: motion sensor logic
}

function submitAll() {
    document.getElementById("result").innerText =
        "Data submitted. AI is analyzing your risk...";
}
