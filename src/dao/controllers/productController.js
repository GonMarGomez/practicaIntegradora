import { productService } from "../repository/index.js";

class productController {

  async getAllProducts(queryParams) {
    try {
      const { page = 1, limit, category, sort } = queryParams;
  
      const parsedLimit = limit && !isNaN(limit) ? parseInt(limit) : 10;
  
      const options = {
        page: parseInt(page),
        limit: parsedLimit,
      };
  
      let filter = {};
  
      if (category) {
        filter.category = category;
      }
  
      const sortOptions = {};
      if (sort === 'asc') {
        sortOptions.price = 1;
      } else if (sort === 'desc') {
        sortOptions.price = -1;
      }
  
      options.sort = sortOptions;
  
      const products = await productService.paginateProducts(filter, {
        ...options,
        lean: true,
      });
  
      const totalPages = products.totalPages;
      const prevPage = products.prevPage;
      const nextPage = products.nextPage;
      const hasPrevPage = products.hasPrevPage;
      const hasNextPage = products.hasNextPage;
      const prevLink = hasPrevPage ? `/productos?page=${prevPage}&limit=${parsedLimit}&category=${category}&sort=${sort}` : null;
      const nextLink = hasNextPage ? `/productos?page=${nextPage}&limit=${parsedLimit}&category=${category}&sort=${sort}` : null;
  
      return {
        status: 'success',
        payload: products.docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'error',
        error: 'Error interno del servidor',
      };
    }
  }
  
  async getProductById(_id) {
    try {
      const product = await productService.getById({ _id }).lean();
      if (product) {
        return product;
      } else {
        console.error('Producto no encontrado');
        return null;
      }
    } catch (err) {
      console.error('Error al leer el archivo de productos:', err);
      return null;
    }
  }

  

    async createProduct(product) {
        const {title, description, code, price, stock, category, thumbnails} = product;

        if (!title || !description || !code || !price || !stock || !category) {
            return 'Error al crear el producto';
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails ?? []
        }


        try {
            const result = await productService.createProduct(newProduct)

            return 'Producto creado correctamente';
        } catch (error) {
            console.error(error.message);
            return 'Error al crear el producto';
        }
    }
    async getProducts() {
        const products = await productService.paginateProducts();
        
        if (products.length < 1) {
          return [];
        }else{
          try {
            return products;
          } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return [];
          }}
        }
    
        async getProductById(_id) {
          try {
            const product = await productService.getById({_id});
            if (product) {
              return product;
            } else {
              console.error('Producto no encontrado');
              return null;
            }
          } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return null;
          }
        }
        
    
      async updateProduct(_id, product) {
        try{
          let result = await productService.updateById(_id, product);
          return result
        }catch(err){
          console.error('Error al leer el archivo de productos:', err);
        }
      }
    
      async deleteProduct(_id) {
        try {
          const result = await productService.deleteById({_id});
          return result
        }catch (err) {
          console.error('Error al leer el archivo de productos:', err);
        }
      }
    }
    

export { productController };