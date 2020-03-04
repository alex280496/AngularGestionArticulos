class coche{
    constructor(modelo, velocidad,precio){
        this.modelo=modelo;
        this.velocidad=velocidad;
        this.precio=precio;

    }
    aumentarvelocidad(){
        this.velocidad +=20;
    }
    reducirveocidad(){
        this.velocidad=1;
    }
} 
class bus extends coche{
    constructor(modelo,velocidad,precio){
        super(modelo,velocidad,precio);
        this.altura=5;
    }
    mostraraltura(){
        return 'la altura es'+ this.altura;
    }
}
var bus1=new bus('FORD',45,56000);
console.log(bus1.mostraraltura());

var coche1=new coche('Mazda',50,2450);
var coche2=new coche('Nissan',10,1450);
document.write("<h1> Velocidad:"+coche1.velocidad +"</h1>");
coche1.aumentarvelocidad();
document.write("<h1> Velocidad"+ coche1.velocidad+"</h1>");
