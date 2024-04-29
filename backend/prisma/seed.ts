import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

type modelName = Prisma.ModelName;
type getCreateMethodData<K extends Uncapitalize<modelName>> = NonNullable<
    Parameters<PrismaClient[K]['createMany']>[0]
>['data'];
async function main() {
    await prisma.$connect();
    await user();
    await productCategory();
    await product();
    await productInformation();
    await review();
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function productCategory() {
    const category: string[] = [
        'kamen',
        'udeng',
        'saput',
        'sandal wanita',
        'sandal pria',
    ];
    await prisma.productCategory.createMany({
        data: category.map((category) => {
            return {
                name: category,
            };
        }),
    });
}

async function product() {
    const category = (
        await prisma.productCategory.findMany({
            select: {
                name: true,
            },
        })
    ).map((category) => {
        return category.name;
    });
    type data = getCreateMethodData<'product'>;
    const data: data = Array.from(
        {
            length: getRandomInt(12, 20),
        },
        () => {
            return {
                productCategory: category[getRandomInt(0, category.length - 1)],
            };
        }
    );
    await prisma.product.createMany({
        data: data,
    });
}

async function productInformation() {
    const product: getCreateMethodData<'productInformation'> = (
        await prisma.product.findMany()
    ).map((product) => {
        return {
            productId: product.id,
            name: faker.commerce.productName(),
            price: parseInt(faker.commerce.price({ min: 5000, max: 120000 })),
            description: faker.lorem.lines(5),
        };
    });
    await prisma.productInformation.createMany({
        data: product,
    });
}

async function user() {
    console.log(process.env.BCRYPT_SALT);
    await prisma.user.createMany({
        data: await Promise.all(
            Array.from({ length: getRandomInt(10, 12) }, async () => {
                return {
                    email: faker.internet.email(),
                    name: faker.internet.userName(),
                    password: await bcrypt.hash(
                        faker.internet.password(),
                        parseInt(process.env.BCRYPT_SALT as string)
                    ),
                };
            })
        ),
    });
}

async function review() {
    const product = (
        await prisma.product.findMany({
            take: getRandomInt(10, 12),
        })
    ).map((e) => e.id);
    const user = (
        await prisma.user.findMany({
            take: getRandomInt(7, 10),
        })
    ).map((e) => e.id);

    const rating = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    for (let i = 0; i < product.length; i++) {
        await prisma.review.createMany({
            data: user.map((id) => {
                return {
                    userId: id,
                    productId: product[i],
                    rating: rating[getRandomInt(0, rating.length - 1)],
                    text: faker.lorem.lines(),
                };
            }),
        });
    }
}

main();
