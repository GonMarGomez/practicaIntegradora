export const generateProductErrorInfo = (product) => {
    return `Error al generar producto.
Falla de alguno de los siguientes datos:
    List of required properties:
    * Título: needs to be a String, received ${product.title}
    * Descripción: needs to be a String, received ${product.description}
	* Código: needs to be a Number, received ${product.code}
	* Stock: needs to be a Number, received ${product.stock}
    * Categoría: needs to be a String, received ${product.category}`;

}
