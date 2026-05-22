window.addEventListener("DOMContentLoaded", function(){
    let switchTema = document.getElementById("flexSwitchCheckDefault");

    if (switchTema) {
        if (localStorage.getItem("tema") === "light") {
            switchTema.checked = true;
            document.body.classList.add("light");
        }

        switchTema.onchange = function() {
            if (this.checked) {
                document.body.classList.add("light");
                localStorage.setItem("tema", "light");
            } else {
                document.body.classList.remove("light");
                localStorage.removeItem("tema");
            }
        }
    }
});