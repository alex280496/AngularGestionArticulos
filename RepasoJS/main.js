var nombre="alex";
var edad=160;
/*
var concatenar=nombre+" "+edad;
var dato=document.getElementById("datos");
dato.innerHTML=`
   <h1> soy la caja de dats</h1>
   <h2> mi nombre es: ${nombre}</h2>
   <h3> y mido: ${edad}</h3>

`;
if (edad>=165){
    dato.innerHTML +=`<h1> es uan persona alta </h1>`;
}
else{
    dato.innerHTML +=`<h1> es una persoan bajita</h1>`;
}
for(var cont=0; cont<=10; cont++){
    dato.innerHTML+=" <h2>estamos en el anio:"+ cont;
}*/
function mostrarnombre(nombre,altura){
var datospersona=`
   <h1> soy la caja de dats</h1>
   <h2> mi nombre es: ${nombre}</h2>
   <h3> y mido: ${altura}</h3>
`;
return  datospersona;
}

function imprimir(){
    var dato=document.getElementById("datos");
    dato.innerHTML=mostrarnombre("Alex Reyes",165);
}

imprimir();

var nombres=['juan','alex','pedro','joaquin'];

document.write('<h1> LISTADO DE NOMBRES </h1>')
/*for (cont=0; cont<nombres.length; cont++){
    document.write(nombres[cont]+'<br/>');
}*/
nombres.forEach(function(nombreee){
     document.write(nombreee + "<br/>");
});

var auto={
    modelo: 'Mercedes Benz',
    anio:2019,
    precio:200200,
    mostrardatos(){
        console.log(this.modelo,this.anio,this.precio);
    },
    propiedad:'Ninguna'
}

document.write('<h1>'+auto.modelo +'</h1>')
auto.mostrardatos();

var saludar = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        let saludo='holaa a todos';
        saludo=false;
        if (saludo){
            resolve(saludo);
        }
        else{
            reject('no hay saludo disponible');
        }
    }, 2000);

});
saludar.then(resultado=>{
    alert(resultado);
})
.catch(err =>{
    alert(err);
});

