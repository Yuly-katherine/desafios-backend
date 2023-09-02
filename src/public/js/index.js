const socket = io()
const container = document.getElementById("container")

document.getElementById('addNewProductBtn').addEventListener('click', (event)=> {
    event.preventDefault();
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
    }
    fetch('api/products',{
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers :{
            'content-type': 'application/json'
        }
    })
    
    .then((result) => result.json())
    .then((result) => {
    if (result.error) {
        alert("El producto no se ha agregado, ingresa todos los datos");
    } else {
      alert("El producto se ha agregado con éxito!");
      socket.emit("productList", result.payload);
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("code").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("category").value = "";
    }
    }).catch((err) => alert(`ocurrió un error: (\n ${err}`));
})

deleteProduct = async (id)=>{
    fetch(`/api/products/${id}`, {
      method: "delete",
    }) 
      .then((result) => result.json())
      .then((result) => {
        if (result.error) {
            alert("El producto no se ha eliminado");
        }else {
            alert("producto eliminado!");
            socket.emit("productList", result.payload);
        }
      })
      .catch((err) => alert(`error! (\n ${err}`));
}


  
  socket.on("updatedProducts", (data)=>{
    container.innerHTML = ""
    data.forEach( product => {
        container.innerHTML += `
                                        <li>
                                            <p><b>${product.title}</b></p>
                                            <p>${product.id}</p>
                                            <p>Precio: $ ${product.price}</p>
                                            <p>Code:${product.code}</p>
                                            <p>Descripción: ${product.description}</p>
                                            <p>Stock: ${product.stock}</p>
                                            <p>Categoría: ${product.category}</p>
                                        </li>
                                        <button class="btn btn-danger add-product" 
                                        onclick="deleteProduct({${product.id}})">Eliminar</button>
                                        `
    }) 
})
  