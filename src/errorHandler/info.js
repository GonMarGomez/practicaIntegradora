export const  generateProductErrorInfo = (product) => {
    console.log(product)
    return `Error al generar producto. Se obtuvieron los siguientes datos: 
	- title: ${product.title} 
	- description: ${product.description} 
	- price: ${product.price} 
	- code: ${product.code} 
	- stock: ${product.stock} 
	- category: ${product.category}`;
}
export const notFoundErrorInfo = () => {
	return `Error al buscar el pruducto: No encontrado o no se ingresaron parámetros.`
}

export const invalidNumberErrorInfo = (price) => {
	return `Debe ser un número y se recibió ${price}`;
}