import React from "react";

const ShopItems = ({ category }) => {
  const items = {
    newProducts: [
      { id: 1, name: "New Product 1" },
      { id: 2, name: "New Product 2" },
    ],
    shirt: [
      { id: 1, name: "Shirt 1" },
      { id: 2, name: "Shirt 2" },
    ],
    trousers: [
      { id: 1, name: "Trouser 1" },
      { id: 2, name: "Trouser 2" },
    ],
    accessory: [
      { id: 1, name: "Accessory 1" },
      { id: 2, name: "Accessory 2" },
    ],
    shoe: [
      { id: 1, name: "Shoe 1" },
      { id: 2, name: "Shoe 2" },
    ],
    sale: [
      { id: 1, name: "Sale Item 1" },
      { id: 2, name: "Sale Item 2" },
    ],
    search: [], // Assuming search results are handled differently
    cart: [], // Assuming cart items are handled differently
  };

  const categoryItems = items[category] || [];

  return (
    <div>
      <h2>{category}</h2>
      <ul>
        {categoryItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ShopItems;
