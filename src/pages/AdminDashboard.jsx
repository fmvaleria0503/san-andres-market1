import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [data, setData] = useState({ 
        stats: {}, 
        miembros: [], 
        publicidades: [], 
        productosPendientes: [],
        eventos: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/dashboard', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el panel:", error);
            }
        };
        fetchDashboard();
    }, []);

    const handleAprobarProducto = async (id) => {
        try {
            await fetch(`http://localhost:5001/api/admin/productos/${id}/aprobar`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            // Recargar datos
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRechazarProducto = async (id) => {
        try {
            await fetch(`http://localhost:5001/api/admin/productos/${id}/rechazar`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-10">Cargando Panel de Control de San Martín...</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">📍 Panel de Gestión - MarketPin</h1>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'overview' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Resumen
                        </button>
                        <button 
                            onClick={() => setActiveTab('productos')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'productos' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Productos Pendientes ({data.productosPendientes?.length || 0})
                        </button>
                        <button 
                            onClick={() => setActiveTab('publicidades')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'publicidades' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Publicidades
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* TARJETAS DE ESTADÍSTICAS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h3 className="text-gray-500 uppercase text-sm font-bold">Total Publicidades</h3>
                            <p className="text-3xl font-bold">{data.stats.totalPublicidades}</p>
                            <p className="text-sm text-gray-500">Premium: {data.stats.publicidadesPremium || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <h3 className="text-gray-500 uppercase text-sm font-bold">Miembros Activos</h3>
                            <p className="text-3xl font-bold">{data.stats.totalMiembros}</p>
                            <p className="text-sm text-gray-500">Vendedores: {data.stats.totalVendedores || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                            <h3 className="text-gray-500 uppercase text-sm font-bold">Productos Publicados</h3>
                            <p className="text-3xl font-bold">{data.stats.totalProductos}</p>
                            <p className="text-sm text-gray-500">Pendientes: {data.stats.productosPendientes || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                            <h3 className="text-gray-500 uppercase text-sm font-bold">Eventos del Mes</h3>
                            <p className="text-3xl font-bold">{data.stats.eventosMes || 0}</p>
                            <p className="text-sm text-gray-500">Clicks totales: {data.stats.totalClicks || 0}</p>
                        </div>
                    </div>

                    {/* GRÁFICOS DE ESTADÍSTICAS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold mb-4">📊 Actividad Semanal</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Nuevos productos</span>
                                    <span className="font-bold">{data.stats.productosSemana || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Publicidades vistas</span>
                                    <span className="font-bold">{data.stats.impresionesSemana || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Clicks en publicidades</span>
                                    <span className="font-bold">{data.stats.clicksSemana || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold mb-4">⭐ Mejores Vendedores</h3>
                            <div className="space-y-3">
                                {data.stats.topVendedores?.slice(0, 5).map((vendedor, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <img src={vendedor.imagenPerfil || '/default-avatar.png'} 
                                                 alt={vendedor.nombre} 
                                                 className="w-8 h-8 rounded-full" />
                                            <span>{vendedor.nombre}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span>⭐ {vendedor.calificacion?.toFixed(1) || 0}</span>
                                            <span className="text-sm text-gray-500">({vendedor.productosVendidos || 0})</span>
                                        </div>
                                    </div>
                                )) || <p className="text-gray-500">No hay datos disponibles</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'productos' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">📦 Productos Pendientes de Aprobación</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {data.productosPendientes?.map(producto => (
                            <div key={producto._id} className="border rounded-lg p-4 hover:shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{producto.title}</h3>
                                        <p className="text-gray-600">${producto.price}</p>
                                        <p className="text-sm text-gray-500">Vendedor: {producto.vendedor?.nombre}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleAprobarProducto(producto._id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            ✅ Aprobar
                                        </button>
                                        <button 
                                            onClick={() => handleRechazarProducto(producto._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            ❌ Rechazar
                                        </button>
                                    </div>
                                </div>
                                {producto.imgs && producto.imgs.length > 0 && (
                                    <div className="flex space-x-2 overflow-x-auto">
                                        {producto.imgs.map((img, i) => (
                                            <img key={i} src={img} alt={`Producto ${i+1}`} 
                                                 className="w-20 h-20 object-cover rounded" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )) || <p className="text-gray-500">No hay productos pendientes</p>}
                    </div>
                </div>
            )}

            {activeTab === 'publicidades' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">📢 Gestión de Publicidades</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {data.publicidades.map(p => (
                            <div key={p._id} className="flex justify-between items-center p-4 border rounded hover:shadow-sm">
                                <div className="flex items-center space-x-4">
                                    {p.imagenLocal && (
                                        <img src={p.imagenLocal} alt="Local" className="w-16 h-16 object-cover rounded" />
                                    )}
                                    <div>
                                        <p className="font-bold">{p.texto}</p>
                                        <p className="text-sm text-gray-500">
                                            {p.anunciante?.nombre} - {p.zona} 
                                            {p.tipo === 'premium' && <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">PREMIUM</span>}
                                        </p>
                                        <p className="text-xs text-gray-400">👁️ {p.impresiones} | 🖱️ {p.clicks}</p>
                                    </div>
                                </div>
                                <div className="space-x-4">
                                    <button className="bg-green-500 text-white px-4 py-1 rounded">Aprobar</button>
                                    <button className="bg-red-500 text-white px-4 py-1 rounded">Quitar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;