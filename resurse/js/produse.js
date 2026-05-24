window.onload = function() {

    //original order array
    let originalOrder = Array.from(document.getElementsByClassName("produs"))

    //disabling all the checkbox for all the unavailable products
    function updateCheckboxes(){
        let produse = document.getElementsByClassName("produs")
        for(let prod of produse){
            let canBeSelected = prod.getElementsByClassName("val-available")[0].innerHTML.trim().toLowerCase() == "da"
            prod.getElementsByClassName("select-cos")[0].disabled = !canBeSelected
        }
    }

    updateCheckboxes()

    function inputCheck(){
        let inpNumeElement = document.getElementById("inp-nume")
        let inpUserElement = document.getElementById("inp-username")
        let inpTagsElement = document.getElementById("inp-tags")

        let regexpNume = /^[a-zA-Z0-9 ]*$/
        let regexpUsername = /^[a-zA-Z0-9]*$/
        let regexpTags = /^[a-zA-Z, ]*$/

        let valid = true
        if(!regexpNume.test(inpNumeElement.value.trim())){
            inpNumeElement.classList.add("is-invalid")
            valid = false
        }
        else{
            inpNumeElement.classList.remove("is-invalid")
        }

        if(!regexpUsername.test(inpUserElement.value.trim())){
            inpUserElement.classList.add("is-invalid")
            valid = false
        } 
        else {
            inpUserElement.classList.remove("is-invalid")
        }

        if(!regexpTags.test(inpTagsElement.value.trim())){
            inpTagsElement.classList.add("is-invalid")
            valid = false
        }
        else{
            inpTagsElement.classList.remove("is-invalid")
        }

        if(!valid) return false
        else return true
    }

    function applyFilters () {

        //radio group filter

        let grupRadio = document.getElementsByName("gr_rad")

        let isAvailable
        let anyType = false;
        for(let rad of grupRadio){
            if(rad.checked){
                if(rad.value!="Toate"){
                    isAvailable = parseInt(rad.value.trim().toLowerCase())
                    console.log(isAvailable)
                } else {
                    anyType = true;
                }
                break
            }
        }

        let inpFileSize = parseFloat(document.getElementById("inp-file-size").value.trim())
        let inpUsername = document.getElementById("inp-username").value.trim().toLowerCase()
        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase()
        let inpFree = document.getElementById("inp-free").checked
        let inpTags = document.getElementById("inp-tags").value.trim().toLowerCase().split(",")
        let inpCateg = document.getElementById("inp-categorie").value.trim().toLowerCase()
        let inpElements = document.getElementById("inp-license").selectedOptions
        
        let produse = document.getElementsByClassName("produs")
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()

        let inpOptions = []
        let anySelected = false

        for(let license of inpElements)
            inpOptions.push(license.value.trim().toLowerCase())
        if(inpOptions.includes("toate"))
            anySelected = true

        if(!inputCheck()) return


         //filter
        for(let prod of produse){
            prod.style.display = "none"

            //name filter
            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let cond1 = nume.includes(inpNume)
            //file_size filter

            let fileSizeExtraction = prod.getElementsByClassName("val-file-size")[0].innerHTML.trim().split(" ")[0]
            let fileSize= parseFloat(fileSizeExtraction)
            let cond2 = fileSize > inpFileSize

            //username filter

            let usernameExtraction = prod.getElementsByClassName("val-username")[0].innerHTML.trim().toLowerCase()
            let cond3 = usernameExtraction.includes(inpUsername) || inpUsername == ""

            //availability filter

            let availability = prod.getElementsByClassName("val-available")[0].innerHTML.trim().toLowerCase() == "da" ? true : false
            let cond4 = (isAvailable == availability) || anyType

            //free content filter

            let price = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase().split(" ")[0])
            let cond5 = (price === 0) || !inpFree

            //tags filter
            let tags = prod.getElementsByClassName("val-tags")[0].innerHTML.trim().toLowerCase().split(",")
            let cond6 = inpTags.some(inpTag => tags.some(tag => tag.includes(inpTag.trim())))  || inpTags[0] === ""

            //category filter

            let cond7 = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase() == inpCateg || inpCateg == "toate"

            // //category filter
            let license = prod.getElementsByClassName("val-license")[0].innerHTML.trim().toLowerCase()
            let cond8 = inpOptions.includes(license) || anySelected

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8){
                prod.style.display = "block"
            }
        }
    }

    document.getElementById("filtrare").onclick = applyFilters
    document.getElementById("inp-nume").oninput = applyFilters

    //html value modifier
    document.getElementById("inp-file-size").oninput = function(){
        let val = this.value.trim()
        document.getElementById("infoRange").innerHTML = `Selectat: (${val}) MB`
        applyFilters()
    }

    document.getElementById("inp-username").oninput = applyFilters
    document.getElementById("i_rad1").onchange = applyFilters
    document.getElementById("i_rad2").onchange = applyFilters
    document.getElementById("i_rad3").onchange = applyFilters
    document.getElementById("inp-free").onchange = applyFilters
    document.getElementById("inp-tags").oninput = applyFilters
    document.getElementById("inp-categorie").onchange = applyFilters
    document.getElementById("inp-license").onchange = applyFilters

    //filter reset
    document.getElementById("resetare").onclick = function() {
        if(confirm("Doresti sa resetezi filtrele?")){
            document.getElementById("inp-nume").value=""
            document.getElementById("inp-file-size").value="0.5"
            document.getElementById("infoRange").innerHTML="Selectat: (0.5) MB"
            document.getElementById("inp-username").value=""
            document.getElementById("i_rad3").checked = true
            document.getElementById("inp-free").checked = false
            document.getElementById("inp-tags").value=""
            document.getElementById("inp-categorie").value="toate"
            document.getElementById("inp-license").value="toate"

            //input error reset
            document.getElementById("inp-nume").classList.remove("is-invalid")
            document.getElementById("inp-username").classList.remove("is-invalid")
            document.getElementById("inp-tags").classList.remove("is-invalid")

            let produse = document.getElementsByClassName("produs");
            for(let prod of produse){
                prod.style.display = "block"; 
            }
            

            let container = originalOrder[0].parentElement
            for(let prod of originalOrder){
                container.appendChild(prod)
            }
        }
    }

    //sort by price and name asc

    function sorteaza(semn) {
        let produse = document.getElementsByClassName("produs")
        let vProduse = Array.from(produse)
        vProduse.sort(function(a,b){
            let fileSizeA = parseFloat(a.getElementsByClassName("val-file-size")[0].innerHTML.trim())
            let fileSizeB = parseFloat(b.getElementsByClassName("val-file-size")[0].innerHTML.trim())
            let textA = a.getElementsByClassName("val-pret")[0].innerText.trim().split(" ")
            let priceA = parseFloat(textA[textA.length - 2])
            let textB = b.getElementsByClassName("val-pret")[0].innerText.trim().split(" ")
            let priceB = parseFloat(textB[textB.length - 2])
            let ratioA = priceA === 0 ? Infinity : fileSizeA / priceA
            let ratioB = priceB === 0 ? Infinity : fileSizeB / priceB
            if(ratioA == ratioB){
                let categA = a.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase()
                let categB = b.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase()
                return semn * categA.localeCompare(categB)
            }
            return semn * (ratioA - ratioB)
        })

        for (let prod of vProduse){
            prod.parentElement.appendChild(prod)
        }
    }

    //sorting buttons

    document.getElementById("sortCrescRaport").onclick = function(){
        inputCheck()
        sorteaza(1)
    }
    document.getElementById("sortDescrescRaport").onclick = function(){
        inputCheck()
        sorteaza(-1)
    }

    function selectedProdSum(){
        let produse = document.getElementsByClassName("produs")
        let sum = 0
        for(let prod of produse){
            let inCart = prod.getElementsByClassName("select-cos")[0].checked
            if(inCart && prod.style.display != "none"){
                let text = prod.getElementsByClassName("val-pret")[0].innerText.trim().split(" ")
                sum += parseFloat(text[text.length - 2])
            }       
        }
        let p = this.document.getElementById("infoSuma")
        if(!p){
            p = this.document.createElement("p")
            p.innerHTML = sum + " EUR"
            p.id="infoSuma"
            let sectiuneProduse = this.document.getElementById("produse")
            sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse)
            this.setTimeout(function(){
                let p1 = this.document.getElementById("infoSuma")
                p1.remove()
            }, 2000)
        }
        else{
            p.innerHTML = sum + " EUR"
        }
    }

    document.getElementById("pretTotalSelectie").onclick = function(){
        selectedProdSum()
    }

    window.onkeydown = function(e) {
        if(e.key == "c" && e.altKey){
            selectedProdSum()
        }
    }

}