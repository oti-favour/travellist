import { useState } from "react";
import "./index.css";

function App() {
  const [items, setItems] = useState([]);

  // Add items to the list
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  // Delete an item by its id
  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // Toggle packed status for an item
  function handlePackedItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form handleAddItems={handleAddItems} />
      <PackingList
        items={items}
        handleDeleteItems={handleDeleteItems}
        handlePackedItems={handlePackedItems} // Renamed to match
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🏝️ FAR AWAY 💼</h1>;
}

function Form({ handleAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };

    handleAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, handleDeleteItems, handlePackedItems }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            handleDeleteItems={handleDeleteItems}
            handlePackedItems={handlePackedItems} // Renamed to match
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by Description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button> Clear List </button>
      </div>
    </div>
  );
}

function Item({ item, handleDeleteItems, handlePackedItems }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed} // Fix: use "checked" instead of "value"
        onChange={() => handlePackedItems(item.id)} // Correct event handler
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => handleDeleteItems(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding items to your list</em>
      </p>
    );
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentagePacked =
    totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

  return (
    <footer className="stats">
      <em>
        {percentagePacked === 100
          ? "You have everything! Ready to go"
          : `You have ${totalItems} items on your list, and you have already packed
        ${packedItems} (${Math.round(percentagePacked)}%`}
        )
      </em>
    </footer>
  );
}

export default App;
