import AdminRoutes from "./adminRoutes";
import SellerRoutes from "./sellerRoutes";

const privateRoutes = [...AdminRoutes, ...SellerRoutes];

export default privateRoutes;