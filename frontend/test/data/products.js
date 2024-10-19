export const products = [
  {
    id: 1,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    stock: 50,
    description: "A high-end smartphone with a powerful processor and excellent camera.",
    ratings: 4.5,
    reviews: [
      { user: "Alice", comment: "Great phone, very fast.", rating: 5 },
      { user: "Bob", comment: "Good value for money.", rating: 4 }
    ],
    imageUrl: "https://example.com/images/smartphone.jpg"
  },
  {
    id: 2,
    name: "Laptop",
    category: "Electronics",
    price: 1199.99,
    stock: 30,
    description: "A lightweight laptop with a long battery life and high-resolution display.",
    ratings: 4.7,
    reviews: [
      { user: "Charlie", comment: "Perfect for work and travel.", rating: 5 },
      { user: "Dana", comment: "Battery life could be better.", rating: 4.5 }
    ],
    imageUrl: "https://example.com/images/laptop.jpg"
  },
  {
    id: 3,
    name: "Headphones",
    category: "Accessories",
    price: 199.99,
    stock: 100,
    description: "Noise-canceling headphones with superior sound quality.",
    ratings: 4.3,
    reviews: [
      { user: "Eve", comment: "Excellent sound quality.", rating: 5 },
      { user: "Frank", comment: "A bit pricey but worth it.", rating: 4 }
    ],
    imageUrl: "https://example.com/images/headphones.jpg"
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Home Appliances",
    price: 89.99,
    stock: 20,
    description: "A programmable coffee maker with a built-in grinder.",
    ratings: 4.6,
    reviews: [
      { user: "Grace", comment: "Makes great coffee.", rating: 5 },
      { user: "Hank", comment: "Easy to use and clean.", rating: 4.5 }
    ],
    imageUrl: "https://example.com/images/coffeemaker.jpg"
  },
  {
    id: 5,
    name: "Running Shoes",
    category: "Footwear",
    price: 129.99,
    stock: 75,
    description: "Comfortable running shoes with excellent grip and support.",
    ratings: 4.4,
    reviews: [
      { user: "Ivy", comment: "Very comfortable.", rating: 4.5 },
      { user: "Jack", comment: "Great for long runs.", rating: 4 }
    ],
    imageUrl: "https://example.com/images/runningshoes.jpg"
  },
  {
    PK: "MERCHANT#<MerchantId>",
    SK: "MERCHANT#<MerchantId>",
    Id: 123,
    Title: "Bicycle 123",
    Description: "123 description",
    BicycleType: "Hybrid",
    Brand: "Brand-Company C",
    Price: 500,
    Color: ["Red", "Black"],
    ProductCategory: "Bicycle",
    InStock: true,
    QuantityOnHand: null,
    RelatedItems: [
      341,
      472,
      649
    ],
    Pictures: {
      FrontView: "http://example.com/products/123_front.jpg",
      RearView: "http://example.com/products/123_rear.jpg",
      SideView: "http://example.com/products/123_left_side.jpg"
    },
    ProductReviews: {
      FiveStar: [
        "Excellent! Can't recommend it highly enough! Buy it!",
        "Do yourself a favor and buy this."
      ],
      OneStar: [
        "Terrible product! Do not buy this."
      ]
    },
    Comment: "This product sells out quickly during the summer",
    SafetyWarning: "Always wear a helmet"
  }
];
