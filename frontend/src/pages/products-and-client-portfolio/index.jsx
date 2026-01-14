import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../../services/productService';
import { clientService } from '../../services/clientService';
import { dashboardService } from '../../services/dashboardService';
import socketService from '../../services/socketService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import ProductCard from './components/ProductCard';
import ProductTableRow from './components/ProductTableRow';
import ClientTableRow from './components/ClientTableRow';
import FilterToolbar from './components/FilterToolbar';
import ProductFilterToolbar from './components/ProductFilterToolbar';
import BulkOperationsBar from './components/BulkOperationsBar';
import ClientDetailsModal from './components/ClientDetailsModal';
import ProductCreationModal from './components/ProductCreationModal';
import ProductEditModal from './components/ProductEditModal';
import ClientCreationModal from './components/ClientCreationModal';
import ClientEditModal from './components/ClientEditModal';
import ActivityLogSidebar from './components/ActivityLogSidebar';
import DashboardMetricsCards from './components/DashboardMetricsCards';
import ProductCardList from './components/ProductCardList';
import ClientsByProductTable from './components/ClientsByProductTable';
import * as XLSX from 'xlsx';

const ProductsAndClientPortfolio = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // products, clients, dashboard
  const [selectedClients, setSelectedClients] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isClientEditModalOpen, setIsClientEditModalOpen] = useState(false);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState(null);
  const [productFilters, setProductFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });
  const [filters, setFilters] = useState({
    healthScore: 'all',
    tier: 'all',
    mrrRange: 'all',
    search: ''
  });
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [productSortConfig, setProductSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard states
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [dashboardProducts, setDashboardProducts] = useState([]);
  const [selectedDashboardProduct, setSelectedDashboardProduct] = useState(null);
  const [selectedProductClients, setSelectedProductClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsData, clientsData] = await Promise.all([
          productService.getAll(),
          clientService.getAll()
        ]);

        setProducts(productsData.data || []);
        setClients(clientsData.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setProducts([]);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socketService.connect();

    const handleProductCreated = (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
    };

    const handleProductUpdated = (updatedProduct) => {
      setProducts((prev) => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleClientCreated = (newClient) => {
      setClients((prev) => [newClient, ...prev]);
    };

    const handleClientUpdated = (updatedClient) => {
      setClients((prev) => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    };

    socketService.on('product:created', handleProductCreated);
    socketService.on('product:updated', handleProductUpdated);
    socketService.on('client:created', handleClientCreated);
    socketService.on('client:updated', handleClientUpdated);

    return () => {
      socketService.off('product:created', handleProductCreated);
      socketService.off('product:updated', handleProductUpdated);
      socketService.off('client:created', handleClientCreated);
      socketService.off('client:updated', handleClientUpdated);
    };
  }, []);

  // Fetch dashboard data when dashboard tab is active
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (activeTab === 'dashboard') {
        try {
          const [metricsResult, productsResult] = await Promise.all([
            dashboardService.getMetrics(),
            dashboardService.getProductsWithClients()
          ]);
          setDashboardMetrics(metricsResult.data);
          setDashboardProducts(productsResult.data);
        } catch (error) {
          console.error('Error loading dashboard:', error);
        }
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      // Filtro por búsqueda
      if (productFilters?.search &&
          !product?.name?.toLowerCase()?.includes(productFilters?.search?.toLowerCase()) &&
          !product?.description?.toLowerCase()?.includes(productFilters?.search?.toLowerCase())) {
        return false;
      }

      // Filtro por tipo
      if (productFilters?.type !== 'all' && product?.type !== productFilters?.type) {
        return false;
      }

      // Filtro por estado
      if (productFilters?.status !== 'all' && product?.status !== productFilters?.status) {
        return false;
      }

      return true;
    });
  }, [products, productFilters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    sorted?.sort((a, b) => {
      let aValue = a?.[productSortConfig?.key];
      let bValue = b?.[productSortConfig?.key];

      if (aValue < bValue) {
        return productSortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return productSortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [filteredProducts, productSortConfig]);

  const filteredClients = useMemo(() => {
    return clients?.filter(client => {
      // Búsqueda por nombre o contacto
      if (filters?.search && !client?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
          !client?.contactPerson?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }

      // Filtro por health score
      if (filters?.healthScore !== 'all') {
        if (filters?.healthScore === 'excellent' && client?.healthScore < 80) return false;
        if (filters?.healthScore === 'good' && (client?.healthScore < 60 || client?.healthScore >= 80)) return false;
        if (filters?.healthScore === 'fair' && (client?.healthScore < 40 || client?.healthScore >= 60)) return false;
        if (filters?.healthScore === 'risk' && client?.healthScore >= 40) return false;
      }

      // Filtro por tier
      if (filters?.tier !== 'all' && client?.tier !== filters?.tier) {
        return false;
      }

      // Filtro por rango de MRR
      if (filters?.mrrRange !== 'all') {
        if (filters?.mrrRange === 'high' && client?.mrr <= 10000) return false;
        if (filters?.mrrRange === 'medium' && (client?.mrr < 1000 || client?.mrr > 10000)) return false;
        if (filters?.mrrRange === 'low' && client?.mrr >= 1000) return false;
      }

      return true;
    });
  }, [clients, filters]);

  const sortedClients = useMemo(() => {
    const sorted = [...filteredClients];
    sorted?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'lastActivity') {
        aValue = new Date(aValue)?.getTime();
        bValue = new Date(bValue)?.getTime();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [filteredClients, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(sortedClients?.map(c => c?.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId, checked) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients?.filter(id => id !== clientId));
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedClients([]);
  };

  const handleProductFilterChange = (newFilters) => {
    setProductFilters(newFilters);
  };

  const handleProductSort = (key) => {
    setProductSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRecalculateHealth = () => {
    console.log('Recalculating health for clients:', selectedClients);
    setSelectedClients([]);
  };

  const handleReassignTier = (newTier) => {
    console.log('Reassigning tier to:', newTier, 'for clients:', selectedClients);
    setSelectedClients([]);
  };

  const handleSendCommunication = (type) => {
    console.log('Sending communication type:', type, 'to clients:', selectedClients);
    setSelectedClients([]);
  };

  const handleTierChange = (clientId, newTier) => {
    console.log('Changing tier for client:', clientId, 'to:', newTier);
  };

  const handleNotesChange = (clientId, newNotes) => {
    console.log('Updating notes for client:', clientId, 'to:', newNotes);
  };

  const handleToggleClientStatus = async (clientId, newStatus) => {
    try {
      await clientService.update(clientId, { status: newStatus });
      // Actualizar el estado local
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId ? { ...client, status: newStatus } : client
        )
      );
    } catch (error) {
      console.error('Error toggling client status:', error);
    }
  };

  const handleViewDetails = (clientOrProduct) => {
    // Si es un cliente
    if (clientOrProduct?.mrr !== undefined || clientOrProduct?.tier) {
      const client = clients?.find(c => c?.id === clientOrProduct?.id) || clientOrProduct;
      setSelectedClientDetails(client);
    }
    // Si es un producto
    else {
      setSelectedProduct(clientOrProduct);
      setIsProductEditModalOpen(true);
    }
  };

  const handleEditClient = (client) => {
    setSelectedClientForEdit(client);
    setIsClientEditModalOpen(true);
  };

  const handleSaveClientEdit = async (clientId, updatedData) => {
    try {
      await clientService.update(clientId, updatedData);
      // Actualizar el cliente en el estado local
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId ? { ...client, ...updatedData } : client
        )
      );
      setIsClientEditModalOpen(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleViewRoadmap = (productId) => {
    console.log('Viewing roadmap for product:', productId);
  };

  const handleViewClients = (productId) => {
    const product = products?.find(p => p?.id === productId);
    setFilters({ ...filters, search: product?.name });
  };

  const handleCreateProduct = async (productData) => {
    try {
      const result = await productService.create(productData);
      if (result.success) {
        setProducts([result.data, ...products]);
        setIsProductModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      const result = await productService.update(productData.id, productData);
      if (result.success) {
        setProducts(products.map(p => p.id === productData.id ? result.data : p));
        setIsProductEditModalOpen(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleProductStatus = async (productId, newStatus) => {
    try {
      const result = await productService.update(productId, { status: newStatus });
      if (result.success) {
        setProducts(products.map(p => p.id === productId ? result.data : p));
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      alert('Error al cambiar el estado: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateClient = async (clientData) => {
    try {
      const result = await clientService.create(clientData);
      if (result.success) {
        setClients([result.data, ...clients]);
        setIsClientModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error al crear el cliente: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleExportToExcel = () => {
    try {
      // Preparar los datos para exportar
      const exportData = sortedClients.map(client => ({
        'Nombre': client.name || '',
        'NIT': client.nit || '',
        'Email': client.email || '',
        'Persona de Contacto': client.contactPerson || '',
        'Teléfono': client.phone || '',
        'Sitio Web': client.website || '',
        'Dirección': client.address || '',
        'Ciudad': client.city || '',
        'Nivel': client.tier || '',
        'Score de Salud': client.healthScore || 0,
        'MRR': client.mrr || 0,
        'Moneda': client.currency || 'USD',
        'Estado': client.status || '',
        'Productos': Array.isArray(client.products) ? client.products.join(', ') : '',
        'Fecha de Creación': client.createdAt ? new Date(client.createdAt).toLocaleDateString('es-ES') : '',
        'Notas': client.notes || ''
      }));

      // Crear libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 30 }, // Nombre
        { wch: 15 }, // NIT
        { wch: 25 }, // Email
        { wch: 25 }, // Persona de Contacto
        { wch: 15 }, // Teléfono
        { wch: 30 }, // Sitio Web
        { wch: 40 }, // Dirección
        { wch: 20 }, // Ciudad
        { wch: 15 }, // Nivel
        { wch: 15 }, // Score de Salud
        { wch: 12 }, // MRR
        { wch: 10 }, // Moneda
        { wch: 12 }, // Estado
        { wch: 30 }, // Productos
        { wch: 15 }, // Fecha de Creación
        { wch: 50 }  // Notas
      ];
      worksheet['!cols'] = columnWidths;

      // Generar archivo y descargar
      const fileName = `clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar los datos a Excel');
    }
  };

  const handleExportProductsToExcel = () => {
    try {
      // Preparar los datos para exportar
      const exportData = sortedProducts.map(product => ({
        'Nombre': product.name || '',
        'Tipo': product.type === 'PRODUCT' ? 'Producto' : 'Servicio',
        'Descripción': product.description || '',
        'Precio': product.price || 0,
        'Moneda': product.currency || 'USD',
        'Recurrencia': {
          'MONTHLY': 'Mensual',
          'QUARTERLY': 'Trimestral',
          'SEMIANNUAL': 'Semestral',
          'ANNUAL': 'Anual',
          'ONE_TIME': 'Pago Único'
        }[product.recurrence] || product.recurrence,
        'Tiene IVA': product.hasVAT ? 'Sí' : 'No',
        'Tasa IVA (%)': product.hasVAT ? (product.vatRate || 0) : 'N/A',
        'Estado': product.status === 'ACTIVE' ? 'Activo' : 'Inactivo',
        'Fecha de Creación': product.createdAt ? new Date(product.createdAt).toLocaleDateString('es-ES') : ''
      }));

      // Crear libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 30 }, // Nombre
        { wch: 12 }, // Tipo
        { wch: 50 }, // Descripción
        { wch: 12 }, // Precio
        { wch: 10 }, // Moneda
        { wch: 15 }, // Recurrencia
        { wch: 12 }, // Tiene IVA
        { wch: 12 }, // Tasa IVA
        { wch: 12 }, // Estado
        { wch: 15 }  // Fecha de Creación
      ];
      worksheet['!cols'] = columnWidths;

      // Generar archivo y descargar
      const fileName = `productos_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar los datos a Excel');
    }
  };

  const handleProductSelect = async (product) => {
    try {
      setSelectedDashboardProduct(product);
      const result = await dashboardService.getClientsByProduct(product.id);
      setSelectedProductClients(result.data.clients || []);
    } catch (error) {
      console.error('Error loading product clients:', error);
      setSelectedProductClients([]);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ChevronsUpDown';
    return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  const getProductSortIcon = (key) => {
    if (productSortConfig?.key !== key) return 'ChevronsUpDown';
    return productSortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`transition-smooth ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-elevation-1">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                Portafolio de Productos y Clientes
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationCenter />
              <UserProfileHeader />
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <Breadcrumb />

          {/* Tabs Navigation */}
          <div className="border-b border-border mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                  activeTab === 'products'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Package" size={18} />
                  <span>Productos & Servicios</span>
                  <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                    {products?.length || 0}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                  activeTab === 'clients'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={18} />
                  <span>Clientes</span>
                  <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                    {clients?.length || 0}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                  activeTab === 'dashboard'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={18} />
                  <span>Dashboard</span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab: Productos & Servicios */}
          {activeTab === 'products' && (
            <div>
              <ProductFilterToolbar
                onFilterChange={handleProductFilterChange}
                activeFilters={productFilters}
              />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Productos & Servicios ({sortedProducts?.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    onClick={handleExportProductsToExcel}
                  >
                    Exportar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => setIsProductModalOpen(true)}
                  >
                    Nuevo
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <button
                            onClick={() => handleProductSort('name')}
                            className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                          >
                            <span>Nombre</span>
                            <Icon name={getProductSortIcon('name')} size={16} />
                          </button>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <button
                            onClick={() => handleProductSort('type')}
                            className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                          >
                            <span>Tipo</span>
                            <Icon name={getProductSortIcon('type')} size={16} />
                          </button>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <button
                            onClick={() => handleProductSort('price')}
                            className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                          >
                            <span>Precio</span>
                            <Icon name={getProductSortIcon('price')} size={16} />
                          </button>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <span className="text-xs md:text-sm font-caption font-semibold text-foreground">
                            Estado
                          </span>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-center">
                          <span className="text-xs md:text-sm font-caption font-semibold text-foreground">
                            Acciones
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts?.map(product => (
                        <tr key={product?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                          <ProductTableRow
                            product={product}
                            onViewDetails={handleViewDetails}
                            onToggleStatus={handleToggleProductStatus}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {sortedProducts?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Icon name="Package" size={48} className="text-muted-foreground mb-3 opacity-50" />
                    <p className="text-base font-caption text-foreground font-medium mb-1">
                      No se encontraron productos
                    </p>
                    <p className="text-sm font-caption text-muted-foreground text-center">
                      Intenta ajustar los filtros o crear un nuevo producto
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Clientes */}
          {activeTab === 'clients' && (
            <div>
              <FilterToolbar
                onFilterChange={handleFilterChange}
              />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Clientes ({sortedClients?.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    onClick={handleExportToExcel}
                  >
                    Exportar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => setIsClientModalOpen(true)}
                  >
                    Nuevo Cliente
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <Checkbox
                            checked={selectedClients?.length === sortedClients?.length && sortedClients?.length > 0}
                            onChange={(e) => handleSelectAll(e?.target?.checked)}
                            indeterminate={selectedClients?.length > 0 && selectedClients?.length < sortedClients?.length}
                          />
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <button
                            onClick={() => handleSort('name')}
                            className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                          >
                            <span>Cliente</span>
                            <Icon name={getSortIcon('name')} size={16} />
                          </button>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <button
                            onClick={() => handleSort('healthScore')}
                            className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                          >
                            <span>Salud</span>
                            <Icon name={getSortIcon('healthScore')} size={16} />
                          </button>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <span className="text-xs md:text-sm font-caption font-semibold text-foreground">
                            Nivel
                          </span>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <button
                            onClick={() => handleSort('mrr')}
                            className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                          >
                            <span>MRR</span>
                            <Icon name={getSortIcon('mrr')} size={16} />
                          </button>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                          <span className="text-xs md:text-sm font-caption font-semibold text-foreground">
                            Estado
                          </span>
                        </th>
                        <th className="px-3 py-3 md:px-4 md:py-4 text-center">
                          <span className="text-xs md:text-sm font-caption font-semibold text-foreground">
                            Acciones
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedClients?.map(client => (
                        <ClientTableRow
                          key={client?.id}
                          client={client}
                          onTierChange={handleTierChange}
                          onViewDetails={handleViewDetails}
                          onEditClient={handleEditClient}
                          onToggleStatus={handleToggleClientStatus}
                          isSelected={selectedClients?.includes(client?.id)}
                          onSelectChange={handleSelectClient}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {sortedClients?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Icon name="Search" size={48} className="text-muted-foreground mb-3" />
                    <p className="text-base font-caption text-foreground font-medium mb-1">
                      No se encontraron clientes
                    </p>
                    <p className="text-sm font-caption text-muted-foreground text-center">
                      Intenta ajustar los filtros o buscar con otros términos
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <DashboardMetricsCards metrics={dashboardMetrics} />

              {/* Products and Clients Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Products List */}
                <div>
                  <ProductCardList
                    products={dashboardProducts}
                    selectedProductId={selectedDashboardProduct?.id}
                    onProductSelect={handleProductSelect}
                  />
                </div>

                {/* Clients Table */}
                <div>
                  <ClientsByProductTable
                    selectedProduct={selectedDashboardProduct}
                    clients={selectedProductClients}
                  />
                </div>
              </div>
            </div>
          )}
          </main>

          {/* Activity Log Sidebar - Hidden on Dashboard tab */}
          {activeTab !== 'dashboard' && <ActivityLogSidebar />}
        </div>
      </div>
      <BulkOperationsBar
        selectedCount={selectedClients?.length}
        onRecalculateHealth={handleRecalculateHealth}
        onReassignTier={handleReassignTier}
        onSendCommunication={handleSendCommunication}
        onClearSelection={() => setSelectedClients([])}
      />
      {selectedClientDetails && (
        <ClientDetailsModal
          client={selectedClientDetails}
          onClose={() => setSelectedClientDetails(null)}
          onEdit={handleEditClient}
        />
      )}
      <ProductCreationModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleCreateProduct}
      />
      <ProductEditModal
        isOpen={isProductEditModalOpen}
        onClose={() => {
          setIsProductEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleUpdateProduct}
        product={selectedProduct}
      />
      <ClientCreationModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleCreateClient}
        products={products}
      />
      <ClientEditModal
        isOpen={isClientEditModalOpen}
        onClose={() => setIsClientEditModalOpen(false)}
        onSave={handleSaveClientEdit}
        client={selectedClientForEdit}
        products={products}
      />
    </div>
  );
};

export default ProductsAndClientPortfolio;