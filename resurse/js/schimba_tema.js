window.addEventListener("DOMContentLoaded", function(){
document.getElementById("theme-button").onclick= function(){
    if(document.body.classList.contains("light")){
        document.body.classList.remove("light")
        localStorage.removeItem("tema");
    }
    else{
        document.body.classList.add("light")
        localStorage.setItem("tema","light");
    }
}
});