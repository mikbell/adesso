import React from 'react';
import { FaEuroSign, FaUsers, FaShoppingCart } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import Message from '../../components/shared/Message'; // Assicurati che questo percorso sia corretto
import DashboardCard from '../../components/shared/DashboardCard'; // <-- Importa il nuovo componente
import OrdersTable from '../../components/tables/OrdersTable';

const AdminDashboard = () => {

    const cards = [
        {
            title: "Vendite",
            value: 0,
            icon: <FaEuroSign />,
            bgColorClass: "bg-green-500"
        },
        {
            title: "Ordini",
            value: 0,
            icon: <FaShoppingCart />,
            bgColorClass: "bg-blue-500"
        },
        {
            title: "Venditori",
            value: 0,
            icon: <FaUsers />,
            bgColorClass: "bg-yellow-500"
        },
        {
            title: "Prodotti",
            value: 0,
            icon: <AiFillProduct />,
            bgColorClass: "bg-red-500"
        }
    ]

    const state = {
        series: [
            {
                name: "Ordini",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            },
            {
                name: "Vendite",
                data: [130, 38, 13, 56, 77, 88, 99, 77, 45]
            },
            {
                name: "Venditori",
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

    const recentMessages = [
        {
            id: 1,
            sender: 'John Doe',
            message: 'Ciao, ho bisogno di assistenza con il mio ultimo ordine (#12345).',
            time: '2 minuti fa',
            avatar: 'https://i.pravatar.cc/300?img=1'
        },
        {
            id: 2,
            sender: 'Jane Smith',
            message: 'Vorrei un aggiornamento sullo stato della consegna del prodotto X.',
            time: '1 ora fa',
            avatar: 'https://i.pravatar.cc/300?img=2'
        },
        {
            id: 3,
            sender: 'Luca Rossi',
            message: 'La funzionalità Y non sembra funzionare correttamente, potete controllare?',
            time: '3 ore fa',
            avatar: 'https://i.pravatar.cc/300?img=3'
        },
        {
            id: 4,
            sender: 'Maria Bianchi',
            message: 'Ottimo servizio! Grazie mille per l\'aiuto.',
            time: 'Ieri',
            avatar: 'https://i.pravatar.cc/300?img=4'
        }
    ];

    const orders = [
        {
            id: '#12345',
            product: 'Smartphone X',
            status: 'Consegnato',
            price: '€599.00',
            date: '2024-06-20'
        },
        {
            id: '#12346',
            product: 'Smartwatch Y',
            status: 'In transito',
            price: '€199.50',
            date: '2024-06-19'
        },
        {
            id: '#12347',
            product: 'Cuffie Bluetooth',
            status: 'In attesa',
            price: '€75.00',
            date: '2024-06-18'
        },
        {
            id: '#12348',
            product: 'Laptop Z',
            status: 'Annullato',
            price: '€1200.00',
            date: '2024-06-17'
        },
        {
            id: '#12349',
            product: 'Mouse Wireless',
            status: 'Consegnato',
            price: '€25.99',
            date: '2024-06-16'
        },
        {
            id: '#12350',
            product: 'Tastiera Meccanica',
            status: 'In transito',
            price: '€89.99',
            date: '2024-06-15'
        }
    ];

    return (
        <div className='px-4 md:px-7 py-5'>

            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6 lg:mb-0">
                    <div className="flex justify-between mb-4">
                        <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {cards.map((card, index) => (
                    <DashboardCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        bgColorClass={card.bgColorClass}
                    />
                ))}
            </div>

            {/* Chart and Recent Orders/Customers Section */}
            <div className="w-full flex flex-wrap -mx-3">
                {/* Chart Section */}
                <div className="w-full lg:w-7/12 px-3 mb-6 lg:mb-0">
                    <div className="w-full p-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Panoramica Vendite e Ordini</h3>
                        <Chart
                            options={state.options}
                            series={state.series}
                            type="bar"
                            height={350}
                        />
                    </div>
                </div>

                {/* Recent Messages Section (Right Section) */}
                <div className="w-full lg:w-5/12 px-3">
                    <div className="w-full p-4 bg-white rounded-lg shadow-md min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Messaggi Recenti</h3>
                            <Link to="/messages" className='text-sm text-indigo-600 hover:text-indigo-800 transition-colors'>Mostra Tutti</Link>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                            {recentMessages.map(message => (
                                <Message key={message.id} message={message} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <OrdersTable orders={orders} title="Ordini Recenti" showViewAllLink={true} />
            </div>

        </div>
    );
}

export default AdminDashboard;