import "./App.css";

import {
  useState,
  useEffect,
  useRef
} from "react";

import {
  ToastContainer,
  toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";

function App() {

  // SIDEBAR REFS
  const dashboardRef =
    useRef(null);

  const productsRef =
    useRef(null);

  const customersRef =
    useRef(null);

  const salesRef =
    useRef(null);

  // LOGIN
  const [isLoggedIn,
    setIsLoggedIn] =
    useState(false);
const [darkMode,
  setDarkMode] =
  useState(false);

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");
    const [isRegister,
  setIsRegister] =
  useState(false);

  // USERS
const [users,
  setUsers] =
  useState(

    JSON.parse(
      localStorage.getItem(
        "users"
      )
    ) || [

      {
        username: "admin",
        password: "1234",
      },
    ]
  );

  // PRODUCTS
  const [products,
    setProducts] =
    useState([]);

  const [productName,
    setProductName] =
    useState("");

  const [price,
    setPrice] =
    useState("");

  const [stock,
    setStock] =
    useState("");

    const [category,
  setCategory] =
  useState("");

  // SEARCH
  const [search,
    setSearch] =
    useState("");

  // CUSTOMERS
  const [customers,
    setCustomers] =
    useState([]);

  const [customerName,
    setCustomerName] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

    const [email,
  setEmail] =
  useState("");
const [editCustomerName,
  setEditCustomerName] =
  useState("");

const [editPhone,
  setEditPhone] =
  useState("");

const [editEmail,
  setEditEmail] =
  useState("");

  // SALES
  const [sales,
    setSales] =
    useState([]);

const [selectedCustomer,
  setSelectedCustomer] =
  useState("");

  const [selectedProduct,
    setSelectedProduct] =
    useState("");

  const [quantity,
    setQuantity] =
    useState("");

  // EDIT PRODUCT
  const [editingId,
    setEditingId] =
    useState(null);

  const [editName,
    setEditName] =
    useState("");

  const [editPrice,
    setEditPrice] =
    useState("");

  const [editStock,
    setEditStock] =
    useState("");

    const [editingCustomerId,
  setEditingCustomerId] =
  useState(null);


  // FETCH PRODUCTS
  useEffect(() => {

    fetch(
      "http://127.0.0.1:8000/products"
    )
      .then((response) =>
        response.json()
      )
      .then((data) =>
        setProducts(data)
      )
      .catch((error) =>
        console.log(error)
      );

  }, []);

  // LOGIN
  const handleLogin = () => {

    const validUser =
      users.find(

        (user) =>

          user.username ===
            username &&

          user.password ===
            password
      );

    if (validUser) {

      setIsLoggedIn(true);

      toast.success(
        "Login Successful"
      );

    } else {

      toast.error(
        "Invalid Username or Password"
      );
    }
  };
  // REGISTER
const handleRegister = () => {

  if (
    !username ||
    !password
  ) {

    toast.error(
      "Enter all fields"
    );

    return;
  }

  const userExists =
    users.find(
      (user) =>
        user.username ===
        username
    );

  if (userExists) {

    toast.error(
      "User already exists"
    );

    return;
  }

  const newUser = {

    username,
    password,
  };

  const updatedUsers = [
    ...users,
    newUser,
  ];

  setUsers(updatedUsers);

  localStorage.setItem(
    "users",
    JSON.stringify(
      updatedUsers
    )
  );

  toast.success(
    "Registration Successful"
  );

  setIsRegister(false);

  setUsername("");

  setPassword("");
};

  // LOGOUT
  const handleLogout = () => {

    setIsLoggedIn(false);

    toast.success(
      "Logged Out"
    );
  };

  // ADD PRODUCT
  const addProduct = async () => {

    if (
      !productName ||
      !price ||
      !stock
    ) {

      toast.error(
        "Enter all fields"
      );

      return;
    }

    const newProduct = {

      name: productName,

      price: Number(price),

      stock: Number(stock),

      category: category,
    };

    await fetch(

      "http://127.0.0.1:8000/products",

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          newProduct
        ),
      }
    );

    fetch(
      "http://127.0.0.1:8000/products"
    )
      .then((response) =>
        response.json()
      )
      .then((data) =>
        setProducts(data)
      );

    toast.success(
      "Product Added"
    );

    setProductName("");

    setPrice("");

    setStock("");
  };

  // DELETE PRODUCT
  const deleteProduct =
    async (id) => {

      await fetch(

        `http://127.0.0.1:8000/products/${id}`,

        {
          method: "DELETE",
        }
      );

      fetch(
        "http://127.0.0.1:8000/products"
      )
        .then((response) =>
          response.json()
        )
        .then((data) =>
          setProducts(data)
        );

      toast.success(
        "Product Deleted"
      );
    };

  // START EDIT
  const startEdit = (product) => {

    setEditingId(product.id);

    setEditName(product.name);

    setEditPrice(product.price);

    setEditStock(product.stock);
  };

  // SAVE EDIT
  const saveEdit = () => {

    const updatedProducts =
      products.map((product) =>

        product.id === editingId

          ? {

              ...product,

              name: editName,

              price:
                Number(editPrice),

              stock:
                Number(editStock),
            }

          : product
      );

    setProducts(updatedProducts);

    setEditingId(null);

    toast.success(
      "Product Updated"
    );
  };

  // ADD CUSTOMER
  const addCustomer = () => {

    if (
      !customerName ||
      !phone
    ) {

      toast.error(
        "Enter all fields"
      );

      return;
    }

    const newCustomer = {

      id:
        customers.length + 1,

      name: customerName,

      phone: phone,

       email: email,
    };

    setCustomers([
      ...customers,
      newCustomer,
    ]);

    toast.success(
      "Customer Added"
    );

    setCustomerName("");

    setPhone("");

    setEmail("");
  };


  // DELETE CUSTOMER
  const deleteCustomer = (id) => {

    setCustomers(

      customers.filter(
        (customer) =>
          customer.id !== id
      )
    );

    toast.success(
      "Customer Deleted"
    );
  };

  const startCustomerEdit =
  (customer) => {

    setEditingCustomerId(
      customer.id
    );

    setEditCustomerName(
      customer.name
    );

    setEditPhone(
      customer.phone
    );

    setEditEmail(
      customer.email
    );
};
const saveCustomerEdit =
  () => {

    const updatedCustomers =
      customers.map(
        (customer) =>

          customer.id ===
          editingCustomerId

            ? {

                ...customer,

                name:
                  editCustomerName,

                phone:
                  editPhone,

                email:
                  editEmail,
              }

            : customer
      );

    setCustomers(
      updatedCustomers
    );

    setEditingCustomerId(
      null
    );

    toast.success(
      "Customer Updated"
    );
};
  // ADD SALE
 const addSale = () => {

  const product = products.find(
    (p) =>
      p.name === selectedProduct
  );

  if (!product) {

    toast.error(
      "Select Product"
    );

    return;
  }

  if (
    !selectedCustomer ||
    !quantity
  ) {

    toast.error(
      "Enter all fields"
    );

    return;
  }

  if (
    product.stock <
    Number(quantity)
  ) {

    toast.warning(
      "Low Stock"
    );

    return;
  }

  // SUBTOTAL
  const subtotal =
    product.price *
    Number(quantity);

  // GST 8%
  const gst =
    subtotal * 0.08;

  // FINAL TOTAL
  const total =
    subtotal + gst;

  // NEW SALE
  const newSale = {

    id: sales.length + 1,

    customer:
      selectedCustomer,

    product:
      product.name,

    quantity:
      Number(quantity),

    subtotal:
      subtotal,

    gst:
      gst,

    total:
      total,
  };

  // SAVE SALE
  setSales([
    ...sales,
    newSale,
  ]);

  // UPDATE STOCK
  const updatedProducts =
    products.map((p) =>

      p.id === product.id

        ? {

            ...p,

            stock:
              p.stock -
              Number(quantity),
          }

        : p
    );

  setProducts(updatedProducts);

  toast.success(
    "Sale Added"
  );

  setQuantity("");
};
  // DELETE SALE
const deleteSale = (id) => {

  setSales(

    sales.filter(
      (sale) =>
        sale.id !== id
    )
  );

  toast.success(
    "Sale Deleted"
  );
};
// DOWNLOAD INVOICE PDF
const downloadInvoice = (sale) => {

  const doc = new jsPDF();

  // DATE & TIME
  const currentDate =
    new Date().toLocaleDateString();

  const currentTime =
    new Date().toLocaleTimeString();

  // TITLE
  doc.setFontSize(22);

  doc.text(
    "MINI ERP INVOICE",
    60,
    20
  );

  // LINE
  doc.line(20, 30, 190, 30);

  // CUSTOMER
  doc.setFontSize(14);

  doc.text(
    `Customer : ${sale.customer}`,
    20,
    50
  );

  // PRODUCT
  doc.text(
    `Product : ${sale.product}`,
    20,
    65
  );

  // QUANTITY
  doc.text(
    `Quantity : ${sale.quantity}`,
    20,
    80
  );

  // SUBTOTAL
  doc.text(
    `Subtotal : Rs.${sale.subtotal}`,
    20,
    95
  );

  // GST
  doc.text(
    `GST (8%) : Rs.${sale.gst}`,
    20,
    110
  );

  // TOTAL
  doc.setFontSize(16);

  doc.text(
    `Total Amount : Rs.${sale.total}`,
    20,
    130
  );

  // DATE
  doc.setFontSize(12);

  doc.text(
    `Date : ${currentDate}`,
    20,
    155
  );

  // TIME
  doc.text(
    `Time : ${currentTime}`,
    20,
    170
  );

  // THANK YOU
  doc.setFontSize(14);

  doc.text(
    "Thank You For Shopping!",
    45,
    200
  );

  // SAVE PDF
  doc.save(
    `invoice-${sale.id}.pdf`
  );
};

 // LOGIN PAGE
if (!isLoggedIn) {

  return (

    <>
      <div className="login">

        <div className="login-box">

          <h1>
            Mini ERP
          </h1>

          <h2>
            {isRegister
              ? "Register"
              : "Login"}
          </h2>

          <input
            placeholder="Username"

            value={username}

            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <input
            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {isRegister ? (

            <button
              onClick={
                handleRegister
              }
            >
              Register
            </button>

          ) : (

            <button
              onClick={
                handleLogin
              }
            >
              Login
            </button>

          )}

          <p
            style={{
              cursor: "pointer",
              marginTop: "15px",
              color: "#2563eb",
              fontWeight: "bold",
            }}

            onClick={() =>
              setIsRegister(
                !isRegister
              )
            }
          >

            {isRegister

              ? "Already have account? Login"

              : "Create New Account"}

          </p>

          <p
            style={{
              marginTop: "10px",
              color: "gray",
            }}
          >
  
          </p>

        </div>

      </div>

      <ToastContainer />

    </>
  );
}
  return (

    <>
      <div
  className={
    darkMode
      ? "main dark"
      : "main"
  }
>

        <Sidebar

          dashboardRef={
            dashboardRef
          }

          productsRef={
            productsRef
          }

          customersRef={
            customersRef
          }

          salesRef={salesRef}

        />

        <div className="content">

          {/* NAVBAR */}

          <div className="navbar">

            <h1>
              ERP Dashboard
            </h1>
<div>

  <button
    onClick={() =>
      setDarkMode(
        !darkMode
      )
    }

    style={{
      marginRight: "10px",
    }}
  >

   {darkMode
  ? "☀️"
  : "🌙"}

  </button>

  Welcome,
  {" "}
  {username}

  <button
    onClick={
      handleLogout
    }
  >
    Logout
  </button>

</div>

          </div>

          {/* DASHBOARD */}

          <div
            ref={dashboardRef}

            className="cards"
          >

            <div className="card green">

              <h2>
                Products
              </h2>

              <h1>
                {products.length}
              </h1>

            </div>

            <div className="card blue">

              <h2>
                Customers
              </h2>

              <h1>
                {customers.length}
              </h1>

            </div>

            <div className="card red">

              <h2>
                Sales
              </h2>

              <h1>

                ₹{
                  sales.reduce(
                    (
                      total,
                      sale
                    ) =>

                      total +
                      sale.total,

                    0
                  )
                }

              </h1>

            </div>

            <div className="card orange">

              <h2>
                Low Stock
              </h2>

              <h1>

                {
                  products.filter(
                    (product) =>

                      Number(
                        product.stock
                      ) < 5
                  ).length
                }

              </h1>

            </div>

          </div>
          <div className="chart-box">

  <h2>
    Sales Overview
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >

    <BarChart
      data={products}
    >

      <XAxis
        dataKey="name"
      />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="stock"
        fill="#2563eb"
      />

    </BarChart>

  </ResponsiveContainer>

</div>

          {/* PRODUCTS */}

          <div
            ref={productsRef}

            className="box"
          >

            <h2>
              Products
            </h2>

            <input
              placeholder="Search Product"

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <div className="form-row">

              <input
                placeholder="Product Name"

                value={productName}

                onChange={(e) =>
                  setProductName(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Price"

                value={price}

                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Stock"

                value={stock}

                onChange={(e) =>
                  setStock(
                    e.target.value
                  )
                }
              />
<select

  value={category}

  onChange={(e) =>
    setCategory(
      e.target.value
    )
  }
>

  <option value="">
    Select Category
  </option>

  <option>
    Electronics
  </option>

  <option>
    Accessories
  </option>


  <option>
    others
  </option>

</select>
              <button
                onClick={
                  addProduct
                }
              >
                Add Product
              </button>

            </div>

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Name</th>

                  <th>Price</th>

                  <th>Stock</th>

                  <th> Category</th>

                  <th> Alert</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {products

                  .filter((product) =>

                    product.name
                      .toLowerCase()

                      .includes(
                        search.toLowerCase()
                      )
                  )

                  .map((product) => (
<tr key={product.id}>

  <td>{product.id}</td>

  {/* NAME */}
  <td>

    {editingId === product.id ? (

      <input
        value={editName}
        onChange={(e) =>
          setEditName(e.target.value)
        }
      />

    ) : (

      product.name

    )}

  </td>

  {/* PRICE */}
  <td>

    {editingId === product.id ? (

      <input
        value={editPrice}
        onChange={(e) =>
          setEditPrice(e.target.value)
        }
      />

    ) : (

      `₹${product.price}`

    )}

  </td>

  {/* STOCK */}
  <td>

    {editingId === product.id ? (

      <input
        value={editStock}
        onChange={(e) =>
          setEditStock(e.target.value)
        }
      />

    ) : (

      product.stock

    )}

  </td>

  {/* CATEGORY */}
  <td>

    {product.category}

  </td>

  {/* ALERT */}
  <td>

    {product.stock < 5 && (

      <span
        className="warning-text"
        style={{
          color: "red",
          fontWeight: "bold",
        }}
      >
        ⚠ Low Stock
      </span>

    )}

  </td>

  {/* ACTION */}
  <td>

    {editingId === product.id ? (

      <button onClick={saveEdit}>
        Save
      </button>

    ) : (

      <button
        onClick={() =>
          startEdit(product)
        }
      >
        Edit
      </button>

    )}

    <button
      className="delete-btn"
      onClick={() =>
        deleteProduct(product.id)
      }
    >
      Delete
    </button>

  </td>

</tr>
                  ))}

              </tbody>

            </table>

          </div>

          {/* CUSTOMERS */}

          <div
            ref={customersRef}

            className="box"
          >

            <h2>
              Customers
            </h2>

            <div className="form-row">

              <input
                placeholder="Customer Name"

                value={customerName}

                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Phone"

                value={phone}

                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
              />
               <input
    placeholder="Email"

    value={email}

    onChange={(e) =>
      setEmail(
        e.target.value
      )
    }
  />

              <button
                onClick={addCustomer}
              >
                Add Customer
              </button>

            </div>

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Name</th>

                  <th>Phone</th>

                  <th>Email</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {customers.map(
                  (customer) => (

                    <tr
                      key={
                        customer.id
                      }
                    >

                      <td>
                        {customer.id}
                      </td>

                      <td>
                        {customer.name}
                      </td>

                      <td>
                        {customer.phone}
                      </td>
                      
                      <td>
  {customer.email}
</td>
                      <td>

                        <button
                          className="delete-btn"

                          onClick={() =>
                            deleteCustomer(
                              customer.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* SALES */}

          <div
            ref={salesRef}

            className="box"
          >

            <h2>
              Sales
            </h2>

            <div className="form-row">
<select

  value={
    selectedCustomer
  }

  onChange={(e) =>
    setSelectedCustomer(
      e.target.value
    )
  }
>

  <option value="">
    Select Customer
  </option>

  {customers.map(
    (customer) => (

      <option
        key={customer.id}

        value={customer.name}
      >
        {customer.name}
      </option>
    )
  )}

</select>
              <select
                value={
                  selectedProduct
                }

                onChange={(e) =>
                  setSelectedProduct(
                    e.target.value
                  )
                }
              >

                <option>
                  Select Product
                </option>

                {products.map(
                  (product) => (

                    <option
                      key={
                        product.id
                      }

                      value={
                        product.name
                      }
                    >
                      {product.name}
                    </option>
                  )
                )}

              </select>

              <input
                placeholder="Quantity"

                value={quantity}

                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
              />

              <button
                onClick={addSale}
              >
                Add Sale
              </button>

            </div>

            <table>

              <thead>

                <tr>

  <th>ID</th>

  <th>Customer</th>

  <th>Product</th>

  <th>Quantity</th>

  <th>Subtotal</th>

  <th>GST</th>

  <th>Total</th>

  <th>Invoice</th>

</tr>

              </thead>

              <tbody>

               {sales.map(
  (sale) => (
<tr
  key={sale.id}
>

  <td>
    {sale.id}
  </td>

  <td>
    {sale.customer}
  </td>

  <td>
    {sale.product}
  </td>

  <td>
    {sale.quantity}
  </td>

  <td>
    ₹{sale.subtotal}
  </td>

  <td>
    ₹{sale.gst}
  </td>

  <td>
    ₹{sale.total}
  </td>

  <td>

    <button
      onClick={() =>
        downloadInvoice(sale)
      }
    >
      Invoice
    </button>

  </td>

</tr>
  )
)}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      <ToastContainer />

    </>
  );
}

export default App;