April 21
-- Installed mongoose 
-- Connected to Monodb databas
-- call the connectDB function and connect to db before listning to the server om 3000 


User
 ├── Wishlist → Products
 ├── Cart → Cart Model
 └── Orders → Order Model

Products
 ├── Category → Category
 ├── Attributes → Attribute + AttributeValue
 └── Reviews

Category
 └── Parent Category (self reference)

Attribute
 └── Attribute Values

AttributeValue
 └── Used inside Products