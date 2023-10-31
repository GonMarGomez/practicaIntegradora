export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }
    createProduct = async (data) => {
        let result = await this.dao.createProduct(data);
        return result
    }
    paginateProducts = async (filter, options) => {
        let result = await this.dao.paginateProducts(filter, options);
        return result;
    }
    getById = async (_id) => {
        let result = await this.dao.getProdById(_id);
        return result;
    }
    updateById = async (_id, product) => {
        try {
            const products = await this.dao.getProdById({ _id });
            let productUpdated = {};

            for (let key in products) {
                if (products[key].id == _id) {
                    products[key].title = product.title ? product.title : products[key].title;
                    products[key].description = product.description ? product.description : products[key].description;
                    products[key].price = product.price ? product.price : products[key].price;
                    products[key].code = product.code ? product.code : products[key].code;
                    products[key].stock = product.stock ? product.stock : products[key].stock;
                    products[key].category = product.category ? product.category : products[key].category;
                    products[key].thumbnails = product.thumbnails ? product.thumbnails : products[key].thumbnails;
                    if (product.status !== undefined) {
                        products[key].status = typeof product.status === 'string' ? product.status === 'true' : Boolean(product.status);
                    }

                    productUpdated = products[key];
                }
            }
            const result = await this.dao.updateProduct({ _id }, productUpdated);
            return result;
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            throw err;
        }
    }
    deleteById = async (_id) => {
        let result = await this.dao.deleteProduct(_id);
        return result;
    }
    processProducts = async (cart) => {
        const ticketDataArray = [];
        const productsAvailable = [];
        const productsNotAvailable = [];

        for (const cartItem of cart.products) {
            const productId = cartItem.product;
            const productQuantity = cartItem.quantity;
            const product = await this.dao.getProdById(productId);
            const productStock = product[0].stock;
    
            if (productStock < productQuantity) {
                console.error(`Cantidad insuficiente de producto ${product[0].title}`);
                productsNotAvailable.push(product[0].title);
                continue;
            } 

            const quantityUpdated = productStock - productQuantity;
            const modifications = { stock: quantityUpdated };
            await this.dao.updateProduct(productId, modifications);

            productsAvailable.push({
                productId,
                quantity: productQuantity,
            });

            ticketDataArray.push({
                amount: product[0].price * productQuantity,
            });
        }

        return { productsAvailable, productsNotAvailable , ticketDataArray};
    }
}