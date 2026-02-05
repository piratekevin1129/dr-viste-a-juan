var instrucciones_data = [{
    title:'Abre un casillero',
    text:'Haz clic en cualquiera de los casilleros para abrirlo.',
    icon:'2',
    value:'Continuar',
    ref:null,
    orientation:'right'
},{
    title:'Arrastra',
    text:'Haz clic sostenido sobre el elemento de protección personal y arrástralo hacia el personaje.',
    icon:'2',
    value:'Continuar',
    ref:'personaje',
    orientation:'right'
},{
    title:'Comprobar',
    text:'Haz clic en el botón comprobar para verificar que todos los elementos de protección personal esten puestos correctamente',
    icon:'2',
    value:'Entendido',
    ref:'ref-comprobar',
    orientation:'top'
}]

var current_instruccion = 0


function setInstrucciones(){
    prepareInstruccion()
    
    //getE('contenedor').className = "contenedor-blur-on"
    getE('instruccion').className = "instruccion-on"
}

function prepareInstruccion(in_game = false,data = null){
    if(in_game){
        getE('instruccion-title').innerHTML = data.title
        getE('instruccion-text').innerHTML = data.text
        getE('instruccion-btn').innerHTML = '<span>'+data.label+'</span>'
        getE('instruccion-btn').setAttribute('onclick','cerrarInstruccion()')
    }else{
        getE('instruccion-title').innerHTML = instrucciones_data[current_instruccion].title
        getE('instruccion-text').innerHTML = instrucciones_data[current_instruccion].text
        getE('instruccion-btn').innerHTML = '<span>'+instrucciones_data[current_instruccion].value+'</span>'
        getE('instruccion-btn').setAttribute('onclick','nextInstruccion()')
    }

    //ref
    var rect_box = getE('instruccion-box').getBoundingClientRect()
    var left_box = 0
    var top_box = 0

    if(!in_game&&instrucciones_data[current_instruccion].ref!=null){
        var rect_ref = getE(instrucciones_data[current_instruccion].ref).getBoundingClientRect()
        var wl = (rect_ref.left - 20)
        if(wl<0){
            wl = 0
        }
        var wr = (window.innerWidth - ((rect_ref.width + 20) + rect_ref.left))
        if(wr<0){
            wr = 0
        }
        var ht = (rect_ref.top - 20)
        if(ht<0){
            ht = 0
        }
        var hb = (window.innerHeight - (rect_ref.top + rect_ref.height + 20))
        if(hb<0){
            hb = 0
        }

        //console.log(rect_ref.width,rect_ref.left,rect_ref.height,rect_ref.top)
        getE('instruccion-back-mask').style.borderLeftWidth = parseInt(wl)+'px'
        getE('instruccion-back-mask').style.borderRightWidth = parseInt(wr)+'px'
        getE('instruccion-back-mask').style.borderTopWidth = parseInt(ht)+'px'
        getE('instruccion-back-mask').style.borderBottomWidth = parseInt(hb)+'px'
        
        if(instrucciones_data[current_instruccion].orientation=='top'){
            left_box = (rect_ref.left + (rect_ref.width / 2)) - (rect_box.width / 2)
            if((left_box + rect_box.width) > window.innerWidth){
                left_box = (window.innerWidth - (rect_box.width + 10))
            }
            top_box = (rect_ref.top - (rect_box.height + 10))
        }else if(instrucciones_data[current_instruccion].orientation=='right'){
            left_box = (rect_ref.left + rect_ref.width + 10)
            top_box = (rect_ref.top + (rect_ref.height / 2)) - (rect_box.height / 2)
        }else if(instrucciones_data[current_instruccion].orientation=='left'){
            left_box = (rect_ref.left - (rect_box.width + 10))
            top_box = (rect_ref.top + (rect_ref.height / 2)) - (rect_box.height / 2)
        }

    }else{
        var w2 = (rect_box.left + (rect_box.width / 2))
        var h2 = (rect_box.top + (rect_box.height / 2))
        getE('instruccion-back-mask').style.borderLeftWidth = w2+'px'
        getE('instruccion-back-mask').style.borderRightWidth = w2+'px'
        getE('instruccion-back-mask').style.borderTopWidth = h2+'px'
        getE('instruccion-back-mask').style.borderBottomWidth = h2+'px'

        left_box = (window.innerWidth / 2) - (rect_box.width / 2)
        top_box = (window.innerHeight / 2) - (rect_box.height / 2)
    }

    getE('instruccion-box').style.left = left_box+'px'
    getE('instruccion-box').style.top = top_box+'px'
}

function nextInstruccion(){
    if(current_instruccion==(instrucciones_data.length-1)){
        getE('instruccion').className = "instruccion-off"
        
        getE('comprobar-btn').setAttribute('onclick','comprobarPersonaje()')
        click_mp3.play()
    }else{
        current_instruccion++
        prepareInstruccion()
        boton_mp3.play()
    }
}

function setInstruccion2(data){
    prepareInstruccion(true,data)
    getE('instruccion').className = "instruccion-on"
}

function cerrarInstruccion(){
    getE('instruccion').className = "instruccion-off"
    click_mp3.play()
    getE("personaje-label").className = "personaje-label-off"
}