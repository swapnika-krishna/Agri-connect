import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { marketService, MarketFiltersResponse } from '../../services/marketService';
import { MandiPrice } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { DataTable, Column } from '../../components/common/DataTable';
import { Pagination } from '../../components/common/Pagination';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const MarketPricesPage: React.FC = () => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [filters, setFilters] = useState<MarketFiltersResponse>({
    states: [],
    commodities: [],
    markets: [],
  });
  const [isSampleData, setIsSampleData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Filter and search state
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting & pagination
  const [sortColumn, setSortColumn] = useState<string>('modalPrice');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    loadFiltersAndPrices();
  }, []);

  const loadFiltersAndPrices = async () => {
    setIsLoading(true);
    try {
      const [filterData, priceRes] = await Promise.all([
        marketService.getFilters(),
        marketService.getPrices(),
      ]);
      setFilters(filterData);
      setPrices(priceRes.data);
      setIsSampleData(priceRes.isSampleData);
    } catch (err) {
      console.error('Failed to load market prices', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...prices];

    if (selectedState !== 'All') {
      result = result.filter((p) => p.state === selectedState);
    }
    if (selectedCommodity !== 'All') {
      result = result.filter((p) => p.commodity === selectedCommodity);
    }
    if (selectedMarket !== 'All') {
      result = result.filter((p) => p.market.includes(selectedMarket));
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.commodity.toLowerCase().includes(term) ||
          p.market.toLowerCase().includes(term) ||
          p.variety.toLowerCase().includes(term) ||
          p.district.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = (a as any)[sortColumn];
      let bVal = (b as any)[sortColumn];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [prices, selectedState, selectedCommodity, selectedMarket, searchTerm, sortColumn, sortDirection]);

  // Paginated chunk
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colKey);
      setSortDirection('desc');
    }
  };

  // Chart data: compare prices for active commodity across mandis
  const activeCommodityForChart =
    selectedCommodity !== 'All'
      ? selectedCommodity
      : filteredData.length > 0
      ? filteredData[0].commodity
      : 'Wheat';

  const chartData = useMemo(() => {
    const commodityEntries = prices.filter((p) => p.commodity === activeCommodityForChart);
    return commodityEntries.map((p) => ({
      market: p.market.split('(')[0].trim(),
      modalPrice: p.modalPrice,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      state: p.state,
    }));
  }, [prices, activeCommodityForChart]);

  const columns: Column<MandiPrice>[] = [
    {
      header: 'Commodity',
      accessorKey: 'commodity',
      sortable: true,
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.commodity}</span>
          <span className="text-[11px] text-slate-500">{item.variety}</span>
        </div>
      ),
    },
    {
      header: 'Mandi / Market',
      accessorKey: 'market',
      sortable: true,
      cell: (item) => (
        <div>
          <span className="text-slate-900 font-medium block">{item.market}</span>
          <span className="text-[11px] text-slate-500">
            {item.district}, {item.state}
          </span>
        </div>
      ),
    },
    {
      header: 'Arrival Date',
      accessorKey: 'arrivalDate',
      sortable: true,
      cell: (item) => <span className="text-xs text-slate-600">{item.arrivalDate}</span>,
    },
    {
      header: 'Min Price',
      accessorKey: 'minPrice',
      align: 'right',
      sortable: true,
      cell: (item) => (
        <span className="text-slate-600 tabular-nums">₹{item.minPrice.toLocaleString('en-IN')}</span>
      ),
    },
    {
      header: 'Max Price',
      accessorKey: 'maxPrice',
      align: 'right',
      sortable: true,
      cell: (item) => (
        <span className="text-slate-600 tabular-nums">₹{item.maxPrice.toLocaleString('en-IN')}</span>
      ),
    },
    {
      header: 'Modal Price (₹/Qtl)',
      accessorKey: 'modalPrice',
      align: 'right',
      sortable: true,
      cell: (item) => (
        <span className="text-sm font-bold text-emerald-800 tabular-nums">
          ₹{item.modalPrice.toLocaleString('en-IN')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agmarknet Mandi Commodity Rates"
        description="Daily agricultural market arrivals, minimum, maximum, and modal wholesale rates per quintal."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Mandi Market Prices' },
        ]}
        action={
          isSampleData ? (
            <Badge variant="warning" dot>
              Sample Agmarknet Data
            </Badge>
          ) : (
            <Badge variant="success" dot>
              Live data.gov.in Feed
            </Badge>
          )
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search commodity or mandi..."
              className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Indian States</option>
              {filters.states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Commodity Filter */}
          <div>
            <select
              value={selectedCommodity}
              onChange={(e) => {
                setSelectedCommodity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Commodities</option>
              {filters.commodities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCommodity('All');
                setSelectedMarket('All');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-xs px-3 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg w-full transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Price Comparison Bar Chart */}
      {chartData.length > 0 && (
        <Card
          header={
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Price Spread Across Mandis for {activeCommodityForChart}
                </span>
                <span className="text-[11px] text-slate-500">
                  Modal wholesale rate comparison (₹ per Quintal)
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {filters.commodities.slice(0, 5).map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedCommodity(crop)}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                      activeCommodityForChart === crop
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="market" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis unit="₹" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}/Qtl`, 'Modal Rate']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="modalPrice" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#059669" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Main Table */}
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={paginatedData}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No mandi prices matching the specified filter criteria."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={filteredData.length}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};
