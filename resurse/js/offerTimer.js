const endDate = new Date(extractedDate)
const timerElement = document.getElementById("remaining-time")

const interval = setInterval(function (){
    const currentMoment = new Date()
    const delta = endDate - currentMoment

    if(delta <= 0){
        clearInterval(interval)
        location.reload()
        return
    }

    const hours = Math.floor(delta / 3600000);
    const minutes = Math.floor((delta % 3600000) / 60000);
    const seconds = Math.floor((delta % 60000) / 1000);

    timerElement.textContent = `Timp ramas: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerElement.classList.toggle("timer-urgent", delta < 11000);
}, 1000)