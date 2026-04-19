const express= require("express");
const path= require("path");
const fs=require("fs");
const sass=require("sass");
const sharp=require("sharp");

app= express();
app.set("view engine", "ejs")



obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/SCSS"),
    folderCss: path.join(__dirname,"resurse/CSS"),
    folderBackup: path.join(__dirname,"backup"),
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

function jsonValidate(){
    // Cerinta A

    let file = fs.existsSync(path.join(__dirname,"resurse/json/erori.json"));
    if(file == false){
        console.log("Fisierul erori.json nu a fost gasit la calea " + path.join(__dirname,"resurse/json/erori.json") + ". Va rugam sa il creati!");
        process.exit(1);
    }

    // Cerinta B

    let content = fs.readFileSync(path.join(__dirname, "/resurse/json/erori.json")).toString("utf-8");
    let erori = obGlobal.obErori = JSON.parse(content);
    const props = ["info_erori", "cale_baza", "eroare_default"];
    missing_props = props.filter((prop) => !erori[prop]);
    if(missing_props.length > 0){
        console.error(`Eroare JSON: Lipsesc proprietățile: ${missing_props.join(", ")}`);
        process.exit(1);
    }

    //Cerinta C

    const default_error_props = ["titlu", "text", "imagine"];
    missing_props = default_error_props.filter((prop) => !erori.eroare_default[prop]);
    if(missing_props.length > 0){
        console.error(`Eroare JSON: Pentru eroare_default lipsesc proprietățile: ${missing_props.join(", ")}`);
        process.exit(1);
    }

    //Cerinta D

    const default_path = fs.existsSync(path.join(__dirname, erori.cale_baza));
    if(!default_path){
        console.log("Eroare JSON: Calea specificata in propritatea cale_baza nu exista!");
        process.exit(1);
    }

    //Cerinta E

    let hasModified = false;

    for(let error of erori.info_erori){
        let hasPhoto = fs.existsSync(path.join(__dirname, erori.cale_baza, error.imagine));
        if(hasPhoto == false){
            error.imagine = erori.eroare_default.imagine;
            hasModified = true;
            console.log(`Imagine lipsa pentru eroarea data de identificatorul ${error.identificator}`);
        }
    }

    if(hasModified){
        fs.writeFileSync(path.join(__dirname, "/resurse/json/erori.json"), JSON.stringify(erori, null, 2));
        console.log("Fisierul erori.json. Fiecare eroare are o imagine valida!");
    }

    //Cerinta F

    const objectRegex = /\{([\s\S]*?)\}/g;
    let objectMatch;

    while ((objectMatch = objectRegex.exec(content)) !== null) {
        let objectContent = objectMatch[1];
        const keyRegex = /"([^"]+)"\s*:/g;
        let keyMatch;
        let seenKeys = new Set();

        while ((keyMatch = keyRegex.exec(objectContent)) !== null) {
            let keyName = keyMatch[1];

            if (seenKeys.has(keyName)) {
                console.error(`Eroare: Propritatea "${keyName}" apare de doua ori!`);
                process.exit(1);
            }
            seenKeys.add(keyName);
        }
    }

    //Cerinta G

    erori.info_erori.sort((a, b) => {return a.identificator - b.identificator;});
    for(let i = 0; i < erori.info_erori.length - 1; i++){
        if(erori.info_erori[i].identificator == erori.info_erori[i + 1].identificator){
            console.log("Identificator duplicat!");
            Object.entries(erori.info_erori[i]).filter(([key]) => key !== "identificator").forEach(([key, value]) => {console.log(`${key}: ${value}`);});
            process.exit(1);
        }
    }
}

jsonValidate()

let vect_foldere=["temp", "logs", "backup", "fisiere_uploadate"]
for(let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), {recursive:true});
    }
}

app.use("/resurse",express.static(path.join(__dirname, "resurse")));

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"))
});


app.get(["/", "/index", "/home"], function(req, res){
    res.render("pagini/index", {
        ip: req.ip
    });
});


function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    let erori=obGlobal.obErori=JSON.parse(continut)
    let err_default=erori.eroare_default
    err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
    }

}

initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare = obGlobal.obErori.info_erori.find((elem) => elem.identificator == identificator)
    let errDefault = obGlobal.obErori.eroare_default;
    if(eroare?.status)
        res.status(eroare.identificator)
    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
    });
}

app.get("/eroare", function(req, res){
    afisareEroare(res, 404);
});

function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; // output: a.css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    let caleBackup=path.join(obGlobal.folderBackup, "resurse/CSS");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/CSS",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    
}


//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
});

app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);
    if(req.url.startsWith("/resurse") && path.extname(req.url) == ""){
        afisareEroare(res, 403);
        return;
    }
    if(path.extname(req.url) == ".ejs"){
        afisareEroare(res, 400);
        return;
    }
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if(err){
                if(err.message.includes("Failed to lookup view")){
                    afisareEroare(res, 404, "Pagina nu a fost gasita!!!");
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch(err){
        if(err.message.includes("Cannot find module")){
            afisareEroare(res, 404, "Pagina nu a fost gasita!!!");
        }
        else{
            afisareEroare(res);
        }
    }
})


app.listen(8080);
console.log("Serverul a pornit!");