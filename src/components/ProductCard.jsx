function ProductCard({ producto }) {
  return (
    <div className="w-72 p-3 bg-white rounded-xl shadow-md">
      <div className="w-full h-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 flex items-center justify-center">
        <span className="text-sm text-gray-500">{producto.title}</span>
      </div>
      <h3 className="font-bold text-lg mb-2">{producto.title}</h3>
      {producto.price > 0 && <p className="text-2xl font-bold text-green-600 mb-3">${producto.price}</p>}
      
      <div className="space-y-2">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium">
          💰 Comprar
        </button>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg font-medium">
          🔄 Permutar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;