import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { FaEuroSign, FaUsers, FaShoppingCart } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";

// Componenti e Azioni
import { DashboardCard, Message, OrdersTable, LoadingPage } from '@adesso/ui-components';
import { getSellerDashboardData } from '@adesso/core-logic';

const SellerDashboard = () => {

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { dashboardData, loader } = useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(getSellerDashboardData());
    }, [dispatch]);

    if (loader) {
        return <LoadingPage />;
    }

    const cards = [
        { title: "Vendite", value: `€${dashboardData.totalSales.toFixed(2)}`, icon: <FaEuroSign />, bgColorClass: "bg-green-500" },
        { title: "Prodotti", value: dashboardData.totalProducts, icon: <AiFillProduct />, bgColorClass: "bg-blue-500" },
        { title: "Ordini Totali", value: dashboardData.totalOrders, icon: <FaShoppingCart />, bgColorClass: "bg-yellow-500" },
        { title: "Ordini in Sospeso", value: dashboardData.pendingOrders, icon: <FaUsers />, bgColorClass: "bg-red-500" }
    ];

    const chartState = {
        series: [
            {
                name: "Ordini",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            },
            {
                name: "Guadagno",
                data: [130, 38, 13, 56, 77, 88, 99, 77, 45]
            },
            {
                name: "Vendite",
                data: [10, 34, 13, 56, 77, 88, 99, 77, 45]
            }
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                toolbar: {
                    show: false
                },
                fontFamily: 'Poppins, sans-serif',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded",
                    borderRadius: 8
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
            },
            xaxis: {
                categories: [
                    "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"
                ],
                labels: {
                    style: {
                        colors: '#787878',
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                title: {
                    text: "Valore (€)",
                    style: {
                        color: '#787878',
                        fontSize: '14px',
                        fontWeight: 600
                    }
                },
                labels: {
                    style: {
                        colors: '#787878',
                        fontSize: '12px'
                    }
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "€ " + val
                    }
                }
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5,
                labels: {
                    colors: '#333'
                }
            },
            colors: ['#6366f1', '#ef4444', '#22c55e']
        }
    };

    return (
        <div className='px-4 md:px-7 py-5'>
            <h1 className='text-2xl font-bold mb-6'>Dashboard di {userInfo?.name}</h1>

            {/* Cards Section */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => <DashboardCard key={index} {...card} />)}
            </div>

            {/* Chart and Recent Messages Section */}
            <div className="w-full flex flex-wrap -mx-3 mb-8">
                <div className="w-full lg:w-7/12 px-3 mb-6 lg:mb-0">
                    <div className="w-full p-4 bg-white rounded-lg shadow-md">
                        <Chart options={chartState.options} series={chartState.series} type="bar" height={350} />
                    </div>
                </div>
                <div className="w-full lg:w-5/12 px-3">
                    <div className="w-full p-4 bg-white rounded-lg shadow-md min-h-[400px]">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Messaggi Recenti</h3>
                        {dashboardData.recentMessages.length > 0 ? (
                            dashboardData.recentMessages.map(msg => <Message key={msg.id} message={msg} />)
                        ) : (
                            <p className="text-center text-gray-500 pt-10">Nessun messaggio recente.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <OrdersTable orders={dashboardData.recentOrders} title="Ordini Recenti" showViewAllLink={true} />
        </div>
    );
}

export default SellerDashboard;