var i = 0;
var j = 0;

function getRand(minimum,maximum){
    var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    return randomnumber;
}

function loadTrack(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        console.log("error cargando")
        data.callBack(null)
    })
}

function loadImg(data){
    var img = new Image()
    if(data.extra!=null&&data.extra!=undefined){
        img.setAttribute('f',data.extra.f)
    }
    img.onload = function(){
        img.onload = null
        img.onerror = null
        data.callBack(img)
    }
    img.onerror = function(){
        img.onload = null
        img.onerror = null
        data.callBack(null)
        console.log("error loading img: "+img.src)        
    }
    img.src = data.src
}

var casillero_counter = 0
function loadCasilleros(){
    if(casillero_counter==elementos_data.length){
        //listo
        prepareCasilleros()
        comenzarJuego2()
    }else{
        loadCasillero()
    }
}

function loadCasillero(){
    //console.log("va a cargar: "+elementos_data[casillero_counter].img)
    if(elementos_data[casillero_counter].img!=""){
        loadImg({src:'./assets/images/epp/'+elementos_data[casillero_counter].img, callBack: function(data){
            elementos_data[casillero_counter].imgdata = {w:data.width,h:data.height}
            updateLoader()
            if(elementos_data[casillero_counter].img2!=""){
                loadImg({src:'./assets/images/epp/'+elementos_data[casillero_counter].img2, callBack: function(data2){
                    elementos_data[casillero_counter].imgdata2 = {w:data2.width,h:data2.height}
                    casillero_counter++
                    loadCasilleros()    
                }})            
            }else{
                casillero_counter++
                loadCasilleros()
            }
        }})
    }else{
        casillero_counter++
        loadCasilleros()
    }
}

function prepareCasilleros(){
    for(i = 0;i<elementos_data.length;i++){
        var ind = elementos_epp[i]
        var locker = document.createElement('div')
        var h = ''
        if(elementos_data[ind].img!=""){
            h+='<div class="casillero-epp">'
                h+='<img class="casillero-epp-visible" id="casillero-epp-'+elementos_data[ind].id+'" src="./assets/images/epp/'+elementos_data[ind].img+'" onmousedown="downEpp(event,'+ind+')" />'
            h+='</div>'
            h+='<div class="casillero-label">'+elementos_data[ind].label+'</div>'
        }
        h+='<div class="casillero-puerta">'
            h+='<div class="casillero-puerta-fondo"></div>'
        h+='</div>'
        h+='<div class="casillero-zona" data-status="closed" onclick="clickPuerta(this,'+elementos_data[ind].id+')"></div>'
        locker.innerHTML = h
        locker.setAttribute('class','casillero casillero-closed')
        locker.setAttribute('id','casillero-'+elementos_data[ind].id)
        locker.setAttribute('data-ind',ind)

        if(i<8){
            getE('escaparate-left').appendChild(locker)
        }else{
            getE('escaparate-right').appendChild(locker)
        }
    }

    //acomodar ancho y alto de las imagenes
    for(i = 0;i<elementos_data.length;i++){
        if(elementos_data[i].img!=""){
            var locker_div = getE('casillero-'+elementos_data[i].id)
            var image = locker_div.getElementsByTagName('img')[0]
    
            var rect_casillero = {w:locker_div.offsetWidth,h:locker_div.offsetHeight}
    
            var size = '100'
            
            if(elementos_data[i].size1=='1/3'){
                size = '30'
            }else if(elementos_data[i].size1=='1/2'){
                size = '50'
            }else if(elementos_data[i].size1=='2/3'){
                size = '65'
            }else if(elementos_data[i].size1=='4/5'){
                size = '80'
            }else if(elementos_data[i].size1=='1'){
                size = '100'
            }
    
            var alto_imagen = (rect_casillero.h * size) / 100
            var percent = (alto_imagen*100)/elementos_data[i].imgdata.h
            var ancho_imagen = (elementos_data[i].imgdata.w * percent) / 100
            
            while(ancho_imagen>rect_casillero.w){
                alto_imagen--
                percent = (alto_imagen*100)/elementos_data[i].imgdata.h
                ancho_imagen = (elementos_data[i].imgdata.w * percent) / 100
            }

            image.style.width = ancho_imagen+'px'
            image.style.height = alto_imagen+'px'
        }
    }
}

var locker_selected = null
var locker_zona_selected = null

function clickPuerta(zona,id){
    if(locker_selected!=null){
        locker_selected.className = 'casillero casillero-closed'
        locker_zona_selected.setAttribute('data-status','closed')
    }

    var locker = getE('casillero-'+id)
    var estado = zona.getAttribute("data-status")
    if(estado=='closed'){
        locker.className = 'casillero casillero-opened'
        zona.setAttribute('data-status','opened')
    }else{
        locker.className = 'casillero casillero-closed'
        zona.setAttribute('data-status','closed')
    }

    locker_selected = locker
    locker_zona_selected = zona
    abrir_mp3.currentTime = 0
    abrir_mp3.play()
}

/**************************/

var epp_w = 0
var epp_h = 0
var epp_selected = null

var personaje_data2 = [
    getE('personaje-img').offsetWidth,
    getE('personaje-img').offsetHeight
]

function downEpp(event,ind){
    epp_selected = elementos_data[ind]
    var pagex = event.pageX
    var pagey = event.pageY

    if(elementos_data[ind].img2==""){
        getE('epp-move').style.backgroundImage = 'url(./assets/images/epp/'+elementos_data[ind].img+')'
    }else{
        getE('epp-move').style.backgroundImage = 'url(./assets/images/epp/'+elementos_data[ind].img2+')'
    }

    //poner imagen oculta
    getE('casillero-epp-'+elementos_data[ind].id).className = 'casillero-epp-invisible'
    
    var porcentaje_x = (elementos_data[ind].size2[0] * 100) / personaje_data.width
    var porcentaje_y = (elementos_data[ind].size2[1] * 100) / personaje_data.height

    epp_w = (personaje_data2[0] * porcentaje_x) / 100
    epp_h = (personaje_data2[1] * porcentaje_y) / 100
    
    getE('epp-move').style.width = epp_w+'px'
    getE('epp-move').style.height = epp_h+'px'

    var left = pagex - (epp_w / 2)
    var top = pagey - (epp_h / 2)

    getE('epp-move').style.left = left+'px'
    getE('epp-move').style.top = top+'px'

    getE('epp-move').className = 'epp-move-on'

    //parte disponible
    getE('personaje-parte-'+epp_selected.correct).className = 'personaje-parte personaje-parte-active'

    window.addEventListener('mousemove',moveEpp,true)
    window.addEventListener('mouseup',upEpp,true)
    coger_mp3.play()
}

function moveEpp(event){
    var pagex = event.pageX
    var pagey = event.pageY

    var left = pagex - (epp_w / 2)
    var top = pagey - (epp_h / 2)

    getE('epp-move').style.left = left+'px'
    getE('epp-move').style.top = top+'px'
}

function upEpp(event){
    var pagex = event.pageX
    var pagey = event.pageY

    getE('epp-move').className = 'epp-move-off'
    window.removeEventListener('mousemove',moveEpp,true)
    window.removeEventListener('mouseup',upEpp,true)

    getE('personaje-parte-'+epp_selected.correct).className = 'personaje-parte'

    //colocar
    var parte_selected = getE('personaje-parte-'+epp_selected.correct)
    var rect_parte = parte_selected.getBoundingClientRect()
    var espacio_correcto = false

    if(
        pagex>=rect_parte.left&&
        pagex<=(rect_parte.left + parte_selected.offsetWidth)&&
        pagey>=rect_parte.top&&
        pagey<=(rect_parte.top + parte_selected.offsetHeight)
    ){
        espacio_correcto = true
    }
    

    if(espacio_correcto){
        //colocar epp
        var epp_nuevo = document.createElement('div')
        epp_nuevo.className = 'personaje-epp'
        epp_nuevo.style.width = epp_w+'px'
        epp_nuevo.style.height = epp_h+'px'

        var per_x = (epp_selected.size2[2] * 100) / personaje_data.width
        var per_y = (epp_selected.size2[3] * 100) / personaje_data.height
        var epp_x = (personaje_data2[0] * per_x) / 100
        var epp_y = (personaje_data2[1] * per_y) / 100

        epp_nuevo.style.left = epp_x+'px'
        epp_nuevo.style.top = epp_y+'px'

        if(epp_selected.img2!=''){
            epp_nuevo.style.backgroundImage = 'url(./assets/images/epp/'+epp_selected.img2+')'
        }else{
            epp_nuevo.style.backgroundImage = 'url(./assets/images/epp/'+epp_selected.img+')'
        }

        epp_nuevo.setAttribute('id','personaje-epp-'+epp_selected.id)
        epp_nuevo.setAttribute('data-id',epp_selected.id)
        getE('personaje-epps').appendChild(epp_nuevo)
        correcto_mp3.play()
    }else{
        getE('casillero-epp-'+epp_selected.id).className = 'casillero-epp-visible'
        incorrecto_mp3.play()
    }

    epp_selected = null
    epp_w = 0
    epp_h = 0
}

function clickVerMas(inf){
    boton_mp3.play()
    setInstruccion2({
        title:'Camisa y pantalón de dotación otorgado por la empresa, con logo de la cooperativa',
        text:'Se recomienda que los pantalones deben ser semi ajustados a la pierna y largo hasta el tobillo, preferiblemente dentro de la bota para evitar que la prenda quede suelta y con posibilidad de atrapamiento en algún punto de la moto.',
        label:'Cerrar'
    })
}

function comprobarPersonaje(){
    //mirar que hay en el personaje
    var epp_nuevos = getE('personaje-epps').getElementsByTagName('div')
    var correctos = 0;
    for(i = 0;i<epp_nuevos.length;i++){
        var data_id = Number(epp_nuevos[i].getAttribute('data-id'))
        if(elementos_correctos.indexOf(data_id)!=-1){
            correctos++;
        }
    }

    console.log(correctos)
    if(correctos==elementos_correctos.length){
        ganar_mp3.play()

        //comenzar recorrido para explicación de epp
    }else{
        setInstruccion2({
            title:'Incorrecto',
            text:'Algunos equipos de protección personal no son los correctos o están incompletos',
            label:'Intentar de nuevo'
        })
    }
}