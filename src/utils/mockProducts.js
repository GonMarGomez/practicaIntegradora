import { fakerDE as faker } from '@faker-js/faker';

export const generateMockProducts = () => {
    const descriptionOptions = ["Disparos en primera persona", "juego de Aventura", "Terror"];

    const randomIndex = Math.floor(Math.random() * descriptionOptions.length);
    const description = descriptionOptions[randomIndex];

    const numberOfThumbnails = faker.number.int({ min: 0, max: 3 });
    const thumbnails = [];
    for (let j = 0; j < numberOfThumbnails; j++) {
        thumbnails.push(faker.image.avatar());
    }

    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description,
        price: parseFloat(faker.commerce.price({ min: 1000, max: 10000, dec: 0 })),
        thumbnails,
        code: faker.commerce.isbn(10),
        stock: faker.number.int({ min: 0, max: 25 }),
        category: faker.commerce.productMaterial(),
        status: faker.datatype.boolean(),
    }
}
