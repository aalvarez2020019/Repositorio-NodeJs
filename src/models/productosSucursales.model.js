const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosSurcursalesSchema = Schema({

  NombreProductoSucursal: String,
  StockSucursal: Number,
  CantidadVendida: Number,

  idSucursal: { type: Schema.Types.ObjectId, ref: "Sucursales" },

});

module.exports = mongoose.model("ProductosSurcursales", ProductosSurcursalesSchema);