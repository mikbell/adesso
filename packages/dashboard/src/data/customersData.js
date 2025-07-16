export const customersData = [
	{
		id: "cust_001",
		name: "Laura Pausini",
		email: "laura.p@example.com",
		image: "https://picsum.photos/seed/1/40/40",
		isActive: true,
	},
	{
		id: "cust_002",
		name: "Eros Ramazzotti",
		email: "eros.r@example.com",
		image: "https://picsum.photos/seed/2/40/40",
		isActive: false,
	},
	{
		id: "cust_003",
		name: "Giorgia",
		email: "giorgia.t@example.com",
		image: "https://picsum.photos/seed/3/40/40",
		isActive: true,
	},
	{
		id: "cust_004",
		name: "Andrea Bocelli",
		email: "andrea.b@example.com",
		image: "https://picsum.photos/seed/4/40/40",
		isActive: true,
	},
];

export const fetchAllCustomers = () => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(customersData), 300);
	});
};
