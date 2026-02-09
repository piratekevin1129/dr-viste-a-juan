//0 images + 4 audios
var total_audios = 8
var total_images = 0
var total_files = 0;
for(i = 0;i<elementos_data.length;i++){
    if(elementos_data[i].img!=""){
        total_files++
    }
    if(elementos_data[i].img2!=""){
        total_files++
    }
    if(elementos_data[i].audio!=null){
        total_files++
    }
}

var total_files = (total_audios + total_images + total_files)

var files_loaded = 0
function updateLoader(){
    files_loaded++
    var loader_width = Math.round((files_loaded*100)/total_files)

    getE('loader-bar2').style.width = loader_width+'%'
}

var audios_loaded = 0
function checkAudios(l){
    if(l){updateLoader()}
    
    audios_loaded++
    if(audios_loaded==total_audios){
        comenzarJuego()
    }
}

function unsetLoader(){
    getE('loader').className = 'loader-off'
}