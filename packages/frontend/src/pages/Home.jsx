import Banner from "../components/Banner"
import Categories from "../components/Categories"
import FeaturedProducts from "../components/products/FeaturedProducts"
import Products from "../components/products/Products"

const Home = () => {
    return (
        <div className="w-full">
            <Banner />
            <Categories />
            <FeaturedProducts />
            <div className="w-85% flex flex-wrap mx-auto">
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                    <Products />
                    <Products />
                    <Products />
                </div>
            </div>
        </div>
    )
}

export default Home