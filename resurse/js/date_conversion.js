//date conversion

const months = ["Ianuarie", "Februarie", 
                "Martie", "Aprilie", "Mai", 
                "Iunie", "Iulie", "August", 
                "Septembrie", "Octombrie", "Noiembrie", 
                "Decembrie"]
const weekDays = ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"]

for(let timeEl of document.getElementsByTagName("time")){
    const date = new Date(timeEl.getAttribute("datetime"))
    timeEl.textContent = date.getDate() + " " + 
                        months[date.getMonth()] + " " + 
                        date.getFullYear() + " (" + 
                        weekDays[date.getDay()] + ")"
}

