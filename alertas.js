// Sweetalert
let btnVerPromos = document.getElementById("btnVerPromos");

btnVerPromos.addEventListener("click", function () {
    Swal.fire({
        title: 'No hay promos disponibles',
        text: 'Se habilitarán el mes que viene',
        icon: 'info',
        confirmButtonText: 'cerrar',
    })
})

///////////////////////////////////////////////////// FUNCIONES

let carrito = [];

function agregarProducto(evento) {
    let prodData = evento.target.parentNode;
    let nombreProducto = prodData.querySelector("h5").textContent;
    let precioProducto = prodData.querySelector("p").textContent;
    let imgProducto = prodData.parentNode.querySelector("img").src;
    let isNew = true;

    console.log("Pre Cart is:");
    console.log(JSON.stringify(carrito));

    let producto = {
        nombre: nombreProducto,
        precio: parseInt(precioProducto.slice(1)),
        img: imgProducto,
        cantidad: 1
    };

    console.log("Current Prod:");
    console.log(JSON.stringify(producto));


    console.log("Cart length: " + carrito.length);
    if (!carrito.length) {
        console.log("Cart is empty adding prod...");
        carrito.push(producto);
    } else {
        for (let i = 0; i < carrito.length; i++) {
            let currentCart = carrito[i];

            console.log("currentCart.nombre: " + JSON.stringify(currentCart.nombre) + " - producto.nombre: " + JSON.stringify(producto.nombre));

            if (currentCart.nombre == producto.nombre) {
                console.log("Same prod, sum:");
                currentCart.cantidad += 1;
                isNew = false;
            }
        }

        if (isNew) {
            console.log("Prod is new adding prod...");
            carrito.push(producto);
        }
    }

    console.log("Post Cart is:");
    console.log(JSON.stringify(carrito));

    mostrarCarrito();
}

function mostrarCarrito() {
    let tabla = document.getElementById("dataCarrito");
    tabla.innerHTML = "";

    for (let producto of carrito) {
        let fila = document.createElement("tr");
        fila.innerHTML = `
                            <div class="card mb-3" style="max-width: 540px;">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="${producto.img}" class="img-fluid rounded-start imgProd" alt="...">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                    <h4>${producto.cantidad}</h4>
                                        <h5 class="card-title">${producto.nombre}</h5>
                                        <p class="card-text"><small class="text-body-secondary">${producto.precio}</small></p>
                                        <button type="button" class="btn borrar">X</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        tabla.append(fila);
    }

    let borrar = document.querySelectorAll(".borrar");

    for (var z = 0; z < borrar.length; z++) {
        var elem = borrar[z];
        elem.onclick = function (e) {
            borrarProducto(e);
            return false;
        };
    }

    // Reprocesar carrito
    let totalCarrito = 0;
    for (let i = 0; i < carrito.length; i++) {
        let currentCart = carrito[i];

        totalCarrito += currentCart.cantidad * currentCart.precio;
    }

    let totalCarritoHtml = document.getElementById("totalCarrito");
    totalCarritoHtml.innerHTML = "$" + totalCarrito;
}

//////////////BORRAR PRODUCTO////////////////////////////////

function borrarProducto(evento) {
    console.log("Prod eliminado", evento.target.parentNode.parentNode.parentNode);
    let abuelo = evento.target.parentNode.parentNode.parentNode.parentNode;
    console.log("lo que trae es", abuelo);

    abuelo.remove();

    let nombreProductoEliminar = abuelo.querySelector("h5").textContent;

    console.log("texto del prod a eliminar", nombreProductoEliminar);

    let resultadoEliminado = carrito.filter(sacarDeCarrito(nombreProductoEliminar));
    carrito = resultadoEliminado;

    mostrarCarrito();
}

function sacarDeCarrito(nombreProductoEliminar) {
    return function (currentCarrito) {
        return currentCarrito.nombre !== nombreProductoEliminar;
    }
}

let btnVerCarrito = document.getElementById("btnVerCarrito");

btnVerCarrito.addEventListener("click", function () {
    let pedidos = document.getElementById("cartasProductos");

    if (pedidos.style.display != "none") {
        pedidos.style.display = "none";
    }
    else {
        pedidos.style.display = "block";
    }
})

/////////////////////////////////////////////////////////////////////////

let btnAgregar = document.querySelectorAll(".btnAgregar");

for (var z = 0; z < btnAgregar.length; z++) {
    var elem = btnAgregar[z];
    elem.onclick = function (e) {
        agregarProducto(e);
        return false;
    };
}
//////////////DOLAR/////////////////////////////

function getDolarValue() {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
        .then(response => response.json())
        .then(function (data) {
            if (data.hasOwnProperty("rates")) {
                console.log("Dollar rates:");
                console.log(data.rates);
                if (data.rates.hasOwnProperty("ARS")) {
                    console.log("ARS rate:");
                    console.log(data.rates.ARS);

                    let dollarContainer = document.getElementById("dollarData");
                    console.log(dollarContainer);
                    let dollarContainerP = document.createElement("p");
                    dollarContainerP.innerHTML = `La cotización del dolar hoy $${data.rates.ARS}`;
                    dollarContainer.append(dollarContainerP);
                } else {
                    console.log("ARS data not found");
                }
            } else {
                console.log("Dollar data not found");
            }
        });
}

getDolarValue();