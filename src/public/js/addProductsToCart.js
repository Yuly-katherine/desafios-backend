addProduct = async (pid) => {
  fetch(`/api/carts`, {
    method: "post",
  })
    .then((result) => result.json())
    .then( (result) => {
      if (result.status === "error") return alert(result.error)
      return result.payload._id
      })
    .then(cid => fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "post",
    })
    )
    .then((result) => result.json())
    .then( (result) =>{
      if (result.status === "error") return alert(result.error)
      alert("El producto fue agregado al carrito")
    })
    
};
