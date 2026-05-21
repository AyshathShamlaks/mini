from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DATABASE
conn = sqlite3.connect(
    "erp.db",
    check_same_thread=False
)

cursor = conn.cursor()

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER,
        stock INTEGER,
        category TEXT
    )
    """
)

conn.commit()

# MODEL
class Product(BaseModel):

    name: str
    price: int
    stock: int
    category: str

# HOME
@app.get("/")
def home():

    return {
        "message":
        "Mini ERP Backend Running"
    }

# GET PRODUCTS
@app.get("/products")
def get_products():

    cursor.execute(
        "SELECT * FROM products"
    )

    data = cursor.fetchall()

    products = []

    for product in data:

        products.append({

            "id": product[0],
            "name": product[1],
            "price": product[2],
            "stock": product[3],
            "category":product[4],
        })

    return products

# ADD PRODUCT
@app.post("/products")
def add_product(product: Product):

    cursor.execute(

        """
        INSERT INTO products
        (name, price, stock, category)

        VALUES (?, ?, ?,?)
        """,

        (
            product.name,
            product.price,
            product.stock,
            product.category
        )
    )

    conn.commit()

    return {
        "message": "Product Added"
    }

# DELETE PRODUCT
@app.delete("/products/{id}")
def delete_product(id: int):

    cursor.execute(

        "DELETE FROM products WHERE id=?",

        (id,)
    )

    conn.commit()

    return {
        "message":
        "Product Deleted"
    }