
import '../App.css';
import './inicio.css';

const menuItems = [
  {
    name: "Hombre", 
    query: "men-clothing",
    columns: [
      {
        title: "Casual",
        items: [
          { name: "Camisas", query: "men-casual-shirt" },
          { name: "pantalon", query: "men-casual-pants" },
          { name: "gorras", query: "men-casual-cap" }
        ],
      },
      {
        title: "Deporte",
        active: true,
        items: [
          { name: "Basketball", query: "men-basketball-clothing" },
          { name: "Futbol", query: "men-soccer-clothing" },
          { name: "Running", query: "men-running-clothing" }
        ],
      },
      {
        title: "Formal",
        items: [
          { name: "Ternos", query: "men-suits" },
          { name: "Pantalon ", query: "men-formal-pants" },
          { name: "Conjuntos", query: "men-formal-wear" }
        ],
      },
    ],
    products: ["Basketball", "Football", "Running"],
  },
  {
    name: "Mujeres",
    query: "women-clothing",
    columns: [
      {
        title: "Tendencias",
        items: [
          { name: "Blusas", query: "women-blouse" },
          { name: "tops", query: "women-top" },
          { name: "shorts", query: "women-shorts" },
          { name: "moda", query: "women-fashion" }
        ],
      },
      {
        title: "Casual",
        active: true,
        items: [
          { name: "Vestidos", query: "women-casual-dress" },
          { name: "Calzado", query: "women-shoes" },
          { name: "Casual", query: "women-casual-clothing" }
        ],
      },
    ],
    products: ["Running", "Training", "Casual"]
  },
  {
    name: "Kids",
    query: "kids-clothing",
    columns: [
      {
        title: "Featured",
        items: [
          { name: "New Kids", query: "kids-new-clothing" },
          { name: "School Shoes", query: "kids-school-shoes" },
          { name: "Sports", query: "kids-sportswear" },
          { name: "Offers", query: "kids-clothes-sale" }
        ],
      },
      {
        title: "Shoes",
        active: true,
        items: [
          { name: "Boys Shoes", query: "boys-shoes" },
          { name: "Girls Shoes", query: "girls-shoes" },
          { name: "Running", query: "kids-running-shoes" },
          { name: "All Kids Shoes", query: "kids-shoes" }
        ],
      },
      {
        title: "Clothing",
        items: [
          { name: "T-Shirts", query: "kids-tshirt" },
          { name: "Shorts", query: "kids-shorts" },
          { name: "Hoodies", query: "kids-hoodie" },
          { name: "Tracksuits", query: "kids-tracksuit" }
        ],
      },
    ],
    products: ["Boys", "Girls", "Running", "All Kids"],
  },
  {
    name: "Customize",
    query: "minimalist-apparel",
    columns: [
      {
        title: "Create",
        items: [
          { name: "Design Your Shoe", query: "custom-sneakers-design" },
          { name: "Choose Colors", query: "sneakers-colors" },
          { name: "Add Name", query: "custom-shoes" },
          { name: "Preview", query: "sneakers-template" }
        ],
      },
      {
        title: "Popular",
        active: true,
        items: [
          { name: "Custom Sneakers", query: "custom-sneakers" },
          { name: "Custom Football", query: "custom-soccer-shoes" },
          { name: "Custom Running", query: "custom-running-shoes" }
        ],
      },
      {
        title: "Help",
        items: [
          { name: "How It Works", query: "shoemaker-craft" },
          { name: "Size Guide", query: "shoes-size" },
          { name: "Delivery Time", query: "shipping-logistics" }
        ],
      },
    ],
    products: ["Sneakers", "Football", "Running", "Custom"],
  },
  {
    name: "Sale",
    query: "clothes-sale",
    columns: [
      {
        title: "Offers",
        items: [
          { name: "Last Chance", query: "clothes-clearance" },
          { name: "Discount Shoes", query: "shoes-sale" },
          { name: "Discount Clothing", query: "apparel-sale" },
          { name: "Outlet", query: "clothing-outlet" }
        ],
      },
      {
        title: "Categories",
        active: true,
        items: [
          { name: "Men Sale", query: "men-clothes-sale" },
          { name: "Women Sale", query: "women-clothes-sale" },
          { name: "Kids Sale", query: "kids-clothes-sale" },
          { name: "All Sale", query: "clothing-discounts" }
        ],
      },
      {
        title: "Trending",
        items: [
          { name: "Under $50", query: "cheap-minimalist-clothing" },
          { name: "Best Deals", query: "clothing-offers" },
          { name: "Limited Time", query: "flash-sale-clothes" }
        ],
      },
    ],
    products: ["Men Sale", "Women Sale", "Kids Sale", "All Sale"],
  },
];
const MenuBar = ({ setCategoria }) => {
  return (
    <header className="navbar">

      <div className="nav-content">
        <div className="logo">
          <span className="logo-icon">◢</span>
          <span>Jenna Moda</span>
        </div>

        <nav className="nav-menu">
          {menuItems.map((menu) => (
            <div className="nav-item" key={menu.name}>
              <span onClick={() => setCategoria(menu.query
              )}>
                {menu.name}
              </span>

              <div className="mega-menu">
                {menu.columns.map((column) => (
                  <div className="mega-column" key={column.title}>
                    <h3 className={column.active ? "red-title" : ""}>
                      {column.title}
                    </h3>

                    {column.items.map((item) => (
                      <p key={item.name} onClick={() => setCategoria(item.query)}>
                        {item.name}
                      </p>
                    ))}
                  </div>
                ))}

                <div className="mega-products">
                  <div className="products-header">
                    <h3>Shoes</h3>
                    <span>View all</span>
                  </div>

                  <div className="product-list">
                    {menu.products.map((product) => (
                      <div className="product-card" key={product}>
                        <div className="product-img">👟</div>
                        <p>{product}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search" />
          </div>

          <span className="icon">♥</span>
          <span className="icon">🛒</span>
          <a className="login-nav-button" href="/login" target="_blank" rel="noreferrer">
            Login
          </a>
          
        </div>
      </div>
    </header>
  );
};



export default MenuBar;
