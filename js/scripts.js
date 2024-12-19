// Selectores
const listaProductos = document.querySelector('#lista-productos');
const cupItems = document.querySelectorAll('.cup-item');
const tableCarrito = document.querySelector('#carrito tbody');
const botonEliminar = document.querySelector('#lista-carrito tbody');
const botonInicio = document.querySelector('#modal-btn');
const botonVaciar = document.querySelector('#boton-vaciar');
const totalVenta = document.querySelector('#total');
const totalVentaParcial = document.querySelector('#precioTotal');
const filtroCantidad = document.querySelector('.btn-unidades');
const botonComprarCarrito = document.querySelector('#boton-comprar-carrito');


// Valores importantes
let productosCompradosPrecioTotal = [];
let total = 0;
let carrito = [];
let acumular;
let precios = [];
let productoEliminado;

//Funciones
const suma = (a, b) => a + b;
const multiplicar = (a, b) => a * b;
const resta = (a, b) => a - b;

// jQuery
$(document).ready(() => {
	console.log("Bienvenido al sitio");
	totalVentaParcial.innerHTML = 'Agregá productos a tu carrito';
})


// Boton Cupon
cupItems.forEach(item => {
    item.addEventListener('click', function(e) {
        btnCupones(e); // Llama a la función con el evento como argumento
    });
});

function btnCupones(e) {
    // Puedes usar el evento para obtener información del elemento clicado
    const clickedElement = e.currentTarget;

    // Ejemplo de lógica: mostrar un SweetAlert
    swal({
		title: "Desconta con el siguiente QR",
		content: (() => {
			const div = document.createElement('div');
			div.innerHTML = `<img src="img/qr.png" alt="qr" style="width: 200px; margin: 10px 0;">`;
			return div;
		})(),
		dangerMode: true,
	})

    console.log(`Evento activado desde:`, clickedElement);
}

// Listeners
document.addEventListener('DOMContentLoaded', () => {
	const carritoStorage = JSON.parse(localStorage.getItem('carrito'));
	const totalStorage = JSON.parse(localStorage.getItem(`acumular`));
	carrito = carritoStorage || [];
	acumular = totalStorage || [];
	actualizarCarritoHTML();
	actualizarStorage();
	calcularTotal();
	renderProductos(productos);
});

// Agregar Producto
listaProductos.addEventListener('click', agregarProducto);
function agregarProducto(e) {
	e.preventDefault();

	if (e.target.classList.contains("agregar-carrito")) {
		const productCard = e.target.parentElement.parentElement;

		const productoAgregado = {
			imagen: productCard.querySelector('img.imagen-producto').src,
			nombre: productCard.querySelector('h4').textContent,
			precio: productCard.querySelector('.precio').textContent,
			cantidad: 1,
			id: productCard.querySelector('a').dataset.id
		}

		const existe = carrito.some(producto => producto.id === productoAgregado.id);
		crearAlerta(productoAgregado.nombre, productoAgregado.precio, 'agregado', 'agregado al');
		console.log(`${productoAgregado.nombre} se agrego al carrito por el precio de: $${productoAgregado.precio}`);
		if (existe) {
			const nuevoCarrito = carrito.map(producto => {
				if (producto.id === productoAgregado.id) {
					producto.cantidad++;
				}
				return producto;
			});
			carrito = [...nuevoCarrito];

		} else {
			carrito.push(productoAgregado);

		}

		actualizarCarritoHTML();
		calcularTotal();
		actualizarStorage();
	}
}


//Actualizar Carrito
function actualizarCarritoHTML() {
	tableCarrito.innerHTML = '';

	carrito.forEach(producto => {
		const { imagen, nombre, precio, cantidad, id } = producto;
		const row = document.createElement('tr');

		row.innerHTML = `
			<td class="sm-none">
				<img src="${imagen}" width="100%">
			</td>
			<td data-nombre="${nombre}">
				${nombre}
			</td>
			<td class="precioCarrito" data-precio="${precio}">
				<span class="ref">${precio}</span>
			</td>
			<td id="cantidadCarrito" class="text-center sm-none" data-cantidad="${cantidad}">
				${cantidad}
			</td>
			<td class="subtotal text-center sm-none">
				<span class="ref">${parseInt(cantidad) * parseInt(precio)}</span>
			</td>
            <td>
            	<a href="#" id="boton-eliminar" class="btn-primary btn" value="${id}" data-id="${id}">X</a>
            </td>
		`
		tableCarrito.appendChild(row);
	});
}

//Actualizar Storage
function actualizarStorage() {
	localStorage.setItem('carrito', JSON.stringify(carrito));
}

//Listado de Productos 
function renderProductos(productos) {
	listaProductos.innerHTML = ''
	productos.forEach(producto => {
		const html = `
        <div class="single_item">
            <div class="card" id="list-prod-sel">
                <img src="${producto.imagen}" class="imagen-producto border_top_esp u-full-width">

                <div class="info-card text-center" data-categoria="" ">
                    <h4 class="card-title">${producto.nombre}</h4>
                    <p class="card-text precio"><span class="ref">${producto.precio}</span></p>
                    <a href="#" class="prod-id u-full-width btn-primary btn agregar-carrito" data-id="${producto.id}">Agregar al Carrito</a>
                </div>
            </div>
        </div>            
        `
		listaProductos.innerHTML += html;
	});
}



// Eliminar producto
botonEliminar.addEventListener('click', eliminarProducto);
function eliminarProducto(e) {
	e.preventDefault
	if (e.target.nodeName === "A" || e.target.nodeName === "I") {
		const id = e.target.closest('a').dataset.id;
		const carritoFiltrado = carrito.filter(producto => producto.id !== id);
		carrito = [...carritoFiltrado];
		console.log("Eliminaste un producto de tu carrito")
	}
	actualizarCarritoHTML();
	actualizarStorage();
	if (carrito.length !== 0) {
		calcularTotal();
	} else {
		total = 0;
		calcularTotal();
		totalVentaParcial.innerHTML = 'Agregá productos a tu carrito';
	}
}


// Vaciar Carrito
botonVaciar.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
	swal({
		title: "Estas seguro de eliminar el carrito?",
		text: "Una vez eliminado, no podrá recuperarlo",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				swal("El carrito se elimino correctamente.", {
					icon: "success",
				});
				carrito = [];
				console.log(`No tienes productos en el carrito`);
				actualizarCarritoHTML();
				actualizarStorage();
				total = 0;
				calcularTotal();
				totalVentaParcial.innerHTML = 'Agregá productos a tu carrito';
			} else {
				swal("Tus productos siguen en el carrito!");
			}
		});
}

//Calcular total carrito
function calcularTotal() {
	console.log('Total: $' + carrito.reduce(function (acc, value) {
		return total = acc + value.precio * value.cantidad
	}, 0))
	totalVentaParcial.innerHTML = 'Total: $' + total;
};

// Comprar carrito
botonComprarCarrito.addEventListener('click', comprarProductosCarrito);
function comprarProductosCarrito(e) {
	e.preventDefault
	if (carrito.length != 0) {
		swal({
			title: "Estas seguro de comprar?",
			text: 'Tiene un total de $ ' + total,
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					swal("Su compra ha sido exitosa", {
						icon: "success",
					});
					carrito = [];
					console.log(`Su compra fue realizada con exito`);
					actualizarCarritoHTML();
					actualizarStorage();
					total = 0;
					calcularTotal();
				} else {
					swal("Elegiste no comprar los productos");
				}
			});
	} else {
		swal("No tienes productos agregados al carrito");
	}
}

// jQuery animacion
$(function () {
	$(window).on('scroll', function () {
		let scrolled = $(window).scrollTop();
		if (scrolled > 600) $('.go-top').addClass('active');
		if (scrolled < 600) $('.go-top').removeClass('active');
	});
	$('.go-top').on('click', function () {
		$("html, body").animate({ scrollTop: "0" }, 500);
	});
});

let crearAlerta = (nombre, precio, clase, texto) => {
	let nuevoAlerta = $(`
            <div class="alerta d-flex flex-column justify-self-end ${clase}">
            <div class="alerta-texto">
				<p>Producto  ${texto}  carrito: </p>
			</div>
			<div class="alertaInner">
				<p class="alerta-title"> ${nombre} </p>
				<p class="alerta-precio"><span class="ref">${precio}</span></p>
            </div>
        </div>
    `
	)
	$('.alertasContainer').append(nuevoAlerta);
	setTimeout(() => {
		$(nuevoAlerta).addClass('hide');
		setTimeout(() => {
			$(nuevoAlerta).remove()
		}, 800);
	}, 2000);
}

// Cartel bienvenida
botonInicio.addEventListener('click', btnInicio);
function btnInicio(e) {
	e.preventDefault
	swal({
		title: "Gracias por ingresar",
		text: "En cortesía te dejamos una dona. Está en una caja celeste dentro de la viajera :D",
		dangerMode: true,
	})
}

