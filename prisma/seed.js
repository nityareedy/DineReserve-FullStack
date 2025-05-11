import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashedpassword123",
        role: "User",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "hashedpassword123",
        role: "User",
      },
    }),
    prisma.user.create({
      data: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        password: "hashedpassword123",
        role: "User",
      },
    }),
    prisma.user.create({
      data: {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        password: "hashedpassword123",
        role: "User",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        password: "hashedpassword123",
        role: "User",
      },
    }),
  ]);

  // Seed Business Owners
  const businessOwners = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Williams",
        email: "bob.williams@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Clark",
        email: "david.clark@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ella Martinez",
        email: "ella.martinez@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Frank Thomas",
        email: "frank.thomas@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Grace Lee",
        email: "grace.lee@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Henry Wilson",
        email: "henry.wilson@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Isabelle Scott",
        email: "isabelle.scott@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jack Taylor",
        email: "jack.taylor@example.com",
        password: "hashedpassword123",
        role: "BusinessOwner",
      },
    }),
  ]);

  // Seed Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "hashedpassword123",
      role: "Admin",
    },
  });

  // Seed Restaurants
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: "Pasta Palace",
        description: "A cozy Italian restaurant specializing in fresh pasta.",
        address: "123 Main St, Springfield",
        zipcode: "12345",
        cuisine: "Italian",
        priceRange: "Medium",
        ratings: 4.5,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[0].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Burger Haven",
        description: "A casual spot serving the best burgers and fries in town.",
        address: "789 Oak St, Springfield",
        zipcode: "67890",
        cuisine: "American",
        priceRange: "Low",
        ratings: 4.3,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[1].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Taco Fiesta",
        description: "Authentic Mexican tacos and margaritas in a vibrant atmosphere.",
        address: "321 Pine St, Springfield",
        zipcode: "67890",
        cuisine: "Mexican",
        priceRange: "Medium",
        ratings: 4.6,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[2].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Sushi Delight",
        description: "Fresh and tasty sushi rolls made with the finest ingredients.",
        address: "555 Maple Ave, Springfield",
        zipcode: "54321",
        cuisine: "Japanese",
        priceRange: "High",
        ratings: 4.7,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[3].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "BBQ Bliss",
        description: "The ultimate BBQ experience with smoked meats and sides.",
        address: "987 Elm St, Springfield",
        zipcode: "11223",
        cuisine: "BBQ",
        priceRange: "Medium",
        ratings: 4.2,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[4].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Café Corner",
        description: "A friendly café with fresh pastries and premium coffee.",
        address: "147 Oak Ave, Springfield",
        zipcode: "33445",
        cuisine: "Cafe",
        priceRange: "Low",
        ratings: 4.1,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[5].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Steakhouse Supreme",
        description: "Fine dining steakhouse with premium cuts and wine selection.",
        address: "265 Chestnut St, Springfield",
        zipcode: "22334",
        cuisine: "Steakhouse",
        priceRange: "High",
        ratings: 4.8,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[6].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Veggie Paradise",
        description: "A plant-based restaurant serving a variety of vegan dishes.",
        address: "112 Oak Street, Springfield",
        zipcode: "65432",
        cuisine: "Vegan",
        priceRange: "Medium",
        ratings: 4.4,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[7].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Pizza Planet",
        description: "Pizza made fresh with unique toppings and family recipes.",
        address: "99 Pine Blvd, Springfield",
        zipcode: "12367",
        cuisine: "Italian",
        priceRange: "Low",
        ratings: 4.3,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[8].id,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Ramen Retreat",
        description: "A place to enjoy traditional and modern ramen dishes.",
        address: "201 Maple Rd, Springfield",
        zipcode: "54321",
        cuisine: "Japanese",
        priceRange: "Medium",
        ratings: 4.5,
        imageUrl: "https://res.cloudinary.com/dhbyhyzld/image/upload/v1732700635/rest_k4hjaf.jpg",
        ownerId: businessOwners[9].id,
      },
    }),
  ]);

  // Seed Reviews for each restaurant
  for (const restaurant of restaurants) {
    await prisma.review.createMany({
      data: [
        {
          content: "Amazing food, great service!",
          rating: 5,
          userId: users[0].id,
          restaurantId: restaurant.id,
        },
        {
          content: "Good experience overall, will come back.",
          rating: 4,
          userId: users[1].id,
          restaurantId: restaurant.id,
        },
        {
          content: "Not bad, but could improve.",
          rating: 3,
          userId: users[2].id,
          restaurantId: restaurant.id,
        },
      ],
    });
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });