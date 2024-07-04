
let Use = []


const url ='/createTextFile'

async function cargarItems(){
  const items = document.getElementById("cItems")
  const recursos = document.getElementById("cRecursos")
  const valores = document.getElementById("Valor")
  const capacidades = document.getElementById("Capacity")
  const usos =document.getElementById("Use")

  cargarCantidades(parseInt(items.value),parseInt(valores.value))

  const InputValores = document.createElement('div')
  InputValores.id = "valoresDiv"

  const InputUsos = document.createElement('div')
  InputUsos.id = "usosDiv"
  
  let usoLabel = document.createElement('label')
  usoLabel.textContent = `Numero de item:`
  
  let usoInput = document.createElement('input')
  usoInput.type = 'text'
  usoInput.required = true
  InputUsos.appendChild(usoLabel)
  InputUsos.appendChild(usoInput)
  InputUsos.appendChild(document.createElement('br'))
  
  for( let i = 0; i<parseInt(items.value);i++){
     // Crea una etiqueta para el nuevo input
     const newLabel = document.createElement('label')
     newLabel.textContent = `Valor item ${i+1}:`
  
     // Crea el nuevo input
     const newInput = document.createElement('input')
     newInput.type = 'text'
     newInput.required = true
    
 
     // Añade la etiqueta y el input al div
     InputValores.appendChild(newLabel)
     InputValores.appendChild(newInput)
     InputValores.appendChild(document.createElement('br'))
 
     // Añade el div al contenedor del formulario
     
     

  }
  let boton = document.createElement('button')

  boton.textContent = 'Enviar'

  boton.type = 'button'

  boton.onclick = cargarValores
  InputValores.appendChild(boton)
  valores.appendChild(InputValores)


  

  


  const InputRecursos = document.createElement('div')
  InputRecursos.id = "recursosDiv"

  for( let i = 0; i<parseInt(recursos.value);i++){
    // Crea una etiqueta para el nuevo input
    const newLabel = document.createElement('label')
    newLabel.textContent = `Capacidad recurso ${i+1}:`
    

    // Crea el nuevo input
    const newInput = document.createElement('input')
    newInput.type = 'text'
    newInput.required = true
   

    // Añade la etiqueta y el input al div
    InputRecursos.appendChild(newLabel)
    InputRecursos.appendChild(newInput)
    InputRecursos.appendChild(document.createElement('br'))
    
    const usoLabel = document.createElement('label')
     usoLabel.textContent = `Uso item ${i+1}:`
     
 
     // Crea el nuevo input
     const usoInput = document.createElement('input')
     usoInput.type = 'text'
     usoInput.required = true
     InputUsos.appendChild(usoLabel)
     InputUsos.appendChild(usoInput)
     InputUsos.appendChild(document.createElement('br'))
 }
 let boton2 = document.createElement('button')

 boton2.textContent = 'Cambiar'

 boton2.type = 'button'

 boton2.onclick = cambiarUse

 let boton3 = document.createElement('button')

 boton3.textContent = 'Enviar'

 boton3.type = 'button'

 boton3.onclick = cargarUse

 InputUsos.appendChild(boton2)
 InputUsos.appendChild(boton3)
 usos.appendChild(InputUsos)


 let boton4 = document.createElement('button')

 boton4.textContent = 'Enviar'

 boton4.type = 'button'

 boton4.onclick = cargarCapacidades
  InputRecursos.appendChild(boton4)
  capacidades.appendChild(InputRecursos)
}

async function cargarCantidades(items,recursos){
  let text = "i\n"
  for(let i =0; i<items;i++){
    text+= `${i+1}\n`
  }
  let data = {bucketName : "problemadelamochila-donotdelete-pr-jgeu0m8bmon0aw",
    itemName : "Items.csv",
    fileText : text
  }
  changeFile(url,data)
  text = "r\n"
  for(let i =0; i<recursos;i++){
    text+= `${i+1}\n`
  }
  let data2 = {bucketName : "problemadelamochila-donotdelete-pr-jgeu0m8bmon0aw",
    itemName : "Resources.csv",
    fileText : text
  }
  changeFile(url,data2)
}

async function cargarValores(){
  const formularioValores = document.getElementById("valoresDiv");

  const inputs = formularioValores.getElementsByTagName('input');
  let Text = "i,v\n"

  for (let i = 0; i < inputs.length; i++) {
      const elemento = inputs[i];
      Text = Text + `${i+1},${elemento.value}\n`
      
  }

  let data = {bucketName : "problemadelamochila-donotdelete-pr-jgeu0m8bmon0aw",
    itemName : "Value.csv",
    fileText : Text
  }

  changeFile(url,data)

}

async function cargarCapacidades() {
  const formularioValores = document.getElementById("recursosDiv");

  const inputs = formularioValores.getElementsByTagName('input');
  let Text = "r,c\n"

  for (let i = 0; i < inputs.length; i++) {
      const elemento = inputs[i];
      if (elemento.type !== 'submit') { // Ignora el botón de enviar
          Text = Text + `${i+1},${elemento.value}\n`
      }
  }

  let data = {bucketName : "problemadelamochila-donotdelete-pr-jgeu0m8bmon0aw",
    itemName : "Capacity.csv",
    fileText : Text
  }

  changeFile(url,data)

}

function cambiarUse(){
  const formularioValores = document.getElementById("usosDiv");

  const inputs = formularioValores.getElementsByTagName('input');
  const index = inputs[0].value-1
  
  let array = []
  for (let i = 1; i<inputs.length;i++){
    const elemento = inputs[i].value;
    array[i-1] = parseInt(elemento)
  }
  Use[index] = array

  console.log(Use)
}

async function cargarUse(){
  let Text = "r,i,v\n"
  for (let i = 0; i<Use.length;i++){
    for (let j = 0; j<Use[i].length;j++){
      Text += `${i+1},${j+1},${Use[i][j]}\n`
    }
  }

  let data = {bucketName : "problemadelamochila-donotdelete-pr-jgeu0m8bmon0aw",
    itemName : "Use.csv",
    fileText : Text
  }

  changeFile(url,data)
}

async function changeFile(url,data){
  try {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const responseData = response.status; 
    if(responseData === 200){
        const feed = document.getElementById("feedback").innerHTML = `${data.itemName} fue creado con exito`
    }
    console.log(responseData);
} catch (error) {
     const feed = document.getElementById("feedback").innerHTML = error
    console.error('Hubo un problema con la solicitud Fetch:', error);
}
}



