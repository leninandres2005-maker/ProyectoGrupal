const menuItems = [
  {
    name: "Hombres",
    columns: [
      {
        title: "Casual",
        items: ["Camisas", "pantalon", "gorras"],
      },
      {
        title: "Deporte",
        active: true,
        items: ["Basketball", "Futbol", "Running"],
      },
      {
        title: "Formal",
        items: ["Ternos", "Pantalon ", "Conjuntos"],
      },
    ],
    products: ["Basketball", "Football", "Running"],
  },
  {
    name: "Mujeres",
    columns: [
      {
        title: "Tendencias",
        items: ["Blusas", "tops", "shorts", "moda"],
      },
      {
        title: "Casual",
        active: true,
        items: ["Vestidos", "Calzado", "Casual"],
      },
     
    ],
    products: ["Running", "Training", "Casual"]
  },
  {
    name: "Kids",
    columns: [
      {
        title: "Featured",
        items: ["New Kids", "School Shoes", "Sports", "Offers"],
      },
      {
        title: "Shoes",
        active: true,
        items: ["Boys Shoes", "Girls Shoes", "Running", "All Kids Shoes"],
      },
      {
        title: "Clothing",
        items: ["T-Shirts", "Shorts", "Hoodies", "Tracksuits"],
      },
    ],
    products: ["Boys", "Girls", "Running", "All Kids"],
  },
  {
    name: "Customize",
    columns: [
      {
        title: "Create",
        items: ["Design Your Shoe", "Choose Colors", "Add Name", "Preview"],
      },
      {
        title: "Popular",
        active: true,
        items: ["Custom Sneakers", "Custom Football", "Custom Running"],
      },
      {
        title: "Help",
        items: ["How It Works", "Size Guide", "Delivery Time"],
      },
    ],
    products: ["Sneakers", "Football", "Running", "Custom"],
  },
  {
    name: "Sale",
    columns: [
      {
        title: "Offers",
        items: ["Last Chance", "Discount Shoes", "Discount Clothing", "Outlet"],
      },
      {
        title: "Categories",
        active: true,
        items: ["Men Sale", "Women Sale", "Kids Sale", "All Sale"],
      },
      {
        title: "Trending",
        items: ["Under $50", "Best Deals", "Limited Time"],
      },
    ],
    products: ["Men Sale", "Women Sale", "Kids Sale", "All Sale"],
  },
];

const MenuBar = () => {
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
              {menu.name}

              <div className="mega-menu">
                {menu.columns.map((column) => (
                  <div className="mega-column" key={column.title}>
                    <h3 className={column.active ? "red-title" : ""}>
                      {column.title}
                    </h3>

                    {column.items.map((item) => (
                      <p key={item}>{item}</p>
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
        </div>
      </div>
    </header>
  );
};



export default MenuBar;